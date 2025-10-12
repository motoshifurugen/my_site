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
            'Content-Type': 'application/json',
            'User-Agent': 'TankaCollector/1.0 (Automated Script)'
        }
        
        # 自動タグ付け機能を初期化
        self.tag_dictionary = self._get_tag_dictionary()
    
    def _get_tag_dictionary(self) -> List[Dict]:
        """タグ辞書を取得"""
        try:
            response = self.supabase.table('tag_dictionary').select(
                'keyword, match_type, priority, tags(id, name, slug, category)'
            ).order('priority', desc=True).execute()
            
            return response.data or []
        except Exception as e:
            logger.error(f"タグ辞書取得エラー: {e}")
            return []
    
    def _extract_keywords_from_tanka(self, tanka_text: str) -> List[str]:
        """短歌テキストからキーワードを抽出"""
        # 改行を除去して単一の文字列に変換
        text = tanka_text.replace('\n', '').replace('\r', '')
        
        # 基本的なキーワード抽出
        keywords = []
        
        # 1. 完全一致検索用のキーワード
        keywords.append(text)
        
        # 2. 部分文字列検索用のキーワード（2文字以上）
        for i in range(len(text) - 1):
            for j in range(i + 2, min(len(text) + 1, i + 5)):  # 最大4文字まで
                substring = text[i:j]
                if len(substring) >= 2:
                    keywords.append(substring)
        
        # 3. 単語境界での分割（日本語の場合は文字単位）
        words = []
        for char in text:
            if char.strip():
                words.append(char)
        
        keywords.extend(words)
        
        # 4. よく使われる季語・感情語のパターンマッチング
        common_patterns = [
            '春', '夏', '秋', '冬', '花', '月', '風', '雨', '雪', '雲',
            '恋', '愛', '悲', '喜', '楽', '苦', '夢', '希望', '孤独',
            '山', '海', '川', '森', '野', '空', '星', '鳥', '虫'
        ]
        
        for pattern in common_patterns:
            if pattern in text:
                keywords.append(pattern)
        
        return list(set(keywords))  # 重複を除去
    
    def _match_keywords(self, tanka_text: str, dictionary: List[Dict]) -> List[Tuple[int, float]]:
        """キーワードマッチングを実行"""
        matches = []
        tanka_keywords = self._extract_keywords_from_tanka(tanka_text)
        
        for entry in dictionary:
            keyword = entry['keyword']
            match_type = entry['match_type']
            priority = entry['priority']
            tag_id = entry['tags']['id']
            
            score = 0.0
            
            if match_type == 'exact':
                # 完全一致
                if keyword in tanka_text:
                    score = 1.0
            elif match_type == 'lemma':
                # 語幹一致（現在は完全一致と同じ）
                if keyword in tanka_text:
                    score = 0.8
            elif match_type == 'regex':
                # 正規表現一致
                try:
                    if re.search(keyword, tanka_text):
                        score = 0.9
                except re.error:
                    # 正規表現エラーの場合は完全一致でフォールバック
                    if keyword in tanka_text:
                        score = 0.7
            
            # 優先度をスコアに反映
            if score > 0:
                final_score = score * (1 + priority / 1000)  # 優先度を0.001刻みで加算
                matches.append((tag_id, final_score))
        
        # スコアでソート（降順）
        matches.sort(key=lambda x: x[1], reverse=True)
        
        # マッチがない場合、デフォルトタグを追加
        if not matches:
            # 一般的なタグをデフォルトとして追加
            default_tags = [
                ('自然', 0.5),  # 自然タグ
                ('テーマ', 0.3),  # テーマタグ
                ('感情', 0.2)   # 感情タグ
            ]
            
            # デフォルトタグを辞書から検索
            for default_name, default_score in default_tags:
                for entry in dictionary:
                    if entry['tags']['name'] == default_name:
                        matches.append((entry['tags']['id'], default_score))
                        break
        
        return matches
    
    def _assign_tags_to_tanka(self, tweet_id: int, tag_matches: List[Tuple[int, float]], assigned_by: str = 'auto') -> int:
        """短歌にタグを割り当て"""
        try:
            # 既存のタグを削除
            self.supabase.table('tanka_tags').delete().eq('tweet_id', tweet_id).execute()
            
            # 最大3つのタグを選択
            selected_tags = tag_matches[:3]
            
            if not selected_tags:
                return 0
            
            # タグデータを準備
            tag_data = []
            for tag_id, score in selected_tags:
                tag_data.append({
                    'tweet_id': tweet_id,
                    'tag_id': tag_id,
                    'score': score,
                    'assigned_by': assigned_by
                })
            
            # タグを挿入
            response = self.supabase.table('tanka_tags').insert(tag_data).execute()
            
            logger.info(f"Tweet ID {tweet_id}: {len(tag_data)}個のタグを自動割り当て")
            return len(tag_data)
            
        except Exception as e:
            logger.error(f"タグ割り当てエラー (Tweet ID {tweet_id}): {e}")
            return 0
        
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
    
    def get_recent_tweet_ids(self, since_id: str) -> Tuple[List[str], bool]:
        """User Timeline APIから新着ツイートIDを取得（レート制限対応強化）
        
        Returns:
            Tuple[List[str], bool]: (ツイートIDリスト, 成功フラグ)
        """
        tweet_ids = []
        next_token = None
        max_requests = 1  # 月間制限を考慮して、1リクエストのみに制限（最大50件）
        request_count = 0
        success = False
        
        while request_count < max_requests:
            url = f"https://api.x.com/2/users/{self.x_user_id}/tweets"
            params = {
                'max_results': 50,  # 月間制限を考慮して最大50件まで取得
                'since_id': since_id,
                'tweet.fields': 'created_at'
            }
            
            if next_token:
                params['pagination_token'] = next_token
                
            response = self._make_request_with_retry(url, params)
            if not response:
                logger.error(f"リクエスト失敗。これまでに{len(tweet_ids)}件のツイートIDを取得")
                return tweet_ids, False
                
            data = response.json()
            if 'data' in data:
                tweet_ids.extend([tweet['id'] for tweet in data['data']])
                logger.info(f"バッチ {request_count + 1}: {len(data['data'])}件取得（累計: {len(tweet_ids)}件）")
                success = True
                
            # ページングトークンがあれば続行（ただし1リクエスト制限内で）
            if 'meta' in data and 'next_token' in data['meta']:
                next_token = data['meta']['next_token']
                request_count += 1
                # レート制限・IP制限対策をさらに強化（60秒間隔）
                logger.info("レート制限・IP制限対策のため60秒待機中...")
                time.sleep(60)
            else:
                logger.info("全てのページを取得完了")
                break
                
        if request_count >= max_requests:
            logger.warning(f"最大リクエスト数({max_requests})に達しました。一部のツイートは次回実行時に取得されます")
            
        logger.info(f"取得したツイートID数: {len(tweet_ids)}, 成功: {success}")
        return tweet_ids, success
    
    def fetch_posts_by_ids(self, tweet_ids: List[str]) -> Tuple[List[Dict], bool]:
        """ツイートIDから投稿内容を取得（レート制限対応強化）
        
        Returns:
            Tuple[List[Dict], bool]: (ツイートリスト, 成功フラグ)
        """
        all_tweets = []
        success = False
        
        # 50件ずつに分割（月間制限を考慮）
        for i in range(0, len(tweet_ids), 50):
            batch_ids = tweet_ids[i:i+50]
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
                    success = True
                else:
                    logger.warning(f"バッチ {i//50 + 1}: データが空でした")
            else:
                logger.error(f"バッチ {i//50 + 1}: リクエストに失敗しました")
                return all_tweets, False
                    
            # バッチ間の長いポーズ（レート制限・IP制限対策を強化）
            if i + 50 < len(tweet_ids):  # 最後のバッチでない場合のみ待機
                logger.info("レート制限・IP制限対策のため60秒待機中...")
                time.sleep(60)
            
        logger.info(f"取得したツイート数: {len(all_tweets)}, 成功: {success}")
        return all_tweets, success
    
    def _make_request_with_retry(self, url: str, params: Dict) -> Optional[requests.Response]:
        """指数バックオフでリトライ付きHTTPリクエスト（レート制限対応強化）"""
        max_retries = 2  # リトライ回数をさらに削減
        base_delay = 60  # ベース待機時間を大幅に増加（60秒）
        
        for attempt in range(max_retries):
            try:
                logger.info(f"APIリクエスト実行中... (試行 {attempt + 1}/{max_retries})")
                response = requests.get(url, headers=self.headers, params=params)
                
                if response.status_code == 200:
                    logger.info("APIリクエスト成功")
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
                    logger.info(f"エラー後の待機: {delay}秒")
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
        """短歌データをSupabaseにupsertし、自動タグ付けも実行"""
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
            # 短歌データをupsert
            response = self.supabase.table('tanka').upsert(tanka_data).execute()
            logger.info(f"upsert完了: {len(tanka_data)}件")
            
            # 自動タグ付けを実行
            tagged_count = 0
            for tanka_item in tanka_data:
                try:
                    tweet_id = tanka_item['tweet_id']
                    tanka_text = tanka_item['tanka']
                    
                    # キーワードマッチング
                    matches = self._match_keywords(tanka_text, self.tag_dictionary)
                    
                    # タグを割り当て
                    assigned_count = self._assign_tags_to_tanka(tweet_id, matches, 'auto_collect')
                    
                    if assigned_count > 0:
                        tagged_count += 1
                        
                except Exception as e:
                    logger.error(f"自動タグ付けエラー (Tweet ID {tanka_item.get('tweet_id', 'unknown')}): {e}")
            
            logger.info(f"自動タグ付け完了: {tagged_count}/{len(tanka_data)}件")
            return len(tanka_data)
            
        except Exception as e:
            logger.error(f"upsertエラー: {e}")
            raise
    
    def run(self) -> None:
        """メイン処理を実行（月間制限対応）"""
        try:
            logger.info("短歌収集処理を開始")
            logger.info("月間制限: 100件/月（現在200%超過中、10月5日にリセット予定）")
            logger.info("1回の実行で最大50件まで取得します")
            logger.info(f"タグ辞書: {len(self.tag_dictionary)}エントリ")
            
            # since_idを取得
            since_id = self.get_since_id()
            logger.info(f"現在のsince_id: {since_id}")
            
            # 新着ツイートIDを取得
            tweet_ids, ids_success = self.get_recent_tweet_ids(since_id)
            if not ids_success:
                logger.error("ツイートID取得に失敗しました。since_idは更新されません")
                return
                
            if not tweet_ids:
                logger.info("新着ツイートはありませんでした")
                return
            
            # レート制限対策: ツイートID取得とツイート内容取得の間に長いポーズ
            logger.info("レート制限・IP制限対策のため90秒待機中...")
            time.sleep(90)
            
            # ツイート内容を取得
            tweets, tweets_success = self.fetch_posts_by_ids(tweet_ids)
            if not tweets_success:
                logger.error("ツイート内容の取得に失敗しました。since_idは更新されません")
                return
                
            if not tweets:
                logger.warning("ツイート内容が空でした。since_idは更新されません")
                return
            
            # 短歌を抽出してupsert
            upserted_count = self.upsert_tanka(tweets)
            
            # 全ての処理が成功した場合のみsince_idを更新
            max_tweet_id = max(tweet_ids, key=int)
            self.set_since_id(max_tweet_id)
                
            logger.info(f"処理完了 - Upserted {upserted_count} rows. New since_id: {max_tweet_id}")
            
        except Exception as e:
            logger.error(f"処理中にエラーが発生しました: {e}")
            logger.error("エラーが発生したため、since_idは更新されません")
            sys.exit(1)


if __name__ == "__main__":
    collector = TankaCollector()
    collector.run()
