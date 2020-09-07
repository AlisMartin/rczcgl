var atype="3";
var field=[
"totalPopulation","ethnicPopulation","minorityInTotal","gdp","primaryIndustry","secondIndustry","thirdIndustry","growthRate","gdpPer","localrevenue","localexpenditure","farmerPerIncome","numberEnterprises","totalIndustrialValue","totalAgriculturalValue","totalPowerAgricultural","totalGrain","totalMeat","socialInvestment"
];
$(function(){
    debugger;
    $("#dataMenu").click(function(){
        $("#InfoList").attr("src","mapInfo.html")
    });
    $("#dataImport").click(function(){
        $("#InfoList").attr("src","dataImport.html")
    });
    $("#dataManager").click(function(){
        $("#InfoList").attr("src","dataManager.html")
    });
    $("#userManager").click(function(){
        $("#InfoList").attr("src","userGl.html")
    });
    $("#logManager").click(function(){
        $("#InfoList").attr("src","logInfo.html")
    });
    $("#pwdManager").click(function(){
        $("#InfoList").attr("src","pwdChange.html")
    });

/*    $("#zrk").click(function(){
        ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
        ifrapage.window.createLegend();
    });
    $("#ncrk").click(function(){
        ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
        ifrapage.window.createLegend();
    });*/
    $(".nav-link.map").click(function(){
        debugger;
        var thisdiv=$(this);
        if(thisdiv.hasClass('zrk')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }else if(thisdiv.hasClass('ncrk')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('faopkrkbl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('faorkmd')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('adbpkrkbl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('fyb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('rkzz')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('rkmd')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('014rkzb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('1564rkzb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('65rkzb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('nxrkzb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('dlfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('hlwyhs')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('szl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('ycfswl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('xsrswl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('yqsm')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('jhhbl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('azbgrl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('zfylfwbl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('rjylwszc')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('ylwszzczb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('mghmzfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('ynmzfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('jpzmzfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('lomzfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('tgmzfb')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('gdpzzl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('rjsysyl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/foursecond/MapServer");
            ifrapage.window.createLegend();
        }
        else if(thisdiv.hasClass('yjhdl')){
            $("#InfoList").attr("src","mapInfo.html");
            ifrapage.window.switchMap("http://localhost:6080/arcgis/rest/services/yd/fourpople/MapServer");
            ifrapage.window.createLegend();
        }



    })
})