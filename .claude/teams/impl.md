# 実装チーム（impl）

> `docs/specs/impl-plan.md`（`.claude/rules/impl-planning.md` ワークフローで生成）のタスクカードに基づき、ストーリー単位で実装・テストを行うチーム。
> 2つのモードを行き来しながら進める。

## チーム構成

| 役割 | モデル | 担当 |
|---|---|---|
| **lead: UIデザイナー** | Opus | モード間の統括、Spec差分判断、UI/UXレビュー |
| **teammate: フロントエンド** | Sonnet | 画面実装 |
| **teammate: バックエンド** | Sonnet | DB構築・API実装・インフラ設定 |
| **teammate: QA** | Sonnet | テスト作成・実行 |

## ファイル所有

| 役割 | 所有ファイル |
|---|---|
| lead | `docs/specs/*`（参照・更新）, `docs/reqs/*`（参照。企画変更が必要な場合は中断してユーザーに報告） |
| フロントエンド | `frontend/`（テストファイルを除く） |
| バックエンド | `backend/`（`backend/tests/` を除く）, `docker-compose.yml`, `Makefile` |
| QA | `backend/tests/`, `frontend/**/*.test.*`, `frontend/**/*.spec.*` |

## モード構成

同時稼働は常に3人以内。4人を2モードに分割して運用する。

### 実装Mode（Lead + FE + BE）

**目的:** ストーリーの実装を完了させる

**Leadの責務:**
- `docs/specs/impl-plan.md` のタスクカードからFE/BEへの作業指示を出す
- api-spec.md を参照し、FE/BE間のAPI契約を事前に共有する
- 実装中にSpecとの齟齬を検知した場合:
  - 企画ドキュメント（reqs/）の変更が不要な軽微なSpec齟齬 → Leadの判断でSpecsを先に修正してからFE/BEに実装指示を出す
  - 企画ドキュメント（reqs/）の変更が必要な場合 → 実装を中断してユーザーに報告する
- FE/BEの進行を管理し、必要に応じて追加指示を送る

**フロントエンドの責務:**
- ui-spec.md + product-model.json（screens）に基づいて画面を実装する
- api-spec.md のエンドポイント定義に合わせてAPIクライアントを実装する
- analytics-spec.md に基づいてフロントエンドのイベント計測を実装する

**バックエンドの責務:**
- db-schema.md に基づいてマイグレーション・モデルを実装する
- api-spec.md に基づいてエンドポイントを実装する
- auth-spec.md に基づいて認証・認可を実装する
- infra-spec.md を参照し、必要に応じて docker-compose.yml / Makefile を更新する
- analytics-spec.md に基づいてバックエンドのイベント計測を実装する

### テストMode（Lead + QA）

**目的:** 実装の品質を機能面・体験面の両方から検証する

**QAの責務:**
- `.claude/rules/test-execution.md` のワークフローに従ってテストを実行する
  - セクションA（Specs整合性テスト）: DB/API/AuthにFailがある場合は中断してLeadに報告
  - セクションB（シナリオテスト）: 優先度順（Must → Should → Could）に実行
- テスト実行中にSpecや実装の修正はしない。Failとして記録し報告する
- テスト結果をPass/Failで報告する

**Leadの責務:**
- UI/UX観点でレビューする（デザインシステムとの整合性、操作の流れ、フィードバックの分かりやすさ）
- QAのテスト結果とUI/UXレビュー結果を統合する
- 判定:
  - Fail or UI/UXフィードバックあり → 実装Modeに戻し、FE/BEに修正指示
  - All OK → 完了、Spec差分レポートを出力

## フロー

```
┌─────────────────────────────────────┐
│ 実装Mode（Lead + FE + BE）           │
│  - FE/BE 並列実装                    │
│  - Lead: Spec差分の判断・修正、指示    │
│  ※企画変更が必要な場合は中断→ユーザーへ │
└──────────┬──────────────────────────┘
           ↓ 実装完了
┌──────────┴──────────────────────────┐
│ テストMode（Lead + QA）              │
│  - QA: Specs整合性 + シナリオテスト    │
│  - Lead: UI/UXレビュー               │
└──────────┬──────────────────────────┘
           ↓ Fail or UI/UXフィードバックあり
           → 実装Modeに戻る
           ↓ All OK
┌──────────┴──────────────────────────┐
│ Lead: Spec差分レポートを出力          │
│  - 実装中に変更したSpecsの一覧        │
│  - 変更理由と影響範囲                 │
└──────────┬──────────────────────────┘
           ↓
  次のストーリーの指示を待つ
```

## Spec差分レポートの形式

```
## Spec差分レポート
### 変更したSpecs
| ファイル | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| {ファイル} | {変更前} | {変更後} | {理由} |

### 影響範囲
- {影響の説明}

### 未反映の課題
- {あれば記載}
```

## 参照ドキュメント

- `docs/specs/impl-plan.md`（タスクカード。`.claude/rules/impl-planning.md` ワークフローで生成）
- `docs/specs/` 配下の各Spec（db-schema, api-spec, auth-spec, ui-spec, analytics-spec, infra-spec, test-spec）
- `docs/reqs/product-model.json`（概念モデル）
- `docs/reqs/user-stories.md`（受け入れ条件）
- `.claude/rules/test-execution.md`（テスト実行ワークフロー）
