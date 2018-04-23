<template>
    <div class="shopcar">
        <router-link to="/shopCar">
           <div class="badge">{{shopCarNum}}</div>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "shopcar-btn",
        props:['shopCarNum'],
    }
</script>

<style lang="less" scoped>
    .shopcar {
        position: fixed;
        left: 16px; 
        bottom: 110px;
        border-radius: 50%;
        z-index: 9;
        a {
            width: 100px; 
            height: 100px; 
            display: inline-block;
            background: url("../../assets/shopcar-circle.png");
            background-size: contain;
            .badge {
                position: absolute;
                top: 15px;
                right: 18px; 
                display: inline-block;
                height: 22px;/*px*/
                padding-left: 6px;
                padding-right: 6px;
                line-height: 22px;/*px*/
                text-align: center;
                font-size: 14px;
                color: #fff;
                background-color: #f82222;
                border-radius: 24px;/*px*/
            }
        }
    }

</style>