IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.kpi_3/*dlg_vsyntax*/ = $s.extend($s.window, {
	title: "Indicator Syntax",
	modal: true,
	region:'center',
	layout: {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	
	callback: null,	
	
	width: 600,
	autoHeight: true,
	
   _confirm: function() {
		var me = this,
			tsyntax = me.down("[name=tsyntax]");
			
		me.rec.set("syntax", tsyntax.getValue());
			
		this.close();
	},
	
	initApp: function() {
		var me = this,
			ttype = this.down("[name=ttype]"),
			tsyntax = this.down("[name=tsyntax]");
			
		var do_proc = function() {
			var templates = IG$.__chartoption.chartext.kpi_templates,
				dp = [
					{
						name: IRm$.r1("B_SELECT"),
						value: "",
						syntax: ""
					}
				];
			
			if (templates)
			{
				$.each(templates, function(i, t){
					dp.push({
						name: t.name,
						value: t.name,
						syntax: t.syntax.join("\n"),
						parameters: t.parameters
					});
				});
			}
			ttype.store.loadData(dp);
			ttype.setValue("");
			tsyntax.setValue(me.rec.get("syntax"));
		}
			
		if (!IG$.__chartoption.chartext.kpi_templates)
		{
			IG$.lDF("./custom/custom.kpi.template.json", new IG$.callBackObj(me, function(data) {
				IG$.__chartoption.chartext.kpi_templates = data.templates;
				do_proc();
			}));
		}
		else
		{
			do_proc();
		}
	},
	
	_edit_tmpl: function(r) {
		var me = this,
			tsyntax = me.down("[name=tsyntax]"),
			parameters = r ? r.get("parameters") : null,
			syntax = r ? r.get("syntax") : null,
			dlg;
		
		if (parameters)
		{
			dlg = new IG$.kpiTWc({
				syntax: syntax,
				parameters: parameters,
				callback: new IG$.callBackObj(me, function(thtml) {
					tsyntax.setValue(thtml);
				})
			});
			
			dlg.show();
		}
		else
		{
			tsyntax.setValue(syntax || "");
		}
	},
	
	initComponent: function() {
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: 5,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					items: [
						{
							xtype: "combobox",
							name: "ttype",
							fieldLabel: IRm$.r1("L_TEMPLATE_TYPE"), // "Template Type",
							queryMode: 'local',
							displayField: 'name',
							valueField: 'value',
							editable: false,
							autoSelect: true,
							store: {
								xtype: 'store',
								fields: [
									"name", "value", "syntax"
								],
								data: [
								]
							},
							listeners: {
								change: function(tobj, newvalue, oldvalue, eopts) {
									var r, i;
									
									for (i=0; i < tobj.store.data.items.length; i++)
									{
										if (tobj.store.data.items[i].get("value") == newvalue)
										{
											r = tobj.store.data.items[i];
										}	
									}
									
									this._edit_tmpl(r);
								},
								scope: this
							}
						},
						{
							xtype: "textarea",
							popup_editor: true,
							name: "tsyntax",
							value: this.rec.get("syntax"),
							height: 400
						}
					]
				}
			],
			buttons: [
				'->',
				{
					text: IRm$.r1('B_CONFIRM'),
					handler: function() {
						this._confirm();
					},
					scope: this
				}, 
				{
					text: IRm$.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$.kpi_3/*dlg_vsyntax*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.initApp.call(tobj);
		}
	}
});

IG$.kpi_1/*dlg_vindicator*/ = $s.extend($s.window, {
	title: "Indicator Wizard",
	modal: true,
	region:'center',
	layout: {
		type: 'fit',
		align: 'stretch'
	},
	
	closable: false,
	resizable:false,
	
	callback: null,	
	
	width: 600,
	autoHeight: true,
	
	in1/*initApp*/: function() {
		var me = this,
			copt = me.cindicator,
			i,
			dp,
			colconfig = me.down("[name=colconfig]");
			
		if (copt)
		{
			copt.boxcnt = copt.boxcnt || "{cols}";
			copt.boxconfig = copt.boxconfig || [];
			
			me.down("[name=boxcnt]").setValue(copt.boxcnt);
			me.down("[name=boxlayout]").setValue(copt.boxlayout || "");
			colconfig.store.loadData(copt.boxconfig);
		}
	},
	
	_confirm: function() {
		var me = this,
			copt = me.cindicator,
			colconfig = me.down("[name=colconfig]"),
			colconfig_store = colconfig.store,
			rec, i, cc;
			
		if (copt)
		{
			copt.boxcnt = me.down("[name=boxcnt]").getValue();
			copt.boxlayout = me.down("[name=boxlayout]").getValue();
			copt.boxconfig = [];
			
			for (i=0; i < colconfig_store.data.items.length; i++)
			{
				rec = colconfig_store.data.items[i];
				cc = {
					name: rec.get("name"),
					syntax: rec.get("syntax")
				}
				copt.boxconfig.push(cc);
			}
			
			me.cop.cindicator = JSON.stringify(copt);
		}
		this.close();
	},
	
	initComponent: function() {
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: 5,
					layout: "anchor",
					defaults: {
						labelAlign: "left"
					},
					items: [
						{
							xtype: "textfield",
							fieldLabel: IRm$.r1("L_BOX_COUNTS"), // "Box Counts",
							name: "boxcnt"
						},
						{
							xtype: "displayfield",
							anchor: "100%",
							value: "* {rows} for sheet results rows or {cols} for sheet result columns"
						},
						{
							xtype: "combobox",
							fieldLabel: IRm$.r1("L_LAYOUT_MODE"), // "Layout Mode",
							name: "boxlayout",
							queryMode: "local",
							displayField: "name",
							valueField: "value",
							editable: false,
							autoSelect: true,
							store: {
								xtype: "store",
								fields: [
									"name", "value"
								],
								data: [
									{name: "Horizontal Fit", value: ""},
									{name: "Horizontal Scroll", value: "hscr"},
									{name: "Vertical Fit", value: "vfit"},
									{name: "Vertical Scroll", value: "vscr"}
								]
							}
						},
						{
							xtype: "gridpanel",
							title: "Template",
							name: "colconfig",
							store: {
								xtype: "store",
								fields: [
									"name", "syntax"
								]
							},
							height: 300,
							selModel: {
								mode: "MULTI"
							},
							plugins: [
								{
									ptype: "celledit",
									clicksToEdit: false
								}
							],
							tbar: [
								{
									xtype: "button",
									text: IRm$.r1("L_ADD_ROW"), // "Add Row",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]");
											
										grd.store.add({
											name: "",
											syntax: ""
										});
									},
									scope: this
								},
								{
									xtype: "button",
									text: IRm$.r1("L_REMOVE_CHECKED"), // "Remove Checked",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sel = grd.getSelectionModel().selected,
											i;
											
										for (i=sel.length-1; i>=0; i--)
										{
											grd.store.remove(sel.items[i]);
										}
									},
									scope: this
								},
								{
									xtype: "button",
									text: IRm$.r1("B_MOVE_UP"), // "Move Up",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sm = grd.getSelectionModel(),
											sel = grd.getSelectionModel().selected,
											i, idx,
											rec,
											msel = [];
											
										for (i=0; i < sel.length; i++)
										{
											msel.push(sel.items[i]);
										}
											
										for (i=sel.length-1; i>=0; i--)
										{
											idx = grd.store.indexOf(sel.items[i]);
											rec = sel.items[i];
											if (idx > 0)
											{
												grd.store.remove(rec);
												grd.store.insert(idx-1, rec);
											}
										}
										
										sm.select(msel);
									},
									scope: this
								},
								{
									xtype: "button",
									text: IRm$.r1("B_MOVE_DOWN"), // "Move Down",
									handler: function() {
										var me = this,
											grd = me.down("[name=colconfig]"),
											sm = grd.getSelectionModel(),
											sel = grd.getSelectionModel().selected,
											i, idx,
											rec,
											msel = [],
											tcount = grd.store.data.items.length;
											
										for (i=0; i < sel.length; i++)
										{
											msel.push(sel.items[i]);
										}
											
										for (i=sel.length-1; i>=0; i--)
										{
											idx = grd.store.indexOf(sel.items[i]);
											rec = sel.items[i];
											if (idx + 1 < tcount )
											{
												grd.store.remove(rec);
												grd.store.insert(idx+1, rec);
											}
										}
										
										sm.select(msel);
									},
									scope: this
								}
							],
							columns: [
								{
									text: IRm$.r1("B_TITLE"), //"Title",
									width: 100,
									dataIndex: "name",
									editor: {
										allowBlank: false
									}
								},
								{
									text: IRm$.r1("B_SYNTAX"), // "Syntax",
									flex: 1,
									dataIndex: "syntax"
								},
								{
									xtype: "actioncolumn",
									width: 50,
									items: [
										{
											iconCls: "icon-grid-config",
											handler: function (grid, rowIndex, colIndex) {
												var dlg = new IG$.kpi_3/*dlg_vsyntax*/({
													rec: grid.store.getAt(rowIndex)
												});
												dlg.show();
											}
										}
									]
								}
							]
						}
					]
				}
			],
			buttons: [
				'->',
				{
					text: IRm$.r1('B_CONFIRM'),
					handler: function() {
						this._confirm();
					},
					scope: this
				}, 
				{
					text: IRm$.r1('B_CANCEL'),
					handler:function() {
						this.close();
					},
					scope: this
				}
			]
		});
		IG$.kpi_1/*dlg_vindicator*/.superclass.initComponent.apply(this, arguments);
	},
	listeners: {
		afterrender: function(tobj) {
			tobj.in1/*initApp*/.call(tobj);
		}
	}
});

