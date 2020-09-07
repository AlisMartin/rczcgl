$(function(){

    initDepartTree();

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
        }
    });

})

function initDepartTree(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getnodes.action",
        dataType:"json",
        async:false,
        success:function(data){

            debugger;
            $('#Tree').treeview({
                data: data,
                levels:2 , //默认显示子级的数量
                //collapseIcon:" glyphicon glyphicon-user",  //收缩节点的图标
                //expandIcon:"glyphicon glyphicon-user",    //展开节点的图标
                nodeIcon:"glyphicon glyphicon-user",
                showIcon: false,//是否显示图标
                showCheckbox:true//是否显示多选框
            });
        },
        error:function(){
            alert("系统错误！");
        }
    })
}