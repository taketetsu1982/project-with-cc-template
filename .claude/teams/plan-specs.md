# Specs設計チーム（Team A）

> SPF（製品化の実現可能性と事業性）の検証を推進するチーム。
> 全Specsを「確定（設計）」まで引き上げる。

## チーム構成

3 teammates を spawn する:

### バックエンドエンジニア（backend-engineer）
**担当ファイル:** `docs/specs/db-schema.md`, `docs/specs/api-spec.md`, `docs/specs/auth-spec.md`

**作業順序:**
1. db-schema.md — Conceptual Modelからテーブルを導出
2. api-spec.md — db-schemaとPRDからエンドポイントを設計
3. auth-spec.md — api-specに対して認可ルールを定義

**行動ルール:**
- Conceptual Modelにないエンティティをテーブルに追加しない
- api-specの各エンドポイントに対応するPRD機能を明記する
- api-spec完了時点でデザインエンジニアとPdMにメッセージする

### デザインエンジニア（design-engineer）
**担当ファイル:** `docs/specs/ui-spec.md`

**役割:**
- Conceptual Modelの画面階層からUI実装仕様を設計する
- 各画面の状態定義（Loading/Empty/Error/Success）を定義する
- api-specに対してフロントエンド視点のフィードバックを返す

**行動ルール:**
- api-spec完了までは、API非依存の部分（デザイントークン、コンポーネント規約）を先に進める

### PdM（pdm） — リード兼任
**担当ファイル:** `docs/specs/analytics-spec.md`, `docs/specs/test-spec.md`, `docs/reqs/product-goals.md`

**役割:**
- product-goalsから逆算して計測設計を行う
- user-stories.mdとSpecs群からテスト設計を行う
- チーム全体の進行を管理する

## フェーズ進行

### Phase 1: データ基盤設計（バックエンドエンジニア主導）
バックエンドがdb-schema → api-spec → auth-specを逐次作成。
デザインはAPI非依存部分を先行。PdMは計測・テスト骨格を作成。

### Phase 2: UI仕様・計測設計・テスト設計（3者並列）
api-spec完了をトリガーに全員が並列作業。

### Phase 3: 相互レビュー（PdM統括）
各担当が他のSpecsを自分の専門視点でレビューする。

## 参照ドキュメント
- `docs/reqs/prd.md`, `docs/reqs/conceptual-model.md`, `docs/reqs/user-stories.md`
- `docs/reqs/product-goals.md`
