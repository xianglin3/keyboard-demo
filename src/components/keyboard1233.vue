<template>
    <div class="key-board" flex="">
        <!-- <ul class="key-box left-box">
            <li v-for="(item,index) in leftKeys" :key="index" flex="main:center cross:center"
            @click="editContent(item)"
            class="red">{{item}}</li>
        </ul>
        <ul class="key-box middle-box" v-show="isFenshu==1">
            <li v-if="item=='-1'" v-for="(item,index) in middleKeys" :key="index" flex="main:center cross:center"
            @click="editContent('-1')" 
            class="blue"><img src="../assets/fenshu.png"></li>
            <li v-if="item!='-1'" v-for="(item,index) in middleKeys" :key="index" flex="main:center cross:center"
            @click="editContent(item)" 
            class="blue">{{item}}</li>
        </ul>
        <ul class="key-box right-box">
            <li v-for="(item,index) in rightKeys" :key="index" flex="main:center cross:center"
            @click="editContent(item)" 
            class="blue">{{item}}</li>
        </ul> -->
        <div class="input-content">
            <input type="" v-model="inputData">
        </div>
        <div class="keyboard-content">
            <div class="keyboard-btn">
                <div class="one-row"></div>
                <div class="two-row"></div>
            </div>
            <div class="submit-btn"></div>
        </div>
    </div>
</template>

<script>

export default {
    name:"keyboard",
    data(){
        return{
            leftKeys:[1,2,3,4,5,6,7,8,9,0],
            middleKeys:["-1",".",":","%","<",">","=","/"],
            rightKeys:["<-","清空"],
            isFenshu: 2,
            oneRow:[
                {
                    'type': 'letter',
                    'val':'1'
                },
                {
                    'type': 'letter',
                    'val':'2'
                },
                {
                    'type': 'letter',
                    'val':'3'
                },
                {
                    'type': 'letter',
                    'val':'4'
                },
                {
                    'type': 'letter',
                    'val':'5'
                },
                {
                    'type': 'operator',
                    'val':'一'
                },
                {
                    'type': 'operator',
                    'val':'.'
                },
                {
                    'type': 'operator',
                    'val':'%'
                },
                {
                    'type': 'operator',
                    'val':'+'
                },
                {
                    'type': 'operator',
                    'val':'x'
                },
                {
                    'type': 'feature',
                    'val':'deal',
                    'des':'删除'
                },
            ],
            towRow:[
                {
                    'type': 'letter',
                    'val':'6'
                },
                {
                    'type': 'letter',
                    'val':'7'
                },
                {
                    'type': 'letter',
                    'val':'8'
                },
                {
                    'type': 'letter',
                    'val':'9'
                },
                {
                    'type': 'letter',
                    'val':'0'
                },
                {
                    'type': 'operator',
                    'val':'<'
                },
                {
                    'type': 'operator',
                    'val':'>'
                },
                {
                    'type': 'operator',
                    'val':'='
                },
                {
                    'type': 'operator',
                    'val':'➖'
                },
                {
                    'type': 'operator',
                    'val':'÷'
                },
                {
                    'type': 'feature',
                    'val':'clear',
                    'des':'清空'
                },
            ],
            configKeyboard:{
                "E01":{
                    isShowInput: false, // 是否支持输入框
                    isShowSubmit: true // 是否支持提交
                },
                "E11":{
                    isShowInput: true, // 是否支持输入框
                    isShowSubmit: true // 是否支持提交
                },
                "E00":{
                    isShowInput: false, // 是否支持输入框
                    isShowSubmit: false // 是否支持提交
                }
            },
            content: this.inputContent,
            inputData: ''
        }
    },
    props:{
        inputContent:{
            type: String,
            require: true
        }
    },
    components:{
    },
    computed:{
    },
    filters:{
        fenhao(val){
        }
    },
    methods:{
        editContent(val){
            // this.inputContent+=String(val)
            this.content+=String(val)
            // this.$emit('keyContent',val);
        },
        onKeyDown(key,e){
            for(var i in key){
                if(key[i] == e.keyCode){
                }
            }
        }
    },
    mounted(){
        
    },
    watch:{
        "content":{
            handler(val){
                this.$emit('keyContent',val);
            }
        }
    }
}
</script>

<style lang="less" scoped>
// .key-board{
//     // height: 100px;
//     .key-box{
//         &.left-box{
//             width: 390px;
//         }
//         &.middle-box{
//             width: 320px;
//         }
//         &.right-box{
//             width: 80px;
//         }
//         li{
//             list-style: none;
//             float: left;
//             margin-right: 10px;
//             margin-top: 10px;
//             width: 68px;
//             height: 40px;
//             line-height: 40px;
//             color: #4124AB;
//             box-sizing: border-box;
//             font-size: 22px;
//             -webkit-user-select:none;
//             -moz-user-select:none;
//             -ms-user-select:none;
//             user-select:none;
//             &.red{
//                 .backgroundImg('../assets/numkey.png');
//                 /*&:hover{
//                     background-image: url('../assets/key_red_hover.png');
//                 }*/
//                 &:active{
//                     background-image: url('../assets/press.png');
//                 }
//             }
//             &.blue{
//                 .backgroundImg('../assets/key.png');
//                 /*&:hover{
//                     background-image: url('../assets/key_blue_hover.png');
//                 }*/
//                 &:active{
//                     background-image: url('../assets/press.png');
//                 }
//             }
//             &:hover{
//                 cursor: pointer;
//             }
//         }
//     }
//     .keyboard-content{
//         position: absolute;
//         bottom: 0;
//         left: 50%;
//         transform: translateX(-50%);
//         padding: 28px;
//         background: #ccc;
//     }
// }
// .backgroundImg(@url){
//     background-image: url(@url);
//     background-size: cover;
// }
</style>
