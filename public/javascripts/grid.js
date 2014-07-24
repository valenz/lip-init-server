$(document).ready(function() {
	/** Show option buttons on tabs */
	$('li.tabs').mouseenter(function(e) {
		$(this).find('[class^=btn]').css('display', 'block');
	});
	$('li.tabs').mouseleave(function(e) {
		$(this).find('[class^=btn]').css('display', 'none');
	});



	$('.pic').error(function(){
		$(this).hide();
	        $(this).parents('img-container').css('background-color', '#FFFFFF');
	});
	
	
	
	
	/** Edit tab */
	$('.btn-edit').click(function() {
		var arr = new Array();
		arr[0] = $(this).parents('.tabs').find('a').attr('href');
		arr[1] = $(this).parents('.tabs').find('h5').text();
		$('.TTWForm').find('[type=hidden]').val($(this).parents('.tabs').find('input').attr('value'));
		$('[name^=tabText]', '[id^=field]').each(function(key) {
			$(this).val(arr[key]);
		});
		$('.TTWForm').find('[type=hidden]').attr('name', 'edit');
		$('#submit').show();
		$('#tab-add').click();
	});
	
	
	
	
	/** Delete tab */
	$('.btn-del').click(function() {
		if(confirm('You are going to delete the tab '+$(this).parents('.tabs').find('input').first().attr('value')+'.\nAre you sure with that?')) {
			$(this).parents('form').submit();
			/*if(localStorage.length == $('#grid').attr('data-length')) {
				console.log('delete element from storage')
				for(var i in localStorage) {
					if($(this).parents('.tabs').attr('id') == i) {
						localStorage.removeItem(i);
					}
				}
			}*/
		}
	});
});
