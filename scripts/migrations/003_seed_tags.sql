-- タグ付けシステムのシードデータ
-- 季節語（季語）と感情・テーマタグの基本的な辞書を作成

-- 季節語（季語）タグの挿入
INSERT INTO tags (name, slug, category, description) VALUES
  ('桜', 'sakura', 'kigo', 'cherry blossoms - spring season word'),
  ('雪', 'yuki', 'kigo', 'snow - winter season word'),
  ('梅', 'ume', 'kigo', 'plum blossoms - early spring season word'),
  ('紅葉', 'momiji', 'kigo', 'autumn leaves - autumn season word'),
  ('蝉', 'semi', 'kigo', 'cicada - summer season word'),
  ('月', 'tsuki', 'kigo', 'moon - general season word'),
  ('花', 'hana', 'kigo', 'flowers - general season word'),
  ('風', 'kaze', 'kigo', 'wind - general season word')
ON CONFLICT (name) DO NOTHING;

-- 感情タグの挿入
INSERT INTO tags (name, slug, category, description) VALUES
  ('別れ', 'wakare', 'emotion', 'farewell, parting'),
  ('恋', 'koi', 'emotion', 'love, romance'),
  ('悲しみ', 'kanashimi', 'emotion', 'sadness, sorrow'),
  ('喜び', 'yorokobi', 'emotion', 'joy, happiness'),
  ('孤独', 'kodoku', 'emotion', 'loneliness'),
  ('希望', 'kibou', 'emotion', 'hope, aspiration'),
  ('懐かしさ', 'natsukashisa', 'emotion', 'nostalgia, longing'),
  ('不安', 'fuan', 'emotion', 'anxiety, worry')
ON CONFLICT (name) DO NOTHING;

-- テーマタグの挿入
INSERT INTO tags (name, slug, category, description) VALUES
  ('旅', 'tabi', 'theme', 'travel, journey'),
  ('故郷', 'kokyou', 'theme', 'hometown, homeland'),
  ('家族', 'kazoku', 'theme', 'family'),
  ('友', 'tomo', 'theme', 'friendship'),
  ('夢', 'yume', 'theme', 'dreams, aspirations'),
  ('時間', 'jikan', 'theme', 'time, temporality'),
  ('自然', 'shizen', 'theme', 'nature'),
  ('人生', 'jinsei', 'theme', 'life, human existence')
ON CONFLICT (name) DO NOTHING;

-- 場所タグの挿入
INSERT INTO tags (name, slug, category, description) VALUES
  ('山', 'yama', 'place', 'mountain'),
  ('海', 'umi', 'place', 'sea, ocean'),
  ('川', 'kawa', 'place', 'river'),
  ('森', 'mori', 'place', 'forest'),
  ('街', 'machi', 'place', 'town, city'),
  ('家', 'ie', 'place', 'home, house'),
  ('寺', 'tera', 'place', 'temple'),
  ('橋', 'hashi', 'place', 'bridge')
ON CONFLICT (name) DO NOTHING;

