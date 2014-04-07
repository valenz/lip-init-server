$(document).ready(function() {
	/** Make tabs sortable */
	$('#grid').sortable({
		containment: $('#grid'),
		start: handleDragStart,
		stop: handleDragStop
	});
	
	
	
	
	function handleDragStart(event, ui) {
		$('[class^=btn]').hide();
		
	}
	function handleDragStop(event, ui) {
		$('li.tabs').each(function(key, value) {
			$(this).attr('id', key);
			localStorage.setItem(key, value.outerHTML);
		});
	}
	
	
	
	
	if(localStorage.length > 0) {
		if(localStorage.length < $('#grid').attr('data-length')) {
			$('li.tabs').each(function(key, value) {
				if(key == $('#grid').attr('data-length')-1) {
					localStorage.setItem(key, value.outerHTML);
				}
			});
		}
		var grid = '';
		for(var i in localStorage) {
			grid += localStorage.getItem(i);
		}
		$('#grid').html(grid);
	}
	
	console.log(localStorage.getItem(0));
});
