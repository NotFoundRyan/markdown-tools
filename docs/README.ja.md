# Markdown Tools

<p align="center">
  <img src="images/screenshot-home.png" alt="Markdown Tools スクリーンショット" width="800">
</p>

<p align="center">
  <strong>モダンでプライバシー重視のドキュメント変換ツール</strong>
</p>

<p align="center">
  <a href="../README.md">简体中文</a> | 
  <a href="README.en.md">English</a> | 
  <a href="README.ja.md">日本語</a> | 
  <a href="README.fr.md">Français</a> | 
  <a href="README.es.md">Español</a> | 
  <a href="README.de.md">Deutsch</a> | 
  <a href="README.ru.md">Русский</a>
</p>

---

Markdown、Word、HTML、PDF形式間の変換を行うモダンでプライバシー重視のWebアプリケーション。すべての変換はブラウザ上でローカルに行われ、データはサーバーに送信されません。

## ✨ 機能

- **Markdown → Word** - MarkdownファイルをWord文書（.docx）に変換、書式を保持
- **Word → Markdown** - Word文書をMarkdown形式に変換、編集が容易に
- **Markdown → PDF** - MarkdownをPDF文書に変換、印刷や共有に最適
- **Markdown → HTML** - MarkdownをHTMLコードに変換、Web公開用
- **HTML → Markdown** - HTMLコードをMarkdown形式に変換
- **Word → PDF** - Word文書をPDFファイルに変換
- **PDF → Word** - PDFファイルをWord文書に変換

## 🌟 特徴

- 🔒 **プライバシー重視** - すべての変換はブラウザ上でローカルに行われ、データはサーバーに送信されません
- 🖥️ **デスクトップアプリ対応** - Windows/macOS/Linuxデスクトップアプリとしてパッケージ化可能
- 🌍 **多言語対応** - 7言語対応：中国語、英語、日本語、フランス語、スペイン語、ドイツ語、ロシア語
- 🎨 **モダンUI** - シンプルなグラスモーフィズムデザイン、ライト/ダークテーマ対応
- 📱 **レスポンシブデザイン** - デスクトップとモバイルデバイスに対応
- ⚡ **高速効率** - Viteで構築、Web Workerで大きなファイルをバックグラウンド処理
- 📝 **LaTeX対応** - Markdown → Word/PDF/HTMLで数式レンダリング対応
- 📊 **進捗表示** - 大きなファイル処理時にプログレスバーを表示

## 🛠️ 技術スタック

- **Vite** - 次世代フロントエンドビルドツール
- **TypeScript** - 型安全なJavaScript
- **Tauri** - クロスプラットフォームデスクトップアプリフレームワーク
- **marked** - Markdownパーサー
- **marked-katex-extension** - LaTeX数式サポート
- **docx** - Word文書ジェネレーター
- **mammoth** - Word文書パーサー
- **turndown** - HTML → Markdown変換器
- **jspdf** + **html2canvas** - PDF生成
- **pdfjs-dist** - PDF解析

## 🚀 クイックスタート

### 環境要件

- Node.js 18+
- npm または yarn
- Rust（デスクトップアプリビルドのみ必要）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/NotFoundRyan/markdown-tools.git

# プロジェクトディレクトリに移動
cd markdown-tools

# 依存関係をインストール
npm install
```

### 開発

```bash
# 開発サーバーを起動（Web）
npm run dev

# 開発サーバーを起動（デスクトップアプリ）
npm run tauri:dev
```

アプリケーションは `http://localhost:3000` で実行されます

### 本番ビルド

```bash
# Web版をビルド
npm run build

# デスクトップアプリをビルド
npm run tauri:build
```

## 📁 プロジェクト構成

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Windows開発起動スクリプト
├── src/
│   ├── main.ts              # アプリケーションエントリ
│   ├── scripts/
│   │   ├── pages/           # ページコンポーネント
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # クライアントサイドルーティング
│   └── styles/
│       ├── components/      # コンポーネントスタイル
│       └── pages/           # ページスタイル
├── src-tauri/               # Tauriデスクトップアプリ設定
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # ドキュメント
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 機能詳細

### 国際化 (i18n)

アプリケーションは7言語をサポート：
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

言語選択はブラウザ設定から自動検出され、localStorageに保存されます。

### テーマ対応

- ライトモード
- ダークモード
- システム設定に従う（OS設定に基づいて自動切り替え）

### 対応ファイル形式

| 入力 | 出力 |
|-------|--------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### ファイルサイズ制限

- すべてのファイルタイプ：最大 **100MB**

### 大きなファイルの処理

- **Web Worker** を使用してバックグラウンドスレッドで処理、UIをブロックしない
- 処理プログレスバーを表示、リアルタイムでフィードバック
- 超大きなファイルのチャンク処理に対応

### LaTeX数式

インライン数式とブロック数式に対応：

```markdown
インライン数式：$E = mc^2$

ブロック数式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### デスクトップアプリの機能

- シングルインスタンスモード - 複数起動によるリソース競合を防止
- ネイティブファイル保存ダイアログ - 保存場所を選択
- オフライン使用 - ネットワーク接続不要

## 🌐 ブラウザ対応

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 貢献

貢献を歓迎します！お気軽にPull Requestを提出してください。

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを開く

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています - 詳細は[LICENSE](../LICENSE)ファイルをご覧ください。

## 🙏 謝辞

- [marked](https://github.com/markedjs/marked) - Markdownパーサー
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - LaTeX数式拡張
- [KaTeX](https://github.com/KaTeX/KaTeX) - LaTeXレンダリングエンジン
- [docx](https://github.com/dolanmiu/docx) - Word文書ジェネレーター
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Word文書パーサー
- [turndown](https://github.com/mixmark-io/turndown) - HTML → Markdown変換器
- [jspdf](https://github.com/parallax/jsPDF) - PDF生成
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML → キャンバスレンダラー
- [pdf.js](https://github.com/nicholasday/pdf.js) - PDF解析
- [Tauri](https://tauri.app/) - クロスプラットフォームデスクトップアプリフレームワーク

---

Made by Ryan © 2026
