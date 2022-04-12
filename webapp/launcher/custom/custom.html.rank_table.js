IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"HTML Rank Table", 
		charttype: "html_ranktable", 
		subtype: "html_ranktable", 
		img: "html_ranktable", 
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.html_ranktable = function(owner) {
	this.owner = owner;
};

IG$.__chartoption.chartext.html_ranktable.prototype = {
	drawChart: function(owner, results) {
		var me = this,
			container = owner.container,
			cop = owner.cop,
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
				sheetoption = owner.sheetoption ? owner.sheetoption.model : null,
				headers = {},
				tname,
				cspan, rspan,
				slength = 1,
				merged,
				cls;
			
			th = $("<thead></thead>").appendTo(html_tb);
			tb = $("<tbody></tbody>").appendTo(html_tb);
			
			if (colfix != 2)
			{
				IG$.ShowError(IRm$.r1("E_CHART_DRAWING") + ": need 2 row dimension in pivot");
				return;
			}
			
			if (rowfix > 1)
			{
				IG$.ShowError(IRm$.r1("E_CHART_DRAWING") + ": need no columns in pivot");
				return;
			}
			
			for (i=0; i < tabledata.length; i++)
			{
				row = tabledata[i];
				
				if (row[0].merged == 1)
				{
					var mlen = 1;
					
					for (j=i + 1; j < rowcnt; j++)
					{
						if (tabledata[j] && tabledata[j][0].merged & 8)
						{
							mlen++;
						}
						else
						{
							break;
						}
					}
					
					slength = Math.max(slength, mlen);
				}
			}
			
			var thr = $("<tr></tr>").appendTo(th);
			
			for (i=0; i < colfix - 1; i++)
			{
				td = $("<td></td>").appendTo(thr);
				td.addClass("ig-dvrtbl-fixed");
			}
			
			td = $("<td></td>").appendTo(thr);
			td.addClass("ig-dvrtbl-header");
			
			for (i=0; i < slength; i++)
			{
				td = $("<td></td>").appendTo(thr);
				td.addClass("ig-dvrtbl-data");
			}
			
			$.each(tabledata, function(i, row) {
				if (i < rowfix)
					return;
			
				if (row[0].merged == 1 || row[0].merged == 0)
				{
					tr = $("<tr></tr>");
					
					var td_row = [];
					
					for (j=0; j < colfix + slength + 1; j++)
					{
						var tm = $("<td></td>").appendTo(tr);
						if (j == 0)
						{
							tm.addClass("ig-dvrtbl-fixed");
						}
						else if (j == 1)
						{
							tm.addClass("ig-drvtbl-header");
						}
						else
						{
							tm.addClass("ig-dvrtbl-data");
						}
						
						td_row.push(tm);
					}
					
					var cell = row[0],
						celltext = cell.text || cell.code || "";
					td_row[0].html(celltext);
					
					cell.r = i;
					cell.c = 0;
					
					td_row[0].bind("click", function(e) {
						var sender = {
							amplix_selected: [cell]
						};
					
						owner.procClickEvent.call(owner, sender, {});
					});
					
					td = td_row[1];
					var hrow = tabledata[0];
					
					$("<div class='ig-dvrtbl-category ig-dvrtbl-category-head'>" + (hrow[1].text || hrow[1].code) + "</div>")
						.appendTo(td);
						
					var n = 0;
					
					for (n=colfix; n < colcnt; n++)
					{
						var cell = hrow[n],
							celltext = cell.text || cell.code || "",
							cls = "ig-dvrtbl-measure-head";
							
						cls += " ig-dvrtbl-measure-head_" + (cell.index);
						var div_meas = $("<div class='" + cls + "'>" + celltext + "</div>")
							.appendTo(td);
					}
					
					var seq = 2;
					
					$.each(tabledata, function(j, row) {
						if (j < i)
							return;
							
						if (j == i || row[0].merged & 8)
						{
							var td = td_row[seq];
							
							var cell = row[1];
							var celltext = cell.text || cell.code || "";
							cell.r = j;
							cell.c = 1;
							
							var div_categ = $("<div class='ig-dvrtbl-category'>" + celltext + "</div>")
								.appendTo(td);
								
							div_categ.bind("click", function(e) {
								var sender = {
									amplix_selected: [cell]
								};
							
								owner.procClickEvent.call(owner, sender, {});
							});
							
							$.each(row, function(k, cell) {
								if (k < colfix)
									return;
								else if (k >= colcnt)
									return false;
								
								var cell = row[k],
									celltext = cell.text || cell.code || "",
									cls = "ig-dvrtbl-measure";
									
								cell.r = j;
								cell.c = k;
								cls += " ig-dvrtbl-measure_" + (cell.index);
								var div_meas = $("<div class='" + cls + "'>" + celltext + "</div>")
									.appendTo(td);
								
								div_meas.bind("click", function(e) {
									var sender = {
										amplix_selected: [cell]
									};
								
									owner.procClickEvent.call(owner, sender, {});
								});
							});
							
							if (j == i && row[0].merged == 0)
							{
								seq++;
								return false;
							}
							seq++;
						}
						else
						{
							return false;
						}
					});
					
					for (j=seq; j < td_row.length; j++)
					{
						td_row[j].addClass("ig-dvrtbl-empty");
					}
					
					if (i < rowfix)
					{
						tr.appendTo(th);
					}
					else
					{
						tr.appendTo(tb);
					}
				}
			});
		}
	},

	updatedisplay: function(owner, w, h) {
		var me = this;
	},
	dispose: function() {
		var me = this,
			owner = me.owner;
			
		if (owner && owner.container)
		{
			$(owner.container).empty();
		}
	}
};