# docs/specs/ — 実装仕様ドキュメント

## このディレクトリの責務

reqs から導出される実装仕様群。CCが自動生成し、人間がレビュー・微調整する。
reqs ⇔ specs ⇔ 実装は三角形で行き来する。矛盾がある場合は**最新の意思決定がある方**が正（`<!-- human-decision -->` マーカー優先、判断できない場合はユーザーに確認）。

## 各ファイルの責務

| ファイル | 責務 | 導出元 | 生成方式 |
|---|---|---|---|
| db-schema.md | テーブル定義・制約 | product-model.json（entities） | CC自動生成 |
| api-spec.md | エンドポイント定義 | entities + actors + screens | CC自動生成 |
| auth-spec.md | 認証・認可フロー | actors の touches | CC自動生成 |
| ui-spec.md | フロントエンド実装仕様 | screens（+ api-spec がある場合はそれも参照） | 人間主導（CCは骨格） |
| analytics-spec.md | 計測設計・イベント定義 | product-goals | 人間主導（CCは骨格） |
| infra-spec.md | インフラ構成定義 | 全specsの要件 | 人間主導（CCは骨格） |
| test-spec.md | テスト計画・シナリオ | user-stories + 全specs | CC自動生成 |
| impl-plan.md | 実装順序・タスクカード | user-stories + 全specs | CC自動生成 |

## 編集ルール

- **ドキュメントマップを最初に確認する** — `product-goals.md` のドキュメントマップで現在のフェーズに「—」のファイルは作成しない
- 実装は必ずこのディレクトリのファイルを参照する（reqs/ を直接パースしない）
- product-model.json にないエンティティを db-schema.md に追加しない
- api-spec.md に追加するときは対応する PRD 機能を明記する
- ui-spec.md の状態定義（Loading/Empty/Error/Success）を必ず実装する
- **人間の意思決定は `<!-- human-decision -->` マーカーで囲む** — CC再生成時に保護される
- CC自動生成のspecで人間が修正したい箇所がある場合、修正内容をマーカーで囲んでからCCに再生成を依頼する
