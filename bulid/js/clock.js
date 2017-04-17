$(document).ready(function() {
  var d, timer;
  if ($('#footer-clock').length) {
    timer = $('#footer-clock').val();
    timer = new Date(timer);
    d = new Date();
    if (d < timer) {
      $('.clock').countdown(timer, function(event) {
        $('.clock').html(event.strftime('直播票搶購倒數 %D天 %H時 %M分 %S秒'));
      });
      $('.if-clock').show();
    }
  }
});