IG$.__chartoption.chartext.kpi_util = {};

IG$.__chartoption.chartext.kpi_util.procTemplate = function(tmpl, results, _bc, nseq, charts, dataobj, colfix) {
	var me = this,
		i = 0,
		n = tmpl.indexOf("##"),
		n2 = 0,
		otmpl = "",
		in_block = 0,
		block_str = "",
		block_nm = "",
		block_type = "",
		block_region = "",
		b,
		cid,
		tmplvars = {c : colfix + nseq, r: nseq + results.rowfix, colfix: colfix, rowfix: results.rowfix};
		
	if (n < 0)
	{
		otmpl = tmpl;
	}
	
	me._cindex = 0;
	
	while (n > -1)
	{
		n2 = tmpl.indexOf("##", n+2);
		
		if (n2 > -1)
		{
			if (in_block)
			{
				block_str += tmpl.substring(0, n);
			}
			else
			{
				otmpl += tmpl.substring(0, n);
			}
			
			pname = tmpl.substring(n+2, n2);
			
			if (pname.substring(0, "define_data".length) == "define_data")
			{
				in_block = 1;
				block_str = "";
				b = pname.split(":");
				block_type = b[1];
				block_nm = b[2];
				block_region = b[3];
			}
			else if (pname.substring(0, "define_end_data".length) == "define_end_data")
			{
				in_block = 0;
				dataobj.push({
					type: block_type,
					name: block_nm,
					region: block_region,
					data: block_str
				});
			}
			else
			{
				var pval = me.getParamValue(pname, results, _bc, n, tmplvars, colfix);
				
				if (pval.c)
				{
					cid = "mchart_" + (me._cindex++)
					otmpl += "<div id='" + cid + "' class='igc-kpi-mco'></div>";
					charts.push({
						cid: cid,
						c: pval.c
					});
				}
				else
				{
					if (in_block)
					{
						block_str += pval.t;
					}
					else
					{
						otmpl += pval.t;
					}
				}
			}
			
			tmpl = tmpl.substring(n2+2);
			n = tmpl.indexOf("##");
				
			if (n == -1)
			{
				if (in_block)
				{
					block_str += tmpl;
				}
				else
				{
					otmpl += tmpl;
				}
			}
		}
		else
		{
			if (in_block)
			{
				block_str += tmpl;
			}
			else
			{
				otmpl += tmpl;
			}
			n = -1;
			break;
		}
	}
	
	return otmpl;
};

