IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Korea map", 
		charttype: "koreamap", 
		subtype: "koreamap", 
		img: "svg_korea", 
		grp: "map"
	}
);

IG$.cVis.koreaMapTypes = function() {
	var mtype = {};

	mtype.sido = [
		{name: "서울특별시", subtype: "G11"},
		{name: "경상남도", subtype: "G48"},
		{name: "창원시", subtype: "4812"},
		{name: "대전", subtype: "G30"},
		{name: "대전 서구", subtype: "30170"}
	];

	return mtype;
},

IG$.cVis.koreamap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this,
			chartview = me.chartview,
			cop = chartview.cop,
			container = $(chartview.container),
			hoption = {};
		
		me.container = container;
		me._results = results;
		
		me.container.empty();

		me.chartmap = me.chartmap || {};
		me._config = me._config || {};

		me._title_div = $("<div class='igc-map-title'></div>")
			.hide()
			.appendTo(container);

		if (me._config.enable_drill)
		{
			me.back_button = $("<div class='igc-map-backbutton'></div>")
				.hide()
				.appendTo(me.container);

			me.back_button.bind("click", function() {
				if (me._curmap && me._curmap.parent)
				{
					me.load_chart(me._curmap.parent.jsonurl, me._curmap.parent.level, me._curmap.parent.parent);
				}
			});
		}

		if (cop.maptype)
		{
			me._ld_name = "";

			var mtype = IG$.cVis.koreaMapTypes();

			for (var i=0; i < mtype.sido.length; i++)
			{
				if (mtype.sido[i].subtype == cop.maptype)
				{
					me._ld_name = mtype.sido[i].name;
					break;
				}
			}

			me.load_chart("./data/geojson/kr/" + cop.maptype + ".json", 0);
		}
		else
		{
			me.load_chart("./data/korea_geojson.json", 0);
		}
	},

	area: function(poly){
		var s = 0.0,
			i;
		var ring = poly;
		for(i= 0; i < (ring.length-1); i++){
		  s += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
		}
		return 0.5 *s;
	},
	
	centroid: function(poly){
		var me = this,
			i,
			c = [0,0];
		var ring = poly;
		for(i= 0; i < (ring.length-1); i++){
		  c[0] += (ring[i][0] + ring[i+1][0]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
		  c[1] += (ring[i][1] + ring[i+1][1]) * (ring[i][0]*ring[i+1][1] - ring[i+1][0]*ring[i][1]);
		}
		var a = me.area(poly);
		c[0] /= a *6;
		c[1] /= a*6;
		return c;
	},

	geoCoordMap: function(cview, name) {
		var me = this,
			data = cview.data,
			i,
			feature;

		for (i=0; i < data.features.length; i++)
		{
			if (data.features[i].properties.name == name)
			{
				feature = data.features[i];
				break;
			}
		}

		if (feature && feature.geometry && feature.geometry.coordinates)
		{
			if (feature.geometry.type == "Polygon")
			{
				return me.centroid(feature.geometry.coordinates[0]);
			}
			else if (feature.geometry.type == "MultiPolygon")
			{
				var c = [0, 0, 0, 0];

				for (i=0; i < feature.geometry.coordinates.length; i++)
				{
					var bc = me.centroid(feature.geometry.coordinates[i][0]);
					if (i == 0)
					{
						c[0] = bc[0];
						c[1] = bc[0];
						c[2] = bc[1];
						c[3] = bc[1];
					}
					else
					{
						c[0] = Math.min(c[0], bc[0]);
						c[1] = Math.max(c[1], bc[0]);
						c[2] = Math.min(c[2], bc[1]);
						c[3] = Math.max(c[3], bc[1]);
					}
				}
				return [(c[1] - c[0]) / 2 + c[0], (c[3] - c[2]) / 2 + c[2]];
			}
		}
	},

	load_chart: function(jsonurl, level, pchart) {
		var me = this,
			chartview = me.chartview,
			cop = chartview.cop,
			settings = cop.settings || {},
			container = me.container;

		$.each(me.chartmap, function(k, map) {
			if (k == jsonurl)
			{
				map.html.show();
			}
			else
			{
				map.html.hide();
			}
		});

		if (me._config.enable_drill)
		{
			if (level == 0)
			{
				me.back_button.hide();
			}
			else
			{
				me.back_button.show();
			}
		}

		if (me.chartmap[jsonurl])
		{
			me._curmap = me.chartmap[jsonurl];
		}
		else
		{
			$.ajax({
				url: jsonurl,
				dataType: "json",
				type: "GET",
				cache: true,
				complete: function() {
					console.log("complete downloading");
				},
				success: function(data) {
					var drect = $("<div class='igc-map-json'></div>").appendTo(container);
					var mchart = me.chartmap[jsonurl] = {
						jsonurl: jsonurl,
						html: drect,
						data: data,
						level: level
					}, customchart, i, feature;

					if (pchart)
					{
						mchart.parent = pchart;
					}

					me._curmap = mchart;

					if (window.echarts)
					{
						echarts.registerMap(jsonurl, data);
						mchart.geo_alias_map = {};

						for (i=0; i < data.features.length; i++)
						{
							feature = data.features[i];

							var fname = feature.properties.name;

							mchart.geo_alias_map[feature.properties.name] = fname;

							if (level == 0)
							{
								mchart.geo_alias_map[feature.properties.CTPRVN_CD] = fname;
							}
							else if (feature.properties.sig_cd)
							{
								mchart.geo_alias_map[feature.properties.sig_cd] = fname;
							}
							else if (feature.properties.emd_cd)
							{
								mchart.geo_alias_map[feature.properties.emd_cd] = fname;
							}
						}

						me.load_chart(jsonurl, level, pchart);
					}
				},
				error: function() {
					console.log("error on download file " + jsonurl);
				}
			});

			return;
		}

		var mchart = me.chartmap[jsonurl],
			customchart = mchart.customchart,
			data = mchart.data,
			hoption = {
				chart: {
					renderTo: mchart.html[0]
				},

				tooltip: {
					trigger: 'item',
					showDelay: 0,
					transitionDuration: 0.2,
					formatter: function (params) {
						var value = (params.value + '').split('.');
						value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
						// params.seriesName + '<br/>' + 
						return params.name + ': ' + value;
					}
				},
				visualMap: {
					left: 'right',
					min: 500000,
					max: 38000000,
					inRange: {
						color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
					},
					text: ['High', 'Low'],           // 文本，默认为数值文本
					calculable: true
				},
				toolbox: {
					show: false,
					//orient: 'vertical',
					left: 'right',
					top: 'top',
					feature: {
						dataView: {readOnly: false},
						restore: {},
						saveAsImage: {}
					}
				}
			},
			serie;

		serie = {
			name: 'series1',
			type: 'map',
			label: {
				show: true
			},
			roam: true,
			map: jsonurl,
			itemStyle: {
				areaColor: '#e7e8ea',
				borderWidth: 1,
				borderColor: "#fff",
				shadowColor: "#eee",
				shadowOffsetX: 2,
				shadowOffsetY: 2
			},
			label: {
				show: cop.xlabel,
				fontSize: 10,
				color: "#989696",
				textBorderColor: "#fff",
				textBorderWidth: 2
			},
			emphasis: {
				label: {
					show: true
				}
			},
			data: []
		}

		var dt = [],
			dtmap = {},
			results = me._results,
			_tabledata = results._tabledata,
			geo_alias_map = mchart.geo_alias_map,
			i, j, row,
			vmin, vmax;

		if (_tabledata && _tabledata.length && results.colcnt > results.colfix && results.colfix > 0)
		{
			var rcnt = _tabledata.length;
			for (i=results.rowfix; i < rcnt; i++)
			{
				row = _tabledata[i];

				var cd1 = me.do_map_getCode(mchart, row, level);
				
				var v = Number(row[results.colfix].code);

				if (isNaN(v))
					continue;

				// if (level == 0)
				// {
				// 	if (cd1 && cd1.length > 2)
				// 	{
				// 		cd1 = cd1.substring(0, 2);
				// 	}
				// }

				var cd2;
				
				if (me._ld_name)
				{
					cd2 = me._ld_name + " " + cd1;
				}

				if (geo_alias_map[cd1])
				{
					cd1 = geo_alias_map[cd1];
				}
				else if (cd2 && geo_alias_map[cd2])
				{
					cd1 = geo_alias_map[cd2];
				}
				else
				{
					continue;
				}

				if (cd1)
				{
					var d = {name: cd1, value: v};

					if (dtmap[d.name])
					{
						d = dtmap[d.name];
						dtmap[d.name].value += v;
					}
					else
					{
						dtmap[d.name] = d;
						dt.push(d);
					}

					if (cop.m_marker == "pie")
					{
						if (!d.pie_data)
						{
							d.pie_data = [];

							for (j=results.colfix; j < results.colcnt; j++)
							{
								d.pie_data.push({name: _tabledata[0][j].text, value: 0});
							}
						}
						for (j=results.colfix; j < results.colcnt; j++)
						{
							d.pie_data[j - results.colfix].value += Number(_tabledata[i][j].code);
						}
					}
				}
			}

			for (i=0; i < dt.length; i++)
			{
				if (i == 0)
				{
					vmin = dt[i].value;
					vmax = dt[i].value;
				}
				else
				{
					vmin = Math.min(vmin, dt[i].value);
					vmax = Math.max(vmax, dt[i].value);
				}

				if (dt[i].pie_data)
				{
					var csum = 0;
					for (j=0; j < dt[i].pie_data.length; j++)
					{
						csum += dt[i].pie_data[j].value;
					}

					if (i == 0)
					{
						vmax = vmin = csum;
					}
					else
					{
						vmin = Math.min(vmin, csum);
						vmax = Math.max(vmax, csum);
					}
				}
			}

			hoption.visualMap.min = vmin;
			hoption.visualMap.max = vmax;
		}

		if (cop.m_marker == "circle")
		{
			hoption.geo = serie;
			serie = {
				type: "effectScatter",
				coordinateSystem: "geo",
				showEffectOn: 'emphasis',
				rippleEffect: {
					brushType: 'stroke'
				},
				symbolSize: function(val) {
					var min = hoption.visualMap.min,
						max = hoption.visualMap.max;
						val = val[2];
					return 5 + (val - min) / (max - min) * 20;
				},
				encode: {
					value: 2
				},
				hoverAnimation: true,
				label: {
					formatter: '{b}',
					position: 'right',
					show: true
				},
				itemStyle: {
					color: '#f4e925',
					shadowBlur: 10,
					shadowColor: '#333'
				},
				// zlevel: 1,
				data: []
			};

			for (i=0; i < dt.length; i++)
			{
				var gl = me.geoCoordMap(mchart, dt[i].name);

				if (gl)
				{
					serie.data.push(gl.concat(dt[i].value));
				}
			}

			hoption.series = [
				serie
			];

			me.do_map_lines(mchart, level, hoption);
		}
		else if (cop.m_marker == "pie")
		{
			hoption.geo = serie;
			hoption.series = [];
			hoption.legend = {};

			delete hoption.visualMap;

			for (i=0; i < dt.length; i++)
			{
				var gl = me.geoCoordMap(mchart, dt[i].name);

				if (gl)
				{
					var csum = 0;
					for (j=0; j < dt[i].pie_data.length; j++)
					{
						csum += dt[i].pie_data[j].value;
					}
					var pradius = 5 + (csum - vmin) / (vmax - vmin) * 10;
					var ps = {
						type: "pie",
						coordinateSystem: "geo",
						tooltip: {
							formatter: '{b}: {c} ({d}%)'
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						center: gl,
						radius: pradius,
						animationDuration: 0,
						data: dt[i].pie_data
					};
					hoption.series.push(ps);
				}
			}
		}
		else
		{
			hoption.series = [serie];
			serie.data = dt;
		}

		if (cop.showtitle && cop.title)
		{
			hoption.title = {
				show: false,
				text: cop.title
			};

			me._title_div.html(cop.title).show();
		}
		else
		{
			me._title_div.hide();
		}

		var b_create = false;

		if (!customchart)
		{
			customchart = echarts.init(mchart.html[0], cop.echart_theme || ig$.echarts_theme || 'amplix', {
				renderer: "svg"
			});

			mchart.customchart = customchart;
			b_create = true;
		}

		customchart.setOption(hoption);

		if (b_create)
		{
			customchart.on("click", function(params) {
				if (((params.componentType == "series" && params.seriesType == "map") || params.componentType == "geo") && params.name)
				{
					var features = data.features,
						feature,
						pdata,
						amplix_selected = [],
						i;

					for (i=0; i < features.length; i++)
					{
						if (features[i].properties.name == params.name)
						{
							feature = features[i];
							break;
						}
					}

					if (feature)
					{
						var cindex = 0;

						pdata = feature.properties.name;
						
						if (me._config.enable_drill)
						{
							cindex = me.do_map_drilldown(mchart, level, feature);
						}

						var rcnt = _tabledata.length;
						for (i=results.rowfix; i < rcnt; i++)
						{
							row = _tabledata[i];

							if (row[cindex].code == pdata)
							{
								row[cindex].r = i;
								row[cindex].c = cindex;
								amplix_selected.push(row[cindex]);
								break;
							}
						}
					}

					var pparam = {
							point: {name: pdata}
						},
						sender = {
							series: {
								name: params.seriesName,
								type: params.seriesType
							},
							amplix_selected: amplix_selected,
							unselect: false
						};

					if (params.event && params.event.type == "click")
					{
						pparam.offsetX = params.event.offsetX;
						pparam.offsetY = params.event.offsetY;
					}
					chartview.procClickEvent(sender, pparam);
				}
			});

			customchart.on("mapselected", function(e) {
				console.log("mapselected");
			});

			customchart.on("mapselectchanged", function(e) {
				console.log("mapselected");
			});
		}
	},
	updatedisplay: function(w, h) {
		var me = this,
			mchart = me.chartmap;

		if (mchart)
		{
			$.each(mchart, function(k, mc) {
				mc.customchart && mc.customchart.resize();
			});
		}
	},

	do_map_lines: function(mchart, level, hoption) {
		// var me = this,
		// 	lines = [];

		// if (level == 0)
		// {
		// 	var t = me.geoCoordMap(mchart, "경상남도");

		// 	for (i=0; i < mchart.data.features.length; i++)
		// 	{
		// 		if (mchart.data.features[0].name == "경상남도")
		// 			continue;
		// 		var t2 = me.geoCoordMap(mchart, mchart.data.features[i].properties.name);
		// 		lines.push({coords: [t2, t], value: 1000});
		// 	}
		// 	var custom_serie = {
		// 		type: "lines",
		// 		coordinateSystem: "geo",
		// 		lineStyle: {
		// 			color: 'purple',
		// 			opacity: 0.6,
		// 			curveness: 0.4,
		// 			width: 2
		// 		},
		// 		polyline: true,
		// 		data: lines,
		// 		large: true,
		// 		animation: true,
		// 		animationDuration: 1000,
		// 		symbol: "arrow",
		// 		symbolSize: 10
		// 	};
		// 	hoption.series.push(custom_serie);
		// 	hoption.visualMap.seriesIndex = 0;
		// }
	},

	do_map_getCode: function(mchart, row, level) {
		var cd1 = row[0].code;

		if (level == 1)
		{
			cd1 = row[1].code;
		}
		else if (level == 2 && mchart.jsonurl == "./data/geojson/kr/4812.json")
		{
			cd1 = row[1].code;
		}
		else if (level == 2)
		{
			cd1 = row[2].code;
		}
		else if (level == 3)
		{
			cd1 = row[2].code;
		}

		return cd1;
	},

	do_map_drilldown: function(mchart, level, feature) {
		var me = this;

		var cindex = 0;

		if (level == 0 && feature.properties.CTPRVN_CD)
		{
			me.load_chart("./data/geojson/kr/G" + feature.properties.CTPRVN_CD + ".json", level + 1, mchart);
		}
		else if (level == 1)
		{
			cindex = 1;
			var sig_cd = feature.properties.sig_cd;

			if (sig_cd && sig_cd.startsWith("4812"))
			{
				me.load_chart("./data/geojson/kr/4812.json", level + 1, mchart);
			}
			else if (sig_cd && sig_cd == "48170")
			{
				cindex = 2;
				me.load_chart("./data/geojson/kr/48170.json", level + 1, mchart);
			}
		}
		else if (level == 2)
		{
			cindex = 2;

			if (mchart.jsonurl == "./data/geojson/kr/4812.json")
			{
				cindex = 1;
			}
			var sig_cd = feature.properties.sig_cd;
			sig_cd && me.load_chart("./data/geojson/kr/" + sig_cd + ".json", level + 1, mchart);
		}
		else if (level == 3)
		{
			cindex = 2;
		}

		return cindex;
	},

	dispose: function() {
		var me = this,
			mchart = me.chartmap;

		if (mchart)
		{
			$.each(mchart, function(k, mc) {
				mc.customchart && mc.customchart.dispose();
			});
		}

		me.chartmap = {};
	}
});