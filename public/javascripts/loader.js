$(document).ready(function() {
	/** Spinning load icon while submit */
    var $loading = $('#loading').hide();
	$(document).ajaxStart(function() {
		$('.submit').find('[type=submit]').attr('disabled', true);
		$('#submit').hide();
		$loading.show();
	}).ajaxStop(function() {
		$('.submit').find('[type=submit]').attr('disabled', false);
		$('#submit').show();
		$loading.hide();
    });
    
    var options = {
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
    
    var spinner = new Spinner(options).spin($loading[0]);
});