/**
 * Created by wrh on 2020/9/14.
 */
var map;

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
    "esri/layers/ArcGISTiledMapServiceLayer",
    "dojo/domReady!"], function (Map, ArcGISDynamicMapServiceLayer, dom, on, Point, QueryTask, SpatialReference, Query, InfoTemplate,
                                 SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color, GraphicsLayer, Graphic, FeatureLayer, ArcGISTiledMapServiceLayer) {
    var initExtent = new esri.geometry.Extent({
        "xmin": 122.1102905273437, "ymin": 36.74652099609376,
        "xmax": 122.71179199218744, "ymax": 37.45513916015626,
        "spatialReference": {"wkid": 4326}
    });
    map = new Map("map", {
        showInfoWindowOnClick: true, showLabels: true,
        displayGraphicsOnPan: false, logo: false,
        extent: initExtent,
        maxZoom:18,//最大缩放等级
        minZoom: 10//最小缩放等级
        //center: [122.376, 37.096], // longitude, latitude
        //zoom: 12
    });

    var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer");
    var zonghaiLayer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/宗海4326/MapServer");
    //var layer = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer");
    var layer = new ArcGISTiledMapServiceLayer("http://localhost:6080/arcgis/rest/services/RongJwd/MapServer");
    var shandongIm = new ArcGISTiledMapServiceLayer("http://www.qdxhaxqyqgd.com:6080/arcgis/rest/services/地图服务/全省卫图/MapServer");
    var shandongLayer = new ArcGISTiledMapServiceLayer("http://www.qdxhaxqyqgd.com:6080/arcgis/rest/services/地图服务/全省电子地图/MapServer");
    var graphicsLayer = new GraphicsLayer();
    map.addLayer(layer);

    map.addLayer(shandongIm);
    map.addLayer(dynamicMapServiceLayer);
    map.addLayer(zonghaiLayer);

    //对checkbox数组进行变量把选中的id添加到visible
    $("input[name='ckb']:checkbox").click(function() {
        var visible = getLayersId();
        dynamicMapServiceLayer.setVisibleLayers(visible);
    });
    function getLayersId(){
        var visible = [];
        $("input[name='ckb']:checkbox").each(function() {
            if($(this).is(":checked")) {
                visible.push($(this).attr("value"));
            }
        });
        if(visible.length == 0){
            visible = [-1];
        }
        return visible;
    }


    map.on("click",mapClick);
    //获得点击的地图坐标(点坐标)，并创建空间查询参数对象
    function mapClick(e){
        //获得用户点击的地图坐标
        var point=e.mapPoint;
        //实例化查询参数
        query=new Query();
        query.geometry = point;
        query.outFields = ["*"];
        query.outSpatialReference = map.spatialReference;
        query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
        query.returnGeometry = true;
        //实例化查询对象
        //var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer/0");
        var queryTask1 = new QueryTask("http://localhost:6080/arcgis/rest/services/宗海4326/MapServer/0");
        //进行查询
        queryTask1.execute(query,showFindResult);
        //queryTask.execute(query,showFindResult)

    }
    function showFindResult(queryResult) {
        if (queryResult.features == 0) {
            //alert("没有该元素");
            map.graphics.clear();
            map.infoWindow.hide();
            return;
        }
        for (var i = 0; i < queryResult.features.length; i++) {
            //获得该图形的形状
            var feature = queryResult.features[i];
            var geometry = feature.geometry;
            //定义高亮图形的符号
            //1.定义面的边界线符号
            var outline= new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,new Color([255, 0, 0]), 1);
            //2.定义面符号
            var PolygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, outline,new Color([0, 255, 0, 1]));
            //创建客户端图形
            var infoTemplate = new InfoTemplate("属性", "项目名称: ${NAME}<br>用海总面积: ${NUM}");
            var attr = {
                "NAME": feature.attributes.XMMC,
                "NUM": feature.attributes.YHZMJ
            };
            var graphic = new Graphic(geometry, PolygonSymbol,attr,infoTemplate);
            //将客户端图形添加到map中
            addMap(graphic,geometry);
        }
    }
    function addMap(graphic,geometry){
        map.graphics.clear();
        map.graphics.add(graphic);
        map.infoWindow.show(geometry.getExtent().getCenter());
        map.infoWindow.setFeatures([graphic]);
        map.centerAndZoom(geometry.getExtent().getCenter(),15);
    }
    var zctypes = getLayersId();

    $("#search").click(function () {
        var queryType = $("#searchCon").val();
        var zctypes = getLayersId();

        loadRes(queryType,zctypes);

    });
    $("input").focus(function(){
        $(this).parent().children(".input_clear").show();
    });
    $("input").blur(function(){
        if($(this).val()=='')
        {
            $(this).parent().children(".input_clear").hide();
        }
    });
    $(".input_clear").click(function(){
        $(this).parent().find('input').val('');
        $(this).hide();
        $('#assetsTable').bootstrapTable('destroy');
    });

    /*//on(dom.byId("Btn"),"click",function(e){
     $("#search没有了").click(function(){
     //					layer.clear();
     //					map.infoWindow.hide();
     //					$(".checkMe,#mc").remove();
     //定义查询对象
     var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer/0");
     //定义查询参数对象
     var query = new Query();
     //查询条件，类似于sql语句的where子句
     var queryType = $("#searchCon").val();
     query.where = "XMC  like '%"+queryType+"%'";
     //返回的字段信息：*代表返回全部字段
     query.outFields = ["*"];
     //是否返回几何形状
     query.returnGeometry = true;
     //执行属性查询
     queryTask.execute(query, showQueryResult);
     });
     //属性查询完成之后，用showQueryResult来处理返回的结果*/
    function loadRes(queryType,zctypes){
        $('#assetsTable').bootstrapTable('destroy');
        var obj = {};
        $.ajax({
            type: "post",
            url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
            async: false,
            data: {zctype: zctypes},
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    if(data[i].fieldname ==  "项目名称"){
                        obj.field = data[i].field;
                        obj.title = data[i].fieldname;
                    }
                }
                $('#assetsTable').bootstrapTable({
                    url:'/rczcgl/assetsconfig/getAssetsInfoByName.action',
                    method:'post',
                    clickToSelect:true,
                    sidePagination:"client",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    pagination:true,
                    pageNumber:1,
                    pageSize:5,
                    paginationPreText:"上一页",
                    paginationNextText:"下一页",
                    columns:[
                        {field:'zctype', title:'资产类型',
                            formatter:function(value,row,index){
                                if(value=='1'){
                                    return "土地资产";
                                }else if(value=='2'){
                                    return "房屋资产";
                                }else if(value='3'){
                                    return "海域资产";
                                }
                            }
                        }, obj
                    ],
                    queryParams:function(params){
                        params.name = queryType;
                        params.zctypes = zctypes;
                        return JSON.stringify(params);
                    },
                    onLoadSuccess:function(){
                    },
                    onLoadError:function(){
                    },
                    onClickCell: function (field, value, row, $element) {
                    },
                    onDblClickRow:function(row, $element, field) {
                        poiArea(row.layerid);
                    }
                });
            },
            error: function () {
            }
        });

    }
    function poiArea(financed){
        //定义查询对象
        var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/宗海4326/MapServer/0");
        //定义查询参数对象
        var query = new Query();
        //查询条件，类似于sql语句的where子句
        //var queryType = $("#searchCon").val();
        query.where = "ZHDM_1  like '%"+financed+"%'";
        //返回的字段信息：*代表返回全部字段
        query.outFields = ["*"];
        //是否返回几何形状
        query.returnGeometry = true;
        //执行属性查询
        queryTask.execute(query, showQueryResult);
    }
    function showQueryResult(queryResult) {
        //创建线符号
        var lineSymbol=new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
        //创建面符号
        var fill=new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
        if (queryResult.features.length == 0) {
            dom.byId("divShowResult").innerHTML = "暂无查询结果";
            return;
        }
        if (queryResult.features.length >= 1) {
            //for (var i = 0; i < queryResult.features.length; i++) {
                var P =  queryResult.features[0].attributes;
                //获得图形graphic
                var geometry = queryResult.features[0].geometry;
            var infoTemplate = new InfoTemplate("属性", "项目名称: ${NAME}<br>用海总面积: ${NUM}");
            var attr = {
                "NAME": P.XMMC,
                "NUM": P.YHZMJ
            };
                var graphic = new Graphic(geometry,fill,attr,infoTemplate);
                //赋予相应的符号
                //graphic.setSymbol(fill);
            addMap(graphic,geometry);
                /*//将graphic添加到地图中，从而实现高亮效果
                map.graphics.clear();
                map.graphics.add(graphic);
                //map.centerAndZoom(geometry.getExtent().getCenter(),15);
            map.setExtent(geometry.getExtent().expand(3));
            //}*/
        }
    }
});

