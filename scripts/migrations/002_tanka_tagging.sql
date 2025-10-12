-- 短歌タグ付けシステムのマイグレーション
-- タグマスター、辞書、多対多関係、埋め込みテーブルを作成

-- 1) tags master
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,          -- canonical tag name (e.g., '桜')
  slug TEXT NOT NULL UNIQUE,          -- ascii slug 'sakura' for UI URLs
  category TEXT NOT NULL,             -- e.g., 'kigo', 'emotion', 'theme', 'place'
  description TEXT,                   -- optional human-friendly description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) tag_dictionary (keyword -> tag mapping used by rule-based matching)
CREATE TABLE IF NOT EXISTS tag_dictionary (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,              -- token or phrase to match (normalized)
  match_type TEXT DEFAULT 'exact',    -- 'exact', 'lemma', 'regex' (for future extensibility)
  priority INTEGER DEFAULT 0,         -- higher priority runs first
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (tag_id, keyword)
);

-- 3) join table tanka_tags (many-to-many)
CREATE TABLE IF NOT EXISTS tanka_tags (
  tweet_id BIGINT NOT NULL REFERENCES tanka(tweet_id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  score REAL DEFAULT 1.0,              -- confidence score 0..1 from auto assigner
  assigned_by TEXT DEFAULT 'auto',     -- 'auto' or username if manual
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (tweet_id, tag_id)
);

-- 4) index for quick tag lookup
CREATE INDEX IF NOT EXISTS idx_tanka_tags_tag_id ON tanka_tags (tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_dictionary_keyword ON tag_dictionary (keyword);

-- 5) optional: embeddings table (for future similarity search)
-- Note: pgvector extension may be required; include an existence check
-- If pgvector is not enabled on the project, create the table with a plain float[] column as fallback.

-- Try to enable pgvector if available (wrap in safe check)
DO $$
BEGIN
    -- Try to create pgvector extension
    BEGIN
        CREATE EXTENSION IF NOT EXISTS vector;
        RAISE NOTICE 'pgvector extension enabled successfully';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'pgvector extension not available, using float[] fallback';
    END;
END $$;

-- Create embeddings table with conditional column type
DO $$
BEGIN
    -- Check if vector type exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
        -- Create table with vector column
        EXECUTE 'CREATE TABLE IF NOT EXISTS tanka_embeddings (
          tweet_id BIGINT PRIMARY KEY REFERENCES tanka(tweet_id) ON DELETE CASCADE,
          embedding vector(1536),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )';
        RAISE NOTICE 'tanka_embeddings table created with vector column';
    ELSE
        -- Create table with float[] fallback
        EXECUTE 'CREATE TABLE IF NOT EXISTS tanka_embeddings (
          tweet_id BIGINT PRIMARY KEY REFERENCES tanka(tweet_id) ON DELETE CASCADE,
          embedding float[],
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )';
        RAISE NOTICE 'tanka_embeddings table created with float[] fallback';
    END IF;
END $$;

-- 6) trigger function to enforce maximum 3 tags per tanka
CREATE OR REPLACE FUNCTION check_max_tags_per_tanka()
RETURNS TRIGGER AS $$
DECLARE
    tag_count INTEGER;
BEGIN
    -- Count existing tags for this tweet_id
    SELECT COUNT(*) INTO tag_count
    FROM tanka_tags
    WHERE tweet_id = NEW.tweet_id;
    
    -- If this would be the 4th tag, raise an error
    IF tag_count >= 3 THEN
        RAISE EXCEPTION 'Maximum 3 tags allowed per tanka. Tweet ID % already has % tags.', NEW.tweet_id, tag_count;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on tanka_tags table
DROP TRIGGER IF EXISTS trigger_max_tags_per_tanka ON tanka_tags;
CREATE TRIGGER trigger_max_tags_per_tanka
    BEFORE INSERT ON tanka_tags
    FOR EACH ROW
    EXECUTE FUNCTION check_max_tags_per_tanka();

-- 7) Additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags (category);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);
CREATE INDEX IF NOT EXISTS idx_tanka_tags_tweet_id ON tanka_tags (tweet_id);
CREATE INDEX IF NOT EXISTS idx_tanka_tags_assigned_at ON tanka_tags (assigned_at);
