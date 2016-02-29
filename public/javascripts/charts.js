$(function () {
  // Get data
  var dataCategories = JSON.parse($('#chart_pie').attr('data-categories'));
  var dataTabsLength = $('#chart_pie').attr('data-tabs-length');

  // Prepare data
  var colors = Highcharts.getOptions().colors;
  var categoryNames = [];
  var score = [];
  var data = [];

  for (var cats in dataCategories) {
    categoryNames.push(dataCategories[cats].name);
    var tabNames = [];
    var tabPrefers = [];
    var tabPrefersValue = 0;
    var tabPrefersPercent = [];
    for (var tabs in dataCategories[cats].list) {
      var t = dataCategories[cats].list[tabs];
      tabNames.push(t.name);
      tabPrefers.push(t.prefer);
      score.push(t.prefer);
      tabPrefersValue += t.prefer;
    }

    var o = {};
    o.y = dataTabsLength > 0 ? +(dataCategories[cats].list.length /
     dataTabsLength * 100).toFixed(2) : 100;
    o.color = colors[cats];
    o.drilldown = {};
    o.drilldown.name = dataCategories[cats].name;
    o.drilldown.categories = tabNames;
    for (tabs in dataCategories[cats].list) {
      if (tabPrefersValue > 0) {
        tabPrefersPercent.push(+(dataCategories[cats].list[tabs].prefer /
         tabPrefersValue * o.y).toFixed(2));
      } else {
        tabPrefersPercent.push(o.y);
      }
    }

    o.drilldown.views = tabPrefers;
    o.drilldown.data = tabPrefersPercent;
    o.drilldown.color = colors[cats];
    data.push(o);
  }

  if (data.length) {

    score = unique(score.sort(function (a, b) {return b - a;}));

    var categories = categoryNames;
    var tabsData = [];
    var favsData = [];
    var i;
    var j;
    var dataLen = data.length;
    var drillDataLen;
    var brightness;

    // Build the data arrays
    for (i = 0; i < dataLen; i++) {

      // add tab data
      tabsData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color,
      });

      // add favorite data
      drillDataLen = data[i].drilldown.data.length;
      for (j = 0; j < drillDataLen; j++) {
        brightness = 0.2 - (j / drillDataLen) / 5;
        favsData.push({
          name: data[i].drilldown.categories[j],
          y: data[i].drilldown.data[j],
          views: data[i].drilldown.views[j],
          color: Highcharts.Color(data[i].color).brighten(brightness).get(),
        });
      }
    }

    // Create the chart
    $('#chart_pie').highcharts({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Favorite Tabs',
      },
      plotOptions: {
        pie: {
          shadow: false,
          center: ['50%', '45%'],
        },
      },
      series: [
        {
          name: 'Tabs',
          data: tabsData,
          size: '75%',
          tooltip: {
            valueDecimals: 2,
            valueSuffix: '%',
          },
          dataLabels: {
            color: 'white',
            enabled: true,
            style: {
              textShadow: '0 0 6px black, 0 0 3px black',
            },
            formatter: function () {
              var l = dataCategories.length;
              return this.y >= Math.floor(2 / l * (l - Math.log(l)) * 10) - 1 ?
               this.point.name : null;
            },

            distance: -40,
          },
        },
        {
          name: 'Favorites',
          data: favsData,
          size: '100%',
          innerSize: '75%',
          tooltip: {
            useHTML: true,
            pointFormat:
              '<span style="color: {point.color};">\u25CF</span> ' +
              '{series.name}: <b>{point.views} Views ({point.y}%)</b><br/>',
          },
          dataLabels: {
            formatter: function () {
              // display only the three highest views
              if (score.length > 2) {
                return this.point.views >= score[2] ? '<b>' + this.point.name +
                 '</b>' + '<br>' + this.point.views + ' Views (' + this.y + '%)' : null;
              } else {
                return '<b>' + this.point.name + '</b>' + '<br>' +
                 this.point.views + ' Views (' + this.y + '%)';
              }
            },

            y: -6,
          },
        },
      ],
    });
  }
});

/**
 * Removes duplicate items of an array and returns the new one.
 */
function unique(a) {
  return $.grep(a, function (el, i) {
    return i === $.inArray(el, a);
  });
}
