//	�Q�lURL�Fhttp://qiita.com/sawamur@github/items/ec32237bcbaaba94108d
(function() {
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
	});

})();
