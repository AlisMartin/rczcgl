var user = $.cookie('user');
var userobj = eval('(' + user + ')');
var columns = [];
var param = {};
var zcid = "";
var fileid = "", isreset, newmap, editmap, viewmap, map, toolBar, X, Y,geo,geo1,initExtent,
    financeid = "",
    url = '/rczcgl/assetsconfig/getAssetsInfo.action';
param.gsmc = userobj.comId;

var bootheight;


$(function () {

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
        "esri/toolbars/edit",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/graphic",
        "esri/layers/FeatureLayer",
        "esri/dijit/editing/TemplatePicker",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/_base/lang",
        "dojo/domReady!"], function (Map, ArcGISDynamicMapServiceLayer, dom, on, Point, QueryTask, SpatialReference, Query, InfoTemplate,
                                     Draw, Edit, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer,
                                     ArcGISTiledMapServiceLayer, Graphic, FeatureLayer, TemplatePicker, arrayUtil, event, lang) {
        //setTimeout(function () {
        initExtent = new esri.geometry.Extent({
            "xmin": 122.36636457677508, "ymin": 37.11526795965575,
            "xmax": 122.44469643308702, "ymax": 37.14087096007849,
            //"spatialReference": {"wkid": 4326}
        })
            /*new esri.geometry.Extent({
            "xmin": 122.1102905273437, "ymin": 36.74652099609376,
            "xmax": 122.71179199218744, "ymax": 37.45513916015626,
            //"spatialReference": {"wkid": 4326}
        });*/

        viewmap = new Map("viewmap", {
            showInfoWindowOnClick: true, showLabels: true,
            displayGraphicsOnPan: false, logo: false,
            //extent: initExtent,
            maxZoom: 18,//最大缩放等级
            minZoom: 10,//最小缩放等级
            autoResize: true
        });
        newmap = new Map("newmap", {
            showInfoWindowOnClick: true, showLabels: true,
            displayGraphicsOnPan: false, logo: false,
            extent: new esri.geometry.Extent({
                "xmin": 122.36636457677508, "ymin": 37.11526795965575,
                "xmax": 122.44469643308702, "ymax": 37.14087096007849,
                //"spatialReference": {"wkid": 4326}
            }),
            maxZoom: 18,//最大缩放等级
            minZoom: 10,//最小缩放等级
            autoResize: true
        });
        editmap = new Map("editmap", {
            showInfoWindowOnClick: true, showLabels: true,
            displayGraphicsOnPan: false, logo: false,
            extent: initExtent,
            maxZoom: 18,//最大缩放等级
            minZoom: 10,//最小缩放等级
            autoResize: true
        });

        var layer = new ArcGISTiledMapServiceLayer("http://192.168.0.108:6080/arcgis/rest/services/DELETE/MapServer");
        var layer1 = new ArcGISTiledMapServiceLayer("http://192.168.0.108:6080/arcgis/rest/services/DELETE/MapServer");
        var layer2 = new ArcGISTiledMapServiceLayer("http://192.168.0.108:6080/arcgis/rest/services/DELETE/MapServer");
        var PointLayer1 = new FeatureLayer("http://192.168.0.108:6080/arcgis/rest/services/FEATUREpoi/FeatureServer/0", {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            displayOnPan: true
        });

        editmap.addLayer(layer2);
        editmap.addLayer(PointLayer1);
        viewmap.addLayer(layer);

        var PointLayer = new FeatureLayer("http://192.168.0.108:6080/arcgis/rest/services/FEATUREpoi/FeatureServer/0", {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            displayOnPan: true
        });

        newmap.addLayer(layer1);
        newmap.addLayer(PointLayer);


        function drawEndEvent(evt) {
            //toolBar.deactivate();
            //添加图形到地图
            var symbol;
            if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                var markerSymbol = new SimpleMarkerSymbol();
                markerSymbol.setColor(new Color("#00FFFF"));
                symbol = markerSymbol;
            }
            var graphic = new Graphic(evt.geometry, symbol);
            $("#" + X).val(evt.geometry.x);
            $("#" + Y).val(evt.geometry.y);
            newmap.graphics.clear();
            newmap.graphics.add(graphic)
        }

        map = {
            teast:function(){
                var currentLayer = PointLayer1;
                var editToolbar = new Edit(editmap);
                editToolbar.on("deactivate", function (evt) {
                    currentLayer.applyEdits(null, [evt.graphic], null);
                });
                var editingEnabled = false;
                PointLayer1.on("dbl-click", function (evt) {
                    event.stop(evt);
                    if (editingEnabled === false) {
                        editingEnabled = true;
                        editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                    } else {
                        currentLayer = this;
                        editToolbar.deactivate();
                        editingEnabled = false;
                    }
                });
                PointLayer1.on("click", function (evt) {
                    event.stop(evt);
                    if (evt.ctrlKey === true || evt.metaKey === true) {  //delete feature if ctrl key is depressed
                        PointLayer1.applyEdits(null, null, [evt.graphic]);
                        currentLayer = this;
                        editToolbar.deactivate();
                        editingEnabled = false;
                    }
                });

                $("#drawTool1").click(function () {

                    drawToolbar1.activate(Draw.POINT);
                });
                var drawToolbar1 = new Draw(editmap, {
                    showTooltips: false
                });
                drawToolbar1.on("draw-end", function (evt) {
                    //toolBaredit.deactivate();
                    //添加图形到地图
                    var symbol;
                    if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                        var markerSymbol = new SimpleMarkerSymbol();
                        markerSymbol.setColor(new Color("#00FFFF"));
                        symbol = markerSymbol;
                    }
                    geo1 = evt.geometry;
                    var graphic = new Graphic(evt.geometry, symbol);
                    //$("#" + X).val(evt.geometry.x);
                    //$("#" + Y).val(evt.geometry.y);
                    editmap.graphics.clear();
                    editmap.graphics.add(graphic)
                });


            },
            initEditing: function (evt) {
                var currentLayer = PointLayer;
                var editToolbar = new Edit(newmap);
                editToolbar.on("deactivate", function (evt) {
                    currentLayer.applyEdits(null, [evt.graphic], null);
                });
                var editingEnabled = false;
                PointLayer.on("dbl-click", function (evt) {
                    event.stop(evt);
                    if (editingEnabled === false) {
                        editingEnabled = true;
                        editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                    } else {
                        currentLayer = this;
                        editToolbar.deactivate();
                        editingEnabled = false;
                    }
                });
                PointLayer.on("click", function (evt) {
                    event.stop(evt);
                    if (evt.ctrlKey === true || evt.metaKey === true) {  //delete feature if ctrl key is depressed
                        PointLayer.applyEdits(null, null, [evt.graphic]);
                        currentLayer = this;
                        editToolbar.deactivate();
                        editingEnabled = false;
                    }
                });
                $("#drawTool").click(function () {
                    drawToolbar.activate(Draw.POINT);
                });
                var drawToolbar = new Draw(newmap, {
                    showTooltips: false
                });

                drawToolbar.on("draw-end", function (evt) {
                    //drawToolbar.deactivate();
                    //editToolbar.deactivate();
                    /*var obj = {
                        ID:"555",
                        CON:"",
                        LAYERID:""
                    };*/
                    geo = evt.geometry;
                    //var newAttributes = lang.mixin({}, obj);
                    var markerSymbol = new SimpleMarkerSymbol();
                    markerSymbol.setColor(new Color("#00FFFF"));
                    var newGraphic = new Graphic(evt.geometry, markerSymbol);
                    //PointLayer.applyEdits([newGraphic], null, null);
                    newmap.graphics.clear();
                    newmap.graphics.add(newGraphic);
                });
            },
            addSave: function(id){
                var obj = {
                    FID:"555",
                    LAYERID:id
                };

                var newAttributes = lang.mixin({}, obj);
                var newGraphic = new Graphic(geo, null, newAttributes);
                PointLayer.applyEdits([newGraphic], null, null);
                newmap.graphics.clear();
            },
            editSave: function(OBJECTID_1){

                debugger;
                var query = new Query();
                query.where = "LAYERID  like '" + OBJECTID_1 + "'";
                PointLayer.queryIds(query, function(objectIds) {
                    var obj = {
                        OBJECTID_1:objectIds[0]
                    };
                    var newAttributes = lang.mixin({}, obj);
                    var newGraphic = new Graphic(geo1, null, newAttributes);
                    PointLayer.applyEdits(null, [newGraphic],  null);
                });

                editmap.graphics.clear();
            },
            reset:function(){
                viewmap.setExtent(initExtent);
                viewmap.graphics.clear();
                viewmap.infoWindow.hide();
            },
            addPoint: function (id,row) {
                //定义查询对象

                var url = "http://192.168.0.108:6080/arcgis/rest/services/RES1/MapServer/" + (zctype-1);
                if(zctype == 2){
                    url = "http://192.168.0.108:6080/arcgis/rest/services/FEATUREpoi/FeatureServer/0";
                }
                var queryTask = new QueryTask(url);
                //定义查询参数对象
                var query = new Query();
                //查询条件，类似于sql语句的where子句
                query.where = "LAYERID  like '" + id + "'";
                //返回的字段信息：*代表返回全部字段
                query.outFields = ["*"];
                //是否返回几何形状
                query.returnGeometry = true;
                //执行属性查询
                queryTask.execute(query, showQueryResult);
                //属性查询完成之后，用showQueryResult来处理返回的结果
                function showQueryResult(queryResult) {
                    //创建点符号
                    var markerSymbol = new SimpleMarkerSymbol();
                    markerSymbol.setColor(new Color("#00FFFF"));
                    //创建线符号
                    var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 4);
                    //创建面符号
                    var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol,new Color([255,255,0,0.2]));
                    if (queryResult.features.length >= 1) {
                        //获得图形graphic
                        var geometry = queryResult.features[0].geometry;
                        $.ajax({
                            type: "post",
                            url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
                            async: false,
                            data: {zctype: zctype},
                            success: function (data) {
                                tem = "";
                                for (var i = 0; i < 4; i++) {
                                    tem = tem + data[i].fieldname + ":${" + data[i].field + "}<br>"
                                }
                            }
                        });
                        var infoTemplate = new InfoTemplate("属性", tem);
                        var graphic;
                        if(geometry.x){
                            graphic = new Graphic(geometry, markerSymbol, row, infoTemplate);
                        }else{
                            graphic = new Graphic(geometry, fill, row, infoTemplate);
                        }
                        viewmap.graphics.clear();
                        viewmap.infoWindow.hide();
                        viewmap.graphics.add(graphic);
                        //viewmap.setExtent(geometry.getExtent().expand(6));
                        if(geometry.x){
                            viewmap.centerAndZoom(geometry, 17);
                        }else{
                            viewmap.setExtent(geometry.getExtent().expand(6));
                        }
                    }
                }
            }
        };
        //}, 5000);
    });

    bootheight=parent.window.document.getElementById('chartheight').scrollHeight*0.75+"px";
    getCompanys();
    var zctype = parent.document.getElementById("InfoList").src.split("?")[1].split("&&")[0];
    zctype = zctype.substring(zctype.length - 1, zctype.length);
    param.zctype = zctype;
    $('#pointmap').on('hide.bs.modal', function () {
        map.reset();

    });
        //导入
    $("#importAssets").click(function () {
        debugger;
        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"18")){
            alert("当前用户无权限进行此操作！");
            return;
        }
        $("#assetsFile").click();
    });
    //导出
    $("#exportAssets").click(function () {
        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"18")){
            alert("当前用户无权限进行此操作！");
            return;
        }
        exportAssetsInfo();
    });
    //新增资产
    $("#addAsset").click(function () {
        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"16")){
            alert("当前用户无权限进行此操作！");
            return;
        }
        $("input[type=reset]").trigger("click");
        $("#add").modal('show');
        newmap.graphics.clear();
    });

    $("#editAssert").on('shown.bs.modal', function () {

        editmap.resize(true);
        editmap.reposition();
        map.teast();
    });
    $("#add").on('shown.bs.modal', function () {
        //newmap.autoResize;

        if (param.zctype != 2) {
            $("#newmap").hide();
        } else {
            $("#newmap").show();
        }
        // 获取mapDiv大小改变前的地图中心点坐标
        // var centerPoint = initExtent.getCenter();
        newmap.resize(true);
        newmap.reposition();
        // newmap.centerAt(centerPoint);

        map.initEditing();

        //document.getElementsByClassName('modal').style.height = (parent.window.document.getElementById('chartheight').scrollHeight - 80) + "px";
        //$(".modal").css("height",(parent.window.document.getElementById('chartheight').scrollHeight - 80) + "px")
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
        showFinanceList(financeid);
    });
    $("#saveFinance").click(function () {
        //保存融资
        //financeid
        $('#editform #financeid').val(financeid);
        $("#financeList").modal('hide');

    });
    $('#financeList').on('hidden.bs.modal', function () {
        $(".colorsty").addClass("modal-open");
    });
    $('#selectuser').on('hidden.bs.modal', function () {
        $(".colorsty").addClass("modal-open");
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

    $("#saveJsuser").click(function(){
        debugger;
        var data=$("#Jsuser").bootstrapTable('getSelections');
        if(data.length<=0){
            alert("请选择消息接收人员！");
            return;
        }
        var users="";
        var usernames="";
        for(var i=0;i<data.length;i++){
            users=users+data[i].id+",";
            usernames=usernames+data[i].userName+",";
        }
        users=users.substring(0,users.length-1);
        $("#editform #jsusers").val(users);
        $("#selectuser").modal('hide');
    });

    $("#zctype").change(function () {
        param.zctype = $('#zctype').val();
        getcolumn();
        $('#assetsTable').bootstrapTable('destroy');
        $('#assetsTable').bootstrapTable({
            url: '/rczcgl/assetsconfig/getAssetsInfo.action',
            method: 'post',
            height:bootheight,
            contentType: "application/json;charset=UTF-8",
            clickToSelect: true,
            sidePagination: "server",
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
            //pageList: [5, 10, 20, 50, 100],
            paginationPreText: "上一页",
            paginationNextText: "下一页",
            columns: columns,
            queryParamsType: "limit",
            queryParams: function (params) {
                params.zctype = param.zctype;
                if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"10")){
                    params.gsmc = userobj.comId;
                }
                //params.gsmc = gsmc;
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
    //文件删除
    $("#deleteFile").click(function () {
        var rowdata = $("#filedownlist").bootstrapTable('getSelections');
        if (rowdata.length > 0) {
            for (var i = 0; i < rowdata.length; i++) {
                var a=rowdata[i].fileid;
                $.ajax({
                    type:"post",
                    contentType: "application/json;charset=UTF-8",
                    url:"/rczcgl/assetsconfig/delAssetsFile.action",
                    async:false,
                    data:JSON.stringify({id:a}),
                    success:function(resdata){
                        if(resdata.code==1){
                            alert("刪除成功！");
                            $("#filedownlist").bootstrapTable('refresh');
                        }else{
                            alert("刪除失敗！");
                        }
                    },
                    error:function(){
                    }
                })
            }
        } else {
            alert("请选择要删除的文件");
            return;
        }
    })
    //资产删除
    $("#deleteAssets").click(function () {
        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"25")){
            alert("当前用户无权限进行此操作！");
            return;
        }
        var rowdata = $("#assetsTable").bootstrapTable('getSelections');
        if (rowdata.length > 0) {
            for (var i = 0; i < rowdata.length; i++) {
                var a=rowdata[i].zcid;
                $.ajax({
                    type:"post",
                    contentType: "application/json;charset=UTF-8",
                    url:"/rczcgl/assetsconfig/delAssets.action",
                    async:false,
                    data:JSON.stringify({id:a}),
                    success:function(resdata){
                        if(resdata.code==1){
                            alert("刪除成功！");
                            $("#assetsTable").bootstrapTable('refresh');
                        }else{
                            alert("刪除失敗！");
                        }
                    },
                    error:function(){
                    }
                })
            }
        } else {
            alert("请选择要删除的资产");
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
        height:bootheight,
        sidePagination: "server",
        pagination: true,
        pageNumber: 1,
        pageSize: 10,
        theadClasses: "fontstyle",//这里设置表头样式
        //pageList: [5, 10, 20, 50, 100],
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        columns: columns,
        queryParamsType: "limit",
        queryParams: function (params) {
            params.zctype = param.zctype;
            if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"10")){
                params.gsmc = userobj.comId;
            }
       /*     if(!hasAuth(userobj.auth,"8")){
                params.gsmc = gsmc;
            }*/

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
        }
    })
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"73%");
});

