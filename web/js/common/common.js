//判断是否在前面加0
function getNow(s) {
    return s < 10 ? '0' + s: s;
}

function  hasAuth(auth,param){
    var authArray;
    if(auth.indexOf(",")>-1){
        authArray=auth.split(",");
        for(var i=0;i<authArray.length;i++){
            if(authArray[i]==param){
                return true
            }
        }
        return false;
    }else{
        if(auth==param){
            return true;
        }else{
            return false;
        }
    }
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

//查询审批信息
function querySpInfo(a){
    debugger;
    $(".zjqm").remove();
    var param={};
    param.flowId= a.flowId;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryHistoryFlowInfos.action",
        async:false,
        contentType:"application/json",
        data:JSON.stringify(param),
        success:function(resonsedata){
            debugger;
            var data=resonsedata;
            var html="";
            if(data!=null){
                for(var i=0;i<data.length;i++){
                    if(data[i].yzqm!=null&&data[i].yzqm!=""){
                        html=html+"<tr class='zjqm'><td colspan='2'><input type='text'  value='"+data[i].yzqm+"' class='tableborder' disabled='disabled'</td><td colspan='2'><input type='text'   value='"+data[i].yzyj+"' class='tableborder' disabled='disabled'</td></tr>";
                    }
                }
                $("#cflowtable tbody").append(html);
            }else{

            }

        },
        error:function(){
        }
    })
}