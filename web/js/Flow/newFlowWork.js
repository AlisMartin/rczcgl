var spinfo;
var user= $.cookie('user');
var userobj=eval('('+user+')');
var node;
var flowColum=[
    {
        checkbox:true
    },
    {
        field:'flowName',
        title:'流程名称'
    },
    {
        field:'fqrName',
        title:'发起人'
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
                case 4:
                    data="撤回";
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
                if(row.jsr.indexOf(userobj.id)>-1){
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
        field:'flowName',
        title:'流程名称'
    },
    {
        field:'fqrName',
        title:'发起人'
    },
    {
        title:"当前节点处理人",
        field:'username'
    },
    {
        title:"下一节点待办人",
        field:'dusers'
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
                return "<a href='javascript:;'id='ck'>查看</a>";
            }else if(row.status=="2"){
                return "<a href='javascript:;' id='ck'>退回详情</a>";
            }else{
                return "<a href='javascript:;' id='ck'>查看</a>";
            }

        },
        events:{
            'click #sp':function(e,value,row,index){
                debugger;
                if(row.jsr.indexOf(userobj.id)>-1){
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
$(function(){

    //打开组织机构树
    $("#openFileModal").click(function(){
        debugger;
        initDepartTree();
        $("#treeModal").modal('show');
    });
    $("#saveUsers").click(function(){
        $("#treeModal").modal('hide');
    })
    $("#saveUsers").click(function(){
        debugger;
        var data=$("#userTable").bootstrapTable('getSelections');
        /*var data=$('#departtree').treeview('getChecked');*/
        if(data.length<=0){
            alert("请选择文件接收人员！");
            return;
        }
        var users="";
        var usernames="";
        for(var i=0;i<data.length;i++){
            users=users+data[i].id+",";
            usernames=usernames+data[i].userName+",";
        }
        users=users.substring(0,users.length-1);
        usernames=usernames.substring(0,usernames.length-1);
        $("#jsusers").val(users);
        $("#jsusername").val(usernames);
    })


    $("#spstatus").change(function(){
        debugger;
        var checked= $("#spstatus").val();
        if(checked=="th"){
            $("#thdiv").css("display","block");
            $("#wjjs").css("display","none");
        }
        if(checked=="access"){
            $("#thdiv").css("display","none");
            $("#wjjs").css("display","none");
        }
        if(checked=="jxxf"){
            $("#wjjs").css("display","block");
        }
    })

    $('#addFlow').on('hide.bs.modal', function () {
        debugger;
        $("input[type=reset]").trigger("click");
        $(".afile").empty();
        $(".bfile").empty();
      //  $("#openPicModal").css('display','none');
    });

    $('#queryFlow').on('hide.bs.modal', function () {
        debugger;
        $("input[type=reset]").trigger("click");
        $(".afile").empty();
        $(".bfile").empty();
      //  $("#ckqm1").css('display','none');
        //$("#ckqm2").css('display','none');
    });



    $("#saveConfig").click(function(){
        debugger;
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
        sidePagination:"server",
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
                field:'flowName',
                title:'流程名称'
            },
            {
                field:'fqrName',
                title:'发起人'
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
                            data="通过(查阅)";
                            break;
                        case 4:
                            data="撤回";
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
                        if(row.jsr.indexOf(userobj.id)>-1){
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
            if(!hasAuth(userobj.auth,"8")){
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

    $("#fqr").val(getUserById(a.fqr));
    $("#flowName").val(a.flowName);
    if(a.flowType=="1"){
        $("#flowType").val("查阅");
    }else{
        $("#flowType").val("审批");
    }

    $("#startDate").val(a.startDate);
    $("#lwjg").val(a.lwjg);
    $("#swwh").val(a.swwh);
    $("#swsj").val(a.swsj);
    $("#sfdb").val(a.sfdb);
    $("#dbsx").val(a.dbsx);
    $("#wjmc").val(a.wjmc);
    $("#bwyj").val(a.bwyj);
    $("#flowId").val(a.flowId);
    queryFileByFileName(a.file);
}


//更新流程实例
function updateFlowInstance(){
    debugger;
    var checked= $("#spstatus").val();
    var param={};
    if(checked=="access"){
        param.status="3";
        param.endDate=getNowDate();
    }else if(checked=="jxxf"){
        param.status="1";

    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
        param.endDate=getNowDate();
    }
    param.flowId=$("#flowId").val();
    param.jsr=$("#jsusers").val();
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
    if(checked=="access"){
        param.status="3";
    }else if(checked=="jxxf"){
        param.status="1";
    }else{
        param.status="2";
        param.rejectReason=$("#thyy").val();
    }
    param.endDate=getNowDate();
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    param.user=userobj.id;
    param.yzqm=$("#yzqm").val();
    param.yzyj=$("#yzyj").val();
    param.jsr=$("#jsusers").val();
    var spstatus= $("#spstatus").val();
    /*if($("#yzqm").val()==""){
        alert("领导签名必须填写！");
        return;
    }
    if($("#yzyj").val()==""){
        alert("领导意见必须填写！");
        return;
    }*/
    if(spstatus=="1"&&$("#jsusers").val()==""){
        alert("必须填写下发文件接收人！");
        return;
    }
    //param.userId=userobj.id;
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

    $("#cfqr").val(getUserById(a.fqr));
    $("#cflowName").val(a.flowName);
    if(a.flowType=="1"){
        $("#cflowType").val("查阅");
    }else if(a.flowType=="2"){
        $("#cflowType").val("审批");
    }

    $("#cstartDate").val(a.startDate);
    $("#clwjg").val(a.lwjg);
    $("#cswwh").val(a.swwh);
    $("#cswsj").val(a.swsj);
    $("#csfdb").val(a.sfdb);
    $("#cdbsx").val(a.dbsx);
    $("#cwjmc").val(a.wjmc);
    $("#cbwyj").val(a.bwyj);
    $("#cflowId").val(a.flowId);

    if(a.status=="2"){
        $("#cthdiv").css('display','block');
        $("#cthyy").val(a.rejectReason);
    }
    queryFileByFileName(spinfo.file);
  //  querySpInfo(a)
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
            var html="";
            if(obj.length>0){
                for(var i=0;i<obj.length;i++){

                /*    var downloadA=document.createElement("a");
                    downloadA.setAttribute("href","/rczcgl/"+obj[i].filePath+"/"+obj[i].fileName);
                    downloadA.setAttribute("target","_blank");
                    downloadA.setAttribute("download",obj[i].fileName);
                    downloadA.click();
                    downloadA.remove();*/
                     html=html+"<a href=/rczcgl/"+obj[i].filePath+obj[i].fileName+" download="+obj[i].fileName+">"+obj[i].fileName +"</a>";
                }
                html=html+"</div>"
                $(".afile").append(html);
                $(".bfile").append(html);
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
    param.flowName=flowinfo.flowName;
    param.jsId=flowinfo.jsr;
    if(info.status=="2"){
        param.desc="文件审批退回";
        param.type="3";
    }else if(info.status=="3"){
        param.desc="文件审批通过";
        param.type="2";
    }else{
        param.desc="文件待审批";
        param.type="1";
    }

    param.fileName=$("#wjmc").val();
    param.fileId=flowinfo.file;
    param.show="1";
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
    param.show="0";
    param.duser=userobj.userName;
    param.dId=userobj.id;

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
            if(!hasAuth(userobj.auth,"8")){
                params.duser = userobj.id;
            }
            return JSON.stringify(params);
        },
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");
}

function initDepartTree(){
    $('#userTable').bootstrapTable({
        url:'/rczcgl/user/selectAllUser.action',
        method:'post',
        clickToSelect:true,
        /* sidePagination:"client",
         pagination:true,
         pageNumber:1,
         pageSize:5,
         pageList:[5,10,20,50,100],
         paginationPreText:"上一页",
         paginationNextText:"下一页",*/
        columns:[
            {
                checkbox:true
            },
            {
                field:'userName',
                title:'用户名'
            },
            {
                field:'company',
                title:'所属公司'
            },
            {
                field:'department',
                title:'所属部门'
            },
            {
                field:'position',
                title:'职务'
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("数据加载失败!");
        }
    })
}


