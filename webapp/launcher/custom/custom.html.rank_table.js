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
			html_tb,
			expdata,
			styles = results._styles;

		if (html)
		{
			html.remove();
		}
		
		expdata = me.expdata = {
			rowcnt: 0,
			colcnt: 0,
			styles: {},
			rows: []
		};
		
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
					
					var td_row = [],
						exp_row,
						exp_crows = [],
						exp_cell;
					
					for (j=colfix; j < colcnt + 1; j++)
					{
						exp_row = [];
						exp_crows.push(exp_row);
						expdata.rows.push(exp_row);
						
						for (k=0; k < colfix + slength + 1; k++)
						{
							exp_row.push({});
						}
					}
					
					exp_row = exp_crows[0];
					exp_row[0].rowspan = colcnt - colfix + 1;
					
					for (j=0; j < colfix + slength + 1; j++)
					{
						var tm = $("<td></td>").appendTo(tr),
							stname;
						
						if (j == 0)
						{
							stname = "ig-dvrtbl-fixed";
						}
						else if (j == 1)
						{
							stname = "ig-drvtbl-header";
						}
						else
						{
							stname = "ig-dvrtbl-data";
						}
						
						tm.addClass(stname);
						td_row.push(tm);
						
						for (k=0; k < exp_crows.length; k++)
						{
							exp_crows[k][j].style = exp_crows[k][j].style || [];
							exp_crows[k][j].style.push(stname);
						}
						
						if (j < 2)
						{
							stname = exp_crows[0][j].style.join(" "); 
					
							es = expdata.styles[stname];
										
							if (!es)
							{
								es = expdata.styles[stname] = {};
								es.cell = {
									html: tm
								};
							} 
						}
					}
					
					var cell = row[0],
						celltext = cell.text || cell.code || "";
					td_row[0].html(celltext);
					exp_crows[0][0].text = celltext;
					exp_crows[0][0].code = cell.code;
					
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
					
					var dcell = $("<div class='ig-dvrtbl-category ig-dvrtbl-category-head'>" + (hrow[1].text || hrow[1].code) + "</div>")
						.appendTo(td);
						
					exp_crows[0][1].text = hrow[1].text || hrow[1].code;
					exp_crows[0][1].code = hrow[1].code;
					exp_crows[0][1].style = exp_crows[0][1].style || [];
					exp_crows[0][1].style.push("ig-dvrtbl-category");
					exp_crows[0][1].style.push("ig-dvrtbl-head");
					
					stname = exp_crows[0][1].style.join(" "); 
					
					es = expdata.styles[stname];
								
					if (!es)
					{
						es = expdata.styles[stname] = {};
						es.cell = {
							html: dcell
						};
					} 
						
					var n = 0;
					
					for (n=colfix; n < colcnt; n++)
					{
						var cell = hrow[n],
							celltext = cell.text || cell.code || "",
							cls = "ig-dvrtbl-measure-head";
							
						cls += " ig-dvrtbl-measure-head_" + (cell.index);
						var div_meas = $("<div class='" + cls + "'>" + celltext + "</div>")
							.appendTo(td);
						exp_crows[n-colfix + 1][1].text = celltext; 
						exp_crows[n-colfix + 1][1].code = cell.code;
						exp_crows[n-colfix + 1][1].style = exp_crows[n-colfix + 1][1].style || [];
						exp_crows[n-colfix + 1][1].style.push(cls); 
						
						var stname = exp_crows[n-colfix + 1][1].style.join(" "); 
						es = expdata.styles[stname];
								
						if (!es)
						{
							es = expdata.styles[stname] = {};
							es.cell = {
								html: div_meas
							};
						} 
					}
					
					var seq = 2;
					
					$.each(tabledata, function(j, row) {
						if (j < i)
							return;
							
						if (j == i || row[0].merged & 8)
						{
							var td = td_row[seq];
							
							var cell = row[1];
							var celltext = cell.text || cell.code || "",
								stylename = cell.stylename,
								cs = styles[stylename];
							cell.r = j;
							cell.c = 1;
							
							exp_crows[0][seq].text = celltext;
							exp_crows[0][seq].code = cell.code;
							exp_crows[0][seq].style = exp_crows[0][seq].style || [];
							exp_crows[0][seq].style.push("ig-dvrtbl-category"); 
							
							var div_categ = $("<div class='ig-dvrtbl-category'>" + celltext + "</div>")
								.appendTo(td);
								
							var stname = exp_crows[0][seq].style.join(" ");
							
							es = expdata.styles[stname];
								
							if (!es)
							{
								es = expdata.styles[stname] = {};
								es.cell = {
									html: div_categ
								};
							} 
								
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
									stylename = cell.stylename,
									cs = styles[stylename],
									es, 
									cls = "ig-dvrtbl-measure";
									
								cell.r = j;
								cell.c = k;
								cls += " ig-dvrtbl-measure_" + (cell.index);
								var div_meas = $("<div class='" + cls + "'>" + celltext + "</div>")
									.appendTo(td);
									
								exp_crows[k - colfix + 1][seq].text = celltext;
								exp_crows[k - colfix + 1][seq].code = cell.code;
								exp_crows[k - colfix + 1][seq].style = cls.split(" ");
								
								es = expdata.styles[cls];
								
								if (!es)
								{
									es = expdata.styles[cls] = {};
									es.cell = {
										html: div_meas,
										style: cs
									};
								} 
								
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
	
	getExportData: function() {
		var me = this,
			data = {
				image_type: "html_json",
				image_data: null
			},
			html_data = me.expdata;
			
		var rgb2hex = function(rgb) {
			var m,
				hex;
				
			if (rgb.charAt(0) == '#')
				return rgb;
			
			m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			
			if (m)
			{
				hex = "#" +
					("0" + parseInt(m[1],10).toString(16)).slice(-2) +
					("0" + parseInt(m[2],10).toString(16)).slice(-2) +
					("0" + parseInt(m[3],10).toString(16)).slice(-2);
			}
			else
			{
				m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/);
				if (m)
				{
					var a = parseInt(m[3],10);
					
					if (a == 0)
					{
						return null;
					}
					
					hex = "#" +
						("0" + parseInt(m[1],10).toString(16)).slice(-2) +
						("0" + parseInt(m[2],10).toString(16)).slice(-2) +
						("0" + parseInt(m[3],10).toString(16)).slice(-2);
				}
			}
			return hex;
		}
		
		var fontsize = function(val) {
			if (val && val.length)
			{
				if (val.endsWith("px"))
				{
					val = val.substring(0, val.length - 2);
				}
				
				if (typeof(val) == "string")
					val = parseInt(val);
			}
			
			return val;
		}
			
		$.each(html_data.styles, function(i, style) {
			if (style.cell)
			{
				var cell = style.cell,
					html = cell.html,
					cs = cell.style;
				
				if (html)
				{
					style.fontsize = fontsize(html.css("font-size"));
					style.forecolor = html.css("color");
					style.backcolor = html.css("background-color");
					style.textalign = html.css("text-align"); 
				}
				
				if (cs)
				{
					style.formatstring = cs.formatstring;
				}
				
				if (style.forecolor)
				{
					style.forecolor = rgb2hex(style.forecolor);
				}
				
				if (style.backcolor)
				{
					style.backcolor = rgb2hex(style.backcolor);
				}
				
				delete style["cell"];
			}
		});
			
		html_data.rowcnt = html_data.rows.length;
		html_data.colcnt = (html_data.rows.length ? html_data.rows[0].length : 0);
		
		data.image_data = JSON.stringify(html_data);
		
		return data;
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