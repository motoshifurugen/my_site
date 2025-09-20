#!/usr/bin/env python3
"""
過去の短歌ツイートを遡って収集するスクリプト（一時的な使用専用）
メインの定期実行には影響しません。
"""

import os
import sys
import time
import logging
from datetime import datetime
from typing import Dict, List, Optional
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


class HistoricalTankaCollector:
    """過去の短歌を収集する専用クラス（一時的な使用）"""
    
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
        """metadataテーブルからsince_idを取得（参考用）"""
        try:
            response = self.supabase.table('metadata').select('value').eq('key', 'since_id').execute()
            if response.data:
                return response.data[0]['value']
            return '1'
        except Exception as e:
            logger.error(f"since_id取得エラー: {e}")
            return '1'
    
    def get_historical_tweet_ids(self, until_id: str = None, max_batches: int = 10) -> List[str]:
        """過去のツイートIDを遡って取得"""
        tweet_ids = []
        next_token = None
        request_count = 0
        
        logger.info(f"過去ツイート収集開始 (until_id: {until_id}, max_batches: {max_batches})")
        
        while request_count < max_batches:
            url = f"https://api.x.com/2/users/{self.x_user_id}/tweets"
            params = {
                'max_results': 100,
                'tweet.fields': 'created_at'
            }
            
            # until_idがある場合は指定（そのIDより古いツイートを取得）
            if until_id and request_count == 0:
                params['until_id'] = until_id
                
            if next_token:
                params['pagination_token'] = next_token
                
            response = self._make_request_with_retry(url, params)
            if not response:
                logger.warning(f"リクエスト失敗。これまでに{len(tweet_ids)}件のツイートIDを取得")
                break
                
            data = response.json()
            if 'data' in data:
                batch_tweets = data['data']
                tweet_ids.extend([tweet['id'] for tweet in batch_tweets])
                logger.info(f"バッチ {request_count + 1}: {len(batch_tweets)}件取得（累計: {len(tweet_ids)}件）")
                
                # 最古のツイートIDを記録（デバッグ用）
                if batch_tweets:
                    oldest_id = batch_tweets[-1]['id']
                    logger.info(f"  最新ID: {batch_tweets[0]['id']}, 最古ID: {oldest_id}")
            else:
                logger.info("これ以上のデータはありません")
                break
                
            # ページングトークンがあれば続行
            if 'meta' in data and 'next_token' in data['meta']:
                next_token = data['meta']['next_token']
                request_count += 1
                time.sleep(1.2)  # レート制限対策
            else:
                logger.info("全てのページを取得完了")
                break
                
        if request_count >= max_batches:
            logger.warning(f"最大バッチ数({max_batches})に達しました")
            
        logger.info(f"過去ツイート収集完了: {len(tweet_ids)}件")
        return tweet_ids
    
    def _make_request_with_retry(self, url: str, params: Dict) -> Optional[requests.Response]:
        """指数バックオフでリトライ付きHTTPリクエスト"""
        max_retries = 5
        base_delay = 2
        
        for attempt in range(max_retries):
            try:
                response = requests.get(url, headers=self.headers, params=params)
                
                if response.status_code == 200:
                    return response
                elif response.status_code == 429:
                    # レート制限
                    delay = base_delay * (2 ** attempt)
                    logger.warning(f"レート制限発生。{delay}秒待機中... (試行 {attempt + 1}/{max_retries})")
                    time.sleep(delay)
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
    
    def fetch_posts_by_ids(self, tweet_ids: List[str]) -> List[Dict]:
        """ツイートIDから投稿内容を取得（100件ずつバッチ処理）"""
        all_tweets = []
        
        # 100件ずつに分割
        for i in range(0, len(tweet_ids), 100):
            batch_ids = tweet_ids[i:i+100]
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
                    
            # バッチ間の短いポーズ
            time.sleep(0.3)
            
        logger.info(f"取得したツイート数: {len(all_tweets)}")
        return all_tweets
    
    def extract_tanka(self, text: str) -> Optional[str]:
        """投稿テキストから短歌を抽出"""
        # #短歌が含まれていない場合はスキップ
        if '#短歌' not in text:
            return None
            
        # 【】がある場合の処理（最後の】を使用）
        import re
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
    
    def run(self, until_id: str = None, max_batches: int = 10) -> None:
        """過去データの収集を実行"""
        try:
            logger.info("=== 過去短歌収集処理を開始 ===")
            logger.info("注意: この処理はsince_idを更新しません（通常の定期実行に影響なし）")
            
            # 現在のsince_idを取得（参考用）
            current_since_id = self.get_since_id()
            logger.info(f"現在のsince_id: {current_since_id}")
            
            # 過去のツイートIDを取得
            tweet_ids = self.get_historical_tweet_ids(until_id, max_batches)
            if not tweet_ids:
                logger.info("取得できる過去ツイートはありませんでした")
                return
            
            # ツイート内容を取得
            tweets = self.fetch_posts_by_ids(tweet_ids)
            if not tweets:
                logger.info("ツイート内容の取得に失敗しました")
                return
            
            # 短歌を抽出してupsert
            upserted_count = self.upsert_tanka(tweets)
            
            logger.info("=== 過去データ収集完了 ===")
            logger.info(f"処理結果: Upserted {upserted_count} rows")
            logger.info(f"since_id: {current_since_id} (変更なし)")
            logger.info("通常の定期実行は影響を受けません")
            
        except Exception as e:
            logger.error(f"過去データ収集中にエラーが発生しました: {e}")
            sys.exit(1)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='過去の短歌ツイートを収集（一時的な使用専用）')
    parser.add_argument('--until-id', type=str, help='この ID より古いツイートを取得（指定しない場合は最新から遡る）')
    parser.add_argument('--max-batches', type=int, default=10, help='最大バッチ数（デフォルト: 10）')
    
    args = parser.parse_args()
    
    collector = HistoricalTankaCollector()
    collector.run(args.until_id, args.max_batches)
