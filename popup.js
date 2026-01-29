const statusDiv = document.getElementById("status");

document.getElementById("selectTab").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.runtime.sendMessage({ action: "select_tab", tabId }, (response) => {
      statusDiv.innerText = "Status: " + response.status;
    });
  });
};

document.getElementById("start").onclick = () => {
  chrome.runtime.sendMessage({ action: "start_refresh" }, (response) => {
    statusDiv.innerText = "Status: " + response.status;
  });
};

document.getElementById("stop").onclick = () => {
  chrome.runtime.sendMessage({ action: "stop_refresh" }, (response) => {
    statusDiv.innerText = "Status: " + response.status;
  });
};
