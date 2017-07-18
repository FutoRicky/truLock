
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
  chrome.storage.local.get(null, function(localStorage) {
    if (localStorage.accessTab === tabId && !tab.url.includes(localStorage.authForUrl)) {
      chrome.storage.local.set({ 'access': false});
    }
  });
  chrome.storage.sync.get(null, function(storageContent) {
    if (storageContent.lockedUrls) {
      storageContent.lockedUrls.forEach(function(lockedUrl) {
        if (tab.url.includes(lockedUrl) && tab.url !== "templates/authUser.html") {
          chrome.storage.local.get(null, function(localStorage) {
            if (!localStorage.access || localStorage.authForUrl !== lockedUrl) {
              chrome.storage.local.set({ 'accessUrl': tab.url, 'accessTab': tab.id, 'lockedUrl': lockedUrl }, function() {});
              chrome.tabs.update(tab.id, { url: "templates/authUser.html" });
            }
          })
        }
      })
    }
  });
});

chrome.tabs.onRemoved.addListener(function(tabId, removed) {
  chrome.storage.local.get(null, function(localStorage) {
    if (localStorage.accessTab === tabId) {
      chrome.storage.local.set({ 'access': false});
    }
  })
})
