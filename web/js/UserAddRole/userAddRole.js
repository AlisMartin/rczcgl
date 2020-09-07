$(function(){
    $("#saveGl").click(function(){
        var userrow=$("#userTable").bootstrapTable('getSelections');
        var rolerow=$("#roleTable").bootstrapTable('getSelections');
        if(userrow.length<=0||rolerow.length<=0){
            alert("请选择相应的用户和角色进行关联！");
            return false;
        }
        if(rolerow.length>1){
            alert("一个用户最多只能选择一个角色！");
            return false;
        }
        var userid=userrow[0].id;
        var roleids="";
        for(var i=0;i<rolerow.length;i++){
            roleids=roleids+rolerow[i].roleId+",";
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/user/userAddRole.action",
            data:{"userid":userid,"roleids":roleids},
            success:function(){
                alert("关联成功！");
            },
            error:function(){
                alert("系统错误，请稍后重试！");
            }
        })
    });

    $("#clearGl").click(function(){
        var userrow=$("#userTable").bootstrapTable('getSelections');
        var rolerow=$("#roleTable").bootstrapTable('getSelections');
        if(userrow.length<=0||rolerow.length<=0){
            alert("请选择相应的用户和角色取消关联！");
            return false;
        }
        var userid=userrow[0].id;
        var roleids="";
        for(var i=0;i<rolerow.length;i++){
            roleids=roleids+rolerow[i].roleId+",";
        }
        $.ajax({
            type:"post",
            url:"/rczcgl/user/userClearRole.action",
            data:{"userid":userid,"roleids":roleids},
            success:function(){
                alert("取消关联成功!");
                $("#userTable").bootstrapTable('refresh');
                $("#roleTable").bootstrapTable('refresh');
            },
            error:function(){
                alert("系统错误，请稍后重试！")
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
        }
    });

    $('#userTable').bootstrapTable({
        url:'/rczcgl/user/selectAllUser.action',
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
            //alert(1);
        },
        onLoadError:function(){
            showTips("数据加载失败!");
        },
        onCheck:function(row,$element){
            debugger;
            var userId=row.id;
            $.ajax({
                type:"post",
                url:"/rczcgl/user/getRoleByUserId.action",
                sync:false,
                data:{"userid":userId},
                success:function(data){
                    debugger;
                    $("#roleTable").bootstrapTable('uncheckAll');
                    if(data!=""&&data!=null){
                        $("#roleTable").bootstrapTable('checkBy',{field:'roleId',values:[data]});
                    }
                },
                error:function(){
                    alert("关联失败！")
                }
            })
        }
    })

})


