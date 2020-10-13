var user= $.cookie('user');
var userobj=eval('('+user+')');
var columns = [];
var param = {};
var zcid = "";
var fileid = "", isreset, newmap, editmap, viewmap, map, toolBar,
    financeid = "",
    url = '/rczcgl/assetsconfig/getAssetsInfo.action',
   // gsmc = "1"
    gsmc=userobj.comId;

require(["esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dojo/dom",
    "dojo/on",
    "esri/geometry/Point",
    "esri/tasks/QueryTask",
    "esri/SpatialReference",
    "esri/tasks/query",
    "esri/InfoTemplate",
    "esri/toolbars/draw",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "dojo/domReady!"], function (Map, ArcGISDynamicMapServiceLayer, dom, on, Point, QueryTask, SpatialReference, Query, InfoTemplate,
                                 Draw, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer, Graphic) {
    setTimeout(function () {
        newmap = new Map("newmap", {
            basemap: "osm",
            center: [122.376, 37.096],
            zoom: 12,
            autoResize: true
        });
        viewmap = new Map("viewmap", {
            basemap: "osm",
            center: [122.376, 37.096],
            zoom: 12,
            autoResize: true
        });
        //创建点要素
        $("#drawTool").click(function () {
            //使用toolbar上的绘图工具
            toolBar = new Draw(newmap);
            toolBar.on("draw-end", drawEndEvent);
            toolBar.activate("point");
        });
        function drawEndEvent(evt) {
            toolBar.deactivate();
            //添加图形到地图
            var symbol;
            if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                var markerSymbol = new SimpleMarkerSymbol();
                markerSymbol.setColor(new Color("#00FFFF"));
                symbol = markerSymbol;
            }
            var graphic = new Graphic(evt.geometry, symbol);

            newmap.graphics.clear();
            newmap.graphics.add(graphic)
        }

        map = {
            addPoint: function (id) {
                /*var markerSymbol = new SimpleMarkerSymbol();
                 markerSymbol.setColor(new Color("#00FFFF"));
                 var startPt = esri.geometry.Point({
                 "x": x,
                 "y": y,
                 "spatialReference": {"wkid": 4326}
                 });
                 var graphic = new Graphic(startPt, symbol);
                 newmap.graphics.add(graphic);
                 */

                //定义查询对象
                var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer/0");
                //定义查询参数对象
                var query = new Query();
                //查询条件，类似于sql语句的where子句
                query.where = "XMC  like '%" + id + "%'";
                //返回的字段信息：*代表返回全部字段
                query.outFields = ["*"];
                //是否返回几何形状
                query.returnGeometry = true;
                //执行属性查询
                queryTask.execute(query, showQueryResult);
                //属性查询完成之后，用showQueryResult来处理返回的结果
                function showQueryResult(queryResult) {
                    //创建线符号
                    var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
                    //创建面符号
                    var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);

                    if (queryResult.features.length >= 1) {
                        for (var i = 0; i < queryResult.features.length; i++) {
                            //获得图形graphic
                            var graphic = new Graphic(queryResult.features[i].geometry, fill);
                            //var graphic = queryResult.features[i].geometry;
                            //赋予相应的符号
                            //graphic.setSymbol(fill);
                            //将graphic添加到地图中，从而实现高亮效果
                            viewmap.graphics.clear();
                            viewmap.graphics.add(graphic);
                            viewmap.centerAndZoom(queryResult.features[i].geometry.getExtent().getCenter(), 15);
                        }
                    }
                }
            }
        };
    }, 5000);

    /*editmap = new Map("editmap", {
     basemap: "osm",  //topo-vector   For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
     center: [122.376, 37.096], // longitude, latitude
     zoom: 12
     });*/


})
;

