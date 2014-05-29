var rainPoints = null;
var rainDatas = null;
$(function() {
	var g,
		width = 900,
		height = 650;

	// svg�v�f���쐬���A�f�[�^�̎󂯎M�ƂȂ�g�v�f��ǉ����Ă���
	map = d3.select('#map').append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g');

	// �n�}�f�[�^��ǂݍ���    
	d3.json("http://aramoto.sakura.ne.jp/shizuoka2/gis/shizuoka_utf8.json", function(json) {
//	d3.json("./gis/shizuoka_utf8.json", function(json) {
			var projection,
				 path;

	// ���e����������֐���p�ӂ���B�f�[�^����SVG��PATH�ɕϊ����邽�߁B
	projection = d3.geo.mercator()
					.scale(15000)
					.center(d3.geo.centroid(json))  // �f�[�^���璆�S�_���v�Z
					.translate([width / 2, height / 2]);

	// path�W�F�l���[�^�֐�
	path = d3.geo.path().projection(projection);
	//  ���ꂪenter�����f�[�^���ɌĂяo����path�v�f��d������
	//  geoJSON�f�[�^����ϊ������l������                

	map.selectAll('path')
	.data(json.features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr("fill", function(d){
		// �K���ɐF��h��Ȃ�
		return "hsl(0,0%,80%)";
	})
	.attr("stroke","hsl(80,100%,0%)" )
	.on('mouseover', function(d){
		// mouseover�̎��̃C���^���N�V����
		console.log(d);
	})
	.on('click', function(d) {
		// click���ꂽ���̃C���^���N�V����
		console.log(d);
	});



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

	/* �f�o�b�O�p */
/*	for (var i = 0 ; i < points.length ; i++){
		var point = projection([points[i].longitude/10000, points[i].latitude/10000]);//�ʒu��񁨃s�N�Z��
		console.log(point);
	}
*/

	map.selectAll(".node")      //  <circle class="node">��I��
		.data(points).enter()        // �f�[�^�̑�����Ώ�
		.append("circle")           // svg��circle��ǉ�
		.attr("class", "node")
		.attr("cx", function(d) { return projection([d.longitude/10000, d.latitude/10000])[0]; })    // �~�̒��S
		.attr("cy", function(d) { return projection([d.longitude/10000, d.latitude/10000])[1]; })    // �~�̒��S
		.attr("r", 5)                                      // �~�̔��a
		.style("stroke", function(d) { return "#000000"; }) // �g���̐F
		.style("stroke-width", "1px") 						// �g���̑���
		.style("fill", function(d) {						// �h��Ԃ��̐F
			if (d.rain_10min == 0 || d.rain_10min == "-1111111111" || d.rain_10min == "9999"){
				return "#ffffff";		// ��
			} else {
				// console.log(d);
				return "#0000ff";
			}
		})
		;

/* �Z�����d�˂ď��� 
	map.selectAll(".txt")
		.data(points).enter()
		.append("text")
		.attr("class", "txt") 
		.attr("x",function(d) { return projection([d.longitude/10000, d.latitude/10000])[0]; })
		.attr("y",function(d) { return projection([d.longitude/10000, d.latitude/10000])[1]; })
		.style("font", "8pt sans-serif")
		.text(function(d) { return d.address; })
		.on('mouseover', function(d){
			d3.select(this).text(function(d) { return d.address; });
		})
		.on('mouseout', function(d){
			d3.select(this).text("--");		// �B��
		})
		;
/* */
	});

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
