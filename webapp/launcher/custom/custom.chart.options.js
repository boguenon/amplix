// make custom chart wizard panels

IG$.__chartoption.chartcateg.push({
	name: "Time based Stock Chart",
	value: "h-stock"
});

IG$.cSET/* chartOptionSet */= "f_palette;f_showvalues;m_zoom_level;f_gauge_type;f_gauge_refresh;m_marker;m_min;m_max;s_t_f;s_t_fo;e3d_en;e3d_al;e3d_be;e3d_de;e3d_vd;edu_val1;cdata_m_tmpl;m_xypos;m_arc_basemap";

IG$._customChartPanels = function() {
	return [
	// for fusion chart extension
	{
		layout: "anchor",
		border: 0,
		title: IRm$.r1("B_STYLE"), // "Styles",
		autoScroll: true,
		defaults: {
			anchor: "100%"
		},
		initData: function() {
			var me = this, 
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null);

			if (option) {
				me.down("[name=f_palette]").setValue(option.f_palette);
				me.down("[name=f_showvalues]").setValue(option.f_showvalues);
				me.down("[name=f_gauge_type]").setValue(option.f_gauge_type);
				me.down("[name=f_gauge_refresh]").setValue(option.f_gauge_refresh);
				me.down("[name=e3d_en]").setValue(option.e3d_en === true);
				me.down("[name=e3d_al]").setValue(option.e3d_al || 5);
				me.down("[name=e3d_be]").setValue(option.e3d_be || 7);
				me.down("[name=e3d_de]").setValue(option.e3d_de || 10);
				me.down("[name=e3d_vd]").setValue(option.e3d_vd || 5);
			}
		},
		updateOptionValues: function() {
			var me = this, 
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null);

			if (option) 
			{
				option.f_palette = me.down("[name=f_palette]").getValue();
				option.f_showvalues = me.down("[name=f_showvalues]").getValue();
				option.f_gauge_type = me.down("[name=f_gauge_type]").getValue();
				option.f_gauge_refresh = me.down("[name=f_gauge_refresh]").getValue();
				option.e3d_en = me.down("[name=e3d_en]").getValue();
				option.e3d_al = "" + me.down("[name=e3d_al]").getValue();
				option.e3d_be = "" + me.down("[name=e3d_be]").getValue();
				option.e3d_de = "" + me.down("[name=e3d_de]").getValue();
				option.e3d_vd = "" + me.down("[name=e3d_vd]").getValue();
			}
		},
		invalidateFields: function(opt) {
			var me = this, subtype = opt.subtype;

			me.down("[name=pa01]").setVisible(subtype == "gauge");
		},
		items: [ 
			{
				xtype: "fieldset",
				title: IRm$.r1("L_STYLE_FUSION"), // "Style options (Fusion Charts)",
				hidden: true,
				layout: "anchor",

				items: [ 
					{
						xtype: "combobox",
						name: "f_palette",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						fieldLabel: IRm$.r1("L_PALETTE"), // Palette",
						store: {
							xtype: "store",
							fields: [ "name", "value" ],
							data: [ 
								{
									name: "Set 1",
									value: "1"
								}, 
								{
									name: "Set 2",
									value: "2"
								}, 
								{
									name: "Set 3",
									value: "3"
								}, 
								{
									name: "Set 4",
									value: "4"
								}, 
								{
									name: "Set 5",
									value: "5"
								}, 
								{
									name: "Set 6",
									value: "6"
								} 
							]
						}
					}, 
					{
						xtype: "checkbox",
						name: "f_showvalues",
						fieldLabel: IRm$.r1("L_SHOW_VALUES"), // Show values",
						boxLabel: IRm$.r1("B_ENABLE")
					} 
				]
			}, 
			{
				xtype: "fieldset",
				title: IRm$.r1("L_3D_OPTIONS"), // "3D Options",
				layout: "anchor",
				items: [ 
					{
						xtype: "displayfield",
						value: "Apply only if 3D is available on chart type"
					}, 
					{
						xtype: "checkbox",
						name: "e3d_en",
						fieldLabel: IRm$.r1("L_ENABLE_3D"), // "Enable 3D",
						boxLabel: IRm$.r1("B_ENABLE")
					}, 
					{
						xtype: "numberfield",
						name: "e3d_al",
						minValue: 0,
						maxValue: 45,
						fieldLabel: IRm$.r1("L_ALPHA_ANGLE"), // "Alpha Angle",
						value: 10
					}, 
					{
						xtype: "numberfield",
						name: "e3d_be",
						minValue: 0,
						maxValue: 45,
						fieldLabel: IRm$.r1("L_BETA_ANGLE"), // "Beta Angle",
						value: 25
					}, 
					{
						xtype: "numberfield",
						name: "e3d_de",
						minValue: 0,
						maxValue: 100,
						fieldLabel: IRm$.r1("L_DEPTH"), // "Depth",
						value: 70
					}, 
					{
						xtype: "numberfield",
						name: "e3d_vd",
						minValue: 0,
						maxValue: 100,
						fieldLabel: IRm$.r1("L_VIEW_DIST"), // "View Distance",
						value: 25
					} 
				]
			}, 
			{
				xtype: "fieldset",
				title: IRm$.r1("L_GAUGE_OPTIONS"), // "Gauge options",
				name: "pa01",
				layout: "anchor",
				hidden: true,
				items: [ 
					{
						xtype: "combobox",
						name: "f_gauge_type",
						queryMode: "local",
						displayField: "name",
						valueField: "value",
						editable: false,
						autoSelect: true,
						fieldLabel: IRm$.r1("L_GAUGE_TYPE"), // "Gauge Type",
						store: {
							xtype: "store",
							fields: [ "name", "value" ],
							data: [ 
								{
									name: "Angular gauge",
									value: "angular"
								}, 
								{
									name: "Cylinder",
									value: "cylinder"
								}, 
								{
									name: "Linear gauge",
									value: "hlinear"
								} 
							]
						}
					}, 
					{
						xtype: "numberfield",
						name: "f_gauge_refresh",
						fieldLabel: IRm$.r1("L_REFRESH_SEC"), // "Refresh second",
						value: 2,
						minValue: 1,
						maxValue: 1000
					} 
				]
			} 
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	},
	
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
				
				me.down("[name=m_zoom_level]").setValue(option.m_zoom_level || "8");
				me.down("[name=m_marker]").setValue(option.m_marker || "");
				me.down("[name=m_min]").setValue(option.m_min || "1000");
				me.down("[name=m_max]").setValue(option.m_max || "10000");
				me.down("[name=cdata_m_tmpl]").setValue(option.cdata_m_tmpl);
				me.down("[name=m_xypos]").setValue(option.m_xypos || "");
				me.down("[name=m_map_center]").setValue(option.settings.m_map_center || "");
				
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
				option.cdata_m_tmpl = me.down("[name=cdata_m_tmpl]").getValue();
				option.m_xypos = me.down("[name=m_xypos]").getValue();
				option.settings.m_arc_basemap = me.down("[name=m_arc_basemap]").getValue();
				option.settings.m_map_center = me.down("[name=m_map_center]").getValue();
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
									},
									scope: this
								}
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
			} 
		],
		listeners: {
			afterrender: function(p) {
				p.initData.call(p);
			}
		}
	},
	
	// p3 panel
	// for map chart extension
	{
		id: "card-8",
		layout: "anchor",
		border: 0,
		title: IRm$.r1("L_STOCK_OPTIONS"), // "Stock Options",
		defaults: {
			anchor: "100%"
		},
		initData: function() {
			var me = this,
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null), 
				rows = ma.sheetoption.model.rows, 
				s_t_f = me.down("[name=s_t_f]"), 
				s_t_fo = me.down("[name=s_t_fo]"), 
				rdp = [ 
					{
						name: "Select Item",
						uid: ""
					} 
				];

			if (option) {
				for (i = 0; i < rows.length; i++) {
					rdp.push({
						name: rows[i].name,
						uid: rows[i].uid
					});
				}

				s_t_f.store.loadData(rdp);
				s_t_f.setValue(option.s_t_f || "");
				s_t_fo.setValue(option.s_t_fo);
			}
		},

		updateOptionValues: function() {
			var me = this, 
				ma = me.__main__,
				option = (ma.sheetoption && ma.sheetoption.model ? ma.sheetoption.model.chart_option : null), 
				s_t_f = me.down("[name=s_t_f]");

			if (option) {
				option.s_t_f = s_t_f.getValue();
				option.s_t_fo = me.down("[name=s_t_fo]").getValue();
			}
		},
		items: [ 
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