-- タグ辞書のキーワードマッピングを作成
-- 季節語のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '桜', 'exact', 100 FROM tags t WHERE t.name = '桜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'さくら', 'exact', 90 FROM tags t WHERE t.name = '桜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '雪', 'exact', 100 FROM tags t WHERE t.name = '雪'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ゆき', 'exact', 90 FROM tags t WHERE t.name = '雪'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '梅', 'exact', 100 FROM tags t WHERE t.name = '梅'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'うめ', 'exact', 90 FROM tags t WHERE t.name = '梅'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '紅葉', 'exact', 100 FROM tags t WHERE t.name = '紅葉'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'もみじ', 'exact', 90 FROM tags t WHERE t.name = '紅葉'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '蝉', 'exact', 100 FROM tags t WHERE t.name = '蝉'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'せみ', 'exact', 90 FROM tags t WHERE t.name = '蝉'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '月', 'exact', 100 FROM tags t WHERE t.name = '月'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'つき', 'exact', 90 FROM tags t WHERE t.name = '月'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '花', 'exact', 100 FROM tags t WHERE t.name = '花'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'はな', 'exact', 90 FROM tags t WHERE t.name = '花'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '風', 'exact', 100 FROM tags t WHERE t.name = '風'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'かぜ', 'exact', 90 FROM tags t WHERE t.name = '風'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 感情のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '別れ', 'exact', 100 FROM tags t WHERE t.name = '別れ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'わかれ', 'exact', 90 FROM tags t WHERE t.name = '別れ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '恋', 'exact', 100 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'こい', 'exact', 90 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '悲しみ', 'exact', 100 FROM tags t WHERE t.name = '悲しみ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'かなしみ', 'exact', 90 FROM tags t WHERE t.name = '悲しみ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '喜び', 'exact', 100 FROM tags t WHERE t.name = '喜び'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'よろこび', 'exact', 90 FROM tags t WHERE t.name = '喜び'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '孤独', 'exact', 100 FROM tags t WHERE t.name = '孤独'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'こどく', 'exact', 90 FROM tags t WHERE t.name = '孤独'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '希望', 'exact', 100 FROM tags t WHERE t.name = '希望'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'きぼう', 'exact', 90 FROM tags t WHERE t.name = '希望'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '懐かしさ', 'exact', 100 FROM tags t WHERE t.name = '懐かしさ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'なつかしさ', 'exact', 90 FROM tags t WHERE t.name = '懐かしさ'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '不安', 'exact', 100 FROM tags t WHERE t.name = '不安'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ふあん', 'exact', 90 FROM tags t WHERE t.name = '不安'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- テーマのキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '旅', 'exact', 100 FROM tags t WHERE t.name = '旅'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'たび', 'exact', 90 FROM tags t WHERE t.name = '旅'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '故郷', 'exact', 100 FROM tags t WHERE t.name = '故郷'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'こきょう', 'exact', 90 FROM tags t WHERE t.name = '故郷'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '家族', 'exact', 100 FROM tags t WHERE t.name = '家族'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'かぞく', 'exact', 90 FROM tags t WHERE t.name = '家族'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '友', 'exact', 100 FROM tags t WHERE t.name = '友'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'とも', 'exact', 90 FROM tags t WHERE t.name = '友'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '夢', 'exact', 100 FROM tags t WHERE t.name = '夢'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ゆめ', 'exact', 90 FROM tags t WHERE t.name = '夢'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '時間', 'exact', 100 FROM tags t WHERE t.name = '時間'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'じかん', 'exact', 90 FROM tags t WHERE t.name = '時間'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '自然', 'exact', 100 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'しぜん', 'exact', 90 FROM tags t WHERE t.name = '自然'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '人生', 'exact', 100 FROM tags t WHERE t.name = '人生'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'じんせい', 'exact', 90 FROM tags t WHERE t.name = '人生'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 場所のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '山', 'exact', 100 FROM tags t WHERE t.name = '山'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'やま', 'exact', 90 FROM tags t WHERE t.name = '山'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '海', 'exact', 100 FROM tags t WHERE t.name = '海'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'うみ', 'exact', 90 FROM tags t WHERE t.name = '海'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '川', 'exact', 100 FROM tags t WHERE t.name = '川'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'かわ', 'exact', 90 FROM tags t WHERE t.name = '川'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '森', 'exact', 100 FROM tags t WHERE t.name = '森'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'もり', 'exact', 90 FROM tags t WHERE t.name = '森'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '街', 'exact', 100 FROM tags t WHERE t.name = '街'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'まち', 'exact', 90 FROM tags t WHERE t.name = '街'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '家', 'exact', 100 FROM tags t WHERE t.name = '家'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'いえ', 'exact', 90 FROM tags t WHERE t.name = '家'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '寺', 'exact', 100 FROM tags t WHERE t.name = '寺'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'てら', 'exact', 90 FROM tags t WHERE t.name = '寺'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '橋', 'exact', 100 FROM tags t WHERE t.name = '橋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'はし', 'exact', 90 FROM tags t WHERE t.name = '橋'
ON CONFLICT (tag_id, keyword) DO NOTHING;
