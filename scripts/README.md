# 短歌収集システム

X（旧Twitter）APIを使用して、特定のユーザーの投稿から「#短歌」を含むツイートを自動収集し、Supabase（PostgreSQL）に保存するシステムです。

## 機能概要

- X APIのUser Timeline エンドポイントで新着ツイートを取得
- 「#短歌」を含む投稿から短歌部分を自動抽出
- 抽出した短歌をSupabaseデータベースに保存
- GitHub Actionsによる定期実行
- レート制限対応とエラーハンドリング

## セットアップ

### 1. 依存関係のインストール

```bash
cd scripts
pip install -r requirements.txt
```

### 2. データベースのセットアップ

Supabaseのダッシュボードで以下のSQLを実行してください：

```sql
-- migrations/001_init.sql の内容を実行
```

### 3. GitHub Secrets の設定

リポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください：

| シークレット名 | 説明 |
|---|---|
| `X_BEARER_TOKEN` | X API v2のBearer Token |
| `X_USER_ID` | 収集対象のTwitterユーザーID（数値） |
| `SUPABASE_URL` | SupabaseプロジェクトのURL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseのサービスロールキー |

#### X API認証情報の取得方法

1. [X Developer Portal](https://developer.x.com/)でアプリを作成
2. API v2のBearer Tokenを取得
3. 対象ユーザーのUser IDを取得（数値形式）

#### Supabase認証情報の取得方法

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. Settings > API でURL とService Role Keyを取得

## 短歌抽出ルール

投稿テキストから短歌を抽出する際の優先順位：

1. **【】がある場合**: 最後の「】」の直後から最初の「#」の直前まで（なければ末尾まで）
2. **#短歌アプリがある場合**: 先頭から最初のスラッシュ「/」の直前まで（なければ最初の「#」の直前まで、それもなければ投稿全体）
3. **その他**: 投稿全体

抽出例：
```
【お題：春】
桜咲く
風に舞い散る
花びらが
心に残る
美しき春
#短歌 #春

→ 抽出結果: "桜咲く\n風に舞い散る\n花びらが\n心に残る\n美しき春"
```

## 実行方法

### GitHub Actionsでの自動実行

- **手動実行**: リポジトリの Actions タブから「Fetch Tanka from X API to Supabase」ワークフローを手動実行
- **定期実行**: 毎日UTC 0:00（JST 9:00）に自動実行

### ローカルでの実行

```bash
cd scripts

# 環境変数を設定（.envファイルを作成するか直接export）
export X_BEARER_TOKEN="your_bearer_token"
export X_USER_ID="your_user_id"
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# スクリプト実行
python fetch_and_store_tanka_supabase.py
```

### .envファイルを使用する場合

```bash
# scripts/.env ファイルを作成
cat > .env << EOF
X_BEARER_TOKEN=your_bearer_token
X_USER_ID=your_user_id
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF

python fetch_and_store_tanka_supabase.py
```

## テスト実行

```bash
cd scripts
python -m pytest tests/test_extract.py -v
```

または

```bash
cd scripts/tests
python test_extract.py
```

## 実行頻度の推奨設定

- **推奨頻度**: 1日1回（現在の設定）
- **理由**: 
  - X APIのレート制限（User Timeline: 75 requests/15分）
  - 短歌投稿の頻度を考慮
  - GitHub Actionsの使用量節約

頻度を変更する場合は `.github/workflows/fetch_tanka_supabase.yml` の cron 設定を編集してください。

```yaml
schedule:
  - cron: '0 */6 * * *'  # 6時間ごと
  - cron: '0 0 * * 0'    # 週1回（日曜日）
```

## データベーススキーマ

### tankaテーブル

| カラム名 | 型 | 説明 |
|---|---|---|
| tweet_id | BIGINT (PK) | ツイートID |
| author_id | BIGINT | 投稿者のユーザーID |
| created_at | TIMESTAMP WITH TIME ZONE | ツイート投稿日時 |
| original_text | TEXT | 元の投稿テキスト |
| tanka | TEXT | 抽出された短歌 |
| extracted_at | TIMESTAMP WITH TIME ZONE | 抽出処理日時 |

### metadataテーブル

| カラム名 | 型 | 説明 |
|---|---|---|
| key | VARCHAR(255) (PK) | メタデータのキー |
| value | TEXT | メタデータの値 |
| updated_at | TIMESTAMP WITH TIME ZONE | 更新日時 |

## トラブルシューティング

### よくあるエラー

1. **認証エラー**: GitHub Secretsが正しく設定されているか確認
2. **レート制限エラー**: 実行頻度を下げるか、時間をおいて再実行
3. **データベース接続エラー**: Supabaseの認証情報とネットワーク設定を確認

### ログの確認

GitHub Actionsの実行ログで以下の情報を確認できます：

- 取得したツイート数
- 抽出・保存した短歌数
- since_idの更新状況
- エラーの詳細

### ローカル開発

ローカルで開発・テストする場合：

```bash
# 仮想環境の作成（推奨）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係のインストール
pip install -r requirements.txt

# テスト実行
python tests/test_extract.py

# スクリプト実行
python fetch_and_store_tanka_supabase.py
```

## ライセンス

このプロジェクトは親プロジェクトのライセンスに従います。

## 貢献

バグ報告や機能改善の提案は、GitHubのIssuesでお知らせください。