IG$.__chartoption.chartext.kpi_util.getParamValue = function(pval, results, _bc, n, tmplvars, colfix) {
	var r = "-",
		c,
		b_eval = 1;
	
	if (pval.charAt(0) == "{" && pval.charAt(pval.length-1) == "}")
	{
		if (pval.charAt(1) == "C")
		{
			b_eval = 0;
		}
		
		pval = pval.substring(b_eval == 0 ? 2 : 1, pval.length-1);
		pval = this.replaceCellValue(pval, results, _bc, n, tmplvars, colfix);
		
		if (pval.b_eval && b_eval)
		{
			try
			{
				r = eval(pval.r);
				if (isNaN(r) == false)
				{
					r = r.toFixed(0);
				}
			}
			catch (e)
			{
				r = pval.r;
			}
		}
		else
		{
			r = pval.r;
		}
	}
	else if (pval.substring(0, "define".length) == "define")
	{
		r = "";
		var m = pval.indexOf("("),
			pname,
			peval,
			pr;
		if (m > -1)
		{
			pval = pval.substring(m+1);
			m = pval.indexOf(")");
			
			if (m > -1)
			{
				pval = pval.substring(0, m);
			}
			
			m = pval.indexOf(",");
			if (m > -1)
			{
				pname = pval.substring(0, m);
				peval = pval.substring(m+1);
				
				if (pname)
				{
					peval = this.replaceCellValue(peval, results, _bc, n, tmplvars, colfix);
					
					if (peval.b_eval)
					{
						try
						{
							pr = eval(peval.r);
						}
						catch (e)
						{
							pr = peval.r;
						}
					}
					else
					{
						pr = peval.r;
					}
					
					tmplvars[pname] = pr;
				}
			}
		}
	}
	else if (pval.substring(0, "CHART".length) == "CHART")
	{
		var m = pval.indexOf("(");
		
		if (m > -1)
		{
			pval = pval.substring(m+1);
			
			m = pval.indexOf(")");
			
			if (m > -1)
			{
				pval = pval.substring(0, m);
			}
			
			pval = parseInt(pval);
			
			if (results.microcharts && results.microcharts.length > pval)
			{
				c = results.microcharts[pval];
			}
		}
	}
	else
	{
		switch (pval)
		{
		case "NAME":
			r = _bc.name;
			break;
		default:
			r = pval;
			break;
		}
	}
	
	return {
		t: r,
		c: c
	};
};

