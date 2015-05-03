$(function() {
  // Duration of the messages before they disappear
	setTimeout(function() {
		$('[data-toggle="popover"]').popover('hide');
	}, 4000);
});

$(document).ready(function() {
  // Gets messages
  var success = $('[data-toggle=popover]').attr('data-success') == 'true' ? true : false;
  var error = $('[data-toggle=popover]').attr('data-error') == 'true' ? true : false;
  var content = success ? 'fa-check-circle' : error ? 'fa-exclamation-circle' : 'fa-info-circle';
  var template = success ? 'alert-success' : error ? 'alert-danger' : 'alert-info';
  // Loads popover library
  $('body').popover({
    selector: '[data-toggle=popover]',
    trigger: 'click',
  	content : '<i class="fa '+content+'"></i><span> '+ $('[data-toggle=popover]').attr('data-message') +' </span>',
    template: '<div class="popover"><div class="popover-content '+template+'"></div></div>',
    placement: "bottom",
    html: true
  });
  // Fires popover trigger
  $('[data-toggle="popover"]').click();

  // Loads tooltip library
  $('[data-toggle="tooltip"]').tooltip({
    animation: false,
    html: true
  });

	// Loads selectpicker library
	$('.selectpicker').selectpicker();

  // Show or hide anchor icon
  $('h1, h2, h3').hover(function() {
    $(this).find('.anchorjs-link').css('opacity', 1);
  }, function() {
    $(this).find('.anchorjs-link').css('opacity', 0);
  });

  // Show or hide option buttons on tabs
  $('li.tabs').hover(function() {
    $(this).find('.mng-fa').css('opacity', 1);
  }, function() {
    $(this).find('.mng-fa').css('opacity', 0);
  });

  // Tabs range settings
  var factor = localStorage.getItem('range') ? localStorage.getItem('range') : 1;
  $('.tabs').each(function() {
    $(this).css('width', Math.floor($(this).css('width').substr(0,3) * factor) +'px');
    $(this).find('.name').css('font-size', Math.floor($(this).find('.name').css('font-size').substr(0,2) * (Math.log10(factor) + 1)) +'px');
  });
});
