//Width and height
var w = 346;
var h = 130;

var svg = d3.select("#map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Define tennessee counties to filter by
var tn_counties = d3.set([
  "47001", "47003","47005", "47007", "47009", 
  "47011", "47013", "47015", "47017", "47019", 
  "47021", "47023", "47025", "47027", "47029", 
  "47031", "47033", "47035", "47037", "47039", 
  "47041", "47043", "47045", "47047", "47049", 
  "47051", "47053", "47055", "47057", "47059", 
  "47061", "47063", "47065", "47067", "47069", 
  "47071", "47073", "47075", "47077", "47079", 
  "47081", "47083", "47085", "47087", "47089", 
  "47091", "47093", "47095", "47097", "47099", 
  "47101", "47103", "47105", "47107", "47109", 
  "47111", "47113", "47115", "47117", "47119", 
  "47121", "47123", "47125", "47127", "47129", 
  "47131", "47133", "47135", "47137", "47139", 
  "47141", "47143", "47145", "47147", "47149", 
  "47151", "47153", "47155", "47157", "47159", 
  "47161", "47163", "47165", "47167", "47169", 
  "47171", "47173", "47175", "47177", "47179", 
  "47181", "47183", "47185", "47187", "47189"
]);

//Define map projection
var projection = d3.geo.albers() 
    .translate([w / 2, h / 2]) 
    .scale(2700) 
    .rotate([86, 0]) 
    .center([0, 36]);   

//Define path generator
var path = d3.geo.path().projection(projection);
         
//Define quantize scale to sort data values into buckets of color
var quantize = d3.scale.quantize()
    .range(["#185D8B", "#2980B9", "#3498db", "#86C2EA"])
    .domain([0, 100]);

d3.json("js/data/us.json", function(data) {
  
  //Filter TN counties 
  var counties = topojson.feature(data, data.objects.counties)
      .features.filter(function(d) { 
        return tn_counties.has(d.id); 
      });
  
  svg.append("g")
     .attr("class", "counties")
     .selectAll("path")
     .data(counties)
     .enter().append("path")
     .attr("d", path)
     .style("fill", function(d) {
      return quantize(Math.floor((Math.random()*100)+1));
     })
    .on("click", clicked)
    .on("mouseover", showpopup)
    .on("mouseout", hidepopup);
});

function clicked(d) {
  var active = d3.select(this).classed("active");
  d3.select(this).classed("active", !active);
}

function showpopup(d) {
  d3.select(".map-popup")
    .style("left", (d3.event.pageX) - 103 + "px")     
    .style("top", (d3.event.pageY + 25) + "px")
    .select("h3").html(d.id);

  d3.select(".map-popup").classed("active", true);
}

function hidepopup(d) {
  //Hide the tooltip
  d3.select(".map-popup").classed("active", false);
}