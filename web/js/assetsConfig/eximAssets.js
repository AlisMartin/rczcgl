var columns = [];
var param = {};
var zcid = "";
var fileid = "";
require(["esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dojo/dom",
    "dojo/on",
    "esri/geometry/Point",
    "esri/tasks/QueryTask",
    "esri/SpatialReference",
    "esri/tasks/query",
    "esri/InfoTemplate",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"], function (Map, ArcGISDynamicMapServiceLayer, dom, on, Point, QueryTask, SpatialReference, Query, InfoTemplate,
                                 SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer, Graphic, FeatureLayer) {
    map = new Map("newmap", {
        basemap: "osm",  //topo-vector   For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [122.376, 37.096], // longitude, latitude
        zoom: 12
    });
    map = new Map("editmap", {
        basemap: "osm",  //topo-vector   For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [122.376, 37.096], // longitude, latitude
        zoom: 12
    });
});
$(function () {
    debugger;
    var zctype = parent.document.getElementById("InfoList").src.split("?")[1].split("&&")[0];
    zctype = zctype.substring(zctype.length - 1, zctype.length);
    param.zctype = zctype;
    //导入
    $("#importAssets").click(function () {
        debugger;
        $("#assetsFile").click();
    });
    //导出
    $("#exportAssets").click(function () {
        exportAssetsInfo();
    });
    //新增资产
    $("#addAsset").click(function () {
        $("#add").modal('show');
    });
    $("#saveAsset").click(function () {
        addAsset();
    });
    $("#editAsset").click(function () {
        editAsset();
    });
    $("#savefile").click(function () {
        insertFile();
    });
    $("#search").click(function () {
        $('#table').bootstrapTable('refreshOptions', {
            queryParams: function (params) {
                params.zctype = param.zctype;
                params.gsmc = $("#gsmc").val();
                return params;
            }
        })
    });

    $("#zctype").change(function () {
        param.zctype = $('#zctype').val();
        getcolumn();
        $('#assetsTable').bootstrapTable('destroy');
        $('#assetsTable').bootstrapTable({
            url: '/rczcgl/assetsconfig/getAssetsInfo.action',
            method: 'get',
            clickToSelect: true,
            //search:true,
            //showSearchButton:true,
            //showSearchClearButton:true,
            //searchAlign:left,
            sidePagination: "server",
            pagination: true,
            pageNumber: 1,
            pageSize: 5,
            pageList: [5, 10, 20, 50, 100],
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: columns,
            queryParamsType: "limit",
            queryParams: function (params) {
                params.zctype = param.zctype;
                return params;
            },
            onLoadSuccess: function () {
            },
            onLoadError: function () {
            }
        })
    });

    //上传
    $("#fileup").on('shown.bs.modal', function () {
        uploader = WebUploader.create({
            auto: false,
            //swf路径
            swf: 'third/webuploader/Uploader.swf',
            server: '/rczcgl/upload/fileupload.action',
            pick: '#picker',
            chunked: true,
            chunkSize: 200 * 1024 * 1024,
            chunkRetry: 3,
            threads: 1,
            fileNumLimit: 1,
            fileSizeLimit: 2000 * 1024 * 1024,
            resize: false
        });
        uploader.on('fileQueued', function (file) {
            $("div").remove("#fontregion");
            $("#fileInfo").addClass('background-color', '#f1f1f1');
            $("#fileInfo").addClass('border-radius', '10px');
            $("#fileInfo").html("");
            $one = $("<div id='" + file.id + "'class='filename'>" + file.name + "</div>");
            $two = $("<div id='state' class='zt'>等待上传......</div>");
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
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' + percentage * 100 + '%' +
                    '</div>' +
                    '</div>').appendTo($li).find('.progress-bar');
            }
            $("#state").text("正在上传中...");
            $percent.css('width', percentage * 100 + '%');
        });

        //发送前填充数据
        uploader.on('uploadBeforeSend', function (block, data) {
            debugger;
            data.zcid = zcid;
        });


        uploader.on('uploadSuccess', function (file, response) {
            $('#state').text('已上传');
            $('#' + file.id).find(".progress").find(".progress-bar").attr("class", "progress-bar progress-bar-success");
            if (response.code == 1) {
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

    $('#fileup').on('hide.bs.modal', function () {
        $("#fileInfo").empty();
        //$("#uparea").append
        uploader.destroy();
    });
    //文件下载
    $("#xiazai").click(function () {
        debugger;
        var rowdata = $("#filedownlist").bootstrapTable('getSelections');
        if (rowdata.length > 0) {
            for (var i = 0; i < rowdata.length; i++) {
                var downloadA = document.createElement("a");
                downloadA.setAttribute("href", "/rczcgl/" + rowdata[i].filepath + "/" + rowdata[i].filename);
                downloadA.setAttribute("target", "_blank");
                downloadA.setAttribute("download", rowdata[i].filename);
                downloadA.click();
                downloadA.remove();
            }
        } else {
            alert("请选择要下载的文件");
            return;
        }

    })


    //获取动态列
    getcolumn();
    $('#assetsTable').bootstrapTable({
        url: '/rczcgl/assetsconfig/getAssetsInfo.action',
        method: 'get',
        clickToSelect: true,
        //search:true,
        //showSearchButton:true,
        //showSearchClearButton:true,
        //searchAlign:"left",
        sidePagination: "server",
        pagination: true,
        pageNumber: 1,
        pageSize: 5,
        pageList: [5, 10, 20, 50, 100],
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        columns: columns,
        queryParamsType: "limit",
        queryParams: function (params) {
            params.zctype = param.zctype;
            return params;
        },
        onLoadSuccess: function () {
        },
        onLoadError: function () {
        },
        onClickCell: function (field, value, row, $element) {
        },
        onCheck: function (row, $element) {
            debugger;
            var userId = row.id;
            $.ajax({
                type: "post",
                url: "/rczcgl/user/getRoleByUserId.action",
                sync: false,
                data: {"userid": userId},
                success: function (data) {
                    debugger;
                    $("#roleTable").bootstrapTable('uncheckAll');
                    if (data != "" && data != null) {
                        $("#roleTable").bootstrapTable('checkBy', {field: 'roleId', values: [data]});
                    }
                },
                error: function () {
                    alert("关联失败！")
                }
            })
        }
    })
});

function getcolumn() {
    debugger;
    columns = [];
    var zctype = $("#zctype").val();
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
        async: false,
        data: param,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].zctype == '1') {
                    data[i].zctype = "土地资产";
                }
                if (data[i].zctype == '2') {
                    data[i].zctype = "房屋资产";
                }
                if (data[i].zctype == '3') {
                    data[i].zctype = "海域资产";
                }
                var obj = {};
                obj.field = data[i].field;
                obj.title = data[i].fieldname;
                columns.push(obj);

                var htmlLeft = '',
                    htmlRight = '';
                if (i % 2 === 0) {
                    htmlLeft = htmlLeft + '<div class="form-group"> <label for="' + data[i].field + '">' + data[i].fieldname + '</label>' +
                        '<input type="text" class="form-control" id="' + data[i].field + '" name="' + data[i].field + '"> </div>'
                } else {
                    htmlRight = htmlRight + '<div class="form-group"> <label for="' + data[i].field + '">' + data[i].fieldname + '</label>' +
                        '<input type="text" class="form-control" id="' + data[i].field + '" name="' + data[i].field + '"> </div>'
                }
                $(".landAssetsLeft").append(htmlLeft);
                $(".landAssetsRight").append(htmlRight);
            }
            $(".landAssetsLeft").append(' <input type="text" class="form-control" id="zcid" name="zcid" style="display: none"> ');
            var toolCol = {
                field: 'operate',
                title: '操作',
                width: '500px',
                class: 'toolCol',
                formatter: btnGroup,    // 自定义方法，添加按钮组
                events: {               // 注册按钮组事件
                    'click #modRole': function (event, value, row, index) {
                        $("#fileup").modal('show');
                        zcid = row.zcid;
                    },
                    'click #modUser': function (event, value, row, index) {
                        showInfo(row);
                        loadData(row);
                    },
                    'click #edit': function (event, value, row, index) {
                        loadData(row);
                    },
                    'click #filesdown': function (event, value, row, index) {
                        showInfoDown(row);
                    }
                }
            };
            columns.push(toolCol);
        },
        error: function () {
        }
    })
}

