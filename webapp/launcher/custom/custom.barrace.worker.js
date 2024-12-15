IG$.cVis.barrace.prototype.drawBarChartRace = function() {
	var me = this,
		chartview = me.chartview,
		results = me.results,
		container = $(chartview.container),
		sop = chartview._ILb,
		cop = chartview.cop,
		i, j,
		rdata = results._tabledata,
		jcontainer,
		data = [],
		colfix = results.colfix,
		rowfix = results.rowfix,
		cols = results.cols,
		rec, d, t,
		width,
		height, vmin, vmax, fmin = 10, fmax = 90, fratio,
		myChart,
		option,
		years = [],
		data,
		updateFrequency = 2000,
		startIndex = 0,
		startYear,
		countryColors = {};
		
	function getFlag(countryName) {
		if (!countryName) {
			return '';
		}
		return (
			flags.find(function (item) {
				return item.name === countryName;
			}) || {}
		).emoji;
	}

	option = {
			grid: {
				top: 10,
				bottom: 30,
				left: 150,
				right: 80
			},
			xAxis: {
				max: 'dataMax',
				axisLabel: {
					formatter: function (n) {
						return Math.round(n) + '';
					}
				}
			},
			dataset: {
				source: data.filter(function (d) {
					return d[4] === startYear;
				})
			},
			yAxis: {
				type: 'category',
				inverse: true,
				max: 10,
				axisLabel: {
				show: true,
				fontSize: 14,
				formatter: function (value) {
					return value + '{flag|' + getFlag(value) + '}';
				},
				rich: {
					flag: {
					fontSize: 25,
					padding: 5
					}
				}
				},
				animationDuration: 300,
				animationDurationUpdate: 300
			},
			series: [
				{
					realtimeSort: true,
					seriesLayoutBy: 'column',
					type: 'bar',
					itemStyle: {
						color: function (param) {
							return countryColors[param.value[3]] || '#5470c6';
						}
					},
					encode: {
						x: "name",
						y: "value"
					},
					label: {
						show: true,
						precision: 1,
						position: 'right',
						valueAnimation: true,
						fontFamily: 'monospace'
					}
				}
			],
			// Disable init animation.
			animationDuration: 0,
			animationDurationUpdate: updateFrequency,
			animationEasing: 'linear',
			animationEasingUpdate: 'linear',
			graphic: {
				elements: [
					{
					type: 'text',
					right: 160,
					bottom: 60,
					style: {
						text: startYear,
						font: 'bolder 80px monospace',
						fill: 'rgba(100, 100, 100, 0.25)'
					},
					z: 100
					}
					]
			}
		};
	
	container.empty();
	jcontainer = $("<div class='igc-tg-gr'></div>").appendTo(container);
	
	width = container.width();
	height = container.height();
	jcontainer.width(width);
	jcontainer.height(height);
	
	for (i=rowfix; i < rdata.length; i++)
	{
		rec = rdata[i];
		d = {};
		d.name = rec[colfix-1].text || rec[colfix-1].code; 
		d.date = rec[0].text || rec[0].code;

		years.push(d.date);
		
		if (colfix > 2)
		{
			d.category = rec[1].text || rec[1].code;
		}
		else
		{
			d.category = "";
		}
		
		if (rec[colfix])
		{
			t = rec[colfix].code;
			if (!t)
				continue;
			d.value = Number(t);
			
			if (isNaN(d.value))
				continue;
		}
		data.push(d);
	}

	startYear = data[startIndex].date;

	function updateYear(year) {
		let source = data.filter(function (d) {
			return d.date === year;
		});
		option.series[0].data = source;
		option.graphic.elements[0].style.text = year;
		myChart && myChart.setOption(option);
	}

	for (let i = startIndex; i < years.length - 1; ++i) {
		(function (i) {
			setTimeout(function () {
				updateYear(years[i + 1]);
			}, (i - startIndex) * updateFrequency);
		})(i);
	}
	
	if (window.echarts)
	{
		myChart = me.customchart = echarts.init(jcontainer[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
			renderer: "svg"
		});

		me.customchart.setOption(hoption);
	}
	
}

IG$.cVis.barrace.prototype.draw = function(results) {
	var me = this;
	me.results = results;
	
	me.drawBarChartRace();
};
	  
IG$.cVis.barrace.prototype.updatedisplay = function(w, h) {
	var me = this;
	
	if (me.chartview && me.results)
	{
		me.drawBarChartRace();
	}
};

IG$.cVis.barrace.prototype.dispose = function() {
    var me = this,
		customchart = me.customchart;
		
	if (customchart)
	{
		customchart.destroy && customchart.destroy();
		customchart.dispose && customchart.dispose();
		me.customchart = null;
	}
};