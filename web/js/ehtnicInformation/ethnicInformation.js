var jsondata=null;
var treedata=[{
    text:"民族分布（与各国为地图）",
    id:"mz",
    nodes:[
        {
            text:"大湄公河次区域民族分布",
            id:"mghmz"
        },
        {
            text:"云南、广西民族分布",
            id:"yn"
        }
        ,
        {
            text:"缅甸的民族分布",
            id:"md"
        }
        ,
        {
            text:"越南的民族分布",
            id:"num5"
        }
        ,
        {
            text:"柬埔寨的民族分布",
            id:"num6"
        }
        ,
        {
            text:"老挝的民族分布",
            id:"num7"
        }
        ,
        {
            text:"泰国的民族分布",
            id:"num8"
        }
    ]
}];
var peopledata=[{
    text:"人口（均以湄公河区域为底图）",
    id:"rk1",
    nodes:[
        {
            text:"总人口（FAO）",
            id:"zrk"
        },
        {
            text:"农村人口(FAO)",
            id:"num3"
        }
        ,
        {
            text:"FAO贫困人口比例",
            id:"num4"
        }
        ,
        {
            text:"FAO人口密度（2000年）",
            id:"num5"
        }
        ,
        {
            text:"2011-2014ADB贫困人口比例",
            id:"num6"
        }
        ,
        {
            text:"1990-2015抚养比",
            id:"num7"
        }
        ,
        {
            text:"1990-2015人口增长",
            id:"num8"
        }
        ,
        {
            text:"1990-2015人口密度",
            id:"num8"
        }
        ,
        {
            text:"1990-2015 0-14岁人口占比",
            id:"num8"
        }
        ,
        {
            text:"1990-2015 15-64岁人口占比",
            id:"num8"
        }
        ,
        {
            text:"1990-2015 65岁以上人口占比",
            id:"num8"
        }
        ,
        {
            text:"1990-2015 女性占人口百分比",
            id:"num8"
        }

    ]
}];
var jcssdata=[{
    text:"基础设施（均以湄公河区域为底图）",
    id:"num1",
    nodes:[
        {
            text:"一级道路与二级道路分布",
            id:"num2"
        },
        {
            text:"1990-2015年互联网用户数量",
            id:"num3"
        }

    ]
}];
var jyyldata=[{
    text:"教育、医疗（均以湄公河区域为底图）",
    id:"num1",
    nodes:[
        {
            text:"2000年识字率",
            id:"num2"
        },
        {
            text:"1990-2015年孕产妇死亡率",
            id:"num3"
        }
        ,
        {
            text:"1990-2015年新生儿死亡率",
            id:"num4"
        }
        ,
        {
            text:"1990-2014年出生时的预期寿命",
            id:"num5"
        }
        ,
        {
            text:"2000-2015年结核患病率",
            id:"num6"
        }
        ,
        {
            text:"1990-2015年青少年艾滋感染率",
            id:"num7"
        }
        ,
        {
            text:"1990-2014年个人自付的医疗费用占比",
            id:"num8"
        }
        ,
        {
            text:"1990-2014年人均医疗卫生支出（美元）",
            id:"num8"
        }
        ,
        {
            text:"1990-2014年医疗卫生总支出占GDP百分比",
            id:"num8"
        }

    ]
}];
var jjdata=[{
    text:"经济（均以湄公河区域为底图）",
    id:"num1",
    nodes:[
        {
            text:"1990-2015年GDP增长率",
            id:"num2"
        },
        {
            text:"2000年人均石油使用量",
            id:"num3"
        }
        ,
        {
            text:"1990-2014年人均耗电量",
            id:"num4"
        }
    ]
}];

var whdata=[{
    text:"文化",
    id:"num1",
    nodes:[
        {
            text:"数字博物馆",
            id:"num2"
        },
        {
            text:"影像数据库",
            id:"num3"
        }
    ]
}];

$(function(){
    debugger;
    //上传
    $("#btnup").click(function(){
        $("#upfile").click();
    });
    $("#upfile").change(function(){
        alert("上传成功！");
    });
    //下载
    $("a").click(function(){
        alert("下载成功！");
    })
    //页面跳转
    //页面跳转
    $(".pageItem.sjml").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.sjml").addClass("active");
        $("#contentiframe").attr("src","dataMl.html");
    });
    //页面跳转
    $(".pageItem.sjdr").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.sjdr").addClass("active");
        $("#contentiframe").attr("src","dataImport.html");
    });
    //页面跳转
    $(".pageItem.sjgl").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.sjgl").addClass("active");
        $("#contentiframe").attr("src","dataManager.html");
    });
    //页面跳转
    $(".pageItem.zttzz").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.zttzz").addClass("active");
    });
    //页面跳转
    $(".pageItem.zdygs").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.zdygs").addClass("active");
    });
    //页面跳转
    $(".pageItem.tjfx").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.tjfx").addClass("active");
    });
    //页面跳转
    $(".pageItem.xtgl").click(function(){
        $(".pageItem").removeClass("active");
        $(".pageItem.xtgl").addClass("active");
        $("#contentiframe").attr("src","sysManager.html");
    })

    //页面跳转
    $(".page.user").click(function(){
        $(".par").removeClass("active");
        $(".par.user").addClass("active");
        $("#sysiframe").attr("src","userGl.html");
    });
    //页面跳转
    $(".page.pwd").click(function(){
        $(".par").removeClass("active");
        $(".par.pwd").addClass("active");
        $("#sysiframe").attr("src","pwdChange.html");
    })
    //页面跳转
    $(".page.log").click(function(){
        $(".par").removeClass("active");
        $(".par.log").addClass("active");
        $("#sysiframe").attr("src","logInfo.html");
    })

    $('#tree').treeview({
        data:treedata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){
            debugger;
            var page=data.id;
            if(page=="mghmz"){
                $("#InfoList").attr("src","mzfb.html");
                jsondata="zzq";
                switchMap(1);
            };
            if(page=="yn"){
                jsondata="zzz";
                switchMap(2);
            }
            if(page=="md"){
                jsondata="zzx";
                switchMap(3);
            }
        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#tree').treeview('collapseAll',
        { silent: true });



    $('#rktree').treeview({
        data:peopledata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){
            var page=data.id;
            if(page=="zrk"){
                $("#InfoList").attr("src","peopelNum.html");
                switchMap(2);
            }
        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#rktree').treeview('collapseAll',
        { silent: true });


    $('#jcsstree').treeview({
        data:jcssdata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){

        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#jcsstree').treeview('collapseAll',
        { silent: true });



    $('#jyyltree').treeview({
        data:jyyldata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){
            debugger;
        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#jyyltree').treeview('collapseAll',
        { silent: true });


    $('#jjtree').treeview({
        data:jjdata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){
            debugger;
        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#jjtree').treeview('collapseAll',
        { silent: true });


    $('#whtree').treeview({
        data:whdata,
        showCheckbox:false,
        nodeIcon:'glyphicon glyphicon-globe',
        onNodeSelected: function(event,data){

        },
        error:function(){
            alert("树形结构加载失败！");
        }
    });
    $('#whtree').treeview('collapseAll',
        { silent: true });



})
