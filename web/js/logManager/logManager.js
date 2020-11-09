$(function(){
    $('#logTable').bootstrapTable({
        url:'/rczcgl/log/getLogs.action',
        method:'post',
        //contentType: "application/json;charset=UTF-8",
        clickToSelect:true,
        sidePagination:"server",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
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
                title:'操作'
            },
            {
                field:'eventDesc',
                title:'操作描述'
            }


        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"93%");
})

