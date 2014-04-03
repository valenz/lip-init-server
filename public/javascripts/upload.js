$(document).ready(function() {
    $('#tab-add').click(function() {
	$('.TTWForm-container').show();
	$('#field8').focus();
    });
    
    $('#refresh').mouseenter(function() {
	$('#refresh').find('i').attr('class', 'fa fa-refresh fa-lg fa-spin');
	$('#refresh').click(function() {
	    location.reload();
	});
    });
    $('#refresh').mouseleave(function() {
	$('#refresh').find('i').attr('class', 'fa fa-refresh fa-lg')
    });
    
    /* Cancel Form */
    $('.modal_close').click(function() {
	if($('#form-submit').find('[type=submit]').attr('value') == 'Edit') {
	    $('#form-submit').find('[type=submit]').attr('value', 'Upload');
	    $('#form-submit').find('[type=submit]').attr('name', '');
	}
	$('[id^=field]').each(function() {
	    $(this).val('');
	});
	$('.TTWForm-container').hide();
	$('.message').hide();
	$('#lean_overlay').hide();
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
	var fd = $(this);
	$.ajax({
	    type: 'POST',
	    url: fd.attr('action'),
	    data: new FormData(fd[0]),
	    processData: false,
	    contentType: false,
	    error: function(xhr, text, desc) { status(text +' '+ xhr.status +' '+ desc); },
	    success: function(data) {
		if(data.message) {
		    $.getJSON('data/data.json', function(data) {
			if(fd.find('[type=submit]').attr('value') == 'Upload') {
			    setTimeout(function() {
				for(var i=data.grid.length-1; i<data.grid.length; i++) {
				    for(var j in data.grid[i]) {
					$('#grid').append('<li class="tabs">'+
					    '<form action="/api/option" method="post" enctype="multipart/form-data" class="TABForm">'+
						'<div>'+
						    '<a href="'+data.grid[i][j].url+'">'+
							'<img src="'+data.grid[i][j].img+'" width="144" height="81" class="pic"/>'+
							'<h5>'+data.grid[i][j].name+'<h5>'+
							'<input type="hidden" name="'+j+'" value="'+data.grid[i][j].name+'"/>'+
						    '</a>'+
						    '<img src="images/edit-16-888.ico" class="btn-edit"/>'+
						    '<img src="images/delete-16-888.ico" class="btn-del"/>'+
						'</div></form></li>');
				    }
				}
				$('#form-submit').find('[type=submit]').attr('name', '');
				setTimeout(function() {location.reload();}, 3000);
			    }, 1000);
			} else {
			    setTimeout(function() {
				$('#form-submit').find('[type=submit]').attr('value', 'Upload');
				var tabId = fd.find('[type=submit]').attr('name');
				for(var i in data.grid) {
				    for(var j in data.grid[i]) {
					if(j == tabId) {
					    $('.tabs').find('[name='+tabId+']').attr('value', data.grid[i][j].name);
					    $('.tabs').find('[name='+tabId+']').parent('a').attr('href', data.grid[i][j].url);
					    $('.tabs').find('[name='+tabId+']').parent('a').find('h5').text(data.grid[i][j].name);
					    $('.tabs').find('[name='+tabId+']').parent('a').find('img').attr('src', data.grid[i][j].img);
					}
				    }
				}
				$('#form-submit').find('[type=submit]').attr('name', '');
				setTimeout(function() {location.reload();}, 3000);
			    }, 1000);
			}
			if(data.grid.length != 0) {
			    $('#grid').find('span').hide();
			}
		    });
		    $('[id^=field]').each(function() {
			$(this).val('');
		    });
		    $('.message').html('<i class="fa fa-check-circle"></i>');
		    status(data);
		} else {
		    $('.message').html('<i class="fa fa-warning"></i>');
		    status(data);
		}
	    },
	    complete: function() {
		$('#lean_overlay').hide();
		$('.TTWForm-container').hide();
	    }
	});
    });
    
    $('.TABForm').submit(function(e) {
	e.preventDefault();
	var fd = $(this);
	$.ajax({
	    type: 'POST',
	    url: fd.attr('action'),
	    data: new FormData(fd[0]),
	    processData: false,
	    contentType: false,
	    error: function(xhr, text, desc) { status(text +' '+ xhr.status +' '+ desc); },
	    success: function(data) {
		if(data.message) {
		    status(data);
		    fd.parents('.tabs').hide();
		} else {
		    status(data);
		}
	    },
	    complete: function() {
		$.getJSON('data/data.json', function(data) {
		    if(data.grid.length == 0) {
			$('#grid').html('<span>No data available!</span>');
		    }
		});
	    }
	});
    });
    
    
    
    
    function status(message) {
	if(message.error) {    
	    $('.message').html('<i class="fa fa-warning"></i>');
	    $('.message').append(message.error).show();
	} else {
	    $('.message').html('<i class="fa fa-check-circle"></i>');
	    $('.message').append(message.message).show();
	}
	setTimeout(function() {
	    $('.message').hide();
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
	top: '16px', // Top position relative to parent in px
	left: '360px' // Left position relative to parent in px
    };
    
    var spinner = new Spinner(opts).spin($('#loading')[0]);
});
