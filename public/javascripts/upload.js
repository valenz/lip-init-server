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
    
    
    
    
    $('#field10').change(function() {
		if(!$('#field2').val()) {
			$('#field2').val($('#field10')[0].files[0].name.split('.')[0]);
		}
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
});
