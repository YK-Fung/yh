import Mock from 'mockjs'

//aes加密
Mock.mock('/ajaxUrl/encryption/aes', {
	data: {
		aesRequestBody: 'jeiofhgoifiugjldfhdlfjddgdff'
	}
});
// 登陆
Mock.mock('/ajaxUrl/system/login', {
	"data": " be1fcf81741f2a57572ae0f69b3ebbb6 ",
	"errorCode":"0000",
	"message":"成功"
});
// 退出登陆
Mock.mock('/ajaxUrl/system/logout', {
	"data" : null,
	"errorCode":"0000",
	"message":"成功"
});
// 发送手机验证码
Mock.mock('/ajaxUrl/customer/reset/pwd/sendSms', function (req) {
	return {
		"data" : null,
		"errorCode":"0000",
		"message":"成功"
	}
});
// 校验短信验证码
Mock.mock('/ajaxUrl/customer/reset/pwd/checkSmsCaptcha', function (req) {
	return {
		"data" : null,
		"errorCode":"0000",
		"message":"成功"
	}
});
// 提交重置密码表单
Mock.mock('/ajaxUrl/customer/reset/pwd/submit', function (req) {
	return {
		"data" : null,
		"errorCode":"111",
		"message":"成功"
	}
});