function getcolumn() {
    debugger;
    var objyu = {
        visible: true,
        class: "dayorder",
        field: "dayorder",
        title: "是否预警",
        align:'center'
    };
    //obj.field = "yujing";
    //obj.title = "是否预警";
    columns = [
        {checkbox: true},
        {
            title:'序号',
            formatter:function(value,row,index){
                var pageSize=$("#assetsTable").bootstrapTable('getOptions').pageSize;
                var pageNumber=$("#assetsTable").bootstrapTable('getOptions').pageNumber;
                return pageSize*(pageNumber-1)+index+1;
            },
        },
        {
        visible: true,
        class: "dayorder",
        field: "dayorder",
        title: "是否预警"
    },
        {
            visible: true,
            class: "dayorder",
            field: "days",
            title: "预警天数"
        }];
    var zctype = $("#zctype").val();
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
        async: false,
        data: param,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {

                if (data[i].fieldname == "X坐标") {
                    X = data[i].field
                }
                if (data[i].fieldname == "Y坐标") {
                    Y = data[i].field
                }
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
                if(i != 0){
                    columns.push(obj);
                }
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
                                map.addPoint(row.layerid,row);
                            }
                        }
                    };
                    columns.push(pointxy);
                }
                //生成表单
                var htmlLeft = '',
                    htmlRight = '',
                    html = '<div class="form-group"> <label class="col-sm-6 control-label" for="' + data[i].field + '">' + data[i].fieldname + ' </label>' +
                        '<div class="col-sm-6"><input class="form-control" id="' + data[i].field + '" name="' + data[i].field + '" type="' + data[i].fieldType + '" "> ' +
                        '</div> </div>';
                if (i % 2 === 0) {
                    htmlLeft = htmlLeft + html
                } else {
                    htmlRight = htmlRight + html
                }
                $(".landAssetsLeft").append(htmlLeft);
                $(".landAssetsRight").append(htmlRight);
            }
            $(".landAssetsLeft").append('<div class="form-group"> <label class="col-sm-6 control-label" for="days">报警时间</label>' +
                '<div class="col-sm-6"><input class="form-control " id="days" name="days" type="number" "> </div></div>');
            $(".landAssetsRight").append('<div class="form-group"> <label class="col-sm-6 control-label" for="stopday">截止日期</label>' +
                '<div class="col-sm-6"><input class="form-control" id="stopday" name="stopday" type="date" "> </div></div>');
            $(".landAssetsLeft").append(' <input type="text" class="form-control" id="zcid" name="zcid" style="display: none">' +
                '<input type="text" class="form-control" id="financeid" name="financeid" style="display: none"> ' +
                '<input type="text" class="form-control" id="jsusers" name="jsusers" style="display: none"> ');
            //添加操作列
            var toolCol = {
                field: 'operate',
                title: '操作',
                width: '500px',
                class: 'toolCol',
                formatter: btnGroup,    // 自定义方法，添加按钮组
                events: {               // 注册按钮组事件
                    'click #modRole': function (event, value, row, index) {
                        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"19")){
                            alert("当前用户无权限进行此操作！");
                            return;
                        }
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
                        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"16")){
                            alert("当前用户无权限进行此操作！");
                            return;
                        };
                        $("#editAssert").modal('show');
                        if(row.zctype == 2){
                            $("#editmap").show();
                        }else{
                            $("#editmap").hide();
                        }
                        $(".selectuser").hide();
                        $(".selectFinance").hide();
                        loadData(row);
                        isreset = 0;
                    },
                    'click #filesdown': function (event, value, row, index) {
                        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"19")){
                            alert("当前用户无权限进行此操作！");
                            return;
                        }
                        $("#filedown").modal('show');
                        showInfoDown(row);
                    },
                    'click #reset': function (event, value, row, index) {
                        if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"17")){
                            alert("当前用户无权限进行此操作！");
                            return;
                        }
                        $("#editAssert").modal('show');
                        $("#editmap").hide();
                        $(".selectuser").show();
                        $(".selectFinance").show();
                        loadJsuser();
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
        '<a href="####" class="btn btn-primary" id="edit"' +
        'style="margin-left:15px" title="编辑资产">' +
        '<span class="glyphicon glyphicon-edit">编辑资产</span></a>' +
        '<a href="####" class="btn btn-warning" id="modRole" title="上传附件" style="margin-left:15px">' +
        '<span class="glyphicon glyphicon-upload">上传附件</span></a>' +
        '<a href="####" class="btn btn-info" id="filesdown" style="margin-left:15px" title="下载附件">' +
        '<span class="glyphicon glyphicon-download">下载附件</span></a>' +
        '<a href="####" class="btn btn-info" id="reset" style="margin-left:15px" title="信息变更">' +
        '<span class="glyphicon glyphicon-edit">信息变更</span></a>';
    var htmlHistory =
        '<a href="####" class="btn btn-info" id="modUser"  ' +
        ' title="档案卡">' +
        '<span class="glyphicon glyphicon-info-sign">档案卡</span></a>' +
        '<a href="####" class="btn btn-info" id="filesdown" style="margin-left:15px" title="下载附件">' +
        '<span class="glyphicon glyphicon-download">下载附件</span></a>';
    if (url === '/rczcgl/assetsconfig/getAssetsInfo.action') {
        return html
    } else {
        return htmlHistory
    }
}

