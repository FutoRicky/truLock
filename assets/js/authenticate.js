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
  var endpoint = 'https://trulock.herokuapp.com/api';
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
      }
      var imgCount;
      fetch(endpoint + '/authenticate', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(function(response) {
        debugger;
        return response.json();
      })
      .then(function(json) {
        document.getElementById('imageCount').innerHTML = 'Pictures: ' + imgCount;
      });
    });
  });
})