IG$.__chartoption.chartext.kpi_util.replaceCellValue = function(pval, results, _bc, n, tmplvars, colfix) {
	var r = "",
		n,
		n0, c, cm, cr, cro,
		b_eval = 1,
		iscode = 0;
		
	$.each(tmplvars, function(k, v) {
		var kn = "$" + k,
			ki;
		
		ki = pval.indexOf(kn);
		
		while (ki > -1)
		{
			pval = pval.substring(0, ki) + v + pval.substring(ki+ kn.length);
			ki = pval.indexOf(kn, ki + 1);
		}
	});
	
	n = pval.indexOf("[");
	
	if (n > -1)
	{
		while (n > -1)
		{
			n0 = pval.indexOf("]", n + 1);
			
			if (n0 > -1)
			{
				r += pval.substring(0, n);
				c = pval.substring(n+1, n0);
				
				cr = "";
				
				if (c.indexOf(",") > -1)
				{
					if (pval[n0+1] == "c")
					{
						iscode = 1;
						b_eval = 0;
						n0++;
					}
					
					cm = c.split(",");
					if (cm[0] == "n")
					{
						cm[0] = n + colfix;
					}
					else if (cm[0] == "c")
					{
						cm[0] = n;
					}
					if (cm[1] == "n")
					{
						cm[1] = n + colfix;
					}
					else if (cm[1] == "c")
					{
						cm[1] = n;
					}
					
					try
					{
						cm[0] = parseInt(eval(cm[0]));
						cm[1] = parseInt(eval(cm[1]));
					}
					catch (e)
					{
						
					}
					
					if (results._tabledata.length > cm[0] && results._tabledata[cm[0]].length > cm[1])
					{
						cro = results._tabledata[cm[0]][cm[1]];
						cr = iscode ? (cro.code) : (cro.text || cro.code);
						b_eval = 0;
					}
				}
				
				r += cr;
				
				pval = pval.substring(n0+1);
				n = pval.indexOf("[");
				
				if (n == -1)
				{
					r += pval;
				}
			}
			else
			{
				r += pval;
				break;
			}
		}
	}
	else
	{
		r = pval;
	}
	
	return {
		r: r,
		b_eval: b_eval
	};
};

