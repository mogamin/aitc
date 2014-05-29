var width = 900, height = 650;
var svg = null;
var datas = null;
$(function() {

	svg = d3.select("#view").append("svg")  // <div id="view">に<svg>を追加
		.attr("width", width)
		.attr("height", height);

	datas = [
		{ "cx": 100, "cy": 100, "color": "#0000ff",},       // 青
		{ "cx": 200, "cy": 100, "color": "#ffff00",},       // 黄
		{ "cx": 300, "cy": 100, "color": "#ff0000",},       // 赤
	];

	svg.selectAll(".node")      //  <circle class="node">を選択
		.data(datas).enter()        // データの増分を対象
		.append("circle")           // svgのcircleを追加
		.attr("class", "node")
		.attr("cx", function(d) { return d.cx; })           // 円の中心
		.attr("cy", function(d) { return d.cy; })           // 円の中心
		.attr("r", 30)                                      // 円の半径
		.style("stroke", function(d) { return "#000000"; }) // 枠線の色
		.style("fill", function(d) { return d.color; })     // 塗りつぶしの色
		;

});

function btn1(){
	// データの内容を変更
	datas[0].color = "#000000";

	svg.selectAll(".node")      //  <circle class="node">を選択
		.data(datas)			// 全データを対象に
		.style("fill", function(d) { return d.color; })     // 塗りつぶしの色
}

function btn2(){
	// データを追加
	datas.push({ "cx": 400, "cy": 100, "color": "#00ffff",});
	
	svg.selectAll(".node")      //  <circle class="node">を選択
		.data(datas).enter()        // データの増分を対象
		.append("circle")           // svgのcircleを追加
		.attr("class", "node")
		.attr("cx", function(d) { return d.cx; })           // 円の中心
		.attr("cy", function(d) { return d.cy; })           // 円の中心
		.attr("r", 30)                                      // 円の半径
		.style("stroke", function(d) { return "#000000"; }) // 枠線の色
		.style("stroke-width", "3px") 						// 枠線の太さ
		.style("fill", function(d) { return d.color; })     // 塗りつぶしの色
		;
}

function btn3(){
	// データを削除
	var d = datas.pop();
	
	svg.selectAll(".node")      //  <circle class="node">を選択
		.data(datas).exit()        // データの減分を対象
		.remove()
		;
}
