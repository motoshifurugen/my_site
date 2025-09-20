-- 短歌データを保存するテーブル
CREATE TABLE IF NOT EXISTS tanka (
    tweet_id BIGINT PRIMARY KEY,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    original_text TEXT NOT NULL,
    tanka TEXT NOT NULL,
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- created_atに降順インデックスを作成
CREATE INDEX IF NOT EXISTS idx_tanka_created_at_desc ON tanka (created_at DESC);

-- メタデータを保存するテーブル
CREATE TABLE IF NOT EXISTS metadata (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- since_idの初期値を設定（必要に応じて調整）
INSERT INTO metadata (key, value) VALUES ('since_id', '1') 
ON CONFLICT (key) DO NOTHING;
