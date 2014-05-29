var width = 900, height = 650;
var svg = null;
var datas = null;
$(function() {

	svg = d3.select("#view").append("svg")  // <div id="view">��<svg>��ǉ�
		.attr("width", width)
		.attr("height", height);

	datas = [
		{ "cx": 100, "cy": 100, "color": "#0000ff",},       // ��
		{ "cx": 200, "cy": 100, "color": "#ffff00",},       // ��
		{ "cx": 300, "cy": 100, "color": "#ff0000",},       // ��
	];

	svg.selectAll(".node")      //  <circle class="node">��I��
		.data(datas).enter()        // �f�[�^�̑�����Ώ�
		.append("circle")           // svg��circle��ǉ�
		.attr("class", "node")
		.attr("cx", function(d) { return d.cx; })           // �~�̒��S
		.attr("cy", function(d) { return d.cy; })           // �~�̒��S
		.attr("r", 30)                                      // �~�̔��a
		.style("stroke", function(d) { return "#000000"; }) // �g���̐F
		.style("fill", function(d) { return d.color; })     // �h��Ԃ��̐F
		.on('click', function(d) {
			console.log(d);
		})
		;

});
