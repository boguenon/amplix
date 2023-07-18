IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"HTML Table", 
		charttype: "htmltable", 
		subtype: "htmltable", 
		img: "htmltable", 
		grp: "scientific"
	}
);

IG$.cVis.htmltable = $s.extend(IG$.cVis.base, {
	draw: function(results) {
		var me = this,
			chartview = me.chartview,
			container = chartview.container,
			cop = chartview.cop,
			copsettings = cop.settings || {},
			m_html_basestyle = copsettings.m_html_basestyle || "",
			html = me.html,
			html_tb;

		if (html)
		{
			html.remove();
		}
		
		html = me.html = $("<div class='ig-dvtbl-cnt'></div>").appendTo(container);
		$("<div class='ig-dvtbl-head'></div>").appendTo(me.html);
		m_html_basestyle && html.addClass(m_html_basestyle);
		
		html_tb = $("<table></table>").appendTo(html);
		
		$("<div class='ig-dvtbl-bottom'></div>").appendTo(me.html);
		
		if (results)
		{
			var tabledata = results._tabledata,
				th,
				tb, tr, td,
				colfix = results.colfix,
				rowfix = results.rowfix,
				colcnt = results.colcnt,
				rowcnt = results.rowcnt,
				i, j, k, row, cell, celltext,
				p, idx, sn, title,
				sheetoption = chartview.sheetoption ? chartview.sheetoption.model : null,
				headers = {},
				tname,
				cspan, rspan,
				merged;
			
			th = $("<thead></thead>").appendTo(html_tb);
			tb = $("<tbody></tbody>").appendTo(html_tb);
			
			$.each(tabledata, function(i, row) {
				tr = $("<tr></tr>");
				
				$.each(row, function(j, cell) {
					cell = row[j];
					cell.r = i;
					cell.c = j;
					merged = cell.merged;
					cspan = 1;
					rspan = 1;
					
					if (merged == 1)
					{
						for (k = i+1; k < rowcnt; k++)
						{
							if (tabledata[k] && tabledata[k][j].merged & 8)
							{
								rspan++;
							}
							else
							{
								break;
							}
						}
					}
					else if (merged & 8)
					{
						return;
					}
					
					if (merged == 2)
					{
						for (k = j + 1; k < colcnt; k++)
						{
							if (row[k] && row[k].merged & 4)
							{
								cspan++;
							}
							else
							{
								break;
							}
						}
					}
					else if (merged & 4)
					{
						return;
					}
					
					p = cell.position;
					idx = cell.index;
					title = cell.title == 1;
					celltext = cell.text || cell.code || "";
					td = $("<td" + (rspan > 1 ? " rowspan='" + rspan + "'" : "") + (cspan > 1 ? " colspan='" + cspan + "'" : "") + ">" + celltext + "</td>").appendTo(tr);
					
					if (title && p == 3)
					{
						td.addClass("ig-dvtbl-measure");
					}
					else
					{
						td.addClass((j < colfix ? "ig-dvtbl-fixed" + (title ? "-title" : "") : (title ? "ig-dvtbl-title" : "ig-dvtbl-data")));
						td.addClass((j < colfix ? "ig-dvtbl-fixed" + (title ? "-title" : "") : (title ? "ig-dvtbl-title" : "ig-dvtbl-data")) + "_" + idx);
					}
					
					if (sheetoption)
					{
						sn = headers[j];
						
						if (!sn)
						{
							switch (p)
							{
							case 1:
								sn = sheetoption.rows[idx].name;
								break;
							case 2:
								sn = sheetoption.cols[idx].name;
								break;
							case 3:
								sn = sheetoption.measures[idx].name;
								break;
							}
							
							if (sn)
							{
								sn = sn.toLowerCase();
								sn = IG$.replaceAll(sn, " ", "_");
								sn = IG$.replaceAll(sn, "&#x2f;", "_");
							}
							
							sn = "ig-dvcell-" + sn;
							headers[j] = sn;
						}
						
						td.addClass(sn);
						
						if (cell.title != 1 && (cell.position == 3 || cell.position == 1))
						{
							td.bind("click", function(e) {
								var sender = {
									amplix_selected: [cell]
								};
							
								chartview.procClickEvent.call(chartview, sender, {});
							});
						}
					}
				});
				
				if (i < rowfix)
				{
					tr.appendTo(th);
				}
				else
				{
					tr.appendTo(tb);
				}
			});
		}
	},

	updatedisplay: function(w, h) {
		var me = this;
	},
	dispose: function() {
		var me = this,
			chartview = me.chartview;
			
		if (chartview && chartview.container)
		{
			$(chartview.container).empty();
		}
	}
});