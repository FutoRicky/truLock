$(document).ready(function() {
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
      fetch(endpoint + '/authenticate', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(response) {
        switch (response.status) {
          case 200:
            chrome.storage.local.get(null, function(localStorage) {
              // chrome.storage.local.set({ 'access': true, 'authForUrl': localStorage.lockedUrl});
              chrome.tabs.update(localStorage.accessTab, { url: localStorage.accessUrl });
            })
            chrome.storage.sync.set({ locked: false }, function() {});
            document.getElementById('message').innerHTML = "Urls unlocked!";
            break;
          case 502:
            document.getElementById('message').innerHTML = "We're sorry, we encountered a problem authenticating you. Please try again.";
            break;
          case 403:
            document.getElementById('message').innerHTML = "You must finish the signup process before authenticating.";
            break;
          default:
            document.getElementById('message').innerHTML = "You do not appear to be who you say you are... No access for you.";

        }
        // return response.json();
      })
      .then(function(json) {
      });
    });
  });
})