function addAsset() {
    var arr = $("#addform").serializeArray();
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].name == "field1" && arr[i].value == ""){
            alert("请输入编号");
            return;
        }
        if(arr[i].name == "field2" && arr[i].value == ""){
            alert("请输入公司名称");
            return;
        }
        if(arr[i].name == "field3" && arr[i].value == ""){
            alert("请输入项目名称");
            return;
        }
    }
    arr.push({name: "zctype", value: param.zctype});
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/addAssetsByType.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success: function (res) {
            $('#add').modal('hide');
            if (res.data != "") {
                map.addSave(res.data);
            }
            $('#assetsTable').bootstrapTable('refresh');
            $("#editAssert").modal('hide');
        },
        error: function (res) {
            alert("系统错误，请稍后重试！");
        }
    })
}

function editAsset() {
    var arr = $("#editform").serializeArray();
    if (isreset) {
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
            map.editSave(res.data);
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

function loadJsuser() {
    $("#Jsuser").bootstrapTable('destroy');
    $('#Jsuser').bootstrapTable({
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
        pageSize: 10,
        //pageList: [5, 10, 20, 50, 100],
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        columns: columns,
        queryParamsType: "limit",
        queryParams: function (params) {
            return JSON.stringify(params);
        },

        onCheck: function (row, $element) {
            financeid = row.zcid;
        },
        onUncheck: function (row, $element) {
            financeid = "";
        },
        onLoadSuccess: function () {
            $('#financeTable').bootstrapTable("checkBy", {field: 'zcid', values: [id]});
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
        pageSize: 10,
        //pageList: [5, 10, 20, 50, 100],
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
    //$('#importAssets').toggle();
    //$('#addAsset').toggle();
    var classq = a.className;

    if (classq === "getAssetsInfo"||classq === "allcompany") {
        url = '/rczcgl/assetsconfig/getAssetsInfo.action';
        $('#importAssets').show();
        $('#addAsset').show();
    } else if (classq === "getAssetsHistoryInfo"||classq === "allcompany") {
        url = '/rczcgl/assetsconfig/getAssetsHistoryInfo.action';
        $('#importAssets').hide();
        $('#addAsset').hide();
    } else {
        gsmc = classq;
    }

    var comId= a.className;
    if(comId!=""&&comId!="allcompany"){
        param.gsmc = comId;
    }else{
        param.gsmc=null;
    }
/*    if(hasAuth(userobj.auth,"8")||hasAuth(userobj.auth,"10")){
        param.gsmc=null;
    }else{
        param.gsmc = comId;
    }*/
    $('#assetsTable').bootstrapTable('refreshOptions', {
        url: url,
        queryParams: function (params) {

            params.zctype = param.zctype;
   /*         if(!hasAuth(userobj.auth,"8")&&!hasAuth(userobj.auth,"10")){
                params.gsmc = gsmc;
            }*/
            if(classq!="allcompany"){
                params.gsmc = gsmc;
            }

            return JSON.stringify(params);
        },
        pageNumber: 1
    })
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"75%");
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
            htmlLeft = htmlLeft +  '<li class="active" style="flex: none"><a class="allcompany" data-toggle="tab" onclick="reloadTable(this)">所有公司</a></li>';
            for (var i = 0; i < data.length; i++) {
                //生成表单
            /*    if (i === 0) {
                    htmlLeft = htmlLeft +
                        '<li class="active" style="flex: none"><a class="' + data[i].id + '" data-toggle="tab" onclick="reloadTable(this)">' + data[i].nodeName + '</a></li>';
                } else {*/
                    htmlLeft = htmlLeft +
                        '<li style="flex: none" ><a class="' + data[i].id + '" data-toggle="tab" onclick="reloadTable(this)">' + data[i].nodeName + '</a></li>';
               // }
            }

            if (hasAuth(userobj.auth,"10") || hasAuth(userobj.auth,"8")) {
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
function setColor(tableId) {
    var tableId = document.getElementById(tableId);

    for (var i = 1; i < tableId.rows.length; i++) {
        var row = tableId.rows[i].cells[2].innerHTML;
        var days = tableId.rows[i].cells[3].innerHTML;
        if (!isNaN(row)) {
            row = parseInt(row);
            if (row <= 0) {
                tableId.rows[i].setAttribute("style", "background: #d9534f;");
            } else if (row < days) {
                tableId.rows[i].setAttribute("style", "background: #dc5d599c;");
            }
        }
    }
}