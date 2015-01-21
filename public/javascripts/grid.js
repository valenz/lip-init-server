$(document).ready(function() {
	/** Show option buttons on tabs */
	$('li.tabs').mouseenter(function(e) {
		$(this).find('[class^=btn]').css('display', 'block');
	});
	$('li.tabs').mouseleave(function(e) {
		$(this).find('[class^=btn]').css('display', 'none');
	});

	/** Tabs range settings */
	var liWidth = 182;
	var imgContainerWidth = 182;
	var imgContainerHeight = 101;
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
	
	/* Sets different stylesheets for different sized browser windows */
	function adjustStyle(width) {
		width = parseInt(width);
		if (width < 480) {
			$("#size-stylesheet").attr("href", "/stylesheets/320.css");
		} else if ((width >= 481) && (width < 640)) {
			$("#size-stylesheet").attr("href", "/stylesheets/480.css");
		} else if ((width >= 641) && (width < 800)) {
			$("#size-stylesheet").attr("href", "/stylesheets/640.css");
		} else if ((width >= 801) && (width < 1024)) {
			$("#size-stylesheet").attr("href", "/stylesheets/style.css");
		} else if ((width >= 1025) && (width < 1152)) {
			$("#size-stylesheet").attr("href", "/stylesheets/1024.css");
		} else {
			$("#size-stylesheet").attr("href", "/stylesheets/1152.css");
		} 
	}

	$(function() {
		adjustStyle($(this).width());
		$(window).resize(function() {
			adjustStyle($(this).width());
		});
	});
});
