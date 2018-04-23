//引入mockjs
const Mock = require('mockjs')
//使用mockjs模拟数据
Mock.mock('/ajaxUrl/encryption/aes', {
    'a': 'aa',
    'b': 'bb',
    'c': 'cc'
});
Mock.mock('/ajaxUrl/system/login', {
    'a': '11',
    'b': '22',
    'c': '33'
});