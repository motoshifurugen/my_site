-- Issue #159: Supabase の全テーブルで Row Level Security を有効にする
-- anon と authenticated には tanka / tanka_likes / tags の読み取りだけを許す。
-- 書込みのポリシーは置かない。ポリシーが無いことで、書込みを service_role だけに絞る。
--
-- service_role は bypassrls を持ち RLS を素通りするので、既存の API ルートと
-- Python スクリプト（どちらも SUPABASE_SERVICE_ROLE_KEY を使う）の動きは変わらない。
-- 同じ理由で、RLS は service-role 鍵が漏れたときの防御にはならない。
--
-- 何度流しても同じ結果になる。
--
-- 戻すときの SQL:
--   BEGIN;
--   DROP POLICY IF EXISTS tanka_select_public ON tanka;
--   DROP POLICY IF EXISTS tanka_likes_select_public ON tanka_likes;
--   DROP POLICY IF EXISTS tags_select_public ON tags;
--   ALTER TABLE tanka DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE metadata DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tag_dictionary DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_tags DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_embeddings DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_likes DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE api_rate_limits DISABLE ROW LEVEL SECURITY;
--   COMMIT;

BEGIN;

-- 読み取りを許さないテーブルも含めて全テーブルで有効にする。
-- 1つでも RLS の無いテーブルが残ると、grant を持つ anon / authenticated から書き込める。
ALTER TABLE tanka ENABLE ROW LEVEL SECURITY;
ALTER TABLE metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanka_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanka_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanka_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY には IF NOT EXISTS が無いので、何度でも流せるよう先に DROP する。
DROP POLICY IF EXISTS tanka_select_public ON tanka;
CREATE POLICY tanka_select_public ON tanka
    FOR SELECT TO anon, authenticated USING (true);

-- tanka_likes は user_ip 列も読めるようになるため、anon 鍵はフロントで使わない（ARCHITECTURE.md）。
DROP POLICY IF EXISTS tanka_likes_select_public ON tanka_likes;
CREATE POLICY tanka_likes_select_public ON tanka_likes
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS tags_select_public ON tags;
CREATE POLICY tags_select_public ON tags
    FOR SELECT TO anon, authenticated USING (true);

COMMIT;
