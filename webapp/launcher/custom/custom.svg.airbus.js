IG$.__chartoption.charttype = IG$.__chartoption.charttype || [];

IG$.__chartoption.charttype.push(
	{
		label:"Air bus", 
		charttype: "airbusseat", 
		subtype: "airbusseat", 
		img: "svg_airbus", 
		grp: "scientific"
	}
);

IG$.__chartoption.chartext.airbusseat = function(owner) {
	this.owner = owner;
};

IG$.__chartoption.chartext.airbusseat.prototype = {
	drawChart: function(owner, results) {
		var me = this,
			container = owner.container,
			svgmap;
		
		me.map = svgmap = new IG$.SVGLoader($(container));

		svgmap.container.unbind("svgloaded");

		svgmap.load("./data/Airbus_A380_seatmap.svg");

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
					measures: []
				};
			
			// start random key generation -- test purpose
			var rndkey = [];

			for (key in svgmap.mapid)
			{
				rndkey.push(key);
			}
			//-- end random key generation -- test purpose

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
									// start random key generation -- test purpose
									rnd = Math.floor(Math.random() * rndkey.length);
									celltext = rndkey[rnd];
									//-- end random key generation -- test purpose
									
									pt = chartoption.point[celltext];
									if (!pt)
									{
										pt = {
											mapid: celltext,
											data: []
										};
									}
								}
							}
							else
							{
								// data area
								celltext = cell.code || cell.text;
								measureindex = j - colfix;
								ptval = Number(celltext);

								if (isNaN(ptval) == false)
								{
									chartoption.measures[measureindex].min = (chartoption.measures[measureindex].min == null) ? ptval : Math.min(chartoption.measures[measureindex].min, ptval);
									chartoption.measures[measureindex].max = (chartoption.measures[measureindex].max == null) ? ptval : Math.max(chartoption.measures[measureindex].max, ptval);
								}

								if (pt.data.length > measureindex)
								{
									pt.data[measureindex] = ptval;
								}
								else
								{
									pt.data.push(ptval);
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

	updatedisplay: function(owner, w, h) {
		var me = this,
			map = me.map;
		map && map.resizeTo.call(map);
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