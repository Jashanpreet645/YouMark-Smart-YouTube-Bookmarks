# 🚀 YouMark – Smart YouTube Bookmarks

A lightweight Chrome Extension that lets you save, manage, and instantly replay timestamps directly inside YouTube videos.

Never lose track of important moments again.

---

## ✨ Features

- 🎬 One-click timestamp bookmarking inside YouTube player  
- ⚡ Instant playback from saved timestamps  
- 🧠 Duplicate prevention logic  
- 🔔 Smooth in-page toast confirmation  
- 🌙 Clean modern dark UI  
- 🔄 Sync storage using Chrome Storage API (Manifest V3)

---

## 🏗 Architecture

YouMark follows Chrome Extension (Manifest V3) architecture:

- **Content Script** – Injects bookmark button into YouTube player  
- **Background Service Worker** – Handles tab updates & messaging  
- **Popup UI** – Displays and manages saved timestamps  
- **Chrome Storage API** – Persists bookmark data  

It also handles YouTube’s SPA (Single Page Application) navigation using DOM observers.

---

## 🛠 Tech Stack

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Chrome Storage API
- Background Service Workers
- Content Script DOM Injection
- Message Passing Between Extension Layers

---

## 📂 Project Structure

```
YouMark/
│
├── assets/               # Icons and button images
├── background.js         # Service worker
├── contentScript.js      # Injects bookmark logic into YouTube
├── popup.html            # Extension popup UI
├── popup.css             # Popup styling (dark theme)
├── popup.js              # Popup logic
├── manifest.json         # Extension configuration
└── utils.js              # Utility helpers
```

---

## 🚀 Installation (Developer Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/Jashanpreet645/YouMark-Smart-YouTube-Bookmarks.git
   ```

2. Open Chrome and go to:
   ```
   chrome://extensions
   ```

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the project folder

6. Open YouTube and start bookmarking 🎉

---

## 🎯 How It Works

1. Click the bookmark icon added inside the YouTube player  
2. Timestamp is saved using Chrome Storage  
3. Toast confirmation appears  
4. Open extension popup to manage bookmarks  
5. Click play to jump directly to saved timestamp  

---

## 🧠 What I Learned

- Building production-ready Chrome Extensions  
- Handling Manifest V3 service workers  
- Managing async storage safely  
- Handling YouTube dynamic SPA navigation  
- Designing smooth micro-interactions

---

## 📷 Screenshots

![YouMark Screenshot](screenshots/image1.png)
![YouMark Screenshot](screenshots/image2.png)
![YouMark Screenshot](screenshots/image3.png)


---

## 📌 Future Improvements
 
- 🔍 Search & filter timestamps  
- 📤 Export bookmarks as JSON  
- 📊 Bookmark analytics  
- 🌐 Chrome Web Store release  

---

⭐ If you like this project, consider giving it a star!
