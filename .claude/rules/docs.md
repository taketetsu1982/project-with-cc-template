---
paths:
  - "docs/**"
---

# ドキュメントルール

- `docs/reqs/` が企画（canonical）。`docs/specs/` は `docs/reqs/` から導出する
- `docs/reqs/` と `docs/specs/` が矛盾したら `docs/reqs/` が正しい
- 実装は `docs/specs/` を参照する。`docs/reqs/` を直接パースして実装しない
- 不明な点は推測で実装せず TODO コメントを残す

## ドキュメントの流れ（企画→設計）

```
docs/reqs/product-goals（PG一覧・確信度）
        ↓
docs/reqs/pg0（WHEN） ⇔ docs/reqs/prd（WHO:User, WHY, WHAT） ⇔ docs/reqs/mrd（WHERE, WHO:Buyer, HOW MUCH）
        ↓
docs/reqs/conceptual-model.md（設計意図・人間用）
docs/reqs/conceptual-model.json（エンティティ＋ビュー定義・Conceptual Model HTMLで操作）
        ↓ 各ビューごとに /wireframe
docs/specs/wireframes/{screen}.wireframe.json（レイアウト・Wireframe HTMLで操作）
        ↓
docs/reqs/user-stories → docs/specs/test-spec
        ↓
docs/specs/ui-spec（wireframe.jsonを参照して導出）
docs/specs/db-schema（conceptual-model.jsonを参照して導出）
docs/specs/api-spec / auth-spec / analytics-spec
```

- DBを変更する前に `docs/reqs/conceptual-model.md` を確認する
- `conceptual-model.md` にないエンティティをDBに追加しない。先にPRDに戻る
- APIを追加するときは `docs/specs/api-spec.md` の命名規則に従い、対応するPRD機能を明記する
- 画面を追加するときは `docs/reqs/conceptual-model.md` の画面階層を先に更新する
- イベント計測を追加するときは `docs/specs/analytics-spec.md` のイベント命名規則に従う
- 現在のPGに含まない機能は実装しない（`docs/reqs/product-goals.md` + 該当PGファイルを確認）
- ドキュメントを書く前に `docs/reqs/product-goals.md` の確信度を確認する
- 「—」のセクションは記述しない。「仮説」のセクションは変わりうることを前提に書く

## Conceptual Model（JSON + HTMLエディタ）

- `conceptual-model.json` はConceptual Model HTMLで更新する。直接編集も可だが、HTMLエディタを使うことを推奨
- `conceptual-model.json` が更新されたら、`ui-spec.md` と `db-schema.md` への影響を確認する
- `conceptual-model.md` はJSONの変更に合わせて人間が更新する（Claudeが自動更新しない）

## Wireframe（JSON + HTMLエディタ）

- `wireframe.json` の `_entity`/`_attributes` は編集しない。変更は `conceptual-model.json` から
- ビューの追加は Conceptual Model HTML の右ペインで行う（auto-saveで `conceptual-model.json` に保存される）
- ビュー定義後、`/wireframe` を実行して各ビューのレイアウトを生成する
- `wireframe.json` が更新されたら、`ui-spec.md` への影響を確認する
