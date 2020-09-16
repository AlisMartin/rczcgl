var columns=[];
var param={};

$(function(){
    debugger;

    var zctype=parent.document.getElementById("InfoList").src.split("?")[1].split("&&")[0];
    zctype=zctype.substring(zctype.length-1,zctype.length);
    param.zctype=zctype;
    //导入
    $("#importAssets").click(function(){
        debugger;
        $("#assetsFile").click();
    });
    //导出
    $("#exportAssets").click(function(){
        exportAssetsInfo();
    });
    //新增资产
    $("#addAsset").click(function(){
        $("#add").modal('show');
    });
    $("#saveAsset").click(function(){
        addAsset();
    });
    $("#zctype").change(function(){
        param.zctype=$('#zctype').val();
        getcolumn();
        $('#assetsTable').bootstrapTable('destroy');
        $('#assetsTable').bootstrapTable({
            url:'/rczcgl/assetsconfig/getAssetsInfo.action',
            method:'get',
            clickToSelect:true,
            sidePagination:"client",
            pagination:true,
            pageNumber:1,
            pageSize:5,
            pageList:[5,10,20,50,100],
            paginationPreText:"上一页",
            paginationNextText:"下一页",
            columns:columns,
            queryParams:function(params){
                return param;
            },
            onLoadSuccess:function(){
            },
            onLoadError:function(){
            }
        })
    });

    //获取动态列
    getcolumn();
    $('#assetsTable').bootstrapTable({
        url:'/rczcgl/assetsconfig/getAssetsInfo.action',
        method:'get',
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:columns,
        queryParams:function(params){
            return param;
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
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

function getcolumn(){
    debugger;
    columns=[];
    var zctype=$("#zctype").val();
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getConfigInfo.action",
        async:false,
        data:param,
        success:function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].zctype=='1'){
                    data[i].zctype="土地资产";
                }
                if(data[i].zctype=='2'){
                    data[i].zctype="房屋资产";
                }
                if(data[i].zctype=='3'){
                    data[i].zctype="海域资产";
                }
                var obj={};
                obj.field=data[i].field;
                obj.title=data[i].fieldname;
                columns.push(obj);

                var htmlLeft = '',htmlRight = '';
                if(i%2 === 0){
                    htmlLeft = htmlLeft + '<div class="form-group"> <label for="'+ data[i].field +'">'+ data[i].fieldname + '</label>'+
                        '<input type="text" class="form-control" id="'+ data[i].field +'" name="'+ data[i].field +'"> </div>'
                }else{
                    htmlRight = htmlRight + '<div class="form-group"> <label for="'+ data[i].field +'">'+ data[i].fieldname + '</label>'+
                        '<input type="text" class="form-control" id="'+ data[i].field +'" name="'+ data[i].field +'"> </div>'
                }
                $("#landAssetsLeft").append(htmlLeft);
                $("#landAssetsRight").append(htmlRight);
            }


        },
        error:function(){
        }
    })
}

function exportAssetsInfo(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/export/exportAssets.action",
        async:false,
        data:param,
        success:function(data){
            var downloadA=document.createElement("a");
            downloadA.setAttribute("href",data.data);
            downloadA.setAttribute("target","_blank");
            downloadA.click();
            downloadA.remove();
        },
        error:function(){
        }
    })
}

function importAssetsInfo(){
    debugger;
    $("#zclx").val(param.zctype);
    var form=new FormData($("#assetsform")[0]);
   $.ajax({
        type:"post",
        url:"/rczcgl/export/importAssets.action",
        data:form,
        async:false,
        cache:false,
        contentType:false,
        processData:false,
        success:function(data){
            alert("导入成功！");
            $("#assetsform")[0].reset();
            $('#assetsTable').bootstrapTable('refresh');

        },
        error:function(){
            $("#assetsform")[0].reset();
        }
    })
}

function addAsset(){
    var arr = $("#addform").serializeArray();
    arr.push({name: "zctype", value: param.zctype});
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/addAssetsByType.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success: function (res) {
            $('#assetsTable').bootstrapTable('refresh');
            $("#add").modal('hide');
        },
        error: function (res) {
            alert("系统错误，请稍后重试！");
        }
    })
}