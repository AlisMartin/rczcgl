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
    $("#closeSave").click(function(){
        $("#addform")[0].reset();
    })

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

    $("#ecompany").change(function(){
        debugger;
        var comp=$("#ecompany").val();
        $.ajax({
            type:"post",
            url:"/rczcgl/depart/getDepart.action",
            data:{"depart":"department","pnodeId":comp},
            success:function(response){
                $("#edepartment").empty();
                var data=response.data;
                $("#edepartment").append("<option value='请选择'>请选择</option>");
                for(var i=0;i<data.length;i++){
                    $("#edepartment").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
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

    $("#edepartment").change(function(){
        var depart=$("#edepartment").val();
        $.ajax({
            type:"post",
            url:"/rczcgl/depart/getDepart.action",
            data:{"depart":"position","pnodeId":depart},
            success:function(response){
                $("#eposition").empty();
                var data=response.data;
                $("#eposition").append("<option value='请选择'>请选择</option>");
                for(var i=0;i<data.length;i++){
                    $("#eposition").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
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
        var userName=$("#euserName").val();
        var tel=$("#etel").val();
        var email=$("#eemail").val();
        //var type=$("#type").val();
        var password=$("#epassword").val();
        var company=$("#ecompany option:selected").text();
        var comId=$("#ecompany option:selected").val();
        var department=$("#edepartment option:selected").text();
        var departId=$("#edepartment option:selected").val();
        var posId=$("#eposition").val();
        var positionname=$("#eposition option:selected").text();
        if(company==""||company=="请选择"||department==""||department=="请选择"||positionname=="请选择"||positionname==""){
            alert("必须选择所属公司、部门、职位!");
            return false;
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/user/editUser.action",
            data:{"userName": userName,"tel":tel,"email":email,"company":company,"comId":comId,"department":department,"departId":departId,"position":positionname,"posId":posId,"password":password,"id":$("#eid").val()},
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
                field:'company',
                title:'所属公司'
            },
            {
                field:'department',
                title:'所属部门'
            },
            {
                field:'position',
                title:'职务'
            }
      /*      {
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
            }*/
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
    var comId=$("#company option:selected").val();
    var department=$("#department option:selected").text();
    var departId=$("#department option:selected").val();
    var posId=$("#position").val();
    var positionname=$("#position option:selected").text();
    if(company==""||company=="请选择"||department==""||department=="请选择"||positionname=="请选择"||positionname==""){
        alert("必须选择所属公司、部门、职位!");
        return false;
    }
    var level;
    for(var i=0;i<positionarr.length;i++){
        if(posId==positionarr[i].nodeId){
            level=parseInt(positionarr[i].level)+1;
        }
    }
    level=level+"";
    $.ajax({
        type:"post",
        url:"/rczcgl/user/addUser.action",
        data:{"userName":userName,"comId":comId,"departId":departId,"tel":tel,"email":email,"password":password,"company":company,"department":department,"posId":posId,"position":positionname,"level":level},
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

        $("#editmodal").find("input").each(function(){
            var id=this.id;
            for(var i in row[0]){
                if (id.indexOf(i)>-1){
                    $("#"+id).val(row[0][i]);
                }
            }
        })
    $("#editmodal").find("select").each(function(){
        var id=this.id;
        for(var i in row[0]){
            if (id.indexOf(i)>-1){
                if(id=="ecompany"){
                    $("#"+id).val(row[0]['comId']);
                   // $("#"+id).find("option[text='"+ row[0][i]+"']").attr("selected",true);
                }else{
                    $("#"+id).append("<option value="+ i+">"+ row[0][i]+"</option>");
                }
               // $("#company").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");

            }
        }
    })
    $("#eid").val(row[0].id);
   /* $("#userName1").val(row[0].userName);
    $("#tel1").val(row[0].tel);
    $("#email1").val(row[0].email);
    $("#type1").val(row[0].type);
    $("#password1").val(row[0].password);
    $("#userid1").val(row[0].id);*/
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
        async:false,
        data:{"depart":"company"},
        success:function(response){
            var data=response.data;
            $("#company").append("<option value='请选择'>请选择</option>");
            $("#ecompany").append("<option value='请选择'>请选择</option>");
            for(var i=0;i<data.length;i++){
                $("#company").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
                $("#ecompany").append("<option value="+ data[i].nodeId+">"+ data[i].nodeName+"</option>");
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
