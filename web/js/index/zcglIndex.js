$(function(){
    debugger;
    getMessage();
    $("#oneMap").click(function(){
        $("#InfoList").attr("src","oneMap.html?random="+Math.floor(Math.random()*100000));
    });
    $("#financeManager").click(function(){
        $("#InfoList").attr("src","financeManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#userManager").click(function(){
        $("#InfoList").attr("src","newUserManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#roleManager").click(function(){
        $("#InfoList").attr("src","newRoleManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#auditManager").click(function(){
        $("#InfoList").attr("src","newAuthority.html?random="+Math.floor(Math.random()*100000));
    });
    $("#logInfo").click(function(){
        $("#InfoList").attr("src","newLogInfo.html?random="+Math.floor(Math.random()*100000));
    });
    $("#userAddRole").click(function(){
        $("#InfoList").attr("src","newUserAddRole.html?random="+Math.floor(Math.random()*100000));
    });
    $("#roleAddAuth").click(function(){
        $("#InfoList").attr("src","newRoleAddAudit.html?random="+Math.floor(Math.random()*100000));
    });
    $("#sysConfig").click(function(){
        $("#InfoList").attr("src","assetsConfig.html?random="+Math.floor(Math.random()*100000));
    });
    $("#fileManager").click(function(){
        $("#InfoList").attr("src","FileManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#departManager").click(function(){
        $("#InfoList").attr("src","departManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#landAssets").click(function(){
        $("#InfoList").attr("src","imasset.html?zctype=1&&random="+Math.floor(Math.random()*100000));
    });
    $("#houseAssets").click(function(){
        $("#InfoList").attr("src","imasset.html?zctype=2&&random="+Math.floor(Math.random()*100000));
    });
    $("#seaAssets").click(function(){
        $("#InfoList").attr("src","imasset.html?zctype=3&&random="+Math.floor(Math.random()*100000));
    });
    $("#otherAssets").click(function(){
        $("#InfoList").attr("src","imasset.html?zctype=4&&random="+Math.floor(Math.random()*100000));
    });

    $("#landSummary").click(function(){
        $("#InfoList").attr("src","assetsSummary.html?zctype=1&&random="+Math.floor(Math.random()*100000));
    });
    $("#houseSummary").click(function(){
        $("#InfoList").attr("src","assetsSummary.html?zctype=2&&random="+Math.floor(Math.random()*100000));
    });
    $("#seaSummary").click(function(){
        $("#InfoList").attr("src","assetsSummary.html?zctype=3&&random="+Math.floor(Math.random()*100000));
    });
    $("#otherSummary").click(function(){
        $("#InfoList").attr("src","assetsSummary.html?zctype=4&&random="+Math.floor(Math.random()*100000));
    });


    $("#nodeAddUser").click(function(){
        $("#InfoList").attr("src","nodeAddUser.html?random="+Math.floor(Math.random()*100000));
    });
    $("#FlowFileManager").click(function(){
        $("#InfoList").attr("src","newFileManager.html?random="+Math.floor(Math.random()*100000));
    });
    $("#FileFlowStart").click(function(){
        $("#InfoList").attr("src","CreateFlow.html?random="+Math.floor(Math.random()*100000));
    });

    $("#FileFlowWork").click(function(){
        $("#InfoList").attr("src","FileFlowWork.html?random="+Math.floor(Math.random()*100000));
    });
    $("#dataStatistic").click(function(){
        $("#InfoList").attr("src","dataStatistic.html?random="+Math.floor(Math.random()*100000));
    });

    $("#navbarDropdownMenuLink1").click(function(){
        $("#InfoList").attr("src","SysMessage.html?random="+Math.floor(Math.random()*100000));
    });



})
//5分钟查询一次消息
function getMessage(){
    debugger;
    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    setTimeout(getMessage,1000*60*5);
    var param={};
    param.show='1';
    param.jsuser=userobj.id;
    $.ajax({
        type:"post",
        url:"/rczcgl/flow/queryMessage.action",
        data:JSON.stringify(param),
        contentType: "application/json;charset=UTF-8",
        success:function(responsedata){
            var obj=responsedata;
            if(obj.length>0){
                $(".imsg-bubble").css('display','block');
                $(".imsg-bubble").empty();
                $(".imsg-bubble").text(obj.length+"");
            }else{
                $(".imsg-bubble").css('display','none');
                $(".imsg-bubble").empty();
                $(".imsg-bubble").text(0);
            }



        },
        error:function(){
            alert("添加失败！请稍后重试！");
        }
    })
}