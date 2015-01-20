$(document).ready(function() {
	/** Show option buttons on tabs */
	$('li.tabs').mouseenter(function(e) {
		$(this).find('[class^=btn]').css('display', 'block');
	});
	$('li.tabs').mouseleave(function(e) {
		$(this).find('[class^=btn]').css('display', 'none');
	});

	/** Tabs range settings */
	var liWidth = 146;
	var imgContainerWidth = 144;
	var imgContainerHeight = 81;
	var h5Width = 146;
	var h5Size = 12;
	var h5Bottom = 2;
	var factor = localStorage.getItem('range') ? localStorage.getItem('range') : 1;
	$('.tabs').each(function(key) {
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
	$('.tabs h5').each(function(key) {
		$(this).css('width', Math.floor(h5Width*factor)+'px');
		$(this).css('font-size', Math.floor(h5Size*factor)+'px');
		$(this).css('bottom', Math.floor(h5Size/factor)+'px');
	});
});
