
$(function(){
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
    $("#yjml").change(function(){
        $("#ejml").empty();
        var com=$("#yjml").val();
        if(com!=""){
            initmodaltwofiled(com);
        }else{
            alert("请选择具体目录！")
        }
    })

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

    $("#ejml").change(function(){
        $("#sjml").empty();
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        if(com!=""&&pos!=""){
            initmodalthreefiled(com,pos);
        }else{
            alert("请选择具体目录!");
        }

    })

    $("#savefile").click(function(){
        var pathId=selectPathId();
        insertFile(pathId);
    })

    $('#fileTable').bootstrapTable({
        url:'/rczcgl/flow/queryManagerFileList.action',
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
                field:'FILEID',
                title:'文件编号'
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
                title:'文件'
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })

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
        $("#addfilefold").modal("show");
        initmodalonefiled();
    })
    //添加文件目录
    $("#saveml").click(function(){
        var com=$("#yjml").val();
        var pos=$("#ejml").val();
        var type=$("#sjml").val();
        var param={};
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
            alert("请输入目录名称！");
            return;
        }else{
            param.type=type
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
                initmodalonefiled();
            },
            error:function(){
            }
        })
    })
    //文件下载
    $("#filedown").click(function(){
        debugger;
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
        var param={};
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
            param.type=type
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

    })


})


function initonefiled(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"com"},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"com"},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"pos",'com':com},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"pos",'com':com},
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
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"type",'com':com,'pos':pos},
        success:function(resonsedata){
            debugger;
            var data=resonsedata.data;
            $("#fileThree").append("<option value=''>请选择</option>");
            if(data[0]!=null){
                for(var i=0;i<data.length;i++) {
                    $("#fileThree").append("<option value=" + data[i] + ">" + data[i] + "</option>");
                }
            }

        },
        error:function(){
        }
    })
}

function initmodalthreefiled(com,pos){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryFile.action",
        async:false,
        data:{'filetype':"type",'com':com,'pos':pos},
        success:function(resonsedata){
            debugger;
            var data=resonsedata.data;
            $("#sjml").append("<option value=''>请选择</option>");
            if(data[0]!=null){
                for(var i=0;i<data.length;i++) {
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
    var com=$("#fileone").val();
    var pos=$("#fileTwo").val();
    var type=$("#fileThree").val();
    var filename=$("#fileid").text();
    if(filename==null||filename==""){
        alert("请先上传文件！");
        return false;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/insertManagerFile.action",
        async:false,
        data:{'filetype':type,'com':com,'pos':pos,'filename':filename,'pathId':filePathId},
        success:function(resonsedata){
            debugger;
            alert("保存成功");
            $("#wjsc").modal('hide');
        },
        error:function(){
        }
    })
}

