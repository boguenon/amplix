// make custom chart wizard panels

IG$.__chartoption.chartcateg.push({
	name: "Time based Stock Chart",
	value: "h-stock"
});

IG$.cSET/* chartOptionSet */= "f_palette;f_showvalues;m_zoom_level;m_marker;m_min;m_max;s_t_f;s_t_fo;e3d_en;e3d_al;e3d_be;e3d_de;e3d_vd;edu_val1;cdata_m_tmpl;m_xypos;m_arc_basemap";

IG$._customChartPanels = function() {
	return [
	// p2 panel
	// for map chart extension
	{
		layout: {
			type: "vbox",
			align: "stretch"
		},
		border: 0,
		title: IRm$.r1("L_EXTRA_OPTIONS"), // "Extra Options",
		defaults: {
			anchor: "100%"
		},
		autoScroll: true,
		
		initData: function() {
			var me = this, 
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null);

			if (option) {
				option.settings = option.settings || {};
				
				var d1 = [{name: "Select Value", value: ""}],
					d2 = [{name: "Select Value", value: ""}],
					d3 = [{name: "Select Value", value: ""}],
					d1val = "", d2val = "";
					
				$.each(ma.sheetoption.model.rows, function(i, row) {
					d1.push({
						name: row.name,
						value: row.uid
					});
					
					d2.push({
						name: row.name,
						value: row.uid
					});
					
					d3.push({
						name: row.name,
						value: row.uid
					});
					
					if (option.settings.m_lat == row.uid)
					{
						d1val = row.uid;
					}
					
					if (option.settings.m_lng == row.uid)
					{
						d2val = row.uid;
					}
				});
				
				if (ig$.svg_renderers)
				{
					var dp = [{name: IRm$.r1("B_SELECT"), value: ""}],
						renderers = ig$.svg_renderers.split("\n");
					
					$.each(renderers, function(i, r) {
						var p = r.split(",");
						if (p.length > 1)
						{
							dp.push({name: p[0], value: p[1]});
						}
					});
					
					me.down("[name=m_svgtype]").store.loadData(dp);
				}
				
				me.down("[name=m_lat]").store.loadData(d1);
				me.down("[name=m_lng]").store.loadData(d2);
				me.down("[name=m_color_categ]").store.loadData(d3);
				
				me.down("[name=m_zoom_level]").setValue(option.m_zoom_level || "8");
				me.down("[name=m_marker]").setValue(option.m_marker || "");
				me.down("[name=m_min]").setValue(option.m_min || "1000");
				me.down("[name=m_max]").setValue(option.m_max || "10000");
				me.down("[name=m_min_color]").setValue(option.settings.m_min_color || "#e60000"); // red
				me.down("[name=m_mid_color]").setValue(option.settings.m_mid_color || "#0000e6"); // blue
				me.down("[name=m_max_color]").setValue(option.settings.m_max_color || "#00e600"); // green
				me.down("[name=cdata_m_tmpl]").setValue(option.cdata_m_tmpl);
				me.down("[name=m_xypos]").setValue(option.m_xypos || "");
				me.down("[name=m_map_center]").setValue(option.settings.m_map_center || "");
				me.down("[name=m_lat]").setValue(d1val);
				me.down("[name=m_lng]").setValue(d2val);
				me.down("[name=m_svgtype]").setValue(option.settings.m_svgtype || "");
				me.down("[name=m_color_categ]").setValue(option.settings.m_color_categ || "");
				me.down("[name=m_marker_size]").setValue(option.settings.m_marker_size || "20");
				me.down("[name=m_marker_symbol]").setValue(option.settings.m_marker_symbol || "");
				me.down("[name=m_map_legend]").setValue(option.settings.m_map_legend || "");
				
				if (ig$.arcgis_basemap)
				{
					var basemaps = ig$.arcgis_basemap.split("\n"),
						i, pbase = [],
						prec;
					
					for (i=0; i < basemaps.length; i++)
					{
						prec = basemaps[i].split(",");
						
						if (basemaps[i] == "none")
						{
							pbase.push({
								name: "No basemap",
								value: "-"
							})
						}
						else if (prec.length > 1 && prec[0] && prec[1])
						{
							pbase.push({
								name: prec[0],
								value: prec[0] 
							});
						}
					}
					
					if (pbase.length)
					{
						me.down("[name=m_arc_basemap]").store.loadData(pbase);
					}
				}
				
				me.down("[name=m_arc_basemap]").setValue(option.settings.m_arc_basemap || "");
				
				// arc layer selection
				var esri_api_layers = me.down("[name=m_arc_layers]"),
					dp = [],
					dpmap = {};
					
				if (ig$.arcgis_rest$)
				{
					
				}
				else if (ig$.arcgis_rest)
				{
					ig$.arcgis_rest$ = [];
					var v = ig$.arcgis_rest.split("\n"),
						i, sv;
						
					for (i=0; i < v.length; i++)
					{
						if (v[i])
						{
							sv = v[i].split(",");
							
							if (sv.length == 3 && sv[0] && sv[1] && sv[2])
							{
								ig$.arcgis_rest$.push({
									name: sv[0],
									loader: sv[1],
									url: sv[2]
								});
							}
						}
					}
				}
					
				if (ig$.arcgis_rest$ && ig$.arcgis_rest$.length)
				{
					if (option.settings.m_arc_layers)
					{
						$.each(option.settings.m_arc_layers, function(i, d) {
							dpmap[d] = 1;
						});
					}
					
					$.each(ig$.arcgis_rest$, function(i, d) {
						var m = {
							name: d.name,
							selected: dpmap[d.name] ? true : false
						};
						dp.push(m);
					});
					
					esri_api_layers.store.loadData(dp);
				}
			}
		},

		updateOptionValues: function() {
			var me = this, 
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null);

			if (option) {
				option.settings = option.settings || {};
				
				option.m_zoom_level = "" + me.down("[name=m_zoom_level]").getValue();
				option.m_marker = me.down("[name=m_marker]").getValue();
				option.m_min = "" + me.down("[name=m_min]").getValue();
				option.m_max = "" + me.down("[name=m_max]").getValue();
				option.settings.m_min_color = me.down("[name=m_min_color]").getValue();
				option.settings.m_mid_color = me.down("[name=m_mid_color]").getValue();
				option.settings.m_max_color = me.down("[name=m_max_color]").getValue();
				option.cdata_m_tmpl = me.down("[name=cdata_m_tmpl]").getValue();
				option.m_xypos = me.down("[name=m_xypos]").getValue();
				option.settings.m_arc_basemap = me.down("[name=m_arc_basemap]").getValue();
				option.settings.m_map_center = me.down("[name=m_map_center]").getValue();
				option.settings.m_lat = me.down("[name=m_lat]").getValue();
				option.settings.m_lng = me.down("[name=m_lng]").getValue();
				option.settings.m_svgtype = me.down("[name=m_svgtype]").getValue();
				option.settings.m_color_categ = me.down("[name=m_color_categ]").getValue();
				option.settings.m_marker_size = me.down("[name=m_marker_size]").getValue();
				option.settings.m_marker_symbol = me.down("[name=m_marker_symbol]").getValue();
				option.settings.m_map_legend = me.down("[name=m_map_legend]").getValue();
				
				// arc layer selection
				option.settings.m_arc_layers = [];
				
				var m_arc_layers = me.down("[name=m_arc_layers]"),
					sel = m_arc_layers.getSelectionModel().selected,
					i;
					
				for (i=0; i < sel.length; i++)
				{
					option.settings.m_arc_layers.push(sel.items[i].get("name"));
				}
			}
		},
		invalidateFields: function(opt) {
			var me = this, subtype = opt.subtype;

			me.down("[name=pb01]").setVisible(
				subtype == "googlemap" ||
				subtype == "navermap" ||
				subtype == "esri" ||
				subtype == "vworldmap");
			me.down("[name=m_xypos]").setVisible(subtype == "vworldmap");
			me.down("[name=pb02]").setVisible(subtype == "kpi");
			me.down("[name=m_arc_basemap]").setVisible(subtype == "esri");
			me.down("[name=pb03]").setVisible(subtype == "svgmap");
			
			if (ig$.arcgis_rest$)
			{
				
			}
			else if (ig$.arcgis_rest)
			{
				ig$.arcgis_rest$ = [];
				var v = ig$.arcgis_rest.split("\n"),
					i, sv;
					
				for (i=0; i < v.length; i++)
				{
					if (v[i])
					{
						sv = v[i].split(",");
						
						if (sv.length == 3 && sv[0] && sv[1] && sv[2])
						{
							ig$.arcgis_rest$.push({
								name: sv[0],
								loader: sv[1],
								url: sv[2]
							});
						}
					}
				}
			}
			
			// arc layer selection
			me.down("[name=m_arc_layers]").setVisible(subtype == "esri" && ig$.arcgis_rest$ && ig$.arcgis_rest$.length);
		},
		items: [
			{
				xtype: "container",
				layout: "anchor",
				name: "pb01",
				hidden: true,
				items: [
					{
						xtype: "fieldset",
						title: IRm$.r1("L_MAP_OPTIONS"), // "Map options",
						layout: "anchor",

						items: [ 
							{
								xtype: "numberfield",
								name: "m_zoom_level",
								fieldLabel: IRm$.r1("L_ZOOM_LEVEL"), // "Zoom Level",
								minValue: 1,
								maxValue: 10
							} 
						]
					},
					{
						xtype: "fieldset",
						title: IRm$.r1("L_MAP_DRAW_OPTIONS"), // "Map Draw options",
						layout: "anchor",
						items: [
							{
								xtype: "combobox",
								name: "m_marker",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								editable: false,
								autoSelect: true,
								fieldLabel: IRm$.r1("L_PALETTE"), // "Palette",
								store: {
									xtype: "store",
									fields: ["name", "value" ],
									data: [
										{
											name: "Marker",
											value: ""
										},
										{
											name: "Circle",
											value: "circle"
										},
										{
											name: "Info",
											value: "info"
										} 
									]
								},
								listeners: {
									change: function(tobj) {
										var me = this,
											ma = me.__main__,
											mp = me.__mainp__,
											sval = tobj.getValue();

										mp.down("[name=cdata_m_tmpl]").setVisible(sval == "info");
										mp.down("[name=mf_colors]").setVisible(sval == "circle");
										mp.down("[name=mf_color_categ_c]").setVisible(sval != "circle");
									},
									scope: this
								}
							},
							{
								xtype: "fieldcontainer",
								layout: {
									type: "vbox",
									align: "stretch"
								},
								name: "mf_color_categ_c",
								hidden: true,
								items: [
									{
										xtype: "combobox",
										fieldLabel: IRm$.r1("L_COLOR_CATEG"),
										name: "m_color_categ",
										store: {},
										displayField: "name",
										valueField: "value"
									},
									{
										xtype: "combobox",
										fieldLabel: IRm$.r1("L_MARKER_SIZE"),
										name: "m_marker_size",
										store: {
											data: [
												{name: "5", value: "5"},
												{name: "10", value: "10"},
												{name: "20", value: "20"},
												{name: "25", value: "25"},
												{name: "30", value: "30"}
											]
										},
										displayField: "name",
										valueField: "value"
									},
									{
										xtype: "combobox",
										fieldLabel: IRm$.r1("L_MARKER_SYMBOL"),
										name: "m_marker_symbol",
										store: {
											data: [
												{name: "Circle", value: ""},
												{name: "Cross", value: "STYLE_CROSS"},
												{name: "Diamond", value: "STYLE_DIAMOND"},
												{name: "Square", value: "STYLE_SQUARE"},
												{name: "Triangle", value: "STYLE_TRIANGLE"},
												{name: "Diagnoal Cross", value: "STYLE_X"},
											]
										},
										displayField: "name",
										valueField: "value"
									}
								]
							},
							{
								xtype: "fieldcontainer",
								layout: {
									type: "vbox",
									align: "stretch"
								},
								name: "mf_colors",
								hidden: true,
								items: [
									{
										xtype: "fieldcontainer",
										anchor: "100%",
										fieldLabel: IRm$.r1("L_MIN_COLOR"),
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												name: "m_min_color",
												width: 120
											},
											{
												xtype: "splitter"
											},
											{
												xtype: "splitbutton",
												width: 30,
												menu: {
													showSeparator: false,
													items: [
														{
															xtype: "colorpicker",
															listeners: {
																select: function(cp, color) {
																	var ctrl = this.down("[name=m_min_color]");
																	ctrl.setValue("#" + color);
																},
																scope: this
															}
														}, 
														"-"
													]
												}
											},
											{
												xtype: "container",
												flex: 1
											}
										]
									},
									{
										xtype: "fieldcontainer",
										anchor: "100%",
										fieldLabel: IRm$.r1("L_MID_COLOR"),
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												name: "m_mid_color",
												width: 120
											},
											{
												xtype: "splitter"
											},
											{
												xtype: "splitbutton",
												width: 30,
												menu: {
													showSeparator: false,
													items: [
														{
															xtype: "colorpicker",
															listeners: {
																select: function(cp, color) {
																	var ctrl = this.down("[name=m_mid_color]");
																	ctrl.setValue("#" + color);
																},
																scope: this
															}
														}, 
														"-"
													]
												}
											},
											{
												xtype: "container",
												flex: 1
											}
										]
									},
									{
										xtype: "fieldcontainer",
										anchor: "100%",
										fieldLabel: IRm$.r1("L_MAX_COLOR"),
										layout: {
											type: "hbox",
											align: "stretch"
										},
										items: [
											{
												xtype: "textfield",
												name: "m_max_color",
												width: 120
											},
											{
												xtype: "splitter"
											},
											{
												xtype: "splitbutton",
												width: 30,
												menu: {
													showSeparator: false,
													items: [
														{
															xtype: "colorpicker",
															listeners: {
																select: function(cp, color) {
																	var ctrl = this.down("[name=m_max_color]");
																	ctrl.setValue("#" + color);
																},
																scope: this
															}
														}, 
														"-"
													]
												}
											},
											{
												xtype: "container",
												flex: 1
											}
										]
									}
								]
							},
							{
								xtype: "numberfield",
								fieldLabel: IRm$.r1("L_MIN_RADIUS"), // "Min radius",
								name: "m_min",
								minValue: 100,
								maxValue: 1000000
							},
							{
								xtype: "numberfield",
								fieldLabel: IRm$.r1("L_MAX_RADIUS"), // "Max radius",
								name: "m_max",
								minValue: 100,
								maxValue: 10000000
							},
							{
								xtype: "combobox",
								fieldLabel: IRm$.r1("B_LAT"),
								name: "m_lat",
								store: {},
								displayField: "name",
								valueField: "value"
							},
							{
								xtype: "combobox",
								fieldLabel: IRm$.r1("B_LNG"),
								name: "m_lng",
								store: {},
								displayField: "name",
								valueField: "value"
							},
							{
								xtype: "textarea",
								anchor: "100%",
								fieldLabel: IRm$.r1("L_TEMPLATE"), // "Template",
								name: "cdata_m_tmpl",
								hidden: true
							},
							{
								xtype: "textfield",
								name: "m_map_center",
								fieldLabel: IRm$.r1("L_MAP_CENTER_LAT_LNG"), // "Map Center(Lat,Lng)"
							},
							{
								xtype: "combobox",
								name: "m_arc_basemap",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								hidden: true,
								fieldLabel: IRm$.r1("L_BASEMAP"), // "Base Map",
								store: {
									data: [
										{name: "dark-gray", value: "dark-gray"},
										{name: "dark-gray-vector", value: "dark-gray-vector"},
										{name: "gray", value: "gray"},
										{name: "gray-vector", value: "gray-vector"},
										{name: "national-geographic", value: "national-geographic"},
										{name: "oceans", value: "oceans"},
										{name: "osm", value: "osm"},
										{name: "satellite", value: "satellite"},
										{name: "streets", value: "streets"},
										{name: "streets-navigation-vector", value: "streets-navigation-vector"},
										{name: "streets-night-vector", value: "streets-night-vector"},
										{name: "streets-relief-vector", value: "streets-relief-vector"},
										{name: "streets-vector", value: "streets-vector"},
										{name: "terrain", value: "terrrain"},
										{name: "topo", value: "topo"},
										{name: "topo-vector", value: "topo-vector"}
									]
								}	
							},
							{
								xtype: "combobox",
								name: "m_xypos",
								queryMode: "local",
								displayField: "name",
								valueField: "value",
								editable: false,
								autoSelect: true,
								hidden: true,
								fieldLabel: IRm$.r1("L_GEOCODE"), // "GeoCode",
								store: {
									xtype: "store",
									fields: ["name","value" ],
									data: [
										{
											name: "Unknown",
											value: ""
										},
										{
											name: "EPSG:4326",
											value: "EPSG:4326"
										},
										{
											name: "EPSG:3857",
											value: "EPSG:3857"
										} 
									]
								}
							},
							{
								xtype: "textarea",
								name: "m_map_legend",
								fieldLabel: IRm$.r1("L_CUST_LEGEND"),
								height: 120
							}
						]
					},
					// arc layer selection
					{
						xtype: "gridpanel",
						title: IRm$.r1("L_ARCGIS_LAYERS"), // "ArcGIS MapLayers",
						name: "m_arc_layers",
						hidden: true,
						height: 300,
						selType: "checkboxmodel",
						selModel: {
							mode: "MULTI"
						},
						store: {
							data: [
							]
						},
						columns: [
							{
								text: IRm$.r1("B_NAME"),
								dataIndex: "name"
							}
						]
					}
				]
			},
			{
				xtype: "fieldset",
				title: IRm$.r1("L_KPI_INDI"), // "KPI Indicator",
				layout: "anchor",
				hidden: true,
				name: "pb02",
				items: [ 
					{
						xtype: "button",
						text: IRm$.r1("L_INDICATOR_WIZARD"),
						handler: function() {
							var me = this,
								ma = me.__main__,
								chartoption = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null)
								
							if (!window.IG$.kpi_1/* dlg_vindicator */)
							{
								var me = this, 
									js = [ "./custom/custom.kpi.worker.js" ], 
									ltest = 0; 
								
								var cindopt = chartoption.cindicator ? JSON.parse(chartoption.cindicator) : {};
	
								IG$.getScriptCache(js,
									new IG$.callBackObj(me,
										function() {
											var dlg = new IG$.kpi_1/* dlg_vindicator */(
													{
														cop: chartoption,
														cindicator: cindopt
													});
											dlg.show();
										}
									)
								);
							}
							else
							{
								var cindopt = chartoption.cindicator ? JSON.parse(chartoption.cindicator) : {};
								var dlg = new IG$.kpi_1/* dlg_vindicator */(
									{
										cop: chartoption,
										cindicator: cindopt
									});
								dlg.show();
							}
							
						},
						scope: this
					} 
				]
			},
			{
				xtype: "fieldset",
				title: IRm$.r1("L_SVG_DRAW_OPTIONS"),
				layout: "anchor",
				hidden: true,
				name: "pb03",
				items: [
					{
						xtype: "combobox",
						fieldLabel: IRm$.r1("L_SVG_TYPE"), // "Field Column",
						name: "m_svgtype",
						queryMode: "local",
						valueField: "value",
						displayField: "name",
						editable: false,
						store: {
							xtype: "store",
							fields: [ "name", "value" ]
						}
					}
				]
			},
			{
				xtype: "fieldset",
				title: IRm$.r1("L_TIME_FIELD"), // "Time Field",
				layout: "anchor",
				items: [ 
					{
						xtype: "combobox",
						name: "s_t_f",
						fieldLabel: IRm$.r1("L_FIELD_COLUMN"), // "Field Column",
						queryMode: "local",
						valueField: "uid",
						displayField: "name",
						editable: false,
						store: {
							xtype: "store",
							fields: [ "name", "uid" ]
						}
					}, 
					{
						xtype: "textfield",
						name: "s_t_fo",
						fieldLabel: IRm$.r1("L_DATE_FORMAT") // "Date Format"
					} 
				]
			}
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	}
];
};

IG$.makeCustomChartOption = function(wizard, panel) {
	var cpanels = [];
	
	var update_scope = function(tp, items) {
		var i;
		for (i=0; i < items.length; i++)
		{
			if (items[i]._items)
			{
				update_scope(tp, items[i]._items);
			}
			
			if (items[i].handler)
			{
				items[i].scope = tp;
			}
			
			if (items[i]._listeners && items[i]._listeners.scope && items[i]._listeners.scope.length)
			{
				$.each(items[i]._listeners.scope, function(m, sc) {
					m.scope = tp;
				});
				
				$.each(items[i]._listeners, function(k, ev) {
					if (k != "scope" && ev.length)
					{
						$.each(ev, function(l, mv) {
							if (mv.scope)
							{
								mv.scope = tp;
							}
						});
					}
				});
			}
		}
	}

	var panels = IG$._customChartPanels(); 
	$.each(panels, function(i, coption) {
		var p = $s.create($s.formpanel, coption);
		p.__main__ = wizard;
		p.__mainp__ = panel;
		
		// update scope
		if (p._items)
		{
			update_scope(p, p._items);
		}
		
		panel.add(p);
		cpanels.push(p);
	});
	
	return cpanels;
}