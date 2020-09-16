var landassets={
    zctype:'1',
    zcinfo:[]
}
var houseassets={
    zctype:'2',
    zcinfo:[]
}
var seaassets={
    zctype:'3',
    zcinfo:[]
}
$(function(){
    //getconfiglist();
    $('#configTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getConfigInfo.action',
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
                field:'zctype',
                title:'资产类型',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "土地资产";
                    }else if(value=='2'){
                        return "房屋资产";
                    }else if(value='3'){
                        return "海域资产";
                    }
                }
            },
            {
                field:'field',
                title:'资产对应项',
                hidden:true
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
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })
    $("#saveConfig").click(function(){
        insertConfig();
    })
    $("#queryconfig").click(function(){
        getconfiglist();
    })
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
            landassets.zcinfo=[];
            houseassets.zcinfo=[];
            seaassets.zcinfo=[];
            var dataarray=[];
            for(var i=0;i<data.length;i++){
                if(data[i].show=="1"){
                    dataarray.push(data[i]);
                }
                if(data[i].zctype=="1"){
                    landassets.zcinfo.push(data[i]);
                }
                if(data[i].zctype=="2"){
                    houseassets.zcinfo.push(data[i]);
                }
                if(data[i].zctype=="3"){
                    seaassets.zcinfo.push(data[i]);
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
    var fieldlength="field";
    var flag=queryOrder(zctype,order);

    switch (zctype){
        case '1':
            fieldlength = fieldlength+(landassets.zcinfo.length+1);
            break;
        case '2':
            fieldlength = fieldlength+(houseassets.zcinfo.length+1);
            break;
        case '3':
            fieldlength = fieldlength+(seaassets.zcinfo.length+1);
    }
    if(flag){
        $.ajax({
            type:"post",
            url:"/rczcgl/assetsconfig/insertConfig.action",
            sync:false,
            data:{'fieldname':fieldname,'zctype':zctype,'field':fieldlength,'order':order,'show':'1'},
            success:function(data){
                debugger;
                if(data=='1'){
                    alert("添加成功！");
                    landassets.zcinfo=[];
                    houseassets.zcinfo=[];
                    seaassets.zcinfo=[];
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
            if(data!=null){
                flag=false;
            }
        },
        error:function(){
        }
    })
    return flag;
}