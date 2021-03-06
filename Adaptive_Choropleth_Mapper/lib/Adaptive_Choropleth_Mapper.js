
//global varible
var getNow = function() { return moment().format('HH:mm:ss.SSS '); };
var CA = null;
var app={
	adjustBound: 0.25,							 // ratio to reduce rectangle size of intial bounds	
	maxZoom: 14,
	m: 5,                                        // number of maps in a web page shown
	geokey: null,                                // global variable for GEO_JSON and GEO_VARIABLES (ex. tractid)
	geoname: null,                               // global variable for GEO_JSON (ex. County, state or '')
	firstDefinedLayers: [],                      // five layers for user defined layers
	layers: [],                                  // five layers for selected layers
	InitialMapCenter: null,                      // initial map center coordinates from configuration file [34.0522, -118.2437]
	InitialMapZoomLevel: null,                   // initial map zoom level from configuration file (ex. 10)
	StackedChart: true,                          // draw stacked area chart or not form configuration file (default: true)
	NumOfDecimalPlaces: 1,                       // the number of decimal places (default: 1)
	MapWidth: "500px",                           // map width of each map (default: 500px)
	MapHeight: "500px",                          // map height of each map (default: 500px)
	ChartWidth: "500px",                         // width of stacked area chart (default: 500px) 
	ChartHeight: "500px",                        // height of stacked area chart (default: 500px)
	globalLayer: null,                           // global variable for the selected global Layer from the user
	globalClass: null,                           // global variable for the selected global Class from the user
	globalCount: null,                           // global variable for the selected global Count from the user
	globalColor: null,                           // global variable for the selected global Color from the user
	localColor: null,                            // global variable for the selected local Color from the user
	globalJoin: null,                            // global variable for the selected global Join from the user
	titles: [],                                  // global area for the header of result message from server
	values: [],                                  // global area for the values of title index [L001, L002, ....]
	titdic: {},                                  // key: titles[n], value: values[n]
	inputType: '',                               // input type from web page (ex 'Sync button', :Set Globally button' ... )
	receivedGeoJSON: null,                       // global area for full GeoJSON data from the server
	selectedGeoJSON: null,                       // global area for selected GeoJSON data from full GeoJSON data
	selectedBounds : null,                       // global area for map bounds when selected GeoJSON data update
	fadeCount: 1000,                             // unique fade id for console.log
	faded_at: moment(new Date()),                // fade start time for console.log
	maps: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: [0,0,0,0,0,0,0,0,0,0,0]},
	map0: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: []},
	map1: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: []},
	map2: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: []},
	map3: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: []},
	map4: {map: null, bounds: null, geojson: null, info: null, legend: null, layers: null, layerscontrol:null, lastHighlightedTractid: null, classification: null, item: null, items: null, zIntervals: null, mIntervals: null, nPolygonbyClass: []},
	colorGradient1: [[],[]],
	colorGradient19: [[],[]],
};

var COLOR_CLASS = {
	//single hue               Black colors must be contained "#252525"
	"Black_5"  : ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
	"Black_6"  : ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
	"Black_7"  : ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
	"Black_8"  : ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
	"Black_9"  : ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],	
	"Red_5"    : ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
	"Red_6"    : ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
	"Red_7"    : ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
	"Red_8"    : ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
	"Red_9"    : ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
	"Green_5"  : ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
	"Green_6"  : ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
	"Green_7"  : ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
	"Green_8"  : ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
	"Green_9"  : ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],	
	"Blue_5"  : ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
	"Blue_6"  : ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
	"Blue_7"  : ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#2171b5"],
	"Blue_8"  : ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
	"Blue_9"  : ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],	
	"Purple_5"  : ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
	"Purple_6"  : ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
	"Purple_7"  : ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
	"Purple_8"  : ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
	"Purple_9"  : ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],	
	"Brown_5"  : ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
	"Brown_6"  : ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
	"Brown_7"  : ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
	"Brown_8"  : ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
	"Brown_9"  : ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
	//multi-hue
	"Yellow_to_Red_5"    : ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
	"Yellow_to_Red_6"    : ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
	"Yellow_to_Red_7"    : ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
	"Yellow_to_Red_8"    : ["#ffffcc" ,"#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c ", "#b10026"],
   	"Yellow_to_Red_9"    : ["#ffffcc" ,"#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c ", "#bd0026","#800026"],
	"Yellow_to_Green_5"  : ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
	"Yellow_to_Green_6"  : ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
	"Yellow_to_Green_7"  : ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
	"Yellow_to_Green_8"  : ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
	"Yellow_to_Green_9"  : ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
	"Yellow_to_Blue_5"   : ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
	"Yellow_to_Blue_6"   : ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
	"Yellow_to_Blue_7"   : ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
	"Yellow_to_Blue_8"   : ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    "Yellow_to_Blue_9"   : ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
	"Pink_to_purple_5"   : ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
	"Pink_to_purple_6"   : ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
	"Pink_to_purple_7"   : ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
	"Pink_to_purple_8"   : ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
	"Pink_to_purple_9"   : ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
	"Yellow_to_Brown_5"    : ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
	"Yellow_to_Brown_6"    : ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
	"Yellow_to_Brown_7"    : ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
	"Yellow_to_Brown_8"    : ["#ffffe5" ,"#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02 ", "#8c2d04"],
   	"Yellow_to_Brown_9"    : ["#ffffe5" ,"#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02 ", "#993404","#662506"],
};


	var mbAttr = '' +
			'' +
			'',
		mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';


	var FakeBaseLayers = {
	};	

	
function draw_basemap(mIDX) {
	if (mIDX in app && app[mIDX].map) {
		app[mIDX].map.remove();
	}
	app[mIDX] = $.extend(true, {}, app["maps"]);        // deep copy  ->  all clear mapN global variable
	
	var selected_mapdiv = document.getElementById(mIDX).getElementsByClassName("map")[0];

	var	grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light'});
	var	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets'});	
	
	var mapCenter = [37.09024, -95.712891];
	var mapZoomLevel = 4;
	if (app.InitialMapCenter != null) mapCenter = app.InitialMapCenter;
	if (app.InitialMapZoomLevel != null) mapZoomLevel = app.InitialMapZoomLevel;
	app[mIDX].map = L.map(selected_mapdiv, {
		center: mapCenter,
		zoom: mapZoomLevel,
		//maxZoom: app.maxZoom,
		layers: [grayscale]
	});

	var baseLayers = {
		"Grayscale": grayscale,
		"Streets": streets
	};	
}	

function set_decoration_to_auto(mapN) {
	// change labels to line-through using polygons count
	var nPolygon = $("#"+mapN+"_nPolygon").text();
	if (nPolygon) nPolygon = nPolygon.split(' ')[0];
	if (!$.isNumeric(nPolygon)) nPolygon = 0;
	if (nPolygon > 1000 && $("label[for="+mapN+"_auto]").text() == 'Create a group') {
		$("label[for='"+mapN+"_auto']").css('text-decoration', 'line-through');
	} else {
		$("label[for='"+mapN+"_auto']").css('text-decoration', 'none');
	}
}

function draw_titlemap(mIDX, layer) {

	var html_layer = ' Map'+(mIDX.replace('map','')*1+1)+' &nbsp; &nbsp;Layer: <select name="ACSdata" class="ACSdataSelect" onChange="layer_change(\'' + mIDX + '\')">';
	$.each(app.titles, function(gIdx, title) {
		if (gIdx < 1) return true;
		if (title != layer) {
			html_layer += '<option value="' + app.values[gIdx] + '" class="line_none">' + title + '</option>';
		} else {
			html_layer += '<option value="' + app.values[gIdx] + '" class="line_none" selected>' + title + '</option>';
		}
	});
	if (html_layer.length < 100) 
	html_layer += '<option value="None">No Data</option>';
	html_layer += '</select>'
	$("#"+mIDX+" .map_layer").html(html_layer);
	$(".ACSdataSelect").css({"max-width": app.MapWidth.replace('px','')*1-120+'px'});
	
	// set check box of 'map_metroInterval'  ->  changed metroInterval type from checkbox to radio button
	var fontSize = "font-size: 100%;";
	if (app.MapWidth.replace('px','') < 500) fontSize = "font-size: 90%;";
	if (app.MapWidth.replace('px','') < 450) fontSize = "font-size: 80%;";
	if (app.MapWidth.replace('px','') < 400) fontSize = "font-size: 70%;";
	var html_metroInterval = 
		'<span style="' + fontSize + ' font-style:normal;">' +
		'	 <input type="radio" name="'+mIDX+'-checkbox" value="Global" checked="checked">Global&nbsp;' +
		'	 <input type="radio" name="'+mIDX+'-checkbox" value="Local">Local' +
		'</span>';
	$("#"+mIDX+" .map_metroInterval").html(html_metroInterval);
	
	// if metro interval check box clicked
	$('input[type=radio][name="'+mIDX+'-checkbox"]').change(function() {
		var metroInterval = this.value;
		//console.log(getNow());
		//console.log(getNow(), mIDX, mIDX+"_metroInterval_changed: "+metroInterval);
		app.inputType = mIDX+"_metroInterval_changed: "+metroInterval;         // ex) map0_metroInterval_changed: Global
		globalHeadingRestore();
		
		var nowBounds = app[mIDX].map.getBounds();
		if (!boundsEqual(app.selectedBounds, nowBounds)) {
			//console.log(getNow(), mIDX, 'mapN.map.getBounds() != app.selectedBounds', nowBounds, app.selectedBounds);
			app.selectedBounds = nowBounds;
			updateSelectedGeoJSON(mIDX);
			CA = app.selectedGeoJSON;
		}
		ACSdata_render(mIDX);
	});

	// set sync radio & button
	var leaveGroup = "Leave group";
	if (app.MapWidth.replace('px','') < 400) leaveGroup = "Leave";
	//console.log("app.MapWidth:", app.MapWidth, "    leaveGroup:", leaveGroup, "    fontSize:", fontSize)
	var html_syncbtn = '';
	//html_syncbtn += '<span id="'+mIDX+'_nPolygon" style="' + fontSize + ' display: none;"></span>';
	html_syncbtn += '<span id="'+mIDX+'_nPolygon" style="' + fontSize + '"></span>';
	html_syncbtn += '<span style="' + fontSize + '">&nbsp;&nbsp;</span>';
	html_syncbtn += '<span style="' + fontSize + '">';
	html_syncbtn += '  <input id="'+mIDX+'_auto" type="radio" value="auto" name="'+mIDX+'-radio">';
	html_syncbtn += '  <label for="'+mIDX+'_auto">Create a group</label>';
	html_syncbtn += '</span>';
	html_syncbtn += '<span style="' + fontSize + '">&nbsp;&nbsp;</span>';
	html_syncbtn += '<span style="' + fontSize + '" hidden>';
	html_syncbtn += '  <input id="'+mIDX+'_manual" type="radio" value="manual" name="'+mIDX+'-radio" checked="checked">';
	html_syncbtn += '  <label for="'+mIDX+'_manual">' + leaveGroup + '</label>';
	html_syncbtn += '</span>';
	html_syncbtn += '<span style="' + fontSize + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
	html_syncbtn += '<button id="'+mIDX+'_syncbtn" type="button">Sync</button>'
	$("#"+mIDX+" .map_sync").html(html_syncbtn);

	if (app.MapWidth.replace('px','') < 600) $("#"+mIDX+"_nPolygon").hide();
	
	$('input[type=radio][name="'+mIDX+'-radio"]').on('change', function() {
	
		var sync = $(this).val();
		//console.log(getNow());
		//console.log(getNow(), mIDX, mIDX+"_sync_"+sync+" clicked");
		app.inputType = mIDX+"_sync_"+sync+" clicked";               // ex) map0_sync_auto clicked  or  map0_sync_manual clicked
		globalHeadingRestore();
		
		var msec = CA.features.length;
		if (msec < 500) msec = 500;
		// drawMode ->  1: draw normal,  2: draw when auto, manual selected,  3: draw all maps force
		if (sync == 'manual') {
			$("#"+mIDX+"_manual").parent().hide();
			$("label[for="+mIDX+"_auto]").html('Join group');        // Create a group -> Joined or Join group
			$("#"+mIDX+" .map").removeClass('borderMaps');
		}
		if (sync == 'auto') {
			$("#"+mIDX+"_manual").parent().show();
			$("label[for="+mIDX+"_auto]").text('Joined');            // Create a group or Join group -> Joined
			$("#"+mIDX+" .map").addClass('borderMaps');
		}
		// get autoLabels in the five maps, hasJoined, baseBounts
		var autoLabels = [];
		var hasJoined = false;
		var baseBounds = null;                                       // the map bounds of already joined map
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			var label = $("label[for="+mapN+"_auto]").text();
			autoLabels.push(label);
			if (label == 'Joined') {
				hasJoined = true;
				if (mIDX != mapN) {
					baseBounds = app[mapN].map.getBounds();
				}
			}
		}

		// maintain the labels:  create a group  ->  Join the map
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			//var nPolygon = $("#"+mapN+"_nPolygon").text();
			if (hasJoined) {
				if ($("label[for="+mapN+"_auto]").text() != 'Joined') {
					$("label[for="+mapN+"_auto]").text('Join group');
				}
				$("label[for='"+mapN+"_auto']").css('text-decoration', 'none');
			} else {
				set_decoration_to_auto(mapN);
			}
		}
	
		// set the check box of global join
		if (getGlobalJoinfromMaps()) {
			$('input[type=checkbox][id="globalJoin"]').prop("checked", true);
			$('label[for="globalJoin"]').css('color', 'red');
		} else {
			$('input[type=checkbox][id="globalJoin"]').prop("checked", false);
			$('label[for="globalJoin"]').css('color', 'gray');
		}
		app.globalJoin = $('input[type=checkbox][id="globalJoin"]').is(":checked");

		if (sync == 'manual') {
			fadeToWindow(mIDX);
			mapOn_movestart_off();
			mapOn_moveend_off();
			setTimeout(function() { 
				redraw_maps(mIDX, 2);
			}, 300); 	
		}
		if (sync == 'auto') {
			fadeToWindow(mIDX);
			mapOn_movestart_off();
			mapOn_moveend_off();
			setTimeout(function() { 
				redraw_maps(mIDX, 2, baseBounds);
			}, 300);
		}
	});

	
	$("#"+mIDX+"_syncbtn").on('click', function() {
		//console.log(getNow());
		//console.log(getNow(), mIDX, mIDX+"_syncbtn clicked");
		//app.inputType = mIDX+"_syncbtn clicked";                     // ex) map1_syncbtn clicked
		globalHeadingRestore();
		
		// get input value of global options
		var globalLayer = $("#global_layer select[name=globalLayer]").val();
		
		// set input value of global options to the header of five maps
		var prvLayers = getLayersfromMaps();
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			if (globalLayer != "none") {
				var layers = globalLayer;
				if (globalLayer == "each") layers = app.titdic[app.firstDefinedLayers[i]];
				$("#"+mapN+" select[name=ACSdata]").val(layers);
			}
		}
		var nowLayers = getLayersfromMaps();
		var isChangedMaps = [];
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			isChangedMaps[i] = false;
			if (nowLayers[i] != prvLayers[i]) isChangedMaps[i] = mapN;
		}
		
		// Joined or Join group -> Create a group
		var globalJoin = $('input[type=checkbox][id="globalJoin"]').is(":checked");
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			if (globalJoin == false) {           // manual
				$("#"+mapN+"_manual").prop("checked", true)
				$("#"+mapN+"_manual").parent().hide();
				$("label[for="+mapN+"_auto]").html('Create a group');
				set_decoration_to_auto(mapN);
				$("#"+mapN+" .map").removeClass('borderMaps');
			}
			if (globalJoin == true) {            // auto
				$("#"+mapN+"_auto").prop("checked", true)
				$("#"+mapN+"_manual").parent().show();
				$("label[for="+mapN+"_auto]").html('Joined');
				set_decoration_to_auto(mapN);
				$("#"+mapN+" .map").addClass('borderMaps');
			}
		}

		fadeToWindow(mIDX);
		mapOn_movestart_off();
		mapOn_moveend_off();
		setTimeout(function() { 
			redraw_maps(mIDX, 3); 
		}, 300);
	});
}


