let TARGET_TAB_ID = null;
let intervalId = null;
const INTERVAL = 10 * 1000; // 10 seconds

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // Select current tab
  if (message.action === "select_tab") {
    TARGET_TAB_ID = message.tabId;
    chrome.storage.local.set({ TARGET_TAB_ID });
    sendResponse({ status: "Tab selected", tabId: TARGET_TAB_ID });
  }

  // Start refreshing
  if (message.action === "start_refresh") {
    if (TARGET_TAB_ID) {
      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => {
        chrome.tabs.reload(TARGET_TAB_ID);
        console.log("Refreshed tab:", TARGET_TAB_ID);
      }, INTERVAL);

      sendResponse({ status: "Refresh started" });
    } else {
      sendResponse({ status: "No tab selected" });
    }
  }

  // Stop refreshing
  if (message.action === "stop_refresh") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    sendResponse({ status: "Refresh stopped" });
  }
});
