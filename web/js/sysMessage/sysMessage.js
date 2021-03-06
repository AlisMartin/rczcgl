var user= $.cookie('user');
var userobj=eval('('+user+')');
var userid=userobj.id;
var readingColum=[
    {
    checkbox:true
},
    {
        field:'flowName',
        title:'流程名称'
    },
    {
        field:'tsId',
        title:'推送人'
    },
    {
        field:'jsId',
        title:'待办人'
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
            if (row.flowtype=="assess"){
                return "<a href='javascript:;'  id='view'>查看</a>";
            }else {
                if (row.type == "1") {
                    return "<a href='javascript:;'  id='sp'>审批</a>";
                } else if (row.type == "2") {
                    return "<a href='javascript:;' id='downfile'>下载文件</a>";
                } else {
                    return "<a href='javascript:;'  id='sp'>查看</a>";
                }
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
            },
            'click #view':function(e,value,row,index){
                var id=parent.document.getElementById("InfoList");
                id.src="imasset.html?random="+Math.floor(Math.random()*100000);
            }
        }
    }];


var readedCloum=[
    {
        checkbox:true
    },
    {
        field:'flowName',
        title:'流程名称'
    },
    {
        field:'tsId',
        title:'推送人'
    },
    {
        field:'jsId',
        title:'待办人'
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
        title:"操作",
        align:"center",
        formatter:function(value,row,index){
            debugger;
            if (row.flowtype=="assess"){
                return "<a href='javascript:;'  id='view'>查看</a>";
            }else {
                if (row.type == "1") {
                    return "<a href='javascript:;'  id='sp'>审批</a>";
                } else if (row.type == "2") {
                    return "<a href='javascript:;' id='downfile'>下载文件</a>";
                } else {
                    return "<a href='javascript:;'  id='sp'>查看</a>";
                }
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
            },
            'click #view':function(e,value,row,index){
                var id=parent.document.getElementById("InfoList");
                id.src="imasset.html?zctype="+ row.type +"&&?random="+Math.floor(Math.random()*100000);
                // $("#InfoList").attr("src","imasset.html?zctype=1&&random="+Math.floor(Math.random()*100000));
            }
        }
    }
]
$(function(){
    debugger;
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
        columns:readingColum,
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
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");

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
            var a=$('#imsg-bubble',parent.document);
            if(obj.length>0){

                a.css('display','block');
                a.text(obj.length+"");
            }else{
                a.css('display','none');
                a.empty();
                a.text(0);
            }
        },
        error:function(){
        }
    })
}

function reloadTable(a){
    debugger;
    var classq = a.className;
    var columns;
    var param={};
    if (classq === "getReadingMessage") {
        url = '/rczcgl/flow/queryMessage.action';
        columns=readingColum;
        param.jsuser = userid;
        param.show="1";
    } else if (classq === "getReadedMessage") {
        url = '/rczcgl/flow/queryMessage.action';
        columns=readedCloum;
        param.jsuser = userid;
        param.show="0";
    } else {
    }
    $('#sysMessageTable').bootstrapTable('refreshOptions', {
        url: url,
        columns:columns,
        queryParams: function (params) {
            if(!(userobj.auth.indexOf("8")>-1)){
                params=param;
            }
            return params;
        },
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");
}