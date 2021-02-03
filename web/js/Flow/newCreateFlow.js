var spinfo={};
var date=getNowDate();
var user= $.cookie('user');
var userobj=eval('('+user+')');
$("#user").val(userobj.id);
//节点信息
var node;
$(function(){

    $("#qfiledown").click(function(){
        queryFileByFileName(spinfo.file);
    })

    $("#chlc").click(function(){
        debugger;
        var flowids="";
        var data=$("#flowInstanceTable").bootstrapTable('getSelections');
        if(data.length<=0){
            alert("请选择要撤回的流程！")
            return;
        }
        for(var i=0;i<data.length;i++){
            if(data[i].status!="1"){
                alert("撤回的流程状态必须是未审批！")
                return;
            }else{
                flowids=flowids+data[i].flowId+",";
            }
        }
        flowids=flowids.substring(0,flowids.length-1);
        updateFlowInstanceStatus(flowids);
    })
    //获取节点配置信息
    //加载时间控件
    $('#datetimepicker2').datetimepicker({
        startDate:date,
        format: 'yyyy-mm-dd',
        language:'zh-CN',
        minView:"month",
        autoclose:true
    });

    $('#queryFlow').on('hide.bs.modal', function () {
        $("input[type=reset]").trigger("click");
        $("#cthdiv").css('display','none');
        $("#ckqm1").css('display','none');
        $("#ckqm2").css('display','none');
        $("#afile").empty();
    });

    $('#departtree').on('nodeChecked',function(event, data) {
        debugger;
        if(data.depart!="user"){

            $('#departtree').treeview('uncheckNode', [ data.nodeId, { silent: true } ]);
            alert("请选择具体的人员！");
            return;
        }
    });

//发起流程
    /*    if(pdFlow(userobj.id,"1")){
     $("#fqlc").css('display','block');
     }else{
     $("#fqlc").css('display','none');
     }*/

    if(hasAuth(userobj.auth,"7")||hasAuth(userobj.auth,"8")){
        $("#fqlc").css('display','block');
    }else{
        $("#fqlc").css('display','none');
    }
    $("#fqlc").click(function(){
        initmodalinfo();
        $("#addFlow").modal('show');
    })
//设置文件上传
    $("#wjkup").click(function(){
        initmodalonefiled();
        $("#filedataup").modal('show');
    })
    $("#filedataup").on('hide.bs.modal',function(){
        $("#yjml").empty();
        $("#ejml").empty();
        $("#sjml").empty();
        $("#sjmldiv").css('display','none');
        $("#wj").empty();
    })
    //一级目录变化
    $("#yjml").change(function(){
        $("#ejml").empty();
        $("#wj").empty();
        $("#sjmldiv").css('display','none');
        var com=$("#yjml").val();
        if(com!=""){
            initmodaltwofiled(com);
        }else{
            alert("请选择具体目录！")
        }
    })
//二级目录变化
    $("#ejml").change(function(){
        $("#sjml").empty();
        $("#wj").empty();
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        if(com!=""&&pos!=""){
            initmodalthreefiled(com,pos);
        }else{
            alert("请选择具体目录!");
        }

    })
    //三级目录变化
    $("#sjml").change(function(){
        $("#wj").empty();
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        var type=$("#sjml").val();
        var param={};
        if(com!=""&&pos!=""){
            if(type==""||type==null){
                param.com=com;
                param.pos=pos;
                getManagerFiles(param);
            }else{
                param.com=com;
                param.pos=pos;
                param.filetype=type;
                getManagerFiles(param);
            }
        }else{
            alert("请选择具体目录!");
        }

    })

    $("#localup").click(function(){
        $("#fileup").modal('show');
    })

    $("#saveUsers").click(function(){
        $("#treeModal").modal('hide');
    })
    $("#saveml").click(function(){
        debugger;
        var wj= $("#wj").find("option:selected").text();
        var wjid= $("#wj").val();
        if(wj==null||wj==""||wj=="请选择"){
            alert("请选择要发送的文件");
            $("#filedataup").modal('hide');
            return false;
        }else{
            var id=$("#wjid").val();
            var div=$("#wjdiv").val();
            if(id.indexOf(wjid)>-1){
                alert("文件已存在，请重新选择！");
                return;
            }
            $("#wjdiv").val(div+wj+",");
            $("#wjid").val(id+wjid+",");
            $("#filedataup").modal('hide');
        }
    })
    $("#savefile").click(function(){
        $("#fileInfo").empty();
        if(uploader!=null){
            uploader.destroy();
        }
        $("#fileup").modal('hide');
    })

    $("#fileup").on('hide.bs.modal',function(){
        $("#fileInfo").empty();
        if(uploader!=null){
            uploader.destroy();
        }
    })
    $("#closeAddFlow").click(function(){
        $("#addFlow").modal('hide');
        $("#addFlowForm")[0].reset();
        $("#jsusers").val("");
        $("#jsusername").val("");
        $("#wjdiv").val("");
        $("#wjid").val("");
    })
    /*   $("#addFlow").on('hide.bs.modal',function(){

     })*/

    //上传
    $("#fileup").on('shown.bs.modal',function(){
        debugger;
        uploader = WebUploader.create({
            auto:false,
            //swf路径
            swf:'third/webuploader/Uploader.swf',
            server:'/rczcgl/upload/fileupload.action',
            pick:'#picker',
            chunked:true,
            chunkSize:200*1024*1024,
            chunkRetry:3,
            threads:1,
            fileNumLimit:1,
            fileSizeLimit:2000*1024*1024,
            resize:false
        });
        uploader.on('fileQueued',function(file){
            debugger;
            $("div").remove("#fontregion");
            $("#fileInfo").addClass('background-color','#f1f1f1');
            $("#fileInfo").addClass('border-radius','10px');
            $("#fileInfo").html("");
            $one=$("<div id='"+file.id+"'class='filename'>"+file.name+"</div>");
            $two=$("<div id='state' class='zt'>等待上传......</div>");
            $three=$("<div id='fileid' style='display: none'>"+file.name+"</div>");
            $("#fileInfo").append($one);
            $("#fileInfo").append($two);
            $("#fileInfo").append($three);
        });
        uploader.on('uploadProgress', function (file, percentage) {
            debugger;
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">'+percentage * 100+'%' +
                    '</div>' +
                    '</div>').appendTo($li).find('.progress-bar');
            }
            $("#state").text("正在上传中...");
            $percent.css('width', percentage * 100 + '%');
        });

        //发送前填充数据
        uploader.on( 'uploadBeforeSend', function( block, data ) {
            debugger;
            //selectPathId(com,pos,type);
            //data.formData={"com":com,"pos":pos,"filetype":type};
        });


        uploader.on('uploadSuccess', function (file,response) {
            debugger;
            var  wjdiv=$("#wjdiv").val();
            var  wjid=$("#wjid").val();
            if(wjid.indexOf(response.data)>-1){
                alert("文件已存在，请重新选择后上传！");
                $("#fileInfo").empty();
                if(uploader!=null){
                    uploader.destroy();
                }
                $("#fileup").modal('hide');

            }
            $("#wjdiv").val(wjdiv+file.name+",");
            $("#wjid").val(wjid+response.data+",");
            $('#state').text('已上传');
            $('#' + file.id).find(".progress").find(".progress-bar").attr("class", "progress-bar progress-bar-success");
            alert("上传成功");

        });
        uploader.on('uploadError', function (file) {
            $('#' + file.id).find('p.state').text('上传出错');
            //上传出错后进度条变红
            $('#' + file.id).find(".progress").find(".progress-bar").attr("class", "progress-bar progress-bar-danger");
            //添加重试按钮
            //为了防止重复添加重试按钮，做一个判断
            //var retrybutton = $('#' + file.id).find(".btn-retry");
            //$('#' + file.id)
            if ($('#' + file.id).find(".btn-retry").length < 1) {
                var btn = $('<button type="button" fileid="' + file.id + '" class="btn btn-success btn-retry"><span class="glyphicon glyphicon-refresh"></span></button>');
                $('#' + file.id).find(".info").append(btn);//.find(".btn-danger")
            }
            $(".btn-retry").click(function () {
                //console.log($(this).attr("fileId"));//拿到文件id
                uploader.retry(uploader.getFile($(this).attr("fileId")));
            });
        });
        uploader.on('uploadComplete', function (file) {//上传完成后回调
            //$('#' + file.id).find('.progress').fadeOut();//上传完删除进度条
            //$('#' + file.id + 'btn').fadeOut('slow')//上传完后删除"删除"按钮
        });
        uploader.on('uploadFinished', function () {
            /*     setTimeout(function(){
             window.location.reload();
             },1000);*/

        });

    });
    //点击文件上传
    $("#ctlBtn").click(function(){
        uploader.upload();
    })

    //打开组织机构树
    $("#openFileModal").click(function(){
        initDepartTree();
        $("#treeModal").modal('show');
    });
    $("#saveUsers").click(function(){
        debugger;
        var data=$("#userTable").bootstrapTable('getSelections');
        /*var data=$('#departtree').treeview('getChecked');*/
        if(data.length<=0){
            alert("请选择文件接收人员！");
            return;
        }
        var users="";
        var usernames="";
        for(var i=0;i<data.length;i++){
            users=users+data[i].id+",";
            usernames=usernames+data[i].userName+",";
        }
        users=users.substring(0,users.length-1);
        usernames=usernames.substring(0,usernames.length-1);
        $("#jsusers").val(users);
        $("#jsusername").val(usernames);
    })

    $("#saveConfig").click(function(){
        debugger;
        var lwjg=$("#lwjg").val();
        var swwh=$("#swwh").val();
        var swsj=$("#swsj").val();
        var wjmc=$("#wjdiv").val();
        var dbsx=$("#dbsx").val();
        var jsyh=$("#jsusername").val();
        var flowName=$("#flowName").val();
        var reg = /^\w+$/;
        if(!reg.test(dbsx)){
            alert("请输入数字！");
            return;
        }

        if(lwjg=="" || lwjg==null){
            alert("来文机关不能为空！");
            return false;
        }
        if(swwh=="" || swwh==null){
            alert("收文文号不能为空！");
            return false;
        }
        if(swsj=="" || swsj==null){
            alert("收文事件不能为空！");
            return false;
        }
        if(wjmc=="" || wjmc==null){
            alert("请选择文件！");
            return false;
        }
        if(jsyh=="" || jsyh==null){
            alert("接收用户不能为空！");
            return false;
        }
        if(flowName=="" || flowName==null){
            alert("接收用户不能为空！");
            return false;
        }
        insertFlowInstance();
    })

  var flowinstanceTable=  $('#flowInstanceTable').bootstrapTable({
        url:'/rczcgl/flow/queryFlowInfos.action',
        method:'post',
        contentType: "application/json;charset=UTF-8",
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        //pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        rowStyle: function(row,index){
            debugger;
          var a=  flowinstanceTable.url;
         //   if(flowinstanceTable.url)
            if(row.sfdb=="是"){
                if(row.status=="1"||row.status=="5"){
                    return {css:{"background-color":"#d9534f"}}
                }else{
                    return {}
                }
                /*  var style = {};
                 style={css:{'color':'#d9534f'}};
                 return style;*/

            }else{
                return{}
            }
        },
        columns:[
            {
                checkbox:true
            },
            {
                field:'flowName',
                title:'流程名称'
            },
            {
                field:'fqrName',
                title:'发起人'
            },
            {
                title:"待办人",
                field:'dusers'
            },
           {
                title:"查阅人",
                field:'username'
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
                        case 4:
                            data="撤回";
                            break;
                        case 5:
                            data="待查阅";
                            break;
                        case 6:
                            data="已查阅";
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
                title:"操作",
                align:"center",
                formatter:function(value,row,index){
                    debugger;
                    if(row.status=="2"){
                        return "<a href='javascript:;' id='ck'>退回详情</a>";

                    }else{
                        return "<a href='javascript:;' id='ck'>查看</a>";
                    }

                },
                events:{
                    'click #ck':function(e,value,row,index){
                        spinfo={};
                        spinfo=row;
                        queryInfo(row);
                    }
                }
            }
        ],
        queryParams: function (params) {
            if(!(userobj.auth.indexOf("8")>-1)){
                params.fqr = userobj.id;
            }
            return  JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");

})