function exportAssetsInfo() {
    debugger;
    $.ajax({
        type: "post",
        url: "/rczcgl/export/exportAssets.action",
        async: false,
        data: param,
        success: function (data) {
            var downloadA = document.createElement("a");
            downloadA.setAttribute("href", data.data);
            downloadA.setAttribute("target", "_blank");
            downloadA.click();
            downloadA.remove();
        },
        error: function () {
        }
    })
}

function importAssetsInfo() {
    debugger;
    $("#zclx").val(param.zctype);
    var form = new FormData($("#assetsform")[0]);
    $.ajax({
        type: "post",
        url: "/rczcgl/export/importAssets.action",
        data: form,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert("导入成功！");
            $("#assetsform")[0].reset();
            $('#assetsTable').bootstrapTable('refresh');

        },
        error: function () {
            $("#assetsform")[0].reset();
        }
    })
}

function btnGroup() {   // 自定义方法，添加操作按钮
    // data-target="xxx" 为点击按钮弹出指定名字的模态框
    var html =
        '<a href="####" class="btn btn-info" id="modUser" data-toggle="modal" data-target="#view" ' +
        ' title="档案卡">' +
        '<span class="glyphicon glyphicon-info-sign">档案卡</span></a>' +
        '<a href="####" class="btn btn-primary" id="edit" data-toggle="modal" data-target="#editAssert" ' +
        'style="margin-left:15px" title="编辑资产">' +
        '<span class="glyphicon glyphicon-edit">编辑资产</span></a>' +
        '<a href="####" class="btn btn-warning" id="modRole" title="上传附件" style="margin-left:15px">' +
        '<span class="glyphicon glyphicon-upload">上传附件</span></a>' +
        '<a href="####" class="btn btn-info" id="filesdown" data-toggle="modal" data-target="#filedown" style="margin-left:15px" title="下载附件">' +
        '<span class="glyphicon glyphicon-download">下载附件</span></a>';
    return html
}

