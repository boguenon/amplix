IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label: "Quality Runchart",
		charttype: "runchart",
		subtype: "runchart",
		img: "chart_runchart",
		grp: "quality"
	}
);

IG$.cVis.runchart = $s.extend(IG$.cVis.base, {
	theight: 400,
	symbolsize: 12,
	getStat: function(results) {
		var me = this,
			chartview = me.chartview,
			cop = chartview.cop,
			mctrl = chartview.rpc.ownerCt,
			req = new IG$._rpc$(),
			rpt = chartview.reportoption.getCurrentPivot(),
			rsheet = chartview.sheetoption.model,
			anal_options,
			n_options = [];
		
		anal_options = rsheet.anal_options;
		
		cop.settings = cop.settings || {};
		
		n_options.push({
			name: "quality_runchart",
			description: "auto generated",
			analtype: "proc_cap_index",
			options: {
				ucl: cop.settings.m_run_ucl,
				lcl: cop.settings.m_run_lcl,
				t: cop.settings.m_run_target
			},
			input_fields: []
		});
		
		rsheet.anal_options = n_options;
		
		req.init(mctrl, 
			{
				ack: "olapservice",
				payload: {
					jobid: chartview.jobid,
					option: "pivot",
					active: "" + chartview.sheetoption.si,
					pivotresult: "F",
					analysisresult: "T"
				},
				mbody: rpt,
				meta_type: chartview.meta_type || "report"
			}, mctrl, function(jdoc) {
				rsheet.anal_options = anal_options;
				me.quality_stat = jdoc;
				me.getStatInternal(chartview, results);
			}, function(jdoc) {
				rsheet.anal_options = anal_options;
			});
		req.send();
	},
	
	getStatInternal: function(chartview, results) {
		var me = this,
			mctrl = chartview.rpc.ownerCt,
			req = new IG$._rpc$();
			
		req.init(mctrl, {
			ack: "olapservice",
			payload: { 
				option: "statistics",
				active: "" + chartview.sheetoption.si,
				jobid: chartview.jobid
			},
			mbody: {}
		}, mctrl, function(sdoc) {
			results.statistics = sdoc.statistics;
			me.drawStatResult(chartview, results);
		});
		req.send();
	},
	
	draw: function(results) {
		var me = this,
			chartview = me.chartview,
			data = results._tabledata,
			colfix = results.colfix,
			colcnt = results.colcnt,
			rowfix = results.rowfix,
			rowcnt = results.rowcnt,
			cols = colcnt - colfix;
						
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
		
		me.getStat(results);
	},
	
	drawStatResult: function(chartview, results) {
		var me = this,
			quality_stat = me.quality_stat,
			container = chartview.container,
			jcontainer = $(container),
			cop = chartview.cop,
			data = results._tabledata,
			colfix = results.colfix,
			colcnt = results.colcnt,
			rowfix = results.rowfix,
			rowcnt = results.rowcnt,
			c_cset = cop.colorset || results.c_cset,
			masterChart,
			sr,
			cols = colcnt - colfix,
			tinc = (100 / cols),
			tincpx = Math.max(me.theight, jcontainer.height() / cols),
			tgap = 50,
			ty = 0,
			chartregion,
			statistics = results.statistics,
			qstatistics = quality_stat.table_data;
		
		me.dispose();
		
		jcontainer.empty();
		
		chartregion = $("<div></div>").appendTo(jcontainer);
		
		chartregion.css({
			position: "relative",
			width: "100%"
		});
		
		for (sr=colfix; sr < colcnt; sr++)
		{
			me._charts.push({
				index: sr
			});
		}
		
		jcontainer.css({
			overflowY: "auto"
		});
		
		$.each(me._charts, function(r, mchart) {
			var sr  = mchart.index,
				chartarea,
				chartdesc,
				opt,
				ymin = null,
				ymax = null,
				smin, smax;
			
			chartarea = $("<div></div>").appendTo(chartregion);
		
			chartarea.css({
				position: "relative",
				width: "100%"
			});
			
			chartdesc = $("<div class='quality-runchart-desc'></div>").appendTo(chartregion);
			
			chartdesc.css({
				position: "relative",
				width: "100%"
			});
			
			opt = {
				chart: {
					renderTo: chartarea[0],
					chartregion: chartregion,
					chartdesc: chartdesc,
					echart_theme: cop.echart_theme
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross"
					}
				},
				xAxis: [],
				yAxis: [],
				series: []
			};
			
			var t = sr - colfix,
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
					data: []
				},
				yaxis = {
					type: "value",
					name: "value",
					position: "left",
					axisLabel: {
						formatter: cop.yaxisformat ? function(value, index) {
							var yaxisformat = cop.yaxisformat;
							return IG$.NumberFormat(yaxisformat, value);
						} : null
					}
				},
				series = {
					name: "value",
					type: "line",
					symbolSize: me.symbolsize,
					data: []
				},
				stat = statistics[t],
				qstat = qstatistics[t],
				qstat_map = {};
			
			$.each(qstat.rows, function(q, m) {
				qstat_map[m[0].text] = m[2];
			});
			
			chartarea.height(tincpx - tgap);
			chartdesc.height(tgap);
			
			ty += tincpx;
			
			series.markLine = {
				data: [
					{
						name: "Average",
						yAxis: stat.average,
						lineStyle: {
							color: "#00ff00",
							width: 2
						}
					}
				]
			}
			
			smin = stat.min;
			smax = stat.max;
			
			if (qstat_map["ucl"])
			{
				series.markLine.data.push({
					name: "UCL",
					yAxis: qstat_map["ucl"].value,
					lineStyle: {
						color: "#ff0000",
						width: 3
					}
				});
				
				if (qstat_map["ucl"].value > smax)
				{
					ymax = qstat_map["ucl"].value + 10;
				}
			}
			
			if (qstat_map["lcl"])
			{
				series.markLine.data.push({
					name: "LCL",
					yAxis: qstat_map["lcl"].value,
					lineStyle: {
						color: "#ff0000",
						width: 3
					}
				});
				
				if (qstat_map["lcl"].value < smin)
				{
					ymin = qstat_map["lcl"].value - 10;
				}
			}
			
			yaxis.min = ymin;
			yaxis.max = ymax;
			
			opt.xAxis.push(xaxis);
			opt.yAxis.push(yaxis);
			opt.series.push(series);
			
			var tval = 0;
			
			$.each(data, function(i, row) {
				var cname,
					v1;
				
				if (i < rowfix)
				{
					yaxis.name = row[sr].text;
					series.name = row[sr].text;
					return;
				}
				
				$.each(row, function(j, cell) {
					var cval,
						nval;
					if (j < colfix) // category
					{
						cval = cell.text || cell.code;
						cname = (j == 0) ? cval : cname + " " + cval; 
					}
					else if (j == sr) // one metric
					{
						cval = cell.code || cell.text;
						nval = Number(cval);
						
						if (isNaN(nval) == false)
						{
							tval += nval;
						}
						
						v1 = nval;
					}
				});
				
				xaxis.data.push(cname);
				series.data.push(v1);
			});
			
			if (IG$.__chartoption && IG$.__chartoption.chartcolors && IG$.__chartoption.chartcolors[c_cset])
			{
				opt.color =  IG$.__chartoption.chartcolors[c_cset];
			}
			
			mchart.dmain = me.createChart(opt);
			mchart.dmain_opt = opt;
			
			chartdesc.empty();
			
			var t_data = [];
			
			t_data.push("<ul class='qr_analysis'>");
			$.each(qstat.headers, function(j, header) {
				$.each(header, function(k, cell) {
					t_data.push("<li class='anal-" + cell.stylename + "'>" + (cell.text || "") + "</li>");
				});
			});
			$.each(qstat.rows, function(j, row) {
				t_data.push("<li><span class='anal-name'>" + (row[0].text || "") + "</span><span class='anal-value'>" + (row[2].formatvalue || row[2].value) + "</span></li>");
			});
			t_data.push("</ul>");
			$(t_data.join("")).appendTo(chartdesc);
		});
		
		if (cols > 1)
		{
			chartregion.height(ty);
		}
		else
		{
			chartregion.height(jcontainer.height());
		}
	},
	
	createChart: function(opt) {
		var me = this,
			masterChart = echarts.init(opt.chart.renderTo, opt.chart.echart_theme || ig$.echarts_theme || 'amplix', {
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
		
		return masterChart;
	},
	
	updatedisplay: function(w, h) {
		var me = this,
			dmain;
		
		if (!me._charts)
			return;
		
		dmain = me.dmain,
		dmain_opt = me.dmain_opt;
		
		var cols = me._charts.length,
			tinc = (100 / cols),
			tincpx = Math.max(me.theight, h / cols),
			tgap = 50,
			ty = 0;
		
		if (me._charts && me._charts.length == 1)
		{
			dmain = me._charts[0].dmain;
			$(dmain.renderTo).css({
				width: w,
				height: h - tgap
			});
			// dmain.resize.call(dmain, {width: w, height: h - tgap});
		}
		else
		{
			$.each(me._charts, function(r, mchart) {
				var dmain = mchart.dmain,
					dmain_opt = mchart.dmain_opt;
				
				if (dmain)
				{
					$(dmain.renderTo).css({
						height: tincpx - tgap
					});
					// dmain.resize.call(dmain, {width: w, height: h});
				}
			});
		}
	},
	
	dispose: function() {
		var me = this,
			_charts = me._charts;
			
		if (_charts)
		{
			$.each(_charts, function(i, cobj) {
				var dmain = cobj.dmain;
				dmain && dmain.destroy && dmain.destroy();
				dmain && dmain.dispose && dmain.dispose();
				cobj.dmain = null;
				cobj.dmain_opt = null;
			});
		}
		
		me._charts = [];
	}
});