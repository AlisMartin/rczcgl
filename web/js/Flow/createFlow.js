$(function(){
    $('#departtree').on('nodeChecked',function(event, data) {
        debugger;
        if(data.depart!="user"){

            $('#departtree').treeview('uncheckNode', [ data.nodeId, { silent: true } ]);
            alert("请选择具体的人员！");
            return;
        }
    });

    $("#fqlc").click(function(){
        initmodalinfo();
        $("#addFlow").modal('show');
    })
    $("#openFileModal").click(function(){
        initDepartTree();
        $("#treeModal").modal('show');
    });
    $("#saveUsers").click(function(){
        debugger;
        var data=$('#departtree').treeview('getChecked');
        if(data.length<=0){
            alert("请选择文件接收人员！");
            return;
        }
        var users="";
        for(var i=0;i<data.length;i++){
            users=users+data[i].text+",";
        }
        $("#jsusers").val(users);
    })

    $("#saveConfig").click(function(){
        var lwjg=$("#lwjg").val();
        var swwh=$("#swwh").val();
        var swsj=$("#swsj").val();
        var wjmc=$("#wjmc").val();

        if(lwjg==""){
            alert("来文机关不能为空！");
            return false;
        }
        if(swwh==""){
            alert("收文文号不能为空！");
            return false;
        }
        if(swsj==""){
            alert("收文事件不能为空！");
            return false;
        }
        if(wjmc==""){
            alert("文件名称不能为空！");
            return false;
        }
        insertFlowInstance();
    })

    $('#flowInstanceTable').bootstrapTable({
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
                field:'node',
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
                title:"操作"
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })

})



//初始化发起信息
function initmodalinfo(){
    debugger;
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    var nowdate=getNowDate();
    $("#fqr").val(userobj.userName);
    $("#startDate").val(nowdate);
    $("#user").val(userobj.userId);
}

function insertFlowInstance(){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/createFLow.action",
        data:$("#addFlowForm").serialize(),
        success:function(resonsedata){
            debugger
            var flowinfo=resonsedata.data;
            insertMassage(flowinfo);
            alert("成功!");
        }
    })
}

function initDepartTree(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getnodes.action",
        dataType:"json",
        async:false,
        success:function(data){
            $('#departtree').treeview({
                data: data,
                //levels:1 , //默认显示子级的数量
                //collapseIcon:" glyphicon glyphicon-user",  //收缩节点的图标
                //expandIcon:"glyphicon glyphicon-user",    //展开节点的图标
                nodeIcon:"glyphicon glyphicon-user",
                showIcon: true,//是否显示图标
                showCheckbox:true,//是否显示多选框

            });
        },
        error:function(){
            alert("系统错误！");
        }
    })
}

//推送消息
function insertMassage(flowinfo){
   // var user= $.cookie('user');
    //var userobj=eval('('+user+')');
    var nowdate=getNowDate();
    var param={};
    param.tsUser=flowinfo.fqr;
    param.tsDate=nowdate;
    param.desc="文件待审批";
    param.type="1";
    param.fileName=$("#wjmc").val();
    param.node=parseInt(flowinfo.node)+1;
    param.show="1";
    param.flowId=flowinfo.flowId;

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

