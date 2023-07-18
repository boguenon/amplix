IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"SVG", 
		charttype: "svgmap", 
		subtype: "svgmap", 
		img: "svgmap", 
		grp: "scientific"
	}
);

IG$.cVis.svgmap = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this,
			chartview = me.chartview,
			container = chartview.container,
			cop = chartview.cop,
			copsettings = cop.settings,
			m_svgtype = copsettings ? copsettings.m_svgtype : "",
			svgmap,
			renderer;

		
		if (!m_svgtype)
		{
			IG$.ShowError(IRm$.r1("M_ERR_CHART_SEL"), me);
			return;
		}
		
		if (ig$.svg_renderers)
		{
			var p = ig$.svg_renderers.split("\n");
			
			$.each(p, function(i, r) {
				var s = r.split(",");
				
				if (s.length > 1)
				{
					if (s[1] == m_svgtype)
					{
						renderer = {
							name: s[0],
							url: s[1],
							idfield: s[2] || "id" 
						};
						return false;
					}
				}
			});
		}
		
		me.map = svgmap = new IG$.SVGLoader($(container), me, chartview);
		svgmap.idfield = renderer ? renderer.idfield : null;
		svgmap.load(m_svgtype);

		svgmap.container.unbind("svgloaded");
		
		svgmap.container.unbind("region_clicked");
		
		svgmap.container.bind("region_clicked", function(e, opt) {
			if (opt.sender && opt.param)
			{
				chartview.procClickEvent.call(chartview, opt.sender, opt.param);
			}
		}); 

		svgmap.container.bind("svgloaded", function() {
			var i,
				j,
				row,
				colfix, rowfix,
				cell, celltext,
				pt,
				measureindex,
				ptval,
				chartoption = {
					point: {},
					measures: [],
					m_svg_min_color: copsettings.m_svg_min_color,
					m_svg_max_color: copsettings.m_svg_max_color
				};

			if (results)
			{
				var tabledata = results._tabledata;
				
				colfix = results.colfix;
				rowfix = results.rowfix;
				for (i=0; i < tabledata.length; i++)
				{
					row = tabledata[i];

					if (i < rowfix)
					{
						for (j=colfix; j < row.length; j++)
						{
							cell = row[j];
							celltext = cell.text || cell.code;
							if (i == 0)
							{
								chartoption.measures.push({
									text: celltext,
									min: null,
									max: null
								});
							}
							else
							{
								chartoption.measures[j-colfix].text += " " + celltext;
							}
						}
					}
					else
					{
						for (j=0; j < row.length; j++)
						{
							cell = row[j];
							celltext = cell.text || cell.code;
							if (j < colfix)
							{
								// row data area
								if (j == 0)
								{
									pt = chartoption.point[celltext];
									if (!pt)
									{
										pt = {
											mapid: celltext,
											data: [],
											text: []
										};
									}
								}
							}
							else
							{
								// data area
								celltext = cell.code || cell.text;
								measureindex = j-colfix;
								ptval = Number(celltext);

								if (isNaN(ptval) == false)
								{
									chartoption.measures[measureindex].min = (chartoption.measures[measureindex].min == null) ? ptval : Math.min(chartoption.measures[measureindex].min, ptval);
									chartoption.measures[measureindex].max = (chartoption.measures[measureindex].max == null) ? ptval : Math.max(chartoption.measures[measureindex].max, ptval);
								}

								if (pt.data.length > measureindex)
								{
									pt.data[measureindex] = ptval;
									pt.text[measureindex] = cell.text || cell.code;
								}
								else
								{
									pt.data.push(ptval);
									pt.text.push(cell.text || cell.code);
								}
							}
						}

						chartoption.point[pt.mapid] = pt;
					}
				}
			}

			svgmap.loadData(chartoption);
		});
	},

	updatedisplay: function(w, h) {
		var me = this,
			map = me.map;
			
		map.resizeTo.call(map);
	},
	getExportData: IG$.__chartoption.chartext.$export_html,

	dispose: function() {
		var me = this,
			chartview = me.chartview;
			
		if (chartview && chartview.container)
		{
			$(chartview.container).empty();
		}
	}
});