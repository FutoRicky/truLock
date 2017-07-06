

register = function($container) {

};

login = function($container) {

};

takePhoto = function() {
  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
  	context.drawImage(video, 0, 0, 640, 480);
  });
};

$(document).ready(function() {
  var $container = $('#container');
  chrome.identity.getProfileUserInfo(function(userInfo) {
    $.ajax({
      method: 'POST',
      url: endpoint + '/register',
      data: { email: userInfo.email, id; userInfo.id }
    }).then(function(response) {
      if (response.img_count < 3) {
        window.open(chrome.extension.getURL('enroll.html'));
      }
    })
  });

});
