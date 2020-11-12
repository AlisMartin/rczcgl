var user = $.cookie('user');
var userobj = eval('(' + user + ')');
$(function(){
    debugger;
    /*$("#yjml").on('change',function(){
        debugger;
        $("#ejml").empty();
        var com=$("#yjml").val();
        if(com!=""){
            initmodaltwofiled(com);
        }else{
            alert("请选择具体目录！")
        }
    })*/
    $("#ejml").change(function(){
        debugger;
        $("#sjml").empty();
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        if(com!=""&&pos!=""){
            initmodalthreefiled(com,pos);
        }else{
            alert("请选择具体目录!");
        }

    })
    $("#mljb").change(function(){
        var value=$("#mljb").val();
        if(value=="1"){

            $("#yjdiv").empty();
            var html=" <input type='text' class='form-control' id='yjml'  placeholder='请输入目录名称'>";
            $("#yjdiv").append(html);

            $("#yjformgroup").css('display','block');
            $("#ejformgroup").css('display','none');
            $("#sjformgroup").css('display','none');
        }else if(value=="2"){

            $("#yjdiv").empty();
            $("#ejdiv").empty();
            var yjhtml="<select class='checkboxstyle formwid' id='yjml' ></select>";
            var ejhtml=" <input type='text' class='form-control' id='ejml'  placeholder='请输入目录名称'>";
            $("#yjdiv").append(yjhtml);
            $("#ejdiv").append(ejhtml);
            initmodalonefiled();

            $("#yjformgroup").css('display','block');
            $("#ejformgroup").css('display','block');
            $("#sjformgroup").css('display','none');

        }else if(value=="3"){

            $("#yjdiv").empty();
            $("#ejdiv").empty();
            $("#sjdiv").empty();
            var yjhtml="<select class='checkboxstyle formwid' id='yjml' onchange='initejml()'></select>";
            var ejhtml="<select class='checkboxstyle formwid' id='ejml'></select>";
            var sjhtml=" <input type='text' class='form-control' id='sjml'  placeholder='请输入目录名称'>";
            $("#yjdiv").append(yjhtml);
            $("#ejdiv").append(ejhtml);
            $("#sjdiv").append(sjhtml);
            initmodalonefiled();

            $("#yjformgroup").css('display','block');
            $("#ejformgroup").css('display','block');
            $("#sjformgroup").css('display','block');
        }else{}
    });
    initonefiled();
    $("#fileone").change(function(){
        $("#fileTwo").empty();
        var com=$("#fileone").val();
        if(com!=""){
            inittwofiled(com);
        }else{
            alert("请选择具体目录！")
        }
    })
  /*  $("#yjml").change(function(){
        debugger;

    })*/

    $("#fileTwo").change(function(){
        $("#fileThree").empty();
        var com=$("#fileone").val();
        var pos=$("#fileTwo").val();
        if(com!=""&&pos!=""){
            initthreefiled(com,pos);
        }else{
            alert("请选择具体目录!");
        }

    })

    $("#savefile").click(function(){
        var pathId=selectPathId();
        insertFile(pathId);
    })

    $('#fileTable').bootstrapTable({
        url:'/rczcgl/flow/queryManagerFileListByJson.action',
        method:'post',
        clickToSelect:true,
        sidePagination:"client",
        contentType: "application/json;charset=UTF-8",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        //pageList:[10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
            {
                checkbox:true
            },
            {
                title:'序号',
                formatter:function(value,row,index){
                    var pageSize=$("#fileTable").bootstrapTable('getOptions').pageSize;
                    var pageNumber=$("#fileTable").bootstrapTable('getOptions').pageNumber;
                    return pageSize*(pageNumber-1)+index+1;
                }
            },
            {
                field:'COM',
                title:'一级目录',
            },
            {
                field:'POS',
                title:'二级目录',
            },
            {
                field:'TYPE',
                title:'三级目录',
            },
            {
                field:'FILENAME',
                title:'文件',
                formatter:function(value,row){
                    var a=value;
                    if(a.indexOf(".")>-1){
                        a= a.split(".")[0];
                    }
                    return a;
                }
            },
            {
                field:'REALNAME',
                title:'文件序号',
            },
            {
                field:'FILENAME',
                title:'类型',
                formatter:function(value,row){
                    var a=value;
                    if(a.indexOf(".")>-1){
                        a= a.split(".")[1];
                    }
                    return a;
                }
            }
        ],
        queryParams: function (params) {
            debugger;
            if(userobj.auth.indexOf("8")=="-1"){
                params.departId=userobj.departId;
            }
            return JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"75%");

    //上传
    $("#fileup").on('shown.bs.modal',function(){
        debugger;
        uploader = WebUploader.create({
            auto:false,
            //swf路径
            swf:'third/webuploader/Uploader.swf',
            server:'/rczcgl/upload/filemanagerupload.action',
            pick:'#picker',
            formData:{com:$("#fileone").val(),pos:$("#fileTwo").val(),filetype:$("#fileThree").val()},
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


        uploader.on('uploadSuccess', function (file) {
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

    $("#ctlBtn").click(function () {
        debugger;
        var com=$("#fileone").val();
        var pos=$("#fileTwo").val();
        if(com==""||pos==""){
            alert("请选择上传文件目录,重新上传！");
            uploader.reset();
            return false;
        }
        uploader.upload();//上传
    });
    //文件上传
    $('#wjsc').click(function(){
        if(userobj.auth.indexOf("8")==-1&&userobj.auth.indexOf("20")==-1){
            alert("当前用户无权限进行此操作！");
            return;
        }
        var com=$("#fileone").val();
        var pos=$("#fileTwo").val();
        var type=$("#fileThree").val();
        if(com==""||com=="请选择"||pos==""||pos=="请选择"){
            alert("上传文件前请先选择文件目录！");
            return false;
        }else{
            $("#fileup").modal("show");
        }
    });


    //打开添加文件目录弹窗
    $("#fieldadd").click(function(){
        if(userobj.auth.indexOf("8")==-1&&userobj.auth.indexOf("21")==-1){
            alert("当前用户无权限进行此操作！");
            return;
        }
        $("#addfilefold").modal("show");
        //initmodalonefiled();
    })
    //隐藏弹窗
    $("#addfilefold").on('hide.bs.modal',function(){
        $("#mljb").val("1");
        $("#yjdiv").empty();
        $("#ejdiv").empty();
        $("#sjdiv").empty();
        $("#yjformgroup").css('display','none');
        $("#ejformgroup").css('display','none');
        $("#sjformgroup").css('display','none');
    })

    //添加文件目录
    $("#saveml").click(function(){
        var mljb=$("#mljb").val();
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        var type=$("#sjml").val();
        var param={};
        param.departId=userobj.departId;
        if(mljb=="0"){
            alert("请选择具体的目录级别！");
            return;
        }else if(mljb=="1"){
            if(com==""||com==null){
                alert("请填写目录名称！");
                return
            }
            param.com=com;
        }else if(mljb=="2"){
            if(com=="null"||com=="请选择"||com==""||com==null){
                alert("请选择一级目录！");
                return;
            }else{
                param.com=com;
            }
            if(pos==""||pos==null){
                alert("请填写目录名称！");
                return
            }
            param.pos=pos;
        }else if(mljb=="3"){
            if(com=="null"||com=="请选择"||com==""||com==null){
                alert("请选择一级目录！");
                return;
            }else{
                param.com=com;
            }
            if(pos=="null"||pos=="请选择"||pos==""||pos==null){
                alert("请选择二级目录！");
                return;
            }else{
                param.pos=pos;
            }
            if(type=="null"||type=="请选择"||type==""||type==null){
                alert("请输入目录名称！");
                return;
            }else{
                param.type=type
            }
        }

        $.ajax({
            type:"post",
            url:"/rczcgl/flow/savefold.action",
            async:false,
            data:param,
            success:function(){
                debugger;
                alert("添加目录成功！");
                $("#addfilefold").modal("hide");
                $("#yjml").empty();
                $("#ejml").empty();
                $("#sjml").empty();
                initmodalonefiled();12
            },
            error:function(){
            }
        })
    })
    //文件下载
    $("#filedown").click(function(){
        debugger;
        if(userobj.auth.indexOf("8")==-1&&userobj.auth.indexOf("20")==-1){
            alert("当前用户无权限进行此操作！");
            return;
        }
        var rowdata=$("#fileTable").bootstrapTable('getSelections');
        if(rowdata.length>0){
            for(var i=0;i<rowdata.length;i++){
                var downloadA=document.createElement("a");
                //var a="/rczcgl/"+rowdata[i].FILEPATH;
                downloadA.setAttribute("href","/rczcgl/"+rowdata[i].FILEPATH+"/"+rowdata[i].FILENAME);
                downloadA.setAttribute("target","_blank");
                downloadA.setAttribute("download",rowdata[i].FILENAME);
                downloadA.click();
                downloadA.remove();
            }
        }else{
            alert("请选择要下载的文件");
            return;
        }

    })

    //文件查询
    $("#filequery").click(function(){
        debugger;
        var com=$("#fileone").val();
        var pos=$("#fileTwo").val();
        var type=$("#fileThree").val();
        var fileName=$("#fileName").val();
        var param={};
        param.fileName=fileName;
        if(com=="null"||com=="请选择"||com==""||com==null){
            com=null;
        }else{
            param.com=com;
        }
        if(pos=="null"||pos=="请选择"||pos==""||pos==null){
            pos=null;
        }else{
            param.pos=pos;
        }
        if(type=="null"||type=="请选择"||type==""||type==null){
            type=null;
        }else{
            param.filetype=type
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/flow/queryManagerFileList.action",
            async:false,
            data:param,
            success:function(responsedata){
                debugger;
             $("#fileTable").bootstrapTable('load',responsedata);
            },
            error:function(){
            }
        })
        });

    //重置文件查询
    $("#resetquery").click(function(){
        debugger;
        $("#fileone").val("");
        $("#fileTwo").empty();
        $("#fileThree").empty();
        $("#fileName").val("");
        $.ajax({
            type:"post",
            url:"/rczcgl/flow/queryManagerFileList.action",
            async:false,
            //data:param,
            success:function(responsedata){
                debugger;
                $("#fileTable").bootstrapTable('load',responsedata);
            },
            error:function(){
            }
        })
    });


    $('#fileup').on('hide.bs.modal',function(){
       // $("#uparea").append('<div id="fontregion" style="margin-top: 10%;margin-left: 44%;font-size: 30px;color:#f1f1f1"><span>文件上传区域</span></div>');
        $("#fileone").empty();
        $("#fileTwo").empty();
        $("#fileThree").empty();
        initonefiled();
        $("#fileInfo").empty();
        if(uploader!=null){
            uploader.destroy();
        }
        $("#fileTable").bootstrapTable('refresh');

    })


})


function initonefiled(){
    debugger;
    var param={};
    param.filetype="com";
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }

    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
            var data=responsedata.data;
            $("#fileone").append("<option value=''>请选择</option>");
            for(var i=0;i<data.length;i++){
                $("#fileone").append("<option value="+ data[i]+">"+ data[i]+"</option>");
            }
        },
        error:function(){
        }
    })
}

//初始化弹窗内下拉框
function initmodalonefiled(){
    debugger;
    var param={};
    param.filetype="com";
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
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

function inittwofiled(com){
    var param={};
    param.filetype="pos";
    param.com=com;
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
            var data=responsedata.data;
            $("#fileTwo").append("<option value=''>请选择</option>");
            for(var i=0;i<data.length;i++) {
                $("#fileTwo").append("<option value=" + data[i] + ">" + data[i] + "</option>");
            }
        },
        error:function(){
        }
    })
}