// get years from #mapN .map_year
//function getYearsfromMaps() {
//	var years = [];
//	for (i=0; i<app.m; i++) {
//		var mapN = "map" + i;
//	    var year = $("#"+mapN+" select[name=yearSelect]").val();
//		years.push(year);
//	}
//	return years;
//}

// get layers from #mapN .map_layer
function getLayersfromMaps() {
	var layers = [];
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
	    var layer = $("#"+mapN+" select[name=ACSdata]").val();
		layers.push(layer);
	}
	//console.log(layers)
	return layers;
}

// get joins from #mapN .map_sync
function getJoinsfromMaps() {
	var joins = [];
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		var join = ($('input[type=radio][name="'+mapN+'-radio"]:checked').val() == "auto") ? true : false;
		joins.push(join);
	}
	return joins;
}

// get global year from #mapN .map_year
//function getGlobalYearfromMaps() {
//	var years = Array.from(new Set(getYearsfromMaps()));             // get unique years from #mapN .map_year
//	var year = "none";
//	if (years.length == 5) year = "each";
//	if (years.length == 1) year = years[0];
//	return year;
//}

// get global layer from #mapN .map_layer
function getGlobalLayerfromMaps() {
	var layers = Array.from(new Set(getLayersfromMaps()));           // get unique layers from #mapN .map_year
	var layer = "none";
	if (layers.length == app.m) {                                    // each, if all layers is in the firstDefinedLayers
		//console.log(layers, app.firstDefinedLayers)
		$.each(layers, function(idx, value) {
			if (app.firstDefinedLayers.indexOf(app.titles[value.substring(1)*1]) == -1) return false;
			if (idx == layers.length-1) layer = "each";
			//console.log(idx, layer)
		});
	}
	if (layers.length == 1) layer = layers[0];
	return layer;
}

// get global join from #mapN .map_sync
function getGlobalJoinfromMaps() {
	var joins = Array.from(new Set(getJoinsfromMaps()));             // get unique joins from #mapN .map_sync
	var join = false;
	if (joins.length == 1) join = joins[0];
	return join;
}

// bounds compare with toFixed(2)
function boundsEqual(boundA, boundB) {
	var result = true;
	if ((Math.abs(boundA.getNorth()-boundB.getNorth()) > 0.005) ||             
		(Math.abs(boundA.getEast()-boundB.getEast()) > 0.005) ||               
		(Math.abs(boundA.getSouth()-boundB.getSouth()) > 0.005) ||             
		(Math.abs(boundA.getWest()-boundB.getWest()) > 0.005)) {               
		return false;
	}
	return result;
}

// is bounds of five maps are all same
function isAllBoundsEqual() {
	var bounds = [];
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		bounds.push(app[mapN].map.getBounds());
	}
	var j = 0;
	var isAllSameBounds = true;
	for (var i=1; i<bounds.length; i++) {
		if (!boundsEqual(bounds[i], bounds[0])) {
			isAllSameBounds = false;
			j = i;
			break;
		}
	}
	if (!isAllSameBounds) {
		//console.log('mapX bounds of all maps are not same.  from: [map' + j + ']');
		//console.log(bounds)
	}
	return isAllSameBounds;
}

// intervals compare
function intervalsEqual(intervalsA, intervalsB) {
	if (intervalsA.length != intervalsB.length) return false;
	for (var i=0; i<intervalsA.length; i++) {
		if (intervalsA[i] != intervalsB[i]) return false;
	}
	return true;
}

// is zIntervals of five maps are all same
function isAllzIntervalsEqual() {
	var j = 0;
	var isAllSameIntervals = true;
	for (i=1; i<app.m; i++) {
		var mapN = "map" + i;
		if (!intervalsEqual(app[mapN].zIntervals, app.map0.zIntervals)) {
			isAllSameIntervals = false;
			j = i;
			break;
		}
	}
	if (!isAllSameIntervals) {
		//console.log('mapX zIntervals of all maps are not same.  from: [map' + j + ']');
	}
	return isAllSameIntervals;
}


// hide or show the 'Set Globally' button
function updateGloballyButton() {
	if (isAllBoundsEqual()) {
		$("#global_submit").show();
	} else {
		$("#global_submit").hide();
	}
}


