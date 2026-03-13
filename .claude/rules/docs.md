---
paths:
  - "docs/**"
---

# ドキュメントルール

- `docs/reqs/` が企画（canonical）。`docs/specs/` は `docs/reqs/` から導出する
- `docs/reqs/` と `docs/specs/` が矛盾したら `docs/reqs/` が正しい
- 実装は `docs/specs/` を参照する。`docs/reqs/` を直接パースして実装しない
- 不明な点は推測で実装せず TODO コメントを残す

# 開発ワークフロー（Spec駆動開発）
- 詳細は `.claude/rules/workflow.md` を参照する


## Conceptual Model（JSON + HTMLエディタ）

- `conceptual-model.json` はConceptual Model HTMLで更新する。直接編集も可だが、HTMLエディタを使うことを推奨
- ユーザーから設計指示があった場合、`conceptual-model.json` の変更が `ui-spec.md` と `db-schema.md` に影響しないか確認する
- `conceptual-model.json` が更新されたら、`conceptual-model.md` も整合するよう更新する

## Wireframe（JSON + HTMLエディタ）

- `wireframe.json` の `_entity`/`_attributes` は編集しない。変更は `conceptual-model.json` から
- ビューの追加は Conceptual Model HTML の右ペインで行う（auto-saveで `conceptual-model.json` に保存される）
- `wireframe.json` が更新されたら、`ui-spec.md` への影響を確認する
