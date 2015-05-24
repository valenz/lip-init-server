$(function() {
  // Duration of the messages before they disappear
	setTimeout(function() {
		$('.popclose').click();
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
    template: '<div class="popover" style="width: 100%;"><button class="close popclose" type="button" style="margin: 9px 5px 0 0;"><span>&#215;</span></button><div class="popover-content '+template+' text-center"></div></div>',
    placement: "bottom",
    html: true
  });
  // Fires trigger to show popover
  $('[data-toggle="popover"]').click();
	// Fires trigger to hide popover
	$('.popclose').on('click', function() {
		$('[data-toggle="popover"]').popover('hide');
	});

  // Loads tooltip library
  $('[data-toggle="tooltip"]').tooltip({
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

	$('li.tabs a').on('click', function() {
		var fd = new FormData();
		fd.append('id', $(this).parent().attr('id'));
		$.ajax({
			type: 'POST',
			url: '/prefer',
			data: fd,
			processData: false,
			contentType: false
		});
	});

  // Tabs range settings
  var factor = localStorage.getItem('range') ? localStorage.getItem('range') : 1;
  $('.tabs').each(function() {
    $(this).css('width', Math.floor($(this).css('width').substr(0,3) * factor) +'px');
    $(this).find('.name').css('font-size', Math.floor($(this).find('.name').css('font-size').substr(0,2) * (Math.log10(factor) + 1)) +'px');
  });
});
