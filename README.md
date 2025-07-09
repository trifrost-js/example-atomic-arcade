# 🎮 Atomic Arcade

**Atomic Arcade** is a retro-inspired, fragment-powered micro-arcade built using the [TriFrost Atomic Runtime](https://trifrost.dev).

It showcases zero-bundle, server-first game delivery, each game loads as a fragment when needed, no more, no less.

> ⚡ No bundlers. No client routing. No hydration nightmares. Just fragments and fun.

---

## 🕹 Live Games
- **Breakout**: Colorful paddle & brick action
- **Tetris**: Classic falling blocks with smooth controls
- **Snake**: A pixel-linked reptile quest, powered by SVG food and linked segment rendering

---

## 🧬 Powered By: TriFrost Atomic
Atomic Arcade is a practical demo of [TriFrost Atomic](https://www.trifrost.dev/docs/jsx-atomic)’s **runtime fragment model**, where:
- Each game is a fully isolated fragment
- No global JS bundles — fragments self-bootstrap
- HTML, JS, and CSS are streamed and hydrated only when needed
- Events are passed via pub/sub (`el.$publish(...)`)
- Canvas rendering and component injection are fully controlled through runtime fragments

---

## 💡 Features
- ✨ Synthwave-inspired UI
- 📦 Zero bundles — everything is dynamically streamed
- 🧠 Component-level event logic (`Script` + `css`)
- 🎨 Full canvas rendering (Tetris, Snake)
- 🔊 Optional audio FX + music with `AudioPlayer`
- ⚙️ Server-driven routing (`routes.ts`)

---

## 🚀 Running Locally
```bash
# Clone and install
git clone https://github.com/trifrost-js/example-atomic-arcade.git
cd example-atomic-arcade
npm install

# Start dev server
npm run dev
```

---

## ❄️ Stay Frosty
Atomic Arcade is a living demo of what’s possible when you rethink JS delivery from the ground up. No SPA assumptions. No bundler magic. Just fast, focused fragments.

Built with ❤️ by the TriFrost team
