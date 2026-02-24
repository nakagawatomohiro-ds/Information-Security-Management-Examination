# DSCSS 情報セキュリティマネジメント学習クイズアプリ

情報セキュリティマネジメント試験（SG）合格を目指す学習支援PWAアプリです。

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage（進捗保存）
- PWA対応

## 機能

- 5ステージ×20問 = 全100問のオリジナル問題
- 1000点満点スコア設計（合格圏: 800点以上）
- Fisher-Yatesシャッフルによる4択ランダム化
- 簡易SRS（間隔反復）復習システム
- タグ別弱点分析
- 学習連続日数（Streak）トラッキング
- モバイルファースト設計

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ

Vercelに接続して自動デプロイ。

## DSCSS公式サイト

https://css.dropstone.co.jp/
