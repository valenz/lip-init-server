$(document).ready(function() {
	/** Show option buttons on tabs */
	$('.tabs').mouseenter(function(e) {
		$(this).find('[class^=btn]').css('visibility', 'visible');
	});
	$('.tabs').mouseleave(function(e) {
		$(this).find('[class^=btn]').css('visibility', 'hidden');
	});
	
	
	
	
	/** Edit tab */
	$('.btn-edit').click(function() {
		var arr = new Array();
		arr[0] = $(this).parents('.tabs').find('a').attr('href');
		arr[1] = $(this).parents('.tabs').find('input').attr('value');
		$('.TTWForm').find('[type=hidden]').val($(this).parents('.tabs').find('input').attr('name'));
		$('[name^=tabText]', '[id^=field]').each(function(key) {
			$(this).val(arr[key]);
		});
		$('.TTWForm').find('[type=hidden]').attr('name', 'edit');
		$('#tab-add').click();
	});
	
	
	
	
	/** Delete tab */
	$('.btn-del').click(function() {
		if(confirm('You are going to delete the tab '+$(this).parents('.tabs').find('input').first().attr('value')+'.\nAre you sure with that?')) {
			$(this).parents('form').submit();
		}
	});
	
	
	
	
	/** Auto reload (1 minute = 60000) */
	setTimeout(function() {location.reload();}, (60000*30));
});
