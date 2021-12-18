IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.chartext.weekday.prototype.initChart = function(seriesdata) {
	// https://echarts.apache.org/examples/en/editor.html?c=heatmap-cartesian
	
    var me = this,
    	myChart = me.customchart,
    	option,
    	hours = seriesdata.hours,
		days = seriesdata.days,
		data = seriesdata.data,
		mcr = seriesdata.mcr,
		ctitle, cgrid, clegend,
		titleposition = mcr.titleposition || "",
		legendposition,
		container = me.container,
		w = $(container).width(),
		h = $(container).height();
	
	data = data.map(function (item) {
	    return [item[1], item[0], item[2] || '-'];
	});
	
	option = {
	    tooltip: {
	        position: 'top'
	    },
	    grid: {
	    	left: 10,
	    	top: 10,
	    	bottom: 10,
	    	right: 10,
	    	containLabel: true
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
	        bottom: 10 // '15%'
	    },
	    series: [{
	        name: 'wday_serie',
	        type: 'heatmap',
	        data: data,
	        label: {
	            show: mcr.dl_enable
	        },
	        emphasis: {
	            itemStyle: {
	                shadowBlur: 10,
	                shadowColor: 'rgba(0, 0, 0, 0.5)'
	            }
	        }
	    }]
	};
	
	cgrid = option.grid;
	
	if (mcr.showtitle && mcr.title)
	{
		option.visualMap.bottom = 10;
		
		ctitle = option.title = {
			text: mcr.title,
			show: true,
					
			textStyle: {
				align: "center"
			}
		};
		
		if (titleposition.indexOf("BOTTOM_") > -1)
		{
			ctitle.bottom = 10;
			cgrid.bottom += 10;
		}
		else
		{
			cgrid.top += 20;
		}

		if (titleposition.indexOf("_LEFT") > -1)
		{
			ctitle.textAlign = "left";
			ctitle.textStyle.align = "left";
			ctitle.left = 20;
		}
		else if (titleposition.indexOf("_RIGHT") > -1)
		{
			ctitle.textAlign = "left";
			ctitle.right = 120;
			ctitle.textStyle.align = "right";
		}
		else
		{
			ctitle.textAlign = "center";
			ctitle.right = "50%";
			ctitle.left = "50%";
		}
	}
	else
	{
		ctitle = option.title = {
			show: false,
			bottom: 0
		};
	}
	
	if (mcr.showlegend == true)
	{
		clegend = option.visualMap;
		legendposition = mcr.legendposition = mcr.legendposition || "BOTTOM_CENTER";
		
		if (legendposition.indexOf("BOTTOM_") > -1)
		{
			clegend.orient = "horizontal";
			if (ctitle.show && ctitle.bottom > 0)
			{
				clegend.bottom = ctitle.bottom + 30;
			}
			else
			{
				clegend.bottom = 10;
			}
			cgrid.bottom += 50;
		}
		else if (legendposition.indexOf("TOP_") > -1)
		{
			clegend.orient = "horizontal";
			clegend.top = 20; // coption.grid.top + 10;
			cgrid.top += 50;
		}
		else
		{
			clegend.orient = "vertical";
			
			if (legendposition.indexOf("_TOP") > -1)
			{
				clegend.top = 10;
			}
			else if (legendposition.indexOf("_BOTTOM") > -1)
			{
				clegend.bottom = 10;
			}
			else if (legendposition.indexOf("_CENTER") > -1)
			{
				clegend.top = h / 2;
			}
		}
		
		if (clegend.orient == "horizontal")
		{
			if (legendposition.indexOf("_RIGHT") > -1)
			{
				clegend.right = 20;
				delete clegend["left"];
			}
			else if (legendposition.indexOf("_LEFT") > -1)
			{
				clegend.left = 20; // - w / 2 + 200;
			}
		}
		else
		{
			if (legendposition.indexOf("RIGHT_") > -1)
			{
				clegend.right = 20;
				delete clegend["left"];
				cgrid.right += 100;
			}
			else if (legendposition.indexOf("LEFT_") > -1)
			{
				clegend.left = 20; // - w / 2 + 200;
				cgrid.left += 100;
			}
		}
	}
	else
	{
		option.visualMap.show = false;
		option.grid.bottom = 10;
	}
	
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
			drec,
			dval,
			nr = 0;
		
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
		
		for (i=rows-1; i >= rowfix; i--) // (rowfix; i < rows; i++)
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
				// dval = data[i][colfix].code ? Number(data[i][colfix].code) : NaN;
				drec = data[i][j];
				dval = drec.code ? Number(drec.code) : NaN;
				
				if (!isNaN(dval))
				{
					mapdata.push([nr, j - colfix, dval]); // j-colfix, i - rowfix, dval]);
					
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
			
			nr++;
		}
		
		if (!me.customchart)
		{
			me.customchart = echarts.init(me.container[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "svg"
			});
		}
			
		me.initChart({hours: hours, days: days, data: mapdata, min: vmin, max: vmax, mcr: cop});
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