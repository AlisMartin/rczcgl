var uploader;
var zcid;
var columns=[{
checkbox:true
}];
var objfileup={
    title:"附件上传",
    field:'upfile',
    formatter:function(value,row,index){
        return "<a href='#' class='upfj'>上传附件</a>";
    }
};
var objfiledown={
    title:"附件下载",
    field:'downfile',
    formatter:function(value,row,index){
        return "<a href='#' class='updown'>下载附件</a>";
    }
}
var param={
    zctype:'1'
};
$(function(){
    $("#zctype").change(function(){
        param.zctype=$('#zctype').val();
        getcolumn();
        $('#fileTable').bootstrapTable('destroy');
        $('#fileTable').bootstrapTable({
            url:'/rczcgl/assetsconfig/getAssetsInfo.action',
            method:'get',
            clickToSelect:true,
            sidePagination:"client",
            pagination:true,
            pageNumber:1,
            pageSize:10,
            //pageList:[5,10,20,50,100],
            paginationPreText:"上一页",
            paginationNextText:"下一页",
            columns:columns,
            queryParams:function(params){
                return JSON.stringify(params);
            },
            onLoadSuccess:function(){
            },
            onLoadError:function(){
            }
        })
    });


    //获取动态列
    getcolumn();
    $('#fileTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getAssetsInfo.action',
        method:'get',
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        //pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:columns,
        queryParams:function(params){
            return JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        },
        onClickCell:function(field,value,row,$element){
            debugger;
            zcid="";
            var a=$element;
            var fieldname=a[0].innerText;
            if(fieldname=="上传附件"){
                $("#fileup").modal('show');
                zcid=row.zcid;
            }
        }

    })




    //上传
    $("#fileup").on('shown.bs.modal',function(){
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
            $("div").remove("#fontregion");
            $("#fileInfo").addClass('background-color','#f1f1f1');
            $("#fileInfo").addClass('border-radius','10px');
            $("#fileInfo").html("");
            $one=$("<div id='"+file.id+"'class='filename'>"+file.name+"</div>");
            $two=$("<div id='state' class='zt'>等待上传......</div>");
            $("#fileInfo").append($one);
            $("#fileInfo").append($two);
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
            uploader.option('formData',{
                filename:block.file.name,
                zcid:zcid
            })
        });


        uploader.on('uploadSuccess', function (file) {
            $('#state').text('已上传');
            $('#' + file.id).find(".progress").find(".progress-bar").attr("class", "progress-bar progress-bar-success");
            alert("上传成功");
            //$('#' + file.id).find(".info").find('.btn').fadeOut('slow');//上传完后删除"删除"按钮
            //$('#StopBtn').fadeOut('slow');

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
            /*   setTimeout(function(){
             window.location.reload();
             },1000);*/

        });
    });

    $("#ctlBtn").click(function () {
        uploader.upload();//上传
    });

    $('#fileup').on('hide.bs.modal',function(){
        $("#uparea").append('<div id="fontregion" style="margin-top: 10%;margin-left: 44%;font-size: 30px;color:#f1f1f1"><span>文件上传区域</span></div>');
        $("#fileInfo").empty();
        $("#uparea").append
        uploader.destroy();
    })





})

function getcolumn(){
    debugger;
    columns=[{
        checkbox:true
    }];
    var zctype=$("#zctype").val();
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getConfigInfo.action",
        async:false,
        data:{'zctype':zctype},
        success:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].zctype=='1'){
                    data[i].zctype="土地资产";
                }
                if(data[i].zctype=='2'){
                    data[i].zctype="房屋资产";
                }
                if(data[i].zctype=='3'){
                    data[i].zctype="海域资产";
                }
                var obj={};
                obj.field=data[i].field;
                obj.title=data[i].fieldname;
                columns.push(obj);
            }
            columns.push(objfileup);
            columns.push(objfiledown);
        },
        error:function(){
        }
    })
}

function saveFileToDb(){
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getConfigInfo.action",
        async:false,
        data:{'zctype':zctype},
        success:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].zctype=='1'){
                    data[i].zctype="土地资产";
                }
                if(data[i].zctype=='2'){
                    data[i].zctype="房屋资产";
                }
                if(data[i].zctype=='3'){
                    data[i].zctype="海域资产";
                }
                var obj={};
                obj.field=data[i].field;
                obj.title=data[i].fieldname;
                columns.push(obj);
            }
            columns.push(objfileup);
            columns.push(objfiledown);
        },
        error:function(){
        }
    })
}