function addAsset() {
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

function editAsset() {
    var arr = $("#editform").serializeArray();
    //arr.push({name: "zctype", value: param.zctype});
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/editAsset.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success: function (res) {
            $('#assetsTable').bootstrapTable('refresh');
            $("#editAssert").modal('hide');
        },
        error: function (res) {
            alert("系统错误，请稍后重试！");
        }
    })
}

function insertFile() {
    $.ajax({
        type: "post",
        url: "/rczcgl/flow/insertFile.action",
        data: JSON.stringify({'zcid': zcid, 'fileid': fileid}),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success: function (resonsedata) {
            alert("保存成功");
            $("#fileup").modal('hide');
        },
        error: function () {
        }
    })
}
function showInfo(row) {
    $("#fileTable").bootstrapTable('destroy');
    $('#fileTable').bootstrapTable({
        url: '/rczcgl/assetsconfig/getAssetFileListByZcid.action',
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        clickToSelect: true,
        sidePagination: "client",
        pagination: true,
        pageNumber: 1,
        pageSize: 5,
        pageList: [5, 10, 20, 50, 100],
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        columns: [{
            field: 'filename',
            title: '文件名称'
        }, {
            field: 'filepath',
            title: '文件路径'
        }],
        queryParams: function (params) {
            return JSON.stringify({
                //limit: params.limit,
                //offset: params.offset,
                "zcid": row.zcid
            });
        },
        onLoadSuccess: function () {
            //$("#view").modal('show');
        },
        onLoadError: function () {
        },
        onClickCell: function (field, value, row, $element) {
        },
        onCheck: function (row, $element) {
        }
    })
}
function showInfoDown(row) {
    $("#filedownlist").bootstrapTable('destroy');
    $('#filedownlist').bootstrapTable({
        url: '/rczcgl/assetsconfig/getAssetFileListByZcid.action',
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        clickToSelect: true,
        checkbox: true,
        singleSelect: true,
        sidePagination: "client",
        pagination: true,
        pageNumber: 1,
        pageSize: 5,
        pageList: [5, 10, 20, 50, 100],
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        columns: [
            {checkbox: true},
            {field: 'filename', title: '文件名称'},
            {field: 'filepath', title: '文件路径'}
        ],
        queryParams: function (params) {
            return JSON.stringify({
                //limit: params.limit,
                //offset: params.offset,
                "zcid": row.zcid
            });
        },
        onLoadSuccess: function () {
            //$("#view").modal('show');
        },
        onLoadError: function () {
        },
        onClickCell: function (field, value, row, $element) {
        },
        onCheck: function (row, $element) {
        }
    })
}

function loadData(row) {
    //var obj = eval("("+jsonStr+")");
    var obj = row;
    var key, value, tagName, type, arr;
    for (x in obj) {
        key = x;
        value = obj[x];

        $("[name='" + key + "'],[name='" + key + "[]']").each(function () {
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if (tagName == 'INPUT') {
                if (type == 'radio') {
                    $(this).attr('checked', $(this).val() == value);
                } else if (type == 'checkbox') {
                    arr = value.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        if ($(this).val() == arr[i]) {
                            $(this).attr('checked', true);
                            break;
                        }
                    }
                } else {
                    $(this).val(value);
                }
            } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                $(this).val(value);
            }

        });
    }
}