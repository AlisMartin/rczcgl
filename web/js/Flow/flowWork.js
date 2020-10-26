var spinfo;
var user= $.cookie('user');
var userobj=eval('('+user+')');
var node;
var flowColum=[
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
        title:"文件接收人",
        field:'sqInfo',
        formatter:function(value,row,index){
            if(value==null){
                return null;
            }else{
                var names= getUserById(value);
                return   names;
            }
        }
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
                debugger;
                if(pdFlow(userobj.id,row.node)){
                    spinfo={};
                    spinfo=row;
                    spFile(row);
                }else{
                    alert("当前用户无权限审批！");
                }

            },
            'click #ck':function(e,value,row,index){
                spinfo={};
                spinfo=row;
                queryInfo(row);
            }
        }
    }
];
var historyFlowColum=[
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
        field:'node',
        title:'流程节点',
        formatter:function(value,row,index){
            var a;
            if(value=='1'){
                a="发文"
            }else if(value=='2'){
                a="审批一"
            }else if(value=="3"){
                a="审批二"
            }else if(value=="4"){
                a="结束"
            }
            return a;
        }
    },
    {
        title:"待办人",
        field:'dName'
    },
    {
        title:"处理人",
        field:'user'
    },
    {
        title:"文件接收人",
        field:'sqInfo',
        formatter:function(value,row,index){
            if(value==null){
                return null;
            }else{
                var names= getUserById(value);
                return   names;
            }
        }
    },
  /*  {
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
    },*/
    {
        title:"开始时间",
        field:'startDate'
    },
    {
        title:"结束时间",
        field:'endDate'
    }
];
$(function(){


    //查询流程节点配置
    getFlowConfig();

    $("#spstatus").change(function(){
        debugger;
       var checked= $("#spstatus").val();
        if(checked=="th"){
            $("#thdiv").css("display","block");
        }
        if(checked=="access"){
            $("#thdiv").css("display","none");
        }
    })

    $("#qmPic").change(function(){
        qmPicChange();
    })
    $("#openPicModal").click(function(){
        $("#qmPicModal").modal('show');
        var sign=$("#qmPic").val();
        $("#qmImg").attr("src","/rczcgl/signPic/"+sign);
    })

    $("#ckqm1").click(function(){
        $("#qmPicModal").modal('show');
        var sign=$("#cqm1").val();
        $("#qmImg").attr("src","/rczcgl/signPic/"+sign+".jpg");
    })
    $("#ckqm2").click(function(){
        $("#qmPicModal").modal('show');
        var sign=$("#cqm2").val();
        $("#qmImg").attr("src","/rczcgl/signPic/"+sign+".jpg");
    })


    $('#addFlow').on('hide.bs.modal', function () {
        $("#openPicModal").css('display','none');
    });

    $('#queryFlow').on('hide.bs.modal', function () {
        $("#ckqm1").css('display','none');
        $("#ckqm2").css('display','none');
    });



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
        contentType: "application/json;charset=UTF-8",
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        //pageList:[5,10,20,50,100],
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
                title:"文件接收人",
                field:'sqInfo',
                formatter:function(value,row,index){
                    if(value==null){
                        return null;
                    }else{
                        var names= getUserById(value);
                        return   names;
                    }
                }
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
                        debugger;
                        if(pdFlow(userobj.id,row.node)){
                            spinfo={};
                            spinfo=row;
                            spFile(row);
                        }else{
                            alert("当前用户无权限审批！");
                        }

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
            if(!(userobj.auth.indexOf("8")>-1)){
                params.duser = userobj.id;
            }

            return  JSON.stringify(params);;
        },
        onLoadSuccess:function(){
        },

        onLoadError:function(){
        },
        onClickCell:function(field,value,row,$element){

        }
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");

})


//初始化发起信息
function initmodalinfo(a){
    debugger;
    //var a=spinfo;
    getQmPic();
    $("#fqr").val(a.fqrName);
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

//查询所有签名图片初始化签名下拉框
function getQmPic(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryQmPic.action",
        async:false,
        data:{
            filePath:"signPic"
        },
        success:function(resData){
           var picList=resData.data;
            $("#qmPic").empty();
            $("#qmPic").append("<option value='请选择'>请选择</option>")
            for(var i=0;i<picList.length;i++){
                $("#qmPic").append("<option value="+picList[i].fileName+">"+picList[i].fileName.split(".")[0]+"</option>")
            }
        }
    })
}
//选择签名后追加可查看
function qmPicChange(){
    debugger;
    var qmPic=$("#qmPic").val();
    if(qmPic=="请选择"){
        alert("请选择签名!");
        return;
    }
    if(qmPic.split(".")[0]==userobj.userName){
        $("#openPicModal").css('display','block');
        $("#qm").val($("#qmPic").val());
    }else{
        $("#openPicModal").css('display','none');
        alert("请选择正确的签名！");
        return;
    }
}

//更新流程实例
function updateFlowInstance(){
    debugger;
    var checked= $("#spstatus").val();
    var param={};
    if(checked=="access"&&spinfo.node!="3"){
        param.status="1";
    }else if(checked=="access"&&spinfo.node=="3"){
        param.status="3";
        param.endDate=getNowDate();
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
        param.endDate=getNowDate();
    }
    param.flowId=$("#flowId").val();
    param.node=$("#node").val();
    param.ldps=$("#ldps").val();
    param.bwyj=$("#bwyj").val();
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
    var checked= $("#spstatus").val();
    if(checked=="access"&&spinfo.node!="3"){
        param.status="1";
    }else if(checked=="access"&&spinfo.node=="3"){
        param.status="3";
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
    }
    param.endDate=getNowDate();
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    param.user=userobj.userName;
    param.userId=userobj.id;
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
    $("#cfqr").val(a.fqrName);
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
    var qm1=$("#cqm1").val();
    var qm2=$("#cqm2").val();
    if(qm1!=""&&qm1!=null){
        $("#ckqm1").css('display','block');
    }
    if(qm2!=""&&qm2!=null){
        $("#ckqm2").css('display','block');
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
                    if(data[i].yzqm.indexOf(".")>-1){
                        $("#cqm1").val(data[i].yzqm.split(".")[0]);
                    }else{
                        $("#cqm1").val(data[i].yzqm);
                    }

                    $("#cyj1").val(data[i].yzyj);
                }
                if(data[i].node=="3"){
                    if(data[i].yzqm.indexOf(".")>-1){
                        $("#cqm2").val(data[i].yzqm.split(".")[0]);
                    }else{
                        $("#cqm2").val(data[i].yzqm);
                    }
                    $("#cyj2").val(data[i].yzyj);
                }
            }
        },
        error:function(){
            alert("系统错误！");
        }
    })
}

function reloadTable(a){
    debugger;
    var classq = a.className;
    var columns;
    if (classq === "getWorkFlow") {
        url = '/rczcgl/flow/queryFlowInfos.action';
        columns=flowColum;
    } else if (classq === "getHistoryFlow") {
        url = '/rczcgl/flow/queryHistoryFlowInfos.action';
        columns=historyFlowColum;
    } else {
    }
    $('#flowWorkTable').bootstrapTable('refreshOptions', {
        url: url,
        columns:columns,
        queryParams: function (params) {
            if(!(userobj.auth.indexOf("8")>-1)){
                params.duser = userobj.id;
            }
            return JSON.stringify(params);
        },
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");
}
