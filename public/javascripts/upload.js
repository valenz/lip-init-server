$(document).ready(function() {
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
					$('[id^=field]').each(function() {
						$(this).val('');
					});
				} else { status(data.error); }
			}
		});
	});
	
	
	
	
    function status(message) {
		$('.status').text(message);
    }
});
