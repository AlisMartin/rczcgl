var spinfo={};
var date=getNowDate();
var user= $.cookie('user');
var userobj=eval('('+user+')');
//节点信息
var node;
$(function(){
    //获取节点配置信息
    getFlowConfig();
    //加载时间控件
    $('#datetimepicker2').datetimepicker({
        startDate:date,
        format: 'yyyy-mm-dd',
        language:'zh-CN',
        minView:"month",
        autoclose:true
    });

    //查看签名图片
    $("#ckqm1").click(function(){
        $("#qmPicModal").modal('show');
        var sign=$("#cqm1").val();
        $("#qmImg").attr("src","/rczcgl/signPic/"+sign+".jpg");
    })
    $("#ckqm2").click(function(){
        $("#qmPicModal").modal('show');
        var sign=$("#cqm2").val();
        $("#qmImg").attr("src","/rczcgl/signPic/"+sign+".jpg");
    })

    $('#queryFlow').on('hide.bs.modal', function () {
        $("input[type=reset]").trigger("click");
        $("#cthdiv").css('display','none');
        $("#ckqm1").css('display','none');
        $("#ckqm2").css('display','none');
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
    if(pdFlow(userobj.id,"1")){
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
        $("#uparea").empty();
        if(uploader!=null){
            uploader.destroy();
        }
        $("#fileup").modal('hide');
    })

    $("#fileup").on('hide.bs.modal',function(){
        $("#uparea").empty();
        if(uploader!=null){
            uploader.destroy();
        }
    })
    $("#closeAddFlow").click(function(){
        $("#addFlow").modal('hide');
        $("#addFlowForm")[0].reset();
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
                $("#uparea").empty();
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
        var reg = /^\w+$/;
        if(!reg.test(dbsx)){
            alert("请输入数字！");
            return;
        }

        if(lwjg==""){
            alert("来文机关不能为空！");
            return false;
        }
        if(swwh==""){
            alert("收文文号不能为空！");
            return false;
        }
        if(swsj==""){
            alert("收文事件不能为空！");
            return false;
        }
        if(wjmc==""){
            alert("请选择文件！");
            return false;
        }
        if(jsyh==""){
            alert("接收用户不能为空！");
            return false;
        }
        insertFlowInstance();
    })

    $('#flowInstanceTable').bootstrapTable({
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
        columns:[
            {
                checkbox:true
            },
            {
                field:'flowId',
                title:'流程编号'
            },
            {
                field:'fqrName',
                title:'发起人'
            },
            {
                field:'nodeName',
                title:'流程节点',
            },
            {
                title:"待办人",
                field:'dName'
            },
            {
                title:"文件接收人",
                field:'sqInfo',
                formatter:function(value,row,index){
                    if(value==null){
                        return null;
                    }else{
                        var names= getUserById(value);
                        return   names;
                    }

                }
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
            debugger
            var flowinfo=resonsedata.data;
            insertMassage(flowinfo);
            alert("成功!");
            $("#addFlowForm")[0].reset();
            $("#addFlow").modal('hide');
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
    //var user= $.cookie('user');
    //var userobj=eval('('+user+')');
    var nowdate=getNowDate();
    var param={};
    param.tsUser=flowinfo.fqrName;
    param.tsId=flowinfo.fqr;
    param.tsDate=nowdate;
    param.desc="文件待审批";
    param.type="1";
    param.fileName=flowinfo.wjmc;
    param.node=parseInt(flowinfo.node)+1;
    param.show="1";
    param.flowId=flowinfo.flowId;
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"com"},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"pos",'com':com},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"type",'com':com,'pos':pos},
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
                getManagerFiles(param);
            }else{
                $("#sjmldiv").css('display','none');
                var param={};
                param.com=com;
                param.pos=pos;
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
    $("#cfqr").val(a.fqrName);
    $("#cstartDate").val(a.startDate);
    $("#clwjg").val(a.lwjg);
    $("#cswwh").val(a.swwh);
    $("#cswsj").val(a.swsj);
    $("#csfdb").val(a.sfdb);
    $("#cdbsx").val(a.dbsx);
    $("#cwjmc").val(a.wjmc);
    $("#cbwyj").val(a.bwyj);
    $("#cldps").val(a.ldps);
    $("#cnode").val(a.node);
    $("#cflowId").val(a.flowId);

    if(a.status=="2"){
        $("#cthdiv").css('display','block');
        $("#cthyy").val(a.rejectReason);
    }
    var node=parseInt(a.node);
    if(node>=2){
        getqm(spinfo);
    }
    var qm1=$("#cqm1").val();
    var qm2=$("#cqm2").val();
    if(qm1!=""&&qm1!=null){
        $("#ckqm1").css('display','block');
    }
    if(qm2!=""&&qm2!=null){
        $("#ckqm2").css('display','block');
    }
}

//查询签名
function getqm(a){
    var param={};
    param.flowId= a.flowId;
    param.node= a.node;
    var node=parseInt(a.node);
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/getQm.action",
        async:false,
        data:param,
        success:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].node=="2"){
                    if(data[i].yzqm.indexOf(".")>-1){
                        $("#cqm1").val(data[i].yzqm.split(".")[0]);
                    }else{
                        $("#cqm1").val(data[i].yzqm);
                    }

                    $("#cyj1").val(data[i].yzyj);
                }
                if(data[i].node=="3"){
                    if(data[i].yzqm.indexOf(".")>-1){
                        $("#cqm2").val(data[i].yzqm.split(".")[0]);
                    }else{
                        $("#cqm2").val(data[i].yzqm);
                    }
                    $("#cyj2").val(data[i].yzyj);
                }
            }
        },
        error:function(){
            alert("系统错误！");
        }
    })
}
