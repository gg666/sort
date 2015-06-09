function SwapAry(ary, a, b, isPrint) {
	var log = $('#log_console');
	if (a == b)
		return;
	if (a < 0 || b < 0 || ary.length <= a || ary.length <= b) {
		throw new Error('IndexError ' + a + " - " + b);
	}
	var temp = ary[a];
	ary[a] = ary[b];
	ary[b] = temp;
	if (isPrint == true) { // log打印出来
		for (var i = 0; i < ary.length; i++) {
			if (i == a || i == b) {
				log.append('<span style="color:#f00">' + ary[i] + '</span>,'); // 交换的数字红字显示
			} else {
				log.append(ary[i] + ',');
			}
		}
		log.append('<br />');
		log.scrollTop(log[0].scrollHeight); // 一直滚到最底部
	}
};

function SortStep(indexes, isSwap) {
	this.indexes = indexes;
	this.isSwap = isSwap;
}

SortStep.prototype.run = function(ary) {
	if (this.isSwap == true) {
		SwapAry(ary, this.indexes[0], this.indexes[1], true);
	}
};

function SortAlgorithm(values) {
	this.values = values; // ary
	this.size = values.length;
	this.steps = [];
	this.finished = false;
	this.started = true;
}

SortAlgorithm.prototype.sort = function(algorithm) {
	eval('this.' + algorithm + '()'); // 执行方法名为algorithm的函数
	this.finished = true;
};
/**
 * 
 * @param type
 * @param indexes
 *            一个长度为2的数组，代表2个正在判断的索引值
 */
SortAlgorithm.prototype.addStep = function(indexes, isSwap) {
	this.steps.push(new SortStep(indexes, isSwap));
};

SortAlgorithm.prototype.nextStep = function(a, b, isSwap) {
	if (isSwap)
		SwapAry(this.values, a, b, false);
	this.addStep([ a, b ], isSwap);
};

// 排序算法

SortAlgorithm.prototype.bubble = function bubbleSort() { // 冒泡排序
	for (var i = this.size - 1; 0 < i; i--) {
		for (var k = 0; k < i; k++) {
			if (this.values[k] > this.values[k + 1]) {
				this.nextStep(k, k + 1, true);
			} else {
				this.nextStep(k, k + 1);
			}
		}
	}
};

SortAlgorithm.prototype.selection = function selectionSort() { // 选择排序
	for (var i = 0; i < this.size - 1; i++) {
		var min = i;
		for (var k = i + 1; k < this.size; k++) {
			this.nextStep(min, k);

			if (this.values[k] < this.values[min]) {
				min = k;
			}
		}
		this.nextStep(i, min, true);
	}
};

SortAlgorithm.prototype.shaker = function shakerSort() { // 双向冒泡
	var left = 0;
	var right = this.size - 1;
	var inc = 1;
	var i = 0;
	var next;
	var lastSwapIndex = 0;

	var count = 0;
	while (left < right) {
		next = i + inc;
		if ((inc === 1 && this.values[i] > this.values[next])
				|| (inc === -1 && this.values[next] > this.values[i])) {
			this.nextStep(i, next, true);
			lastSwapIndex = i;
		} else {
			this.nextStep(i, next);
		}

		if (next === right) {
			i = right = lastSwapIndex;
			inc = -inc;
		} else if (next === left) {
			i = left = lastSwapIndex;
			inc = -inc;
		} else {
			i = next;
		}
	}
};

SortAlgorithm.prototype.insertion = function insertionSort() { // 插入排序
	for (var i = 1; i < this.size; i++) {
		for (var k = i; 0 < k; k--) {
			if (this.values[k - 1] > this.values[k]) {
				this.nextStep(k - 1, k, true);
			} else {
				this.nextStep(k - 1, k);
				break;
			}
		}
	}
};

SortAlgorithm.prototype.shell = function shellSort() { // 希尔排序
	var g = 1;
	while (g < this.size) {
		g = g * 3 + 1;
	}
	while (1 < g) {
		g = g / 3 | 0;
		for (var i = g; i < this.size; i++) {
			for (var k = i; 0 < k; k -= g) {
				if (this.values[k - g] > this.values[k]) {
					this.nextStep(k - g, k, true);
				} else {
					this.nextStep(k - g, k);
					break;
				}
			}
		}
	}
};

SortAlgorithm.prototype.merge = function mergeSort() { // 归并排序
	this.mergeImpl(0, this.size - 1);
};

