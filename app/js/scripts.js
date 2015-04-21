
function getAsync( url, callback )
{
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if( xmlhttp.readyState == 4 ) {
			callback( xmlhttp.responseText );
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function postAsync( url, params, callback )
{
	var xmlhttp = new XMLHttpRequest(),
		str = Object.keys(params).map(function(key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
		}).join("&");
		
	xmlhttp.onreadystatechange = function() {
		if( xmlhttp.readyState == 4 ) {
			callback( xmlhttp.responseText );
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.setRequestHeader("Content-length", str.length);
	xmlhttp.setRequestHeader("Connection", "close");
	xmlhttp.send(str);
}

function getURLArg( param )
{
	var result = [];
	var search = window.location.search.substring(1);
	var params = search.split("&");
	
	for( var i = 0; i < params.length; i++ )
	{
		var p = params[i].split("=");
		result.push( { "key": p[0], "val": p[1] } ); 
	}
	for( var i = 0; i < result.length; i++ )
	{
		if( result[i].key == param )
			return result[i].val;
	}
	return null;
}

function initFlash( sessionFile )
{
	// For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. 
	var swfVersionStr = "10.2.0";
	// To use express install, set to playerProductInstall.swf, otherwise the empty string. 
	var xiSwfUrlStr = "playerProductInstall.swf";
	var flashvars = {};
	flashvars.file = sessionFile;
	flashvars.allowDomain = "*";
	var params = {};
	params.base = baseHost;
	params.quality = "high";
	params.bgcolor = "#FFFFFF";
	params.wmode = "direct";
	params.allowscriptaccess = "always";
	params.allowfullscreen = "true";
	var attributes = {};
	attributes.id = "weave";
	attributes.name = "weave";
	attributes.align = "middle";
	swfobject.embedSWF(
		baseHost + "/weave.swf", "flashContent", 
		"100%", "100%", 
		swfVersionStr, xiSwfUrlStr, 
		flashvars, params, attributes);
	// JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
	swfobject.createCSS("#flashContent", "display:block;text-align:left;z-index:2000;");	
}

function extendPaths()
{
	// USAGE: getWeave().path("MapTool").zoomToLayer("Geometries");
	var weave_zoomToLayer = weave.evaluateExpression(null, "\
                    function(tool, layerName) {\
                        var pm = tool.visualization.plotManager;\
                        var plotter = pm.getPlotter(layerName);\
                        if (!plotter) return;\
                        var getDescendants = WeaveAPI.SessionManager.getLinkableDescendants;\
                        var streamed = getDescendants(plotter, StreamedGeometryColumn)[0];\
                        var reprojected = getDescendants(plotter, ReprojectedGeometryColumn)[0];\
                        var geocol = getDescendants(plotter, GeometryColumn)[0];\
                        var srcProj = streamed && streamed.getMetadata('projection');\
                        var destProj = reprojected ? reprojected.projectionSRS.value : srcProj;\
                        var b = streamed && streamed.collectiveBounds.cloneBounds();\
                        if (!b && geocol)\
                        {\
                            b = new Bounds2D();\
                            for each (var k in geocol.keys)\
                                for each (var g in geocol.getValueFromKey(k, Array))\
                                    b.includeBounds(g.bounds);\
                        }\
                        if (!b || b.isUndefined()) return;\
                        WeaveAPI.ProjectionManager.transformBounds(srcProj, destProj, b);\
                        pm.zoomBounds.setSessionState( b );\
                    }",
                    null,
                    ['weave.data.AttributeColumns.ReprojectedGeometryColumn',
                        'weave.data.AttributeColumns.StreamedGeometryColumn',
                        'weave.data.AttributeColumns.GeometryColumn',
                        'weave.primitives.Bounds2D']
                );
				
	getWeave().WeavePath.prototype.zoomToLayer = function(layerName) {
		weave_zoomToLayer( this, layerName );
		return this;
	}
	
	// USAGE: getWeave().path("MapTool").setZoom( 10 );
	getWeave().WeavePath.prototype.setZoom = function(zoom) {
		return this.push("children", "visualization", "plotManager")
				.vars({zoom: zoom})
				.exec("setZoomLevel(zoom)")
			.pop();
	};
	getWeave().WeavePath.prototype.getZoom = function() {
		return this.push("children", "visualization", "plotManager")
				.getValue("getZoomLevel()");
	};
	getWeave().WeavePath.prototype.zoomIn = function( mult ) {
		var z = this.getZoom(),
			mult = ( typeof mult !== "undefined" ) ? mult : 1;
		return this.setZoom( z + 0.3 * mult );
	};
	getWeave().WeavePath.prototype.zoomOut = function( mult ) {
		var z = this.getZoom(),
			mult = ( typeof mult !== "undefined" ) ? mult : 1;
		return this.setZoom( z - 0.3 * mult );
	};
	var addEventCallback = getWeave().path().getValue("WeaveAPI.StageUtils.addEventCallback");
	var getKey = getWeave().path().getValue("()=>WeaveAPI.StageUtils.keyboardEvent.keyCode");
	var getCtrl = getWeave().path().getValue("()=>WeaveAPI.StageUtils.ctrlKey");
	var lastKey;
	addEventCallback('keyDown', null, function(){
		var key = getKey();
		if (lastKey == key)
			return;
		lastKey = key;
		if (key == 13 && getCtrl())
			getWeave().path('WeaveProperties').exec("dashboardMode.value ^= 1");
	});
	addEventCallback('keyUp', null, function(){ lastKey = null; });
}


/*
 * Helper Tool API Functions
 */
//=======================================================================================================
function getDraggableTools()
{
	var script = "getNames(Class('weave.ui.DraggablePanel'))";
	return getWeave().path().getValue(script);
}
//=======================================================================================================
function getVisualizationTools()
{
    var script = "getNames(Class('weave.api.ui.IVisTool'))";
    return getWeave().path().getValue(script);
}
//=======================================================================================================
function getToolNames( tool )
{
	var script = "getNames(Class('weave.visualization.tools::" + tool + "'))";
	return getWeave().path().getValue(script);
}
//=======================================================================================================
function getToolPathsFromLayout( tool, attr )
{
	var tools = Object.keys( layoutControls );
	if( !inArray( tools, tool ) ) {
		throw new Error( tool + " is not defined in layout controls!" );
		return;
	}
	
	var indicators = layoutControls[tool].indicators;
	for( var i = 0; i < indicators.length; i++ ) {
		var indicator = indicators[i];
		
		if( indicator.text.toLowerCase() == attr.toLowerCase() )
			return indicator.paths;
	}
}
//=======================================================================================================
function getTaskCount()
{
	return getWeave().path().libs("weave.api.WeaveAPI").getValue("WeaveAPI.ProgressIndicator.getTaskCount()");
}
//=======================================================================================================
function tileAllWindows()
{
	getWeave()
		.path()
		.exec("\
			import 'weave.ui.DraggablePanel';\
			\
			DraggablePanel.tileWindows();\
		");
}
//=======================================================================================================
function resetColumnWidths()
{
	if( isToolOpen("TableTool") )
	{
		getWeave().path("TableTool").exec("columnWidths.removeAllObjects()");
	}
}
//=======================================================================================================
function getWeaveTopPanel()
{
	return getWeave().evaluateExpression(
		[],
		"DraggablePanel.getTopPanelName()",
		{},
		['weave.ui.DraggablePanel']
	);
}
//=======================================================================================================
function getToolID( tool )
{
	if( tools.hasOwnProperty( tool ) )
		return tools[ tool ].id;
	return 0;
}
//=======================================================================================================
function toggleTool( tool )
{
	var enabled = $("#checkbox_"+tool).is(":checked");
	
	if( enabled ) {
		getWeave().path(tool).request(tool);
	}
	else
	{
		try {
			getWeave().path(tool).remove();
		} catch( e ) {
		}
	}
	return enabled;
}
//=======================================================================================================
function getLayoutIndex()
{
	var L = 0;
	
	for( var tool in tools )
		L |= ( $("#checkbox_" + tool).is(":checked") ? getToolID(tool) : 0 );
	
	return L;
}
//=======================================================================================================
function updateLayout()
{
	var L = getLayoutIndex(),
		layout = layouts[L];
	
	setTimeout(function() {
		for( var tool in layout )
			if( isToolOpen( tool ) )
				getWeave().path(tool).state(layout[tool]);
	}, 200);
}
//=======================================================================================================



/*
 * Utility Functions
 */
//=======================================================================================================
function first( arr )
{
	return arr[0];
}
//=======================================================================================================
function last( arr )
{
	return arr[ arr.length - 1 ];
}
//=======================================================================================================
function isEmpty( e )
{
	if( typeof e == "undefined" ||
		e == null				||
		e.length == 0			)
		return true;
	
	return false;
}
//=======================================================================================================
function isObject( a )
{
	return Object.prototype.toString.call( a ) == "[object Object]";
}
//=======================================================================================================
function isString( a )
{
	return Object.prototype.toString.call( a ) == "[object String]";
}
//=======================================================================================================
function isArray( a )
{
	return Object.prototype.toString.call( a ) == "[object Array]";
}
//=======================================================================================================
function inArray( arr, val )
{
	if( isArray( arr ) ) {
		for( var i =  0; i < arr.length; i++ )
			if( arr[i] == val ) 
				return true;
	} else {
		var keys = Object.keys( arr );
		return inArray( keys, val );
	}
	return false;
}
//=======================================================================================================
function toArray( o )
{
	var json = isValidJSON( o );
	if( json === false )
		return null;
		
	var result = Object.keys( json ).map(function( e ) {
		return "" + json[e];
	});
	return result;
}
//=======================================================================================================
function rangeToArray( low, high )
{
	var list = [];
	for( var i = low; i <= high; i++ )
		list.push( i );
	return list;
}
//=======================================================================================================
function isValidJSON( str )
{
	var valid = false;
	try {
		valid = JSON.parse( str );
	} catch( e ) { }
	return valid;
}
//=======================================================================================================
function isToolOpen( tool )
{
	var bool = true;
	
	if( isArray( tool ) ) {
		for( var i = 0; i < tool.length; i++ ) {
			bool &= isToolOpen( tool[i] );
		}
	} else
		bool = inArray( getVisualizationTools(), tool );
	
	return bool;
}
//=======================================================================================================
function arrayIntersection()
{
	var o = {},
		results = [];
	
	for( var i in arguments )
		for( var j in arguments[i] )
			o[ arguments[i][j] ] = (o[ arguments[i][j] ] || 0) + 1;
	
	for( var k in o )
		if( o[k] == arguments.length )
			results.push( k );
	
	return results;
}
//=======================================================================================================
function arrayDisjoint()
{
	var o = {},
		results = [];
	
	for( var i in arguments )
		for( var j in arguments[i] )
			o[ arguments[i][j] ] = ( o[ arguments[i][j] ] || 0 ) + 1;
	
	for( var i in o )
		if( o[i] == 1 )
			results.push( i );
	
	return results;
}
//=======================================================================================================


function safeFix( str )
{
	return str.replace(/[^a-zA-Z0-9]/g, "");
}

function updateSearches()
{
	numeratorSearch = [];
	
	$("#addCardDynamic").children().each(function() {
		if( $(this).find(".addCardDynamicSelectWrapper > select").length )
		{
			numeratorSearch.push( $(this).find(".addCardDynamicSelectWrapper > select > option:selected").val() );
		}
		else if( $(this).find(".addCardDynamicPillGroup").length )
		{
			numeratorSearch.push( $(this).find(".addCardDynamicPillGroup > li.active").text() );
		}
		else if( $(this).find(".addCardDynamicSlider").length )
		{
			numeratorSearch.push( $(this).find(".addCardDynamicRow > label:last-of-type").text() );
		}
	});
	
	if( !isObject( last( numeratorSearch ) ) ) {
		numeratorSearch[ numeratorSearch.length - 1 ] = { "year": last( numeratorSearch ) };
	}
	
	denominatorSearch = numeratorSearch.slice(-1);
	//console.log( "Num Search: ", numeratorSearch );
	//console.log( "Denom Search: ", denominatorSearch );
}

function getDistinctSet( tree, attr, jsonFilter )
{
	var i = 0,
		set = {},
		filter = typeof jsonFilter !== "undefined" ? jsonFilter : {};
	
	var f = function( root, filter ) {
		var nTT_type = root.publicMetadata.entityType;
		
		if( nTT_type == "column" )
		{
			var keys = Object.keys( filter );
			for( var key in keys )
			{
				if( root.publicMetadata[ keys[key] ] != filter[ keys[key] ] )
					return;
			}
			set[ root.publicMetadata[ attr ] ] = 1;
			return;
		}
		
		for( i = 0; i < root.children.length; ++i )
			f( root.children[ i ], filter );
	};
	f( tree, filter );
	return Object.keys( set );
}

function createDynamicCombobox( tree, callback ) 
{
	var rowID = "#addCard" + safeFix(tree.publicMetadata.type) + safeFix(tree.publicMetadata.header),
		selectorPath = rowID + " > .addCardDynamicSelectWrapper > select",
		childNames = [],
		html = 	'<div id="' + rowID.substr(1) + '" class="addCardDynamicRow">' +
					'<label>' + tree.publicMetadata.header + '</label>' +
					'<div class="addCardDynamicSelectWrapper">' +
						'<select>';
						
	for( var i = 0; i < tree.children.length; i++ )
	{
		var child = tree.children[i];
		var label = child.publicMetadata.year || child.publicMetadata.label || child.publicMetadata.title;
		childNames.push( label );
		html += ( '<option value="' + child.publicMetadata.title + '">' + label + '</option>' );
	}
	html += ( '</select></div></div>' );
	
	var o = {
			rowID: rowID,
			selectorPath: selectorPath,
			childNames: childNames,
			html: html
		};
	if( typeof callback !== "undefined" )
		callback( o );
}
function createDynamicPillGroup( tree, callback )
{
	var rowID = "#addCard" + safeFix(tree.publicMetadata.type) + safeFix(tree.publicMetadata.header),
		pillPath = rowID + " > .addCardDynamicPillGroup",
		childNames = [],
		html = 	'<div id="' + rowID.substr(1) + '" class="addCardDynamicRow">' +
					'<label>' + tree.publicMetadata.header + '</label>' +
					'<ul class="addCardDynamicPillGroup">';
	
	for( var i = 0; i < tree.children.length; i++ )
	{
		var child = tree.children[i];
		var label = child.publicMetadata.year || child.publicMetadata.label || child.publicMetadata.title;
		childNames.push( label );
		html += ( '<li><a href="#" value="' + child.publicMetadata.title + '">' + label + '</a></li>' );
	}
	html += ( '</ul></div>' );
	
	var o = {
			rowID: rowID,
			pillPath: pillPath,
			childNames: childNames,
			html: html
		};
	if( typeof callback !== "undefined" )
		callback( o );
}
function createDynamicSlider( tree, callback )
{
	var rowID = "#addCard" + safeFix(tree.publicMetadata.type) + safeFix(tree.publicMetadata.header),
		sliderPath = rowID + " > .addCardDynamicSlider",
		labelPath = rowID + " > label:last-of-type",
		childLabels = [], childValues = [],
		html = 	'<div id="' + rowID.substr(1) + '" class="addCardDynamicRow">' +
					'<label>' + tree.publicMetadata.header + '</label>' +
					'<label></label>' +
					'<div class="addCardDynamicSlider">' +
						'<label></label>' +
						'<label></label>' +
					'</div>' +
				'</div>';
	for( var i = 0; i < tree.children.length; i++ ) {
		var child = tree.children[i];
		var label = child.publicMetadata.year || child.publicMetadata.label || child.publicMetadata.title;
		childLabels.push( label );
		childValues.push( child.publicMetadata.title );
	}
	
	var o = {
			rowID: rowID,
			sliderPath: sliderPath,
			labelPath: labelPath,
			childLabels: childLabels,
			childValues: childValues,
			html: html
		};
	if( typeof callback !== "undefined" )
		callback( o );
}

