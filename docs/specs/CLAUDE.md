# docs/specs/ — 実装仕様ドキュメント

## このディレクトリの責務

`docs/reqs/` から導出される実装仕様群。Claude Code が実装時に直接参照する。
`docs/reqs/` と矛盾がある場合は `docs/reqs/` が正。

## 各ファイルの責務

| ファイル | 責務 | 導出元 |
|---|---|---|
| db-schema.md | テーブル定義・制約・マイグレーション | reqs/conceptual-model.md |
| api-spec.md | エンドポイント定義・リクエスト/レスポンス形式 | reqs/prd.md, reqs/conceptual-model.md |
| auth-spec.md | 認証・認可フロー・ロール定義 | reqs/prd.md |
| ui-spec.md | フロントエンド実装仕様・状態定義 | reqs/conceptual-model.md, reqs/prd.md |
| analytics-spec.md | 計測設計・イベント定義 | reqs/product-goals.md |
| test-spec.md | テスト計画・シナリオテスト | reqs/user-stories.md + 全specs |

## 編集ルール

- 実装は必ずこのディレクトリのファイルを参照する（reqs/ を直接パースしない）
- conceptual-model.md にないエンティティを db-schema.md に追加しない
- api-spec.md に追加するときは対応する PRD 機能を明記する
- ui-spec.md の状態定義（Loading/Empty/Error/Success）を必ず実装する
