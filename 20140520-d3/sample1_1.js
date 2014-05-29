var width = 900, height = 650;
var svg = null;
var datas = null;
$(function() {

	svg = d3.select("#view").append("svg")  // <div id="view">Ι<svg>πΗΑ
		.attr("width", width)
		.attr("height", height);

	datas = [
		{ "cx": 100, "cy": 100, "color": "#0000ff",},       // Β
		{ "cx": 200, "cy": 100, "color": "#ffff00",},       // ©
		{ "cx": 300, "cy": 100, "color": "#ff0000",},       // Τ
	];

	svg.selectAll(".node")      //  <circle class="node">πIπ
		.data(datas).enter()        // f[^ΜͺπΞΫ
		.append("circle")           // svgΜcircleπΗΑ
		.attr("class", "node")
		.attr("cx", function(d) { return d.cx; })           // ~ΜS
		.attr("cy", function(d) { return d.cy; })           // ~ΜS
		.attr("r", 30)                                      // ~ΜΌa
		.style("stroke", function(d) { return "#000000"; }) // gόΜF
		.style("fill", function(d) { return d.color; })     // hθΒΤ΅ΜF
		.on('click', function(d) {
			console.log(d);
		})
		;

});
