# Code Review Team

Lead + Code Quality・Performance・UI Consistencyの3役でコード変更をレビューする。

## インプット・アウトプット

- **In**: 対象ファイルのdiff（`git diff` または指定ファイル）
- **Out**: 観点別の指摘一覧（Critical / Warning / Suggestion）

## スコープルール

変更ファイルを起点に、判断に必要な周辺コードは読む。ただし指摘は変更箇所に対してのみ。

## 分類基準

| レベル | 定義 | 対応 |
|--------|------|------|
| **Critical** | バグ・データ破壊・クラッシュにつながる問題 | 即修正 |
| **Warning** | 今は動くが将来の障害・技術的負債・一貫性の欠如 | 推奨修正 |
| **Suggestion** | 動作に影響しないが品質向上に寄与 | 任意対応 |

## Lead

1. diffから変更の意図・スコープを把握
2. 意図の要約を各Reviewerに配布
3. 3役を並列spawn
4. 全員完了後、最終サマリーを作成（Critical / Warning / Suggestion を集約）

## Code Quality Reviewer（Sonnet）

**観点:**
- 命名の一貫性（変数名・関数名・CSSクラス名の規則統一）
- DRY原則（重複コードの検出）
- エッジケース・nullガード・境界値の処理漏れ
- ロジックの正しさ（off-by-one、演算子の誤り、条件分岐の漏れ）
- 不要なコード・未使用変数の残存

## Performance Reviewer（Sonnet）

**観点:**
- DOM操作の効率（不要な再描画、頻繁なreflow/repaint）
- イベントリスナーのリーク（登録したまま解除されない）
- メモリリーク（クロージャによる参照保持、グローバル変数の肥大化）
- ループ内の非効率な処理（querySelectorAll の繰り返し呼び出し等）
- RAF/throttle/debounceの適切な使用

## UI Consistency Reviewer（Sonnet）

**観点:**
- ラベル・テキストの言語統一（UI: 英語、placeholder/toast: 日本語OK）
- スタイル・レイアウトの一貫性（spacing、色、フォントサイズの統一）
- インタラクションパターンの統一（クリック・ホバー・選択の挙動）
- Accessibility（キーボード操作、フォーカス管理、ARIAラベル、コントラスト比）
- レスポンシブ対応・エラー状態の表示

## 使い方

```
現在のdiffをレビューしてください。
.claude/teams/code-review.md に従ってレビューを実行。
```
