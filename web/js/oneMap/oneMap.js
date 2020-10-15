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
        maxZoom:10,//最大缩放等级
        minZoom: 1//最小缩放等级
        //center: [122.376, 37.096], // longitude, latitude
        //zoom: 12
    });

    var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer");
    //var layer = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer");
    var layer = new ArcGISTiledMapServiceLayer("http://localhost:6080/arcgis/rest/services/RongJwd/MapServer");
    var shandongIm = new ArcGISTiledMapServiceLayer("http://www.qdxhaxqyqgd.com:6080/arcgis/rest/services/地图服务/全省卫图/MapServer");
    var shandongLayer = new ArcGISTiledMapServiceLayer("http://www.qdxhaxqyqgd.com:6080/arcgis/rest/services/地图服务/全省电子地图/MapServer");
    var graphicsLayer = new GraphicsLayer();
    map.addLayer(layer);

    map.addLayer(shandongLayer);
    map.addLayer(dynamicMapServiceLayer);

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
        var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer/0");
        //进行查询
        queryTask.execute(query,showFindResult)

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
            var infoTemplate = new InfoTemplate("属性", "资产名称: ${NAME}<br>资产金额: ${NUM}");
            var attr = {
                "NAME": feature.attributes.XMC,
                "NUM": feature.attributes.TBMJ
            };
            var graphic = new Graphic(geometry, PolygonSymbol,attr,infoTemplate);
            //将客户端图形添加到map中
            map.graphics.clear();
            map.graphics.add(graphic);
            map.infoWindow.show(geometry.getExtent().getCenter());
            map.infoWindow.setFeatures([graphic]);
            map.centerAndZoom(geometry.getExtent().getCenter(),15);
            //graphicsLayer.add(graphic);
        }
    }

    var zctypes = getLayersId();

    $("#search").click(function () {
        var queryType = $("#searchCon").val();
        var zctypes = getLayersId();
        /*$.ajax({
            async:false,
            type: "post",
            url: "/rczcgl/assetsconfig/getAssetsInfoByName.action",
            data: JSON.stringify({"name": queryType, "zctypes": zctypes}),
            contentType: "application/json;charset=UTF-8",
            datatype: "json",
            success: function (res) {
                //$("#assetsTable").bootstrapTable('load', res.data);
                loadRes(queryType,zctypes);
            },
            error: function (res) {
                alert("系统错误，请稍后重试！");
            }
        })*/
        loadRes(queryType,zctypes);

    });

    //on(dom.byId("Btn"),"click",function(e){
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
     //属性查询完成之后，用showQueryResult来处理返回的结果
     function showQueryResult(queryResult) {
     //创建线符号
     var lineSymbol=new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
     //创建面符号
     var fill=new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol);
     if (queryResult.features.length == 0) {
     dom.byId("divShowResult").innerHTML = "暂无查询结果";
     return;
     }
     var htmls = "";
     if (queryResult.features.length >= 1) {
     htmls = htmls + "<table style=\"width: 100%\">";
     htmls = htmls + "<tr><td id='mc'>名称</td></tr>";
     for (var i = 0; i < queryResult.features.length; i++) {
     var P =  queryResult.features[i].attributes;
     //获得图形graphic
     var graphic = queryResult.features[i].geometry;
     //赋予相应的符号
     graphic.setSymbol(fill);
     //将graphic添加到地图中，从而实现高亮效果
     map.graphics.add(graphic);
     //获得教学楼名称（此处是和shp属性表对应的）
     var ptName = graphic.attributes["Name"];
     if (i % 2 == 0)
     htmls = htmls + "<tr>";
     else
     htmls = htmls + "<tr bgcolor=\"#F0F0F0\">";
     htmls = htmls + "<td class='checkMe'><a href=\"#\" \">" + P.XMC + "</a></td>";
     htmls = htmls + "</tr>";
     /*var point = new Point(P.Display_X, P.Display_Y, new SpatialReference({
     wkid: 4326
     }));
     var simpleMarkerSymbol = new SimpleMarkerSymbol({
     "color": [0, 0, 255],
     "size": 3,
     "angle": -30,
     "xoffset": 0,
     "yoffset": 0,
     "type": "esriSMS",
     "style": "esriSMSCircle",
     "outline": {
     "color": [0, 0, 255],
     "width": 5,
     "type": "esriSLS",
     "style": "esriSLSSolid"
     }
     });
     var attr = P;
     var graphic = new Graphic(point, simpleMarkerSymbol, attr);
     layer.add(graphic);*/
     }
     htmls = htmls + "</table>";
     //将属性绑定在divShowResult上面
     dom.byId("divShowResult").innerHTML = htmls;
     }
     }
});

function loadRes(queryType,zctypes){
    $('#assetsTable').bootstrapTable('destroy');
    $('#assetsTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getAssetsInfoByName.action',
        method:'post',
        clickToSelect:true,
        sidePagination:"client",
        contentType: "application/json;charset=UTF-8",
        //contentType: "application/json",

        dataType: "json",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
            //{checkbox:true},
            {field:'id', title:'ID'},
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
            },
            {field:'field2', title:'资产名称'}
            //{field:"fieldname", title:'资产信息项'}
        ],
        queryParams:function(params){
            /*return JSON.stringify({
                //limit: params.limit,
                //offset: params.offset,
                "name": queryType,
                "zctypes": zctypes});*/
            params.name = queryType;
            params.zctypes = zctypes;
            return JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        },
        onClickCell: function (field, value, row, $element) {
            //todo
            //点击获取图形，定位
        }
    });
/*//得到查询的参数
    queryParams = function (params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit, //页面大小
            offset: params.offset, //页码
            startdate: $("#startdate").val(),
            enddate: $("#enddate").val()
        };
        return temp;
    };*/
};