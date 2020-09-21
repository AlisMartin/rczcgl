/**
 * Created by lp on 2020/5/27.
 */
var positionarr=[];
$(function(){
    debugger;
/*    var user= $.cookie('user');
    var userobj=eval('('+user+')');
    var authArray=[];
    if(userobj.auth.indexOf(",")>0){
        var array=userobj.auth.split(",");
        for(var i=0;i<array.length;i++){
            authArray.push(array[i]);
        }
    }else{
        authArray.push(userobj.auth);
    }
    for(var i=0;i<authArray.length;i++){
        if(authArray[i]=="1"){
            $("#czbutton").css('display','block');
            break;
        }
    }*/
    initCompany();
   // initPosition();
   // initDepartMent();


    $("#company").change(function(){
        debugger;
        var comp=$("#company").val();
        $.ajax({
            type:"post",
            url:"/rczcgl/depart/getDepart.action",
            data:{"depart":"department","pnodeId":comp},
            success:function(response){
                $("#department").empty();
                var data=response.data;
                $("#department").append("<option value='请选择'>请选择</option>");
                for(var i=0;i<data.length;i++){
                    $("#department").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
                }
            },
            error:function(data){
            }
        })

    })

    $("#department").change(function(){
        var depart=$("#department").val();
        $.ajax({
            type:"post",
            url:"/rczcgl/depart/getDepart.action",
            data:{"depart":"position","pnodeId":depart},
            success:function(response){
                $("#position").empty();
                var data=response.data;
                $("#position").append("<option value='请选择'>请选择</option>");
                for(var i=0;i<data.length;i++){
                    $("#position").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
                }
            },
            error:function(data){
            }
        })

    })

    $("#saveUser").click(function(){
        addUser();
    })
    $("#editUser").click(function(){
        debugger;
        editUser();
    })
    $("#saveeditUser").click(function(){
        $.ajax({
            type:"post",
            url:"/rczcgl/user/editUser.action",
            data:{"userName": $("#userName1").val(),"tel":$("#tel1").val(),"email":$("#email1").val(),"type":$("#type1").val(),"password":$("#password1").val(),"id":$("#userid1").val()},
            success:function(data){
                if(data==1){
                    alert("修改成功！");
                    $("#userTable").bootstrapTable('refresh');
                    $("#editmodal").modal('hide');
                }else{
                    alert("修改失败！");
                    $("#editmodal").modal('hide');
                }
            },
            error:function(data){
                alert("系统错误，请稍后重试!");
                $("#editmodal").modal('hide');
            }
        })
    })
    $("#deleteUser").click(function(){
        deleteUser();
    })
    $("#scUser").click(function(){
        var row=$("#userTable").bootstrapTable('getSelections');
        var array="";
        for(var i=0;i<row.length;i++){
            array=array+row[i].id+",";
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/user/deleteUser.action",
            data:{"data":array},
            success:function(data){
                alert("删除成功！");
                $("#userTable").bootstrapTable('refresh');
                $("#deletemodal").modal('hide');
            },
            error:function(data){
                alert("系统错误，请稍后重试!");
                $("#deletemodal").modal('hide');
            }
        })

    })


    $('#userTable').bootstrapTable({
        url:'/rczcgl/user/selectAllUser.action',
        method:'post',
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:[
            {
                checkbox:true
            },
            {
                field:'id',
                title:'用户ID'
            },
            {
                field:'userName',
                title:'用户名'
            },
            {
                field:'tel',
                title:'电话'
            },
            {
                field:'email',
                title:'邮箱'
            },
            {
                field:'type',
                title:'用户类型',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "管理系统用户"
                    }else if(value=='2'){
                        return "OA系统用户"
                    }else{
                        return "";
                    }

                }
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("数据加载失败!");
        }
    })
})
function addUser(){
    debugger;
    var userName=$("#userName").val();
    var tel=$("#tel").val();
    var email=$("#email").val();
    //var type=$("#type").val();
    var password=$("#password").val();
    var company=$("#company option:selected").text();
    var department=$("#department option:selected").text();
    var position=$("#position").val();
    var positionname=$("#position option:selected").text();
    if(company==""||company=="请选择"||department==""||department=="请选择"||positionname=="请选择"||positionname==""){
        alert("必须选择所属公司、部门、职位!");
        return false;
    }
    var level;
    for(var i=0;i<positionarr.length;i++){
        if(position==positionarr[i].nodeId){
            level=parseInt(positionarr[i].level)+1;
        }
    }
    level=level+"";
    $.ajax({
        type:"post",
        url:"/rczcgl/user/addUser.action",
        data:{"userName":userName,"tel":tel,"email":email,"password":password,"company":company,"department":department,"position":position,"positionname":positionname,"level":level},
        success:function(data){
            if(data==1){
                alert("添加成功！");
                $("#userTable").bootstrapTable('refresh');
                $("#addUser").modal('hide');
            }else{
                alert("添加失败！");
                $("#addUser").modal('hide');
            }
        },
        error:function(data){
            alert("系统错误，请稍后重试!");
            $("#addUser").modal('hide');
        }
    })
}
function editUser(){
    debugger;
    var row=$("#userTable").bootstrapTable('getSelections');
    if(row.length>1){
        alert("最多只能选择一个！");
        return false;
    }
    if(row.length<=0){
        alert("请先选择需要修改的用户！");
        return false;
    }
    $("#userName1").val(row[0].userName);
    $("#tel1").val(row[0].tel);
    $("#email1").val(row[0].email);
    $("#type1").val(row[0].type);
    $("#password1").val(row[0].password);
    $("#userid1").val(row[0].id);
    $("#editmodal").modal('show');


}
function deleteUser(){
    var row=$("#userTable").bootstrapTable('getSelections');
    if(row.length<=0){
        alert("请先选择需要删除的用户！");
        return false;
    }
    $("#deletemodal").modal('show');


}

function initCompany(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getDepart.action",
        data:{"depart":"company"},
        success:function(response){
            var data=response.data;
            $("#company").append("<option value='请选择'>请选择</option>");
            for(var i=0;i<data.length;i++){
                $("#company").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
            }
        },
        error:function(data){
        }
    })
}

function initDepartMent(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getDepart.action",
        data:{"depart":"department"},
        success:function(response){
            var data=response.data;
            for(var i=0;i<data.length;i++){
                $("#department").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
            }
        },
        error:function(data){
        }
    })
}

function initPosition(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getDepart.action",
        data:{"depart":"position"},
        success:function(response){
            positionarr=[];
            var data=response.data;
            positionarr=data;
            for(var i=0;i<data.length;i++){
                $("#position").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
            }
        },
        error:function(data){
        }
    })
}
