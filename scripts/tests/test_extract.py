#!/usr/bin/env python3
"""
短歌抽出関数のテストケース
"""

import unittest
import sys
import os

# テスト対象のモジュールをインポート
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fetch_and_store_tanka_supabase import TankaCollector


class TestTankaExtraction(unittest.TestCase):
    """短歌抽出機能のテストクラス"""
    
    def setUp(self):
        """テスト前の準備"""
        # 環境変数を設定（テスト用ダミー値）
        os.environ.update({
            'X_BEARER_TOKEN': 'dummy_token',
            'X_USER_ID': '123456789',
            'SUPABASE_URL': 'https://dummy.supabase.co',
            'SUPABASE_SERVICE_ROLE_KEY': 'dummy_key'
        })
        self.collector = TankaCollector()
    
    def test_extract_tanka_with_brackets(self):
        """【】がある場合の短歌抽出テスト"""
        text = "今日の短歌です【題：桜】\n春風に\n舞い散る花の\n美しさ\n心に残る\n桜の記憶\n#短歌 #春"
        expected = "春風に\n舞い散る花の\n美しさ\n心に残る\n桜の記憶"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_with_tanka_app(self):
        """#短歌アプリがある場合の短歌抽出テスト"""
        text = "夏祭り\n浴衣姿の\n君と歩く\n花火の音に\n心躍りて / 作者：テストユーザー #短歌アプリ"
        expected = "夏祭り\n浴衣姿の\n君と歩く\n花火の音に\n心躍りて"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_with_tanka_app_no_slash(self):
        """#短歌アプリがあるがスラッシュがない場合のテスト"""
        text = "秋の夜\n虫の声聞く\n静寂かな\n月光浴びて\n心安らぐ #短歌アプリ #秋"
        expected = "秋の夜\n虫の声聞く\n静寂かな\n月光浴びて\n心安らぐ"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_simple(self):
        """シンプルな#短歌投稿のテスト"""
        text = "冬の朝\n霜降りる庭\n静寂なり\n息白く見え\n新たな一日 #短歌"
        expected = "冬の朝\n霜降りる庭\n静寂なり\n息白く見え\n新たな一日"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_with_whitespace(self):
        """前後に空白・改行がある場合のテスト"""
        text = "\n\n  春の雨\n緑萌え出る\n若葉かな\n生命の歌を\n奏でる大地  \n\n#短歌 #春雨"
        expected = "春の雨\n緑萌え出る\n若葉かな\n生命の歌を\n奏でる大地"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_no_tanka_hashtag(self):
        """#短歌がない場合のテスト"""
        text = "今日は良い天気ですね。散歩日和です。"
        result = self.collector.extract_tanka(text)
        self.assertIsNone(result)
    
    def test_extract_tanka_empty_after_extraction(self):
        """抽出結果が空文字列になる場合のテスト"""
        text = "   \n\n  #短歌"
        result = self.collector.extract_tanka(text)
        self.assertIsNone(result)
    
    def test_extract_tanka_brackets_priority(self):
        """【】と#短歌アプリの両方がある場合（【】が優先）のテスト"""
        text = "【お題：海】\n青い海\n波音響く\n砂浜で\n君と過ごした\n夏の思い出 / 作者名 #短歌アプリ #短歌"
        expected = "青い海\n波音響く\n砂浜で\n君と過ごした\n夏の思い出 / 作者名"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_multiple_brackets(self):
        """複数の】がある場合（最後の】を使用）のテスト"""
        text = "【第一回】【お題：雲】\n空高く\n流れる雲を\n見上げつつ\n心も軽やか\n風と共に行く #短歌"
        expected = "空高く\n流れる雲を\n見上げつつ\n心も軽やか\n風と共に行く"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)
    
    def test_extract_tanka_complex_case(self):
        """複雑なケースのテスト"""
        text = "今日の短歌投稿です！\n\n紅葉山\n風に舞い散る\n葉の音色\n季節の移ろい\n感じる午後\n\n#短歌 #紅葉 #秋 #poetry"
        expected = "今日の短歌投稿です！\n\n紅葉山\n風に舞い散る\n葉の音色\n季節の移ろい\n感じる午後"
        result = self.collector.extract_tanka(text)
        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()
