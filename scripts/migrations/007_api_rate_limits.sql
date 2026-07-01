-- Issue #158: likes/highscore API のレート制限
-- (IP, endpoint) 単位でウィンドウ内の書込み回数を記録・判定するテーブルと関数。

-- 書込みリクエストの発生を記録するテーブル
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(45) NOT NULL, -- IPv4/IPv6対応
    endpoint VARCHAR(64) NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ウィンドウ内カウントを効率化するインデックス
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_lookup
    ON api_rate_limits (ip, endpoint, requested_at DESC);

-- レート制限を判定する関数。
-- ウィンドウ内の書込み回数が max_requests 未満なら記録して TRUE（許可）を返し、
-- 上限到達なら記録せず FALSE（拒否）を返す。
CREATE OR REPLACE FUNCTION check_api_rate_limit(
    ip_param VARCHAR(45),
    endpoint_param VARCHAR(64),
    max_requests INTEGER,
    window_seconds INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    window_start TIMESTAMP WITH TIME ZONE;
    request_count INTEGER;
BEGIN
    window_start := NOW() - (window_seconds || ' seconds')::INTERVAL;

    -- ウィンドウ外の古いレコードを掃除する
    DELETE FROM api_rate_limits WHERE requested_at < window_start;

    SELECT COUNT(*) INTO request_count
    FROM api_rate_limits
    WHERE ip = ip_param
      AND endpoint = endpoint_param
      AND requested_at >= window_start;

    IF request_count >= max_requests THEN
        RETURN FALSE;
    END IF;

    INSERT INTO api_rate_limits (ip, endpoint)
    VALUES (ip_param, endpoint_param);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