//初始化发起信息
function initmodalinfo(){
    debugger;
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    var nowdate=getNowDate();

    $("#fqr").val(userobj.userName);
    $("#fqrid").val(userobj.id);
    $("#startDate").val(nowdate);
    $("#user").val(userobj.id);
    $("#userId").val(userobj.userName);
}

function insertFlowInstance(){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/createFLow.action",
        data:$("#addFlowForm").serialize(),
        success:function(resonsedata){
            debugger;
            var flowinfo=resonsedata.data;
            insertMassage(flowinfo);
            alert("成功!");
            $("#addFlowForm")[0].reset();
            $("#addFlow").modal('hide');
            $("#flowInstanceTable").bootstrapTable('refresh');
        }
    })
}

function updateFlowInstanceStatus(flowIds){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/updateFLowStatus.action",
        data:{"flowIds":flowIds},
        success:function(resonsedata){
            debugger;
            alert("撤回成功!");
            $("#flowInstanceTable").bootstrapTable('refresh');
        }
    })
}
function initDepartTree(){
    /*    $.ajax({
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
     })*/
    $('#userTable').bootstrapTable({
        url:'/rczcgl/user/selectAllUser.action',
        method:'post',
        clickToSelect:true,
        /* sidePagination:"client",
         pagination:true,
         pageNumber:1,
         pageSize:5,
         pageList:[5,10,20,50,100],
         paginationPreText:"上一页",
         paginationNextText:"下一页",*/
        columns:[
            {
                checkbox:true
            },
            {
                field:'userName',
                title:'用户名'
            },
            {
                field:'company',
                title:'所属公司'
            },
            {
                field:'department',
                title:'所属部门'
            },
            {
                field:'position',
                title:'职务'
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("数据加载失败!");
        }
    })
}

//推送消息
function insertMassage(flowinfo){
   debugger;
    var nowdate=getNowDate();
    var param={};
    param.tsId=flowinfo.fqr;
    if(flowinfo.status=="3"||flowinfo.status=="5"){
        param.jsId=flowinfo.user;
    }else{
        param.jsId=flowinfo.jsr;
    }

    param.tsDate=nowdate;
    if(flowinfo.status=="3"){
        param.desc="文件待查看";
        param.type="3";
    }else{
        param.desc="文件待审批";
        param.type="1";
    }

    param.fileName=flowinfo.wjmc;
   // param.node=parseInt(flowinfo.node)+1;
    param.show="1";
    param.flowId=flowinfo.flowId;
    param.flowName=flowinfo.flowName;
    param.fileId=flowinfo.file;

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

//初始化弹窗内下拉框
function initmodalonefiled(){
    debugger;
    var param={};
    param.filetype="com";
    if(!hasAuth(userobj.auth,"8")){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
            $("#yjml").empty();
            var data=responsedata.data;
            $("#yjml").append("<option value=''>请选择</option>");
            for(var i=0;i<data.length;i++){
                $("#yjml").append("<option value="+ data[i]+">"+ data[i]+"</option>");
            }
        },
        error:function(){
        }
    })
}
//初始化文件二级目录
function initmodaltwofiled(com){
    var param={};
    param.filetype="pos";
    param.com=com;
    if(!hasAuth(userobj.auth,"8")){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
            $("#ejml").empty();
            var data=responsedata.data;
            $("#ejml").append("<option value=''>请选择</option>");
            for(var i=0;i<data.length;i++) {
                $("#ejml").append("<option value=" + data[i] + ">" + data[i] + "</option>");
            }

        },
        error:function(){
        }
    })
}
//初始化文件三级目录
function initmodalthreefiled(com,pos){
    var param={};
    param.filetype="type";
    param.com=com;
    param.pos=pos;
    if(!hasAuth(userobj.auth,"8")){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            $("#sjml").empty();
            var data=resonsedata.data;
            if(data[0]!=null){
                $("#sjmldiv").css('display','block');
                $("#sjml").append("<option value=''>请选择</option>");
                for(var i=0;i<data.length;i++) {
                    $("#sjml").append("<option value=" + data[i] + ">" + data[i] + "</option>");
                }
                var param={};
                param.com=com;
                param.pos=pos;
                if(!hasAuth(userobj.auth,"8")){
                    param.departId=userobj.departId;
                }
                getManagerFiles(param);
            }else{
                $("#sjmldiv").css('display','none');
                var param={};
                param.com=com;
                param.pos=pos;
                if(!hasAuth(userobj.auth,"8")){
                    param.departId=userobj.departId;
                }
                getManagerFiles(param);
            }

        },
        error:function(){
        }
    })
}

