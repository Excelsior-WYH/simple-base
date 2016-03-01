##功能概述

仿照jQuery的API完成了一个简单的DOM操作库

##特性

- 单入口函数
- 支持简单的事件绑定
- 原生JS实现了简单动画
- 实现了jQuery中的常用方法
- 支持扩展(**extend**函数)

##目前已经实现的方法实现的

- attr
- addClass/removeClass
- valeu/text/html
- animate
- bind
- extend
- ......



###使用
	
	<script src="lodjs.js"></script>
	$(function() {
		// 简单选择器
		$('#demo')
		$('#demo .test')
		$('#demo span')
		$(.test)
		$('p')
		
		// 复杂选择器
		$('#demo').find('.test')
		$('#demo').find('.test').eq(1)
		$('#demo').find('.test').last()
		$('#demo').find('.test').first()
		
		// balabala
		$('#demo').find('.test').first().css({});
	
	})