IG$.__chartoption.chartext.kpi.prototype.replaceCellValue = IG$.__chartoption.chartext.kpi_util.replaceCellValue;
IG$.__chartoption.chartext.kpi.prototype.getParamValue = IG$.__chartoption.chartext.kpi_util.getParamValue;	
IG$.__chartoption.chartext.kpi.prototype.procTemplate = IG$.__chartoption.chartext.kpi_util.procTemplate;

/**
 * draw multiple chart
 */
IG$.__chartoption.chartext.kpi.prototype._drawCharts = function(charts, chartdiv) {
	var j;
	$.each(charts, function(j, chart) {
		var value = charts[j].c, 
			jdiv = $("#" + charts[j].cid + "", chartdiv),
			w = jdiv.width(),
			h = jdiv.height(),
			c = $('<div></div>')
				.appendTo(jdiv)
				.css({ 
					position: 'absolute', 
					margin:0, 
					padding:0, 
					left:0, 
					top: 0, 
					width: w, 
					height: h
				})
				.show();
		
		var opt = {defaultPixelsPerValue: w / value.chartData.elementdata.length},
			chartData = value.chartData,
			series = chartData.seriesdata;
			
		IG$.microChartType(chartData, opt);
		
		if (series && series.length > 0 && series[0].data.length > 0)
		{
			opt.defaultPixelsPerValue = w / (series[0].data.length);
			opt.height = h; 
			opt.tooltipFormat = '{{offset:offset}} {{y:val}}'; //{{value}}';
			opt.tooltipValueLookups = {
				offset: series[0].element
			};
		}
		
		chartdiv.bind("resize", function() {
			jdiv.empty();
			
			var w = jdiv.width(),
				h = jdiv.height(),
				c = $('<div></div>')
					.appendTo(jdiv)
					.css({ 
						position: 'absolute', 
						margin:0, 
						padding:0, 
						left:0, 
						top: 0, 
						width: w, 
						height: h
					})
					.show();
					
			var chartData = value.chartData,
				opt = {defaultPixelsPerValue: chartData.elementdata && chartData.elementdata.length ? w / chartData.elementdata.length : w},
				series = chartData.seriesdata;
				
			IG$.microChartType(chartData, opt);
			
			if (series && series.length > 0 && series[0].data.length > 0)
			{
				opt.defaultPixelsPerValue = w / (series[0].data.length);
				opt.height = h; 
				opt.tooltipFormat = '{{offset:offset}} {{y:val}}'; //{{value}}';
				opt.tooltipValueLookups = {
					offset: series[0].element
				};
			}
			
			c.sparkline((series && series.length > 0) ? series[0].data : [], opt);
		});
		
		c.sparkline((series && series.length > 0) ? series[0].data : [], opt);
	});
};

/**
 * overrides base function after loading
 */
