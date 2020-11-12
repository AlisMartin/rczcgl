/**
 * Created by wrh on 2020/9/27.
 */
var user= $.cookie('user');
var userobj=eval('('+user+')');
var columns = [];
$(function(){
    $("#saveUser").click(function(){
        addUser();
    });
    $("#add").click(function(){
        $("input[type=reset]").trigger("click");
    });
    $("#editUser").click(function(){
        if(editUser()){
            var row=$("#userTable").bootstrapTable('getSelections');
            loadData(row);
            $("#addUser").modal('show');
        }
    });
    $("#saveeditUser").click(function(){
        addUser();
    });
    getcolumn();
    $('#userTable').bootstrapTable({
        url:'/rczcgl/finance/getFinanceList.action',
        method:'post',
        contentType: "application/json;charset=UTF-8",
        clickToSelect:true,
        sidePagination:"server",
        pagination:true,
        pageNumber:1,
        pageSize:10,
        //pageList:[5,10,20,50,100],
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        columns:columns,
        queryParamsType: "limit",
        queryParams: function (params) {
            return JSON.stringify(params);
        },
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"85%");
});
function addUser(){
    if(userobj.auth.indexOf("8")==-1&&userobj.auth.indexOf("14")==-1){
        alert("当前用户无权限进行此操作！");
        return;
    }
    var arr = $("#addform").serializeArray();
    $.ajax({
        type:"post",
        url:"/rczcgl/finance/addOrUpdateFinance.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success:function(data){
            if(data.code==1){
                alert("编辑成功！");
                $("#userTable").bootstrapTable('refresh');
                $("#addUser").modal('hide');
            }else{
                alert("编辑失败！");
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
        alert("请先选择需要修改的融资信息！");
        return false;
    }
    return true;
}

function getcolumn() {
    columns = [];
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getAllConfigInfo.action",
        async: false,
        data: {zctype:5},
        success: function (data) {
            var htmlLeft = '';
            columns.push({checkbox: true});
            columns.push({
                field:"id",
                title:"融资编号"
            });
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj.field = data[i].field;
                obj.title = data[i].fieldname;
                columns.push(obj);
                switch (data[i].fieldType) {
                    case '1':
                        data[i].fieldType = "text";
                        break;
                    case '2':
                        data[i].fieldType = "number";
                        break;
                    case '3':
                        data[i].fieldType = "date";
                        break;
                    default :
                        break;
                }
                //生成表单
                htmlLeft = htmlLeft + '<div class="form-group">'+
                    '<label for="finance_days">' + data[i].fieldname + '</label>'+
                    '<input class="form-control" id="' + data[i].field + '" name="' + data[i].field + '" type="' + data[i].fieldType + '">'+
                    '</div>';
            }
            $("#financeform").append(' <input type="text" class="form-control" id="zcid" name="zcid" style="display: none"> ');
            $("#financeform").append('<div class="form-group"> <label for="id">融资编号</label>' +
                '<input class="form-control" id="id" name="id" type="text" "> </div>');
            $("#financeform").append(htmlLeft);
        },
        error: function () {
        }
    })
}

function loadData(row) {
    var obj = row[0];
    var key, value, tagName, type, arr;
    for (x in obj) {
        key = x;
        value = obj[x];
        $("[name='" + key + "'],[name='" + key + "[]']").each(function () {
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if (tagName == 'INPUT') {
                if (type == 'radio') {
                    $(this).attr('checked', $(this).val() == value);
                } else if (type == 'checkbox') {
                    arr = value.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        if ($(this).val() == arr[i]) {
                            $(this).attr('checked', true);
                            break;
                        }
                    }
                } else {
                    $(this).val(value);
                }
            } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                $(this).val(value);
            }

        });
    }
}
