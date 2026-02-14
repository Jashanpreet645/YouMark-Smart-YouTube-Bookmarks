(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  const fetchBookmarks = async () => {
    try {
      const result = await chrome.storage.sync.get([currentVideo]);
  
      if (!chrome.runtime?.id) {
        console.log("Extension context invalidated");
        return [];
      }
  
      return result[currentVideo]
        ? JSON.parse(result[currentVideo])
        : [];
    } catch (err) {
      console.log("Storage failed:", err);
      return [];
    }
  };  

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
  
    const newBookmark = {
      time: currentTime,
    };    
  
    currentVideoBookmarks = await fetchBookmarks();
  
    const alreadyExists = currentVideoBookmarks.some(
      (b) => Math.floor(b.time) === Math.floor(currentTime)
    );
    
    if (alreadyExists) {
      showToast("⚠️ Bookmark already exists!");
      return;
    }

    const updatedBookmarks = [...currentVideoBookmarks, newBookmark]
      .sort((a, b) => a.time - b.time);
    
    chrome.storage.sync.set(
      { [currentVideo]: JSON.stringify(updatedBookmarks) },
      () => {
        // 🔥 Tell background to open popup
        // chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
        showToast("✅ Bookmark saved!");
      }
    );
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    // Try to grab the YouTube player controls and video element.
    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0];

    // On some YouTube pages (like the home page or before the player is ready),
    // these elements may not exist yet. In that case, safely exit instead of
    // throwing an error when trying to append the button.
    if (!youtubeLeftControls || !youtubePlayer) {
      return;
    }

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => Number(b.time) !== Number(value)
      );
    
      chrome.storage.sync.set(
        { [currentVideo]: JSON.stringify(currentVideoBookmarks) },
        () => {
          response(currentVideoBookmarks);
        }
      );
      return true; // IMPORTANT for async response
    }
  });

  newVideoLoaded();

  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };
  
  let lastUrl = location.href;
  
  new MutationObserver(() => {
    const url = location.href;
  
    if (url !== lastUrl) {
      lastUrl = url;
  
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get("v");
  
      if (videoId) {
        currentVideo = videoId;
        newVideoLoaded();
      }
    }
  }).observe(document, { subtree: true, childList: true });

  const showToast = (message) => {
    const existingToast = document.getElementById("yt-bookmark-toast");
    if (existingToast) existingToast.remove();
  
    const toast = document.createElement("div");
    toast.id = "yt-bookmark-toast";
    toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:14px; font-weight:500;">${message}</span>
    </div>
    `;

  
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.padding = "12px 18px";
    toast.style.background = "linear-gradient(135deg, #1f2937, #111827)";
    toast.style.color = "white";
    toast.style.fontSize = "14px";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    toast.style.zIndex = "999999";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease";
  
    document.body.appendChild(toast);
  
    // Animate in
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 50);
  
    // Animate out
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };
  
})();

