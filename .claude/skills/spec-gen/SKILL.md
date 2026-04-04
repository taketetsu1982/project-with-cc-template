---
name: spec-gen
description: 企画書（reqs）から設計書（specs）を生成・更新する
---

# /spec-gen

企画書（reqs）を読み込み、設計書（specs）を自動生成または更新する。
生成後に doc-checker エージェントで整合性を確認する。

## Input

- `docs/reqs/product-model.json` — entities, actors, screens, transitions
- `docs/reqs/prd.md` — 機能定義、設計原則
- `docs/reqs/user-stories.md` — ストーリーと受け入れ条件
- `docs/reqs/mrd.md` — 市場・ユーザー定義（参考）

## Output

以下のspecsファイルを生成または更新する。

| ファイル | 生成元 | 生成ルール |
|---|---|---|
| `db-schema.md` | entities | entity → テーブル。共通カラム規約に従う |
| `api-spec.md` | entities + actors + screens | CRUD → エンドポイント。命名規則に従う |
| `auth-spec.md` | actors の touches | actor → ロール、touches → 権限マトリクス |
| `test-spec.md` | user-stories + specs | 受け入れ条件 → テスト項目 |

## 生成しないファイル（人間主導）

- `ui-spec.md` — デザイントークン、インタラクションは人間が判断
- `analytics-spec.md` — 計測設計は人間が判断
- `infra-spec.md` — インフラ構成は人間が判断

## Execution Steps

### Step 1: 企画書を読み込む

`docs/reqs/product-model.json`、`prd.md`、`user-stories.md` を読む。
ファイルが存在しない、またはテンプレート状態の場合はユーザーに報告して中断する。

### Step 2: 既存specsを確認する

`docs/specs/` の各ファイルを読み、状態を判断する。
- テンプレート状態 → 新規生成
- 内容あり → 差分更新（`<!-- human-decision -->` マーカー内は保護）

### Step 3: specs を生成・更新する

db-schema → api-spec → auth-spec → test-spec の順に生成する。
後段のspecは前段の内容を参照するため、この順序を守る。

### Step 4: 整合性チェック

doc-checker エージェントを呼び出し、企画↔設計の整合性を確認する。

### Step 5: 結果報告

生成・更新したファイルの一覧と、doc-checker のレポートをユーザーに報告する。

```
## spec-gen 結果

### 生成・更新したファイル
- {ファイル名}: {新規生成 / 更新（変更箇所の要約）}

### 整合性チェック
{doc-checker のレポート}
```
