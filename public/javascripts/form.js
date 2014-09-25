$(document).ready(function() {
    /** Connect leanModal trigger to target ID */
    $('#createnote').leanModal({ top : 100, overlay : 0.0, closeButton: ".note-close" });
	
	if(validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#createtab').leanModal({ top : 100, overlay : 0.4, closeButton: ".former-close" });
		
		/** Create tab screen */
		$('#createtab').click(function() {
			$('#former').show();
			$('#former-header').find('h1').text('Tab adjustments');
			
			$('.form').attr('action', '/upload')
					  .attr('method', 'post')
					  .attr('enctype', 'multipart/form-data');
			
			$('.submit').before('<div id="address" class="field f_100"></div>')
						.before('<div id="optional" class="field f_100"></div>');
			
			$('#address').append('<label>Address (required): </label>')
						 .append('<input type="url" name="tabTextUrl" title="Address" required="required" placeholder="http://">');
			
			$('#optional').append('<label>Name (optional): </label>')
						  .append('<input type="text" name="tabTextName" title="Name" placeholder="Name">')
						  .append('<input type="hidden" name="upload">');
			
			$('#address').find('input').focusin(function() {
				if(!$(this).val()) $(this).val('http://');
			}).focusout(function() {
				if($(this).val() == 'http://') $(this).val('');
			}).focus();
		});
	
	}
	
	if(!$('.adj input:checkbox').prop('checked') || validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#createuser').leanModal({ top : 100, overlay : 0.4, closeButton: ".former-close" });
		
		/** Create user screen */
		$('#createuser').click(function() {
			$('#former').show();
			$('#former-header').find('h1').text('Create User');
			$('.form').attr('action', '/createuser')
					  .attr('method', 'post')
					  .attr('enctype', 'multipart/form-data');
			
			$('.submit').before('<div id="username" class="field f_100"></div>')
						.before('<div id="password" class="field f_100"></div>')
						.before('<div id="confirm" class="field f_100"></div>');
			
			$('#username').append('<label>Username: </label><span></span>')
						  .append('<input type="text" name="username" title="Username" required="required" placeholder="Username">');
			
			$('#password').append('<label>Password: </label><span></span>')
						  .append('<input type="password" name="password" title="Password" required="required" placeholder="Password">');
			
			$('#confirm').append('<label>Confirm Password: </label><span></span>')
						 .append('<input type="password" name="confirm" title="Confirm Password" required="required" placeholder="Confirm Password">');
			
			$('#username').find('input').focus();
			
			$('#password, #confirm').find('input').keyup(function() {
				if($('#password').find('input').val() === $('#confirm').find('input').val() && ($('#password').find('input').val() || $('#confirm').find('input').val())) {
					$('#password, #confirm').find('span').text('');
					$('#password, #confirm').find('input').css('border-color', '#17313A');
					$('#password, #confirm').find('input').css('background-color', '#D9FFCC');
					$('.submit').find('[type=submit]').attr('disabled', false);
				} else {
					$(this).parent().find('span').text('Passwords do not match.');
					$(this).css('border-color', '#FF0000');
					$(this).css('background-color', '#FFF2E5');
					$('.submit').find('[type=submit]').attr('disabled', true);
				}
			});
		});
	}
	
	if(!validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#login').leanModal({ top : 100, overlay : 0.4, closeButton: ".former-close" });
		if($('.adj input:checkbox').prop('checked')) {
			$('#createuser').click(function () {
				status({'error': 'To create a new user you must be logged in first.'});
			});
		}
		
		/** Create login screen */
		$('#login').click(function() {
			$('#former').show();
			$('#former-header').find('h1').text('Login');
			
			$('.form').attr('action', '/login')
					  .attr('method', 'post')
					  .attr('enctype', 'multipart/form-data');
			
			$('.submit').before('<div id="username" class="field f_100"></div>')
						.before('<div id="password" class="field f_100"></div>');
			
			$('#username').append('<label>Username: </label>')
						  .append('<input type="text" name="username" title="Username" required="required" placeholder="Username">');
			
			$('#password').append('<label>Password: </label>')
						  .append('<input type="password" name="password" title="Password" required="required" placeholder="Password">');
			
			$('#username').find('input').focus();
		});
	}
	
    
    
	/** Submit to login, upload and edit tabs */
    $('#submit').click(function() {
		$('.submit').find('[type=submit]').click();
	});
	
    /** Submit to update settings */
    $('#seclog').click(function() {
		$('.setting-form').submit();
	});
    
    /** Submit form */
	$('.form, .tab-form, .setting-form').submit(function(e) {
		e.preventDefault();
		var fd = $(this);
		$.ajax({
			type: fd.attr('method'),
			url: fd.attr('action'),
			data: new FormData(fd[0]),
			processData: false,
			contentType: false,
			error: function(xhr, text, desc) {
				status(text +' '+ xhr.status +' '+ desc);
			},
			success: function(data) {
				status(data);
			},
			complete: function() {
				$('#former').hide();
			}
		});
	});
    
	
	
    /** Cancel form */
    $('.former-close, #lean_overlay').click(function() {
		$('.form').find('[type=hidden]').attr('name', 'upload');
		$('[id^=field]').each(function() {
			$(this).val('');
		});
		$('#former').hide();
		$('#lean_overlay').hide();
		formerReset();
	});
	
	/** Cancel note */
    $('.note-close').click(function() {
		$('#note').hide();
	});
    
    
    
    /** Shows a message after submit */
    function status(message) {
		$('#createnote').click();
		if(message.error) {    
			$('.message').html('<i class="fa fa-exclamation-circle fa-fw"></i>');
			$('.message').append(message.error).show();
		} else {
			$('.message').html('<i class="fa fa-check-circle fa-fw"></i>');
			$('.message').append(message.message).show();
			setTimeout(function() {
				$('#lean_overlay').hide();
				$('.status').hide();
				location.reload();
			}, 3000);
		}
    }

	/** Validates the state of login */
	function validateLogin() {
		if($('#login').attr('name') == 'login') {
			return false;
		} else {
			return true;
		}
	}

	/** Resets form to default */
	function formerReset() {
		$('.form').removeAttr('action').removeAttr('method').removeAttr('enctype');
		for(var i = $('.form').children().length-2; i >= 0; i--) {
			$('.form').children()[i].remove();
		}
	}
});