IG$.__chartoption.chartext.kpi.prototype.drawChart = function(owner, results) {
	var me = this,
		container = $(owner.container),
		cop = owner.cop,
		cindopt;
	
	me.owner = owner;
	me.container = container;
	
	if (me.plotarea)
	{
		me.plotarea.remove();
		me.plotarea = null;
	}
	
	me.plotarea = $("<div class='igc-kpi-cnt'></div>").appendTo(container);
	me.plotarea.width(container.width()).height(container.height());
	
	me.plotinner = $("<div class='igc-kpi-inner'></div>").appendTo(me.plotarea);
	
	me.cindopt = cindopt = cop.cindicator ? JSON.parse(cop.cindicator) : {};
	
	if (!me.btn_cfg)
	{
		me.btn_cfg = $("<div class='igc-kpi-cfg'></div>").appendTo(container);
		me.btn_cfg.bind("click", function() {
			var dlg = new IG$.kpi_1/*dlg_vindicator*/({
				cop: cop,
				cindicator: cindopt
			});
			dlg.show();
		});
	}
	
	if (results)
	{
		cindopt.boxcnt = cindopt.boxcnt || "{cols}";
		cindopt.boxconfig = cindopt.boxconfig || []; 
		
		var colfix,
			rowfix,
			rows,
			cols,
			i, // j, k, kname,
			chart,
			// chartdiv,
			tw = container.width(),
			// th = container.height(),
			// px = 0, py = 0, pw, ph,
			// gtype,
			// sname,
			// sdata = [],
			nchart = 0,
			// f_ind_svalue_n = -1,
			ncnt,
			// boxlayout = cindopt.boxlayout,
			tw = 0;
		
		cols = results.colcnt;
		rows = results._tabledata.length;
		colfix = results.colfix;
		rowfix = results.rowfix;
		
		me.dataIndex = 0;
		me.charts = [];
		me.results = results;
		
		switch (cindopt.boxcnt)
		{
		case "{cols}":
			ncnt = cols - colfix;
			break;
		case "{rows}":
			ncnt = rows - rowfix;
			break;
		default:
			ncnt = parseInt(cindopt.boxcnt);
			break;
		}
		
		ncnt = ncnt || 1;
		
		var cobj = [];
		
		for (i=0; i < ncnt; i++)
		{
			cobj.push({
				seq: i
			});
		}
		
		$.each(cobj, function(i, c) {
			var charts = [],
				dataobj = [],
				hcharts = [],
				hc;
			
			var _bc = cindopt.boxconfig.length > i ? cindopt.boxconfig[i] : null;
			
			if (!_bc && cindopt.boxconfig.length)
			{
				_bc = cindopt.boxconfig[i % cindopt.boxconfig.length];
			}
			
			var chartdiv = $("<div class='igc-kpi-blk' style='position:absolute'></div>").appendTo(me.plotinner);
			
			var tmpl = "<div class='pind-box'><div class='pind-title'>"
				+ "<span class='pind-title-text'>" + (_bc ? _bc.name : "") + "</span>"
				+ "</div>"
				+ "<div class='pind-content'>"
				+ "<h1 class='pind-value'></h1><div class='pind-s-text'></div><small></small></div></div>";
				
			if (_bc && _bc.syntax)
			{
				tmpl = _bc.syntax;
			}
			
			var tout = me.procTemplate(tmpl, results, _bc, i, charts, dataobj, colfix);
			
			var o = $(tout).appendTo(chartdiv);
			
			if (charts.length)
			{
				me._drawCharts.call(me, charts, chartdiv);
			}
			
			if (dataobj)
			{
				$.each(dataobj, function(i, m) {
					var rg = $("#" + m.region, o),
						copt = eval("(" + m.data + ")"),
						hc;
					
					switch (m.type)
					{
					case "highcharts":
						copt.chart.renderTo = rg[0];
						
						if (window.Highcharts)
						{
							hc = new Highcharts.Chart(copt);
							hcharts.push(hc);
						}
						break;
					case "echarts":
						copt.chart = copt.chart || {};
						copt.chart.renderTo = rg[0];
						
						if (window.echarts)
						{
							hc = echarts.init(copt.chart.renderTo, cop.echart_theme || ig$.echarts_theme || 'amplix', {
								renderer: "canvas" // "svg"
							});
							
							hc.renderTo = copt.chart.renderTo;
							hc.setOption(copt);
							hcharts.push(hc);
						}
						break;
					}
				});
			}
			
			if (hcharts.length)
			{
				chartdiv.bind("resize", function() {
					var i,
						mdiv = $(this),
						mw = IG$.j$ext._w(mdiv),
						mh = IG$.j$ext._h(mdiv);
						
					for (i=0; i < hcharts.length; i++)
					{
						var mchart = hcharts[i],
							dom = $(mchart.renderTo),
							w = IG$.j$ext._w(dom),
							h = IG$.j$ext._h(dom);
						
						w = Math.min(w, mw);
						h = Math.min(h, mh);
						
						if (w > 0 && h > 0)
						{
							if (window.Highcharts)
							{
								mchart.setSize.call(mchart, w, h, doAnimation = true);
								dom.hide().show(0);
							}
							else
							{
								mchart.resize({width: w, height: h});
							}
						}
					}
				});
				
				if (window.bowser && window.bowser.msie && Number(window.bowser.version) < 10)
				{
					chartdiv.trigger("resize");
				}
			}
			
			tw += chartdiv.outerWidth();
			chartdiv.appendTo(me.plotinner);
			chartdiv.css({
				position: "relative",
				top: "initial"
			});
			
			me.charts.push({
				chart: chart,
				chartdiv: chartdiv,
				mcharts: charts
			});
			
			nchart++;
		});
		
		me.updateLayout.call(me);
		
		me.plotarea.removeClass("horizontal");
		
		if (me.cindopt.boxlayout != "vscr" && me.cindopt.boxlayout != "vfit")
		{
			me.plotarea.addClass("horizontal");
		}
		
		if (tw && me.cindopt.boxlayout == "hscr")
		{
			me.plotinner.width(tw);
		}
		
		if (me.cindopt.boxlayout == "vscr" || me.cindopt.boxlayout == "hscr")
		{
			me.plotarea.mCustomScrollbar({
				axis: me.cindopt.boxlayout == "vscr" ? "y" : "x",
				theme: "minimal-dark",
				autoHideScrollbar: true,
				scrollbarPosition: "outside",
				autoDraggerLength: true
			});
		}
	}
};

