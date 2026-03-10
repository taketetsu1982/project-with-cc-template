# docs/reqs/ — 企画ドキュメント

## このディレクトリの責務

プロダクトの「Why」と「What」を定義する企画ドキュメント群。
`docs/specs/` はここから導出される。矛盾がある場合はこちらが正。

## 各ファイルの責務

| ファイル | 責務 | 主な読者 |
|---|---|---|
| product-goals.md | PG一覧・確信度定義・ドキュメント確信度 | 全員 |
| pg0.md (pg1.md ...) | PGごとのスコープ・出口条件（WHEN） | 全員 |
| mrd.md | 市場構造・WHO:Buyer・参入戦略（WHERE, HOW MUCH） | 企画 |
| prd.md | WHO:User・提供価値・機能定義・スコープ（WHY, WHAT） | 企画・開発 |
| conceptual-model.md | エンティティ・関係・画面階層（Model of WHAT） | 開発 |
| user-stories.md | ユーザーストーリーと受け入れ条件（WHAT to develop） | QA・開発 |

## 編集ルール

- pg0.md・prd.md・mrd.md は相互にブラッシュアップする。どこから着手してもよい
- WHO は Buyer（mrd.md）と User（prd.md）に分離して定義する
- 3つがある程度固まってから conceptual-model.md に降ろす
- 新しいエンティティを追加する前に conceptual-model.md を更新する
- 新しい画面を追加する前に conceptual-model.md の画面階層を更新する
- 現在のPGに含まない機能は記述しない（product-goals.md + 該当PGファイルを確認）
- product-goals.md の確信度が「—」のセクションは記述しない
