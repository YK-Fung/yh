define(['jquery', 'echarts', 'bar-slider', 'bar-header','ie-tip'], function($, echarts){
	
	// var chartHotSell = echarts.init(document.getElementsByClassName('chart-hot-sell')[0]);
	// var _width=document.getElementsByClassName('chart-hot-sell')[0].offsetWidth;
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
	            data:[120, 132, 101, 134, 90, 230,]
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
	            data: [ , , , , , 230, 210]
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