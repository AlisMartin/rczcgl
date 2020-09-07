
$(function(){
    $('#authTable').bootstrapTable({
        url:'/rczcgl/auth/getAllauths.action',
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
                field:'id',
                title:'ID'
            },
            {
                field:'authId',
                title:'权限ID'
            },
            {
                field:'authType',
                title:'权限',
                formatter:function(value,row,index){
                    debugger;
                    if(value=='1'){
                        return "用户管理"
                    }else if(value=='2'){
                        return "导出资料"
                    }else if(value=='3'){
                        return "导入文件";
                    }else{
                        return "浏览"
                    }
                }

            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })
})
