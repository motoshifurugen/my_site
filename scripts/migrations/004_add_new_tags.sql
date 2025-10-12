-- 新しいタグカテゴリの追加
-- 発言、学校、夜、日常、死、色、酒のカテゴリを追加

-- 新しいテーマタグの挿入
INSERT INTO tags (name, slug, category, description) VALUES
  ('発言', 'hatsugen', 'theme', 'speech, conversation, dialogue'),
  ('学校', 'gakkou', 'theme', 'school, education, students'),
  ('夜', 'yoru', 'theme', 'night, evening'),
  ('日常', 'nichijou', 'theme', 'daily life, routine'),
  ('死', 'shi', 'theme', 'death, mortality'),
  ('色', 'iro', 'theme', 'colors'),
  ('酒', 'sake', 'theme', 'alcohol, drinking')
ON CONFLICT (name) DO NOTHING;

-- 恋タグに「君」と「愛」のキーワードを追加
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '君', 'exact', 100 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'きみ', 'exact', 90 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '愛', 'exact', 100 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'あい', 'exact', 90 FROM tags t WHERE t.name = '恋'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 発言のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '発言', 'exact', 100 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'はつげん', 'exact', 90 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '言う', 'exact', 100 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'いう', 'exact', 90 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '聞く', 'exact', 100 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'きく', 'exact', 90 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '「', 'exact', 100 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '」', 'exact', 100 FROM tags t WHERE t.name = '発言'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 学校のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '学校', 'exact', 100 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'がっこう', 'exact', 90 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '制服', 'exact', 100 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'せいふく', 'exact', 90 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '学生', 'exact', 100 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'がくせい', 'exact', 90 FROM tags t WHERE t.name = '学校'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 夜のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '夜', 'exact', 100 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'よる', 'exact', 90 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '夕', 'exact', 100 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ゆう', 'exact', 90 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '夕方', 'exact', 100 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ゆうがた', 'exact', 90 FROM tags t WHERE t.name = '夜'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 日常のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '日常', 'exact', 100 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'にちじょう', 'exact', 90 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '平日', 'exact', 100 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'へいじつ', 'exact', 90 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '休日', 'exact', 100 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'きゅうじつ', 'exact', 90 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '毎日', 'exact', 100 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'まいにち', 'exact', 90 FROM tags t WHERE t.name = '日常'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 死のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '死', 'exact', 100 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'し', 'exact', 90 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '亡', 'exact', 100 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'な', 'exact', 90 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '逝', 'exact', 100 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'せい', 'exact', 90 FROM tags t WHERE t.name = '死'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 色のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '色', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'いろ', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '白', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'しろ', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '赤', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'あか', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '青', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'あお', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '黒', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'くろ', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '緑', 'exact', 100 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'みどり', 'exact', 90 FROM tags t WHERE t.name = '色'
ON CONFLICT (tag_id, keyword) DO NOTHING;

-- 酒のキーワード
INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '酒', 'exact', 100 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'さけ', 'exact', 90 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ワイン', 'exact', 100 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ハイボール', 'exact', 100 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'ビール', 'exact', 100 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, '日本酒', 'exact', 100 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;

INSERT INTO tag_dictionary (tag_id, keyword, match_type, priority)
SELECT t.id, 'にほんしゅ', 'exact', 90 FROM tags t WHERE t.name = '酒'
ON CONFLICT (tag_id, keyword) DO NOTHING;