// draw global selection menu
function draw_globalSelection() {
	
	// set drop-down list of 'global_layer' 
	var html_layer = 'Layer: <select name="globalLayer" class="ACSdataSelect" style="color:red;">';
	html_layer += '<option value="none" class="line_none">No Select</option>';
	html_layer += '<option value="each" class="line_none">Default </option>';
	var theLayer = "";
	$.each(app.titles, function(gIdx, title) {
		if (gIdx < 1) return true;
		if (title != theLayer) {
			html_layer += '<option value="' + app.values[gIdx] + '" class="line_none">' + title + '</option>';
		} else {
			html_layer += '<option value="' + app.values[gIdx] + '" class="line_none" selected>' + title + '</option>';
		}
	});
	if (html_layer.length < 100) 
	html_layer += '<option value="None">No Data</option>';
	html_layer += '</select>' 
	$("#global_layer").html(html_layer);
	$("#global_layer select[name=globalLayer]").val(getGlobalLayerfromMaps());
	if ($("#global_layer select[name=globalLayer]").val() == "none") {
		$("#global_layer select[name=globalLayer]").css('color', 'gray');
	} else {
		$("#global_layer select[name=globalLayer]").css('color', 'red');
	}
	app.globalLayer = $("#global_layer select[name=globalLayer]").val();
	
	if (app.m == 1) {
		$("#global_layer").hide();
	}

	// set drop-down list of 'global_class' 
	var html_layer = 'Classification: <select name="globalClass" style="color:red;">' +
					'<option value="equal" class="line_none">Equal</option>' +
					'<option value="quantile" class="line_none" selected>Quantile</option>' +
					'<option value="ckmeans" class="line_none">Natural Breaks</option>' +
					'<option value="arithmetic" class="line_none">Arithmetic Progression</option>' +
					'<option value="geometric" class="line_none">Geometric Progression</option>' +
					'<option value="std" class="line_none">Std Deviation</option>' +
					'</select>';
	$("#global_class").html(html_layer);
	app.globalClass = $("#global_class select[name=globalClass]").val();
	
	// set drop-down list of 'global_count' 
	var html_count = '<select name="globalCount" style="color:red;">' +
					'<option value="5" class="line_none">5</option>' +
					'<option value="6" class="line_none">6</option>' + 
					'<option value="7" class="line_none">7</option>' +
					'<option value="8" class="line_none" selected>8</option>' +
					'<option value="9" class="line_none">9</option>' +
					'</select>';
	$("#global_count").html(html_count);
	app.globalCount = $("#global_count select[name=globalCount]").val();
	
	// set drop-down list of 'global_color'
	var html_color = '' +
		'<label for="globalColor">Global: </label>' +
		'<select name="globalColor" id="globalColor" style="color:red;">' +
		'	<optgroup label="Single-hue" style="color:black;">' +
		'		<option value="Black" class="line_none">Black</option>' +
		'		<option value="Red" class="line_none">Red</option>' +
		'		<option value="Green" class="line_none">Green</option>' +
		'		<option value="Blue" class="line_none">Blue</option>' +
		'		<option value="Purple" class="line_none">Purple</option>' +
		'		<option value="Brown" class="line_none">Brown</option>' +
		'	</optgroup>' +
		'	<optgroup label="Multi-hue" style="color:black;">' +
		'		<option value="Yellow_to_Red" class="line_none">Yellow_to_Red</option>' +
		'		<option value="Yellow_to_Green" class="line_none">Yellow_to_Green</option>' +
		'		<option value="Yellow_to_Blue" class="line_none">Yellow_to_Blue</option>' +
		'		<option value="Yellow_to_Brown" class="line_none">Yellow_to_Brown</option>' +
		'	</optgroup>' +
		'</select>';
	$("#global_color").html(html_color);
	$("#globalColor").on("change", function(){
		var label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
		var value = $(this).val();
		//console.log(label + "/" + value);
		html = '<img src="images/' + label + "/" + value + '_s.PNG" height="10px" width="195px">';
		$("#global_img").html(html);
	});
	$("#globalColor").val("Yellow_to_Blue").trigger('change');
	app.globalColor = $("#globalColor").val();
	
	// set drop-down list of 'local_color' 
	var html_color = '' +
		'<label for="localColor">Local: </label>' +
		'<select name="localColor" id="localColor" style="color:red;">' +
		'	<optgroup label="Single-hue" style="color:black;">' +
		'		<option value="Black" class="line_none">Black</option>' +
		'		<option value="Red" class="line_none">Red</option>' +
		'		<option value="Green" class="line_none">Green</option>' +
		'		<option value="Blue" class="line_none">Blue</option>' +
		'		<option value="Purple" class="line_none">Purple</option>' +
		'		<option value="Brown" class="line_none">Brown</option>' +
		'	</optgroup>' +
		'	<optgroup label="Multi-hue" style="color:black;">' +
		'		<option value="Yellow_to_Red" class="line_none">Yellow_to_Red</option>' +
		'		<option value="Yellow_to_Green" class="line_none">Yellow_to_Green</option>' +
		'		<option value="Yellow_to_Blue" class="line_none">Yellow_to_Blue</option>' +
		'		<option value="Yellow_to_Brown" class="line_none">Yellow_to_Brown</option>' +
		'	</optgroup>' +
		'</select>';
	$("#local_color").html(html_color);
	$("#localColor").on("change", function(){
		var label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
		var value = $(this).val();
		//console.log(label + "/" + value);
		html = '<img src="images/' + label + "/" + value + '_s.PNG" height="10px" width="195px">';
		$("#local_img").html(html);
	});
	$("#localColor").val("Yellow_to_Red").trigger('change');
	app.localColor = $("#localColor").val();

	// set check box of 'global_join' 
	var html_join = '<span style="font-size: 80%;">' +
					'	 <input id="globalJoin" type="checkbox" name="join_checkbox" value="groupingAuto">' +
					'    <label for="globalJoin" style="color:gray;">Grouping All</label>' + 
					'</span>';
	$("#global_join").html(html_join);
	app.globalJoin = $('input[type=checkbox][id="globalJoin"]').is(":checked");

	$("#global-selection").show();
	$("#global-message").show();
	
	$("#global_layer select[name=globalLayer]").change(function(){
		var globalLayer = $(this).val();                             // save layer to global variable, if changed
		if ($("#global_layer select[name=globalLayer]").val() == "none") {
			$("#global_layer select[name=globalLayer]").css('color', 'gray');
		} else {
			$("#global_layer select[name=globalLayer]").css('color', 'red');
		}
	});

	$('input[type=checkbox][id="globalJoin"]').change(function(){
		var globalJoin = $(this).is(":checked");
		if (globalJoin == false) {
			$('label[for="globalJoin"]').css('color', 'gray');
		} else {
			$('label[for="globalJoin"]').css('color', 'red');
		}
	});
	
	$("#global_submit").unbind('click').on('click', function(){
		//console.log(getNow());
		//console.log(getNow(), "    ", "_Set_Globally_button clicked");
		app.inputType = "_Set_Globally_button clicked.";             // ex) _Set_Globally_button clicked
		
		app.globalLayer = $("#global_layer select[name=globalLayer]").val();
		app.globalClass = $("#global_class select[name=globalClass]").val();
		app.globalCount = $("#global_count select[name=globalCount]").val();
		app.globalColor = $("#globalColor").val();
		app.localColor  = $("#localColor").val();
		app.globalJoin  = $('input[type=checkbox][id="globalJoin"]').is(":checked");
		
		// check input value of global options
		var globalLayer = $("#global_layer select[name=globalLayer]").val();
		
		// set input value of global options to the header of five maps
		var prvLayers = getLayersfromMaps();
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			var theLayer = globalLayer;
			if (globalLayer != "none") {
				if (globalLayer == "each") theLayer = app.titdic[app.firstDefinedLayers[i]];
				$("#"+mapN+" select[name=ACSdata]").val(theLayer);
			}
		}

		var nowLayers = getLayersfromMaps();
		var isChangedMaps = [];
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			isChangedMaps[i] = false;
			if (nowLayers[i] != prvLayers[i]) isChangedMaps[i] = mapN;
		}
		
		// Joined or Join group -> Create a group
		var globalJoin = $('input[type=checkbox][id="globalJoin"]').is(":checked");
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;	
			if (globalJoin == false) {           // manual
				$("#"+mapN+"_manual").prop("checked", true)
				$("#"+mapN+"_manual").parent().hide();
				$("label[for="+mapN+"_auto]").html('Create a group');
				set_decoration_to_auto(mapN);
				$("#"+mapN+" .map").removeClass('borderMaps');
			}
			if (globalJoin == true) {            // auto
				$("#"+mapN+"_auto").prop("checked", true)
				$("#"+mapN+"_manual").parent().show();
				$("label[for="+mapN+"_auto]").html('Joined');
				set_decoration_to_auto(mapN);
				$("#"+mapN+" .map").addClass('borderMaps');
			}
		}
		
		var msec = CA.features.length;
		if (msec < 500) msec = 500;
		//if (msec > 3000)
		swal({
			title: "Please wait...",
			text: "Maps will be ready in "+(msec/1000).toFixed(1)+" seconds.",
			timer: msec,
			//timer: 10000,
			icon: "info",
			buttons: false,
		}).then((value) => {
			//console.log("Redraw all maps by global_submit ended in "+(msec/1000).toFixed(1)+" seconds.");
			setTimeout(function() {
				triggerStackedAreaChart();
			}, 500);
		});
		
		setTimeout(function() {
			mapOn_movestart_off();
			mapOn_moveend_off(); 
			setTimeout(function() { 
				for (var i=0; i<app.m; i++) {
					var mapN = "map" + i;
					drawAmap(mapN, 3);
				}
				setTimeout(function() {
					mapOn_movestart_set();
					mapOn_moveend_set(); 
				}, 500); 
			}, 100); 
		}, 100); 
	});
}


// global heading will restore when did not click "Set Globally" button after selection
function globalHeadingRestore() {
	var message = '';
	
	var eCount = 0;
	if (app.globalLayer != $("#global_layer select[name=globalLayer]").val()) {
		eCount += 1;
		message += 'Layer, ';
		$("#global_layer select[name=globalLayer]").val(app.globalLayer);
		if ($("#global_layer select[name=globalLayer]").val() == "none") {
			$("#global_layer select[name=globalLayer]").css('color', 'gray');
		} else {
			$("#global_layer select[name=globalLayer]").css('color', 'red');
		}
	}
	if (app.globalClass != $("#global_class select[name=globalClass]").val()) {
		eCount += 1;
		message += 'Classification, ';
		$("#global_class select[name=globalClass]").val(app.globalClass);
	}
	if (app.globalCount != $("#global_count select[name=globalCount]").val()) {
		eCount += 1;
		message += 'Classification, ';
		$("#global_count select[name=globalCount]").val(app.globalCount);
	}
	if (app.globalColor != $("#globalColor").val()) {
		eCount += 1;
		message += 'Global Color, ';
		$("#globalColor").val(app.globalColor).trigger('change');
	}
	if (app.localColor != $("#localColor").val()) {
		eCount += 1;
		message += 'Local Color, ';
		$("#localColor").val(app.localColor).trigger('change');
	}
	if (app.globalJoin != $('input[type=checkbox][id="globalJoin"]').is(":checked")) {
		eCount += 1;
		message += 'Grouping-All, ';
		$('input[type=checkbox][id="globalJoin"]').prop('checked', app.globalJoin);
		if ($('input[type=checkbox][id="globalJoin"]').is(":checked") == false) {
			$('label[for="globalJoin"]').css('color', 'gray');
		} else {
			$('label[for="globalJoin"]').css('color', 'red');
		}
	}
	var be = (eCount > 1) ? 'are' : 'is'
	
	if (eCount > 0) {
		message = 'Your selection in ' + message.substring(0, message.length-2) + ' ';
		message += be + ' not valid because you have not clicked "Set Globally" button.\n\n';
		message += 'To enable "Set Globally" button, ';
		message += 'make all maps have the same extents by clicking one of "Sync" buttons on the top of each map.';
		swal({
			title: "Attention!",
			text: message,
			icon: "warning",
			button: "CONTINUE",
		});
	}
}


function layer_change(mIDX) {
	// set global_layer
	$("#global_layer select[name=globalLayer]").val(getGlobalLayerfromMaps());
	if ($("#global_layer select[name=globalLayer]").val() == "none") {
		$("#global_layer select[name=globalLayer]").css('color', 'gray');
	} else {
		$("#global_layer select[name=globalLayer]").css('color', 'red');
	}
	app.globalLayer = $("#global_layer select[name=globalLayer]").val()
	headerChange(mIDX);
}

function headerChange(mIDX) {
	//console.log(getNow());
	//console.log(getNow(), mIDX, mIDX+"_global_header changed");
	app.inputType = mIDX+"_global_header changed";                   // ex) map0__global_header changed
	globalHeadingRestore();
	
	fadeToWindow(mIDX);
	mapOn_movestart_off();
	mapOn_moveend_off();
	setTimeout(function() { 
		redraw_maps(mIDX, 2); 
	}, 300);
};


// clear info, legend, layers in the map
function clear_map(mIDX) {
	if (app[mIDX].info) {
		app[mIDX].info.remove();
		app[mIDX].info = null;
	}
	if (app[mIDX].legend) {
		app[mIDX].legend.remove();
		app[mIDX].legend = null;
	}
	if (app[mIDX].layerscontrol) {
		app[mIDX].layerscontrol.remove();
		app[mIDX].layerscontrol = null;
	}
	if (app[mIDX].map.hasLayer(app[mIDX].geojson)) {
		app[mIDX].map.removeLayer(app[mIDX].geojson);
		app[mIDX].geojson = null;
	}
}


// items = [nhwht10] or [nhwht10, nhwht70, .....]
function geostats_classification(classification, nClass, geojson, items) {   

	var values = [];
	var j=0;
	for (var l=0; l<items.length; l++) {
		item = items[l];
		for (var i=0; i<geojson.features.length; i++) {
			if (!(item in geojson.features[i].properties)) continue;
			if (geojson.features[i].properties[item] == -9999) continue;
			values[j++] = geojson.features[i].properties[item];
		}
	}
	if (values.length == 0) {
		return null;
	}
	var maxInterval = nClass * 1;
	if (maxInterval > values.length) {
		maxInterval = values.length;
		if (classification == "quantile") maxInterval = values.length - 1;
	}
	
	values.sort(function(a,b){return a-b});
	var intervals = [];
	
	if (classification != 'ckmeans') {                               // using geostats.js
		var serie = new geostats();
		serie.setSerie(values);
		var ranges = [];                                             // ranges.length = maxInterval + 1
		if (classification == 'equal')      ranges = serie.getClassEqInterval(maxInterval);
		if (classification == 'quantile')   ranges = serie.getClassQuantile(maxInterval);
		if (classification == 'std')        ranges = serie.getClassStdDeviation(maxInterval);
		if (classification == 'arithmetic') ranges = serie.getClassArithmeticProgression(maxInterval);
		if (classification == 'geometric')  ranges = serie.getClassGeometricProgression(maxInterval);
		if (classification != 'quantile') {
			intervals = ranges.slice(0, -1);
		} else {
			intervals = [ranges[0]];
			var r = 1;
			for (var v=0; v<values.length; v++) {
				if (values[v] == ranges[r]) {
					var n = v + 1;
					if (n >= values.length) n = v;
					intervals.push(values[n]);
					if (intervals.length >= maxInterval) break;
					if (++r >= ranges.length) break;
				}
			}	
		}
	}
	
	if (classification == 'ckmeans') {                               // using simple-statistics
		var clusteredValues = ss.ckmeans(values, maxInterval);
		for (var key in clusteredValues) {
			clusteredValue = clusteredValues[key];
			intervals.push(clusteredValue[0]);
		}
	}

	if (intervals.length > nClass) intervals = intervals.slice(0, nClass);

	return intervals;
}


