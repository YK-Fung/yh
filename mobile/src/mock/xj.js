//引入mockjs
const Mock = require('mockjs')
//使用mockjs模拟数据
//获取商品收藏列表
Mock.mock('/ajaxUrl/goods/collect/pagingQueryMyCollectGoodsList', {
    "data" : {
    	goodArr:[
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'001'
            },
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'999感冒药',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'002'
            },
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'003'
            },
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'004'
            },
			{
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'005'
			},
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'006'
            },
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格
                goodPrice:'38.50',
                //商品Id
                goodId:'007'
            },
            {
                // 选中商品
                goodActive: false,
                //商品图片
                imgSrc:require('../assets/search-list-img.png'),
                //商品名称
                goodName:'四季感冒片',
                //商品规格
                goodSize:'15片/板*2板/盒',
                //生产企业
                goodFirm:'长春人民药业集团有限公司',
                //商品价格,
                goodPrice:'38.50',
                //商品Id
                goodId:'008'
            },
		],
    },
    "errorCode":"0000",
    "message":"成功"
});

//批量取消商品收藏
Mock.mock('/ajaxUrl/goods/collect/batchRemove', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//获取店铺收藏列表
Mock.mock('/ajaxUrl/store/collect/pagingQueryMyCollectStoreList', {
    "data" : {
    	shopArr: [
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '001'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/new-goods3.png'),
                //生产企业
                shopName: '长春人民药业集团有限公司长春人民药业集团有限公司',
                //店铺Id
                shopId: '002'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '003'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '004'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '005'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '006'
            },
            {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '007'
            }, {
                // 选中商品
                shopActive: false,
                //logo
                imgSrc: require('../assets/shop-logo2.jpg'),
                //生产企业
                shopName: '长春人民药业集团有限公司',
                //店铺Id
                shopId: '008'
            }
        ],
    },
    "errorCode":"0000",
    "message":"成功"
});

//批量取消店铺收藏
Mock.mock('/ajaxUrl/store/collect/batchRemoveCollect', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

// Mock.mock('/ajaxUrl/goods/collect/batchRemove', function (req) {
// 	let reqObj = JSON.parse(req.body)
// 	return req
// 	// data: {
// 	// 	aesRequestBody: 'jeiofhgoifiugjldfhdlfjddgdff'
// 	// }
// });
