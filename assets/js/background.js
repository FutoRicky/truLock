chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason.search(/install/g) === -1) {
    return;
  }
  chrome.tabs.create({
    url: chrome.extension.getURL("templates/videoPermission.html"),
    active: true
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  alert($('#urlList').value());
});
