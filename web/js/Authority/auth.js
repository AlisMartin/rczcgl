var user = $.cookie('user');
var userobj = eval('(' + user + ')');
$(function(){
    $('#authTable').bootstrapTable({
        url:'/rczcgl/auth/getAllauths.action',
        method:'post',
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
                field:'authName',
                title:'权限'

            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    });
    $(".fixed-table-pagination").css('margin-top',"18%");
})