function drawAmap(mIDX, drawMode) { 
	// drawMode ->  1: draw normal,  2: draw when auto, manual selected,  3: draw all maps force
	if (!drawMode) drawMode = 1;

	var map = app[mIDX].map;

	var selectedLayer  = $("#"+mIDX+" select[name=ACSdata]").val();
	var classification = $("#global_class select[name=globalClass]").val();
	var nClass = $("#global_count select[name=globalCount]").val();
	var selectedLayerIndex  = $("#"+mIDX+" select[name=ACSdata]").prop('selectedIndex');
	
	// set color scheme to global area
	//var colorScheme = colorSeries + nClass;
	//if (!(colorScheme in COLOR_CLASS)) colorScheme = 'Orange8';       // default is the Orange8
	//app.colorGradient1 = COLOR_CLASS[colorScheme];
	//app.colorGradient19 = app.colorGradient1.slice().concat(['#5E5E5E']);

	var item = selectedLayer;
	//console.log(getNow(), mIDX, selectedLayer,
	//	' ['+selectedLayerIndex+':', '"'+item+'"] ', classification, ' draw a map started');
	
	// change labels to line-through using polygons count
	var count = CA.features.length;	
	$("#"+mIDX+"_nPolygon").text(count + ' Polygons');               // Polygons
	set_decoration_to_auto(mIDX);

	var items = [];
	var globalJoin = $('input[type=checkbox][id="globalJoin"]').is(":checked");
	var this_sync = $('input[type=radio][name="'+mIDX+'-radio"]:checked').val();
	//console.log('drawMode: ', drawMode, 'globalJoin: ', globalJoin, 'app.inputType: ', app.inputType);
	for (var i=0; i<app.m; i++) {
		var div_id = "map" + i;
		var that_sync = $('input[type=radio][name="'+div_id+'-radio"]:checked').val();
		if (drawMode != 3) {
			if (div_id != mIDX && (this_sync == 'auto' && that_sync == 'manual')) continue;
			if (div_id != mIDX && (this_sync == 'manual')) continue;
		}
		if (drawMode == 3) {
			if (app.inputType.indexOf("_syncbtn clicked") < 0)       // ex) "map1_syncbtn clicked"
			if (div_id != mIDX && globalJoin == false) continue;
		}
		var sLayer = $("#"+div_id+" select[name=ACSdata]").val();
		items.push(sLayer);
	}
	//console.log(getNow(), mIDX, 'items for interval:', items);
	
	// re-calculate zoomed intervals and save it to app.mapN.zIntervals
	//console.log(getNow(), mIDX, classification+' zIntervals started', nClass, CA, items);
	app[mIDX].zIntervals = geostats_classification(classification, nClass, CA, items);
	//console.log(getNow(), mIDX, classification+' zIntervals:', app[mIDX].zIntervals);
	if (!app[mIDX].zIntervals) {
		$("#"+mIDX+"_nPolygon").text("No Data");
		clear_map(mIDX);
		return;
	}

	// re-calculate metro intervals and save it to app.mapN.mIntervals ==> global
	app[mIDX].classification = classification;
	app[mIDX].item = item;
	app[mIDX].items = items.toString();
	//console.log(getNow(), mIDX, classification+' mIntervals started', item, items.toString());
	app[mIDX].mIntervals = geostats_classification(classification, nClass, app.receivedGeoJSON, items);
	//console.log(getNow(), mIDX, classification+' mIntervals:', app[mIDX].mIntervals);

	ACSdata_render(mIDX);
}


function ACSdata_render(mIDX) {

		var map = app[mIDX].map;
		var item = app[mIDX].item;
		
		//var metroInterval = $('input[type=checkbox][name="'+mIDX+'-checkbox"]').is(":checked");
		var GorL = $('input[type=radio][name="'+mIDX+'-checkbox"]:checked').val();
		//console.log("GorL: ", GorL);
		var zIntervals = app[mIDX].zIntervals;
		var mIntervals = app[mIDX].mIntervals;
		
		var nClass = $("#global_count select[name=globalCount]").val();
		var globalColorSeries = $("#globalColor").val();
		var localColorSeries  = $("#localColor").val();
		var colorScheme;
		var zm;
		if (GorL == "Global") zm = 0;                                          // global interval
		if (GorL == "Local")  zm = 1;                                          // local interval
		
		colorScheme = globalColorSeries + '_' + nClass;
		if (!(colorScheme in COLOR_CLASS)) colorScheme = 'Yellow_to_Red_8';    // default color of global
		//console.log("global colorScheme: "+colorScheme);
		app.colorGradient1[0] = COLOR_CLASS[colorScheme];
		app.colorGradient19[0] = app.colorGradient1[0].slice();
		if (app.colorGradient19[0].indexOf("#252525") == -1) app.colorGradient19[0].push(['#5E5E5E']);
		else                                                 app.colorGradient19[0].push(['#FFB3B3']);
		
		colorScheme = localColorSeries + '_' + nClass;
		if (!(colorScheme in COLOR_CLASS)) colorScheme = 'Yellow_to_Blue_8';            // default color of local
		//console.log("local colorScheme: "+colorScheme);
		app.colorGradient1[1] = COLOR_CLASS[colorScheme];
		app.colorGradient19[1] = app.colorGradient1[1].slice();
		if (app.colorGradient19[1].indexOf("#252525") == -1) app.colorGradient19[1].push(['#5E5E5E']);
		else                                                 app.colorGradient19[1].push(['#FFB3B3']);
		
		// control that shows state info on hover
		if (app[mIDX].info != null) app[mIDX].info.remove();
		app[mIDX].info = L.control();
		app[mIDX].info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info infolegend');
			this.update();
			return this._div;
		};
		app[mIDX].info.update = function (props) {
			var v = (props && item in props && props[item] != -9999) ? props[item] : "No Data";
			var c = '';
			var nm = getClass1(v * 1.0, "m");
			var nz = getClass1(v * 1.0, "z");
			var fm = (nm > 4) ? 'white' : 'black';
			var fz = (nz > 4) ? 'white' : 'black';
			var cm = '<i style="color:'+fm+'; background:' + getColor1(v * 1.0, "m") + '">' + nm + '</i>';
			var cz = '<i style="color:'+fz+'; background:' + getColor1(v * 1.0, "z") + '">' + nz + '</i>';
			if (GorL == "Global") c = '<span> )</span>' + cz + '<span> &nbsp; (L: </span>' + cm + '<span> G: </span>';
			if (GorL == "Local")  c = '<span> )</span>' + cm + '<span> &nbsp; (G: </span>' + cz + '<span> L: </span>';
			this._div.innerHTML = '<h4></h4>' +  (props ?
				'<b> ' + ((typeof v === 'number') ? v.toFixed(app.NumOfDecimalPlaces) : v) + '</b> &nbsp; ' + c + '<br/>'
				+ ((app.geoname != "") ? app.geoname+' : '+props[app.geoname] : app.geokey+' : '+props[app.geokey])
				: 'Hover over an area');
		};
		app[mIDX].info.addTo(map);

		// get getOpacity
		function getOpacity1(feature) {
			return 0.7;
		}
		
		// get color depending on selected layer's value
		function getColor1(d, interval) {
			var intervals = (GorL == "Global") ? mIntervals : zIntervals;
			var m = zm;
			if (interval == 'm') {intervals = mIntervals; m = 0;}
			if (interval == 'z') {intervals = zIntervals; m = 1;}
			if (!$.isNumeric(d) || d == "-9999") {                   // NO DATA
				if (app.colorGradient1[m].indexOf("#252525") == -1) return "#5E5E5E";
				else return "#FFB3B3";
			}
			for (var i=app.colorGradient1[m].length-1; i>=0; i--) {
				if (d >= intervals[i]) {
					return app.colorGradient1[m][i];
				}
			}
		}
		function getClass1(d, interval) {
			if (!$.isNumeric(d) || d == "-9999") return "";
			var intervals = (GorL == "Global") ? mIntervals : zIntervals;
			if (interval == 'm') intervals = mIntervals;
			if (interval == 'z') intervals = zIntervals;
			for (var i=app.colorGradient1[zm].length-1; i>=0; i--) {
				if (d >= intervals[i]) {
					return i+1;
				}
			}
		}
		
		function style1(feature) {
			return {
				weight: 0.5,
				opacity: 1,
				color: 'white',
				dashArray: '1',
				fillOpacity: getOpacity1(feature),
				fillColor: getColor1(feature.properties[item])
			};
		}

		function highlightFeature(e) {
			var layer = e.target;
			var layerid = layer._leaflet_id;
			var tractid = layer.feature.properties[app.geokey];
			app[mIDX].lastHighlightedTractid = tractid;
			layer.setStyle({
				weight: 3,
				color: '#00ffff',
				dashArray: '',
				fillOpacity: 0.9
			});
			for (i=0; i<app.m; i++) {
				var mapN = "map" + i;
				if (mIDX == mapN) continue;
				if (!app[mapN].geojson) continue;
				var layerN = app[mapN].geojson._layers[app[mapN].layers[tractid]];
				if (!layerN) continue;
				layerN.setStyle({
					weight: 3,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.9
				});
			}
			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				for (i=0; i<app.m; i++) {
					var mapN = "map" + i;
					if (!app[mapN].geojson) continue;
					var layerN = app[mapN].geojson._layers[app[mapN].layers[tractid]];
					if (!layerN) continue;
					layerN.bringToFront();
				}
			}

			for (i=0; i<app.m; i++) {
				var mapN = "map" + i;
				if (app[mapN].info) app[mapN].info.update(layer.feature.properties);
			}
		}
		
		function resetHighlight(e) {
			var layer = e.target;
			var tractid = layer.feature.properties[app.geokey];
			for (i=0; i<app.m; i++) {
				var mapN = "map" + i;
				if (!app[mapN].geojson) continue;
				var layerN = app[mapN].geojson._layers[app[mapN].layers[tractid]];
				if (!layerN) continue;
				app[mapN].geojson.resetStyle(layerN);
			}
			for (i=0; i<app.m; i++) {
				var mapN = "map" + i;
				if (app[mapN].info) app[mapN].info.update();
			}
		}
		
		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				//click: zoomToFeature
				//click: highlightFeature
			});
		}
		
		// layer that shows data
		if (map.hasLayer(app[mIDX].geojson)){
			map.removeLayer(app[mIDX].geojson);	
			
		}
		
		app["maps"].gPolygonbyClass = [];
		for (var i=0; i<app.colorGradient1[0].length+2; i++) app["maps"].gPolygonbyClass.push(0);
		//console.log('app["maps"].gPolygonbyClass', app["maps"].gPolygonbyClass.length, app["maps"].gPolygonbyClass);
		app[mIDX].gPolygonbyClass = app["maps"].gPolygonbyClass.slice();                 // clear gPolygonbyClass
		//console.log('app['+mIDX+'].gPolygonbyClass', app[mIDX].gPolygonbyClass.length, app[mIDX].gPolygonbyClass);
		$.each(app.receivedGeoJSON.features, function(idx, feature) {
			var v = (item in feature.properties && feature.properties[item] != -9999) ? feature.properties[item] : "No Data";
			var c = getClass1(v * 1.0, "m");
			if (c == "") c = app.colorGradient1[0].length + 1;        // may be 9
			app[mIDX].gPolygonbyClass[0] += 1;
			app[mIDX].gPolygonbyClass[c] += 1;
		});
		//console.log('app['+mIDX+'].gPolygonbyClass', app[mIDX].gPolygonbyClass.length, app[mIDX].gPolygonbyClass);
		
		app["maps"].nPolygonbyClass = [];
		for (var i=0; i<app.colorGradient1[1].length+2; i++) app["maps"].nPolygonbyClass.push(0);
		//console.log('app["maps"].nPolygonbyClass', app["maps"].nPolygonbyClass.length, app["maps"].nPolygonbyClass);
		app[mIDX].nPolygonbyClass = app["maps"].nPolygonbyClass.slice();                 // clear nPolygonbyClass
		//console.log('app['+mIDX+'].nPolygonbyClass', app[mIDX].nPolygonbyClass.length, app[mIDX].nPolygonbyClass);
		$.each(CA.features, function(idx, feature) {
			var v = (item in feature.properties && feature.properties[item] != -9999) ? feature.properties[item] : "No Data";
			var c = getClass1(v * 1.0, "z");
			if (c == "") c = app.colorGradient1[0].length + 1;        // may be 9
			app[mIDX].nPolygonbyClass[0] += 1;
			app[mIDX].nPolygonbyClass[c] += 1;
		});
		//console.log('app['+mIDX+'].nPolygonbyClass', app[mIDX].nPolygonbyClass.length, app[mIDX].nPolygonbyClass);
		
		app[mIDX].geojson = L.geoJson(CA, {
			style: style1,
			onEachFeature: onEachFeature
		}).addTo(map);
	

		var overlays = {
			"layer": app[mIDX].geojson,
		};
		

		// Create layercontrol. Before create, remove layercontrol if it exists
		if (app[mIDX].layerscontrol ) {
			app[mIDX].layerscontrol.remove();			
		}	
	    app[mIDX].layerscontrol = L.control.layers(FakeBaseLayers, overlays, {
			position: 'bottomleft',                                  // 'topleft', 'bottomleft', 'bottomright'
			collapsed: false,                                        // true
			//autoZIndex: false
		}).addTo(app[mIDX].map);
		
		app[mIDX].layers = {};
		app[mIDX].geojson.eachLayer(function(layer) {
			var layerid = layer._leaflet_id;
			var tractid = layer.feature.properties[app.geokey];
			app[mIDX].layers[tractid] = layerid;
		})

		// control that shows legend
		if (app[mIDX].legend != null) app[mIDX].legend.remove();
		app[mIDX].legend = L.control({position: 'bottomright'});
		
		app[mIDX].legend.onAdd = function (map) {
			var div = L.DomUtil.create('div', 'info legend');
			var intervals = (GorL == "Global") ? mIntervals : zIntervals;
			var labels = (GorL == "Global") ? 
							['<center><strong>Global</strong><font size="2"></br>(lower bounds)</font></center>'] :
							['<center><strong>Local</strong><font size="2"></br>(lower bounds)</font></center>'];
			for (var i = 0; i < app.colorGradient1[zm].length; i++) {
				var classValue = (i < intervals.length) ? intervals[i].toFixed(2) : "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;";
				labels.push('<i style="background:' + app.colorGradient1[zm][i] + '"></i> ' + classValue);
			}
			labels.push(    // last legend is always 'No Data'
					'<i style="background:' + getColor1(-9999) + '"></i> ' +
					'No Data'+ '<br> ');				
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		app[mIDX].legend.addTo(map);
}


