/**
 * Created by lp on 2020/5/29.
 */
$(function(){
    $('#roleTable').bootstrapTable({
        url:'/rczcgl/role/getAllRoles.action',
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
                field:'role',
                title:'角色'
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("加载失败!");
        }
    });
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");

    $("#saveRole").click(function(){
        var role = $("#role").val();
        if(role==""||role==null){
            alert("角色必须填写！")
            return false;
        }
       if(!judgeRoleCz(role)) {
           alert("角色已存在！");
           return false;
       }
        $.ajax({
            type:"post",
            url:"/rczcgl/role/addRole.action",
            data:{"role": role},
            success:function(data){
                if(data==1){
                    alert("添加成功！");
                    $("#roleTable").bootstrapTable('refresh');
                    $("#addmodal").modal('hide');
                }else{
                    alert("添加失败！");
                    $("#addmodal").modal('hide');
                }
            },
            error:function(data){
                alert("系统错误，请稍后重试!");
                $("#addmodal").modal('hide');
            }
        })
    })
    $("#editRole").click(function(){
        debugger;
        var row=$("#roleTable").bootstrapTable('getSelections');
        if(row.length<=0){
            alert("请选择需要修改的角色")
            return false;
        }
        if(row.length>1){
            alert("最多只能选择一个");
            return false;
        }
        $("#editmodal").modal("show");
        $("#role1").val(row[0].role);
        $("#roleId1").val(row[0].roleId);
    })
    $("#saveeditRole").click(function(){
        if($("#role1").val()==""||$("#role1").val()==null){
            alert("角色不能为空");
            return false;
        }
        if(!judgeRoleCz(row[0].role)) {
            alert("角色已存在！");
            return false;
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/role/updateRole.action",
            data:{"role": $("#role1").val(),"roleId":$("#roleId1").val()},
            success:function(data){
                if(data==1){
                    alert("修改成功！");
                    $("#roleTable").bootstrapTable('refresh');
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
    $("#deleteRole").click(function(){
        debugger;
        var row=$("#roleTable").bootstrapTable('getSelections');
        if(row.length<=0){
            alert("请选择需要修改的角色")
            return false;
        }
        $("#deletemodal").modal('show');
    })
    $("#scRole").click(function(){
        debugger;
        var row=$("#roleTable").bootstrapTable('getSelections');
        var roleId="";
        for(var i=0;i<row.length;i++){
            roleId=roleId+row[i].roleId+",";
        }
        roleId=roleId.substring(0,roleId.length-1);
        $.ajax({
            type:"post",
            url:"/rczcgl/role/delRole.action",
            data:{"roleId":roleId},
            success:function(data){
                if(data==1){
                    alert("删除成功！");
                    $("#roleTable").bootstrapTable('refresh');
                    $("#deletemodal").modal('hide');
                }else{
                    alert("修改失败！");
                    $("#deletemodal").modal('hide');
                }
            },
            error:function(data){
                alert("系统错误，请稍后重试!");
                $("#deletemodal").modal('hide');
            }
        })
    })

})
//判断角色是否存在
function judgeRoleCz(role){
    var flag=true;
    $.ajax({
        type:"post",
        url:"/rczcgl/role/queryRoleByRoleName.action",
        data:{"role":role},
        success:function(data){
            if(!data==1){
                flag=false;
            }
        },
        error:function(data){
            alert("系统错误，请稍后重试!");
            $("#deletemodal").modal('hide');
        }
    })
}
