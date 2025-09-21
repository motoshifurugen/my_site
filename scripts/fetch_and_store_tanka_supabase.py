#!/usr/bin/env python3
"""
X（旧Twitter）APIから短歌投稿を収集してSupabaseに保存するスクリプト
"""

import os
import re
import sys
import time
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

# ローカル実行時は.envファイルを読み込み
load_dotenv()

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TankaCollector:
    """短歌収集システムのメインクラス"""
    
    def __init__(self):
        """初期化"""
        self.x_bearer_token = os.getenv('X_BEARER_TOKEN')
        self.x_user_id = os.getenv('X_USER_ID')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not all([self.x_bearer_token, self.x_user_id, self.supabase_url, self.supabase_service_key]):
            logger.error("必要な環境変数が設定されていません")
            sys.exit(1)
            
        self.supabase: Client = create_client(self.supabase_url, self.supabase_service_key)
        self.headers = {
            'Authorization': f'Bearer {self.x_bearer_token}',
            'Content-Type': 'application/json'
        }
        
    def get_since_id(self) -> str:
        """metadataテーブルからsince_idを取得"""
        try:
            response = self.supabase.table('metadata').select('value').eq('key', 'since_id').execute()
            if response.data:
                return response.data[0]['value']
            return '1'
        except Exception as e:
            logger.error(f"since_id取得エラー: {e}")
            return '1'
    
    def set_since_id(self, since_id: str) -> None:
        """metadataテーブルのsince_idを更新"""
        try:
            self.supabase.table('metadata').upsert({
                'key': 'since_id',
                'value': since_id,
                'updated_at': datetime.now().isoformat()
            }).execute()
            logger.info(f"since_id更新: {since_id}")
        except Exception as e:
            logger.error(f"since_id更新エラー: {e}")
            raise
    
    def get_recent_tweet_ids(self, since_id: str) -> List[str]:
        """User Timeline APIから新着ツイートIDを取得（レート制限対応）"""
        tweet_ids = []
        next_token = None
        max_requests = 3  # 1日5ツイート程度なので、最大3リクエストに制限
        request_count = 0
        
        while request_count < max_requests:
            url = f"https://api.x.com/2/users/{self.x_user_id}/tweets"
            params = {
                'max_results': 10,  # 一度に取得する件数を大幅に削減
                'since_id': since_id,
                'tweet.fields': 'created_at'
            }
            
            if next_token:
                params['pagination_token'] = next_token
                
            response = self._make_request_with_retry(url, params)
            if not response:
                logger.warning(f"リクエスト失敗。これまでに{len(tweet_ids)}件のツイートIDを取得")
                break
                
            data = response.json()
            if 'data' in data:
                tweet_ids.extend([tweet['id'] for tweet in data['data']])
                logger.info(f"バッチ {request_count + 1}: {len(data['data'])}件取得（累計: {len(tweet_ids)}件）")
                
            # ページングトークンがあれば続行
            if 'meta' in data and 'next_token' in data['meta']:
                next_token = data['meta']['next_token']
                request_count += 1
                time.sleep(5.0)  # レート制限対策を大幅に強化（5秒間隔）
            else:
                logger.info("全てのページを取得完了")
                break
                
        if request_count >= max_requests:
            logger.warning(f"最大リクエスト数({max_requests})に達しました。一部のツイートは次回実行時に取得されます")
            
        logger.info(f"取得したツイートID数: {len(tweet_ids)}")
        return tweet_ids
    
    def fetch_posts_by_ids(self, tweet_ids: List[str]) -> List[Dict]:
        """ツイートIDから投稿内容を取得（レート制限対応）"""
        all_tweets = []
        
        # 10件ずつに分割（レート制限対策）
        for i in range(0, len(tweet_ids), 10):
            batch_ids = tweet_ids[i:i+10]
            url = "https://api.x.com/2/tweets"
            params = {
                'ids': ','.join(batch_ids),
                'tweet.fields': 'created_at,text,author_id'
            }
            
            response = self._make_request_with_retry(url, params)
            if response:
                data = response.json()
                if 'data' in data:
                    all_tweets.extend(data['data'])
                    
            # バッチ間の長いポーズ（レート制限対策）
            time.sleep(2.0)
            
        logger.info(f"取得したツイート数: {len(all_tweets)}")
        return all_tweets
    
    def _make_request_with_retry(self, url: str, params: Dict) -> Optional[requests.Response]:
        """指数バックオフでリトライ付きHTTPリクエスト（レート制限対応強化）"""
        max_retries = 3  # リトライ回数を削減
        base_delay = 10  # ベース待機時間を大幅に増加
        
        for attempt in range(max_retries):
            try:
                response = requests.get(url, headers=self.headers, params=params)
                
                if response.status_code == 200:
                    return response
                elif response.status_code == 429:
                    # レート制限 - より長い待機時間
                    delay = base_delay * (2 ** attempt)
                    logger.warning(f"レート制限発生。{delay}秒待機中... (試行 {attempt + 1}/{max_retries})")
                    time.sleep(delay)
                elif response.status_code == 401:
                    logger.error("認証エラー: Bearer Tokenが無効です")
                    return None
                elif response.status_code == 403:
                    logger.error("アクセス拒否: APIアクセス権限がありません")
                    return None
                else:
                    logger.error(f"HTTPエラー {response.status_code}: {response.text}")
                    return None
                    
            except Exception as e:
                logger.error(f"リクエストエラー: {e}")
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)
                    time.sleep(delay)
                    
        logger.error(f"最大リトライ回数に達しました: {url}")
        return None
    
    def extract_tanka(self, text: str) -> Optional[str]:
        """投稿テキストから短歌を抽出"""
        # #短歌が含まれていない場合はスキップ
        if '#短歌' not in text:
            return None
            
        # 【】がある場合の処理（最後の】を使用）
        bracket_matches = list(re.finditer(r'】', text))
        if bracket_matches:
            start_pos = bracket_matches[-1].end()  # 最後の】の直後
            # 最初の「#」を探す
            hash_match = re.search(r'#', text[start_pos:])
            if hash_match:
                end_pos = start_pos + hash_match.start()
                tanka = text[start_pos:end_pos]
            else:
                tanka = text[start_pos:]
        # #短歌アプリがある場合の処理
        elif '#短歌アプリ' in text:
            # 最初のスラッシュを探す
            slash_match = re.search(r'/', text)
            if slash_match:
                tanka = text[:slash_match.start()]
            else:
                # スラッシュがない場合、最初の「#」の直前まで
                hash_match = re.search(r'#', text)
                if hash_match:
                    tanka = text[:hash_match.start()]
                else:
                    tanka = text
        else:
            # その他の場合、最初の「#」の直前まで
            hash_match = re.search(r'#', text)
            if hash_match:
                tanka = text[:hash_match.start()]
            else:
                tanka = text
            
        # 前後の改行・空白を削除（内部は保持）
        tanka = tanka.strip()
        
        # 空文字列の場合はスキップ
        if not tanka:
            return None
            
        return tanka
    
    def upsert_tanka(self, tweets: List[Dict]) -> int:
        """短歌データをSupabaseにupsert"""
        tanka_data = []
        
        for tweet in tweets:
            tanka = self.extract_tanka(tweet['text'])
            if tanka:
                tanka_data.append({
                    'tweet_id': int(tweet['id']),
                    'author_id': int(tweet['author_id']),
                    'created_at': tweet['created_at'],
                    'original_text': tweet['text'],
                    'tanka': tanka,
                    'extracted_at': datetime.now().isoformat()
                })
        
        if not tanka_data:
            logger.info("upsert対象の短歌データはありませんでした")
            return 0
            
        try:
            response = self.supabase.table('tanka').upsert(tanka_data).execute()
            logger.info(f"upsert完了: {len(tanka_data)}件")
            return len(tanka_data)
        except Exception as e:
            logger.error(f"upsertエラー: {e}")
            raise
    
    def run(self) -> None:
        """メイン処理を実行（レート制限対応）"""
        try:
            logger.info("短歌収集処理を開始")
            
            # since_idを取得
            since_id = self.get_since_id()
            logger.info(f"現在のsince_id: {since_id}")
            
            # 新着ツイートIDを取得
            tweet_ids = self.get_recent_tweet_ids(since_id)
            if not tweet_ids:
                logger.info("新着ツイートはありませんでした")
                return
            
            # 最大のtweet_idを計算（ツイート内容取得の成功/失敗に関わらずsince_idを更新するため）
            max_tweet_id = max(tweet_ids, key=int)
            
            # レート制限対策: ツイートID取得とツイート内容取得の間にポーズ
            logger.info("レート制限対策のため10秒待機中...")
            time.sleep(10)
            
            # ツイート内容を取得
            tweets = self.fetch_posts_by_ids(tweet_ids)
            if not tweets:
                logger.warning("ツイート内容の取得に失敗しましたが、since_idを更新します")
                self.set_since_id(max_tweet_id)
                logger.info(f"処理完了 - Upserted 0 rows. New since_id: {max_tweet_id}")
                return
            
            # 短歌を抽出してupsert
            upserted_count = self.upsert_tanka(tweets)
            
            # since_idを更新
            self.set_since_id(max_tweet_id)
                
            logger.info(f"処理完了 - Upserted {upserted_count} rows. New since_id: {max_tweet_id}")
            
        except Exception as e:
            logger.error(f"処理中にエラーが発生しました: {e}")
            sys.exit(1)


if __name__ == "__main__":
    collector = TankaCollector()
    collector.run()
