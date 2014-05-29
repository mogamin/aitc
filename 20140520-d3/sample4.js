var width = 900, height = 650;
var svg = null;

var rainPoints = null;
var rainDatas = null;
$(function() {
	// �J�ʊϑ��Ǐ��
	var rainPointsCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Shizuoka_Rain_ObservationPoint_utf8.csv",
//		url: "./Shizuoka_Rain_ObservationPoint_utf8.csv",
		async: false			// �����ʐM
	}).responseText;
	// CSV��JavaScript��Array�ɕϊ�
	rainPoints = csvToArray(rainPointsCsv);

	// �J�ʏ��
	var rainDatasCsv = $.ajax({
		url: "http://aramoto.sakura.ne.jp/shizuoka2/Rain/20140430/0000.csv",
//		url: "./Rain/20140430/0000.csv",
		async: false			// �����ʐM
	}).responseText;
	// CSV��JavaScript��Array�ɕϊ�
	var tmp = csvToArray(rainDatasCsv);
	// �A�N�Z�X���y�ɂȂ�悤�ɁA�A�z�z�񕗂ɂ���
	rainDatas = new Object();
	for (i = 0 ; i < tmp.length ; i++){
		var data = tmp[i];
		rainDatas[data["point_id"]] = data;
	}
	
	// �J�ʊϑ��ǃf�[�^�ɉJ�ʂ��}�[�W����
	var points = JSON.parse(JSON.stringify(rainPoints));	// �f�B�[�v�R�s�[
	// �ϑ��ǃf�[�^�ɁA10���J�ʂ��}�[�W
	for (var i = 0 ; i < points.length ; i++){
		var point = points[i];
		if (point["point_id"] == undefined || rainDatas[point["point_id"]] == undefined) continue;
		point["rain_10min"] = rainDatas[point["point_id"]]["rain_10min"];
	}

/*	// �f�o�b�O�\��
	$("#view").html("<pre>" 
	+ "--------------------------------------\n"
	+ $('<div>').text(JSON.stringify(points, null, 2)).html()
	+ "</pre>");
*/

	svg = d3.select("#view").append("svg")  // <div id="view">��<svg>��ǉ�
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", "0 0 40000 30000")	// ���W�f�[�^�̍ŏ��l�ƕ��i�ő�l�|�ŏ��l�j
		;	// viewBox�́Asvg�̋@�\ http://www.hcn.zaq.ne.jp/___/SVG11-2nd/coords.html#ViewBoxAttribute

	svg.selectAll(".node")      //  <circle class="node">��I��
		.data(points).enter()        // �f�[�^�̑�����Ώ�
		.append("circle")           // svg��circle��ǉ�
		.attr("class", "node")
		.attr("cx", function(d) { return (d.longitude - 1370000); })    // �~�̒��S
		.attr("cy", function(d) { return (360000 - d.latitude); })      // �~�̒��S
		.attr("r", 200)                                      // �~�̔��a
		.style("stroke", function(d) { return "#000000"; }) // �g���̐F
		.style("stroke-width", "20px") 						// �g���̑���
		.style("fill", function(d) {						// �h��Ԃ��̐F
			if (d.rain_10min == 0 || d.rain_10min == "-1111111111" || d.rain_10min == "9999"){
				return "#ffffff";		// ��
			} else {
				// console.log(d);
				return "#0000ff";
			}
		})
		;
});


// �ȈՔ�CSV��Array�ϊ�
// �P�s�ڂ̓w�b�_
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
