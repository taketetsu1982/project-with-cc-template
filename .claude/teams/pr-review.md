# PR Review Team

Lead + Security・Performance・Test Coverageの3役でマージ前レビューする。

## インプット・アウトプット

- **In**: ブランチ名 + PR description（なければLeadがdiffから意図を要約）
- **Out**: Critical項目の一覧 + マージ判定

## スコープルール

変更ファイルを起点に、判断に必要な周辺コードは読む。ただし指摘は変更ファイルに対してのみ。

## 分類基準

| レベル | 定義 | 対応 |
|--------|------|------|
| **Critical** | 本番で認証突破・データ破壊・サービス停止・情報漏洩 | マージ前に修正 |
| **Warning** | 今は動くが将来の障害・技術的負債 | 次PR or 別タスク |
| **Nit** | 動作に影響しないが品質向上に寄与 | 任意対応 |

## マージ判定

- Critical = 0 → マージ可
- Critical ≧ 1 → 全件修正後に再レビュー

## Lead

1. PR descriptionとdiffから変更の意図・スコープを把握
2. 意図の要約を各Reviewerに配布
3. 3役を並列spawn
4. 全員完了後、最終サマリーを作成

## Security Reviewer（Sonnet）

**観点:** 認証・認可の抜け漏れ、SQLインジェクション、入力バリデーション、シークレットのハードコード、DBスキーマ変更のデータ破壊リスク

## Performance Reviewer（Sonnet）

**観点:** N+1クエリ、コンポーネント境界の不適切な配置、大きなbundle size、paginationなしの全件取得、非同期エラーハンドリング不備

## Test Coverage Reviewer（Sonnet）

**観点:** 変更に対応するテストの存在、エッジケースのカバー、モックの適切さ、認証・認可テスト

## 使い方

```
[ブランチ名] をレビューしてください。
PR description: [目的と変更概要]
.claude/teams/pr-review.md に従ってレビューを実行。
```
