#!/usr/bin/env python3
"""
短歌自動タグ付けシステム
"""

import os
import sys
import re
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple
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


class TankaTagger:
    """短歌自動タグ付けクラス"""
    
    def __init__(self):
        """初期化"""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not all([self.supabase_url, self.supabase_service_key]):
            logger.error("必要な環境変数が設定されていません")
            sys.exit(1)
            
        self.supabase: Client = create_client(self.supabase_url, self.supabase_service_key)
        
    def get_tag_dictionary(self) -> List[Dict]:
        """タグ辞書を取得"""
        try:
            response = self.supabase.table('tag_dictionary').select(
                'keyword, match_type, priority, tags(id, name, slug, category)'
            ).order('priority', desc=True).execute()
            
            return response.data or []
        except Exception as e:
            logger.error(f"タグ辞書取得エラー: {e}")
            return []
    
    def extract_keywords_from_tanka(self, tanka_text: str) -> List[str]:
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
    
    def match_keywords(self, tanka_text: str, dictionary: List[Dict]) -> List[Tuple[int, float]]:
        """キーワードマッチングを実行"""
        matches = []
        tanka_keywords = self.extract_keywords_from_tanka(tanka_text)
        
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
    
    def assign_tags_to_tanka(self, tweet_id: int, tag_matches: List[Tuple[int, float]], assigned_by: str = 'auto') -> int:
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
            
            logger.info(f"Tweet ID {tweet_id}: {len(tag_data)}個のタグを割り当て")
            return len(tag_data)
            
        except Exception as e:
            logger.error(f"タグ割り当てエラー (Tweet ID {tweet_id}): {e}")
            return 0
    
    def get_untagged_tanka(self, limit: int = 100) -> List[Dict]:
        """タグが未割り当ての短歌を取得"""
        try:
            # まずタグ付きのtweet_idを取得
            tagged_response = self.supabase.table('tanka_tags').select('tweet_id').execute()
            tagged_ids = [item['tweet_id'] for item in (tagged_response.data or [])]
            
            # タグが付いていない短歌を取得
            if tagged_ids:
                response = self.supabase.table('tanka').select(
                    'tweet_id, tanka, original_text'
                ).not_.in_('tweet_id', tagged_ids).limit(limit).execute()
            else:
                # タグが付いている短歌がない場合は全件取得
                response = self.supabase.table('tanka').select(
                    'tweet_id, tanka, original_text'
                ).limit(limit).execute()
            
            return response.data or []
        except Exception as e:
            logger.error(f"未タグ付け短歌取得エラー: {e}")
            return []
    
    def process_untagged_tanka(self, limit: int = 100) -> Dict:
        """未タグ付けの短歌を処理"""
        try:
            logger.info("自動タグ付け処理を開始")
            
            # タグ辞書を取得
            dictionary = self.get_tag_dictionary()
            if not dictionary:
                logger.error("タグ辞書が空です")
                return {'processed': 0, 'errors': 0}
            
            logger.info(f"タグ辞書: {len(dictionary)}エントリ")
            
            # 未タグ付けの短歌を取得
            untagged_tanka = self.get_untagged_tanka(limit)
            if not untagged_tanka:
                logger.info("未タグ付けの短歌はありません")
                return {'processed': 0, 'errors': 0}
            
            logger.info(f"未タグ付け短歌: {len(untagged_tanka)}件")
            
            processed_count = 0
            error_count = 0
            
            for tanka in untagged_tanka:
                try:
                    tweet_id = tanka['tweet_id']
                    tanka_text = tanka['tanka']
                    
                    # キーワードマッチング
                    matches = self.match_keywords(tanka_text, dictionary)
                    
                    # タグを割り当て
                    assigned_count = self.assign_tags_to_tanka(tweet_id, matches)
                    
                    if assigned_count > 0:
                        processed_count += 1
                        logger.info(f"処理完了: Tweet ID {tweet_id}, タグ数: {assigned_count}")
                    else:
                        logger.info(f"マッチなし: Tweet ID {tweet_id}")
                        
                except Exception as e:
                    error_count += 1
                    logger.error(f"短歌処理エラー (Tweet ID {tanka.get('tweet_id', 'unknown')}): {e}")
            
            logger.info(f"処理完了: {processed_count}件成功, {error_count}件エラー")
            return {'processed': processed_count, 'errors': error_count}
            
        except Exception as e:
            logger.error(f"自動タグ付け処理エラー: {e}")
            return {'processed': 0, 'errors': 1}
    
    def retag_existing_tanka(self, limit: int = 100) -> Dict:
        """既存のタグ付け短歌を再処理"""
        try:
            logger.info("既存タグ再処理を開始")
            
            # タグ辞書を取得
            dictionary = self.get_tag_dictionary()
            if not dictionary:
                logger.error("タグ辞書が空です")
                return {'processed': 0, 'errors': 0}
            
            # 既存のタグ付け短歌を取得
            response = self.supabase.table('tanka').select(
                'tweet_id, tanka, original_text'
            ).limit(limit).execute()
            
            tanka_list = response.data or []
            if not tanka_list:
                logger.info("処理対象の短歌がありません")
                return {'processed': 0, 'errors': 0}
            
            logger.info(f"再処理対象: {len(tanka_list)}件")
            
            processed_count = 0
            error_count = 0
            
            for tanka in tanka_list:
                try:
                    tweet_id = tanka['tweet_id']
                    tanka_text = tanka['tanka']
                    
                    # キーワードマッチング
                    matches = self.match_keywords(tanka_text, dictionary)
                    
                    # タグを再割り当て
                    assigned_count = self.assign_tags_to_tanka(tweet_id, matches, 'auto_retag')
                    
                    if assigned_count > 0:
                        processed_count += 1
                        logger.info(f"再処理完了: Tweet ID {tweet_id}, タグ数: {assigned_count}")
                        
                except Exception as e:
                    error_count += 1
                    logger.error(f"短歌再処理エラー (Tweet ID {tanka.get('tweet_id', 'unknown')}): {e}")
            
            logger.info(f"再処理完了: {processed_count}件成功, {error_count}件エラー")
            return {'processed': processed_count, 'errors': error_count}
            
        except Exception as e:
            logger.error(f"既存タグ再処理エラー: {e}")
            return {'processed': 0, 'errors': 1}
    
    def run(self, mode: str = 'untagged', limit: int = 100):
        """メイン処理を実行"""
        try:
            if mode == 'untagged':
                result = self.process_untagged_tanka(limit)
            elif mode == 'retag':
                result = self.retag_existing_tanka(limit)
            else:
                logger.error(f"無効なモード: {mode}")
                return
            
            logger.info(f"処理結果: {result}")
            
        except Exception as e:
            logger.error(f"処理中にエラーが発生しました: {e}")
            sys.exit(1)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='短歌自動タグ付けシステム')
    parser.add_argument('--mode', choices=['untagged', 'retag'], default='untagged',
                       help='処理モード: untagged=未タグ付けのみ, retag=既存タグ再処理')
    parser.add_argument('--limit', type=int, default=100,
                       help='処理件数の上限')
    
    args = parser.parse_args()
    
    tagger = TankaTagger()
    tagger.run(args.mode, args.limit)
