$(document).ready(function() {
    
    $('input:text').focus(function() {
		var fileName = $('#userPhotoInput').val() !== '' ? $('#userPhotoInput')[0].files[0].name.split('.')[0] : '';
		if(!$(this).val()) {
			$('#userPhotoName').val(fileName);
		}
	});
 
    $('#submit').click(function() {
		if($('#userPhotoInput').val() !== '') {
			$('#uploadForm').submit();
		}
	});
	
    $('#uploadForm').submit(function() {
		$(this).ajaxSubmit({
			beforeSend: function() {
				status('uploading the file ...');
			},
			error: function(xhr) {
				status('Error: ' + xhr.status);
			},
			success: function(response) {
				if(response.error) {
					status(response.error);
					return;
				}
			 	status('Success, file uploaded to: ' + response.path);
			}
		});
 
		// Have to stop the form from submitting and causing                                                                                                       
		// a page refresh - don't forget this                                                                                                                      
		return false;
    });
 
    function status(message) {
		$('#status').text(message);
    }
});
