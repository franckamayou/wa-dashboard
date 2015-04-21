(function($) {
  $(function () {

    $('.chart').each(function() {

      var bgColor = $(this).attr('data-bgcolor');
      bgColor = bgColor ? bgColor : '#fff';
      var legendEnabled = $(this).attr('data-legend-enabled');
      legendEnabled = legendEnabled ? legendEnabled : false;

      $(this).highcharts({
        chart: {
          backgroundColor: bgColor,
          spacingLeft: 0,
          spacingRight: 0,

          style: {
            fontFamily: '"Lato", sans-serif',
            color: '#34495e'
          }
        },

        title: {
          text: ''
        },
        
        xAxis: {
          categories: ['Q1', 'Q2', 'Q3', 'Q4'],
          lineColor: '#ddd',
          tickWidth: 0,

          labels: {
            y: 20
          }
        },
    
        yAxis: {
          
          title: {
            text: ''
          },
          
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }],

          gridLineColor: '#eef0f0'

        },
        
        legend: {
          align: 'right',
          verticalAlign: 'top',
          x: -10,
          y: 10,
          floating: true,
          borderColor: null,
          
          itemStyle: {
            fontFamily: '"Lato", sans-serif',
            color: '#34495e'
          },

          enabled: legendEnabled
        },

        tooltip: {
          //valuePrefix: '$',
          //headerFormat: '<span style="font-size: 11px">{point.key} deaths</span><br/>',
          borderColor: '#2980B9',

          style: {
            color: '#34495E'
          }
        },

        series: [{
          name: '38107',
          color: '#3498DB',
          data: [402,424,397,278]
        }],

        style: {
          fontFamily: 'Lato, sans-serif', 
          fontSize: '12px',
          color: '#34495e'
        },

        plotOptions: {
          series: {
            marker: {
              enabled: false,
              symbol: "circle",
              fillColor: '#FFFFFF',
              lineWidth: 2,
              lineColor: null // inherit from series*/
            }
          }
        },
        
        credits: {
          enabled: false
        }

      });   

    });     
  });
})(jQuery);