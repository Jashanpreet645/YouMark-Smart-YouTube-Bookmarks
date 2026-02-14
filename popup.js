import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.innerHTML = `
  <span class="timestamp">${formatTime(bookmark.time)}</span>
  <span class="label">Saved timestamp</span>
  `;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

const formatTime = (t) => {
  const date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substr(11, 8);
};

const viewBookmarks = (currentBookmarks=[]) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  document.querySelector(".title").innerText =
  `Your bookmarks (${currentBookmarks.length})`;

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = `
      <div class="row">
        🎬 No bookmarks yet <br/>
        Click the bookmark button on the video to save timestamps.
      </div>`;
  }

  return;
};

const onPlay = async e => {
  const bookmarkTime = e.target.closest(".bookmark").getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime =
    e.target.parentNode.parentNode.getAttribute("timestamp");

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    (updatedBookmarks) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }

      const el = document.getElementById("bookmark-" + bookmarkTime);

      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateX(15px)";
      }

      setTimeout(() => {
        viewBookmarks(updatedBookmarks);
      }, 200);
    }
  );
};


const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }
});