IG$.__chartoption.chartext.kpi.prototype.updateLayout = function(resized) {
	var me = this,
		cindopt = me.cindopt,
		container = me.container,
		charts = me.charts,
		tw = container ? container.width() : 0,
		th = container ? container.height() : 0,
		px = 0, py = 0, pw, ph, aw, ah,
		i,
		boxlayout, box, chartdiv,
		plotarea = me.plotarea,
		ncnt, ox = "hidden", oy = "hidden";

	if (cindopt && charts && charts.length)
	{
		ncnt = charts.length;
		
		boxlayout = cindopt.boxlayout;
		
		switch (boxlayout)
		{
		case "vfit":
			pw = tw;
			ph = th / ncnt;
			break;
		case "vscr":
			pw = tw;
			ph = 0;
			oy = "auto";
			break;
		case "hscr":
			pw = 0;
			ph = th;
			ox = "auto";
			break;
		default:
			pw = tw / ncnt;
			ph = th;
			break;
		}
		
		// plotarea.css({overflowX: ox, overflowY: oy});
		
		for (i=0; i < charts.length; i++)
		{
			chartdiv = charts[i].chartdiv;
			
			if (!chartdiv)
				continue;

			box = {};
			
			// box.top = py + "px";
			// box.left = px + "px";
			
			if (pw > 0)
			{
				box.width = pw + "px";
			}
			else if (boxlayout == "hscr")
			{
				box.width = "auto";
			}
			if (ph > 0)
			{
				box.height = ph + "px";
			}

			chartdiv.css(box);
			
			aw = IG$.j$ext._w(chartdiv);
			ah = IG$.j$ext._h(chartdiv);
			
			switch (boxlayout)
			{
			case "vfit":
				py += ah;
				break;
			case "vscr":
				py += ah;
				break;
			case "hscr":
				px += ah;
				break;
			default:
				px += aw;
				break;
			}
			
			chartdiv.trigger("resize");
		}
	}
}

IG$.__chartoption.chartext.kpi.prototype.updatedisplay = function(owner, w, h) {
	// this.map.m1.call(this.map);
	var me = this,
		i,
		px = 0, py = 0, pw, ph = h;
	
	if (me.plotarea)
	{	
		me.plotarea.width(w).height(h);
	}
	
	if (me.charts && me.charts.length > 0)
	{
		setTimeout(function() {
			me.updateLayout.call(me, 1);
		}, 10);
	}
}


IG$.__chartoption.chartext.kpi.prototype.destroy = function() {
	var me = this,
		owner = me.owner;
		
	if (owner && owner.container)
	{
		$(owner.container).empty();
	}
}

