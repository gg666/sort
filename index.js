$(document).ready(function() {
	$('#run').click(function() { // 点击run事件
		if (VM.isRun) // 线程已经跑起来了
			return;
		VM.isRun = true;
		VM.run();
	});
	$('#update').click(function() { // 点击update事件
		VM.getAlgorithm(); // 刷新选中的算法
		VM.updateNums();
		VM.init();
		VM.step();
	});
	$('#reset').click(function() { // 点击reset事件
		VM.getAlgorithm(); // 刷新选中的算法
		VM.shuffle();
		VM.init();
		VM.step();
	});
	$('#step').click(function() { // 点击step事件
		VM.isRun = false;
		VM.step();
	});
	$(document).keypress(function(e) {
		switch (e.which) {
		case 32: { 
			if ($(':focus').length == 0)
				$('#step').click(); // 点击空格，下一步
			break;
		}
		case 13: {
			if ($(':focus').length == 0)
				$('#run').click(); // 点击回车，运行
			break;
		}
		}
	});
	$("#log_button").mouseenter(function() {
		if($("#log_button").text() == 'log') {
		$("#log_console").fadeTo(300, 0.8);
		}
	});
	$("#log_button").mouseleave(function() {
		if($("#log_button").text() == 'log') {
		$("#log_console").fadeOut();
		}
	});
	$("#log_button").click(function() {
		if($("#log_button").text() == "log") {
			$("#log_button").text('X');
			$('.ui').addClass('blur');
//			$("#log_console").fadeTo(0,1);
		} else {
			$("#log_button").text('log');
			$('.ui').removeClass('blur');
//			$("#log_console").fadeOut();
		}
	});
	$(document).on("click", "#detail_button", function() {
		if ($("#detail").css("top") == "0px") {
			$("#detail_button").text("算法介绍");
			$("#detail").animate({"top" : "-100%"}, function() {
				$("#log_button").show();
			});
		} else {
			$("#detail_button").text("返回");
			$("#log_button").hide();
			$("#detail").animate({"top" : "0px"});
		}
	});
	new Graph();
	new ViewModel();
	ko.applyBindings(VM);
	ko.computed({ // 点击其他按钮事件
		read : function() {
			$("#detail").attr("src","detail/" + VM.getAlgorithm() + ".html");
			$('#reset').click();
		},
		owner : VM,
	})();  
	$(".button-set").append('<label>  <span id="detail_button" class="button" onselectstart="return false" style="-moz-user-select:none; ">算法介绍</span></label>')
})