function getManagerFiles(param){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryManagerFileList.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            $("#wj").empty();
            var data=resonsedata;
            if(data!=null){
                $("#wj").append("<option value=''>请选择</option>");
                for(var i=0;i<data.length;i++) {
                    $("#wj").append("<option value=" + data[i].FILEID + ">" + data[i].FILENAME + "</option>");
                }
            }else{

            }

        },
        error:function(){
        }
    })
}

function queryInfo(a){
    debugger;
    $("#queryFlow").modal('show');
    $("#cfqr").val(getUserById(a.fqr));
    $("#cstartDate").val(a.startDate);
    $("#clwjg").val(a.lwjg);
    $("#cswwh").val(a.swwh);
    $("#cswsj").val(a.swsj);
    $("#csfdb").val(a.sfdb);
    $("#cdbsx").val(a.dbsx);
    $("#cwjmc").val(a.wjmc);
    $("#cbwyj").val(a.bwyj);
    $("#cflowId").val(a.flowId);
    $("#cflowname").val(a.flowName);
    if(a.flowType=="1"){
        $("#cflowtype").val("查阅");
    }else if(a.flowType=="2"){
        $("#cflowtype").val("审批");
    }


    if(a.status=="2"){
        $("#cthdiv").css('display','block');
        $("#cthyy").val(a.rejectReason);
    }
    queryFileByFileName(a.file);
  //  querySpInfo(a);
}

function queryFileByFileName(a){
    debugger;
    var fileid= a.substring(0, a.length-1);
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFileInfo.action",
        async:false,
        data:{'fileId':fileid},
        success:function(responsedata){
            debugger;
            var obj=responsedata.data;
            var html="";
            if(obj.length>0){
                for(var i=0;i<obj.length;i++){

                    /*    var downloadA=document.createElement("a");
                     downloadA.setAttribute("href","/rczcgl/"+obj[i].filePath+"/"+obj[i].fileName);
                     downloadA.setAttribute("target","_blank");
                     downloadA.setAttribute("download",obj[i].fileName);
                     downloadA.click();
                     downloadA.remove();*/
                    html=html+"<a href=/rczcgl/"+obj[i].filePath+obj[i].fileName+" download="+obj[i].fileName+">"+obj[i].fileName +"</a>";
                }
                html=html+"</div>"
                $("#afile").append(html);
            }

        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}


