	$().extend('drag',function(){
		var tags = arguments;
		for(var i = 0; i < this.elements.length; i++){	
			addEvent(this.elements[i],'mousedown',function(e){
				if(trim(this.innerHTML).length == 0){
					e.preventDefault();
				}
				var _this = this;
				var diffX = e.clientX - _this.offsetLeft;//鼠标点击位置距离点击的弹出框的左边的距离
				var diffY = e.clientY - _this.offsetTop;//鼠标点击位置距离点击的弹出框的上边的距离
				
				//自定义拖拽区域
				var flag= false;
				for (var i = 0; i < tags.length; i++) {
					if (e.target == tags[i]) {
						flag = true;
						break;
					}
				}
				//移动函数
				if (flag) {
					addEvent(document,'mousemove',move);
					addEvent(document,'mouseup',up);	
				}else{
					removeEvent(document,'mousemove',move);
					removeEvent(document,'mouseup',up);	
				}
				function move(e){
					var left = e.clientX - diffX;//动态计算出弹出框的左边到页面最左边的距离
					var top = e.clientY - diffY;//动态计算出弹出框的上边到页面最上边的距离
					
					if (left < 0) {//禁止拉出左边屏幕
						left = 0;
					}else if(left > getInner().width - _this.offsetWidth){
						left = getInner().width - _this.offsetWidth;//禁止拉出右边屏幕
					}
					if (top < 0) {
						top = 0;//禁止拉出上边屏幕
					}else if(top > getInner().height - _this.offsetHeight){
						top = getInner().height - _this.offsetHeight;//禁止拉出下边屏幕
					}
					_this.style.left = left +'px';
					_this.style.top = top + 'px';

					if (typeof _this.setCapture != "undefined") {
						_this.setCapture();
					}
				}
				function up(){
					removeEvent(document,'mousemove',move);
					removeEvent(document,'mouseup',up);
					if (typeof _this.releaseCapture != "undefined") {
						_this.releaseCapture();
					}
				}
			});
		};
		return this;
	});

			