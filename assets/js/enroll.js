$(document).ready(function() {
  var video = document.getElementById('video');

  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
  });
  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var imgCount;

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480);

    chrome.identity.getProfileUserInfo(function(userInfo) {
      $.ajax({
        method: 'POST',
        url: endpoint + '/enroll',
        data: {
          email: userInfo.email,
          id: userInfo.id,
          image_binary: context.getImageData(0, 0, 640, 480).data
        }
      }).then(function(response) {
        imgCount = response.img_count;
        $('h3').innerHTML('Pictures: ' + imgCount);
      })
    });
  });
})
