var rainPoints = null;
var rainDatas = null;


$(function() {
	var g,
		width = 900,
		height = 650;

	// svg要素を作成し、データの受け皿となるg要素を追加している
	map = d3.select('#map').append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g');

	// 地図データを読み込む    
	d3.json("http://aramoto.sakura.ne.jp/shizuoka2/gis/shizuoka_utf8.json", function(json) {
//	d3.json("./gis/shizuoka_utf8.json", function(json) {
			var projection,
				 path;

	// 投影を処理する関数を用意する。データからSVGのPATHに変換するため。
	projection = d3.geo.mercator()
					.scale(15000)
					.center(d3.geo.centroid(json))  // データから中心点を計算
					.translate([width / 2, height / 2]);

	// pathジェネレータ関数
	path = d3.geo.path().projection(projection);
	//  これがenterしたデータ毎に呼び出されpath要素のd属性に
	//  geoJSONデータから変換した値を入れる                

	map.selectAll('path')
	.data(json.features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr("fill", function(d){
		// 適当に色を塗るなど
		return "hsl(0,0%,80%)";
	})
	.attr("stroke","hsl(80,100%,0%)" )
	.on('mouseover', function(d){
		// mouseoverの時のインタラクション
		console.log(d);
	})
	.on('click', function(d) {
		// clickされた時のインタラクション
		console.log(d);
	});



	// 雨量観測局情報
	var rainPointsCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Shizuoka_Rain_ObservationPoint_utf8.csv",
//		url: "./Shizuoka_Rain_ObservationPoint_utf8.csv",
		async: false			// 同期通信
	}).responseText;
	// CSVをJavaScriptのArrayに変換
	rainPoints = csvToArray(rainPointsCsv);

    time_line = new Array('0000','0100','0200','0300','0400','0500','0600','0700','0800','0900','1000','1100','1200','1300','1400','1500','1600');

        i = 0;
        var a = setInterval(function(){

           if (points!=null) {
             points = [];
             map.selectAll(".node").data(points).exit().remove();
           }
           i = i+1;
           draw_line(rainPoints, projection, time_line[i]);
        },2000);

});
});

points = null;
map = null;


function draw_line(rainPoints, projection, time) {
	// 雨量情報
//    alert(time);

	var rainDatasCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Rain/20140430/"+time+".csv",
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
	points = JSON.parse(JSON.stringify(rainPoints));	// ディープコピー
	// 観測局データに、10分雨量をマージ
	for (var i = 0 ; i < points.length ; i++){
		var point = points[i];
		if (point["point_id"] == undefined || rainDatas[point["point_id"]] == undefined) continue;
		point["rain_10min"] = rainDatas[point["point_id"]]["rain_10min"];
	}

	map.selectAll(".node")      //  <circle class="node">を選択
		.data(points).enter()        // データの増分を対象
		.append("circle")           // svgのcircleを追加
		.attr("class", "node")
		.attr("cx", function(d) { return projection([d.longitude/10000, d.latitude/10000])[0]; })    // 円の中心
		.attr("cy", function(d) { return projection([d.longitude/10000, d.latitude/10000])[1]; })    // 円の中心
		.attr("r", 5)                                      // 円の半径
		.style("stroke", function(d) { return "#000000"; }) // 枠線の色
		.style("stroke-width", "1px") 						// 枠線の太さ
		.style("fill", function(d) {						// 塗りつぶしの色
			if (d.rain_10min == 0 || d.rain_10min == "-1111111111" || d.rain_10min == "9999"){
				return "#ffffff";		// 白
			} else {
				// console.log(d);
				return "#0000ff";
			}
		});

}


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
