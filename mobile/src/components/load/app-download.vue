<template>
	<div class="wrap" ref="wrap">
		<!-- logo -->
		<img class="logo" src="../../assets/load/app-logo.png">
		<!-- 展示圖 -->
		<img class="show" src="../../assets/load/app-home.jpg">
		<!-- 按钮 -->
		<router-link to='/' class="btn"><i class="ios"></i>IOS版本下载</router-link>
		<router-link to='/' class="btn"><i class="android"></i>Android版本下载</router-link>
		<router-link to='/home' class="btn">浏览药荟商城网页版</router-link>
	</div>
</template>
<script>
	export default {
		name: "add-download",
	}
</script>
<style lang="less" scoped>
	.wrap{
		width: 100%;
		height: 100%;
		background: #e5f4ff;
		text-align: center;
		position: absolute;
		.logo{
			width: 384px;
			margin:88px auto 65px;
			display: block;
		}
		.show{
			width: 384px;
			margin: 0 auto 90px;
			display: block;
		}
		.btn{
			width: 540px;
			height: 72px;
			line-height: 72px;
			color: #0066cc;
			border: 1px solid #0066cc;
			font-size: 28px;
			border-radius: 10px;
			margin: 0 auto 40px;
			padding-left: 140px;
			text-align: left;
			display: block;
			.ios{
				width: 39px;
				height: 48px;
				background: url(../../assets/icon/ios.png) no-repeat 0 0;
				background-size: 100% 100%;
				float: left;
				margin: 10px 20px 0 0;
			}
			.android{
				.ios;
				width: 41px;
				background-image: url(../../assets/icon/android.png);
			}
		}
	}

</style>