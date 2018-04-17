define(['jquery', 'echarts', 'china', 'bar-slider', 'bar-header','ie-tip'], function($, echarts){
	// 订单
	$('.tab-menu li').on('click', function () {
		var idx = $(this).index();
		$(this).addClass('active').siblings('li').removeClass('active');
		$('.tab-ctn li').eq(idx).show().siblings('li').hide();
	});


	// 周店铺浏览人数增长柱状图
	var chartPeople = echarts.init(document.getElementsByClassName('chart-people')[0]);
	// 指定图表的配置项和数据
	var peopleOption = {
        tooltip: {},
        xAxis: {
            data: ["06.01","06.02","06.03","06.04","06.05","06.06","06.07"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 5]
        }],
        itemStyle: {
            normal: {
                color: '#178FE5'
            }
        }
	};
	// 使用刚指定的配置项和数据显示图表。
	chartPeople.setOption(peopleOption);

	// 月交易总额趋势曲线图
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
	        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [
	        {
	            name: '交易总额',
	            type: 'line',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
	            data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, ]
	        },
		    {
	            type:'line',
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
	            data: [, , , ,, , , , , , 134, 50]
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

	// // 热销供应产品饼状图
	// var chartHotSell = echarts.init(document.getElementsByClassName('chart-hot-sell')[0]);
	// // 指定图表的配置项和数据
	// var hotSellOption = {
	//     tooltip : {
	//         trigger: 'item',
	//         formatter: "{a} <br/>{b} : {c} ({d}%)"
	//     },
	//     toolbox: {
	//         show : true,
	//         feature : {
	//             mark : {show: true},
	//             magicType : {
	//                 show: true,
	//                 type: ['pie', 'funnel']
	//             }
	//         }
	//     },
	//     calculable : true,
	//     series : [
	//         {
	//             name:'面积模式',
	//             type:'pie',
	//             radius : [30, 110],
	//             center : ['50%', '50%'],
	//             roseType : 'area',
	//             data:[
	//                 {value:10, name:'rose1'},
	//                 {value:5, name:'rose2'},
	//                 {value:15, name:'rose3'},
	//                 {value:25, name:'rose4'},
	//                 {value:20, name:'rose5'},
	//                 {value:35, name:'rose6'},
	//                 {value:30, name:'rose7'},
	//                 {value:40, name:'rose8'}
	//             ]
	//         }
	//     ]
	// };
	// // 使用刚指定的配置项和数据显示图表。
	// chartHotSell.setOption(hotSellOption);

	// 月交易订单分布地图
	function randomData() {
	    return Math.round(Math.random()*1000);
	}
	var chartDistribute = echarts.init(document.getElementsByClassName('chart-distribute')[0]);
	// 指定图表的配置项和数据
	var distributeOption = {
	    tooltip: {
	        trigger: 'item'
	    },
	    visualMap: {
	        min: 0,
	        max: 2500,
	        left: 'left',
	        top: 'bottom',
	        text: ['高','低'],           // 文本，默认为数值文本
	        inRange: {
	            color: ['#e0ffff', '#006edd']
	        },
	        calculable: true
	    },
        itemStyle: {
            normal:{
                borderColor: 'rgba(0, 0, 0, 0.1)'
            },
            emphasis:{
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
        },
	    toolbox: {
	        show: true,
	        orient: 'vertical',
	        left: 'right',
	        top: 'center'
	    },
	    series: [
	        {
	            name: '销量',
	            type: 'map',
	            mapType: 'china',
	            roam: false,
	            label: {
	                normal: {
	                    show: true
	                },
	                emphasis: {
	                    show: true
	                }
	            },
	            data:[
	                {name: '北京',value: randomData() },
	                {name: '天津',value: randomData() },
	                {name: '上海',value: randomData() },
	                {name: '重庆',value: randomData() },
	                {name: '河北',value: randomData() },
	                {name: '河南',value: randomData() },
	                {name: '云南',value: randomData() },
	                {name: '辽宁',value: randomData() },
	                {name: '黑龙江',value: randomData() },
	                {name: '湖南',value: randomData() },
	                {name: '安徽',value: randomData() },
	                {name: '山东',value: randomData() },
	                {name: '新疆',value: randomData() },
	                {name: '江苏',value: randomData() },
	                {name: '浙江',value: randomData() },
	                {name: '江西',value: randomData() },
	                {name: '湖北',value: randomData() },
	                {name: '广西',value: randomData() },
	                {name: '甘肃',value: randomData() },
	                {name: '山西',value: randomData() },
	                {name: '内蒙古',value: randomData() },
	                {name: '陕西',value: randomData() },
	                {name: '吉林',value: randomData() },
	                {name: '福建',value: randomData() },
	                {name: '贵州',value: randomData() },
	                {name: '广东',value: randomData() },
	                {name: '青海',value: randomData() },
	                {name: '西藏',value: randomData() },
	                {name: '四川',value: randomData() },
	                {name: '宁夏',value: randomData() },
	                {name: '海南',value: randomData() },
	                {name: '台湾',value: randomData() },
	                {name: '香港',value: randomData() },
	                {name: '澳门',value: randomData() }
	            ]
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	chartDistribute.setOption(distributeOption);

});