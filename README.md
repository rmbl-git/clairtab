# ClairTab

<p align="center">
  <img src="assets/clairtab-preview.png" alt="ClairTab preview" width="100%">
</p>


ClairTab is a simple, privacy-friendly Chrome new-tab extension.

It combines a lightweight task list, Google search, personal shortcuts, and a custom local background in a focused interface.

## Features

- Local task list with active and completed tasks
- Personal shortcuts that can be added, edited, deleted, and reordered
- Custom background image uploaded from the device
- Local persistence through `chrome.storage.local`
- Offline-friendly interface
- No account, advertising, or analytics

## How to use ClairTab

### Search the web

Enter a query in the central search field, then press **Enter** or select the search icon. ClairTab opens a standard Google results page only after you submit the search.

### Manage shortcuts

Select **Add** to create a shortcut, then enter a name and website address.

- URLs without a protocol are automatically completed with `https://`
- Only HTTP and HTTPS links are accepted
- Website icons are retrieved automatically when available
- A letter-based fallback is displayed when no favicon can be found
- Shortcuts can be edited or deleted from their edit control
- Up to 12 shortcuts can be stored

### Reorder shortcuts with drag-and-drop

Using a mouse:

1. Press and hold a shortcut for approximately 0.8 seconds.
2. Drag it to the desired position.
3. Release it to save the new order.

A quick click still opens the shortcut, while the press delay prevents accidental navigation during reordering.
The updated order is saved locally immediately.

### Use Tasks

Open the **Tasks** module to manage a lightweight local to-do list.

- Add a task with the **+** button
- Mark a task as completed with its checkbox
- Select it again to restore it
- Delete tasks individually
- Clear all completed tasks
- Show or hide completed tasks from Settings
- Task titles support up to 160 characters

To keep the interface compact, ClairTab displays the first three active tasks and indicates when additional tasks exist.

### Open Settings

Select the gear icon in the upper-right corner to open the Settings panel.

Available options include:

- Show or hide Search
- Show or hide Tasks
- Choose Search or Tasks as the default module
- Set the background overlay to Light, Medium, or Strong
- Show or hide the daily quote
- Show or hide completed tasks
- Upload a custom background image
- Reset saved tasks, shortcuts, and preferences

At least one main module must remain enabled.

### Upload a custom background

In **Settings → Custom background**:

1. Select **Choose a photo**.
2. Choose a JPEG, JPG, PNG, or WebP image.
3. Wait for the confirmation message.
4. Close Settings.

The source image can be up to 8 MB. 
Larger images are resized to a maximum of 2560 × 1440 while preserving their aspect ratio, converted to WebP in the browser, and stored locally. 
The image is not uploaded to a ClairTab server.

### Local storage

ClairTab saves tasks, shortcuts, preferences, shortcut order, and the custom background through `chrome.storage.local`.

Data remains on the current device and Chrome profile. 
It is not synchronized between devices and no ClairTab account is required.

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

## Install ClairTab in Chrome

ClairTab is currently distributed as an unpacked Chrome extension.

### Install from the downloadable package

1. Download the latest ClairTab package from the GitHub **Releases** page.
2. Extract the downloaded ZIP archive to a permanent folder on your computer.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** in the upper-right corner.
5. Select **Load unpacked**.
6. Open the extracted ClairTab package and select its `dist/` folder.
7. Open a new Chrome tab.

Chrome will now use ClairTab as the new-tab page.

> Keep the extracted package on your computer after installation. Chrome loads the extension directly from the selected `dist/` folder, so moving or deleting that folder will disable the extension.

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
