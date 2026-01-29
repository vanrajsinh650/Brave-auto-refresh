const statusDiv = document.getElementById("status");
const tabInfoDiv = document.getElementById("tabInfo");
const intervalInput = document.getElementById("intervalInput");

// Select current tab
document.getElementById("selectTab").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.runtime.sendMessage(
      { action: "select_tab", tabId: tab.id },
      (response) => {
        tabInfoDiv.innerText = `Selected: ${tab.title || "Empty Tab"}`;
        statusDiv.innerText = "Status: " + response.status;
      }
    );
  });
};

// Start refresh
document.getElementById("start").onclick = () => {
  const seconds = parseInt(intervalInput.value) || 10;
  const intervalMs = seconds * 1000;

  chrome.runtime.sendMessage(
    { action: "set_interval", interval: intervalMs },
    () => {
      chrome.runtime.sendMessage({ action: "start_refresh" }, (response) => {
        statusDiv.innerText = "Status: " + response.status;
      });
    }
  );
};

// Stop refresh
document.getElementById("stop").onclick = () => {
  chrome.runtime.sendMessage({ action: "stop_refresh" }, (response) => {
    statusDiv.innerText = "Status: " + response.status;
  });
};
