	/**
	 * [$ 入口函数]
	 * @param  {VOID} args [初始参数]
	 * @return {Object}    [$实例]
	 */
	var $ = function(args) {
	    return new Base(args);
	};	


	/**
	 * [$ 构造函数]
	 * @param  {Object} args [传入对象/字符选择器]
	 * @return {Void}        [Null]
	 */
	function Base(args) {
	    // 通过字符选择器一层一层的找到最终需要找到的元素节点
	    // ('#main .logo p') 在找到#main节点之后就应该把它保存之后再清空
	    this.elements = [];
	    if (typeof args == 'string') { // 选择器字符串
	        if (args.indexOf(' ') != -1) { // 表明是复杂选择器 css模拟
	            var elements = args.split(' '); // 把选择器字符('#main .logo img')拆开
	            var childElements = []; // 存放临时节点对象的数组，解决被覆盖的问题
	            var node = []; // 用来存放父节点用的
	            for (var i = 0; i < elements.length; i++) {
	                if (node.length == 0) node.push(document); // 如果默认没有父节点，就把document放入
	                switch (elements[i].charAt(0)) {
	                    case '#':
	                        childElements = []; // 清理掉上一次循环到的临时中转父节点
	                        childElements.push(this.getid(elements[i].substring(1)));
	                        node = childElements; // 保存本次循环到的父节点(根据ID取得的节点),后面根据元素名取得节点是这个节点的子节点
	                        break;
	                    case '.':
	                        childElements = [];
	                        for (var j = 0; j < node.length; j++) { // 这儿的parentNodes是上一层的父节点,对其循环
	                            var tempNodes = this.getClass(elements[i].substring(1), node[j]); // 又因为在每一个父节点里可能找到多个有此class名的子节点
	                            for (var k = 0; k < tempNodes.length; k++) {
	                                childElements.push(tempNodes[k]); // 把每一个父节点里符合条件的节点都都放到同一个数组里面
	                            }
	                        }
	                        node = childElements;
	                        break;
	                    default:
	                        childElements = [];
	                        for (var j = 0; j < node.length; j++) {
	                            var tempNodes = this.gettag(elements[i], node[j]);
	                            for (var k = 0; k < tempNodes.length; k++) {
	                                childElements.push(tempNodes[k]);
	                            }
	                        }
	                        node = childElements;
	                        break;
	                }
	            }
	            this.elements = childElements;
	        } else { //find模拟
	            switch (args.charAt(0)) {
	                case '#':
	                    this.elements.push(this.getid(args.substring(1)));
	                    break;
	                case '.':
	                    this.elements = this.getClass(args.substring(1));
	                    break;
	                default:
	                    this.elements = this.gettag(args);
	            }
	        }
	    } else if (typeof args == 'object') {
	        if (args != undefined) { // _this是一个对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
	            this.elements[0] = args;
	        }
	    } else if (typeof args == "function") {
	        this.ready(args);
	    }
	}


	/**
	 * [ready 载入函数]
	 * @param  {Function} fn [逻辑代码]
	 * @return {Void}        [Null]
	 */
	Base.prototype.ready = function(fn) {
	    addDomLoaded(fn);
	}


	/**
	 * [getid 根据ID]
	 * @param  {String} id [ID名]
	 * @return {Object}    [DOM节点]
	 */
	Base.prototype.getid = function(id) {
	    return document.getElementById(id);
	};


	/**
	 * [gettag 根据元素名获取节点数组]
	 * @param  {String} tag        [元素名]
	 * @param  {Object} parentNode [父节点]
	 * @return {Object}            [DOM节点]
	 */
	Base.prototype.gettag = function(tag, parentNode) {
	    var node = null;
	    var tempNodes = [];
	    parentNode != undefined ? node = parentNode : node = document;
	    var allNodes = node.getElementsByTagName(tag);
	    for (var i = 0; i < allNodes.length; i++) {
	        tempNodes.push(allNodes[i]);
	    }
	    return tempNodes;
	}


	/**
	 * [getClass 根据Class获取节点]
	 * @param  {String} className  [class名]
	 * @param  {Object} parentNode [父节点]
	 * @return {Object}      	   [DOM节点]
	 */
	Base.prototype.getClass = function(className, parentNode) {
	    var tempNode = null; // 临时用来保存父节点
	    var tempNodes = []; // 中转变量，保存父节点下的所有节点
	    parentNode != undefined ? tempNode = parentNode : tempNode = document;
	    var allNodes = tempNode.getElementsByTagName('*');
	    for (var i = 0; i < allNodes.length; i++) {
	        if ((new RegExp('(\\s|^)' + className + '(\\s|Base)')).test(allNodes[i].className)) {
	            tempNodes.push(allNodes[i]);
	        }
	    }
	    return tempNodes;
	}


	/**
	 * [find find模拟器]
	 * @param  {String} str [字符选择器]
	 * @return {Base}     [Base对象]
	 */
	Base.prototype.find = function(str) {
	    var childElements = [];
	    for (var i = 0; i < this.elements.length; i++) {
	        switch (str.charAt(0)) {
	            case "#":
	                childElements.push(this.getid(str.substring(1)));
	                break;
	            case ".":
	                var temps = this.getClass(str.substring(1), this.elements[i]);
	                for (var j = 0; j < temps.length; j++) {
	                    childElements.push(temps[j]);
	                }
	                break;
	            default:
	                var temps = this.gettag(str, this.elements[i])
	                for (var j = 0; j < temps.length; j++) {
	                    childElements.push(temps[j]);
	                }
	        }
	    }
	    this.elements = childElements;
	    return this;
	}


	/**
	 * [ge 取得原生节点]
	 * @param  {Number} num [节点索引]
	 * @return {Object}     [DOM对象]
	 */
	Base.prototype.ge = function(num) {
	    return this.elements[num];
	}


	/**
	 * [eq 返回包装节点]
	 * @param  {Number} num [节点索引]
	 * @return {Base}  [Base对象]
	 */
	Base.prototype.eq = function(num) {
	    var element = this.elements[num];
	    this.elements = [];
	    this.elements[0] = element;
	    return this;
	}


	/**
	 * [length 返回节点数组长度]
	 * @return {Number} [长度]
	 */
	Base.prototype.length = function(){
		return this.elements.length;
	}


	/**
	 * [index 返回索引值]
	 * @return {Number} [返回节点在节点数组中的索引]
	 */
	Base.prototype.index = function(){
		var childNodes = this.elements[0].parentNode.children; // 得到父节点
		for (var i = 0; i < childNodes.length; i++) {
			if (this.elements[0] == childNodes[i]) return i;
		}
	}


	/**
	 * [attr 返回节点指定属性值]
	 * @param  {String} attr [属性名]
	 * @return {String}      [属性值]
	 */
	Base.prototype.attr = function(attr, value){
		for (var i = 0; i < this.elements.length; i++) {
			if (arguments.length == 1) {
				return this.elements[i].getAttribute(attr);
			} else if (arguments.length == 2){
				this.elements[i].setAttribute(attr, value);
			}
		}
	    return this;
	}

	/**
	 * [first 第一个节点]
	 * @return {Object}  [DOM节点]
	 */
	Base.prototype.first = function() {
	    return this.elements[0];
	}


	/**
	 * [last 最后一个节点]
	 * @return {Object}  [DOM节点]
	 */
	Base.prototype.last = function() {
	    return this.elements[this.elements.length - 1];
	}


	/**
	 * [prev 当前节点的上一个节点]
	 * @return {Base} [Excesior对象]
	 */
	Base.prototype.prev = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i] = this.elements[i].previousSibling;
	        if (this.elements[i] == null) throw new Error('找不到上一个同级元素节点！');
	        if (this.elements[i].nodeType == 3) this.prev(); // 如果为文本节点执行递归
	    }
	    return this;
	}


	/**
	 * [next 当前节点的下一个节点]
	 * @return {Base} [Excesior对象]
	 */
	Base.prototype.next = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i] = this.elements[i].nextSibling;
	        if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
	        if (this.elements[i].nodeType == 3) this.next(); // 如果为文本节点执行递归
	    }
	    return this;
	}


	/**
	 * [opacity 设置节点透明度]
	 * @param  {Number} num [透明值]
	 * @return {Excesior}   [Excesior对象]
	 */
	Base.prototype.opacity = function(num){
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].style.opacity = num / 100; // W3C
			this.elements[i].style.filter = 'alpha(opacity=' + num + ')'; // IE
		}	
		return this;
	}


	/**
	 * [css 获取/设置css]
	 * @param  {String} attr  [属性名]
	 * @param  {String} value [属性值]
	 * @return {Base}    [Excesior对象]
	 */
	Base.prototype.css = function(attr, value) {
	    for (var i = 0; i < this.elements.length; i++) {
	    	// 获取
	        if (arguments.length == 1) {
	            return getStyle(this.elements[i], attr);
	        }
	        // 设置
	        this.elements[i].style[attr] = value;
	    };
	    return this;
	}


	/**
	 * [addClass 添加class]
	 * @param  {String} className [class名]
	 * @return {Base}        [Excesior对象]
	 */
	Base.prototype.addClass = function(className) {
	    for (var i = 0; i < this.elements.length; i++) {
	        if (!hasClass(this.elements[i], className)) {
	            this.elements[i].className += ' ' + className;
	        }
	    }
	    return this;
	}


	/**
	 * [removeClass 移除class]
	 * @param  {String} className [class名]
	 * @return {Base}        [Excesior对象]
	 */
	Base.prototype.removeClass = function(className) {
	    for (var i = 0; i < this.elements.length; i++) {
	        if (hasClass(this.elements[i], className)) {
	            this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' + className + '(\\s|Base)'), '');
	        }
	    }
	    return this;
	}


	/**
	 * [addRule 添加css规则]
	 * @param {Number} num          [外联css文件索引]
	 * @param {String} selectorText [选定css样式]
	 * @param {String} cssText      [设置css样式]
	 * @param {Number} position     [css样式行号]
	 */
	Base.prototype.addRule = function(num, selectorText, cssText, position) {
	    var sheet = document.styleSheets[num];
	    if (typeof sheet.insertRule != "undefined") { // W3C
	        sheet.insertRule(selectorText + '{' + cssText + '}', position);
	    } else if (typeof sheet.addRule != "undefined") { // IE
	        sheet.addRule(selectorText, cssText, position);
	    }
	    return this;
	}


	/**
	 * [removeRule 移除css规则]
	 * @param  {[type]} num   [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	Base.prototype.removeRule = function(num, index) {
	    var sheet = document.styleSheets[num];
	    if (typeof sheet.deleteRule != "undefined") { // W3C
	        sheet.deleteRule(index);
	    } else if (typeof sheet.removeRule != "undefined") { // IE
	        sheet.removeRule(index);
	    }
	    return this;
	}


	/**
	 * [form description]
	 * @param  {String} name [表单元素快速选定]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.form = function(name) {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i] = this.elements[i][name]
	    }
	    return this;
	}


	/**
	 * [html 设置/获取表单域的值]
	 * @param  {String} str  [设置的值]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.value = function(str) {
	    for (var i = 0; i < this.elements.length; i++) {
	        if (arguments.length == 0) {
	            return this.elements[i].value;
	        }
	        this.elements[i].value = str;
	    }
	    return this;
	}


	/**
	 * [html 设置/获取文本]
	 * @param  {String} str  [设置的文本]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.text = function(text) {
	    for (var i = 0; i < this.elements.length; i++) {
	        if (arguments.length == 0) {
	            return getInnerText(this.elements[i]);
	        }
	        setInnerText(this.elements[i], text);
	    }
	    return this;
	}

	/**
	 * [html 设置/获取HTML]
	 * @param  {String} str  [设置的HTML]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.html = function(str) {
	    for (var i = 0; i < this.elements.length; i++) {
	        if (arguments.length == 0) {
	            return this.elements[i].innerHTML;
	        }
	        this.elements[i].innerHTML = str;
	    }
	    return this;
	}


	/**
	 * [click 点击事件]
	 * @param  {Function} fn [点击函数]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.click = function(fn) {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].onclick = fn;
	    }
	    return this;
	}


	/**
	 * [toggle 切换函数]
	 * @return {Base}  [Excesior对象]
	 */
	Base.prototype.toggle = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        (function(element, args) {
	            var count = 0;
	            addEvent(element, 'click', function() {
	                args[count++ % args.length].call(this);
	            });
	        })(this.elements[i], arguments);
	    }
	    return this;
	}


	/**
	 * [show 显示节点]
	 * @return {Base}  [Excesior对象]
	 */
	Base.prototype.show = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].style.display = 'block';
	    }
	    return this;
	}


	/**
	 * [hide 隐藏节点]
	 * @return {Base}  [Excesior对象]
	 */
	Base.prototype.hide = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].style.display = 'none';
	    }
	    return this;
	}


	/**
	 * [bind 事件绑定]
	 * @param  {String}   even [事件类型]
	 * @param  {Function} fn   [事件函数]
	 * @return {Base}     [Excesior对象]
	 */
	Base.prototype.bind = function(event, fn) {
	    for (var i = 0; i < this.elements.length; i++) {
	        addEvent(this.elements[i], event, fn);
	    }
	    return this;
	}

	/**
	 * [hover 鼠标事件函数]
	 * @param  {function} over [鼠标移入函数]
	 * @param  {function} out  [鼠标移出函数]
	 * @return {Base}     [Excesior对象]
	 */
	Base.prototype.hover = function(over, out) {
	    for (var i = 0; i < this.elements.length; i++) {
	        addEvent(this.elements[i], 'mouseover', over);
	        addEvent(this.elements[i], 'mouseout', out);
	    }
	    return this;
	}


	/**
	 * [center 元素实时居中]
	 * @param  {Number} width  [宽]
	 * @param  {Number} height [高]
	 * @return {Base}     [Excesior对象]
	 */
	Base.prototype.center = function(width, height) {
	    var left = (getInner().width - width) / 2; //取得整个屏幕大小减去登陆框的宽度就是左右居中
	    var top = (getInner().height - height) / 2; //取得整个屏幕大小减去登陆框的高度就是上下居中
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].style.top = top + 'px';
	        this.elements[i].style.left = left + 'px';
	    }
	    return this;
	}


	/**
	 * [resize 重置浏览器]
	 * @param  {Function} fn [回调函数]
	 * @return {Base}   [Excesior对象]
	 */
	Base.prototype.resize = function(fn) {
	    for (var i = 0; i < this.elements.length; i++) {
	        var element = this.elements[i];
	        addEvent(window, 'resize', function() {
	            fn();
	            if (element.offsetLeft > getInner().width - element.offsetWidth) {
	                element.style.left = getInner().width - element.offsetWidth + 'px';
	            }
	            if (element.offsetTop > getInner().height - element.offsetHeight) {
	                element.style.top = getInner().height - element.offsetHeight + 'px';
	            }
	        });
	    }
	    return this;
	}


	/**
	 * [lock 锁屏函数]
	 * @return {Base}  [Excesior对象]
	 */
	Base.prototype.lock = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].style.width = getInner().width + 'px';
	        this.elements[i].style.height = getInner().height + 'px';
	        this.elements[i].style.display = 'block';
	        document.documentElement.style.overflow = 'hidden'; //拖动时隐藏滚动条
	    }
	    return this;
	}


	/**
	 * [unlock 解除锁屏]
	 * @return {Base}  [Excesior对象]
	 */
	Base.prototype.unlock = function() {
	    for (var i = 0; i < this.elements.length; i++) {
	        this.elements[i].style.display = 'none';
	        document.documentElement.style.overflow = 'auto';
	    }
	    return this;
	}



	/**
	 * [animate 动画函数]
	 * @param  {Object} obj [参数对象]
	 * @return {Base}  [Base对象]
	 */
	Base.prototype.animate = function(obj) {
	    for (var i = 0; i < this.elements.length; i++) {
	        var element = this.elements[i];
	        // 动画类型 默认为向右的运动动画
	        var attr = obj['attr'] == 'x' ? 'left' :
			           obj['attr'] == 'y' ? 'top' :
			           obj['attr'] == 'w' ? 'width' :
			           obj['attr'] == 'h' ? 'height' :
			           obj['attr'] == 'o' ? 'opacity' :
			           obj['attr'] != 'undefined' ? 
			           obj['attr'] : 'left';

	        var start = obj['start'] != undefined ?
			            obj['start'] :
			            attr == 'opacity' ?
			            parseFloat(getStyle(element, attr)) * 100 :
			            parseInt(getStyle(element, attr));

	        var t = obj['t'] != undefined ? obj['t'] : 30; //可选，默认30毫秒执行一次
	        var step = obj['step'] != undefined ? obj['step'] : 10; //可选，每次运行10像素

	        var alter = obj['alter'];
	        var target = obj['target'];
	        var mul = obj['mul']

	        var speed = obj['speed'] != undefined ? obj['speed'] : 6; //可选，默认缓冲速度为6
	        var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer'; //可选，0表示匀速，1表示缓冲，默认缓冲


	        if (alter != undefined && target == undefined) {
	            target = alter + start;
	        } else if (alter == undefined && target == undefined && mul == undefined) {
	            throw new Error('alter增量或target目标量必须传一个！');
	        }

	        if (start > target) step = -step;

	        if (attr == 'opacity') {
	            element.style.opacity = parseInt(start) / 100;
	            element.style.filter = 'alpha(opacity=' + parseInt(start) + ')';
	        } else {
	            element.style[attr] = start + 'px';
	        }

	        /**
	         * [mul description]
	         * @type {[type]}
	         */
	        if (mul == undefined) {
	            mul = {};
	            mul[attr] = target;
	        }
	        //多组动画
	        clearInterval(element.timer);
	        element.timer = setInterval(function() {
	            //创建一个bool值,可以了解多个动画是否全部执行完毕
	            var flag = true;
	            for (var i in mul) {
	                attr = i == 'x' ? 'left' :
		                   i == 'y' ? 'top' :
		                   i == 'w' ? 'width' :
		                   i == 'h' ? 'height' :
		                   i == 'o' ? 'opacity' :
		                   i != undefined ?
		                   i : 'left';
	                target = mul[i];
	                if (type == 'buffer') {
	                    step = attr == 'opacity' ?
	                        (target - parseFloat(getStyle(element, attr)) * 100) / speed :
	                        (target - parseInt(getStyle(element, attr))) / speed;
	                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
	                }

	                /**
	                 * [attr 动画形式]
	                 * @type {String}
	                 */
	                if (attr == 'opacity') { // 若为渐变动画
	                    if (step == 0) {
	                        setOpacity();
	                    } else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
	                        setOpacity();
	                    } else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
	                        setOpacity();
	                    } else {
	                        var temp = parseFloat(getStyle(element, attr)) * 100;
	                        element.style.opacity = parseInt(temp + step) / 100;
	                        element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
	                    }
	                    if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;
	                } else { // 运动动画
	                    if (step == 0) {
	                        setTarget();
	                    } else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
	                        setTarget();
	                    } else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
	                        setTarget();
	                    } else {
	                        element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
	                    }
	                    if (parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
	                }
	            };
	            if (flag) {
	                clearInterval(element.timer);
	                if (obj.fn != undefined) obj.fn();
	            }
	        }, t);

	        /**
	         * [setTarget 运动函数]
	         */
	        function setTarget() {
	            element.style[attr] = target + 'px';
	        }

	        /**
	         * [setOpacity 渐变函数]
	         */
	        function setOpacity() {
	            element.style.opacity = parseInt(target) / 100;
	            element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
	        }
	    }
	    return this;
	}


	/**
	 * [extend 插件入坑]
	 * @param  {String}   name [插件名称]
	 * @param  {Function} fn   [插件主体]
	 * @return {Void}          [Null]
	 */
	Base.prototype.extend = function(name, fn) {
	    Base.prototype[name] = fn;
	}

	
	/**
	 * [fuck Fuck]
	 * @return {Void} [Null]
	 */
	Base.prototype.fuck = function() {
	    console.log('Fuck the Life!');
	    this.fuck();
	}