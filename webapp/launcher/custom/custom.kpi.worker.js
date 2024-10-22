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
			tsyntax = me.down("[name=tsyntax]"),
			sval = tsyntax.getValue();
			
		me.rec.set("syntax", sval);
			
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
						syntax: IG$._decodeVal(t.syntax),
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
			syntax = r ? r.get("syntax") : null,
			dlg;
		
		tsyntax.setValue(syntax || "");
	},
	
	initComponent: function() {
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: ig$.padding,
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
					bodyCls: "ig-btn-confirm",
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
			
			$.each(copt.boxconfig, function(i, b) {
				b.syntax = IG$._decodeVal(b.syntax);
			});
			
			colconfig.store.loadData(copt.boxconfig);
		}
	},
	
	_confirm: function() {
		var me = this,
			copt = me.cindicator,
			colconfig = me.down("[name=colconfig]"),
			colconfig_store = colconfig.store,
			rec, i, cc,
			syntax;
			
		if (copt)
		{
			copt.boxcnt = me.down("[name=boxcnt]").getValue();
			copt.boxlayout = me.down("[name=boxlayout]").getValue();
			copt.boxconfig = [];
			
			for (i=0; i < colconfig_store.data.items.length; i++)
			{
				rec = colconfig_store.data.items[i];
				syntax = rec.get("syntax");
				
				cc = {
					name: rec.get("name"),
					syntax: IG$._encodeVal(syntax)
				};
				copt.boxconfig.push(cc);
			}
			
			me.cop.cindicator = IG$._encodeVal(JSON.stringify(copt));
		}
		this.close();
	},
	
	initComponent: function() {
		var me = this;
		
		$s.apply(this, {
			items: [
				{
					xtype: "panel",
					bodyPadding: ig$.padding,
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
													instance: me.instance,
													rec: grid.store.getAt(rowIndex)
												});
												IG$.showDlg(me, dlg);
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
					bodyCls: "ig-btn-confirm",
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

/**
 * draw multiple chart
 */
IG$.cVis.kpi.prototype._drawCharts = function(charts, chartdiv) {
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
IG$.cVis.kpi.prototype.draw = function(results) {
	var me = this,
		chartview = me.chartview,
		container = $(chartview.container),
		cop = chartview.cop,
		cindopt;
	
	me.container = container;
	
	if (me.plotarea)
	{
		me.plotarea.remove();
		me.plotarea = null;
	}

	me.$cobj = null;
	
	me.plotarea = $("<div class='igc-kpi-cnt'></div>").appendTo(container);
	me.plotarea.width(container.width()).height(container.height());
	
	me.plotinner = $("<div class='igc-kpi-inner text-center'></div>").appendTo(me.plotarea);
	
	me.cindopt = cindopt = cop.cindicator ? JSON.parse(IG$._decodeVal(cop.cindicator)) : {};
	
	if (!me.btn_cfg)
	{
		me.btn_cfg = $("<div class='igc-kpi-cfg'></div>").appendTo(container);
		me.btn_cfg.bind("click", function() {
			var dlg = new IG$.kpi_1/*dlg_vindicator*/({
				instance: me.instance,
				cop: cop,
				cindicator: cindopt
			});
			IG$.showDlg(me, dlg);
		});
	}
	
	if (results)
	{
		cindopt.boxcnt = cindopt.boxcnt || "{cols}";
		cindopt.boxconfig = cindopt.boxconfig || []; 
		cindopt.boxlayout = cindopt.boxlayout || "hfit";
		
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
		
		var cobj = me.$cobj || [];
		
		for (i=cobj.length; i < ncnt; i++)
		{
			cobj.push({
				seq: i
			});
		}

		me.$cobj = cobj;

		var pnode = me.plotinner,
			span = 12;

		if (me.cindopt.boxlayout == "hscr" || me.cindopt.boxlayout == "hfit")
		{
			pnode = $("<div class='kpi-row'></div>").appendTo(me.plotinner);
			span = Math.floor(12 / cobj.length);
			span = span < 1 ? 1 : span;
		}
		
		$.each(cobj, function(i, c) {
			var dataobj = [],
				hcharts = [],
				hc;
			
			var _bc = cindopt.boxconfig.length > i ? cindopt.boxconfig[i] : null;
			
			if (!_bc && cindopt.boxconfig.length)
			{
				_bc = cindopt.boxconfig[i % cindopt.boxconfig.length];
			}
			
			var chartdiv = null,
				cnode = pnode;

			if (me.cindopt.boxlayout == "vscr" || me.cindopt.boxlayout == "vfit")
			{
				cnode = $("<div class='row'></div>").appendTo(pnode);
			}
			
			chartdiv = $("<div class='igc-kpi-blk col-lg-" + span + " col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative'></div>").appendTo(cnode);
			
			var tmpl = [

			].join("\n");
				
			if (_bc && _bc.syntax)
			{
				tmpl = _bc.syntax;
				tmpl = IG$._decodeVal(tmpl);
			}

			if (!c._dyn_sc)
			{
				try
				{
					IG$.cVis.kpi.$dyn_id = IG$.cVis.kpi.$dyn_id || 0;
					IG$.cVis.kpi.$dyn_sc = IG$.cVis.kpi.$dyn_sc || {};
					var id = "kpi_chart_" + (IG$.cVis.kpi.$dyn_id++);
					var dyn = new IG$.cDynScript(id, 0),
						script = "IG$.cVis.kpi.$dyn_sc[\"" + id + "\"]=function(html, data, i, charts) {" + tmpl + "}";
						
					dyn.loadScript(script);

					c._dyn_sc = IG$.cVis.kpi.$dyn_sc[id];
				}
				catch (e)
				{
					console.log("error on dynamic script loader", e);
					IG$.ShowError("Error on dynamic script loader", null, null, {errstack: e.stack});
				}
			}
			
			c._dyn_sc && c._dyn_sc.apply(me, [chartdiv, results._tabledata, i, dataobj]);
			
			if (dataobj && dataobj.length)
			{
				$.each(dataobj, function(i, m) {
					var hc;
					
					switch (m.type)
					{
					case "_modc_":
					case "echarts":
						if (window.echarts && m.option && m.option.renderTo)
						{
							hc = echarts.init(m.option.renderTo, cop.echart_theme || ig$.echarts_theme || 'amplix', {
								renderer: "canvas" // "svg"
							});
							
							hc.renderTo = m.option.renderTo;
							hc.setOption(m.option);
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
							// if (window.Highcharts)
							// {
							// 	mchart.setSize.call(mchart, w, h, doAnimation = true);
							// 	dom.hide().show(0);
							// }
							// else
							// {
								mchart.resize({width: w, height: h});
							// }
						}
					}
				});
				
				if (window.bowser && window.bowser.msie && Number(window.bowser.version) < 10)
				{
					chartdiv.trigger("resize");
				}
			}
			
			tw += chartdiv.outerWidth();
			
			me.charts.push({
				chart: chart,
				chartdiv: chartdiv
			});
			
			nchart++;
		});
		
		me.updateLayout();
		
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
			IG$.setScrRect(me.plotarea, {
				axis: me.cindopt.boxlayout == "vscr" ? "y" : "x"
			});
		}
	}
};

IG$.cVis.kpi.prototype.updateLayout = function(resized) {
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

IG$.cVis.kpi.prototype.updatedisplay = function(w, h) {
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
			me.updateLayout(1);
		}, 10);
	}
}


IG$.cVis.kpi.prototype.dispose = function() {
	var me = this,
		chartview = me.chartview;
		
	if (chartview && chartview.container)
	{
		$(chartview.container).empty();
	}
}
