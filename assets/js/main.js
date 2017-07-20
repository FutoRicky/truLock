// TODO: Handler for when no user is logged in to chrome
// TODO: Styling

var storageArea = chrome.storage.sync;

var setUrlList = function() {
  storageArea.get(null, function(storageContent) {
    if (storageContent.lockedUrls) {
      $('#urlList')[0].value = storageContent.lockedUrls;
    }
  });
};

var lockButtonText = function() {
  chrome.storage.sync.get(null, function(storage) {
    if (storage.locked) {
      $("#lockButton").text("Unlock");
    } else {
      $("#lockButton").text("Lock");
    }
  });
};

$(document).ready(function() {
  var isEnrolled;
  storageArea.get(null, function(storageContent) {
    if (storageContent.enrolled) {
      $('#enrollContainer').hide();
      $('#lockContainer').show();
    }
  });

  lockButtonText();
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

      var image = canvas.toDataURL('image/jpeg', 0.1).split(",")[1];
      var data = {
        email: userInfo.email,
        entity_id: userInfo.id,
        image: image
      };
      var imgCount;
      fetch(endpoint + '/enroll', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.image_count >= 5) {
          storageArea.set({ 'enrolled': true }, function() {});
          $('#enrollContainer').hide();
          $('#lockContainer').show();
        } else {
          document.getElementById('imageCount').innerHTML = 'Pictures Taken: ' + json.image_count;
          document.getElementById('imagesLeft').innerHTML = (5 - json.image_count) + ' more pictures are needed to start locking urls';
        }
      });
    });
  });

  document.getElementById("lockButton").addEventListener("click", function() {
    chrome.storage.sync.get(null, function(storage) {
      if (!storage.locked) {
        chrome.storage.sync.set({ 'locked': true }, function() {});
        $("#lockButton").text("Unlock");
      } else {
        chrome.tabs.create({
          url: chrome.extension.getURL("templates/authUser.html"),
          active: true
        });
      }
    });
  });
});
