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
  chrome.storage.sync.get(null, function(storageContent) {
    if (storageContent.lockedUrls) {
      storageContent.lockedUrls.forEach(function(lockedUrl) {
        if (tab.url.includes(lockedUrl)) {
          if (tab.url !== "templates/authUser.html") {
            chrome.tabs.update(tab.id, {url: "templates/authUser.html"});
          }
        }
      })
    }
  });
});
