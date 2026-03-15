# docs/reqs/ — 企画ドキュメント

## このディレクトリの責務

プロダクトの「5WとHow much」を定義する企画ドキュメント群。
設計書群の `docs/specs/` はここから導出される。矛盾がある場合はこちらが正。

## 各ファイルの責務

| ファイル | 責務 | 主な読者 |
|---|---|---|
| product-goals.md | Product Goal一覧・確信度定義・スコープ・出口条件 | 全員 |
| pg1.md (pg2.md ...) | Product Goalごとのスコープ・出口条件（WHEN） | 全員 |
| mrd.md | 市場構造・購入者・参入戦略（WHERE, WHO:Buyer, HOW MUCH） | PMMとPdM |
| prd.md | 利用者・提供価値・機能定義・スコープ（WHY, WHO:User ,WHAT） | PdMとPMM・開発 |
| conceptual-model.md | エンティティ・関係の設計意図（Model of WHAT） | 開発 |
| product-model.json | 統合JSON: entities/actors/composites/screens/navigation（HTMLエディタで操作） | 開発 |
| user-stories.md | ユーザーストーリーと受け入れ条件（WHAT to develop） | QA・開発 |

## 編集ルール

- pg1.md・prd.md・mrd.md は相互にブラッシュアップする。どこから着手してもよい
- WHO は Buyer（mrd.md）と User（prd.md）に分離して定義する
- 3つがある程度固まってから conceptual-model.md に降ろす
- 新しいエンティティを追加する前に conceptual-model.md を更新する
- 新しい画面を追加する前に product-model.json の screens を更新する
- 現在のPGに含まない機能は記述しない（product-goals.md + 該当PGファイルを確認）
- product-goals.md の確信度が「—」のセクションは記述しない
