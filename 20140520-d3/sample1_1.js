var width = 900, height = 650;
var svg = null;
var datas = null;
$(function() {

	svg = d3.select("#view").append("svg")  // <div id="view">‚É<svg>‚ğ’Ç‰Á
		.attr("width", width)
		.attr("height", height);

	datas = [
		{ "cx": 100, "cy": 100, "color": "#0000ff",},       // Â
		{ "cx": 200, "cy": 100, "color": "#ffff00",},       // ‰©
		{ "cx": 300, "cy": 100, "color": "#ff0000",},       // Ô
	];

	svg.selectAll(".node")      //  <circle class="node">‚ğ‘I‘ğ
		.data(datas).enter()        // ƒf[ƒ^‚Ì‘•ª‚ğ‘ÎÛ
		.append("circle")           // svg‚Ìcircle‚ğ’Ç‰Á
		.attr("class", "node")
		.attr("cx", function(d) { return d.cx; })           // ‰~‚Ì’†S
		.attr("cy", function(d) { return d.cy; })           // ‰~‚Ì’†S
		.attr("r", 30)                                      // ‰~‚Ì”¼Œa
		.style("stroke", function(d) { return "#000000"; }) // ˜gü‚ÌF
		.style("fill", function(d) { return d.color; })     // “h‚è‚Â‚Ô‚µ‚ÌF
		.on('click', function(d) {
			console.log(d);
		})
		;

});
