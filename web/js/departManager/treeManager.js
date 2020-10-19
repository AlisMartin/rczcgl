$(function(){
//初始化组织机构树
    initDepartTree();
    $("#closeDepart").click(function(){
        closeDiv();
    })
    $("#closeeDepart").click(function(){
        closeDiv();
    })
//初始化编辑modal
    $("#editDepart").click(function(){
        initEditModal();
    })
    //选择类型变化时
    $("#lx").change(function(){
        setCss($("#lx").val());
    })
    $("#elx").change(function(){
        setCss($("#elx").val());
    })
    //保存编辑
    $("#saveeDepart").click(function(){
        var param={};
        var type=$("#elx").val();
        var checked=$('#Tree').treeview('getChecked');
        if(type=="company"){
            var com=$("#ecompany").val();
            var px=$("#epx").val();
            if(com==""||com==null){
                alert("请输入公司名称！");
                return;
            }
            if(px==""||px==null){
                alert("请输入公司排序！");
                return;
            }
            var flag=queryPx(px);
            if(!flag){
                alert("序号已存在请重新填写!");
                return;
            }
            param.name=com;
            param.px=px;
            param.depart=type;
        }
        if(type=="department"){
            var depart=$("#edepartment").val();
            if(depart==""||depart==null){
                alert("请输入部门名称！");
                return;
            }
            param.name=depart;
            param.depart=type;
        }
        if(type=="position"){
            var position=$("#eposition").val();
            if(position==""||position==null){
                alert("请输入职位名称！");
                return;
            }
            param.name=position;
            param.depart=type;
        }
        param.id=checked[0].id;
        updateNode(param);
    })

//保存新增的组织机构
    $("#saveDepart").click(function(){
        debugger;
        var param={};
        var type=$("#lx").val();
        var checked=$('#Tree').treeview('getChecked');
        if(type=="company"){
            var com=$("#company").val();
            var px=$("#px").val();
            if(com==""||com==null){
                alert("请输入公司名称！");
                return;
            }
            if(px==""||px==null){
                alert("请输入公司排序！");
                return;
            }
            var flag=queryPx(px);
            if(!flag){
                alert("序号已存在请重新填写!");
                return;
            }
            param.name=com;
            param.depart="company";
            param.px=px;
        }
        if(type=="department"){
            var depart=$("#department").val();
            if(depart==""||depart==null){
                alert("请输入部门名称！");
                return;
            }
            param.name=depart;
            param.depart="depart";
        }
        if(type=="position"){
            var position=$("#position").val();
            if(position==""||position==null){
                alert("请输入职位名称！");
                return;
            }
            param.name=position;
            param.depart="position";
        }
        param.parentId=checked[0].id;

        $.ajax({
            type:"post",
            url:"/rczcgl/depart/insertNode.action",
            data:param,
            async:false,
            success:function(data){
                debugger;
                if(data.code==1){
                    alert("添加成功!");
                    initDepartTree();
                    closeDiv();
                }
            },
            error:function(){
                alert("系统错误！");
            }
        })
    })

    $("#addDepart").click(function(){
        debugger;
        var type=$("#lx").val();
        var checked=$('#Tree').treeview('getChecked');
        if(checked.length==0){
            alert("请选择需要增加的上级机构！");
            return;
        }else if(checked.length>1){
            alert("增加的机构所选上级机构只能是一个！");
            return;
        }else if(checked.length==1){
            if(type=="company"){
                $("#companydiv").css('display','block');
                $("#pxdiv").css('display','block');
            }else if(type=="department"){
                $("#departmentdiv").css('display','block');
            }else if(type=="position"){
                $("#positiondiv").css('display','block');
            }
        }
        $("#addDepartModal").modal("show");
    })

})

function initDepartTree(){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getnodes.action",
        dataType:"json",
        async:false,
        success:function(data){

            debugger;
            $('#Tree').treeview({
                data: data,
                levels:2 , //默认显示子级的数量
                //collapseIcon:" glyphicon glyphicon-user",  //收缩节点的图标
                //expandIcon:"glyphicon glyphicon-user",    //展开节点的图标
                nodeIcon:"glyphicon glyphicon-user",
                showIcon: false,//是否显示图标
                showCheckbox:true//是否显示多选框
            });
        },
        error:function(){
            alert("系统错误！");
        }
    })
}

function queryPx(px){
    var flag=true;
    var param={
        px:px
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/getDepart.action",
        data:param,
        async:false,
        success:function(data){
            debugger;
            if(data.data.length>0){
                flag=false;
            }
        },
        error:function(){
            alert("系统错误！");
        }
    })
    return flag;
}


function updateNode(param){
    $.ajax({
        type:"post",
        url:"/rczcgl/depart/updateNode.action",
        data:param,
        async:false,
        success:function(data){
            debugger;
            if(data.code==1){
                alert("修改成功！");
                initDepartTree();
                closeDiv();
            }else{
                alert("修改失败！");
                closeDiv();
            }
        },
        error:function(){
            alert("系统错误！");
        }
    })
}

function initEditModal(){
    debugger;
    var checked=$('#Tree').treeview('getChecked');
    if(checked.length==0){
        alert("请选择需要修改的机构！");
        return;
    }else if(checked.length>1){
        alert("修改的机构只能是一个！");
        return;
    }else if(checked.length==1){
        $("#elx").val(checked[0].depart);
        if(checked[0].depart=="company"){
            $("#ecompanydiv").css('display','block');
            $("#epxdiv").css('display','block');
            $("#ecompany").val(checked[0].text);
            $("#epx").val(checked[0].px);
        }else if(checked[0].depart=="department"){
            $("#edepartmentdiv").css('display','block');
            $("#edepartment").val(checked[0].text);
        }else if(checked[0].depart=="position"){
            $("#epositiondiv").css('display','block');
            $("#eposition").val(checked[0].text);
        }
    }
    $("#editDepartModal").modal('show');
}

function closeDiv(){
    $("#addDepartModal").modal('hide');
    $("#editDepartModal").modal('hide');
    $("#addform")[0].reset();
    $("#editform")[0].reset();
    $("#companydiv").css('display','none');
    $("#departmentdiv").css('display','none');
    $("#positiondiv").css('display','none');
    $("#pxdiv").css('display','none');
    $("#ecompanydiv").css('display','none');
    $("#edepartmentdiv").css('display','none');
    $("#epositiondiv").css('display','none');
    $("#epxdiv").css('display','none');
}
function setCss(type){
    if(type=="company"){
        $("#companydiv").css('display','block');
        $("#pxdiv").css('display','block');
        $("#departmentdiv").css('display','none');
        $("#positiondiv").css('display','none');
        $("#ecompanydiv").css('display','block');
        $("#epxdiv").css('display','block');
        $("#edepartmentdiv").css('display','none');
        $("#epositiondiv").css('display','none');
    }else if(type=="department"){
        $("#departmentdiv").css('display','block');
        $("#companydiv").css('display','none');
        $("#pxdiv").css('display','none');
        $("#positiondiv").css('display','none');
        $("#edepartmentdiv").css('display','block');
        $("#ecompanydiv").css('display','none');
        $("#epxdiv").css('display','none');
        $("#epositiondiv").css('display','none');
    }else if(type=="position"){
        $("#positiondiv").css('display','block');
        $("#departmentdiv").css('display','none');
        $("#companydiv").css('display','none');
        $("#pxdiv").css('display','none');
        $("#epositiondiv").css('display','block');
        $("#edepartmentdiv").css('display','none');
        $("#ecompanydiv").css('display','none');
        $("#epxdiv").css('display','none');
    }
}