// starts here !!
$( document ).ready(function() {
	// Set up the AJAX indicator
    $('body').append('<div id="ajaxBusy"><p id="ajaxBusyMsg">Please wait...</p></div>');
	
	//console.log(getNow());
	//console.log(getNow(), "    ", "_function_ready started");
	app.inputType = "_function_ready started";                       // ex) _function_ready started

	
	//console.log(GEO_JSON.features.length, GEO_JSON);
	//console.log(GEO_VARIABLES);
	
	// build app.receivedGeoJSON from GEO_JSON and GEO_VARIABLES
	app.titles = GEO_VARIABLES[0];
	app.geokey = app.titles[0];
	app.values = [];
	app.titdic = {};
	for (var i=0; i<app.titles.length; i++) {
		var value = 'L'+zeroPad(i, 3);
		app.values.push(value);
		if (i != 0) app.titdic[app.titles[i]] = value;
	}
	//console.log(app.titles, app.values, app.titdic)
	var geokey = app.geokey;
	
	if (!('features' in GEO_JSON) || GEO_JSON.features.length < 1) {
		swal({
			title: "Alert!",
			text: "The 'GEO_JSON' you provided has no 'features'.",
			icon: "error",
			button: "ABORT",
		});
		return;
	}
	
	//var firstProperty = GEO_JSON.features[0].properties;
	var firstProperty = $.extend(true, {}, GEO_JSON.features[0].properties);             // deep copy of the object
	if (!(geokey in firstProperty)) {
		swal({
			title: "Alert!",
			text: "The key in your geojosn should match the key in your attributes.",
			icon: "error",
			button: "ABORT",
		});
		return;
	}
	
	delete firstProperty[geokey];
	//console.log(firstProperty);
	app.geoname = (Object.keys(firstProperty).length > 0) ? Object.keys(firstProperty)[0] : "";
	var geoname = app.geoname;
	//console.log(geoname);
	
	
	var geoFeatures = {}                                             // key: geokey,  value: geometry
	var nError = 0;
	$.each(GEO_JSON.features, function(rIdx, row) {
		//console.log(row);
		var tractid = ('properties' in row && geokey in row.properties) ? row.properties[geokey] : "";
		var geometry = ('geometry' in row) ? row.geometry : {};
		if (tractid == "") {
			//console.log("The key '"+geokey+"' is not found in the GEO_JSON["+rIdx+"]", row);
			nError += 1;
			return true;
		}
		if ($.isEmptyObject(geometry)) {
			//console.log("The 'geometry' is not found in the GEO_JSON["+rIdx+"]", row);
			nError += 1;
			return true;
		}
		geoFeatures[tractid] = {'geometry': geometry, 'properties': row.properties};
	});
	//console.log(nError, Object.keys(geoFeatures).length, geoFeatures);
	
	if (Object.keys(geoFeatures).length == 0) {
		swal({
			title: "Alert!",
			text: "The 'GEO_JSON' you provided is not valid.\nPlease check it.",
			icon: "error",
			button: "ABORT",
		});
		return;
	}
	if (nError != 0) {
		swal({
			title: "Attention!",
			text: "The 'GEO_JSON' you provided has "+nError+" errors.\nProceed anyway?",
			icon: "warning",
			button: "CONTINUE",
		});
	}
	
	nError = 0;
	app.receivedGeoJSON = {"type":"FeatureCollection", "features":[]}
	$.each(GEO_VARIABLES, function(rIdx, row) {
		if (rIdx == 0) return true;                                  // skip title's row
		var geokey = row[0];
		if (!(geokey in geoFeatures)) {
			//console.log("The key '"+geokey+"' is not found in the GEO_JSON.");
			nError += 1;
			return true;
		}
		var geoFeature = geoFeatures[geokey];
		var feature = {"type": "Feature", "geometry": geoFeature["geometry"], "properties": geoFeature["properties"]};
		$.each(row, function(cIdx, col) {
			if (cIdx < 1) return true;                               // skip key's row (first column is the geokey)
			feature.properties[app.values[cIdx]] = row[cIdx] * 1.0;
		});
		app.receivedGeoJSON["features"].push(feature);
	});
	
	CA = app.receivedGeoJSON;	
	//console.log(CA);
	
	// set number of maps to app.m
	app.m = 5;                                                       // default 5 maps
	if (typeof NumOfMaps !== 'undefined' && typeof NumOfMaps === 'number') {
		if (NumOfMaps >= 1 && NumOfMaps <= 15) app.m = NumOfMaps;
	}
	if (app.titles.length <= app.m) app.m = app.titles.length - 1;
	
	// set <div id="mapN" ..> to mapContainer
	var html_maps = '';
	for (var i=0; i<app.m; i++) {
		html_maps += '<div id="map'+i+'" class="mapArea"></div><div class="MapBetween"></div>';
	}
	html_maps += '<div id="map'+app.m+'" class="mapAreaLast"></div>';                    // for the stacked area chart
	$("#mapContainer").html(html_maps);
	
	// set default layers for each map
	var selectedlayers = [];
	if (typeof InitialLayers !== 'undefined' && InitialLayers instanceof Array) {
		for (var i=0; i<InitialLayers.length; i++) {
			if (typeof InitialLayers[i] === 'string' && app.titdic[InitialLayers[i]] in CA.features[0].properties) 
				selectedlayers.push(InitialLayers[i]);
		}
	}
	app.layers = [];
	for (var i=0; i<app.m; i++) {
		var theLayer = (selectedlayers.length > i) ? selectedlayers[i] : "";
		if (theLayer == "") theLayer = app.titles[i+1];
		app.layers.push(theLayer);
	}
	app.firstDefinedLayers = app.layers.slice();                     // deep copy of array
	//console.log(app.layers);
	
	// set initial map center to global variable
	if (typeof Initial_map_center !== 'undefined' && Initial_map_center instanceof Array) {
		if (Initial_map_center.length == 2) app.InitialMapCenter = Initial_map_center;
	}
	//console.log(app.InitialMapCenter);
	
	// set initial map zoom level to global variable
	if (typeof Initial_map_zoom_level !== 'undefined' && typeof Initial_map_zoom_level === 'number') {
		if (Initial_map_zoom_level >= 1 && Initial_map_zoom_level <= 20) app.InitialMapZoomLevel = Initial_map_zoom_level;
	}
	//console.log(app.InitialMapZoomLevel);
	
	// set draw stacked area chart or not to global variable
	if (typeof Stacked_Chart !== 'undefined' && typeof Stacked_Chart === 'boolean') {
		app.StackedChart = Stacked_Chart;
	}
	//console.log(app.StackedChart);
	
	// set number of decimal places to global variable
	if (typeof Num_Of_Decimal_Places !== 'undefined' && typeof Num_Of_Decimal_Places === 'number') {
		app.NumOfDecimalPlaces = Num_Of_Decimal_Places;
	}
	//console.log(app.NumOfDecimalPlaces);
	
	// set map width and height to global variable
	if (typeof Map_width !== 'undefined' && typeof Map_width === 'string' && 
	    Map_width.substring(Map_width.length-2) == 'px' && $.isNumeric(Map_width.replace('px',''))) {
		if (Map_width.substring(0, Map_width.length-2) >= 350) {
			app.MapWidth = Map_width;
			app.ChartWidth = Map_width;
		}
	}
	if (typeof Map_height !== 'undefined' && typeof Map_height === 'string' && 
	    Map_height.substring(Map_height.length-2) == 'px' && $.isNumeric(Map_height.replace('px',''))) {
		if (Map_height.substring(0, Map_height.length-2) >= 300) {
			app.MapHeight = Map_height;
			app.ChartHeight = Map_height;
		}
	}
	//console.log(app.MapWidth, app.MapHeight);
	
	// set chart width and height to global variable
	if (typeof Chart_width !== 'undefined' && typeof Chart_width === 'string' && 
	    Chart_width.substring(Chart_width.length-2) == 'px' && $.isNumeric(Chart_width.replace('px',''))) {
		if (Chart_width.substring(0, Chart_width.length-2) >= 350) app.ChartWidth = Chart_width;
	}
	if (typeof Chart_height !== 'undefined' && typeof Chart_height === 'string' && 
	    Chart_height.substring(Chart_height.length-2) == 'px' && $.isNumeric(Chart_height.replace('px',''))) {
		if (Chart_height.substring(0, Chart_height.length-2) >= 300) app.ChartHeight = Chart_height;
	}
	//console.log(app.ChartWidth, app.ChartHeight);
	
	
	var msec = CA.features.length;
	if (msec < 500) msec = 500;
	//if (msec > 3000)
	swal({
		title: "Please wait...",
		text: "Maps will be ready in "+(msec/1000).toFixed(1)+" seconds.",
		timer: msec,
		//timer: 10000,
		//onOpen: () => { swal.showLoading() },
		icon: "info",
		buttons: false,
	}).then((value) => {
		//console.log("Initiaize all maps ended in "+(msec/1000).toFixed(1)+" seconds.");
		setTimeout(function() {
			triggerStackedAreaChart();
		}, 500);
	});

	setTimeout(function() { 
		setTimeout(function() { 
			draw_all_maps(); 
		}, 100); 
	}, 100); 
	
	$("#initFiveMaps").show();
	$("#submitForm").parent().hide();
	$("#ajaxBusy").hide();
	document.documentElement.scrollTop = 80;
	
	
	// redraw all five maps using received GeoJSON
	$("#initFiveMaps").click(function() {
		//console.log(getNow());
		//console.log(getNow(), "    ", "_Initialize_all_maps_button clicked");
		app.inputType = "_Initialize_all_maps_button clicked";       // ex) _Initialize_all_maps_button clicked
		
		CA = app.receivedGeoJSON;
		var msec = CA.features.length;
		if (msec < 500) msec = 500;
		//if (msec > 3000)
		swal({
			title: "Please wait...",
			text: "Maps will be ready in "+(msec/1000).toFixed(1)+" seconds.",
			timer: msec,
			//timer: 10000,
			icon: "info",
			buttons: false,
		}).then((value) => {
			//console.log("Initiaize all maps ended in "+(msec/1000).toFixed(1)+" seconds.");
			setTimeout(function() {
				triggerStackedAreaChart();
			}, 500);
		});

		setTimeout(function() { 
			setTimeout(function() { 
				draw_all_maps(); 
			}, 100); 
		}, 100);
	});
});


