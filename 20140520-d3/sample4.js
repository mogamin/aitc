var width = 900, height = 650;
var svg = null;

var rainPoints = null;
var rainDatas = null;
$(function() {
	// 雨量観測局情報
	var rainPointsCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Shizuoka_Rain_ObservationPoint_utf8.csv",
//		url: "./Shizuoka_Rain_ObservationPoint_utf8.csv",
		async: false			// 同期通信
	}).responseText;
	// CSVをJavaScriptのArrayに変換
	rainPoints = csvToArray(rainPointsCsv);

	// 雨量情報
	var rainDatasCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Rain/20140430/0000.csv",
//		url: "./Rain/20140430/0000.csv",
		async: false			// 同期通信
	}).responseText;
	// CSVをJavaScriptのArrayに変換
	var tmp = csvToArray(rainDatasCsv);
	// アクセスが楽になるように、連想配列風にする
	rainDatas = new Object();
	for (i = 0 ; i < tmp.length ; i++){
		var data = tmp[i];
		rainDatas[data["point_id"]] = data;
	}
	
	// 雨量観測局データに雨量をマージする
	var points = JSON.parse(JSON.stringify(rainPoints));	// ディープコピー
	// 観測局データに、10分雨量をマージ
	for (var i = 0 ; i < points.length ; i++){
		var point = points[i];
		if (point["point_id"] == undefined || rainDatas[point["point_id"]] == undefined) continue;
		point["rain_10min"] = rainDatas[point["point_id"]]["rain_10min"];
	}

/*	// デバッグ表示
	$("#view").html("<pre>" 
	+ "--------------------------------------\n"
	+ $('<div>').text(JSON.stringify(points, null, 2)).html()
	+ "</pre>");
*/

	svg = d3.select("#view").append("svg")  // <div id="view">に<svg>を追加
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", "0 0 40000 30000")	// 座標データの最小値と幅（最大値－最小値）
		;	// viewBoxは、svgの機能 http://www.hcn.zaq.ne.jp/___/SVG11-2nd/coords.html#ViewBoxAttribute

	svg.selectAll(".node")      //  <circle class="node">を選択
		.data(points).enter()        // データの増分を対象
		.append("circle")           // svgのcircleを追加
		.attr("class", "node")
		.attr("cx", function(d) { return (d.longitude - 1370000); })    // 円の中心
		.attr("cy", function(d) { return (360000 - d.latitude); })      // 円の中心
		.attr("r", 200)                                      // 円の半径
		.style("stroke", function(d) { return "#000000"; }) // 枠線の色
		.style("stroke-width", "20px") 						// 枠線の太さ
		.style("fill", function(d) {						// 塗りつぶしの色
			if (d.rain_10min == 0 || d.rain_10min == "-1111111111" || d.rain_10min == "9999"){
				return "#ffffff";		// 白
			} else {
				// console.log(d);
				return "#0000ff";
			}
		})
		;
});


// 簡易版CSV→Array変換
// １行目はヘッダ
function csvToArray(csv){
	var array = new Array();

	var lines = csv.split("\n");
	var headers = lines[0].split(",");
	for (var i = 1 ; i < lines.length ; i++){
		var cols = lines[i].split(",");
		if (cols.length <= 1) continue;
		var json = new Object();
		for (var j = 0 ; j < cols.length ; j++){
			json[headers[j]] = cols[j];
		}
		array.push(json);
	}

	return array;
}
