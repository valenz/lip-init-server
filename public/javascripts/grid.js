$(document).ready(function() {
	/** Show option buttons on tabs */
	$('li.tabs').mouseenter(function(e) {
		$(this).find('[class^=btn]').css('display', 'block');
	});
	$('li.tabs').mouseleave(function(e) {
		$(this).find('[class^=btn]').css('display', 'none');
	});
	
	
	
	/** Tabs range settings */
	var liWidth = parseInt($('#grid li').css('width'));
	var imgContainerWidth = parseInt($('.img-container').css('width'));
	var imgContainerHeight = parseInt($('.img-container').css('height'));
	var h5Width = parseInt($('li h5').css('width'));
	var h5Size = parseInt($('li h5').css('font-size'));
	var h5Bottom = parseInt($('li h5').css('bottom'));
	var factor = 1+(localStorage.getItem('range'))/100;
	$('#grid li').each(function(key) {
		$(this).css('width', Math.floor(liWidth*factor)+'px');
	});
	$('.img-container').each(function(key) {
		$(this).css('width', Math.floor(imgContainerWidth*factor)+'px');
		$(this).css('height', Math.floor(imgContainerHeight*factor)+'px');
	});
	$('.pic').each(function(key) {
		$(this).css('width', Math.floor(imgContainerWidth*factor)+'px');
		$(this).css('height', Math.floor(imgContainerHeight*factor)+'px');
	});
	$('li h5').each(function(key) {
		$(this).css('width', Math.floor(h5Width*factor)+'px');
		$(this).css('font-size', Math.floor(h5Size*factor)+'px');
		$(this).css('bottom', Math.floor(h5Size/factor)+'px');
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
		if(confirm('You are going to delete the tab '+$(this).parents('.tabs').find('input').first().attr('value')+'. \nAre you sure with that?')) {
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
