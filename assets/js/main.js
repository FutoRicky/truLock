var storageArea = chrome.storage.sync;

var setUrlList = function() {
  storageArea.get(null, function(storageContent) {
    if (storageContent.lockedUrls) {
      $('#urlList')[0].value = storageContent.lockedUrls;
    }
  });
};

$(document).ready(function() {

  setUrlList();

  chrome.storage.onChanged.addListener(function() {
    setUrlList();
  });

  $('#updateButton').on('click', function() {
    var urls = $('#urlList')[0].value.replace(/\s+/g, '').split(',');
    storageArea.set({ 'lockedUrls': urls }, function() {});
  });

  var video = document.getElementById('video');

  try {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
  } catch (e) {
    chrome.tabs.create({
      url: chrome.extension.getURL("templates/videoPermission.html"),
      active: true
    });
  }

  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var endpoint = 'http://tru-lock-api-dev.us-east-1.elasticbeanstalk.com/api';
  var imgCount;

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 320, 240);

    chrome.identity.getProfileUserInfo(function(userInfo) {
      // TODO: Handler when no user is logged in to chrome

      var image = canvas.toDataURL('image/jpeg', 0.1).split(",")[1];
      var data = {
        email: userInfo.email,
        entity_id: userInfo.id,
        image: image
      }
      var imgCount;
      fetch(endpoint + '/enroll', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(response) {
        imgCount = response.img_count;
        return response.json();
      })
      .then(function(json) {
        document.getElementById('imageCount').innerHTML = 'Pictures: ' + imgCount;
      });
    });
  });
});
