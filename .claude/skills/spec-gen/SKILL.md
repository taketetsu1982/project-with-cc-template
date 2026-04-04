---
name: spec-gen
description: 企画書（reqs）から設計書（specs）を生成・更新する
---

# /spec-gen

企画書（reqs）全体を理解した上で、設計書（specs）を自動生成または更新する。
生成後に doc-checker エージェントで整合性を確認する。

## Input（すべて読み込む）

- `docs/reqs/prd.md` — ビジョン、設計原則、機能定義。specsの「なぜこう設計するか」の根拠
- `docs/reqs/mrd.md` — 市場・Buyer定義。セキュリティ要件やスケール要件の根拠
- `docs/reqs/product-model.json` — entities, actors, screens, transitions。specsの構造的な入力
- `docs/reqs/user-stories.md` — ストーリーと受け入れ条件。テスト仕様の入力
- `docs/reqs/design-details.md` — 設計原則の操作的定義（存在する場合）

## Output

以下のspecsファイルを生成または更新する。

| ファイル | 主な生成元 | PRD/MRDから反映すること |
|---|---|---|
| `db-schema.md` | entities | 設計原則に基づく制約、ビジネスルール |
| `api-spec.md` | entities + actors + screens | 機能定義のスコープ、エラーハンドリング方針 |
| `auth-spec.md` | actors の touches | MRDのBuyer構造、PRDのロール定義 |
| `test-spec.md` | user-stories + specs | 受け入れ条件、エッジケース |

## 生成しないファイル（人間主導）

- `ui-spec.md` — デザイントークン、インタラクションは人間が判断
- `analytics-spec.md` — 計測設計は人間が判断
- `infra-spec.md` — インフラ構成は人間が判断

## Execution Steps

### Step 1: 企画書を読み込む

reqs全体を読み込み、プロダクトの目的・ユーザー・制約を理解する。
`prd.md` と `product-model.json` は必須。存在しないかテンプレート状態の場合は中断する。
`mrd.md`、`user-stories.md`、`design-details.md` は存在すれば読み込む。

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
