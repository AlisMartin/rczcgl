var user= $.cookie('user');
var userobj=eval('('+user+')');
var userid=userobj.id;
$(function(){

    $('#sysMessageTable').bootstrapTable({
        url:'/rczcgl/flow/queryMessage.action',
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
                title:"设置已读",
                align:"center",
                formatter:function(value,row,index){
                    debugger;
                    return "<a href='javascript:;'  id='setRead'>已读</a>";
                },
                events:{
                    'click #setRead':function(e,value,row,index){
                        debugger;
                        var a=row.flowId;
                        if(confirm("是否设置消息为已读？设置后将不再显示")){
                            setRead(a);
                        }

                    }
                }
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
                        return "";
                    }

                },
                events:{
                    'click #sp':function(e,value,row,index){
                        var id=parent.document.getElementById("InfoList");
                        id.src="FileFlowWork.html?random="+Math.floor(Math.random()*100000);
                       // id.attr("src","FileFlowWork.html?random="+Math.floor(Math.random()*100000));
                    },
                    'click #downfile':function(e,value,row,index){
                        queryFileByFileName(row.fileId);
                    }
                }
            }
        ],
        queryParams: function (params) {
            debugger;
            params.jsuser = userid;
            params.show="1";
            return params;
        },
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
        data:{'fileId':a},
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

//设置消息已读
function setRead(flowId){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/updateMessage.action",
        async:false,
        data:{'flowId':flowId,'show':'0'},
        success:function(responsedata){
            getMessage();
            $('#sysMessageTable').bootstrapTable('refresh');
            alert("设置成功!");

        },
        error:function(){
            alert("设置失败！请稍后重试！");
        }
    })
}

//5分钟查询一次消息
function getMessage(){
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    var param={};
    param.show='1';
    param.jsuser=userobj.id;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryMessage.action",
        data:JSON.stringify(param),
        contentType: "application/json;charset=UTF-8",
        success:function(responsedata){
            var obj=responsedata;
            if(obj.length>0){
                var a=$('#imsg-bubble',parent.document);
                $(".imsg-bubble").css('display','block');
                $(".imsg-bubble").empty();
                $(".imsg-bubble").text(obj.length+"");
            }else{
                $(".imsg-bubble").css('display','none');
                $(".imsg-bubble").empty();
                $(".imsg-bubble").text(0);
            }
        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}