/**
 * Created by lp on 2020/5/26.
 */
$(function(){
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            login();
        }
    }
})

function login(){
    debugger;
    var name=$("#username").val();
    var pwd=md5($("#userpassword").val());
    //var pwd=$("#userpassword").val();
    if(name==null||name==""){
        alert("请输入用户名!");
        return false;
    }
    if(pwd==null||pwd==""){
        alert("请输入密码!");
        return false;
    }
   $.ajax({
        type:"post",
        url:"login/userLogin.action",
        data:{"username":name,"password":pwd},
        success: function (data) {
            debugger;

            if(data!=null&&data!=""){
                if(data.state=="543554323"){
                    window.location.href="/rczcgl/overdate.html";
                }else{
                    $.cookie("user",JSON.stringify(data));
                    window.location.href="/rczcgl/rczcgl.html";
                }

            }else{
                alert("用户名或密码错误，请重新输入!");
                return false;
            }
        }
    })
  /*  $.ajax({
        type:"post",
        url:"http://localhost:8080/login",
        data:{"name":name,"password":pwd},
        async:false,
        success: function (data) {
            if (data != null && data != "") {
                $.cookie("Authorization",data.token);
                getqq();
            }
        }
    })*/
}

function clears(){
    $("#username").val("");
    $("#userpassword").val("");
}

function getqq(){
    var a= $.cookie("Authorization");
    $.ajax({
        type:"post",
        headers:{
            'Authorization':a
        },
        url:"http://localhost:8080/index",
        success: function (data) {
        alert("成功")
        }
    })
}