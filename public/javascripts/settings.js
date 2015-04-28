$(document).ready(function() {
  $('.email').hover(function() {
    var user = $(this).attr('data-user');
    var domain = $(this).attr('data-domain');
    var link = 'mailto:'+user+String.fromCharCode(64)+domain
    $(this).attr('href', link);
    $(this).on('click', function() {
      $(this).attr('href', link);
    });
  }, function() {
    $(this).removeAttr('href');
  });

  setRange($('.adj').find('[type=range]'));

  $('.adj').find('[type=range]').mousemove(function() {
    $('.adj').find('#rangeFac').text($(this).val());
  });

  $('.adj').find('[type=range]').change(function() {
    $('.adj').find('#rangeFac').text($(this).val());
    localStorage.setItem($(this).attr('type'), $(this).val());
  });

  /** Reset the adjustments */
  $('#adjReset').click(function() {
    if(confirm('You are going to reset your settings to default. \nAre you sure with that?')) {
      localStorage.removeItem($('.adj').find('[type=range]').attr('type'));
      setRange($('.adj').find('[type=range]'));
    }
  });

  /** Set range value */
  function setRange(r) {
    if(localStorage.getItem(r.attr('type'))) {
      r.val(localStorage.getItem(r.attr('type')));
      $('.adj').find('#rangeFac').text(r.val());
    } else {
      r.val(1);
      $('.adj').find('#rangeFac').text('1');

    }
  }
});
