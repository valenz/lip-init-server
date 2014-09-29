$(document).ready(function() {
	/** Make tabs sortable */
	$('#grid').sortable({
		containment: $('#grid'),
		start: handleDragStart,
		stop: handleDragStop
	});
	
	var obj = new Object(),
		grid = new String();
	
	
	
	if(localStorage.getItem('modified')) {
		/** Get local storage */
		for(var i = 0; i < $('#grid').attr('data-length'); i++) {
			if(String(i).length == 1) i = '0'+String(i);
			grid += localStorage[i];
		}
		$('#grid').html(grid);
	} else {
		/** Initialize default grid */
		$('li.tabs').each(function(key, value) {
			if(String(key).length == 1) key = '0'+String(key);
			localStorage.setItem(key, value.outerHTML);
			obj[key] = value.outerHTML;
		});
	}
	
	
	
	function handleDragStart(event, ui) {
		//TODO
	}
	
	function handleDragStop(event, ui) {
		$('li.tabs').each(function(key, value) {
			if(String(key).length == 1) key = '0'+String(key);
			localStorage.setItem(key, value.outerHTML);
			obj[key] = value.outerHTML;
		});
		localStorage.setItem('modified', true);
	}
});