
//引入mockjs
const Mock = require('mockjs');




//设置默认收货地址
Mock.mock('/ajaxUrl/customer/address/setUpDefault', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//删除收货地址
Mock.mock('/ajaxUrl/customer/address/delete', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//新增商品浏览足迹
Mock.mock('/ajaxUrl/goods/footprint/create', {
    "data" : '3333333',
    "errorCode":"0000",
    "message":"成功"
});

//批量删除商品浏览记录
Mock.mock('/ajaxUrl/goods/footprint/batchRemove', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//添加商品收藏
Mock.mock('/ajaxUrl/goods/collect/collectGoods', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//取消商品收藏
Mock.mock('/ajaxUrl/goods/collect/remove', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//取消店铺收藏
Mock.mock('/ajaxUrl/store/collect/remove', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});

//添加店铺收藏
Mock.mock('/ajaxUrl/store/collect/collectStore', {
    "data" : null,
    "errorCode":"0000",
    "message":"成功"
});



