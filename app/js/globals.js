
var baseHost = "http://demo.oicweave.org/";
//var baseHost = "http://localhost:8080/";
var dataSrv = "WeaveServices/DataService";
var defaultSession = "Memphis_Empty.weave";
var analystSession = "Memphis_Analyst_Empty.weave";

var cardInModal = {};
var cardHashMap = {};

var weaveIsReady = false;

var numeratorEntityID = 265271; //217166;
var denominatorEntityID = 265272; //215963;

var geometryColumnID = 215512;
var zipColumnID = 255625;

var numeratorSearch = [];
var denominatorSearch = [];

var ages = [
	"Under 1",
	"1 to 4",
	"5 to 9",
	"10 to 14",
	"15 to 19",
	"20 to 24",
	"25 to 29",
	"30 to 34",
	"35 to 39",
	"40 to 44",
	"45 to 49",
	"50 to 54",
	"55 to 59",
	"60 to 64",
	"65 to 69",
	"70 to 74",
	"75 to 79",
	"80 to 84",
	"85+"
];


// Tools that you want to use
var tools = {
	"MapTool" : {
		"id" : 1,
		"color": ["children","visualization","plotManager","plotters","Geometries"]
	},
	"TableTool": {
		"id": 2,
		"color": null
	},
	"CompoundBarChartTool": {
		"id": 4,
		"color": [ ]
	},
	"LineChartTool": {
		"id": 8,
		"color": [ ]
	}
};

var customGlyphLines = "// Parameter types: Array, IBounds2D, IBounds2D, BitmapData					\
\nfunction(keys, dataBounds, screenBounds, destination)							\
\n{																				\
\n	import 'weave.data.AttributeColumns.DynamicColumn';							\
\n	import 'weave.utils.GraphicsBuffer';										\
\n																				\
\n	var getStats = WeaveAPI.StatisticsCache.getColumnStatistics;				\
\n	var colorColumn = vars.requestObject('color', DynamicColumn, false);		\
\n	var sizeColumn = vars.requestObject('size', DynamicColumn, false);			\
\n	var sizeStats = getStats(sizeColumn);										\
\n	var buffer = locals.buffer || (locals.buffer = new GraphicsBuffer());		\
\n	var key;																	\
\n	var lastPoint = null;														\
\n																				\
\n	colorColumn.globalName = 'defaultColorColumn';								\
\n	buffer.destination(destination)												\
\n		.lineStyle(2, 0x000000, 0.5); // weight, color, alpha					\
\n																				\
\n	for each (key in keys)														\
\n	{																			\
\n		getCoordsFromRecordKey(key, tempPoint); // uses dataX,dataY				\
\n		// project x,y data coordinates to screen coordinates					\
\n		dataBounds.projectPointTo(tempPoint, screenBounds);						\
\n																				\
\n		if (isNaN(tempPoint.x) || isNaN(tempPoint.y))							\
\n			continue;															\
\n																				\
\n		var x = tempPoint.x, y = tempPoint.y;									\
\n		var size = 20 * sizeStats.getNorm(key);									\
\n		var color = colorColumn.getValueFromKey(key, Number);					\
\n																				\
\n		// draw graphics														\
\n		if (isFinite(color))													\
\n			buffer.beginFill(color, 1.0); // color, alpha						\
\n																				\
\n		size = 10;																\
\n		if( lastPoint != null )													\
\n			buffer.lineTo( tempPoint.x, tempPoint.y );							\
\n																				\
\n		buffer.moveTo( tempPoint.x, tempPoint.y );								\
\n		buffer.endFill();														\
\n																				\
\n		lastPoint = tempPoint;													\
\n	}																			\
\n	buffer.flush();																\
\n}";