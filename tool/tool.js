/**
 * Excelsior库 工具函数
 * Create By Excelsior
 * Date 2014-11-15
 */

(function() {
    window.sys = {}; //让外部可以访问
    var ua = navigator.userAgent.toLowerCase();
    var s; //浏览器信息数组
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0
})();


/**
 * [addDomLoaded DOM加载]
 * @param {Function} fn [description]
 */
function addDomLoaded(fn) {
    var isReady = false;
    var timer = null;

    function doReady() {
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }

    if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
        timer = setInterval(function() {
            if (document && document.getElementById && document.getElementsByTagName && document.body) {
                doReady();
            }
        }, 1);
    } else if (document.addEventListener) { //W3C
        addEvent(document, 'DOMContentLoaded', function() {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);
        });
    } else if (sys.ie && sys.ie < 9) {
        var timer = null;
        timer = setInterval(function() {
            try {
                document.documentElement.doScroll('left');
                doReady();
            } catch (e) {};
        }, 1);
    }
}


/**
 * [addEvent 现代事件绑定]
 * @param {[type]}   obj  [description]
 * @param {[type]}   type [description]
 * @param {Function} fn   [description]
 */
function addEvent(obj, type, fn) {
    if (typeof obj.addEventListener != "undefined") {
        obj.addEventListener(type, fn, false);
    } else {
        //创建一个存放事件的哈希表
        if (!obj.events) {
            //通过在传入的对象中创建哈希表可实现和removeEvent的共享
            obj.events = {};
        }
        //第一次执行
        if (!obj.events[type]) {
            //创建一个存放事件处理函数的数组
            obj.events[type] = [];
            //把第一次的事件处理函数储存
            if (obj['on' + type]) {
                obj.events[type][0] = fn;
            }
        } else {
            if (addEvent.equal(obj.events[type], fn)) {
                return false;
            }
        }
        //第二次执行用计数器来存储
        obj.events[type][addEvent.ID++] = fn;
        //执行事件处理函数
        obj['on' + type] = addEvent.exec;
    }
}

addEvent.exec = function(event) {
    var e = event || addEvent.fixEvent(window.event);
    var es = this.events[e.type];
    for (var i in this.events[e.type]) {
        es[i].call(this, e);
    };
}
addEvent.ID = 1; //计数器

//同一个绑定函数进行屏蔽
addEvent.equal = function(es, fn) {
    for (var i in es) {
        return es[i] == fn ? true : false;
    }
}

//把IE中的event匹配到w3c
addEvent.fixEvent = function(event) {
    event.preventDefault = addEvent.fixEvent.preventDefault;
    event.stopPropagation = addEvent.fixEvent.stopPropagation;
    event.target = event.srcElement;
    return event;
}

//IE阻止默认行为
addEvent.fixEvent.preventDefault = function() {
    this.returnValue = false;
}

//IE取消冒泡
addEvent.fixEvent.stopPropagation = function() {
    this.cancelBubble = true;
}

//跨浏览器删除事件
function removeEvent(obj, type, fn) {
    if (typeof obj.removeEventListener != "undefined") {
        obj.removeEventListener(type, fn, false);
    } else {
        if (obj.events) {
            for (var i in obj.events[type]) {
                if (obj.events[type][i] == fn) {
                    delete obj.events[type][i];
                }
            }
        }
    }
}

function getInnerText(element) {
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

function setInnerText(element, text) {
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}

//跨浏览器获取窗口大小
function getInner() {
    if (typeof window.innerWidth != "undefined") {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}

//跨浏览器获取滚动条位置
function getScroll() {
    return {
        top: document.documentElement.scrollTop || document.body.scrollTop,
        left: document.documentElement.scrollLeft || document.body.scrollLeft
    }
}

//获取css
function getStyle(element, attr) {
    var value;
    if (typeof window.getComputedStyle != "undefined") { //W3C
        value = window.getComputedStyle(element, null)[attr];
    } else if (typeof element.currentStyle != "undefined") { //IE
        value = element.currentStyle[attr];
    }
    return value;
}

//判断class是否存在
function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}


/**
 * [getEvent 跨浏览器获取event对象]
 * @param  {Object} event [event对象]
 * @return {Object}       [event对象]
 */
function getEvent(event) {
    return event || window.event;
}


/**
 * [trim 删除左右空格]
 * @param  {String} str [操作字符窜]
 * @return {String}     [处理后的字符串]
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

//滚动条清零
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}


function offsetTop(element){
    var top = element.offsetTop;
    var parent = element.offsetParent;
    while(parent != null){
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return top;
}


function inArray(value, array){
    for(var i in array){
        if(array[i] === value) return true;
    }
    return false;
}

function log(msg){
    console.log(msg);
}