$(document).ready(function() {
  /** Make tabs sortable */
  $('.grid').sortable({
    containment: $('.grid'),
    start: handleDragStart,
    stop: handleDragStop
  });

  //localStorage.setItem('grid', JSON.stringify(init()));
  var orig = init();



  if(localStorage.getItem('modified') == 'true') {
    // TODO
    // Update each tab individually

    /** Get local storage */
    var self = JSON.parse(localStorage.getItem('self')),
        //orig = JSON.parse(localStorage.getItem('grid')),
        str = '';
    update(orig, self);
    for(var sort1 in self) {
      for(var tab1 in self[sort1]) {
        str += self[sort1][tab1];
      }
    }

    $('.grid').html(str);
  }



  function update(x, y) {
    var grid = new Object();
    var a = new Array();
    var b = new Array();
    var xProps = Object.getOwnPropertyNames(x);
    var yProps = Object.getOwnPropertyNames(y);
    console.log(x);
    console.log(y);

    for(var i = 0; i < yProps.length; i++) {
      var propName = yProps[i];

      console.log(y[propName]);

      for(var key in y[propName]) {
        b.push(key);
      }

      for(var key in x[propName]) {
        a.push(key);
      }

      for(var j in b) {
        for(var k in a) {
          if(b[j] == a[k]) {
            console.log(k);
          }
        }
      }

      if(y[propName] !== x[propName]) {
        //console.log(false);
      }
    }

    console.log(a);

    //localStorage.setItem('test', JSON.stringify(grid));

    /*for(p in x, y) {
				for(q in x[p], y[p]) {
					$('li.tabs').each(function(key, value) {
						if($(this).find('[type=hidden]').attr('value') == q) {
							console.log(key);
						}
					});
				}
			}*/
  }

  function handleDragStart(event, ui) {
    // TODO
    // What should happen when starting the drag event
  }

  function handleDragStop(event, ui) {
    localStorage.setItem('self', JSON.stringify(init()));
    localStorage.setItem('modified', true);
  }

  /** Initialize default grid */
  function init() {
    var grid = new Object();
    $('li.tabs').each(function(key, value) {
      var tab = new Object();
      tab[$(this).find('[type=hidden]').attr('value')] = value.outerHTML;
      grid[key] = tab;
    });
    return grid;
  }
});
