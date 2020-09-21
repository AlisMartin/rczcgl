var userid;
$(function(){
    debugger;
    //getusernode();
    initDepartTree();
   // $('#Tree').treeview('revealNode', [ 9, { silent: true } ]);
    $('#nodeTable').bootstrapTable({
        url:'/rczcgl/flow/getNodeInfo.action',
        method:'post',
        clickToSelect:true,
        singleSelect: true,
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
                field:'id',
                title:'ID'
            },
            {
                field:'flowName',
                title:'所属流程'
            },
            {
                field:'nodeName',
                title:'节点'
            },
            {
                field:'nodeOrder',
                title:'顺序'
            },
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("加载失败!");
        },
        onCheck:function(row,$element){
            debugger;
            $('#Tree').treeview('uncheckAll', { silent: true });
            $('#Tree').treeview('expandNode', [ 0, { levels: 2, silent: true } ]);
            var userIds=row.treeid;
            if(userIds!=null&&userIds!=""){
                if(userIds.indexOf(",")>-1){
                    var idarray=userIds.split(",");
                    for(var i=0;i<idarray.length;i++){
                        var a=parseInt(darray[i]);
                        $('#Tree').treeview('checkNode', [ a, { silent: true } ]);
                        $('#Tree').treeview('revealNode', [ a, { silent: true } ]);
                    }
                }else{
                    $('#Tree').treeview('checkNode', [ parseInt(userIds), { silent: true } ]);
                    $('#Tree').treeview('revealNode', [ parseInt(userIds), { silent: true } ]);
                }
            }


        }
    });

    $('#Tree').on('nodeChecked',function(event, data) {
        debugger;
        if(data.depart!="user"){

            $('#Tree').treeview('uncheckNode', [ data.nodeId, { silent: true } ]);
            alert("请选择具体的人员！");
            return;
        }
    });

    $("#saveGl").click(function(){
        debugger;
        var param={};
        var users=$('#Tree').treeview('getChecked');
        var nodes=$("#nodeTable").bootstrapTable('getSelections');
        param.nodeId=nodes[0].nodeId;
        param.flowType=nodes[0].flowtype;
        if(users.length>0){
            var ids="";
            var treeids="";
            for(var i=0;i<users.length;i++){
                ids=ids+users[i].id+",";
                treeids=treeids+users[i].nodeId+",";
            }
            ids=ids.substring(0,ids.length-1);
            treeids=treeids.substring(0,treeids.length-1);
            param.id=ids;
            param.treeid=treeids;
        }
        if(users.length<1){
            alert("请选择具体人员！");
            return false;
        }
        if(nodes.length<1){
            alert("请选择节点！");
            return false;
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/flow/upNode.action",
            data:param,
            async:false,
            success:function(data){
                alert("关联成功！");
                $("#nodeTable").bootstrapTable('refresh');
            },
            error:function(){
                alert("系统错误！");
            }
        })

    })

    $("#clearGl").click(function(){
        $("#nodeTable").bootstrapTable('uncheckAll');
        $('#Tree').treeview('uncheckAll', { silent: true });
    })

})

function initDepartTree(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getnodes.action",
        dataType:"json",
        async:false,
        success:function(data){
            $('#Tree').treeview({
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

function getusernode(){
        $.ajax({
            type:"post",
            url:"/rczcgl/depart/getDepart.action",
            data:{'depart':"user"},
            async:false,
            success:function(data){
                var userlist=data.data;
                userid=userlist[0].nodeId;

               // $('#Tree').treeview('revealNode', [node,{ silent: true } ]);
               // $("#roleTable").bootstrapTable('uncheckAll');
            },
            error:function(){
                alert("系统错误！");
            }
        })
}