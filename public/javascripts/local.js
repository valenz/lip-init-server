$(document).ready(function() {
	
	var data = new Object();
	
	$('li.tabs').each(function(key) {
		//var item = JSON.parse(localStorage.getItem(tabId));
		
		data["id"] = $(this).find('input').attr('name');
		data["name"] = $(this).find('input').attr('value');
		data["url"] = $(this).find('a').attr('href');
		data["title"] = $(this).find('a').attr('title');
		data["icon"] = $(this).find('img.icon').attr('src');
		data["img"] = $(this).find('img.pic').attr('src');
		
		console.log(data)
		
		localStorage.setItem(key, JSON.stringify(data));
	});
	
	console.log(localStorage.length);
	for(var i in localStorage) {
		console.log(JSON.parse(localStorage[i]).id);
	}
});
