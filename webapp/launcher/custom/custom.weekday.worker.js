IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.chartext.weekday.prototype.initChart = function(seriesdata) {
	// https://echarts.apache.org/examples/en/editor.html?c=heatmap-cartesian
	
    var myChart = this.customchart,
    	option;
    
    var hours = seriesdata.hours;
	var days = seriesdata.days;
	
	var data = seriesdata.data;
	
	data = data.map(function (item) {
	    return [item[1], item[0], item[2] || '-'];
	});
	
	option = {
	    tooltip: {
	        position: 'top'
	    },
	    grid: {
	        height: '50%',
	        top: '10%'
	    },
	    xAxis: {
	        type: 'category',
	        data: hours,
	        splitArea: {
	            show: true
	        }
	    },
	    yAxis: {
	        type: 'category',
	        data: days,
	        splitArea: {
	            show: true
	        }
	    },
	    visualMap: {
	        min: seriesdata.min,
	        max: seriesdata.max,
	        calculable: true,
	        orient: 'horizontal',
	        left: 'center',
	        bottom: '15%'
	    },
	    series: [{
	        name: 'Punch Card',
	        type: 'heatmap',
	        data: data,
	        label: {
	            show: true
	        },
	        emphasis: {
	            itemStyle: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	        }
	    }]
	};
    
    myChart.setOption(option);
}

IG$.__chartoption.chartext.weekday.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop;
	
	me.owner = owner;
	me.container = container;
		
	if (results)
	{
		var colfix,
			rowfix,
			rows,
			cols,
			i, j,
			data = results._tabledata,
			cop = owner.cop,
			tval,
			d, dl, n = 0, pd,
			hours = [],
			days = [],
			mapdata = [],
			vmin, vmax,
			dval;
		
		cols = results.colcnt;
		rows = data.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		if (colfix == 0)
		{
			return;
		}
		
		for (i=colfix; i < cols; i++)
		{
			d = [];
			for (j=0; j < rowfix; j++)
			{
				tval = data[j][i].text || data[j][i].code;
				d.push(tval);
			}
			
			hours.push(d.join(" "));
		}
		
		for (i=rowfix; i < rows; i++)
		{
			d = [];
			for (j=0; j < colfix; j++)
			{
				tval = data[i][j].text;
				d.push(tval);
			}
			
			days.push(d.join(" "));
			
			for (j=colfix; j < cols; j++)
			{
				dval = data[i][colfix].code ? Number(data[i][colfix].code) : NaN;
				
				if (!isNaN(dval))
				{
					mapdata.push([i - rowfix, j - colfix, dval]); // j-colfix, i - rowfix, dval]);
					
					if (isNaN(vmin))
					{
						vmin = vmax = dval;
					}
					else
					{
						vmin = Math.min(vmin, dval);
						vmax = Math.max(vmax, dval);
					}
				}
			}
		}
		
		if (!me.customchart)
		{
			me.customchart = echarts.init(me.container[0], ig$.echarts_theme || 'amplix', {
				renderer: "svg"
			});
		}
			
		me.initChart({hours: hours, days: days, data: mapdata, min: vmin, max: vmax});
	}
};

IG$.__chartoption.chartext.weekday.prototype.updatedisplay = function(owner, w, h) {
	var me = this,
		customchart = me.customchart;
	
	if (customchart)
	{
		customchart.resize({width: w, height: h});
	}
}

IG$.__chartoption.chartext.weekday.prototype.dispose = function() {
	var me = this,
		customchart = me.customchart;
		
	if (!customchart)
		return;
		
	try
	{
		customchart.destroy && customchart.destroy();
		customchart.dispose && customchart.dispose();
	}
	catch (e)
	{
	}
	
	me.customchart = null;
}