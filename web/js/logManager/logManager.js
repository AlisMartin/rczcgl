$(function(){
    $('#logTable').bootstrapTable({
        url:'/rczcgl/log/getLogs.action',
        method:'post',
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
                title:'序号',
                formatter:function(value,row,index){
                    var pageSize=$("#logTable").bootstrapTable('getOptions').pageSize;
                    var pageNumber=$("#logTable").bootstrapTable('getOptions').pageNumber;
                    return pageSize*(pageNumber-1)+index+1;
                }
            },
            {
                field:'userName',
                title:'操作用户'
            },
            {
                field:'eventDate',
                title:'操作时间'
            },
            {
                field:'eventType',
                title:'操作',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "登录"
                    }else if(value=='2'){
                        return "查询"
                    }else if(value='3'){
                        return "导出";
                    }else{
                        return "其他"
                    }
                }

            },
            {
                field:'eventDesc',
                title:'操作描述'
            }


        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("加载失败!");
        }
    })
})

