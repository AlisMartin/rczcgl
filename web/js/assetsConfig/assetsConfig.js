
$(function(){
    $("#zclx").change(function(){
        getconfiglist();
    })

    $('#addConfig').on('hide.bs.modal', function () {
        $("#addform")[0].reset();
    })
    $('#configTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getConfigInfo.action',
        method:'post',
        contentType: "application/json;charset=UTF-8",
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
                field:'zctype',
                title:'资产类型',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "土地资产";
                    }else if(value=='2'){
                        return "房屋资产";
                    }else if(value=='3'){
                        return "海域资产";
                    }else if(value=='4'){
                        return "其他资产";
                    }else if(value=='5'){
                        return "融资信息";
                    }
                }
            },
            {
                field:"fieldname",
                title:'资产信息项'
            },
            {
                field:"order",
                title:'顺序'
            }
        ],
        queryParams:function(params){
            var zctype=$("#zclx").val();
            params.zctype=zctype;
            return JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    });
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");
    $("#saveConfig").click(function(){
        insertConfig();
    })
/*    $("#queryconfig").click(function(){
        getconfiglist();
    })*/
    $("#xgconfig").click(function(){
        debugger;
        var rowdata=$("#configTable").bootstrapTable('getSelections');
        if(rowdata.length<=0){
            alert("请选择一条需要修改的配置信息！")
            return;
        }else{
            $("#editConfig").modal('show');
            $("#editzctype").val(rowdata[0].zctype);
            $("#editfieldname").val(rowdata[0].fieldname);
            $("#editorder").val(rowdata[0].order);

        }
    })

    $("#deleteconfig").click(function(){
        if(confirm("确定要删除吗？")){
            var rowdata=$("#configTable").bootstrapTable('getSelections');
            if(rowdata.length<=0){
                alert("请选择要删除的配置项！");
                return;
            }else{
                var param={};
                param.show="0";
                param.id=rowdata[0].id
                $.ajax({
                    type:"post",
                    url:"/rczcgl/assetsconfig/updateConfig.action",
                    sync:false,
                    data:param,
                    success:function(data){
                        debugger;
                        alert("删除成功！");
                        $("#configTable").bootstrapTable('refresh');
                    },
                    error:function(){
                    }
                })
            }
        }

    })

    $("#bcconfig").click(function(){
        debugger;
        var rowdata=$("#configTable").bootstrapTable('getSelections');
        var param={};
        param.zctype=$("#editzctype").val();
        param.fieldname=$("#editfieldname").val();
        param.order=$("#editorder").val();
        param.id=rowdata[0].id;
        var flag=queryOrder(param.zctype,param.order);
        if(flag){
            $.ajax({
                type:"post",
                url:"/rczcgl/assetsconfig/updateConfig.action",
                sync:false,
                data:param,
                success:function(data){
                    debugger;
                    alert("修改成功！");
                    $("#configTable").bootstrapTable('refresh');
                },
                error:function(){
                }
            })
        }else{
            alert("序号已存在！");
        }

    })

})

function getconfiglist(){
    debugger;
    var zctype=$("#zclx").val();
    var param={};
    if(zctype!=null&&zctype!=""){
        param.zctype=zctype;
    }
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getAllConfigInfo.action",
        sync:false,
        data:param,
        success:function(data){
            debugger;
            var dataarray=[];
            for(var i=0;i<data.length;i++){
                if(data[i].show=="1"){
                    dataarray.push(data[i]);
                }
            }
            $("#configTable").bootstrapTable('load',dataarray);
        },
        error:function(){
        }
    })
}

function insertConfig(){
    debugger;
    var zctype=$("#zctype").val();
    var fieldname=$("#fieldname").val();
    var order=$("#order").val();
    var fieldType=$("#fieldType").val();
    var fieldlength="field";
    var flag=queryOrder(zctype,order);

    switch (zctype){
        case '1':
            fieldlength = fieldlength+(getconfiglength()+1);
            break;
        case '2':
            fieldlength = fieldlength+(getconfiglength()+1);
            break;
        case '3':
            fieldlength = fieldlength+(getconfiglength()+1);
            break;
        case '4':
            fieldlength = fieldlength+(getconfiglength()+1);
            break;
        case '5':
            fieldlength = "fc"+fieldlength+(getconfiglength()+1);
    }
    if(flag){
        $.ajax({
            type:"post",
            url:"/rczcgl/assetsconfig/insertConfig.action",
            sync:false,
            data:{'fieldname':fieldname,'zctype':zctype,'field':fieldlength,'order':order,'show':'1',fieldType:fieldType},
            success:function(data){
                debugger;
                if(data=='1'){
                    alert("添加成功！");
                    $("#addConfig").modal('hide');
                    $("#configTable").bootstrapTable('refresh');
                }
                getconfiglist();
            },
            error:function(){
                alert("添加失败！请稍后重试！");
                $("#addConfig").modal('hide');
            }
        })
    }else{
        alert("序号已存在,请重新输入!");
        $("#addConfig").modal('hide');
    }

}


function queryOrder(zctype,order){
    debugger;
    var flag=true;
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getAllConfigInfo.action",
        async:false,
        data:{'zctype':zctype,'order':order},
        success:function(data){
            debugger;
            if(data!=null&&data!=""){
                flag=false;
            }
        },
        error:function(){
        }
    })
    return flag;
}

function getconfiglength(){
    debugger;
    var zctype=$("#zctype").val();
    var length=0;
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getAllConfigInfo.action",
        data:{zctype:zctype},
        async:false,
        success:function(data){
            length=data.length;
        },
        error:function(){
        }
    })
    return length;
}