<template>
	<div class="wrap">
		<!-- 未认证图标 -->
		<img src="../../assets/unverified.jpg" class="pic">
		<div class="tips">亲，您的账号还没通过认证，请到PC网站药荟网登录提交资质。资质通过后才能到这里采购哦~</div>
		<router-link to="/home" class="link">进入首页</router-link>
	</div>
</template>
<script>
	export default {
		name: "unverified"
	}
</script>
<style lang="less" scoped>
	.wrap{
		width: 100%;
		height: 100%;
		background: #fff;
		position: absolute;
	}
	.pic{
		width: 228px;
		margin: 182px auto 70px;
		display: block;
	}
	.tips{
		width: 520px;
		font-size: 28px;
		line-height: 40px;
		color:#666;
		margin:0 auto 85px;
	}
	.link{
		width: 239px;
		height: 78px;
		line-height: 78px;
		border-radius: 8px;
		border:1px solid #0066cc;
		color:#0066cc;
		font-size: 28px;
		display: block;
		text-align: center;
		margin:0 auto;
	}
</style>