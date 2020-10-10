var spinfo;
var user= $.cookie('user');
var userobj=eval('('+user+')');
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
        var qm=$("#qm").val();
            if(qm=="") {
                alert("请签名！");
                return false;
            }
        creatFlowHistory();
        updateFlowInstance();
        updateMessage(spinfo);
        $("#addFlow").modal('hide');

    })
//文件下载
    $("#filedown").click(function(){
        queryFileByFileName(spinfo.file);
    })
    $("#qfiledown").click(function(){
        queryFileByFileName(spinfo.file);
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
                field:'fqrName',
                title:'发起人'
            },
            {
                field:'nodeName',
                title:'流程节点',
            },
            {
                title:"待办人",
                field:'dName'
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
        queryParams: function (params) {
            params.fqr = userobj.id;
            return params;
        },
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

//更新流程实例
function updateFlowInstance(){
    debugger;
    var checked= $("input[type=radio]:checked").val();
    var param={};
    if(checked=="通过"&&spinfo.node!="3"){
        param.status="1";
    }else if(checked=="通过"&&spinfo.node=="3"){
        param.status="3";
        param.endDate=getNowDate();
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
        param.endDate=getNowDate();
    }
    param.flowId=$("#flowId").val();
    param.node=$("#node").val();
    //param.startDate=getNowDate();
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

//创建流程历史
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
    param.yzqm=$("#qm").val();
    param.yzyj=$("#yj").val();
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
    //queryFileByFileName(row.file);
    $("#addFlow").modal('show');
}


//查看发起信息
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
    var node=parseInt(a.node);
    if(node>=2){
        getqm(spinfo);
    }
}

function queryFileByFileName(a){
    debugger;
    var fileid= a.substring(0, a.length-1);
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFileInfo.action",
        async:false,
        data:{'fileId':fileid},
        success:function(responsedata){
            debugger;
            var obj=responsedata.data;
            if(obj.length>0){
                for(var i=0;i<obj.length;i++){
                    var downloadA=document.createElement("a");
                    downloadA.setAttribute("href","/rczcgl/"+obj[i].filePath+"/"+obj[i].fileName);
                    downloadA.setAttribute("target","_blank");
                    downloadA.setAttribute("download",obj[i].fileName);
                    downloadA.click();
                    downloadA.remove();

                }

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
    param.tsId=userobj.id;
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
    param.fileId=flowinfo.file;
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
    param.dId=userobj.id;
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

//查询签名
function getqm(a){
    debugger;
    var param={};
    param.flowId= a.flowId;
    param.node= a.node;
    var node=parseInt(a.node);
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/getQm.action",
        async:false,
        data:param,
        success:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].node=="2"){
                    $("#cqm1").val(data[i].yzqm);
                    $("#cyj1").val(data[i].yzyj);
                }
                if(data[i].node=="3"){
                    $("#cqm2").val(data[i].yzqm);
                    $("#cyj2").val(data[i].yzyj);
                }
            }
        },
        error:function(){
            alert("系统错误！");
        }
    })
}