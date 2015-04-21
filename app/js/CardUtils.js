// Hover Events
function cardHoverIn()
{
	$(this).find(".controls a").show();
}
function cardHoverOut()
{
	$(this).find(".controls a").hide();
}


// Modal
function loadModal( id )
{
	$(".modal-backdrop").show();
	$(".modal-backdrop").animate({opacity: "0.9"}, 500);
	$("#modal").animate({top: "5%", opacity: "1"}, 500);

	$(".modal-header h3").html("");
	
	if( typeof id !== "undefined" ) {
		$("#modal-body-weave").css({"z-index": 1065});
		$("#modal-body-add").css({"z-index": 1060});
		
		var whenWeaveIsReady = function( response ) {
			var json = JSON.parse(response);
			cardInModal = json;
			
			$(".modal-header h3").html(json.title);
			$("#pill" + json.lastTool + " > a").click();
			
			console.log( response );
		};
		
		postAsync(
			"servlet/getCard.php",
			{ "id": id },
			function( response ) {
				var f = function() {
					if( weaveIsReady )
						whenWeaveIsReady( response );
					else
						setTimeout(f, 400);
				};
				f();
			}
		);
	} else {
		$("#modal-body-add").css({"z-index": 1065});
		$("#modal-body-weave").css({"z-index": 1060});
		
		$(".modal-header h3").html("Add A Card");
		$("#ageSlider > label:first").html( first( ages ) );
		$("#ageSlider > label:last").html( last( ages ) );
	}
}
function flipCard(caller, flipToBack)
{
	var card = $(caller).parents(".card"),
		id = card.find(".hiddenID").val(),
		flipToBack = (flipToBack === "undefined") ? true : flipToBack;
	
	if( flipToBack ) {
		card.addClass("flipped");
	} else {
		card.removeClass("flipped");
	}
}





function createFrontFace( o )
{
	var percent = o.numeratorVal * 100 / o.target;
	var level = "success";
	
	if( o.disposition == 0 )
	{
		if( percent > 75 )		level = "danger";
		else if( percent > 50 )	level = "warning";
		else					level = "success";
	} else {
		if( percent > 75 )		level = "success";
		else if( percent < 40 )	level = "danger";
		else					level = "warning";
	}
	
	return  '<div class="tile face front">' +
				'<h3>' + o.title + '</h3>' + 
				'<h5>Race:</h5>' +
				'<h5>Gender:</h5>' +
				'<h5>Year:</h5>' +
				'<div class="goal">' + 
					'<span class="value ' + level + '">' + o.numeratorVal + ' ' + o.numerator_unit + '</span>' +
					'<div class="progress">' +
						'<div class="bar bar-' + level + '" style="width:' + percent + '%;"></div>' +
					'</div>' +
					'<span class="limit">' + o.target + ' ' + o.target_unit + '</span>' +
				'</div>' + 
				'<div class="controls">' +
					'<a class="gear flipper" title="Edit Goal" href="#"></a>' +
					'<a class="link" title="Analyze Card" href="#"></a>' +
				'</div>' +
			'</div>';
}
function createBackFace( o )
{
	return  '<div class="tile face back">' +
				'<label>' + o.title + ' goal:</label>' +
				'<div class="value">' +
					'<input type="text" value="' + o.target + '" />' +
					'<span class="append">' + o.target_unit + '</span>' +
				'</div>' +
				'<a href="#" class="remove">Remove Goal</a>' +
				'<a href="#" class="btn save">Save</a>' +
			'</div>';
}
function createCard( o )
{
	cardHashMap[ o.id ] = o;
	return  '<div class="card">' + 
				'<input class="hiddenID" type="hidden" value="' + o.id + '" />' +
				'<input class="hiddenNum" type="hidden" value="' + o.numeratorEntityId + '" />' +
				'<input class="hiddenDenom" type="hidden" value="' + o.denominatorEntityId + '" />' +
				createFrontFace( o ) + 
				createBackFace( o ) +
			'</div>';
}
function createEmptyCard()
{
	return  '<div class="card tile add">' + 
				'<div class="plus"></div>' +
				'<h3>Add a Card</h3>' +
			'</div>';
}

