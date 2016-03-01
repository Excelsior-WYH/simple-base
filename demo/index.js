        
    function popupForm(str, width, height) {
        var screen = $('#screen');
        var element = $('#' + str);
        element.center(width, height).resize(function() {
            if (element.css('display') == 'block') {
                screen.lock();
            }
        });
        //点击了登录文字会弹出
        $('#header .' + str).click(function() {
            element.center(width, height)
            element.css('display', 'block');
            //获取锁屏
            screen.lock().animate({ //背景渐变
                attr: 'o',
                target: 30,
                t: 30,
                step: 10
            });
        });
        //点击了关闭图片会隐藏
        $('#' + str + ' .close').click(function() {
            element.css('display', 'none');
            //先执行渐变动画再取消锁屏
            screen.animate({
                attr: 'o',
                target: 0,
                t: 30,
                step: 10,
                fn: function() {
                    screen.unlock();
                }
            });
        });
        element.drag($('#' + str + ' h2').first()); //拖拽
    }
    
    $(function() {

        $('#header .member').hover(function() {
            $(this).css('background', 'url(images/arrow2.png) no-repeat 55px center');
            $('#header .member_ul').show().animate({ //根据class获取到下拉列表,设置显示
                t: 30,
                step: 10,
                mul: {
                    o: 100,
                    h: 120
                }
            })
        }, function() {
            $(this).css('background', 'url(images/arrow2.png) no-repeat 55px center');
            $('#header .member_ul').animate({
                t: 30,
                step: 10,
                mul: {
                    o: 0,
                    h: 0
                },
                fn: function() {
                    $('#header .member_ul').hide(); //设置隐藏
                }
            })
            
        });


        popupForm('login', 350, 250);
        popupForm('reg', 600, 550);
        // 注册用户名的验证
        $('form').form('user').bind('focus', function() {
            $('#reg .info_user').show();
            $('#reg .info_user').hide();
            $('#reg .succ_user').hide();
        }).bind('blur', function() {
            if (trim($(this).value()) == '') {
                $('#reg .info_user').hide();
                $('#reg .succ_user').hide();
                $('#reg .error_user').hide();
            } else if (!checkUser()) {
                $('#reg .error_user').show();
                $('#reg .info_user').hide();
                $('#reg .succ_user').hide();
            } else {
                $('#reg .succ_user').show();
                $('#reg .info_user').hide();
                $('#reg .error_user').hide();
            }

        })

        function checkUser(){
            if(/[\w]{2,20}/.test(trim($('form').form('user').value()))) return true;
        }

        // 注册用户的密码验证
        $('form').form('pass').bind('focus', function() {
            $('#reg .info_pass').show();
            $('#reg .error_pass').hide();
            $('#reg .succ_pass').hide();
        }).bind('blur', function() {
            if (trim($(this).value()) == '') {
                $('#reg .info_pass').hide();
            } else {
                if (checkPass()) {
                    $('#reg .info_pass').hide();
                    $('#reg .error_pass').hide();
                    $('#reg .succ_pass').show();
                } else {
                    $('#reg .info_pass').hide();
                    $('#reg .error_pass').show();
                    $('#reg .succ_pass').hide();
                }
            }
        })
        // 注册用户的密码安全等级提示
        $('form').form('pass').bind('keyup', function() {
            checkPass();
        })

        // 密码重复验证
        $('form').form('notpass').bind('focus', function() {
            $('#reg .info_notpass').show();
            $('#reg .error_notpass').hide();
            $('#reg .succ_notpass').hide();
        }).bind('blur', function() {
            if (trim($(this).value()) == '') {
                $('#reg .info_notpass').hide();
            } else if (checkNotPass()) {
                $('#reg .info_notpass').hide();
                $('#reg .error_notpass').hide();
                $('#reg .succ_notpass').show();
            } else {
                $('#reg .info_notpass').hide();
                $('#reg .error_notpass').show();
                $('#reg .succ_notpass').hide();
            }
        })

        function checkNotPass(){
            if (trim($('form').form('notpass').value()) == trim($('form').form('pass').value())) return true;
        }


        // 问题回答验证
        $('form').form('ans').bind('focus', function() {
            $('#reg .info_ans').show();
            $('#reg .error_ans').hide();
            $('#reg .succ_ans').hide();
        }).bind('blur', function() {
            if (trim($(this).value()) == '') {
                $('#reg .info_ans').hide();
            } else if (trim($(this).value()).length >= 2 && trim($(this).value()).length <= 32) {
                $('#reg .info_ans').hide();
                $('#reg .error_ans').hide();
                $('#reg .succ_ans').show();
            } else {
                $('#reg .info_ans').hide();
                $('#reg .error_ans').show();
                $('#reg .succ_ans').hide();
            }
        })


        // 邮箱验证
        $('form').form('email').bind('focus', function() {
            // 补全界面
            if ($(this).value().indexOf('@') == -1) {
                $('#reg .all_email').show();
            }
            $('#reg .info_email').show();
            $('#reg .error_email').hide();
            $('#reg .succ_email').hide();
        }).bind('blur', function() {
            $('#reg .all_email').hide();
            if (trim($(this).value()) == '') {
                $('#reg .info_email').hide();
            } else if (/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($(this).value()))) {
                $('#reg .info_email').hide();
                $('#reg .error_email').hide();
                $('#reg .succ_email').show();
            } else {
                $('#reg .info_email').hide();
                $('#reg .error_email').show();
                $('#reg .succ_email').hide();
            }
        })

        $('form').form('email').bind('keyup', function(event) {
            if ($(this).value().indexOf('@') == -1) {
                $('#reg .all_email').show();
                $('#reg .all_email li span').html($(this).value());
            } else {
                $('#reg .all_email').hide();
            }

            var liLength = $('#reg .all_email li').length();
            $('#reg .all_email li').css('background', 'none');
            $('#reg .all_email li').css('color', '#666');
            autoComplete(this, liLength); // 通过键盘选择
        })

        // 邮箱自动补全界面显示
        $('#reg .all_email li').hover(function() {
            $(this).css('background', '#e5edf2');
            $(this).css('color', '#369')
        }, function() {
            $(this).css('background', 'none');
            $(this).css('color', '#666')
        })

        // 点击获取
        $('#reg .all_email li').bind('mousedown', function() {
            $('form').form('email').value(trim($(this).text()));
        })


        // 日期的选择
        var year = $('form').form('year');
        var month = $('form').form('month');
        var day = $('form').form('day');
        var smallMonths = [4, 6, 9, 11];
        var bigMonths = [1, 3, 5, 7, 8, 10, 12];

        // 年份
        for (var i = 1950; i <= 2014; i++) {
            year.first().add(new Option(i, i), undefined);
        }

        // 月份
        for (var i = 1; i <= 12; i++) {
            month.first().add(new Option(i, i), undefined);
        }


        // 每月天数
        year.bind('change', selectDay)
        month.bind('change', selectDay)
        function selectDay() {
            var monthValue = month.value();
            if (year.value() != 0 && monthValue != 0) {
                day.first().options.length = 1; // 清空上次选择产生的天数
                // 大月
                if (inArray(parseInt(monthValue), bigMonths)) {
                    createDay(31);
                } else if (inArray(parseInt(monthValue), smallMonths)) { // 小月
                    createDay(30);
                } else {
                    // 闰年
                    if (parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0 || parseInt(year.value()) % 400 == 0) {
                        createDay(29);
                    } else {
                        createDay(28); // 平年
                    }
                }
            } else {
                day.first().options.length = 1; // 清空上次选择产生的天数
            }
        }


        $('form').form('ps').bind('keyup', checkNote).bind('paste', function() {
            setTimeout(checkNote, 50);
        })

        // 清空
        $('#reg .ps. .clear').click(function() {
            $('form').form('ps').value($('form').form('ps').value().substring(0, 5));
            checkNote();
        })


        /**
         * [checkNote 备注消息的验证]
         * @return {[type]} [description]
         */
        function checkNote() {
            var remainNum = 5 - $('form').form('ps').value().length;
            if (remainNum >= 0) {
                $('#reg .ps').eq(0).show();
                $('#reg .ps .num').eq(0).html(remainNum);
                $('#reg .ps').eq(1).hide()
            } else {
                $('#reg .ps').eq(0).hide();
                $('#reg .ps .num').eq(1).html(Math.abs(remainNum)).css('color', 'red');
                $('#reg .ps').eq(1).show()
            }
        }


        $('form').form('sub').click(function(){
            var flag = true;
            if (!checkUser()) flag = false;
            if (!checkPass()) flag = false; 
            if (!checkNotPass()) flag = false; 
            flag ? $('form').first().submit() : '';
        })

        //滑动导航
        $('#nav .black li').hover(function() {
            var target = $(this).first().offsetLeft;
            $('#nav span').animate({
                attr: 'x',
                target: target + 20,
                t: 30,
                step: 10
            });
        }, function() {
            $('#nav span').animate({
                attr: 'x',
                target: 20,
                t: 30,
                step: 10
            });
        });





        //百度分享侧栏初始换位子
        $('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px');
        $(window).bind('scroll', function() {
            $('#share').animate({
                attr: 'y',
                target: getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2
            });
        })

        //收缩效果
        $('#share').hover(function() {
            $(this).animate({
                attr: 'x',
                target: 0
            });
        }, function() {
            $(this).animate({
                attr: 'x',
                target: -211
            });
        });

        // 手风琴选项卡
        $('#sidebar h2').toggle(function() {
            $(this).next().animate({
                mul: {
                    h: 0,
                    o: 0
                }
            });
        }, function() {
            $(this).next().animate({
                mul: {
                    h: 150,
                    o: 100
                }
            })
        })

        // 轮播器初始化
        bannerInit(0);
        var bannerIndex = 1; // 轮播计数器
        // 自动轮播
        var bannerTimer = setInterval(bannerAuto, 1000);

        // 手动点击加载轮播器
        $('#banner ul li').hover(function(){
            clearInterval(bannerTimer);
            bannerStart(this, bannerIndex == 0 ? $('#banner ul li').length() - 1 : bannerIndex - 1);
        }, function(){
            bannerIndex = $(this).index() + 1;
            bannerTimer = setInterval(bannerAuto, 1000);
        })


        /**
         * [bannerInit description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        function bannerInit(){
            $('#banner img').opacity(0); // 全部隐藏
            $('#banner img').eq(0).show(); // 第一张显示
            $('#banner ul li').eq(0).css('color', '#333'); // 第一个圆点
            $('#banner strong').html($('#banner img').eq(0).attr('alt')); // 第一张图片的介绍
        }


        /**
         * [bannerStart description]
         * @return {[type]} [description]
         */
        function bannerStart(obj, prev){
            $('#banner ul li').css('color', '#999');
            $(obj).css('color', '#333');
            $('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'));
            $('#banner img').eq(prev).animate({
                attr: 'o',
                target: 0,
                t: 30,
                step: 10
            }).css('zIndex', 1);
            $('#banner img').eq($(obj).index()).animate({
                attr: 'o',
                target: 100,
                t: 30,
                step: 10
            }).css('zIndex', 2);
        }

        /**
         * [bannerAuto description]
         * @return {[type]} [description]
         */
        function bannerAuto(){
            if (bannerIndex >= $('#banner ul li').length()) bannerIndex = 0;
            bannerStart($('#banner ul li').eq(bannerIndex).first(), bannerIndex == 0 ? $('#banner ul li').length() - 1 : bannerIndex - 1);
            bannerIndex++;
        }


        // 延迟加载
        $('.wait_load').eq(0).attr("src", $('.wait_load').eq(0).attr("xsrc"))

        // alert(offsetTop($('.wait_load').first()))

        var waitLoad = $('.wait_load');
        waitLoad.opacity(0);
        $(window).bind('scroll', waitLoad)
        $(window).bind('resize', waitLoad)

        
        function waitLoad(){
            setTimeout(function(){
                for (var i = 0; i < waitLoad.length(); i++) {
                    var _this = waitLoad.ge(i);
                    if (getInner().height + getScroll().top >= offsetTop(_this)) {
                        $(_this).attr("src", $(_this).attr("xsrc")).animate({
                            attr: 'o',
                            target: 100,
                            t: 30,
                            step: 10
                        })
                    }
                }
            }, 100)
        }

        $('form').form('sub').click(function(){
            alert($('form').eq(0).serialize());
        })


    });



    




    



    /**
     * [checkPass 验证密码]
     * @param  {[type]} _this [description]
     * @return {[type]}       [description]
     */
    function checkPass() {
        var value = trim($('form').form('pass').value()); // 用户输入的原始数据
        var valueLength = value.length; // 输入密码的长度
        var typeLength = 0; // 用来统计类型
        // 1、6-20个字符
        if (valueLength >= 6 && valueLength <= 20) {
            $('#reg .info_pass .q1').html('●').css('color', 'green')
        } else {
            $('#reg .info_pass .q1').html('○').css('color', '#666')
        }

        // 2、只能包含大小写字母、数字和非空格字符
        if (valueLength > 0 && !/\s/.test(value)) {
            $('#reg .info_pass .q2').html('●').css('color', 'green')
        } else {
            $('#reg .info_pass .q2').html('○').css('color', '#666')
        }

        // 3、大小写字母,数字,非空字符,2种以上
        if (/[\d]/.test(value)) typeLength++; // 数字
        if (/[a-z]/.test(value)) typeLength++; // 小写字母
        if (/[A-Z]/.test(value)) typeLength++; // 大写字母
        if (/[^\w]/.test(value)) typeLength++; // 字符

        if (typeLength >= 2) {
            $('#reg .info_pass .q3').html('●').css('color', 'green')
        } else {
            $('#reg .info_pass .q3').html('○').css('color', '#666')
        }


        // 安全等级的提示
        if (valueLength >= 10 && typeLength >= 3) { // 3种混输
            $('#reg .info_pass .s1').css('color', 'green');
            $('#reg .info_pass .s2').css('color', 'green');
            $('#reg .info_pass .s3').css('color', 'green');
            $('#reg .info_pass .s4').html('高').css('color', 'green');
        } else if (valueLength >= 8 && typeLength >= 2) { // 2种混输
            $('#reg .info_pass .s1').css('color', '#f60');
            $('#reg .info_pass .s2').css('color', '#f60');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html('中').css('color', '#f60');
        } else if (valueLength >= 1) { // 1种混输
            $('#reg .info_pass .s1').css('color', 'maroon');
            $('#reg .info_pass .s2').css('color', '#ccc');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html('低').css('color', 'maroon');
        } else { // 未输入
            $('#reg .info_pass .s1').css('color', '#ccc');
            $('#reg .info_pass .s2').css('color', '#ccc');
            $('#reg .info_pass .s3').css('color', '#ccc');
            $('#reg .info_pass .s4').html(' ')
        }

        if (valueLength >= 6 && valueLength <= 20 && typeLength >= 2 && !/\s/.test(value)) {
            return true;
        } else {
            return false;
        }

    }


    function autoComplete(_this, liLength) {
        if (event.keyCode == 40) {
            if (_this.index == undefined || _this.index >= liLength - 1) {
                _this.index = 0; // 计数器
            } else {
                _this.index++;
            }
            $('#reg .all_email li').eq(_this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(_this.index).css('color', '#369');
        }

        if (event.keyCode == 38) {
            if (_this.index == undefined || _this.index <= 0) {
                _this.index = liLength - 1;
            } else {
                _this.index--;
            }
            $('#reg .all_email li').eq(_this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(_this.index).css('color', '#369');
        }

        if (event.keyCode == 13) {
            $(_this).value(trim($('#reg .all_email li').eq(_this.index).text()));
            $('#reg .all_email').hide();
            _this.index = undefined;
        }
    }


    function createDay(endDay) {
        for (var i = 1; i <= endDay; i++) {
            $('form').form('day').first().add(new Option(i, i), undefined);
        }
    }