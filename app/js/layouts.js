
// Each tool that is available in the session state has
// a unique ID number. These numbers are used in combination 
// with the tools that actually exist in the session state 
// to make a bitwise OR index value.

// This index value will be used to get the appropriate
// layout to apply to the session state.

var layouts = [
	{
		// 0 - No Tools
	},
	{
		// 1 - Only MapTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "100%",
			"panelHeight": "85%"
		}
	},
	{
		// 2 - Only TableTool
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "100%",
			"panelHeight": "85%"
		}
	},
	{
		// 3 - MapTool + TableTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "100%",
			"panelHeight": "50%"
		},
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "50%",
			"panelWidth": "100%",
			"panelHeight": "50%"
		}
	},
	{
		// 4 - Only CompoundBarChartTool
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "100%",
			"panelHeight": "85%"
		}
	},
	{
		// 5 - MapTool + CompoundBarChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "50%",
			"panelHeight": "85%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "50%",
			"panelY": "15%",
			"panelWidth": "50%",
			"panelHeight": "85%"
		}
	},
	{
		// 6 - CompoundBarChartTool + TableTool
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "75%",
			"panelHeight": "100%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "0%",
			"panelWidth": "25%",
			"panelHeight": "100%"
		}
	},
	{
		// 7 - MapTool + TableTool + CompoundBarChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "40%",
			"panelHeight": "45%"
		},
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "60%",
			"panelWidth": "100%",
			"panelHeight": "40%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "40%",
			"panelY": "15%",
			"panelWidth": "60%",
			"panelHeight": "45%"
		}
	},
	{
		// 8 - Only LineChartTool
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "100%",
			"panelHeight": "85%"
		}
	},
	{
		// 9 - MapTool + LineChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "75%",
			"panelHeight": "100%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "0%",
			"panelWidth": "25%",
			"panelHeight": "100%"
		}
	},
	{
		// 10 - TableTool + LineChartTool
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "75%",
			"panelHeight": "100%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "0%",
			"panelWidth": "25%",
			"panelHeight": "100%"
		}
	},
	{
		// 11 - MapTool + TableTool + LineChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "75%",
			"panelHeight": "50%"
		},
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "50%",
			"panelWidth": "100%",
			"panelHeight": "50%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "0%",
			"panelWidth": "25%",
			"panelHeight": "50%"
		}
	},
	{
		// 12 - CompoundBarChartTool + LineChartTool
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "50%",
			"panelHeight": "100%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "50%",
			"panelY": "0%",
			"panelWidth": "50%",
			"panelHeight": "100%"
		}
	},
	{
		// 13 - MapTool + CompoundBarChartTool + LineChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "40%",
			"panelHeight": "40%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "55%",
			"panelWidth": "100%",
			"panelHeight": "45%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "40%",
			"panelY": "15%",
			"panelWidth": "60%",
			"panelHeight": "40%"
		}
	},
	{
		// 14 - TableTool + CompoundBarChartTool + LineChartTool
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "0%",
			"panelWidth": "75%",
			"panelHeight": "100%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "50%",
			"panelWidth": "25%",
			"panelHeight": "50%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "75%",
			"panelY": "0%",
			"panelWidth": "25%",
			"panelHeight": "50%"
		}
	},
	{
		// 15 - MapTool + TableTool + CompoundBarChartTool + LineChartTool
		"MapTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "15%",
			"panelWidth": "40%",
			"panelHeight": "40%"
		},
		"TableTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "40%",
			"panelY": "15%",
			"panelWidth": "60%",
			"panelHeight": "40%"
		},
		"CompoundBarChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "0%",
			"panelY": "55%",
			"panelWidth": "40%",
			"panelHeight": "45%"
		},
		"LineChartTool" : {
			"minimized": false,
			"maximized": false,
			"panelX": "40%",
			"panelY": "55%",
			"panelWidth": "60%",
			"panelHeight": "45%"
		}
	}
];