function loadCardsWrapper()
{
	console.log( "loadCardsWrapper()" );
	loadCards(
		1,
		"3d801aa532c1cec3ee82d87a99fdf63f",
		function() {
			$(".tile.face.front").hover( cardHoverIn, cardHoverOut );
			$(".tile.face.front, .tile.add").click(function(e) {
				loadModal( $(this).parents(".card").find(".hiddenID").val() );
			});
			
			$(".flipper").click(function(e) {
				e.stopImmediatePropagation();
				flipCard(this, $(this).parents(".front").length > 0);
			});
			$(".link").click(function(e) {
				e.stopImmediatePropagation();
				
				var id = $(this).parents(".card").find(".hiddenID").val(),
					hash = "c4ca4238a0b923820dcc509a6f75849b";
					
				window.location = "/chr/explore.php?id=" + id + "&hash=" + hash;
			});
			$("a.remove").click(function(e) {
				var thisID = $(this).parents(".card").find(".hiddenID").val(),
					o = { 
							id: thisID,
							cardHash: "c4ca4238a0b923820dcc509a6f75849b"
						};
				
				removeCard( o, function() {
					loadCardsWrapper();
				});
			});
			$("a.save").click(function(e) {
				var $saveBtn = $(this);
					thisID = $(this).parents(".card").find(".hiddenID").val(),
					newTarget = $(this).parents(".tile.face.back").find(".value > input[type='text']").val(),
					o = {
							id: thisID,
							cardHash: "c4ca4238a0b923820dcc509a6f75849b",
							target: newTarget
						};
				
				editCard( o, function() {
					flipCard( $saveBtn, false );
					setTimeout(function() {
						loadCardsWrapper();
					}, 1000);
				});
			});
			
			// Apply card metadata
			$(".card:not(.add)").each(function() {
				var $scope = $(this),
					$items = $scope.find("h5"),
					cardID = $scope.find(".hiddenID").val();
				
				postAsync(
					"servlet/getCard.php",
					{ id: cardID },
					function( result ) {
						console.log( "RESULT: ", result );
						var i = 0,
							json = JSON.parse( result ),
							sqlFilter = toArray( json.sqlFilter ).slice(1);
						console.log( "JSON: ", json );
						
						getEntityTree(
							baseHost + dataSrv,
							json.numerator,
							function( tree ) {
								console.log( "TREEEE: ", tree );
								sqlFilter.push( tree.publicMetadata.year );
									
								$.each( $items, function( i, e ) {
									$(e).append( " &nbsp;&nbsp;" + sqlFilter[i++] );
								});
							}
						);
					}
				);
			});
			setTimeout(function() {
				$("#cards > .card").tsort(".hiddenID");
			}, 1000);
		}
	);
}
function loadCards( id, pass, callback )
{
	console.log( "loadCards()" );
	postAsync(
		"servlet/getUserCards.php",
		{ "id": id, "pass": pass },
		function( response )
		{
			var json = JSON.parse( response );
			var loopCount = 0;
			console.log( "JSON response: ", json );
			$("#cards").html("");
			for( var index in json ) 
			{
				loopCount++;
				(function( o, l ) {
					
					if( typeof o.keyFilter === "undefined" )
						o.keyFilter = "";
					
					var keySet = o.keyFilter.split(",").slice(1),
						sqlFilter = toArray( o.sqlFilter );
						
					if( o.sqlFilter === "undefined" )
						return;
					
					queryService(
						baseHost + dataSrv,
						"getColumn",
						[parseInt(o.numerator), null, null, sqlFilter], 
						function( num_result ) { 
							
							queryService(
								baseHost + dataSrv,
								"getColumn",
								[parseInt(o.denominator), null, null, sqlFilter], 
								function( denom_result ) {
									
									loopCount--;
									
									// Filter
									var num_filtered = [],
										denom_filtered = [],
										numKeys = num_result.keys,
										numData = num_result.data,
										denomKeys = denom_result.keys,
										denomData = denom_result.data;
									
									if( keySet.length == 0 ) {
										num_filtered = numData;
										denom_filtered = denomData;
									} else {
										for( var i in keySet ) {
											if( inArray( numKeys, keySet[i] ) )
												num_filtered.push( numData[i] );
											if( inArray( denomKeys, keySet[i] ) )
												denom_filtered.push( denomData[i] );
										}
									}
									
									// Combine
									var numeratorVal = num_filtered.reduce(function(a, b) { return a + b; }),
										denominatorVal = denom_filtered.reduce(function(a, b) { return a + b; });
									
									if( o.target_type == "Average" ) {
										numeratorVal /= num_filtered.length;
										denominatorVal /= denom_filtered.length;
										numeratorVal = numeratorVal.toFixed(1);
										denominatorVal = denominatorVal.toFixed(1);
									}
									
									/*
									console.log(" ");
									console.log( "----- Numerator -----");
									console.log( "Unfiltered: ", numData );
									console.log( "Filtered: ", num_filtered );
									console.log( "Sum: ", numeratorVal );
									console.log(" ");
									console.log( "----- Denominator -----");
									console.log( "Unfiltered: ", denomData );
									console.log( "Filtered: ", denom_filtered );
									console.log( "Sum: ", denominatorVal );
									*/
									var newObj = { 
										"id": o.id,
										"title": o.title,
										"numeratorVal": numeratorVal,
										"numeratorEntityId": o.numerator,
										"denominatorVal": denominatorVal,
										"denominatorEntityId": o.denominator,
										"numerator_unit": o.numerator_unit,
										"denominator_unit": o.denominator_unit,
										"target": o.target,
										"target_type": o.target_type,
										"target_unit": o.target_unit,
										"disposition": o.disposition
									};
									
									$(createCard( newObj )).appendTo("#cards");
								});
						});
				})( json[index], loopCount );
			}
			
			
			var createNewCardFunction = function() {
				if( loopCount != 0 ) {
					setTimeout(function() {
						createNewCardFunction();
					}, 200);
					return;
				}
				$(createEmptyCard()).appendTo("#cards");
				if( typeof callback !== "undefined" )
					callback();
			};
			setTimeout(function() {
				createNewCardFunction();
			}, 200);
		}
	);
}
function createNewCard( o, callback )
{
	postAsync(
		"servlet/addCard.php",
		o,
		function( response ) {
			if( typeof callback !== "undefined" )
				callback();
		}
	);
}
function editCard( o, callback )
{
	postAsync(
		"servlet/editCard.php",
		o,
		function( response ) {
			if( typeof callback !== "undefined" )
				callback();
		}
	);
}
function removeCard( o, callback ) 
{
	postAsync(
		"servlet/removeCard.php",
		o,
		function( response ) {
			if( typeof callback !== "undefined" )
				callback();
		}
	);
}
