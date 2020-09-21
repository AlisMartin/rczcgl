var spinfo;

$(function(){

    $(".sp").click(function(){
        debugger;
       var checked= $("input[type=radio]:checked").val();
        if(checked=="退回"){
            $("#thdiv").css("display","block");
        }
        if(checked=="通过"){
            $("#thdiv").css("display","none");
        }
    })




    $("#saveConfig").click(function(){
        debugger;
        var qm;
        if(spinfo.node=="2"){
            qm=$("#qm1").val();
            if(qm=="") {
                alert("请签名！");
                return false;
            }
        }
        if(spinfo.node=="3"){
            qm=$("#qm2").val();
            if(qm=="") {
                alert("请签名！");
                return false;
            }
        }
        creatFlowHistory();
        updateFlowInstance();
        updateMessage(spinfo);

    })

    $('#flowWorkTable').bootstrapTable({
        url:'/rczcgl/flow/queryFlowInfos.action',
        method:'post',
        data:[],
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
            {
                checkbox:true
            },
            {
                field:'flowId',
                title:'流程编号'
            },
            {
                field:'fqr',
                title:'发起人'
            },
            {
                field:'nodeName',
                title:'流程节点',
            },
            {
                title:"待办人",
                field:'dusers'
            },
            {
                title:"审批状态",
                field:'status',
                formatter:function(value,row,index){
                    var data="";
                    switch(parseInt(value)){
                        case 1:
                            data="待审批";
                            break;
                        case 2:
                            data="退回";
                            break;
                        case 3:
                            data="通过";
                            break;
                    }
                    return data;
                }
            },
            {
                title:"开始时间",
                field:'startDate'
            },
            {
                title:"结束时间",
                field:'endDate'
            },
            {
                title:"操作",
                align:"center",
                formatter:function(value,row,index){
                    debugger;
                    if(row.status=="1"){
                        return "<a href='javascript:;'  id='sp'>审批</a>&nbsp;&nbsp;<a href='javascript:;'id='ck'>查看</a>";
                    }else if(row.status=="2"){
                        return "<a href='javascript:;' id='ck'>退回详情</a>";
                    }else{
                        return "<a href='javascript:;' id='ck'>查看</a>";
                    }

                },
                events:{
                    'click #sp':function(e,value,row,index){
                        spinfo={};
                        spinfo=row;
                        spFile(row);
                    },
                    'click #ck':function(e,value,row,index){
                        spinfo={};
                        spinfo=row;
                        queryInfo(row);
                    }
                }
            }
        ],
        onLoadSuccess:function(){
        },

        onLoadError:function(){
        },
        onClickCell:function(field,value,row,$element){

        }
    })

})


//初始化发起信息
function initmodalinfo(a){
    debugger;
    //var a=spinfo;
    $("#fqr").val(a.fqr);
    $("#startDate").val(a.startDate);
    $("#lwjg").val(a.lwjg);
    $("#swwh").val(a.swwh);
    $("#swsj").val(a.swsj);
    $("#sfdb").val(a.sfdb);
    $("#dbsx").val(a.dbsx);
    $("#wjmc").val(a.wjmc);
    $("#bwyj").val(a.bwyj);
    $("#ldps").val(a.ldps);
    $("#node").val(a.node);
    $("#flowId").val(a.flowId);
}

function updateFlowInstance(){
    debugger;
    var checked= $("input[type=radio]:checked").val();
    var param={};
    if(checked=="通过"&&spinfo.node!="3"){
        param.status="1";
    }else if(checked=="通过"&&spinfo.node=="3"){
        param.status="3";
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
    }
    param.flowId=$("#flowId").val();
    param.node=$("#node").val();
    param.startDate=getNowDate();

    $.ajax({
        type:"post",
        url:"/rczcgl/flow/updateFLow.action",
        data:param,
        success:function(){
            alert("审批成功!");
            insertMassage(spinfo,param);
            $('#flowWorkTable').bootstrapTable("refresh");
        }
    })
}

function creatFlowHistory(){
    debugger;
    var param={};
    param=spinfo;
    var checked= $("input[type=radio]:checked").val();
    if(checked=="通过"&&spinfo.node!="3"){
        param.status="1";
    }else if(checked=="通过"&&spinfo.node=="3"){
        param.status="3";
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
    }
    param.endDate=getNowDate();
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    param.user=userobj.userName;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/createFLowHistory.action",
        data:param,
        success:function(){

            $('#flowWorkTable').bootstrapTable("refresh");
        }
    })
}

function spFile(row){
    debugger;
    initmodalinfo(row);
    queryFileByFileName(row.wjmc);
    $("#addFlow").modal('show');
}

function queryInfo(a){
    debugger;
   // var a=spinfo;
    $("#queryFlow").modal('show');
    $("#cfqr").val(a.fqr);
    $("#cstartDate").val(a.startDate);
    $("#clwjg").val(a.lwjg);
    $("#cswwh").val(a.swwh);
    $("#cswsj").val(a.swsj);
    $("#csfdb").val(a.sfdb);
    $("#cdbsx").val(a.dbsx);
    $("#cwjmc").val(a.wjmc);
    $("#cbwyj").val(a.bwyj);
    $("#cldps").val(a.ldps);
    $("#cnode").val(a.node);
    $("#cflowId").val(a.flowId);

    if(a.status=="2"){
        $("#cthdiv").css('display','block');
        $("#thyy").val(a.rejectReason);
    }
}

function queryFileByFileName(a){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFileInfo.action",
        async:false,
        data:{'fileName':a},
        success:function(responsedata){
            debugger;
            var obj=responsedata.data;
            if(obj!=null){
                var path=obj.filePath;
                $("#filedown").attr("target","_blank")
                $("#filedown").attr("href","/rczcgl/"+path+"/"+a);
            }

        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}

/*
function queryInfo(a){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFlowInfos.action",
        async:false,
        data:{'flowId':a},
        success:function(responsedata){
            debugger;
            spinfo=responsedata.data;

        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}*/

function insertMassage(flowinfo,info){
    debugger;
     var user= $.cookie('user');
     var userobj=eval('('+user+')');
    var nowdate=getNowDate();
    var param={};
    param.tsUser=userobj.userName;
    param.tsDate=nowdate;
    if(info.status=="2"){
        param.desc="退回";
        param.type="3";
    }else if(info.status=="3"){
        param.desc="文件待接收";
        param.type="2";
    }else{
        param.desc="文件待审批";
        param.type="1";
    }

    param.fileName=$("#wjmc").val();
    param.node=parseInt(flowinfo.node)+1;
    param.show="1";
    if(param.node==4){
        param.jsUser=flowinfo.sqInfo;
    }
    param.flowId=flowinfo.flowId;
    //param.duser=userobj.userName;

    $.ajax({
        type:"post",
        url:"/rczcgl/flow/insertSysMessage.action",
        async:false,
        data:param,
        success:function(data){
        },
        error:function(){
            alert("系统错误！");
        }
    })
}

//更新消息（处理后不显示）
function updateMessage(spinfo){
    debugger;
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    var param={};
    param.flowId=spinfo.flowId;
    param.node=spinfo.node;
    param.show="0";
    param.duser=userobj.userName;
    param.node=spinfo.node;

    $.ajax({
        type:"post",
        url:"/rczcgl/flow/updateMessage.action",
        async:false,
        data:param,
        success:function(data){
        },
        error:function(){
            alert("系统错误！");
        }
    })
}