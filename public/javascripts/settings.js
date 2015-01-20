$(document).ready(function() {
	setRange($('.adj').find('[type=range]'));
	
	$('.adj').find('[type=range]').mousemove(function() {
		$('.adj').find('#rangeFac').text($(this).val());
	});
	
	$('.adj').find('[type=range]').change(function() {
		$('.adj').find('#rangeFac').text($(this).val());
		localStorage.setItem($(this).attr('type'), $(this).val());
	});
	
	$('#adjReset').click(function(e) {
		if(confirm('You are going to reset your settings to default. \nAre you sure with that?')) {
			localStorage.removeItem($('.adj').find('[type=range]').attr('type'));
			setRange($('.adj').find('[type=range]'));
		}
	});
	
	/** Set range value */
	function setRange(r) {
		if(localStorage.getItem(r.attr('type'))) {
			r.val(localStorage.getItem(r.attr('type')));
			$('.adj').find('#rangeFac').text(r.val());
		} else {
			r.val(1);
			$('.adj').find('#rangeFac').text('1');
		
		}
	}
});