-- タグカテゴリの調整
-- 死タグを削除し、自然タグの優先度を上げる

-- 死タグとその関連データを削除
DELETE FROM tag_dictionary WHERE tag_id IN (SELECT id FROM tags WHERE name = '死');
DELETE FROM tanka_tags WHERE tag_id IN (SELECT id FROM tags WHERE name = '死');
DELETE FROM tags WHERE name = '死';

-- 自然タグの優先度を上げる（既存のキーワードの優先度を調整）
UPDATE tag_dictionary 
SET priority = priority + 50 
WHERE tag_id IN (SELECT id FROM tags WHERE name = '自然');

-- 自然タグに新しいキーワードを追加
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '自然', 'exact', 150 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 150;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'しぜん', 'exact', 140 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 140;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '森', 'exact', 130 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 130;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'もり', 'exact', 120 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 120;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '緑', 'exact', 130 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 130;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'みどり', 'exact', 120 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 120;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '草', 'exact', 120 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 120;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'くさ', 'exact', 110 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 110;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '木', 'exact', 120 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 120;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'き', 'exact', 110 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 110;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '葉', 'exact', 120 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 120;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'は', 'exact', 110 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO UPDATE SET priority = 110;
