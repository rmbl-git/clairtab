# ClairTab

ClairTab is a calm, privacy-friendly Chrome new-tab extension designed to turn intent into action.

It combines a lightweight task list, Google search, personal shortcuts, and a custom local background in a focused interface.

## Features

- Configurable **Focus** and **Search** modes
- Local task list with active and completed tasks
- Personal shortcuts that can be added, edited, deleted, and reordered
- Custom background image uploaded from the device
- Local persistence through `chrome.storage.local`
- Offline-friendly interface
- No account, advertising, or analytics

## Privacy

ClairTab stores its user data locally on the device. The custom background is processed in the browser and stored locally.

## Tech stack

- Chrome Extension Manifest V3
- React
- TypeScript
- Vite
- `chrome.storage.local`
- Vitest
- React Testing Library
- dnd-kit

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The development server serves `newtab.html`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Build

```bash
npm run build
```

The production extension is generated in `dist/`.

## Load the extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the `dist/` directory.
5. Open a new tab.

## Project structure

```text
public/
  manifest.json
src/
  app/
  domain/
  features/
  storage/
  test/
worker/
```

## Current limitations

- Chrome desktop is the primary target.
- Google is the only search engine currently available.
- Data is not synchronized between devices.
- ClairTab does not require or provide a user account.