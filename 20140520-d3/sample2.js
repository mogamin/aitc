//	参考URL：http://qiita.com/sawamur@github/items/ec32237bcbaaba94108d
(function() {
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
	});

})();
