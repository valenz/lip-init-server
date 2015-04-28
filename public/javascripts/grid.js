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
  /** Show or hide anchor icon */
  $('h1, h2, h3').hover(function() {
    $(this).find('.anchorjs-link').css('opacity', 1);
  }, function() {
    $(this).find('.anchorjs-link').css('opacity', 0);
  });

  /** Show or hide option buttons on tabs */
  $('li.tabs').hover(function() {
    $(this).find('.mng-fa').css('opacity', 1);
  }, function() {
    $(this).find('.mng-fa').css('opacity', 0);
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
    $(this).find('.name').css('font-size', Math.floor($(this).find('.name').css('font-size').substr(0,2) * (Math.log10(factor) + 1)) +'px');
  });
});