// check and draw stacked area chart
function triggerStackedAreaChart() {
	$("#map"+app.m).html("");

	var zm = 1;
	if (!isAllzIntervalsEqual()) return;
	
	var dataGlobal = [];
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		//var row = {date: new Date(app.years[i], 1, 1)};
		var row = {mapId: (i+1)};                                    // map number (1, 2, ...)
		if (app[mapN].gPolygonbyClass[0] ==                          // skip if all are No Data
			app[mapN].gPolygonbyClass[app[mapN].gPolygonbyClass.length-1]) continue;    
		//console.log(mapN, 0, app[mapN].gPolygonbyClass[0], app[mapN].gPolygonbyClass.length, app[mapN].gPolygonbyClass[app[mapN].gPolygonbyClass.length-1],app[mapN].gPolygonbyClass);
		for (var j=1; j<app[mapN].gPolygonbyClass.length; j++) {
			var c = "class" + j;
			row[c] = app[mapN].gPolygonbyClass[j];
		}
		dataGlobal.push(row);
		//console.log(dataGlobal);
	}
	dataGlobal["columns"] = ["date"];
	for (var j=1; j<app["maps"].gPolygonbyClass.length; j++) {
		var c = "class" + j;
		dataGlobal["columns"].push(c);
	}
	//console.log(dataGlobal);		

	var dataLocal = [];
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		//var row = {date: new Date(app.years[i], 1, 1)};
		var row = {mapId: (i+1)};                                    // map number (1, 2, ...)
		if (app[mapN].nPolygonbyClass[0] ==                          // skip if all are No Data
			app[mapN].nPolygonbyClass[app[mapN].nPolygonbyClass.length-1]) continue;    
		//console.log(mapN, 0, app[mapN].nPolygonbyClass[0], app[mapN].nPolygonbyClass.length, app[mapN].nPolygonbyClass[app[mapN].nPolygonbyClass.length-1],app[mapN].nPolygonbyClass);
		for (var j=1; j<app[mapN].nPolygonbyClass.length; j++) {
			var c = "class" + j;
			row[c] = app[mapN].nPolygonbyClass[j];
		}
		dataLocal.push(row);
		//console.log(dataLocal);
	}
	dataLocal["columns"] = ["date"];
	for (var j=1; j<app["maps"].nPolygonbyClass.length; j++) {
		var c = "class" + j;
		dataLocal["columns"].push(c);
	}
	//console.log(dataLocal);		
	
	// ChartWidth: 500px, ChartHeight: 500px  ->  cWidth: 470, cHeight: 240
	var ChartWidth  = app.ChartWidth .replace('px','');
	var ChartHeight = app.ChartHeight.replace('px','');
	var cWidth  = ChartWidth - 30;
	var cHeight = Math.floor((ChartHeight - 20) / 2);
	//console.log("Chart: ("+ChartWidth+","+ChartHeight+")  ->  chart: ("+cWidth+","+cHeight+")");
	var html = '';
	//html += '<div style="text-align:center;">The percentage of polygons belonging to each class</div>';
	html += '<div style="text-align:right; margin-top:25px;">';
	html += '	<div style="text-align:left; padding-left:70px; font-size:80%; font-style:normal;">Global</div>';
	html += '	<svg id="globalStackedAreaChart" width="' + cWidth + '" height="' + cHeight + '"></svg>';
	html += '</div>';
	html += '<div style="text-align:right; margin-top:10px;">';
	html += '	<div style="text-align:left; padding-left:70px; font-size:80%; font-style:normal;">Local</div>';
	html += '	<svg id="localStackedAreaChart" width="' + cWidth + '" height="' + cHeight + '"></svg>';
	html += '</div>';
	$("#map"+app.m).html(html);
	drawStackedAreaChart("globalStackedAreaChart", dataGlobal, app.colorGradient19[0]);
	drawStackedAreaChart("localStackedAreaChart",  dataLocal,  app.colorGradient19[1]);
}


// draw all five maps when
//   1. when receive GeoJSON from server
//   2. when 'Initialize all maps' button clicked
function draw_all_maps() {

	// draw titles area
	var map_html = '';
	map_html += '<div>';
	map_html += '	<div class="map_layer" style="height:25px;"></div>';
	map_html += '</div>';
	map_html += '<div>';
	map_html += '	<div class="map_metroInterval" style="height:25px;float:left;clear:both"></div>';
	map_html += '	<div class="map_sync" style="height:25px;float:right"></div>';
	map_html += '</div>';
	map_html += '<div class="map"></div>';
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		document.getElementById(mapN).innerHTML = map_html;
	}
	
	// change height and width for maps and stacked area chart
	$("#mapContainer").css("height", app.MapHeight.replace('px','')*1+100+'px');
	$(".mapArea").css("width", app.MapWidth);
	$(".mapAreaLast").css("width", app.ChartWidth);
	$(".map").css("width", app.MapWidth);
	$(".map").css("height", app.MapHeight);

	// draw each base map
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		draw_basemap(mapN);
	}

	// draw titles of each map
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		draw_titlemap(mapN, app.layers[i]);
	}
	
	draw_globalSelection();

	// initialize all bounds in app.mapN
	for (var i=0; i<app.m; i++) {
		var mapN = "map" + i;
		app[mapN].bounds = app[mapN].map.getBounds();
	}
	
	// set map bounds using geo bounds in d3 function
	var geoBounds = d3.geoBounds(CA);
	//console.log(geoBounds)
	
	var north = geoBounds[1][1];
	var east  = geoBounds[1][0];
	var south = geoBounds[0][1];
	var west  = geoBounds[0][0];
	var w = (east - west) * app.adjustBound;							// default 0.25
	var h = (north - south) * app.adjustBound;							// default 0.25
	north -= h;
	south += h;
	west += w;
	east -= w;	
	
	var fitBounds = L.latLngBounds(L.latLng(north, east), L.latLng(south, west));
	//console.log('fitBounds:', fitBounds);
	if (app.InitialMapCenter != null && app.InitialMapZoomLevel != null) {
	
		// set bitBounds from InitialMapCenter and InitialMapZoomLevel
		fitBounds = app[mapN].bounds;
		var mapBounds = app[mapN].map.getBounds();
		var west = mapBounds.getWest();
		var south = mapBounds.getSouth();
		var east = mapBounds.getEast();
		var north = mapBounds.getNorth();
		var featureMapBounds = {type: "Feature", properties: {}, geometry: {type: "Polygon", coordinates: [
			[ [west, south], [east, south], [east, north], [west, north], [west, south] ] 
		]}}

		// build selectedGeoJSON from receivedGeoJSON
		var count = 0, edgeCount = 0;
		var started = moment(new Date());
		var selectedFeatures = [];
		var count = 0;
		var baseLines = lineify(featureMapBounds);
		
		$.each(app.receivedGeoJSON.features, function(rIdx, feature) {
			if (isPolygonInMapBounds(feature, baseLines, west, south, east, north)) {
				count += 1;
				selectedFeatures.push([feature.properties[app.geokey], rIdx]);
			}
		});
		var duration = moment.duration(moment(new Date()).diff(started));
		//console.log(getNow(), mapN, 'selected features count in mapBounds: ' + count + /* '    edgeCount: ' + edgeCount + */ '    duration:', duration/1000);
		//console.log(selectedFeatures);
		
		// build selectedGeoJSON and set it to CA
		app.selectedGeoJSON = {"type":"FeatureCollection", "features":[]};
		$.each(selectedFeatures, function(rIdx, feature) {
			// feature[0] -> tractid, feature[1] -> rIdx
			app.selectedGeoJSON.features.push(app.receivedGeoJSON.features[feature[1]]);
		});
		CA = app.selectedGeoJSON;
		selectedFeatures = null;
		app.selectedBounds = mapBounds;
	}
	
	// fitBounds and redraw maps
	setTimeout(function () {
		// fitBounds
		var started = moment(new Date());
		var watchfitbounds = [false, false, false, false, false];
		for (i=0; i<app.m; i++) {
			var mapN = "map" + i;
			var alreadyFitted = false;
			if (boundsEqual(app[mapN].map.getBounds(), fitBounds)) alreadyFitted = true;
			else app[mapN].map.fitBounds(fitBounds);

			watchfitbounds[i] = setInterval(function(i, mapN) {
				var duration = moment.duration(moment(new Date()).diff(started));
				var nowBounds = app[mapN].map.getBounds();
				//console.log(getNow(), mapN, mapN+'.bounds:', app[mapN].bounds);
				//console.log(getNow(), mapN, 'nowBounds:', nowBounds, duration / 1000);
				if (alreadyFitted || !boundsEqual(app[mapN].bounds, nowBounds)) {
					//console.log(getNow(), mapN, 'after  fitBounds: ', nowBounds, 'duration:', duration/1000);
					clearInterval(watchfitbounds[i]);
					watchfitbounds[i] = false;
					app[mapN].bounds = nowBounds;
				}
				if (duration > 10000) {                              // 30000 = 30 sec
					//console.log(getNow(), mapN, 'ffit fitBounds incompleted: ', nowBounds, 'duration:', duration/1000);
					clearInterval(watchfitbounds[i]);
					watchfitbounds[i] = false;
				}
				if (!watchfitbounds.reduce(function(x, y) {return x || y;})) {
					//console.log(getNow(), mapN, 'ALL fit fitBounds completed: ', nowBounds, 'duration:', duration/1000);
					updateGloballyButton();
					app.selectedBounds = nowBounds;
					setTimeout(function() { mapOn_contextmenu_set(); }, 100);
					setTimeout(function() { mapOn_movestart_set(); }, 200);
					setTimeout(function() { mapOn_moveend_set(); }, 500);
				}
			}, 100, i, mapN);
		}
		
		// redraw maps
		for (var i=0; i<app.m; i++) {
			var mapN = "map" + i;
			//console.log(getNow(), mapN, 'drawing map started.');
			drawAmap(mapN, 3);
		}
	}, 100);
}


function fadeToWindow(mIDX) {
	if (!app.isFaded) {
		app.isFaded = true;
		app.fadeCount += 1;
		app.faded_at = moment(new Date());
		//console.log(getNow(), mIDX, 'fadeToWindow start.', app.fadeCount);
		$(".backLayer").css({top:(window.pageYOffset || document.documentElement.scrollTop), position:'absolute'});
		$(".backLayer").width($(window).width()).height($(window).height());
		$(".backLayer").fadeTo(300, 0.3);
	} else {
		//console.log(getNow(), mIDX, 'fadeToWindow start ignored.', app.fadeCount);
	}
}

function fadeOutWindow(mIDX) {
	if (app.isFaded) {
		app.isFaded = false;
		var duration = moment.duration(moment(new Date()).diff(app.faded_at));
		//console.log(getNow(), mIDX, 'fadeOutWindow ended.', app.fadeCount, 'duration:', duration/1000);
		$(".backLayer").fadeOut(300);
	} else {
		//console.log(getNow(), mIDX, 'fadeOutWindow ended ignored.', app.fadeCount);
	}
}

function mapOn_contextmenu_set(mIDX) {
	var pIDX = (mIDX) ? mIDX : "    "
	//console.log(getNow(), pIDX, 'START mapOn_contextmenu_set');

	if (app.m >= 1  && (pIDX == "    " || pIDX == "map0" )) app["map0" ].map.on('contextmenu', mapON_contextmenu_map0, "map60");
	if (app.m >= 2  && (pIDX == "    " || pIDX == "map1" )) app["map1" ].map.on('contextmenu', mapON_contextmenu_map1, "map61");
	if (app.m >= 3  && (pIDX == "    " || pIDX == "map2" )) app["map2" ].map.on('contextmenu', mapON_contextmenu_map2, "map62");
	if (app.m >= 4  && (pIDX == "    " || pIDX == "map3" )) app["map3" ].map.on('contextmenu', mapON_contextmenu_map3, "map63");
	if (app.m >= 5  && (pIDX == "    " || pIDX == "map4" )) app["map4" ].map.on('contextmenu', mapON_contextmenu_map4, "map64");
	if (app.m >= 6  && (pIDX == "    " || pIDX == "map5" )) app["map5" ].map.on('contextmenu', mapON_contextmenu_map5, "map65");
	if (app.m >= 7  && (pIDX == "    " || pIDX == "map6" )) app["map6" ].map.on('contextmenu', mapON_contextmenu_map6, "map66");
	if (app.m >= 8  && (pIDX == "    " || pIDX == "map7" )) app["map7" ].map.on('contextmenu', mapON_contextmenu_map7, "map67");
	if (app.m >= 9  && (pIDX == "    " || pIDX == "map8" )) app["map8" ].map.on('contextmenu', mapON_contextmenu_map8, "map68");
	if (app.m >= 10 && (pIDX == "    " || pIDX == "map9" )) app["map9" ].map.on('contextmenu', mapON_contextmenu_map9, "map69");
	if (app.m >= 11 && (pIDX == "    " || pIDX == "map10")) app["map10"].map.on('contextmenu', mapON_contextmenu_map10,"map70");
	if (app.m >= 12 && (pIDX == "    " || pIDX == "map11")) app["map11"].map.on('contextmenu', mapON_contextmenu_map11,"map71");
	if (app.m >= 13 && (pIDX == "    " || pIDX == "map12")) app["map12"].map.on('contextmenu', mapON_contextmenu_map12,"map72");
	if (app.m >= 14 && (pIDX == "    " || pIDX == "map13")) app["map13"].map.on('contextmenu', mapON_contextmenu_map13,"map73");
	if (app.m >= 15 && (pIDX == "    " || pIDX == "map14")) app["map14"].map.on('contextmenu', mapON_contextmenu_map14,"map74");

	//console.log(getNow(), pIDX, 'ENDED mapOn_contextmenu_set');
}

