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

	// デバッグ表示
	$("#view").html("<pre>" + rainPointsCsv
	+ "--------------------------------------\n"
	+ $('<div>').text(JSON.stringify(rainPoints, null, 2)).html()
	+ "</pre>");
});

// 雨量データを取得する
function getRainDatas(){
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

	// デバッグ表示
	$("#view").html("<pre>" + rainDatasCsv
	+ "--------------------------------------\n"
	+ $('<div>').text(JSON.stringify(rainDatas, null, 2)).html()
	+ "</pre>");
}

// 雨量データを取得する２
function getRainDatas2(){
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

	// デバッグ表示
	$("#view").html("<pre>" 
	+ "--------------------------------------\n"
	+ $('<div>').text(JSON.stringify(points, null, 2)).html()
	+ "</pre>");
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
