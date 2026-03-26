# docs/reqs/ — 企画ドキュメント

## このディレクトリの責務

プロダクトの「5WとHow much」を定義する企画ドキュメント群。
reqs ⇔ specs ⇔ 実装は三角形で行き来する。矛盾がある場合は**最新の意思決定がある方**が正（`<!-- human-decision -->` マーカー優先、判断できない場合はユーザーに確認）。

## 各ファイルの責務

| ファイル | 責務 | 主な読者 | 生成方式 |
|---|---|---|---|
| product-goals.md | PG一覧・ドキュメントマップ・確信度 | 全員 | 人間主導 |
| pg1.md (pg2.md ...) | PGごとのスコープ・出口条件 | 全員 | 人間主導 |
| mrd.md | 市場構造・購入者・参入戦略 | PMMとPdM | 人間主導 |
| prd.md | 利用者・提供価値・機能定義 | PdMとPMM・開発 | 人間主導 |
| conceptual-model.md | エンティティ・関係の設計意図 | 開発 | CC自動生成（JSONが正） |
| product-model.json | 統合JSON: entities/actors/screens/transitions | 開発 | HTMLエディタで操作 |
| user-stories.md | ユーザーストーリーと受け入れ条件 | QA・開発 | 人間主導 |
| design-details.md | 設計原則の操作的定義（オプション） | 開発・ドメイン専門家 | 人間主導 |

## 編集ルール

- **ドキュメントマップを最初に確認する** — `product-goals.md` のドキュメントマップで現在のフェーズに「—」のファイルは作成しない
- pg1.md・prd.md・mrd.md は相互にブラッシュアップする。どこから着手してもよい
- WHO は Buyer（mrd.md）と User（prd.md）に分離して定義する
- 新しいエンティティを追加する前に `product-model.json` を更新する
- 新しい画面を追加する前に `product-model.json` の screens を更新する
- `conceptual-model.md` はCCが `product-model.json` から自動生成する。手動編集はJSONに反映されないため非推奨
- 現在のPGに含まない機能は記述しない
- 確信度が「—」のセクションは記述しない