function mapON_contextmenu_map0(e)  { mapON_contextmenu(e, "map0" ); }
function mapON_contextmenu_map1(e)  { mapON_contextmenu(e, "map1" ); }
function mapON_contextmenu_map2(e)  { mapON_contextmenu(e, "map2" ); }
function mapON_contextmenu_map3(e)  { mapON_contextmenu(e, "map3" ); }
function mapON_contextmenu_map4(e)  { mapON_contextmenu(e, "map4" ); }
function mapON_contextmenu_map5(e)  { mapON_contextmenu(e, "map5" ); }
function mapON_contextmenu_map6(e)  { mapON_contextmenu(e, "map6" ); }
function mapON_contextmenu_map7(e)  { mapON_contextmenu(e, "map7" ); }
function mapON_contextmenu_map8(e)  { mapON_contextmenu(e, "map8" ); }
function mapON_contextmenu_map9(e)  { mapON_contextmenu(e, "map9" ); }
function mapON_contextmenu_map10(e) { mapON_contextmenu(e, "map10"); }
function mapON_contextmenu_map11(e) { mapON_contextmenu(e, "map11"); }
function mapON_contextmenu_map12(e) { mapON_contextmenu(e, "map12"); }
function mapON_contextmenu_map13(e) { mapON_contextmenu(e, "map13"); }
function mapON_contextmenu_map14(e) { mapON_contextmenu(e, "map14"); }

function mapON_contextmenu(e, mIDX) {
	//console.log(getNow(), mIDX, mIDX+"_contextmenu clicked");
	app.inputType = mIDX+"_contextmenu clicked";                     // ex) map0_contextmenu clicked
	globalHeadingRestore();
	
	// changed metroInterval type from checkbox to radio button
	var GorL = $('input[type=radio][name="'+mIDX+'-checkbox"]:checked').val();
	if (GorL == "Global") {
		$('input[type=radio][name="'+mIDX+'-checkbox"]:input[value="Local"]').prop("checked", true);
	} else {
		$('input[type=radio][name="'+mIDX+'-checkbox"]:input[value="Global"]').prop("checked", true);
	}
	
	var nowBounds = app[mIDX].map.getBounds();
	if (!boundsEqual(app.selectedBounds, nowBounds)) {
		//console.log(getNow(), mIDX, 'mIDX.map.getBounds() != app.selectedBounds', nowBounds, app.selectedBounds);
		app.selectedBounds = nowBounds;
		updateSelectedGeoJSON(mIDX);
		CA = app.selectedGeoJSON;
	}
	ACSdata_render(mIDX);
}

var mapON_movestarts = [
	function mapON_movestart_map0 (e) { mapON_movestart(e, "map0" ); },
	function mapON_movestart_map1 (e) { mapON_movestart(e, "map1" ); },
	function mapON_movestart_map2 (e) { mapON_movestart(e, "map2" ); },
	function mapON_movestart_map3 (e) { mapON_movestart(e, "map3" ); },
	function mapON_movestart_map4 (e) { mapON_movestart(e, "map4" ); },
	function mapON_movestart_map5 (e) { mapON_movestart(e, "map5" ); },
	function mapON_movestart_map6 (e) { mapON_movestart(e, "map6" ); },
	function mapON_movestart_map7 (e) { mapON_movestart(e, "map7" ); },
	function mapON_movestart_map8 (e) { mapON_movestart(e, "map8" ); },
	function mapON_movestart_map9 (e) { mapON_movestart(e, "map9" ); },
	function mapON_movestart_map10(e) { mapON_movestart(e, "map10"); },
	function mapON_movestart_map11(e) { mapON_movestart(e, "map11"); },
	function mapON_movestart_map12(e) { mapON_movestart(e, "map12"); },
	function mapON_movestart_map13(e) { mapON_movestart(e, "map13"); },
	function mapON_movestart_map14(e) { mapON_movestart(e, "map14"); },
];

function mapOn_movestart_set(mIDX) {
	var pIDX = (mIDX) ? mIDX : "    "
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (count_movestart_event(mapN) == 0 && (pIDX == "    " || pIDX == mapN))
			app[mapN].map.on('movestart', mapON_movestarts[i], mapN);
	}
}

function mapOn_movestart_off(mIDX) {
	var pIDX = (mIDX) ? mIDX : "    "
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (count_movestart_event(mapN) != 0 && (pIDX == "    " || pIDX == mapN))
			app[mapN].map.off('movestart', mapON_movestarts[i], mapN);
	}
}

function mapON_movestart(e, mIDX) {
	//console.log(getNow(), mIDX, mIDX+"_event_movestart detected");
	app.inputType = mIDX+"_event_movestart detected";                // ex) map0_event_movestart detected
	fadeToWindow(mIDX);
	mapOn_movestart_off();
}

var mapON_moveends = [
	function mapON_moveend_map0 (e) { mapON_moveend(e, "map0" ); },
	function mapON_moveend_map1 (e) { mapON_moveend(e, "map1" ); },
	function mapON_moveend_map2 (e) { mapON_moveend(e, "map2" ); },
	function mapON_moveend_map3 (e) { mapON_moveend(e, "map3" ); },
	function mapON_moveend_map4 (e) { mapON_moveend(e, "map4" ); },
	function mapON_moveend_map5 (e) { mapON_moveend(e, "map5" ); },
	function mapON_moveend_map6 (e) { mapON_moveend(e, "map6" ); },
	function mapON_moveend_map7 (e) { mapON_moveend(e, "map7" ); },
	function mapON_moveend_map8 (e) { mapON_moveend(e, "map8" ); },
	function mapON_moveend_map9 (e) { mapON_moveend(e, "map9" ); },
	function mapON_moveend_map10(e) { mapON_moveend(e, "map10"); },
	function mapON_moveend_map11(e) { mapON_moveend(e, "map11"); },
	function mapON_moveend_map12(e) { mapON_moveend(e, "map12"); },
	function mapON_moveend_map13(e) { mapON_moveend(e, "map13"); },
	function mapON_moveend_map14(e) { mapON_moveend(e, "map14"); },
];

function mapOn_moveend_set(mIDX) {
	var pIDX = (mIDX) ? mIDX : "    "
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (count_moveend_event(mapN) == 0 && (pIDX == "    " || pIDX == mapN))
			app[mapN].map.on('moveend', mapON_moveends[i], mapN);
	}
}

function mapOn_moveend_off(mIDX) {
	var pIDX = (mIDX) ? mIDX : "    "
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (count_moveend_event(mapN) != 0 && (pIDX == "    " || pIDX == mapN))
			app[mapN].map.off('moveend', mapON_moveends[i], mapN);
	}
}

function mapON_moveend(e, mIDX) { 
	//console.log(getNow(), mIDX, mIDX+"_event_moveend detected");
	app.inputType = mIDX+"_event_moveend detected";                  // ex) map0_event_moveend detected
	globalHeadingRestore();
	mapOn_moveend_off();
	setTimeout(function() { 
		redraw_maps(mIDX, 1);
	}, 100);
};

// count 'movestart' event registered in the map 
function count_movestart_event(mIDX, e) {
	var movestartEvents = app[mIDX].map._events["movestart"];
	if (e) movestartEvents = e.target._events["movestart"];
	if (!movestartEvents) return 0;
	var count = 0;
	$.each(movestartEvents, function(idx, row) {
		var ctx = row['ctx'];
		//console.log(mIDX, idx, ctx, e);
		if (typeof ctx === 'string' && ctx.startsWith(mIDX)) count += 1;
	});
	return count;
}

// count 'moveend' event registered in the map 
function count_moveend_event(mIDX, e) {
	var moveendEvents = app[mIDX].map._events["moveend"];
	if (e) moveendEvents = e.target._events["moveend"];
	if (!moveendEvents) return 0;
	var count = 0;
	$.each(moveendEvents, function(idx, row) {
		var ctx = row['ctx'];
		//console.log(getNow(), mIDX, idx, ctx, e);
		if (typeof ctx === 'string' && ctx.startsWith(mIDX)) count += 1;
	});
	return count;
}


// call 'redraw_all_maps' and check it completed.
function redraw_maps(mIDX, drawMode, baseBounds) {
	redraw_all_maps(mIDX, drawMode, baseBounds);
	
	var started = moment(new Date());
	//console.log(getNow(), mIDX, 'after  redraw_all_maps');
	var i = 0;
	function repeat_setTimeout() {
		setTimeout(function() {
			i += 1;
			if (i > 70) {
				var duration = moment.duration(moment(new Date()).diff(started));
				//console.log(getNow(), mIDX, 'after  redraw_all_maps:', (i-1), ' duration:', duration/1000);
				updateGloballyButton();
				mapOn_movestart_set();
				mapOn_moveend_set();
				setTimeout(function() {
					triggerStackedAreaChart();
				}, 500);
				//console.log(getNow(), mIDX, 'fadeOutWindow ended.');
				fadeOutWindow(mIDX);
			} else {
				repeat_setTimeout();
			}
		}, 0);
	}
	repeat_setTimeout();
}

