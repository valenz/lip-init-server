$(function() {
	// Loads tooltip library
  $('[data-toggle="tooltip"]').tooltip();

	// Loads selectpicker library
	$('.selectpicker').selectpicker();

	// Duration of the messages before they disappear
	setTimeout(function() {
		$('.msg-modal-sm').find('.close').click();
	}, 5000);
});

$(document).ready(function() {
  /** Show option buttons on tabs */
  $('li.tabs').mouseenter(function() {
    $(this).find('.mng-fa').css('display', 'block');
  });
  $('li.tabs').mouseleave(function() {
    $(this).find('.mng-fa').css('display', 'none');
  });

  /** Submit delete tab */
  $('.btn-delete').on('click', function() {
    $(this).parent().parent().attr('action', '/settings/tab/delete').submit();
  });

  $('.btn-delete-dtl').on('click', function() {
    var action = $('form').attr('action');
    action = action.replace(/\/confirm/g, '');
    $('form').attr('action', action).submit()
  });

  /** Tabs range settings */
  var factor = localStorage.getItem('range') ? localStorage.getItem('range') : 1;
  $('.tabs').each(function() {
    $(this).css('width', Math.floor($(this).css('width').substr(0,3) * factor) +'px');
  });
});
