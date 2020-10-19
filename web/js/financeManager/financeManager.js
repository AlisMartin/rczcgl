/**
 * Created by wrh on 2020/9/27.
 */
var columns = [];
$(function(){
    $("#saveUser").click(function(){
        addUser();
    });
    $("#add").click(function(){
        $("input[type=reset]").trigger("click");
    });
    $("#editUser").click(function(){
        //editUser();
        if(editUser()){
            var row=$("#userTable").bootstrapTable('getSelections');
            loadData(row);
            $("#addUser").modal('show');
        }
    });
    $("#saveeditUser").click(function(){
        addUser();
        /*$.ajax({
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
        })*/
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
        pageSize:5,
        pageList:[5,10,20,50,100],
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
            //showTips("数据加载失败!");
        }
    })
});
function addUser(){
    var arr = $("#addform").serializeArray();
    //arr.push({name: "zctype", value: param.zctype});
    $.ajax({
        type:"post",
        url:"/rczcgl/finance/addOrUpdateFinance.action",
        data: JSON.stringify(arr),
        contentType: "application/json;charset=UTF-8",
        datatype: "json",
        success:function(data){
            if(data.code==1){
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
        alert("请先选择需要修改的融资信息！");
        return false;
    }
    return true;
    //loadData(row);
    //$("#addUser").modal('show');
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
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj.field = data[i].field;
                obj.title = data[i].fieldname;
                columns.push(obj);
                //生成表单
                htmlLeft = htmlLeft + '<div class="form-group">'+
                    '<label for="finance_days">' + data[i].fieldname + '</label>'+
                    '<input type="text" class="form-control" id="' + data[i].field + '" name="' + data[i].field + '" type="' + data[i].fieldType + '">'+
                    '</div>';
            }
            $("#financeform").append(' <input type="text" class="form-control" id="zcid" name="zcid" style="display: none"> ');
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
