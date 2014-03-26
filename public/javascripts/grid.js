$(document).ready(function() {
	$('.opt-open').mouseenter(function(e) {
		$(this).hide();
		$(this).nextAll().first().show();
	});
	
	$('.tabs').mouseleave(function(e) {
		$(this).find('.opt-open').nextAll().first().hide();
		$(this).find('a').nextAll().first().show();
	});
	
	
	
	
	$('.btn-edit').mouseleave(function() {
		$(this).attr('src', '../images/edit-16-888.ico');
	});
	
	$('.btn-edit').mouseenter(function() {
		$(this).attr('src', '../images/edit-16-2B8000.ico');
	});
	
	$('.btn-edit').click(function() {
		var arr = new Array();
		arr[0] = $(this).parents('.tabs').find('input').attr('value');
		arr[1] = $(this).parents('.tabs').find('a').attr('href');
		arr[2] = $(this).parents('.tabs').find('p').text();
		$('.TTWForm-container').css('display', 'block');
		$('[name^=tabText]', '[id^=field]').each(function(key) {
			$(this).val(arr[key]);
		});
		$('#form-submit').find('[type=submit]').attr('value', 'Edit');
		$('#form-submit').find('[type=submit]').attr('name', $(this).parents('.tabs').find('input').attr('name'));
	});
	
	
	
	
	$('.btn-del').mouseleave(function() {
		$(this).attr('src', '../images/delete-16-888.ico');
	});
	
	$('.btn-del').mouseenter(function() {
		$(this).attr('src', '../images/delete-16-E65C00.ico');
	});
	
	$('.btn-del').click(function(e) {
		if(confirm('You are going to delete the tab '+$(this).parents('.tabs').find('input').first().attr('value')+'.\nAre you sure with that?')) {
			$(this).parents('form').submit();
		}
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
		    $('.message').text(message);
	}
});
