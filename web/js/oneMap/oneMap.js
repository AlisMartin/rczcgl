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
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"], function (Map, ArcGISDynamicMapServiceLayer, dom, on, Point, QueryTask, SpatialReference, Query, InfoTemplate,
                                 SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, GraphicsLayer, Graphic, FeatureLayer) {
    map = new Map("map", {
        basemap: "osm",  //topo-vector   For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
        center: [122.376, 37.096], // longitude, latitude
        zoom: 12
    });
    var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/TEST4326/MapServer", {
    });
    map.addLayer(dynamicMapServiceLayer);

    //对checkbox数组进行变量把选中的id添加到visible
    $("input[name='ckb']:checkbox").click(function() {
        var visible = getLayersId();
        dynamicMapServiceLayer.setVisibleLayers(visible);
    });
    function getLayersId(){
        var visible = [-1];
        $("input[name='ckb']:checkbox").each(function() {
            if($(this).is(":checked"))
            {
                visible.push($(this).attr("value"));
            }
        });
        return visible;
    }


    var zctypes = [1,2];

    $("#search").click(function () {
        var queryType = $("#searchCon").val();
        var zctypes = [1,2];
        $.ajax({
            async:false,
            type: "post",
            url: "/rczcgl/assetsconfig/getAssetsInfoByName.action",
            data: JSON.stringify({"name": queryType, "zctypes": zctypes}),
            contentType: "application/json;charset=UTF-8",
            datatype: "json",
            success: function (res) {
                $("#assetsTable").bootstrapTable('load', res.data);
            },
            error: function (res) {
                alert("系统错误，请稍后重试！");
            }
        })

    });
    /*//on(dom.byId("Btn"),"click",function(e){
     $("#search").click(function(){
     //					layer.clear();
     //					map.infoWindow.hide();
     //					$(".checkMe,#mc").remove();
     //定义查询对象
     var queryTask = new QueryTask("http://localhost:6080/arcgis/rest/services/TEST/MapServer/0");
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
     /!*var point = new Point(P.Display_X, P.Display_Y, new SpatialReference({
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
     layer.add(graphic);*!/
     }
     htmls = htmls + "</table>";
     //将属性绑定在divShowResult上面
     dom.byId("divShowResult").innerHTML = htmls;
     }
     }*/
});

setTimeout(function(){
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
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
            {checkbox:true},
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
            {field:'field1', title:'资产名称'}
            //{field:"fieldname", title:'资产信息项'}
        ],
        queryParams:function(params){
            //return param;
            /*var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                //limit: params.limit, //页面大小
                //offset: params.offset, //页码
                //offset123: params, //页码
                name: '公',
                zctypes: [1,2]
            };*/
            return JSON.stringify({
                //limit: params.limit,
                //offset: params.offset,
                "name": '公',
                "zctypes": [1,2]});
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
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
}, 5000);