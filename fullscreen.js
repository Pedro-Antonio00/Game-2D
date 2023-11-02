function toggleFullScreen() {
    var canvas = document.getElementById('GameId');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
        document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        }
    }
}

var elementos = document.getElementsByClassName("nav-link");

for (var i = 0; i < elementos.length; i++) {
  elementos[i].addEventListener("click", function() {
    for (var j = 0; j < elementos.length; j++) {
      elementos[j].classList.remove("active");
    }
    this.classList.add("active");
  });
}