SortAlgorithm.prototype.mergeImpl = function(left, right) {
	if (right <= left) {
		return;
	}
	var middle = (left + right) / 2 | 0;
	this.mergeImpl(left, middle);
	this.mergeImpl(middle + 1, right);

	var l = left;
	var m = middle + 1;
	while (l < m && m <= right) {
		this.nextStep(l, m);
		if (this.values[l] >= this.values[m]) {
			this.mergeImplInsert(m, l);
			m++;
		}
		l++;
	}
};
SortAlgorithm.prototype.mergeImplInsert = function(from, to) { // 把from插到to的前一个
	while (from != to) {
		if (from < to) {
			this.nextStep(from, from + 1, true);
			from += 1;
		} else {
			this.nextStep(from, from - 1, true);
			from -= 1;
		}
	}
};

SortAlgorithm.prototype.quick = function quickSort() { // 快排
	this.quickImpl(0, this.size - 1);
};

SortAlgorithm.prototype.quickImpl = function(left, right) {
	var values = this.values;
	var middle = (left + right) / 2 | 0;
	var pivot = this.quickImplMedian(values[left], values[middle],
			values[right]);
	var l = left;
	var r = right;
	while (true) {
		while (values[l] < pivot) {
			this.nextStep(l, r);
			l++;
		}
		while (pivot < values[r]) {
			this.nextStep(l, r);
			r--;
		}
		if (r <= l) {
			break;
		}
		this.nextStep(l, r, true);
		l++;
		r--;
	}

	if (left < l - 1) {
		this.quickImpl(left, l - 1);
	}
	if (r + 1 < right) {
		this.quickImpl(r + 1, right);
	}
};
SortAlgorithm.prototype.quickImplMedian = function(a, b, c) { // 找中间值
	if (b <= a)
		if (a <= c)
			return a;
		else if (c <= b)
			return b;
		else
			return c;
	else if (c <= a)
		return a;
	else if (c <= b)
		return c;
	else
		return b;
};
SortAlgorithm.prototype.heap = function heapSort() { // 堆排序
	for (var i = 0; i < this.size; i++) {
		this.swapUp(i);
	}

	for (i = this.size - 1; 0 < i; i--) {
		if (this.values[0] > this.values[i]) {
			this.nextStep(0, i, true);
		} else {
			this.nextStep(0, i);
		}
		this.swapDown(0, i);
	}
};

SortAlgorithm.prototype.swapUp = function(i) {
	var p;
	while (i !== 0) {
		p = (i - 1) / 2 | 0;
		if (this.values[p] >= this.values[i]) {
			this.nextStep(p, i);
			break;
		}
		this.nextStep(p, i, true);
		i = p;
	}
};

SortAlgorithm.prototype.swapDown = function(i, len) {
	var values = this.values;
	var c;
	while (true) {
		c = i * 2 + 1;
		if (values[c] < values[c + 1]) {
			c += 1;
		}
		if (values[i] >= values[c]) {
			this.nextStep(i, c);
			break;
		}
		if (len <= c) {
			break;
		}
		this.nextStep(i, c, true);
		i = c;
	}
};

SortAlgorithm.prototype.comb = function combSort() { // 梳排序
	var values = this.values;
	var factor = 1.3;
	var r = 0;
	var g = this.size;
	var swapped = 1;
	while (g > 1 || swapped) {
		g = parseInt((g > 1) ? g / factor : g);
		swapped = 0;
		var i = 0;
		while (g + i < this.size) {
			if (values[i] > values[g + i]) {

				this.nextStep(i, g + i, true);
				swapped = 1;

			}
			i++;
		}
	}

};


SortAlgorithm.prototype.oddEven = function oddEvenSort() { // 奇偶排序
	var sorted = false;
	while (!sorted) {
		sorted = true;
		for (var i = 1; i < this.size - 1; i += 2) {
			if (this.values[i] > this.values[i + 1]) {
				this.nextStep(i, i + 1, true);
				sorted = false;
			}
		}
		for (var i = 0; i < this.size - 1; i += 2) {
			if (this.values[i] > this.values[i + 1]) {
				this.nextStep(i, i + 1, true);
				sorted = false;
			}
		}
	}
};

SortAlgorithm.prototype.stooge = function stoogeSort() { // 臭皮匠排序
	var i = 0;
	var j = this.size - 1;
	this.stoogeImpl(i, j);

};

SortAlgorithm.prototype.stoogeImpl = function(i, j) {
	if (this.values[i] > this.values[j]) {
		this.nextStep(i, j, true);
	}
	if ((j - i + 1) >= 3) {
		var t = parseInt((j - i + 1) / 3);
		this.stoogeImpl(i, j - t)
		this.stoogeImpl(i + t, j)
		this.stoogeImpl(i, j - t)
	}
}