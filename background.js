chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We care about full YouTube watch page URLs on the actual tab object.
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("youtube.com/watch")
  ) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
        videoId: urlParameters.get("v"),
      },
      () => {
        // In some cases (e.g., when the content script hasn't been injected yet),
        // this sendMessage can fail with "Could not establish connection.
        // Receiving end does not exist." We safely ignore that here.
        if (chrome.runtime.lastError) {
          // Optional: uncomment to debug
          // console.debug("YT Bookmarks: no content script yet:", chrome.runtime.lastError.message);
        }
      }
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "OPEN_POPUP") {
    chrome.action.openPopup();
  }
});