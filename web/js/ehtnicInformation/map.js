dojo.require("dijit.dijit");
dojo.require("dijit.Dialog");
dojo.require("esri.dijit.Popup");
dojo.require("dojo.dom");
dojo.require("dojo.dom-construct");
dojo.require("dojo.domReady!");
dojo.require("esri.map");
//点击查询控件
dojo.require("esri.tasks.identify");
dojo.require("esri.IdentityManager");
dojo.require("dojox.xml.DomParser");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("dojo.fx.easing");
dojo.require("esri.dijit.Legend");
//渲染
dojo.require("esri.InfoTemplate");
dojo.require("esri.renderers.UniqueValueRenderer");
dojo.require("esri.renderers.SimpleRenderer");
dojo.require("esri.dijit.ColorInfoSlider");

var  mapSpatialReference,map,identifyTask,identifyParams,popup;
var legendDijit;
//读取地图配置文件
function init() {
	esri.config.defaults.io.alwaysUseProxy = false;
	initMap();
}

//初始化地图
function initMap(){

	/*var popup = new esri.dijit.Popup({
		fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]))
	}, dojo.domConstruct.create("pop"));*/

	mapSpatialReference = new esri.SpatialReference({wkid:4326});
	map = new esri.Map("map",{infoWindow:popup,slider:true,logo:false,sliderStyle: "small"});//slider:图层切几级，会显示几级
	map.spatialReference = mapSpatialReference;
	map.setExtent( new esri.geometry.Extent({
		"xmin":71.44127699963389,"ymin":16.117702999693734,"xmax":137.09725700021045,"ymax":55.56177099973189,
		"spatialReference":mapSpatialReference
	}));
	
    layer =  new esri.layers.ArcGISDynamicMapServiceLayer("http://192.168.0.12:6080/arcgis/rest/services/yd/xzq/MapServer");
    map.addLayers([layer]);

	graphicLayer = new esri.layers.GraphicsLayer();
	map.addLayer(graphicLayer);
	//map.on("load",mapReady);
	dojo.connect(map,"onClick",doIdentifys);
}
//点击查询
function doIdentifys(event){
	debugger;
	currentActionFlag = true;
	map.graphics.clear();
	//var url = mapConfig.maps.map.layers.layer.children.layer.url;
//	$.each(mapConfig.maps.map.layers.layer.children.layer,function(i,v){
//		if(v.key == "china")
//			url = v.url;
//	});
	var identifyTask = new esri.tasks.IdentifyTask("http://192.168.0.12:6080/arcgis/rest/services/yd/fourpople/MapServer");//查询图层的添加
	var identifyParams = new esri.tasks.IdentifyParameters();
	identifyParams.tolerance = 5;//缓冲区的宽度
	identifyParams.returnGeometry = true;
	identifyParams.layerIds = [3];
	identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
	identifyParams.width  = map.width;
	identifyParams.height = map.height;
	identifyParams.geometry = event.mapPoint;
	identifyParams.mapExtent = map.extent;
	identifyTask.execute(identifyParams,function(idResults){handler_click_querys(idResults, event);});//查询结果的显示事件

	map.graphics.clear();//清除地图上所有的graphics
	//map.setMapCursor("url(images/img/HandPoint.cur),auto");// 点击查询之后设置鼠标状态，显示手
}

function handler_click_querys(featureSet, event){
	debugger;
	if(featureSet.length == 0){
		return;
	}
	//var outFields= ["行政区名称","1991","1992"];

	//var columns = ["NL_NAME_1","Year1991","Year1992"];

	$.each(featureSet,function(i,v){
		var outFields=[];
		var columns=[];
		var data=[];
				var countycode = featureSet[0].feature.attributes["NL_NAME_1"];
				var objInfo=featureSet[i].feature.attributes;
				for(var key in objInfo){
					columns.push(key);
					outFields.push(key);
					data.push(objInfo[key]);
				}
				var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25]));
				var graphic = new esri.Graphic(featureSet[0].feature.geometry, symbol);
				map.graphics.add(graphic);
				var divs = $('<div class="maintable"></div>');
				var html = "";

					html = '<div class="table_css"><table><tr class="table_title"><td style="width:114px;">属性字段</td><td style="width:115px;">属性值</td></tr>';
					var k = 0;
					$.each(columns, function(i, v){
						if( data[i])
							html += '<tr class="' + (k%2 === 0 ? 'tdColor' : 'evenColor') + '"><td>' +outFields[i]+ '</td><td>' + data[i] + '</td></tr>';
					});
					/*html += '</table><a href="javascript:void(0)" onclick="showAllInfos('+countycode+')">详细信息</a></div>';*/

				divs.append(html);
				map.infoWindow.resize(255, 185);
				map.infoWindow.setTitle("属性信息显示");
				map.infoWindow.setContent(html);
				map.infoWindow.resize(280, 175);
				map.infoWindow.show(event.screenPoint, map.getInfoWindowAnchor(event.screenPoint));
	});

}
function switchMap(url){
	map.removeLayer(layer)
	layer =  new esri.layers.ArcGISDynamicMapServiceLayer(url);
	map.addLayer(layer);

}
//创建图例
function createLegend() {
	debugger;
	if (legendDijit) {
	/*	legendDijit=new esri.dijit.Legend({
			map: map,
			//layerInfos: layerInfo
		}, "legendDiv");*/
		legendDijit.refresh();
	} else {
		legendDijit = new esri.dijit.Legend({
			map: map,
			//layerInfos: layerInfo
		}, "legendDiv");
		legendDijit.startup();
	}
}
/*function mapReady () {
	map.on("click", executeIdentifyTask);
	//create identify tasks and setup parameters
	identifyTask = new esri.tasks.IdentifyTask("http://192.168.0.12:6080/arcgis/rest/services/yd/fourenconmy/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=html");

	identifyParams = new esri.tasks.IdentifyParameters();
	//identifyParams.tolerance = 3;
/!*	identifyParams.returnGeometry = true;
	identifyParams.layerIds = [0, 2];
	identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
	identifyParams.width = map.width;
	identifyParams.height = map.height;*!/
}*/

/*function executeIdentifyTask (event) {
	identifyParams.geometry = event.mapPoint;
	identifyParams.mapExtent = map.extent;

	var deferred = identifyTask
		.execute(identifyParams)
		.addCallback(function (response) {
			// response is an array of identify result objects
			// Let's return an array of features.
			return arrayUtils.map(response, function (result) {
				var feature = result.feature;
				var layerName = result.layerName;

				feature.attributes.layerName = layerName;
				var taxParcelTemplate = new InfoTemplate("",
						"区划名称: ${NAME_1}");
					feature.setInfoTemplate(taxParcelTemplate);

		/!*		else if (layerName === 'Building Footprints') {
					console.log(feature.attributes.PARCELID);
					var buildingFootprintTemplate = new InfoTemplate("",
						"Parcel ID: ${PARCELID}");
					feature.setInfoTemplate(buildingFootprintTemplate);
				}*!/
				return feature;
			});
		});
	map.infoWindow.setFeatures([deferred]);
	map.infoWindow.show(event.mapPoint);
}*/
dojo.ready(init);