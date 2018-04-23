<template>
	<div id="app" >
	  <!--顶部搜索栏-->
	  <router-view/>
	</div>
</template>

<script>
export default {
  name: 'app',
    mounted () {
      //数据埋点
        const script = document.createElement('script');
        script.src = 'https://s13.cnzz.com/z_stat.php?id=1273391482&web_id=1273391482';
        script.language = 'JavaScript';
        document.body.appendChild(script);
    },
    watch: {
        '$route' () {
            if (window._czc) {
                //数据埋点
                let location = window.location;
                let contentUrl = location.pathname + location.hash;
                let refererUrl = '/';
                window._czc.push(['_trackPageview', contentUrl, refererUrl])
            }
        }
    }
}
</script>

<style lang="less">
*{
  box-sizing: border-box;
  font-family: '微软雅黑';
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
  // overflow: auto;
  background-color: #f6f6f6;
  -webkit-overflow-scrolling: touch;
}
html {
  font-family: sans-serif; /* 1 */
  line-height: 1.15; /* 2 */
  -ms-text-size-adjust: 100%; /* 3 */
  -webkit-text-size-adjust: 100%; /* 3 */
}
// 禁止滚动(在body添加这个类名)
.forbid-scroll{
  overflow: hidden;
  #app{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
  }
}
#app{
	img[lazy=loading] {
		/*width: 100%;*/
		/*height: auto;*/
	}
}
a{
  text-decoration: none;
}
ul,li{
  margin: 0;
  padding: 0;
  list-style: none;
}
article,
aside,
footer,
header,
nav,
section {
  display: block;
}
p{
  margin: 0;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
h1,h2,h3,h4,h5,h6{
  margin: 0;
  padding: 0;
}
figcaption,
figure,
main { /* 1 */
  display: block;
}
figure {
  margin: 1em 40px;
}
hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}
pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}
a {
  background-color: transparent; /* 1 */
  -webkit-text-decoration-skip: objects; /* 2 */
}
a:active,
a:hover {
  outline-width: 0;
}
abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}
b,
strong {
  font-weight: inherit;
  font-weight: bolder;
}
code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}
dfn {
  font-style: italic;
}
mark {
  background-color: #ff0;
  color: #000;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
audio,
video {
  display: inline-block;
}
audio:not([controls]) {
  display: none;
  height: 0;
}
img {
  border-style: none;
}
svg:not(:root) {
  overflow: hidden;
}
button,
input,
optgroup,
select,
textarea {
  font-family: sans-serif; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}
button,
input { /* 1 */
  overflow: visible;
}
button,
select { /* 1 */
  text-transform: none;
}
button,
html [type="button"], /* 1 */
[type="reset"],
[type="submit"] {
  -webkit-appearance: button; /* 2 */
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}
fieldset {
  border: 1px solid #c0c0c0;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em;
}
legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}
progress {
  display: inline-block; /* 1 */
  vertical-align: baseline; /* 2 */
}
textarea {
  overflow: auto;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}
details, /* 1 */
menu {
  display: block;
}
summary {
  display: list-item;
}
canvas {
  display: inline-block;
}
template {
  display: none;
}
[hidden] {
  display: none;
}


/*修改mintui框架的某个样式*/

.mint-indexlist .mint-indexlist-content{
	padding-top: 86px;
}
.mint-indexsection-index {
	margin: 0;
	padding: 16px 30px;
	color: #333;
	font-size: 26px;
	background-color: #f6f6f6;
}
.mint-cell .mint-cell-wrapper{
	padding: 0 90px 0 0;
	height: 100%;
	background: none;
}
.mint-cell:last-child{
	background: none;
}
.mint-cell-title{
	padding: 0 30px;
	color: #333;
	font-size: 26px;
}
.mint-indexlist-nav{
	position: fixed;
}
.mint-indexlist-navitem{
	font-size: 24px;
	color: #666;
	width: 60px;
}

/*添加购物车吐丝*/
.mint-toast.add-shop-car{
	z-index: 9999;
	width: 220px;
	height: 66px;/*px*/
	text-align: center;
	bottom: 250px;
	.mint-toast-text{
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 26px;/*px*/
		line-height: 66px;/*px*/
	}
}

/*不满店铺起订金额吐丝*/
.mint-toast.store-minimum-money{
	z-index: 9999;
	width: 420px;
	height: 66px;/*px*/
	text-align: center;
	bottom: 250px;
	.mint-toast-text{
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 26px;/*px*/
		line-height: 66px;/*px*/
	}
}

/*复制成功吐丝*/
.mint-toast.copy-success{
	z-index: 9999;
	width: 220px;
	height: 66px;/*px*/
	text-align: center;
	bottom: 380px;
	.mint-toast-text{
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 26px;/*px*/
		line-height: 66px;/*px*/
	}
}

/*领取优惠券吐丝*/
.mint-toast.get-coupon{
	z-index: 9999;
	width: 220px;
	height: 66px;/*px*/
	text-align: center;
	bottom: 520px;
	line-height: 65px;
	.mint-toast-text{
		width: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 26px;/*px*/
		line-height: 66px;/*px*/

	}
}

/* 公共样式吐丝 */
.mint-toast.public{
	z-index: 9999;
	min-width: 220px;
	/*height: 65px;*/
	display: flex;
	justify-content: center;
	align-items: center;
	bottom: 520px;
	.mint-toast-text{
		font-size: 26px;
	}
}
//弹窗
.pop-shade {
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9999;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .3);
	transition: all .2s ease-in;
	// 弹窗主体
	.pop-main {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 540px;
		overflow: hidden;
		background: #fff;
		border-radius: 10px;
		transform: translate(-50%, -80%);
	}
	.pop-body {
		width: 100%;
		padding-top: 100px;
		padding-bottom: 70px;
		font-size: 32px;
		text-align: center;
		color: #666666;
	}
	.pop-footer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 90px;
		overflow: hidden;
		font-size: 32px;
		text-align: center;
		box-shadow: 0 1px #ccc inset;

		.btn {
			flex: 1;
			line-height: 90px;
			box-shadow: 1px 0 #ccc inset;
			/* border-right: 1px solid #ccc; */
			&.last-child {
				border-right: none;
			}
		}
		.btn-yes {
			color: #0066cc;
		}
		.btn-no {
			color: #666;
		}
	}
}
</style>