// redraw a map and related maps
function redraw_all_maps(mIDX, drawMode, baseBounds) {
	
	// drawMode ->  1: draw normal,  2: draw when auto, manual selected,  3: draw all maps force
	//console.log(getNow(), mIDX, 'redraw_maps start', 'drawMode: ', drawMode, 'baseBounds: ', baseBounds);
	
	var prvBounds = app[mIDX].bounds;
	var mapBounds = app[mIDX].map.getBounds();
	app[mIDX].bounds = mapBounds;                                    // save this map bounds to app.mapN.bounds
	if (baseBounds) mapBounds = baseBounds;                          // auto clicked, Join group aleady existed
	
	//console.log(getNow(), mIDX, 'prvBounds: ', prvBounds);
	//console.log(getNow(), mIDX, 'mapBounds: ', mapBounds);
	
	var west = mapBounds.getWest();
	var south = mapBounds.getSouth();
	var east = mapBounds.getEast();
	var north = mapBounds.getNorth();
	var featureMapBounds = {type: "Feature", properties: {}, geometry: {type: "Polygon", coordinates: [
		[ [west, south], [east, south], [east, north], [west, north], [west, south] ] 
	]}}
	
	// build selectedGeoJSON from receivedGeoJSON
	var count = 0;
	var selectedFeatures = [];
	var baseLines = lineify(featureMapBounds);
	
	var started = moment(new Date());
	$.each(app.receivedGeoJSON.features, function(rIdx, feature) {
		if (isPolygonInMapBounds(feature, baseLines, west, south, east, north)) {
			count += 1;
			selectedFeatures.push([feature.properties[app.geokey], rIdx]);
		}
	});
	var duration = moment.duration(moment(new Date()).diff(started));
	//console.log(getNow(), mIDX, 'selected features count in mapBounds:', count, '    duration:', duration/1000);

	var this_sync = $('input[type=radio][name="'+mIDX+'-radio"]:checked').val();
	
	// determine witch maps need to fitBounds
	var refitBoundableMaps = (!boundsEqual(mapBounds, app[mIDX].map.getBounds())) ? [mIDX] : [];
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (mapN == mIDX) continue;
		var that_sync = $('input[type=radio][name="'+mapN+'-radio"]:checked').val();
		if (drawMode != 3) {
			if (this_sync == 'auto' && that_sync == 'manual') continue;
			if (this_sync == 'manual') continue;
		}
		//console.log(boundsEqual(mapBounds, app[mapN].map.getBounds()), mapBounds, app[mapN].map.getBounds())
		if (!boundsEqual(mapBounds, app[mapN].map.getBounds())) {
			refitBoundableMaps.push(mapN);
		}
	}
	//console.log(refitBoundableMaps)
	
	// check need redrawing or not
	var needDrawing = true;
	if (drawMode == 1 && count < 1) {        // 10  ->  1
		//console.log(getNow(), mIDX, 'redrawing map ignored when count < 1');
		needDrawing = false;
	}
	
	if (selectedFeatures.length == CA.features.length) {
		var isEqual = true;
		for (f=0; f<selectedFeatures.length; f++) {
			var prvFeature = CA.features[f];
			var newFeature = selectedFeatures[f];
			if (newFeature[0] != prvFeature.properties.tractid) {
				isEqual = false;
				break;
			}
		}
		if (drawMode == 1 && isEqual) {
			//console.log(getNow(), mIDX, 'redrawing map ignored when prvGeoJSON = selectedFeatures');
			needDrawing = false;
		}
	}
	
	// determine witch maps need to redraw
	var redrawableMaps = [mIDX];
	var autoCount = (this_sync == 'auto') ? 1 : 0;
	for (i=0; i<app.m; i++) {
		var mapN = "map" + i;
		if (mapN == mIDX) continue;
		var that_sync = $('input[type=radio][name="'+mapN+'-radio"]:checked').val();
		if (that_sync == 'auto') autoCount += 1;
		var needRedraw = false;
		if (drawMode == 1 && this_sync == 'auto' && that_sync == 'auto') needRedraw = true;
		if (drawMode == 2 && that_sync == 'auto') needRedraw = true;
		if (drawMode == 3) needRedraw = true;
		if (needRedraw) redrawableMaps.push(mapN);
	}
	if (drawMode == 2 && this_sync == 'auto' && redrawableMaps.length == 1) redrawableMaps = [];
	//console.log(getNow(), mIDX, 'redrawableMaps', redrawableMaps);

	// build redraw decison table
	var fitBoundDT = [];  for (i=0; i<app.m; i++) fitBoundDT.push("    ");
	var drawMapsDT = [];  for (i=0; i<app.m; i++) drawMapsDT.push("    ");
	for (i=0; i<refitBoundableMaps.length; i++) 
		fitBoundDT[refitBoundableMaps[i].replace('map','')] = refitBoundableMaps[i];
	if (needDrawing)
	for (i=0; i<redrawableMaps.length; i++) 
		drawMapsDT[redrawableMaps[i].replace('map','')] = redrawableMaps[i];
	//console.log(getNow(), mIDX, 'fitBoundDT: ', fitBoundDT);
	//console.log(getNow(), mIDX, 'drawMapsDT: ', drawMapsDT);
	
	// re arrange decison table
	var c = mIDX.replace('map','');
	var fitBoundST = [fitBoundDT[c]];
	var drawMapsST = [drawMapsDT[c]];
	for (i=0; i<app.m; i++) {
		if (i != c) {
			fitBoundST.push(fitBoundDT[i]);
			drawMapsST.push(drawMapsDT[i]);
		}
	}
	//console.log(getNow(), mIDX, 'fitBoundST: ', fitBoundST);
	//console.log(getNow(), mIDX, 'drawMapsST: ', drawMapsST);
	
	if (needDrawing) {
		// build selectedGeoJSON
		app.selectedGeoJSON = {"type":"FeatureCollection", "features":[]};
		$.each(selectedFeatures, function(rIdx, feature) {
			app.selectedGeoJSON.features.push(app.receivedGeoJSON.features[feature[1]]);
		});
		CA = app.selectedGeoJSON;
		selectedFeatures = null;
		app.selectedBounds = mapBounds;
	}
	//console.log(CA);
	
	var mapN;
	for (var i=0; i<app.m; i++) {
		// fitBounds 
		mapN = fitBoundST[i];
		if (mapN != "    ") {
			//console.log(getNow(), mapN, 'fit mapBounds: ', mapBounds);
			app[mapN].map.fitBounds(mapBounds);
		}
		// redraw maps
		mapN = drawMapsST[i];
		if (mapN != "    ") {
			//console.log(getNow(), mapN, 'drawing map started.');
			drawAmap(mapN, drawMode);
		}
	}
}


// update global variable of selectedJSON from app.mapN.geojson.eachLayer
function updateSelectedGeoJSON(mIDX) {
	app.selectedGeoJSON = {"type":"FeatureCollection", "features":[]};
	app[mIDX].geojson.eachLayer(function(layer) {
		app.selectedGeoJSON.features.push(layer.feature);
	})
}


// Pading a value with leading zeors
// from stack overflow CMS answered Jun 8 '10 at 15:39 by Christian C. Salvadó in Guatemala, Central America
// https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript 
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}


// Draw Stacked Area Chart
function drawStackedAreaChart(svgid, data, colorGradient) {
	if (app.StackedChart == false || app.m <= 1) {
		$("#map"+app.m).html("");
		return;
	}

	var clone = JSON.parse(JSON.stringify(data));          // deep copy from data
	
	var svg = d3.select("#"+svgid),
		margin = {top: 10, right: 20, bottom: 20, left: 40},
		width = svg.attr("width") - margin.left - margin.right,
		height = svg.attr("height") - margin.top - margin.bottom;
	
	var xAxis = {domain: [], range: []};
	for (var i=0; i<data.length; i++) {
		if (data.length <= 10) xAxis.domain.push('Map'+data[i].mapId);
		else xAxis.domain.push(data[i].mapId);
		xAxis.range.push(width*i*1.0/(data.length-1));
	}
	
	var ordinalScale = d3.scaleOrdinal().domain(xAxis.domain).range(xAxis.range),
	//	x = d3.scaleLinear().range([0, width]),
		x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal().range(colorGradient);
	
	var stack = d3.stack();
	
	var area = d3.area()
		.x(function(d, i) { return x(d.data.mapId); })
		.y0(function(d) { return y(d[0]); })
		.y1(function(d) { return y(d[1]); });
	
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var keys = data.columns.slice(1);

	// convert value to percent
	for (var i=0; i<data.length; i++) {
		var t = 0;
		for (var j=0; j<keys.length; j++) {
			var k = keys[j];
			t += data[i][k];
		}
		for (var j=0; j<keys.length; j++) {
			var k = keys[j];
			data[i][k] = data[i][k] / t;
		}
	}
	//console.log(data);
	
	x.domain(d3.extent(data, function(d) { return d.mapId; }));
	z.domain(keys);
	stack.keys(keys);
	
	var layer = g.selectAll(".layer")
		.data(stack(data))
		.enter().append("g")
		.attr("class", "layer");
	
	layer.append("path")
		.attr("class", "stackedArea")
		.style("fill", function(d) { return z(d.key); })
		.attr("d", area);
	
	layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
		.append("text")
		.attr("x", width - 6)
		.attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
		.attr("dy", ".35em")
		.style("font", "10px sans-serif")
		.style("text-anchor", "end")
		.text(function(d) { return d.key.substring(0,d.key.length-1)+" "+d.key.substring(d.key.length-1); });
	
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(ordinalScale).ticks(data.length));
	
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).ticks(5, "%"));
	
	// Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
		.attr("class", "tooltip")
		.style("opacity", 1.0)
		.style("display", "none");

	tooltip.append("rect")
		.attr("width", 120)
		.attr("height", 20)
		.attr("fill", "white")
		.style("opacity", 0.5);
	
	tooltip.append("text")
		.attr("x", 60)
		.attr("dy", "1.2em")
		.style("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("font-weight", "bold");

}


function isPolygonInMapBounds(feature, baseLines, west, south, east, north) {

	// false, if the bounds of Polygon are completely out of Rectangle
	var geoBounds = d3.geoBounds(feature);
	if (geoBounds[0][0] > east  ||
		geoBounds[1][0] < west  ||
		geoBounds[0][1] > north ||
		geoBounds[1][1] < south) return false;
	
	// 1st: check the first point of Polygon against the Rectangle
	var coordinates = [];
	if (feature.geometry.type == 'Polygon') {
		coordinates.push(feature.geometry.coordinates[0][0]);
	}		
	if (feature.geometry.type == 'MultiPolygon') {
		for (var i in feature.geometry.coordinates) {
			coordinates.push(feature.geometry.coordinates[i][0][0]);
		}
	}
	for (var i in coordinates) {
		var point = coordinates[i];
		if (west  <= point[0] && point[0] <= east &&
			south <= point[1] && point[1] <= north) return true;
	}
	
	// 2nd: check the bottom left corner point in Rectangle against the Polygon          
	if (d3.geoContains(feature, [west, south])) return true;
	
	// 3rd: check the lines of Rectangle against the Polygon          
	var drawLines = lineify(feature);
	var crossPoints = [];
	for (var i in drawLines.geometries) {
		for (var j in baseLines.geometries) {
			var crossTest = lineStringsIntersect(drawLines.geometries[i], baseLines.geometries[j]);
			if (crossTest) {
				for (var k in crossTest) {
					crossPoints.push(crossTest[k]);
				}
			}
		}
	}
	if (crossPoints.length != 0) return true;
	
	return false;
}


////////////////////////////////////////////////////////////////////////////////////////////
//intersection and geometry conversion functions form nathansnider's public fiddles       //
////////////////////////////////////////////////////////////////////////////////////////////

// corrected intersection code from https://github.com/maxogden/geojson-js-utils
// (using projected coordinates, because straight lat/lons will produce incorrect results)
// originally adapted from http://www.kevlindev.com/gui/math/intersection/Intersection.js
function lineStringsIntersect(l1, l2) {
    var intersects = [];
    for (var i = 0; i <= l1.coordinates.length - 2; ++i) {
        for (var j = 0; j <= l2.coordinates.length - 2; ++j) {
            var a1Latlon = L.latLng(l1.coordinates[i][1], l1.coordinates[i][0]),
                a2Latlon = L.latLng(l1.coordinates[i + 1][1], l1.coordinates[i + 1][0]),
                b1Latlon = L.latLng(l2.coordinates[j][1], l2.coordinates[j][0]),
                b2Latlon = L.latLng(l2.coordinates[j + 1][1], l2.coordinates[j + 1][0]),
                a1 = L.Projection.SphericalMercator.project(a1Latlon),
                a2 = L.Projection.SphericalMercator.project(a2Latlon),
                b1 = L.Projection.SphericalMercator.project(b1Latlon),
                b2 = L.Projection.SphericalMercator.project(b2Latlon),
                ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
                ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
                u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
            if (u_b != 0) {
                var ua = ua_t / u_b,
                    ub = ub_t / u_b;
                if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                    var pt_x = a1.x + ua * (a2.x - a1.x),
                        pt_y = a1.y + ua * (a2.y - a1.y),
                        pt_xy = {
                            "x": pt_x,
                                "y": pt_y
                        },
                        pt_latlon = L.Projection.SphericalMercator.unproject(pt_xy);
                    intersects.push({
                        'type': 'Point',
                            'coordinates': [pt_latlon.lng, pt_latlon.lat]
                    });
                }
            }
        }
    }
    if (intersects.length == 0) intersects = false;
    return intersects;
}

//takes GeoJSON as input, creates a GeoJSON GeometryCollection of linestrings as output
// from https://gis.stackexchange.com/questions/170919/how-to-tell-if-a-geojson-path-intersects-with-another-feature-in-leaflet
function lineify(inputGeom) {
    var outputLines = {
        "type": "GeometryCollection",
            "geometries": []
    }
    switch (inputGeom.type) {
        case "GeometryCollection":
            for (var i in inputGeom.geometries) {
                var geomLines = lineify(inputGeom.geometries[i]);
                if (geomLines) {
                    for (var j in geomLines.geometries) {
                        outputLines.geometries.push(geomLines.geometries[j]);
                    }
                } else {
                    outputLines = false;
                }
            }
            break;
        case "Feature":
            var geomLines = lineify(inputGeom.geometry);
            if (geomLines) {
                for (var j in geomLines.geometries) {
                    outputLines.geometries.push(geomLines.geometries[j]);
                }
            } else {
                outputLines = false;
            }
            break;
        case "FeatureCollection":
            for (var i in inputGeom.features) {
                var geomLines = lineify(inputGeom.features[i].geometry);
                if (geomLines) {
                    for (var j in geomLines.geometries) {
                        outputLines.geometries.push(geomLines.geometries[j]);
                    }
                } else {
                    outputLines = false;
                }
            }
            break;
        case "LineString":
            outputLines.geometries.push(inputGeom);
            break;
        case "MultiLineString":
        case "Polygon":
            for (var i in inputGeom.coordinates) {
                outputLines.geometries.push({
                    "type": "LineString",
                        "coordinates": inputGeom.coordinates[i]
                });
            }
            break;
        case "MultiPolygon":
            for (var i in inputGeom.coordinates) {
                for (var j in inputGeom.coordinates[i]) {
                    outputLines.geometries.push({
                        "type": "LineString",
                            "coordinates": inputGeom.coordinates[i][j]
                    });
                }
            }
            break;
        default:
            outputLines = false;
    }
    return outputLines;
}
