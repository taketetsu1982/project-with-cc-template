# 開発ワークフロー（Spec駆動開発）

## 原則
- **実装前に必ず reqs → specs の順で更新する。reqs 変更不要なら specs → 実装でOK。実装だけ先に進めるのは厳禁**
- チャットでの指示で仕様が変わるような大きな変更の場合も同様に reqs → specs → 実装の順で進める
- 非自明なタスクは計画を立ててからはじめる
- 迷ったら実装を止めて確認する

## ドキュメント遷移ルール

流れ図（CLAUDE.md）に沿って、各ステップ完了後に次のステップへ進む。

### 1. PG / PRD / MRD → Conceptual Model
- **トリガー**: PRD・MRDが固まり、概念モデルの作成・更新に入るとき
- **アクション**: `/conceptual-model` を実行
- **完了条件**: `conceptual-model.json` にエンティティ + ビュー定義が揃っている

### 2. Conceptual Model → Wireframe
- **トリガー**: `conceptual-model.json` にビュー情報があり、ワイヤーフレームが必要なとき
- **アクション**: `/wireframe` を各ビューに対して実行
- **完了条件**: 各ビューの `{screen-name}.wireframe.json` が生成されている

### 3. Wireframe 完了後 → 並列で進める

Wireframe完了後、以下の2トラックを並列で進める。

#### Track A: Specs（設計仕様群）を順次導出

| 順序 | Spec | 導出元 | ファイル |
|---|---|---|---|
| 1 | DB Schema | conceptual-model.json | `docs/specs/db-schema.md` |
| 2 | API Spec | db-schema + conceptual-model + prd | `docs/specs/api-spec.md` |
| 3 | Auth Spec | api-spec + prd（ロール定義） | `docs/specs/auth-spec.md` |
| 4 | UI Spec | wireframe.json + api-spec + conceptual-model | `docs/specs/ui-spec.md` |
| 5 | Analytics Spec | product-goals | `docs/specs/analytics-spec.md` |
| 5 | Infra Spec | 上記specsの要件 | `docs/specs/infra-spec.md` |

#### Track B: User Stories → Test Spec

1. **User Stories**: ワイヤーフレームと概念モデルを参照して `docs/reqs/user-stories.md` を更新。各ストーリーに受け入れ条件とシナリオ（Gherkin）を定義
2. **Test Spec**: ユーザーストーリーの受け入れ条件から `docs/specs/test-spec.md` を導出

### 4. Impl Plan
- **トリガー**: Track AとTrack Bの両方が完了したとき
- **アクション**: impl-planning.md のワークフローを実行して `docs/specs/impl-plan.md` を生成する

### 5. Specs → 実装
- **トリガー**: 必要なspecsが揃ったとき
- **アクション**: specsを参照し `docs/specs/impl-plan.md` に沿って実装する（reqsを直接パースしない）
- Spec変更が必要になったら、実装前にSpec文書を更新する

#### 実装時の制約
- DBを変更する前に `docs/reqs/conceptual-model.md` を確認する
- `conceptual-model.md` にないエンティティをDBに追加しない。先にPRDに戻る
- APIを追加するときは `docs/specs/api-spec.md` の命名規則に従い、対応するPRD機能を明記する
- 画面を追加するときは conceptual-modelとwireframe を先に追加/更新する
- イベント計測を追加するときは `docs/specs/analytics-spec.md` のイベント命名規則に従う

## スキップのルール
- ドキュメントを書く前に `docs/reqs/product-goals.md` の確信度を確認する
- 確信度が「—」のセクションは記述しない。「仮説」のセクションは変わりうることを前提に書く
- 現在のPGに含まない機能は書かない・実装しない（`docs/reqs/product-goals.md` + 該当PGファイルを確認）
- 既にドキュメントが最新なら更新不要。次のステップに進んでよい

## セッション終了時
- Done / Next / Risks-TODO を記録する
