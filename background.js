let targetTabId = null;
let refreshInterval = 10000; // default 10s
let alarmName = "tabRefresh";

// Load saved settings when extension starts
chrome.runtime.onStartup.addListener(loadSettings);
chrome.runtime.onInstalled.addListener(loadSettings);

function loadSettings() {
  chrome.storage.local.get(["targetTabId", "refreshInterval"], (data) => {
    if (data.targetTabId) targetTabId = data.targetTabId;
    if (data.refreshInterval) refreshInterval = data.refreshInterval;
  });
}

// Listen messages from popup UI
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "select_tab") {
    targetTabId = msg.tabId;
    chrome.storage.local.set({ targetTabId });
    sendResponse({ status: "Tab selected", tabId: targetTabId });
  }

  if (msg.action === "set_interval") {
    refreshInterval = msg.interval;
    chrome.storage.local.set({ refreshInterval });
    sendResponse({ status: "Interval updated" });
  }

  if (msg.action === "start_refresh") {
    chrome.alarms.clear(alarmName, () => {
      chrome.alarms.create(alarmName, { periodInMinutes: refreshInterval / 60000 });
    });
    sendResponse({ status: "Auto refresh started" });
  }

  if (msg.action === "stop_refresh") {
    chrome.alarms.clear(alarmName);
    sendResponse({ status: "Auto refresh stopped" });
  }
});

// Refresh tab when alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === alarmName && targetTabId) {
    chrome.tabs.reload(targetTabId);
    console.log("Refreshed tab:", targetTabId);
  }
});
