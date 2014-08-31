$(document).ready(function() {
    /** Create new tab */
    $('#tab-add').click(function() {
		$('.TTWForm-container').show();
		$('#submit').show();
		$('#field8').focus();
    });
    /** Connect leanModal trigger to target ID */
    $('#tab-add').leanModal({ top : 100, overlay : 0.4, closeButton: ".modal_close" });
    $('#log-in').leanModal({ top : 100, overlay : 0.4, closeButton: ".modal_close" });
    $('#note-add').leanModal({ top : 100, overlay : 0.0, closeButton: ".modal_close" });
	
    
    
        
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
    
    
    
    
    /** Log in screen */
    $('#log-in').click(function() {
		$('.LOGForm').show();
		$('#submit').show();
		$('#field2').focus();
	});
    
    
    
    
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
    $('#lean_overlay').click(function() {
		$('.TTWForm').find('[type=hidden]').attr('name', 'upload');
		$('[id^=field]').each(function() {
			$(this).val('');
		});
		$('#submit').show();
		$('.TTWForm-container').hide();
		$('#lean_overlay').hide();
    });
    $('.modal_close').click(function() {
		$('#lean_overlay').click();
	});
	
	
	
	
	/** Submit to log in */
	$('.LOGForm').submit(function(e) {
		$('#submit').hide();
		$loading.show();
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
				$('#submit').show();
			}
		});
    });
    $('#submit').click(function(e) {
		$(this).parents('#form-submit').find('[type=submit]').click();
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
		console.log(message);
		$('#note-add').click();
		if(message.error) {    
			$('.message').html('<i class="fa fa-exclamation-circle fa-fw"></i>');
			$('.message').append(message.error).show();
		} else {
			var counter = 3;
			$('.message').html('<i class="fa fa-check-circle fa-fw"></i>');
			$('.message').append(message.message).show();
			setInterval(function() {
				$('.message+span').html('<p>Grid will be updated in few seconds. ('+counter+')</p>');
				--counter;
			}, 1000);
			setTimeout(function() {
				$('#lean_overlay').hide();
				$('.status').hide();
				setTimeout(function() {location.reload();}, 1000);
			}, (counter+1)*1000);
		}
    }
    
    
    
    
    /** Spinning load icon while submit */
    var $loading = $('#loading').hide();
	$(document).ajaxStart(function() {
		$('#submit').hide();
		$loading.show();
	}).ajaxStop(function() {
		$('#submit').show();
		$loading.hide();
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
    
    var spinner = new Spinner(opts).spin($('#loading')[0]);
});