$(function () {
    getCompanys();
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
        $("input[type=reset]").trigger("click");
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
    $(".selectFinance").click(function () {
        //选择融资
        var financeid = $('#editform #financeid').val();
        showFinanceList(id);
    });
    $("#saveFinance").click(function () {
        //保存融资
        //financeid
        $('#editform #financeid').val(financeid);
        $("#financeList").modal('hide');
    });
    $("#search").click(function () {
        $('#assetsTable').bootstrapTable('refreshOptions', {
            queryParams: function (params) {
                params.zctype = param.zctype;
                params.gsmc = decodeURI($("#gsmc").val());
                return JSON.stringify(params);
            }
        })
    });

    $("#zctype").change(function () {
        param.zctype = $('#zctype').val();
        getcolumn();
        $('#assetsTable').bootstrapTable('destroy');
        $('#assetsTable').bootstrapTable({
            url: '/rczcgl/assetsconfig/getAssetsInfo.action',
            method: 'post',
            contentType: "application/json;charset=UTF-8",
            clickToSelect: true,
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
                params.gsmc = gsmc;
                return JSON.stringify(params);
            },
            onLoadSuccess: function () {
                setColor("assetsTable");
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
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        clickToSelect: true,
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
            params.gsmc = gsmc;
            return JSON.stringify(params);
        },
        onLoadSuccess: function () {
            setColor("assetsTable");
        },
        onLoadError: function () {
        },
        onClickCell: function (field, value, row, $element) {
        },
        onCheck: function (row, $element) {
            /*debugger;
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
             })*/
        }
    })
});

function getcolumn() {
    debugger;
    var objyu = {
        visible : true,
        class : "dayorder",
        field : "dayorder",
        title : "是否预警"};
    //obj.field = "yujing";
    //obj.title = "是否预警";
    columns = [{
        visible : true,
        class : "dayorder",
        field : "dayorder",
        title : "是否预警"},
        {visible : true,
        class : "dayorder",
        field : "days",
        title : "预警天数"}];
    var zctype = $("#zctype").val();
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
        async: false,
        data: param,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                switch (data[i].zctype) {
                    case '1':
                        data[i].zctype = "土地资产";
                        break;
                    case '2':
                        data[i].zctype = "房屋资产";
                        break;
                    case '3':
                        data[i].zctype = "海域资产";
                        break;
                    case '4':
                        data[i].zctype = "其他资产";
                        break;
                    default :
                        break;
                }
                switch (data[i].fieldType) {
                    case '1':
                        data[i].fieldType = "text";
                        break;
                    case '2':
                        data[i].fieldType = "number";
                        break;
                    case '3':
                        data[i].fieldType = "date";
                        break;
                    default :
                        break;
                }
                var obj = {};
                obj.field = data[i].field;
                obj.title = data[i].fieldname;
                columns.push(obj);
                //插入定位列
                if (i === 2) {
                    var pointxy = {
                        field: 'operateMap',
                        title: '地图',
                        width: '80px',
                        class: 'toolxy',
                        formatter: '<a href="####" class="btn btn-info" id="pointxy" data-toggle="modal" data-target="#pointmap" title="定位">' +
                        '<span class="glyphicon glyphicon-map-marker">定位</span></a>',    // 添加按钮
                        events: {               // 注册按钮事件
                            'click #pointxy': function (event, value, row, index) {
                                map.addPoint(row.id);
                            }
                        }
                    };
                    columns.push(pointxy);
                }
                //生成表单
                var htmlLeft = '',
                    htmlRight = '',
                    html = '<div class="form-group"> <label for="' + data[i].field + '">' + data[i].fieldname + '</label>' +
                        '<input class="form-control" id="' + data[i].field + '" name="' + data[i].field + '" type="' + data[i].fieldType + '" "> </div>';
                if (i % 2 === 0) {
                    htmlLeft = htmlLeft + html
                } else {
                    htmlRight = htmlRight + html
                }
                $(".landAssetsLeft").append(htmlLeft);
                $(".landAssetsRight").append(htmlRight);
            }
            $(".landAssetsLeft").append('<div class="form-group"> <label for="days">报警时间</label>' +
                '<input class="form-control" id="days" name="days" type="number" "> </div>');
            $(".landAssetsRight").append('<div class="form-group"> <label for="stopday">截止日期</label>' +
                '<input class="form-control" id="stopday" name="stopday" type="date" "> </div>');
            $(".landAssetsLeft").append(' <input type="text" class="form-control" id="zcid" name="zcid" style="display: none">' +
                '<input type="text" class="form-control" id="financeid" name="financeid" style="display: none"> ');
            //添加操作列
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
                        //showInfo(row);
                        $("#view").modal('show');
                        loadData(row);
                        //$("#view").modal('show');
                    },
                    'click #edit': function (event, value, row, index) {
                        loadData(row);
                        isreset = 0;
                    },
                    'click #filesdown': function (event, value, row, index) {
                        showInfoDown(row);
                    },
                    'click #reset': function (event, value, row, index) {
                        loadData(row);
                        isreset = 1;
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
            downloadA.setAttribute("href", encodeURI(data.data, "utf-8"));
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
        '<a href="####" class="btn btn-info" id="modUser"  ' +
        ' title="档案卡">' +
        '<span class="glyphicon glyphicon-info-sign">档案卡</span></a>' +
        '<a href="####" class="btn btn-primary" id="edit" data-toggle="modal" data-target="#editAssert" ' +
        'style="margin-left:15px" title="编辑资产">' +
        '<span class="glyphicon glyphicon-edit">编辑资产</span></a>' +
        '<a href="####" class="btn btn-warning" id="modRole" title="上传附件" style="margin-left:15px">' +
        '<span class="glyphicon glyphicon-upload">上传附件</span></a>' +
        '<a href="####" class="btn btn-info" id="filesdown" data-toggle="modal" data-target="#filedown" style="margin-left:15px" title="下载附件">' +
        '<span class="glyphicon glyphicon-download">下载附件</span></a>' +
        '<a href="####" class="btn btn-info" id="reset" data-toggle="modal" data-target="#editAssert" style="margin-left:15px" title="重置资产">' +
        '<span class="glyphicon glyphicon-edit">重置资产</span></a>';
    var htmlHistory =
        '<a href="####" class="btn btn-info" id="modUser"  ' +
        ' title="档案卡">' +
        '<span class="glyphicon glyphicon-info-sign">档案卡</span></a>' +
        '<a href="####" class="btn btn-info" id="filesdown" data-toggle="modal" data-target="#filedown" style="margin-left:15px" title="下载附件">' +
        '<span class="glyphicon glyphicon-download">下载附件</span></a>';
    if (url === '/rczcgl/assetsconfig/getAssetsInfo.action') {
        return html
    } else {
        return htmlHistory
    }
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
    if (isreset) {
        /*for (var i = 0; i < arr.length; i++) {  //遍历数组
            if (arr[i].name === "zcid") {
                arr[i].value = "";
            }
        }*/
        var addtype = {name: "zctype", value: param.zctype};
        arr.push(addtype);
    }
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
/*function showInfo(row) {
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
 "zcid": row.zcid
 });
 },
 onLoadSuccess: function () {
 $("#view").modal('show');
 },
 onLoadError: function () {
 },
 onClickCell: function (field, value, row, $element) {
 },
 onCheck: function (row, $element) {
 }
 })
 }*/
function showFinanceList(id) {
    $("#financeTable").bootstrapTable('destroy');
    var columns = [];
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
        async: false,
        data: {zctype: 5},
        success: function (data) {
            var htmlLeft = '';
            columns.push({checkbox: true});
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj.field = data[i].field;
                obj.title = data[i].fieldname;
                columns.push(obj);
            }
        },
        error: function () {
        }
    });
    $('#financeTable').bootstrapTable({
        url: '/rczcgl/finance/getFinanceList.action',
        method: 'post',
        contentType: "application/json;charset=UTF-8",
        clickToSelect: true,
        singleSelect: true,//单行选择单行,设置为true将禁止多选
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
            return JSON.stringify(params);
        },

        onCheck: function (row, $element) {
            //var row = $("#financeTable").bootstrapTable('getSelections');
            financeid = row.zcid;
        },
        onUncheck: function (row, $element) {
            financeid = "";
        },
        onLoadSuccess: function () {
            $('#financeTable').bootstrapTable("checkBy",{field: 'zcid', values:[id]});
        },
        onLoadError: function () {
            //showTips("数据加载失败!");
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
                "zcid": row.zcid
            });
        },
        onLoadSuccess: function () {
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


function reloadTable(a) {
    debugger;
    //var gsmc= a.innerText;

    //getcolumn();
    var classq = a.className;
    if (classq === "getAssetsInfo") {
        url = '/rczcgl/assetsconfig/getAssetsInfo.action';
    } else if (classq === "getAssetsHistoryInfo") {
        url = '/rczcgl/assetsconfig/getAssetsHistoryInfo.action';
    } else {
        gsmc = classq;
    }
    $('#assetsTable').bootstrapTable('refreshOptions', {
        url: url,
        queryParams: function (params) {
            params.zctype = param.zctype;
            params.gsmc = gsmc;
            return JSON.stringify(params);
        },
        //columns: columns
    })
}


function getCompanys() {
    $.ajax({
        type: "post",
        url: "/rczcgl/depart/getDepart.action",
        data: {'depart': "company"},
        async: false,
        success: function (res) {
            var data = res.data;
            gsmc = data[0].id;
            var htmlLeft = '';
            for (var i = 0; i < data.length; i++) {
                //生成表单
                if (i === 0) {
                    htmlLeft = htmlLeft +
                        '<li class="active"><a class="' + data[i].id + '" data-toggle="tab" onclick="reloadTable(this)">' + data[i].nodeName + '</a></li>';
                } else {
                    htmlLeft = htmlLeft +
                        '<li><a class="' + data[i].id + '" data-toggle="tab" onclick="reloadTable(this)">' + data[i].nodeName + '</a></li>';
                }
            }
            if(userobj.auth.indexOf("9")>-1||userobj.auth.indexOf("8")>-1){
                $("#myTab1").append(htmlLeft);
            }
           /* $("#myTab1").append(htmlLeft);*/
        },
        error: function () {
        }
    })
}

/**
 * 给表格的指定单元格值的行上色<br/>
 * 示例：setColor1('table_datalist', 'Waiting approval' , 'orange')
 * @returns
 */
function setColor(tableId){
    /*$('#'+tableId+' tr').each(function(){ // 获取指定ID的表格中的所有 TR 对象，然后用 each 遍历 这些 TR
        var tdText = $(this).find('td').eq(2).text(); // 获取当前这一行的 TR对象，然后查找这行的 TD 对象，当发现 TD 是 第2个 对象时，获取 这个 TD 的 文本值
        if( tdText == findValue ){
            $(this).attr('style','color:'+colorValue ); // 给当前行 的文本 上色
        }
    });*/
    var tableId = document.getElementById(tableId);

    for(var i = 1;i < tableId.rows.length;i++) {
        var row = tableId.rows[i].cells[0].innerHTML;
        var days = tableId.rows[i].cells[1].innerHTML;
        if(!isNaN(row)){
            row = parseInt(row);
            if(row <= 0){
                tableId.rows[i].setAttribute("style","background: #d9534f;");
            }else if(row < days){
                tableId.rows[i].setAttribute("style","background: #dc5d599c;");
            }
        }
    }
}