IG$.kpiTWc = $s.extend($s.window, {

	width: 500,
	height: 520,
	layout: "fit",
	padding: 5,
	
	_init: function() {
		var me = this,
			toptions = me.down("[name=toptions]"),
			controls = [];
		
		me.tsel = {};
			
		me._add_ctrl(me.parameters, controls);
		
		$.each(controls, function(i, ctrl) {
			toptions.add(ctrl);
		});
	},
	
	_add_ctrl: function(params, controls) {
		var me = this,
			rop = me.rop;
		
		$.each(params, function(i, param) {
			var ctrl = {
				xtype: "textfield",
				fieldLabel: param.name,
				name: param.name,
				required: param.required,
				value: param.value,
				emptyText: param.emptyText
			};
			
			if (param.xtype == "combobox")
			{
				ctrl.xtype = param.xtype;
				ctrl.displayField = "name";
				ctrl.valueField = "value";
				ctrl.store = {
					data: param.data
				};
			}
			else
			{
				ctrl.xtype = param.xtype || "textfield";
			}
			
			controls.push(ctrl);
		});
	},
	
	_confirm: function(b_close) {
		var me = this,
			toptions = me.down("[name=toptions]"),
			tsel,
			thtml;
			
		if (toptions.getAllValues(me.tsel))
			return;
			
		tsel = me.tsel;
		
		thtml = me._proc(me.syntax.split("\n"), tsel);
		
		if (b_close !== false)
		{
			me.callback && me.callback.execute(thtml);
			me.close();
		}
		else
		{
			return thtml;
		}
	},
	
	_proc: function(tarr, tsel) {
		var r = [];
		
		if (tarr && tarr.length)
		{
			$.each(tarr, function(i, c) {
				var s = c,
					n1 = s.indexOf("{"),
					n2;
				
				while (n1 > -1)
				{
					n2 = s.indexOf("}", n1);
					
					if (n2 > -1)
					{
						var mm = s.substring(n1 + 1, n2);
						
						if (mm.indexOf(".") > -1)
						{
							var mm1 = mm.substring(0, mm.indexOf(".")),
								mm2 = mm.substring(mm.indexOf(".") + 1);
								
							if (tsel[mm1])
							{
								s = s.substring(0, n1) + (tsel[mm1][mm2] || "") + s.substring(n2 + 1);
							}
						}
						else if (tsel[mm])
						{
							s = s.substring(0, n1) + tsel[mm] + s.substring(n2 + 1);
						}
					}
					else
					{
						break;
					}
					
					n1 = s.indexOf("{", n1 + 1);
				}
				
				r.push(s);
			});
		}
		
		return r.join("\n");
	},
	
	_preview: function() {
		var me = this,
			gpreview = me.down("[name=gpreview]"),
			gpreview_dom = $("#gpreview", gpreview.body.dom),
			thtml
			
		gpreview_dom.empty();
		
		thtml = me._confirm(false);
		
		if (thtml)
		{
			var charts = [],
				dataobj = [];
				
			var arg = [
				thtml,
				{
					rowfix: 1,
					colfix: 1,
					_tabledata: []
				},
				null,
				0,
				charts,
				dataobj,
				1
			];
			
			var rhtml = me.procTemplate.apply(this, arg);
			$(rhtml).appendTo(gpreview_dom);
		}
	},
	
	replaceCellValue: IG$.__chartoption.chartext.kpi_util.replaceCellValue,
	getParamValue: IG$.__chartoption.chartext.kpi_util.getParamValue,
	procTemplate: IG$.__chartoption.chartext.kpi_util.procTemplate,
	
	initComponent: function(){
		var me = this;
		
		$s.apply(me, {
			title: "Option Values",
			items: [
				{
					xtype: "panel",
					padding: 10,
					layout: {
						type: "vbox",
						align: "stretch"
					},
					autoScroll: true,
					items: [
						{
							xtype: "fieldset",
							title: "Option Values",
							name: "toptions",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								
							]
						},
						{
							xtype: "button",
							text: "Preview",
							handler: function() {
								this._preview();
							},
							scope: this
						},
						{
							html: "<div id='gpreview'></div>",
							name: "gpreview",
							height: 400
						}
					]
				}
			],
			buttons: [
				"->",
				{
					xtype: "button",
					text: IRm$.r1("B_CONFIRM"),
					handler: function() {
						this._confirm();
					},
					scope: this
				},
				{
					xtype: "button",
					text: IRm$.r1("B_CANCEL"),
					handler: function() {
						this.close();
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(tobj) {
					tobj._init();
				}
			}
		});
		
		IG$.kpiTWc.superclass.initComponent.call(this);
	}
});