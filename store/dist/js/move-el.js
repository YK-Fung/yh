var edit;
define(['jquery'],function($){

    edit = function(targetEl,moveRange,moveEl,zIndex){
        var obj = {
            // 鼠标点击的目标
            'targetEl':targetEl,
            // 移动的范围
            'moveRange': moveRange,
            // 移动的提示语、宽、高
            'moveEl':moveEl,
            'moveElW':'',
            'moveElH':'',
            //允许最高多少级
            'zIndex':zIndex,
            //限制层级
            'isparent':null,
            // 移动对象id
            'targetId': '',
            ajaxFn: function () {
            },
            ajaxFn2: function () {

            },
            //角色管理
            roleAjax: function(){

            }
        };

        $(document).on('focus', 'input[readonly]', function () {
            this.blur();
        });

        // 失焦取消菜单选中
        $(document).on('click', function() {
            $(obj.targetEl).removeClass('active');
        });

        // 切换左侧导航
        $(document).on('click', '.box .toggle-ctn',function() {
            if($(this).parent('.box').hasClass('cur')){
                $(this).parent('.box').removeClass('cur');
            }else {
                $(this).parent('.box').addClass('cur').siblings('.box').removeClass('cur');
            }
        });

        // 移动模块
        //鼠标按下
        $(document).on('mousedown', obj.targetEl, function(event) {
            var e = event || window.event;
            obj.source = $(this);
            // 鼠标按下，改为true
            obj.isDown = true;
            //获取该html
            obj.moduleHtml = obj.source.parent().clone();
            //获取内容
            obj.moduleText = obj.source.val();
            // 赋值给提示语
            $(obj.moveEl).text(obj.moduleText);
            //事件元素相对于窗口的X,Y坐标
            obj.offsetX = $(this).offset().left - $(window).scrollLeft();
            obj.offsetY = $(this).offset().top - $(window).scrollTop();
            // 鼠标位于对象位置的x,y轴
            obj.viewX = e.pageX - obj.offsetX;
            obj.viewY = e.pageY - obj.offsetY;
            //设置宽度
            obj.moveElW = obj.source.width()-10;
            obj.moveElH = $(obj.moveEl).height();
            // 给移动的提示语设置文字、样式、位置
            $(obj.moveEl).css({
                'width':obj.moveElW
            });
            //移动对象id
            obj.targetId = obj.source.attr('data');
            obj.child = $(this).parent().parent().children('.box').length;
            obj.toggle = $(this).parent().parent().children('.toggle-ctn');
            e.stopPropagation();
        });

        //鼠标移动
        $(obj.moveRange).on('mousemove', function(event) {
            var e = event || window.event;
            if(obj.isDown){
                // 获取需要移动后的坐标并设置。
                obj.moveX = e.pageX - obj.viewX;
                obj.moveY = e.pageY - obj.viewY;
                // 获取需要移动后的坐标并设置。
                obj.set = setTimeout(function(){
                    $(obj.moveEl).css({
                        'display':'block',
                        'top':obj.moveY,
                        'left':obj.moveX
                    })
                },100)
                //判断允许最高多少级
                if(obj.zIndex == 1){
                    obj.isparent = 'one';
                }else if (obj.zIndex == 2) {
                    if(obj.source.parent().children('.box').length>0){
                        //是一级菜单
                        obj.isparent = 'one';
                    }else {
                        //是二级菜单
                        obj.isparent = 'two';
                    }
                }else if (obj.zIndex == 0) {
                    obj.isparent = 'infinite';
                }

                //碰撞检测,在目标添加活动状态
                $(obj.targetEl).each(function() {
                    obj.moveT = $(obj.moveEl).offset().top - $(window).scrollTop();
                    obj.tarT = $(this).offset().top - $(window).scrollTop();
                    obj.moveB = obj.moveT + obj.moveElH;
                    obj.tarB = obj.tarT + $(this).height();
                    obj.moveL = $(obj.moveEl).offset().left - $(window).scrollLeft();
                    obj.tarL = $(this).offset().left - $(window).scrollLeft();
                    obj.moveR = obj.moveL+obj.moveElW;
                    obj.tarR = obj.tarL + $(this).width();
                    //拖动元素是二级菜单情况下
                    if(obj.isparent == 'two'){
                        //内移
                        if (obj.moveT+5 >= obj.tarT && obj.moveB-5 <= obj.tarB && obj.moveL >= obj.tarL && obj.moveR <= obj.tarR) {
                            //碰撞目标是一级菜单
                            if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list') && $(this).val() != obj.moduleText){
                                $(this).addClass('intrue');
                            }
                        }
                        //下移
                        else if (obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
                            $(this).addClass('after-true');
                        }
                        //上移
                        else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
                            $(this).addClass('before-true');
                        }
                        //条件不成立
                        else {
                            $(this).removeClass('intrue after-true before-true');
                        }
                    }
                    //拖动元素是一级菜单情况下
                    else if(obj.isparent == 'one'){
                        //下移
                        if (obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
                            //碰撞目标是一级菜单
                            if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list')){
                                $(this).addClass('after-true');
                            }
                        }
                        //上移
                        else if(obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR+20) {
                            //碰撞目标是一级菜单
                            if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list')){
                                $(this).addClass('before-true');
                            }
                        }
                        //条件不成立
                        else {
                            $(this).removeClass('intrue after-true before-true');
                        }
                    }
                    //不限级别
                    if(obj.isparent == 'infinite'){
                        //内移
                        if (obj.moveT+5 >= obj.tarT && obj.moveB-5 <= obj.tarB && obj.moveL >= obj.tarL  && obj.moveL <= obj.tarR) {
                            $(this).addClass('intrue');
                        }
                        //下移
                        else if (obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveL <= obj.tarR) {
                            $(this).addClass('after-true');
                        }
                        //上移
                        else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveL <= obj.tarR) {
                            $(this).addClass('before-true');
                        }
                        //条件不成立
                        else {
                            $(this).removeClass('intrue after-true before-true');
                        }
                    }
                });
            }else {
                $(obj.moveEl).css('display', 'none');
            }
            e.stopPropagation();
        });
        //鼠标松开
        $(document).on('mouseup', function(event) {
            var e = event || window.event;
            clearTimeout(obj.set);
            // 鼠标松开，改为false
            if(!obj.isDown){
                return false;
            }
            obj.isDown = false;
            // 碰撞检测,在目标dom插入对应内容
            $(obj.targetEl).each(function() {
                obj.moveT = $(obj.moveEl).offset().top - $(window).scrollTop();
                obj.tarT = $(this).offset().top - $(window).scrollTop();
                obj.moveB = obj.moveT + obj.moveElH;
                obj.tarB = obj.tarT + $(this).height();
                obj.moveL = $(obj.moveEl).offset().left - $(window).scrollLeft();
                obj.tarL = $(this).offset().left - $(window).scrollLeft();
                obj.moveR = obj.moveL+obj.moveElW;
                obj.tarR = obj.tarL + $(this).width();
                //拖动元素是二级菜单情况下
                if(obj.isparent == 'two' && obj.moduleHtml){
                    //内移
                    if (obj.moveT+5 >= obj.tarT && obj.moveB-5 <= obj.tarB && obj.moveL >= obj.tarL && obj.moveR <= obj.tarR) {
                        //拖动元素如果存在父级 不允许出现三级菜单
                        if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list') && $(this).val() != obj.moduleText){
                            //是一级菜单
                            var parent = obj.source.parent().parent();
                            $(this).after(obj.moduleHtml);
                            obj.source.parent().remove();

                            //如果没有子级删除切换按钮
                            if(obj.child <= 1 && $(this).val() != obj.source.val()){
                                obj.toggle.remove();
                            }

                            //增加和移除加减icon
                            if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 0){
                                //当子级数量为1 添加切换按钮并且展开
                                $(this).before('<i class="toggle-ctn"></i>');
                                $(this).parent().addClass('cur').siblings('.box').removeClass('cur');
                            }else if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 1){
                                //当子级数量为多 展开内容
                                $(this).parent().addClass('cur').siblings('.box').removeClass('cur');
                            }

                            // ajax
                            //拖进2级菜单完成ajax
                            var idArray = new Array();
                            $(this).siblings('.box').each(function(i) {
                                //获取二级菜单的id
                                idArray[i] = $(this).children('input').attr('data');
                            });
                            //移动后父级id
                            var parentId = $(this).attr('data');
                            obj.ajaxFn(idArray,1,parentId);

                            obj.ajaxFn2(obj.source,$(this),parentId);
                            // obj.ajaxFn2(obj.source,parent,parentId);
                            // 重置
                            reset();

                            //参数（移动后的级别0 1，移动后同级全部的id，父级的id）
                        }
                    }
                    //下移
                    else if(obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR && obj.moveT != 0) {
                        var parent = obj.source.parent().parent();
                        $(this).parent().after(obj.moduleHtml);
                        obj.source.parent().remove();

                        //如果没有子级删除切换按钮
                        if(obj.child <= 1 && $(this).val() != obj.source.val()){
                            obj.toggle.remove();
                        }

                        // ajax
                        //拖动未同级菜单完成ajax
                        var idArray = new Array();
                        $(this).parent('.box').parent().children('.box').each(function(i) {
                            //获取二级菜单的id
                            idArray[i] = $(this).children('input').attr('data');
                        })
                        var parentId = $(this).parent('.box').siblings('input').attr('data');

                        if($(this).parent().parent().hasClass('list')){
                            //一级同级
                            obj.ajaxFn(idArray,0,0);
                            obj.ajaxFn2(obj.source,parent,0);
                            //参数（移动后的级别0 1，移动后同级全部的id，父级的id）
                        }else{
                            //二级同级
                            obj.ajaxFn(idArray,1,parentId);
                            obj.ajaxFn2(obj.source,parent,parentId);
                            //参数（移动后的级别0 1，移动后同级全部的id，父级的id）
                        }
                        // 重置
                        reset();

                    }else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR && obj.moveT != 0) {
                        var parent = obj.source.parent().parent();
                        $(this).parent().before(obj.moduleHtml);
                        obj.source.parent().remove();

                        //如果没有子级删除切换按钮
                        if(obj.child <= 1 && $(this).val() != obj.source.val()){
                            obj.toggle.remove();
                        }


                        //拖动未同级菜单完成ajax
                        var idArray = new Array();
                        $(this).parent('.box').parent().children('.box').each(function(i) {
                            //获取二级菜单的id
                            idArray[i] = $(this).children('input').attr('data');
                        })
                        var parentId = $(this).parent('.box').siblings('input').attr('data');

                        if($(this).parent().parent().hasClass('list')){
                            //一级同级
                            obj.ajaxFn(idArray,0,0);
                            obj.ajaxFn2(obj.source,parent,0);
                            //参数（移动后的级别0 1，移动后同级全部的id，父级的id）
                        }else{
                            //二级同级
                            obj.ajaxFn(idArray,1,parentId);
                            obj.ajaxFn2(obj.source,parent,parentId);

                            //参数（移动后同级全部的id，移动后的级别0 1，父级的id）
                        }
                        // 重置
                        reset();
                    }
                }
                //拖动元素是一级菜单情况下
                else if(obj.isparent == 'one' && obj.moduleHtml){
                    //下移
                    if(obj.moveT-15 <= obj.tarT && obj.moveB-5 >= obj.tarB && obj.moveR-20 <= obj.tarR && obj.moveT != 0){
                        //1级菜单之间的拖动(下) 碰撞目标是一级菜单
                        if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list')){
                            $(this).parent().after(obj.moduleHtml);
                            obj.source.parent().remove();
                            var parent = obj.source.parent().parent();
                            //拖动未同级菜单完成ajax
                            var idArray = new Array();
                            $(this).parent('.box').parent().children('.box').each(function(i) {
                                //获取二级菜单的id
                                idArray[i] = $(this).children('input').attr('data');
                            })
                            //一级同级
                            obj.ajaxFn(idArray,0,0);
                            obj.ajaxFn2(obj.source,parent,0);
                            // 重置
                            reset();
                            //参数（移动后的级别0 1，移动后同级全部的id，父级的id）
                        }
                    }
                    //上移
                    else if (obj.moveT+5 <= obj.tarT && obj.moveB+15 >= obj.tarB && obj.moveR-20 <= obj.tarR && obj.moveT != 0) {
                        //1级菜单之间的拖动(上) 碰撞目标是一级菜单
                        if($(this).parent().children('.box').length>0 || $(this).parent().parent().hasClass('list')){
                           $(this).parent().before(obj.moduleHtml);
                            obj.source.parent().remove();
                            //拖动未同级菜单完成ajax
                            var idArray = new Array();
                            $(this).parent('.box').parent().children('.box').each(function(i) {
                                //获取二级菜单的id
                                idArray[i] = $(this).children('input').attr('data');
                            })
                            // 重置
                            reset();
                            //一级同级
                            obj.ajaxFn(idArray,0,0);
                        }
                    }
                }
                //不限级别
                if(obj.isparent == 'infinite' && obj.moduleHtml){
                    //移动的对象不能为碰撞对象的父级
                    obj.targetVal = $(this).val();//碰撞对象的命名
                    obj.execute = 0;
                    obj.source.parent('.box').find('.box').each(function() {
                        if(obj.targetVal == $(this).find('input').val()){
                            obj.execute ++;
                        }
                    });
                    //内移
                    if (obj.moveT+5 > obj.tarT && obj.moveB-5 < obj.tarB && obj.moveL > obj.tarL && obj.moveL <= obj.tarR) {
                        if($(this).val() != obj.moduleText && obj.execute <= 0){
                            //是一级菜单
                            var parent = obj.source.parent().parent();
                            $(this).after(obj.moduleHtml);
                            obj.source.parent().remove();

                            //如果没有子级删除切换按钮
                            if(obj.child <= 1 && $(this).val() != obj.source.val()){
                                obj.toggle.remove();
                            }

                            //增加和移除加减icon
                            if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 0){
                                //当子级数量为1 添加切换按钮并且展开
                                $(this).before('<i class="toggle-ctn"></i>');
                                $(this).parent().addClass('cur').siblings('.box').removeClass('cur');
                            }else if($(this).parent().children('.box').length > 0 && $(this).siblings('.toggle-ctn').length == 1){
                                //当子级数量为多 展开内容
                                $(this).parent().addClass('cur').siblings('.box').removeClass('cur');
                            }
		                    //移动后父级id
		                    var parentId = $(this).attr('data');
                            ajaxGroup(parentId);
                            // 重置
                            reset();
                        }
                    }
                    //下移
                    else if(obj.moveT-15 < obj.tarT && obj.moveB-5 > obj.tarB && obj.moveL <= obj.tarR && obj.moveT != 0) {
                        if($(this).val() != obj.moduleText && obj.execute <= 0){
                            var parent = obj.source.parent().parent();
                            $(this).parent().after(obj.moduleHtml);
                            obj.source.parent().remove();

                            //如果没有子级删除切换按钮
                            if(obj.child <= 1 && $(this).val() != obj.source.val()){
                                obj.toggle.remove();
                            }
                            //移动后父级id
		                    var parentId = $(this).parent('.box').siblings('input').attr('data');
                            ajaxGroup(parentId);
                            // 重置
                            reset();
                        }
                    }else if (obj.moveT+5 < obj.tarT && obj.moveB+15 > obj.tarB && obj.moveL <= obj.tarR && obj.moveT != 0) {
                        if($(this).val() != obj.moduleText && obj.execute <= 0){
                            var parent = obj.source.parent().parent();
                            $(this).parent().before(obj.moduleHtml);
                            obj.source.parent().remove();

                            //如果没有子级删除切换按钮
                            if(obj.child <= 1 && $(this).val() != obj.source.val()){
                                obj.toggle.remove();
                            }
                            //移动后父级id
		                    var parentId = $(this).parent('.box').siblings('input').attr('data');
                            ajaxGroup(parentId);
                            // 重置
                            reset();
                        }
                    }
                }
                // 角色管理传参
                function ajaxGroup(parentId){
                    var moveTargetEL = $(".list input[data="+obj.targetId+"]").parent('.box');
                    if(moveTargetEL.parent().hasClass('list')){
                        var targetIndex = moveTargetEL.index();
                        obj.roleAjax(obj.targetId,0,targetIndex);//参数（本身id,父级id,移动后下标）
                    }else {
                        var targetIndex = moveTargetEL.index()-2;
                        obj.roleAjax(obj.targetId,parentId,targetIndex);//参数（本身id,父级id,移动后下标）
                    }
                }
            });
            // 重置
            function reset(){
                 //清空提示语html
                obj.moduleHtml = '';
                //清空提示语内容
                obj.moduleText = '';
                //隐藏提示语
                $(obj.moveEl).text('');
                $(obj.moveEl).css('display', 'none');
                //样式移除
                $(obj.targetEl).removeClass('intrue after-true before-true');
                return false;
            }
            reset();
            e.stopPropagation();
        });
        return obj;
    }
});
