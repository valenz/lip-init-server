$(document).ready(function() {
	$('.opt-open').mouseenter(function(e) {
		$(this).nextAll('.opt').first().show();
		$(this.previousSibling).nextAll('.opt-open').first().hide();
	});
	
	$('.opt-open').mouseleave(function() {
		$(this).css('background', 'transparent');
		$(this.firstChild).attr('src', '../images/arrow-8-888.ico');
	});
	
	$('.tabs').mouseleave(function(e) {
		$(this.firstChild.nextSibling).nextAll('.opt').first().hide();
		$(this.firstChild).nextAll('.opt-open').first().show();
	});
	
	
	
	
	$('.btn-edit').mouseleave(function() {
		$(this).attr('src', '../images/edit-16-888.ico');
	});
	
	$('.btn-edit').mouseenter(function() {
		$(this).attr('src', '../images/edit-16-2B8000.ico');
	});
	
	$('.btn-edit').click(function() {
		// TODO
		console.log('edit');
	});
	
	
	
	
	$('.btn-del').mouseleave(function() {
		$(this).attr('src', '../images/delete-16-888.ico');
	});
	
	$('.btn-del').mouseenter(function() {
		$(this).attr('src', '../images/delete-16-E65C00.ico');
	});
	
	$('.btn-del').click(function() {
		// TODO
		console.log('delete');
	});
});
