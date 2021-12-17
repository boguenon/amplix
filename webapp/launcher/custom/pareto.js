IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "Pareto",
		charttype: "pareto",
		subtype: "pareto",
		img: "chart_pareto",
		grp: "quality"
	}
);

IG$.__chartoption.chartext.pareto = function(owner) {};

IG$.__chartoption.chartext.pareto.prototype = {
	drawChart: function(owner, results) {
		var me = this,
			container = owner.container,
			jcontainer = $(container),
			cop = owner.cop,
			data = results._tabledata,
			colfix = results.colfix,
			colcnt = results.colcnt,
			rowfix = results.rowfix,
			rowcnt = results.rowcnt,
			opt,
			c_cset = cop.colorset || results.c_cset,
			masterChart,
			sr,
			cols = colcnt - colfix,
			tinc = (100 / cols),
			tincpx = Math.max(200, jcontainer.height() / cols),
			tgap = 50,
			ty = tgap,
			chartarea;
			
		if (colfix < 1)
		{
			IG$.ShowError("Parato chart need xaxis item", me);
			return;
		}
		
		if (cols < 1)
		{
			IG$.ShowError("Parato chart need yaxis item", me);
			return;
		}
		
		if (!window.echarts)
		{
			IG$.ShowError("This need apache echarts module!", me);
			return;
		}
		
		me.destroy();
		jcontainer.empty();
		
		chartarea = $("<div></div>").appendTo(jcontainer);
		
		chartarea.css({
			position: "relative",
			width: "100%"
		});
		
		jcontainer.css({
			overflowY: "auto"
		});
		
		opt = {
			chart: {
				renderTo: chartarea[0],
				echart_theme: cop.echart_theme
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross"
				}
			},
			grid: [],
			xAxis: [],
			yAxis: [],
			series: []
		};
		
		for (sr=colfix; sr < colcnt; sr++)
		{
			var t = sr - colfix,
				gridindex = opt.grid.length,
				xaxis = {
					type: "category",
					axisTick: {
						alignWithLabel: true
					},
					axisLabel: {
						maxStaggerLines: 2,
						formatter: function(value, index) {
							return value;
						}
					},
					data: [],
					gridIndex: gridindex
				},
				yaxis1 = {
					type: "value",
					name: "value",
					position: "left",
					axisLabel: {
						formatter: cop.yaxisformat ? function(value, index) {
							var yaxisformat = cop.yaxisformat;
							return IG$.NumberFormat(yaxisformat, value);
						} : null
					},
					gridIndex: gridindex
				},
				yaxis2 = {
					type: "value",
					name: "incremental",
					offset: 0,
					position: "right",
					axisLabel: {
						formatter: cop.yaxisformat ? function(value, index) {
							var yaxisformat = cop.yaxisformat;
							return IG$.NumberFormat(yaxisformat, value);
						} : null
					},
					gridIndex: gridindex
				},
				series1 = {
					name: "value",
					type: "bar",
					xAxisIndex: opt.xAxis.length,
					yAxisIndex: opt.yAxis.length,
					data: []
				},
				series2 = {
					name: "incremental",
					type: "line",
					xAxisIndex: opt.xAxis.length,
					yAxisIndex: opt.yAxis.length + 1,
					data: []
				},
				grid = {
					right: "5%",
					left: "5%"
					// top: (tinc * t) + "%",
					// bottom: tinc * (colcnt - sr - 1) + "%"
				};
			
			if (cols > 1)
			{
				grid.top = ty + "px";
				grid.height = tincpx + "px";
			}
			ty += tincpx + tgap;
			
			opt.grid.push(grid);
			opt.xAxis.push(xaxis);
			opt.yAxis.push(yaxis1);
			opt.yAxis.push(yaxis2);
			opt.series.push(series1);
			opt.series.push(series2);
			
			var tval = 0,
				sdata = [];
			
			$.each(data, function(i, row) {
				var cname,
					v1,
					v2;
				
				if (i < rowfix)
				{
					yaxis1.name = row[sr].text;
					yaxis2.name = row[sr].text;
					series1.name = row[sr].text;
					series2.name = row[sr].text + "(%)";
					return;
				}
				
				$.each(row, function(j, cell) {
					var cval = cell.text || cell.code,
						nval;
					if (j < colfix) // category
					{
						cname = (j == 0) ? cval : cname + " " + cval; 
					}
					else if (j == sr) // one metric
					{
						nval = Number(cell.code || cell.text);
						
						if (isNaN(nval) == false)
						{
							tval += nval;
						}
						
						v1 = nval;
						v2 = tval;
					}
				});
				
				xaxis.data.push(cname);
				series1.data.push(v1);
				sdata.push(v2);
			});
			
			$.each(sdata, function(i, v) {
				var sv = v / tval * 100;
				series2.data.push(sv);
			});
		}
		
		if (cols > 1)
		{
			chartarea.height(ty);
		}
		else
		{
			chartarea.height(jcontainer.height());
		}
		
		if (IG$.__chartoption && IG$.__chartoption.chartcolors && IG$.__chartoption.chartcolors[c_cset])
		{
			opt.color =  IG$.__chartoption.chartcolors[c_cset];
		}
		
		me.createChart(opt);
	},
	
	createChart: function(opt) {
		var me = this,
			masterChart = echarts.init(opt.chart.renderTo, opt.chart.echarts_theme || ig$.echarts_theme || 'amplix', {
				renderer: "canvas" // "svg"
			});
		
		masterChart.setOption(opt);
		
		masterChart.on("pieselectchanged", function(params) {
			
		});
		
		masterChart.on("click", function(params) {
			if (params.componentType == "series")
			{
				_chartview.procClickEvent(
					{
						series: {
							name: params.seriesName,
							type: params.seriesType
						}
					}, 
					{
					point: params.data
					}
				);
			}
		});
		
		masterChart.on("brushselected", function(params) {
			
		});
		
		me.dmain_opt = opt;
		me.dmain = masterChart;
	},
	
	updatedisplay: function(owner, w, h) {
		var me = this,
			dmain = me.dmain,
			dmain_opt = me.dmain_opt;
		
		if (dmain_opt && dmain_opt.grid.length == 1)
		{
			$(dmain.renderTo).css({
				width: w,
				height: h
			});
			dmain.resize.call(dmain, {width: w, height: h});
		}
		else
		{
			if (dmain)
			{
				dmain && dmain.destroy && dmain.destroy();
				dmain && dmain.dispose && dmain.dispose();
				me.dmain = null;
			}
			
			if (dmain_opt)
			{
				var cols = dmain_opt.grid.length,
					tincpx = Math.max(200, h / cols),
					tgap = 50,
					ty = tgap;
				
				$.each(dmain_opt.grid, function(i, grid) {
					grid.top = ty + "px";
					grid.height = tincpx + "px";
					ty += tincpx + tgap;
				});
				
				me.createChart(dmain_opt);
			}
		}
	},
	
	destroy: function() {
		var me = this,
			dmain = me.dmain;
		
		dmain && dmain.destroy && dmain.destroy();
		dmain && dmain.dispose && dmain.dispose();
		me.dmain = null;
		me.dmain_opt = null;
	}
};