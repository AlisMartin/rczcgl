$(function(){

    $('#sysMessageTable').bootstrapTable({
        url:'/rczcgl/flow/queryMessage.action',
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
                field:'flowId',
                title:'流程编号'
            },
            {
                field:'tsUser',
                title:'推送人'
            },
            {
                field:'jsUser',
                title:'待办人',
            },
            {
                title:"文件名",
                field:'fileName'
            },
            {
                title:"推送时间",
                field:'tsDate'
            },
            {
                title:"事件描述",
                field:'desc'
            },
            {
                title:"处理人",
                field:'duser'
            },
            {
                title:"操作",
                align:"center",
                formatter:function(value,row,index){
                    debugger;
                    if(row.type=="1"){
                        return "<a href='javascript:;'  id='sp'>审批</a>";
                    }else if(row.type=="2"){
                        return "<a href='javascript:;' id='downfile'>下载文件</a>";
                    }else{
                        return "<a href='javascript:;' id='ck'>查看</a>";
                    }

                },
                events:{
                    'click #sp':function(e,value,row,index){
                        var id=parent.document.getElementById("InfoList");
                        id.src="FileFlowWork.html?random="+Math.floor(Math.random()*100000);
                       // id.attr("src","FileFlowWork.html?random="+Math.floor(Math.random()*100000));
                    },
                    'click #downfile':function(e,value,row,index){
                        queryFileByFileName(row.fileName);
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

function queryFileByFileName(a){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFileInfo.action",
        async:false,
        data:{'fileName':a},
        success:function(responsedata){
            debugger;
            var obj=responsedata.data;
            if(obj!=null){
                var path=obj.filePath;
                var downloadA=document.createElement("a");
                downloadA.setAttribute("href","/rczcgl/"+path+"/"+a);
                downloadA.setAttribute("target","_blank");
                downloadA.setAttribute("download",a);
                downloadA.click();
                downloadA.remove();

            }

        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}


