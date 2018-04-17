define(['jquery','echarts','bar-slider','bar-header','ie-tip'], function($, echarts){
	
	function onclick(obj,toggle){
		$(obj).on('click', function() {
		//获取点击li的索引
		var _index = $(this).index();
		// 左侧分离切换
		$(this).addClass('active').siblings('li').removeClass('active');
		//右侧图表切换
		$(toggle).eq(_index).addClass('active').siblings('li').removeClass('active')
		});
	}
	//热销产品种类分析  分类切换；
	onclick('.product .left-lis li','.product .right-lis .box');
	//热销产品排行  分类切换；
	onclick('.hot-sell .lis li','.hot-sell .full');
	//药商快讯列表 分类切换；
	onclick('.news .left-lis li','.news .right-lis .box');

	// 热销供应产品饼状图
	// for (var i = 0; i <= 3; i++) {
	// 	var chartHotSell = echarts.init(document.getElementsByClassName('chart-hot-sell')[i]);
	// 	var _width=document.getElementsByClassName('chart-hot-sell')[i].offsetWidth;
	// 	// 指定图表的配置项和数据
	// 	var hotSellOption = {
	// 	    tooltip : {
	// 	        trigger: 'item',
	// 	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 	    },
	// 	    toolbox: {
	// 	        show : true,
	// 	        feature : {
	// 	            mark : {show: true},
	// 	            magicType : {
	// 	                show: true,
	// 	                type: ['pie', 'funnel']
	// 	            }
	// 	        }
	// 	    },
	// 	    calculable : true,
	// 	    series : [
	// 	        {
	// 	            name:'面积模式',
	// 	            type:'pie',
	// 	            radius : [30, 110],
	// 	            center : ['50%', '50%'],
	// 	            roseType : 'area',
	// 	            data:[
	// 	                {value:0, name:'rose1'},
	// 	                {value:0, name:'rose2'},
	// 	                {value:0, name:'rose3'},
	// 	                {value:0, name:'rose4'},
	// 	                {value:0, name:'rose5'},
	// 	                {value:0, name:'rose6'},
	// 	                {value:0, name:'rose7'},
	// 	                {value:0, name:'rose8'}
	// 	            ]
	// 	        }
	// 	    ]
	// 	};
	// 	// 使用刚指定的配置项和数据显示图表。
	// 	chartHotSell.setOption(hotSellOption);
	// }

	// 7天交易总额趋势曲线图
	var chartDeal = echarts.init(document.getElementsByClassName('chart-deal')[0]);
	// 指定图表的配置项和数据
	var dealOption = {
	    tooltip: {
	        trigger: 'item'
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: ['2017-6-1','2017-6-2','2017-6-3','2017-6-4','2017-6-5','2017-6-6','今天']
	     },
	    yAxis: {
	        type: 'value'
	     },
	    series: [
	        {
	            name:'交易总额',
	            type:'line',
	            stack: '总量',
	            data:[0, 0, 0, 0, 0, 0,]
	        },
		    {
		    	name:'交易总额',
	            type:'line',
	            stack: '总量',
	            lineStyle: {
                    normal: {
                        type: 'dashed'
                    }
                },
                label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
	            data: [ , , , , , 0, 0]
	        }
	    ],
	    itemStyle: {
            normal: {
                color: '#178FE5'
            }
        }
	 };
	 // 使用刚指定的配置项和数据显示图表。
	 chartDeal.setOption(dealOption);
});