function initmodaltwofiled(com){
    var param={};
    param.filetype="pos";
    param.com=com;
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(responsedata){
            debugger;
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

function initthreefiled(com,pos){
    var param={};
    param.filetype="type";
    param.com=com;
    param.pos=pos;
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            var data=resonsedata.data;
            $("#fileThree").append("<option value=''>请选择</option>");
                for(var i=0;i<data.length;i++) {
                    if (data[i] != null) {
                        $("#fileThree").append("<option value=" + data[i] + ">" + data[i] + "</option>");
                    }
                }
        },
        error:function(){
        }
    })
}

function initmodalthreefiled(com,pos){
    var param={};
    param.filetype="type";
    param.com=com;
    param.pos=pos;
    if(userobj.auth.indexOf("8")=="-1"){
        param.departId=userobj.departId;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            var data=resonsedata.data;
            $("#sjml").append("<option value=''>请选择</option>");
            for(var i=0;i<data.length;i++) {
                if (data[i] != null) {
                    $("#sjml").append("<option value=" + data[i] + ">" + data[i] + "</option>");
                }
            }

        },
        error:function(){
        }
    })
}

function selectPathId(){
    debugger;
    var com=$("#fileone").val();
    var pos=$("#fileTwo").val();
    var type=$("#fileThree").val();
    var param={};
    if(com==""||pos==""){
        alert("请选择文件目录！");
        return;
    }
    if(com!=null&&com!=""){
        param.com=com;
    }
    if(pos!=null&&pos!=""){
        param.pos=pos;
    }
    if(type!=null&&type!=""){
        param.filetype=type;
    }
    var filePathId;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryPathId.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            var data=resonsedata.data;
            if(data.length==1){
                filePathId=data[0].PATHID;
            }else{
                filePathId=null;
            }
        },
        error:function(){
        }
    })
    return filePathId;
}

function insertFile(filePathId){
    debugger;
    var param={};
    param.pathId=filePathId;
    var com=$("#fileone").val();
    var pos=$("#fileTwo").val();
    var type=$("#fileThree").val();
    var filename=$("#fileid").text();
    if(com!==""&&com!=null){
        param.com=com;
    }
    if(pos!==""&&pos!=null){
        param.pos=pos;
    }
    if(type!==""&&type!=null){
        param.filetype=type;
    }
    if(filename==null||filename==""){
        alert("请先上传文件！");
        return false;
    }else{
        param.filename=filename;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/insertManagerFile.action",
        async:false,
        data:param,
        success:function(resonsedata){
            debugger;
            if(resonsedata.code == 1){
                alert("保存成功");
            }else{
                alert(resonsedata.message);
            }
            $("#fileup").modal('hide');
        },
        error:function(){
        }
    })
}

function initejml(){
    debugger;
    $("#ejml").empty();
    var com=$("#yjml").val();
    if(com!=""){
        initmodaltwofiled(com);
    }else{
        alert("请选择具体目录！")
    }
}

