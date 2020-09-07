$(function(){
    $("#saveGl").click(function(){
        var rolerow=$("#roleTable").bootstrapTable('getSelections');
        var authrow=$("#authTable").bootstrapTable('getSelections');
        if(rolerow.length<=0||authrow.length<=0){
            alert("请选择相应的角色和权限进行关联！");
            return false;
        }
        if(rolerow.length>1){
            alert("最多选择一种角色!");
            return false;
        }
        var roleId=rolerow[0].roleId;
        var authIds="";
        for(var i=0;i<authrow.length;i++){
            authIds=authIds+authrow[i].authId+",";
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/role/roleAddAuth.action",
            data:{"roleId":roleId,"authId":authIds},
            success:function(){
                alert("关联成功！");
            },
            error:function(){
                alert("系统错误，请稍后重试！");
            }
        })
    });

    $("#clearGl").click(function(){
        var rolerow=$("#roleTable").bootstrapTable('getSelections');
        var authrow=$("#authTable").bootstrapTable('getSelections');
        if(rolerow.length<=0||authrow.length<=0){
            alert("请选择相应的角色和权限进行关联！");
            return false;
        }
        var roleId=rolerow[0].roleId;
        var authIds="";
        for(var i=0;i<authrow.length;i++){
            authIds=authIds+authrow[i].authId+",";
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/role/roleClearAuth.action",
            data:{"roleId":roleId,"authId":authIds},
            success:function(){
                alert("取消关联成功!");
                $("#roleTable").bootstrapTable('refresh');
                $("#authTable").bootstrapTable('refresh');
            },
            error:function(){
                alert("系统错误，请稍后重试！");
            }
        })
    })

    $('#roleTable').bootstrapTable({
        url:'/rczcgl/role/getAllRoles.action',
        method:'post',
        clickToSelect:true,
        singleSelect: true,
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
                title:'ID'
            },
            {
                field:'roleId',
                title:'角色ID'
            },
            {
                field:'role',
                title:'角色',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "超级管理员"
                    }else if(value=='2'){
                        return "普通管理员"
                    }else if(value='3'){
                        return "普通用户";
                    }else{
                        return "游客"
                    }
                }

            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
            showTips("加载失败!");
        },
        onCheck:function(row,$element){
            debugger;
            var roleId=row.roleId;
            $.ajax({
                type:"post",
                url:"/rczcgl/role/selectAuthByRole.action",
                sync:false,
                dataType:'json',
                data:{"roleId":roleId},
                success:function(data){
                    debugger;
                    var array=[];
                    if(data.indexOf(",")>0){
                        array=data.split(",");
                    }else{
                        array.push(data);
                    }
                    $("#authTable").bootstrapTable('uncheckAll');
                    if(data!=""&&data!=null){
                        $("#authTable").bootstrapTable('checkBy',{field:'authId',values:array});
                    }
                },
                error:function(){
                    alert("关联失败！")
                }
            })
        }
    });

    $('#authTable').bootstrapTable({
        url:'/rczcgl/auth/getAllauths.action',
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
                title:'ID'
            },
            {
                field:'authId',
                title:'权限ID'
            },
            {
                field:'authType',
                title:'权限',
                formatter:function(value,row,index){
                    debugger;
                    if(value=='1'){
                        return "用户管理"
                    }else if(value=='2'){
                        return "导出资料"
                    }else if(value=='3'){
                        return "导入文件";
                    }else{
                        return "浏览"
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


