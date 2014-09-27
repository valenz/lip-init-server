$(document).ready(function() {
	if(Modernizr.localstorage) {
		/** Make tabs sortable */
		$('#grid').sortable({
			containment: $('#grid'),
			start: handleDragStart,
			stop: handleDragStop
		});
		
		var grid = new Object();
		
		
		
		if(localStorage.getItem('modified')) {
			// TODO
			// Update each tab individually
			
			/** Get local storage */
			var item = JSON.parse(localStorage.getItem('grid'))
				str = '';
			for(var i in item) {
				for(var j in item[i]) {
					str += item[i][j];
				}
			}
			
			$('#grid').html(str);
		} else {
			init();
		}
		
		
		
		function handleDragStart(event, ui) {
			// TODO
			// What should happen when starting the drag event
		}
		
		function handleDragStop(event, ui) {
			init();
			localStorage.setItem('modified', true);
		}
		
		/** Initialize default grid */
		function init() {
			$('li.tabs').each(function(key, value) {
				var tab = new Object();
				tab[$(this).find('[type=hidden]').attr('value')] = value.outerHTML;
				grid[key] = tab;
			});
			localStorage.setItem('grid', JSON.stringify(grid));
		}
	}
});