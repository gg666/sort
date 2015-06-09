var GRAPH; // 画图相关
function Graph() {
	GRAPH = this;
	GRAPH.canvas = $('#canvas')[0];
	GRAPH.context = GRAPH.canvas.getContext('2d');
	GRAPH.width = $('#canvas').width();
	GRAPH.height = $('#canvas').height();
	GRAPH.bbox = canvas.getBoundingClientRect(); // 坐标
	GRAPH.bgColor = '#000';  // 背景黑色
	GRAPH.barColor = '#fff'; // bar白色
	GRAPH.highlightColor1 = '#0ff'; // 青色
	GRAPH.highlightColor2 = '#f00'; // 红色
	
	$(GRAPH.canvas).mousemove(function(e) {
		var offset = 11;
		var x = e.pageX;
		var y = e.pageY;
		var p = {
				x : x - GRAPH.bbox.left * (GRAPH.width / GRAPH.bbox.width),
				y : y - GRAPH.bbox.top * (GRAPH.height / GRAPH.bbox.height)
			};
		var index = parseInt(p.x / (VM.barWidth+1)); // 对应索引
		var h = VM.nums[index] * VM.barHeightUnit; // 对应bar的高度
		if (GRAPH.height - h < p.y) { // 判断是否在bar内
			$('#tooltip').text(VM.nums[index]);
			$("#tooltip").css({
				"left" : (e.pageX) + "px",
				"top" : (GRAPH.bbox.top + GRAPH.height + offset) + "px"
			}).show(); // 设置x坐标和y坐标，并且显示
			$('#dot').css({
				"left" : (e.pageX - 8) + "px",
				"top" : (GRAPH.bbox.top + GRAPH.height - h -35 + offset) + "px"
			}).show(); // 设置x坐标和y坐标，并且显示
		} else {
			$('#dot').hide();
			$("#tooltip").hide();
		}
	});
	$(GRAPH.canvas).mouseleave(function(e) {
		$('#dot').hide();
		$("#tooltip").hide();
	});
	
}
/**
 * 
 * @param highlightIndexes    长度为2的数组 内容为2个高亮的索引
 * @param values    VM.nums的排序内容
 * @param barWidth
 * @param barHeightUnit  bar的单位长度
 */
Graph.prototype.draw = function(highlightIndexes, values, barWidth, barHeightUnit) {
	GRAPH.context.fillStyle = GRAPH.bgColor;
	GRAPH.context.fillRect(0, 0, GRAPH.width, GRAPH.height);
	var idx1 = highlightIndexes[0];
	var idx2 = highlightIndexes[1];
	var x = 0;
	GRAPH.context.fillStyle = GRAPH.barColor;
	for (var i = 0; i < values.length; i++) {
		var barHeight = values[i] * barHeightUnit; 
		if (i === idx1) {
			GRAPH.context.fillStyle = GRAPH.highlightColor1;
			GRAPH.context.fillRect(x, GRAPH.height - barHeight, barWidth, barHeight);
		} else if (i === idx2) {
			GRAPH.context.fillStyle = GRAPH.highlightColor2;
			GRAPH.context.fillRect(x, GRAPH.height - barHeight, barWidth, barHeight);
		} else {
			GRAPH.context.fillStyle = GRAPH.barColor;
			GRAPH.context.fillRect(x, GRAPH.height - barHeight, barWidth, barHeight);
		}
		x = x + barWidth + 1;
	}
}
