$(document).ready(function() {
    $('#tab-add').click(function() {
		if($('.TTWForm-container').css('display') == 'none') {
			$('.TTWForm-container').css('display', 'block');
			$('#field8').focus();
		} else {
			$('.TTWForm-container').css('display', 'none');
		}
    });
    
    /* Cancel Form */
    $('#form-submit').find('[type=button]', '[value=cancel]').click(function() {
		if($(this).parents('#form-submit').find('[type=submit]').attr('value') == 'Edit') {
			$(this).parents('#form-submit').find('[type=submit]').attr('value', 'Upload');
		}
		$('[id^=field]').each(function() {
			$(this).val('');
		});
		$('.TTWForm-container').css('display', 'none');
		$('.message').css('display', 'none');
	});
    
    
    
    
    $('#field8').focusin(function() {
		if(!$(this).val()) {
			$(this).val('http://');
		}
	});
	
	$('#field8').focusout(function() {
		if($(this).val() == 'http://') {
			$(this).val('');
		}
	});
	
	
	
	
	$('.TTWForm').submit(function(e) {
		e.preventDefault();
		var fd = new FormData($(this)[0]);
		$.ajax({
			type: 'POST',
			url: '/api/upload',
			data: fd,
			processData: false,
			contentType: false,
			error: function(xhr, text, desc) { status(text +' '+ xhr.status +' '+ desc); },
			success: function(data) {
				if(data.message) {
					status(data.message);
					$('#form-submit').find('[type=submit]').attr('value', 'Upload');
					$('[id^=field]').each(function() {
						$(this).val('');
					});
				} else { status(data.error); }
			}
		});
	});
	
	$('.TABForm').submit(function(e) {
		e.preventDefault();
		var fd = new FormData($(this)[0]);
		$.ajax({
			type: 'POST',
			url: '/api/option',
			data: fd,
			processData: false,
			contentType: false,
			error: function(xhr, text, desc) { status(text +' '+ xhr.status +' '+ desc); },
			success: function(data) {
				if(data.message) {
					status(data.message);
				} else { status(data.error); }
			}
		});
	});
	
	
	
	
	function status(message) {
		    $('.message').text(message).css('display', 'block');
		    setTimeout(function() {
				$('.message').css('display', 'none');
			}, 5000);
	}
	
	var $loading = $('#loading').hide();
	$(document).ajaxStart(function() {
		$loading.show();
	}).ajaxStop(function() {
		$loading.hide();
	});
	
	var opts = {
		lines: 7, // The number of lines to draw
		length: 0, // The length of each line
		width: 6, // The line thickness
		radius: 6, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#FFF9E5', // #rgb or #rrggbb or array of colors
		speed: 1.4, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '26px', // Top position relative to parent in px
		left: '245px' // Left position relative to parent in px
	};
	
	var spinner = new Spinner(opts).spin($('#loading')[0]);
});
