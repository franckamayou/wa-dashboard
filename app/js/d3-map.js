//Width and height
var w = 346;
var h = 220;

//Define map projection
var projection = d3.geo.albers() 
  .translate([w / 2, h / 2]) 
  .scale(38500) 
  .rotate([90, 0])
  .center([0, 35.145]);

//Define path generator
var path = d3.geo.path().projection(projection);

var d3_map = function(container, type) {

  d3.select(container + " svg").remove();
  var svg = d3.select(container)
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  d3.json("js/data/shelby-zips.json", function(data) {    
    var adapter = getAdapter(type);
    adapter.fill(svg, data);
  });

  function getAdapter(type) {
    switch(type) {
      case 'size':
        return new bubble();
        break;
      case 'change':
        return new direction();
        break;
      default:
        return new choropleth();
    }
  }
}

function bubble() {
  this.fill = fill;

  function fill(svg, data) {  
    var g = svg.append("g").attr("class", "counties size");

    g.selectAll("path")
     .data(topojson.feature(data, data.objects.zips).features)
     .enter()
     .append("path")
     .attr("d", path)
     .style("fill", "#E2E2E2");

    g.selectAll("circle")
     .data(topojson.feature(data, data.objects.zips).features)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return path.centroid(d)[0];
     })
     .attr("cy", function(d) {
       return path.centroid(d)[1];
     })
     .attr("r", function(d) {
      return Math.floor((Math.random()*13)+3);
     })
     .style("fill", "#3498db")
     .style("opacity", 0.75);
  }
}

function choropleth() {
  this.fill = fill;

  function fill(svg, data) {
    //Define quantize scale to sort data values into buckets of color
    var quantize = d3.scale.quantize()
        .range(["#86C2EA", "#3498db", "#2980B9", "#185D8B"])
        .domain([0, 100]);

    svg.append("g")
       .attr("class", "counties results")
       .selectAll("path")
       .data(topojson.feature(data, data.objects.zips).features)
       .enter().append("path")
       .attr("d", path)
       .style("fill", function(d) {
        return quantize(Math.floor((Math.random()*100)+1));
       })
       .on("click", clicked)
       .on("mouseover", showpopup)
       .on("mouseout", function() { return popup(false) });
  }

  function clicked(d) {
    var active = d3.select(this).classed("active");
    d3.select(this).classed("active", !active);
  }

  function showpopup(d) {
    d3.select(".map-popup")
      .style("left", (d3.event.pageX) - 75 + "px")     
      .style("top", (d3.event.pageY + 25) + "px")
      .select("h3").html(d.id);
    
    popup(true);
  }

  function popup(active) {
    d3.select(".map-popup").classed("active", active);
  }  
}

function direction() {
  this.fill = fill;

  function fill(svg, data) {  
    svg.append("marker")
    .attr("id", "triangle")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 0)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("markerUnits", "strokeWidth")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .style("fill", "#E74C3C");

    var g = svg.append("g").attr("class", "counties change");

    g.selectAll("path")
     .data(topojson.feature(data, data.objects.zips).features)
     .enter()
     .append("path")
     .attr("d", path)
     .style("fill", "#E2E2E2");

    g.selectAll("line")
     .data(topojson.feature(data, data.objects.zips).features)
     .enter()
     .append("line")
     .attr("x1", function(d) {
       return path.centroid(d)[0];
     })
     .attr("y1", function(d) {
       return path.centroid(d)[1];
     })
     .attr("x2", function(d) {
       return path.centroid(d)[0] + Math.floor((Math.random()*8)+3);
     })
     .attr("y2", function(d) {
       return path.centroid(d)[1] - Math.floor((Math.random()*8)+3);
     })
     .attr("marker-end", "url(#triangle)")
     .style("stroke", "#E74C3C")
  }}