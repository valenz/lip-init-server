$(document).ready(function() {
    /** Connect leanModal trigger to target ID */
    $('#note-add').leanModal({ top : 100, overlay : 0.0, closeButton: ".modal_closeNote" });
	
    
    
	
    /** Focus cursor */
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
    
    
    
    
    //if(validateLogin()) {
	if(validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#tab-add').leanModal({ top : 100, overlay : 0.4, closeButton: ".modal_close" });
		/** Create tab screen */
		$('#tab-add').click(function() {
			$('.TTWForm').show();
			$('#submitTTW').show();
			$('.focus').focus();
		});
	
	}
	
	if(!$('.adj input:checkbox').prop('checked') || validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#create-user').leanModal({ top : 100, overlay : 0.4, closeButton: ".modal_close" });
		/** Create user screen */
		$('#create-user').click(function() {
			$('.USEForm').show();
			$('.focus').focus();
			
			$('#field1, #field3').keyup(function() {
				if($('#field1').val() === $('#field3').val() && ($('#field1').val() || $('#field3').val())) {
					$(this).parent().parent().find('span').text('');
					$('#field1, #field3').css('border-color', '#17313A');
					$('#field1, #field3').css('background-color', '#D9FFCC');
					$('input:first-child').attr('disabled', false);
				} else {
					$(this).parent().parent().find('span').text('Passwords do not match.');
					$(this).css('border-color', '#FF0000');
					$(this).css('background-color', '#FFF2E5');
					$('input:first-child').attr('disabled', true);
				}
			});
		});
	}
	
	if(!validateLogin()) {
		/** Connect leanModal trigger to target ID */
		$('#log-in').leanModal({ top : 100, overlay : 0.4, closeButton: ".modal_close" });
		if($('.adj input:checkbox').prop('checked')) {
			$('#create-user').click(function () {
				status({'error': 'To create a new user you must be logged in first.'});
			});
		}
		/** Create login screen */
		$('#log-in').click(function() {
			$('.LOGForm').show();
			$('#submitLOG').show();
			$('.focus').focus();
		});
	}
	
    
    
    
    /** Reload content */
    $('#reload').mouseenter(function() {
		$(this).find('i').attr('class', 'fa fa-refresh fa-spin');
		$(this).click(function() {
			location.reload();
		});
    });
    $('#reload').mouseleave(function() {
		$(this).find('i').attr('class', 'fa fa-refresh')
    });
    
    
    
    
    /** Cancel form */
    $('.modal_close').click(function() {
		$('[class^=Form]').find('[type=hidden]').attr('name', 'upload');
		$('[id^=field]').each(function() {
			$(this).val('');
		});
		$('[class^=submit]').show();
		$('.TTWForm-container').hide();
		$('#lean_overlay').hide();
	});
	
	/** Cancel note */
    $('.modal_closeNote').click(function() {
		$('#note').hide();
	});
	
	
	
	
	/** Submit */
	$('.LOGForm, .TTWForm, .USEForm, .SETForm').submit(function(e) {
		$('[id^=submit]').hide();
		$loading0.show();
		$loading1.show();
		$loading2.show();
	});
    
    
    
    
    /** Submit form to update settings */
    $('.SETForm').submit(function(e) {
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
				if(data.message) {
					status(data);
				} else {
					status(data);
				}
			}
		});
    });
    $('#seclog').click(function() {
		$('.SETForm').submit();
	});
    
    
    
    
    /** Submit form to create users */
	$('.USEForm').submit(function(e) {
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
				if(data.message) {
					fd.parents('#createUser').hide();
					status(data);
				} else {
					status(data);
				}
			},
			complete: function() {
				$('[id^=submit]').show();
			}
		});
	});
	
	
	
	
	/** Submit form to create or edit tabs */
    $('.TTWForm').submit(function(e) {
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
				console.log(data);
				if(data.message) {
					$('[id^=field]').each(function() {
						$(this).val('');
					});
					status(data);
				} else {
					status(data);
				}
			},
			complete: function() {
				$('#lean_overlay').hide();
				$('.TTWForm-container').hide();
				$('[id^=submit]').show();
			}
		});
    });
    $('[id^=submit]').click(function(e) {
		$(this).parents('.form-submit').find('[type=submit]').click();
	});
    
    
    
    
    /** Submit form to delete tabs */
    $('.TABForm').submit(function(e) {
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
				if(data.message) {
					fd.parents('.tabs').hide();
					status(data);
				} else {
					status(data);
				}
			}
		});
    });
    
    
    
    
    /** Shows a message after submit */
    function status(message) {
		$('#note-add').click();
		if(message.error) {    
			$('.message').html('<i class="fa fa-exclamation-circle fa-fw"></i>');
			$('.message').append(message.error).show();
		} else {
			$('.message').html('<i class="fa fa-check-circle fa-fw"></i>');
			$('.message').append(message.message).show();
			setTimeout(function() {
				$('#lean_overlay').hide();
				$('.status').hide();
			}, 3000);
		}
    }
	
	
	
	
	/** Validates the state of login */
	function validateLogin() {
		if($('#log-in').attr('name') == 'login') {
			return false;
		} else {
			return true;
		}
	}
    
    
    
    
    /** Spinning load icon while submit */
    var $loading0 = $('#loadingTTW').hide();
    var $loading1 = $('#loadingLOG').hide();
    var $loading2 = $('#loadingUSE').hide();
	$(document).ajaxStart(function() {
		$('input:first-child').attr('disabled', true);
		$loading0.show();
		$loading1.show();
		$loading2.show();
	}).ajaxStop(function() {
		$('input:first-child').attr('disabled', false);
		$loading0.hide();
		$loading1.hide();
		$loading2.hide();
    });
    
    var opts = {
		lines: 7, // The number of lines to draw
		length: 0, // The length of each line
		width: 7, // The line thickness
		radius: 7, // The radius of the inner circle
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
		top: '19px', // Top position relative to parent in px
		left: '395px' // Left position relative to parent in px
    };
    
    var spinner0 = new Spinner(opts).spin($loading0[0]);
    var spinner1 = new Spinner(opts).spin($loading1[0]);
    var spinner2 = new Spinner(opts).spin($loading2[0]);
});
