var VM; // ViewModel
function ViewModel() {
	VM = this;
	VM.algorithm = ko.observable('选择排序');
	VM.size = ko.observable(50); // 监控data-bind的value为size，如果改值发生变化，就会调用ko.computed方法
	VM.speed = ko.observable(5);
	VM.isRun = false;
	VM.sort = null;
	VM.nums = [];
	VM.barWidth = ''; // 每个bar的宽度
	VM.barHeightUnit = ''; // 每个bar的单位长度
	VM.stepLength = 0; // 运行步数
	VM.algorithmList = [ {
		name : '选择排序',
		func : 'selection'
	}, {
		name : '插入排序',
		func : 'insertion'
	}, {
		name : '希尔排序',
		func : 'shell'
	}, {
		name : '快速排序',
		func : 'quick'
	}, {
		name : '归并排序',
		func : 'merge'
	}, {
		name : '堆排序',
		func : 'heap'
	}, {
		name : '冒泡排序',
		func : 'bubble'
	}, {
		name : '鸡尾酒排序',
		func : 'shaker'
	}, {
		name : '梳排序',
		func : 'comb'
	} , {
		name : '奇偶排序',
		func : 'oddEven'
	} , {
		name : '臭皮匠排序',
		func : 'stooge'
	}  ]

}

ViewModel.prototype.step = function() { // 画一帧
	if (VM.sort.steps.length === 0) {
		if (VM.sort.finished || VM.sort.started) {
			VM.sort.started = false;
			GRAPH.draw([ -1, -1 ], VM.nums, VM.barWidth, VM.barHeightUnit);
			return;
		} else {
			VM.sort.sort(VM.getAlgorithm());
		}
	}
	var step = VM.sort.steps.shift();
	step.run(VM.nums);
	$('#stepLength').text('+' + (++VM.stepLength)); // 显示步数
	GRAPH.draw(step.indexes, VM.nums, VM.barWidth, VM.barHeightUnit);
}

ViewModel.prototype.shuffle = function() { // 初始化洗牌（处理VM.nums）
	var size = VM.getSize();
	var ary = [];
	for (var i = 1; i <= size; i++) { // 生成1~size的数字集合
		ary.push(i);
	}
	for (var i = ary.length - 1; 0 <= i; i--) {
		var rnd = Math.random() * (i + 1) | 0;
		SwapAry(ary, i, rnd, false);
	}
	var s = '';
	for (var i = 0; i < ary.length; i++) {
		s = s + ary[i] + ',';
	}
	s = s.substring(0, s.length - 1);
	$('#myData').val(s);
	VM.nums = ary;
}

ViewModel.prototype.init = function() { // 一些初始化工作
	$('#stepLength').empty();
	VM.stepLength = 0;
	$('#log_console').empty();
	VM.isRun = false;
	VM.sort = new SortAlgorithm(VM.nums.slice(0)); // 复制数组，传给SortAlgorithm
	VM.sort.started = true;
	var size = VM.nums.length;
	var max = VM.nums[0];
	for (var i = 1; i < VM.nums.length; i++) {
		if (max < VM.nums[i]) {
			max = VM.nums[i];
		}
	}
	VM.barWidth = (GRAPH.width - size + 1) / size;
	VM.barHeightUnit = GRAPH.height / max;
}

ViewModel.prototype.run = function() { // 线程跑起来
	if (!VM.isRun) // 触发了step或其他事件
		return;
	VM.step();
	setTimeout(function() {
		VM.run()
	}, VM.getIntervalTime());
}

ViewModel.prototype.updateNums = function() { // 将textarea的字符串转为VM.nums
	var ary = $('#myData').val().split(',');
	for (var i = 0; i < ary.length; i++) { // string[] 转 int[]
		if (ary[i].trim() == '' || isNaN(ary[i])) { // 非int则返回
			alert('请输入以","分隔的正数，如"3,1,2"');
			return;
		}
		ary[i] = parseFloat(ary[i]);
		if (ary[i] <= 0) {
			alert('请输入以","分隔的正数，如"3,1,2"');
			return;
		}
	}
	VM.nums = ary;
}

ViewModel.prototype.getIntervalTime = function() {
	var speed = parseInt(VM.speed.peek());
	return 2000 / speed / speed | 0;
}

// 返回algorithmList中name对应的func
ViewModel.prototype.getAlgorithm = function() {
	var name = VM.algorithm();
	var func = '';
	$(VM.algorithmList).each(function() {
		if (this.name == name) {
			func = this.func;
			return false;
		}

	});
	return func;
}

ViewModel.prototype.getSize = function() {
	return parseInt(VM.size());
}