//判断是否在前面加0
function getNow(s) {
    return s < 10 ? '0' + s: s;
}

function getNowDate(){
    var myDate = new Date();

    var year=myDate.getFullYear();        //获取当前年
    var month=myDate.getMonth()+1;   //获取当前月
    var date=myDate.getDate();            //获取当前日


    var h=myDate.getHours();              //获取当前小时数(0-23)
    var m=myDate.getMinutes();          //获取当前分钟数(0-59)
    var s=myDate.getSeconds();

    var now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
    return now;
}

//查询流程配置
function getFlowConfig(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/getNodeInfo.action",
        async:false,
        success:function(data){
            node=data;
        },
        error:function(){
            alert("系统错误！");
        }
    })
}
//判断是否有权限发文或审批
function pdFlow(userid,nodeId){
    debugger;
    var flag=false;
    for(var i=0;i<node.length;i++){
        if(node[i].nodeId==nodeId&&node[i].userId.indexOf(userid)>-1){
            flag=true;
            break;
        }
    }
    return flag;
}

//根据id获取用户名
function getUserById(userid){
    debugger;
    var names;
    $.ajax({
        type:"post",
        url:"/rczcgl/user/getUsersById.action",
        async:false,
        data:{ids:userid},
        success:function(datas){
            names=datas.data;
        },
        error:function(){
            alert("系统错误！");
        }
    })
    return names;
}
