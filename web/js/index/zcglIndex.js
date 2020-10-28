var user= $.cookie('user');
var userobj=eval('('+user+')');
$(function(){
    debugger;
    var auth=userobj.auth;
    $("#loginUserName").text(userobj.userName);
    $("#loginRoleName").text(userobj.role);
    if(auth==null){
        alert("当前用户未设置权限，请使用管理员账号配置用户权限！");
    }
    getMessage();
    $("#oneMap").click(function(){
        $("#InfoList").attr("src","oneMap.html?random="+Math.floor(Math.random()*100000));
    });
    $("#logInfo").click(function(){
        $("#InfoList").attr("src","newLogInfo.html?random="+Math.floor(Math.random()*100000));
    });
    $("#fileManager").click(function(){
        $("#InfoList").attr("src","FileManager.html?random="+Math.floor(Math.random()*100000));
    });

    //资产汇总
    if(auth.indexOf("1")>-1||auth.indexOf("8")>-1){
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
    }else{
        $("#landSummary").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#houseSummary").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#seaSummary").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#otherSummary").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }


    if(auth.indexOf("2")>-1||auth.indexOf("8")>-1){
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
    }else{
        $("#landAssets").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#houseAssets").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#seaAssets").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#otherAssets").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }



    if(auth.indexOf("3")>-1||auth.indexOf("8")>-1){
        $("#userManager").click(function(){
            $("#InfoList").attr("src","newUserManager.html?random="+Math.floor(Math.random()*100000));
        });
        $("#roleManager").click(function(){
            $("#InfoList").attr("src","newRoleManager.html?random="+Math.floor(Math.random()*100000));
        });
        $("#auditManager").click(function(){
            $("#InfoList").attr("src","newAuthority.html?random="+Math.floor(Math.random()*100000));
        });
        $("#departManager").click(function(){
            $("#InfoList").attr("src","departManager.html?random="+Math.floor(Math.random()*100000));
        });
        $("#userAddRole").click(function(){
            $("#InfoList").attr("src","newUserAddRole.html?random="+Math.floor(Math.random()*100000));
        });
        $("#roleAddAuth").click(function(){
            $("#InfoList").attr("src","newRoleAddAudit.html?random="+Math.floor(Math.random()*100000));
        });
    }else{
        $("#userManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#roleManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#auditManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#departManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#userAddRole").click(function(){
            alert("当前用户无权限操作此模块！");
        });
        $("#roleAddAuth").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }

    if(auth.indexOf("4")>-1||auth.indexOf("8")>-1){
        $("#sysConfig").click(function(){
            $("#InfoList").attr("src","assetsConfig.html?random="+Math.floor(Math.random()*100000));
        });
    }else{
        $("#sysConfig").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }

    if(auth.indexOf("5")>-1||auth.indexOf("8")>-1){
        $("#nodeAddUser").click(function(){
            $("#InfoList").attr("src","nodeAddUser.html?random="+Math.floor(Math.random()*100000));
        });
    }else{
        $("#nodeAddUser").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }

    if(auth.indexOf("6")>-1||auth.indexOf("8")>-1){
        $("#FlowFileManager").click(function(){
            $("#InfoList").attr("src","newFileManager.html?random="+Math.floor(Math.random()*100000));
        });
    }else{
        $("#FlowFileManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });

    }

    if(auth.indexOf("7")>-1||auth.indexOf("8")>-1){
        $("#FileFlowStart").click(function(){
            $("#InfoList").attr("src","CreateFlow.html?random="+Math.floor(Math.random()*100000));
        });
    }else{
        $("#FileFlowStart").click(function(){
            alert("当前用户无权限操作此模块！");
        });

    }
    if(auth.indexOf("13")>-1||auth.indexOf("8")>-1) {
        $("#financeManager").click(function () {
            $("#InfoList").attr("src", "financeManager.html?random=" + Math.floor(Math.random() * 100000));
        });
    }else{
        $("#financeManager").click(function(){
            alert("当前用户无权限操作此模块！");
        });
    }



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