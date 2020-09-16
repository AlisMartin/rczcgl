var columns=[];
var param={};
var zcid="";
var fileid="";
$(function(){
    debugger;
    var zctype=parent.document.getElementById("InfoList").src.split("?")[1].split("&&")[0];
    zctype=zctype.substring(zctype.length-1,zctype.length);
    param.zctype=zctype;
    //导入
    $("#importAssets").click(function(){
        debugger;
        $("#assetsFile").click();
    });
    //导出
    $("#exportAssets").click(function(){
        exportAssetsInfo();
    });
    //新增资产
    $("#addAsset").click(function(){
        $("#add").modal('show');
    });
    $("#saveAsset").click(function(){
        addAsset();
    });
    $("#savefile").click(function(){
        insertFile();
    });

    $("#zctype").change(function(){
        param.zctype=$('#zctype').val();
        getcolumn();
        $('#assetsTable').bootstrapTable('destroy');
        $('#assetsTable').bootstrapTable({
            url:'/rczcgl/assetsconfig/getAssetsInfo.action',
            method:'get',
            clickToSelect:true,
            sidePagination:"client",
            pagination:true,
            pageNumber:1,
            pageSize:5,
            pageList:[5,10,20,50,100],
            paginationPreText:"上一页",
            paginationNextText:"下一页",
            columns:columns,
            queryParams:function(params){
                return param;
            },
            onLoadSuccess:function(){
            },
            onLoadError:function(){
            }
        })
    });

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
            data.zcid = zcid;
        });


        uploader.on('uploadSuccess', function (file,response) {
            $('#state').text('已上传');
            $('#' + file.id).find(".progress").find(".progress-bar").attr("class", "progress-bar progress-bar-success");
            if(response.code == 1){
                fileid = response.data
            }
            alert(response.message);
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
        //$("#uparea").append('<div id="fontregion" style="margin-top: 10%;margin-left: 44%;font-size: 30px;color:#f1f1f1"><span>文件上传区域</span></div>');
        $("#fileInfo").empty();
        //$("#uparea").append
        uploader.destroy();
    });



    //获取动态列
    getcolumn();
    $('#assetsTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getAssetsInfo.action',
        method:'get',
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:columns,
        queryParams:function(params){
            return param;
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        },
        onClickCell:function(field,value,row,$element){
            var a=$element;
            var fieldname=a[0].innerText;
            if(fieldname=="上传附件"){
                $("#fileup").modal('show');
                zcid=row.zcid;
            }
        },
        onCheck:function(row,$element){
            debugger;
            var userId=row.id;
            $.ajax({
                type:"post",
                url:"/rczcgl/user/getRoleByUserId.action",
                sync:false,
                data:{"userid":userId},
                success:function(data){
                    debugger;
                    $("#roleTable").bootstrapTable('uncheckAll');
                    if(data!=""&&data!=null){
                        $("#roleTable").bootstrapTable('checkBy',{field:'roleId',values:[data]});
                    }
                },
                error:function(){
                    alert("关联失败！")
                }
            })
        }
    })
});

function getcolumn(){
    debugger;
    columns=[];
    var zctype=$("#zctype").val();
    var objfileup={
        title:"附件上传",
        field:'upfile',
        formatter:function(value,row,index){
            var html = "<a href='#' class='upfj'>上传附件</a>";
            html += "<a href='#' class='view'>档案卡</a>";
            return html;
        }
    };
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getAllConfigInfo.action",
        async:false,
        data:param,
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

                var htmlLeft = '',htmlRight = '';
                if(i%2 === 0){
                    htmlLeft = htmlLeft + '<div class="form-group"> <label for="'+ data[i].field +'">'+ data[i].fieldname + '</label>'+
                        '<input type="text" class="form-control" id="'+ data[i].field +'" name="'+ data[i].field +'"> </div>'
                }else{
                    htmlRight = htmlRight + '<div class="form-group"> <label for="'+ data[i].field +'">'+ data[i].fieldname + '</label>'+
                        '<input type="text" class="form-control" id="'+ data[i].field +'" name="'+ data[i].field +'"> </div>'
                }
                $(".landAssetsLeft").append(htmlLeft);
                $(".landAssetsRight").append(htmlRight);
            }
            columns.push(objfileup);
        },
        error:function(){
        }
    })
}

function exportAssetsInfo(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/export/exportAssets.action",
        async:false,
        data:param,
        success:function(data){
            var downloadA=document.createElement("a");
            downloadA.setAttribute("href",data.data);
            downloadA.setAttribute("target","_blank");
            downloadA.click();
            downloadA.remove();
        },
        error:function(){
        }
    })
}

function importAssetsInfo(){
    debugger;
    $("#zclx").val(param.zctype);
    var form=new FormData($("#assetsform")[0]);
   $.ajax({
        type:"post",
        url:"/rczcgl/export/importAssets.action",
        data:form,
        async:false,
        cache:false,
        contentType:false,
        processData:false,
        success:function(data){
            alert("导入成功！");
            $("#assetsform")[0].reset();
            $('#assetsTable').bootstrapTable('refresh');

        },
        error:function(){
            $("#assetsform")[0].reset();
        }
    })
}

function addAsset(){
    var arr = $("#addform").serializeArray();
    arr.push({name: "zctype", value: param.zctype});
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/addAssetsByType.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success: function (res) {
            $('#assetsTable').bootstrapTable('refresh');
            $("#add").modal('hide');
        },
        error: function (res) {
            alert("系统错误，请稍后重试！");
        }
    })
}

function insertFile(){
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/insertFile.action",
        data:JSON.stringify({'zcid':zcid,'fileid':fileid}),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success:function(resonsedata){
            alert("保存成功");
            $("#fileup").modal('hide');
        },
        error:function(){
        }
    })
}
