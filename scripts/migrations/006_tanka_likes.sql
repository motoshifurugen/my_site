-- 短歌いいね機能のテーブル作成
-- 短歌のいいね数を管理するテーブル
CREATE TABLE IF NOT EXISTS tanka_likes (
    id SERIAL PRIMARY KEY,
    tweet_id BIGINT NOT NULL REFERENCES tanka(tweet_id) ON DELETE CASCADE,
    user_ip VARCHAR(45) NOT NULL, -- IPv4/IPv6対応
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tweet_id, user_ip) -- 同一ユーザーは1つの短歌に1回だけいいね可能
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_tanka_likes_tweet_id ON tanka_likes (tweet_id);
CREATE INDEX IF NOT EXISTS idx_tanka_likes_user_ip ON tanka_likes (user_ip);
CREATE INDEX IF NOT EXISTS idx_tanka_likes_liked_at ON tanka_likes (liked_at DESC);

-- いいね数を効率的に取得するためのビュー
CREATE OR REPLACE VIEW tanka_like_counts AS
SELECT 
    t.tweet_id,
    t.tanka,
    t.created_at,
    COALESCE(lc.like_count, 0) as like_count
FROM tanka t
LEFT JOIN (
    SELECT tweet_id, COUNT(*) as like_count
    FROM tanka_likes
    GROUP BY tweet_id
) lc ON t.tweet_id = lc.tweet_id
ORDER BY t.created_at DESC;

-- 特定のユーザーIPのいいね状態を確認する関数
CREATE OR REPLACE FUNCTION get_user_like_status(tweet_id_param BIGINT, user_ip_param VARCHAR(45))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM tanka_likes 
        WHERE tweet_id = tweet_id_param AND user_ip = user_ip_param
    );
END;
$$ LANGUAGE plpgsql;

-- いいねを追加する関数
CREATE OR REPLACE FUNCTION add_tanka_like(tweet_id_param BIGINT, user_ip_param VARCHAR(45))
RETURNS INTEGER AS $$
DECLARE
    like_count_result INTEGER;
BEGIN
    -- いいねを追加（重複は無視）
    INSERT INTO tanka_likes (tweet_id, user_ip)
    VALUES (tweet_id_param, user_ip_param)
    ON CONFLICT (tweet_id, user_ip) DO NOTHING;
    
    -- 現在のいいね数を取得
    SELECT COUNT(*) INTO like_count_result
    FROM tanka_likes
    WHERE tweet_id = tweet_id_param;
    
    RETURN like_count_result;
END;
$$ LANGUAGE plpgsql;

-- いいねを削除する関数
CREATE OR REPLACE FUNCTION remove_tanka_like(tweet_id_param BIGINT, user_ip_param VARCHAR(45))
RETURNS INTEGER AS $$
DECLARE
    like_count_result INTEGER;
BEGIN
    -- いいねを削除
    DELETE FROM tanka_likes
    WHERE tweet_id = tweet_id_param AND user_ip = user_ip_param;
    
    -- 現在のいいね数を取得
    SELECT COUNT(*) INTO like_count_result
    FROM tanka_likes
    WHERE tweet_id = tweet_id_param;
    
    RETURN like_count_result;
END;
$$ LANGUAGE plpgsql;
