-- Issue #159, #292: Supabase の全テーブルで Row Level Security を有効にする
-- anon と authenticated に読み取りを許すのは tanka と tags だけ。
-- tanka_likes は user_ip 列を持つので、anon と authenticated から権限ごと外す（REVOKE）。
-- いいね数は view tanka_like_counts で件数だけを見せる。
-- 書込みのポリシーは置かない。ポリシーが無いことで、書込みを service_role だけに絞る。
--
-- service_role は bypassrls を持ち RLS を素通りするので、既存の API ルートと
-- Python スクリプト（どちらも SUPABASE_SERVICE_ROLE_KEY を使う）の動きは変わらない。
-- 同じ理由で、RLS は service-role 鍵が漏れたときの防御にはならない。
--
-- 何度流しても同じ結果になる。
--
-- 適用手順
-- 本番に流すのは CEO の承認を得てから。確認の全項目は ARCHITECTURE.md の
-- "Applying 008_enable_rls.sql and rolling it back" にある。
--   0. 流す前に、anon と authenticated が持つ権限を記録する。
--        SELECT table_name, grantee, privilege_type
--        FROM information_schema.role_table_grants
--        WHERE table_name IN ('tanka_likes', 'tanka_like_counts')
--          AND grantee IN ('anon', 'authenticated');
--      短歌を1つ選び、/my_site/api/tanka-likes?tweetId=<id> が返す likeCount も記録する。
--   1. Supabase の SQL Editor で、このファイル全体を流す。
--   2. 確かめる。
--      anon で tanka_likes を直接 SELECT すると permission denied for table tanka_likes になる:
--        BEGIN; SET LOCAL ROLE anon; SELECT * FROM tanka_likes LIMIT 1; ROLLBACK;
--      anon で view を読むと件数が返る:
--        BEGIN; SET LOCAL ROLE anon; SELECT tweet_id, like_count FROM tanka_like_counts LIMIT 5; ROLLBACK;
--      authenticated、INSERT、API の likeCount の確認は ARCHITECTURE.md の手順に従う。
--   3. 戻すときは下の SQL を流す。そのあと手順0のクエリを流し、権限が記録どおりに戻ったことを確かめる。
--
-- 戻すときの SQL。手順0の記録が Supabase の既定（anon と authenticated が tanka_likes に
-- ALL を持つ）だった前提で書いてある。記録が既定と違えば、記録に合わせて GRANT を直す。
--   BEGIN;
--   DROP POLICY IF EXISTS tanka_select_public ON tanka;
--   DROP POLICY IF EXISTS tags_select_public ON tags;
--   ALTER TABLE tanka DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE metadata DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tag_dictionary DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_tags DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_embeddings DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE tanka_likes DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE api_rate_limits DISABLE ROW LEVEL SECURITY;
--   GRANT ALL ON tanka_likes TO anon, authenticated;
--   COMMIT;
-- view tanka_like_counts に渡した SELECT は戻さない。手順0の記録で anon と authenticated が
-- view の SELECT を持っていなかったときだけ、続けて次を流す:
--   REVOKE SELECT ON tanka_like_counts FROM anon, authenticated;

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

-- tanka_likes は user_ip 列を持つので、anon と authenticated にはポリシーを置かず、権限ごと外す。
-- ポリシーが無いだけだと、直接 SELECT は拒否されずに 0 行を返す。
-- 以前の 008 は tanka_likes_select_public を作っていた。それを流した DB でも同じ状態にそろうよう、DROP を残す。
DROP POLICY IF EXISTS tanka_likes_select_public ON tanka_likes;
REVOKE ALL ON tanka_likes FROM anon, authenticated;

-- anon と authenticated がいいね数を読めるのは、この view からだけ。
-- 列は tweet_id / tanka / created_at / like_count で、どれも公開してよい。user_ip や liked_at を足さない。
-- security_invoker は付けない。付けると view は呼び出した role の権限で tanka_likes を読むので、
-- REVOKE 済みの anon は件数も読めなくなる。付けない view は持ち主の権限で tanka_likes を数え、
-- RLS と REVOKE を素通りする。それでも view から出るのは件数だけ。
GRANT SELECT ON tanka_like_counts TO anon, authenticated;

DROP POLICY IF EXISTS tags_select_public ON tags;
CREATE POLICY tags_select_public ON tags
    FOR SELECT TO anon, authenticated USING (true);

COMMIT;
