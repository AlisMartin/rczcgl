var columns = [];
var configdata=[];
var param = {};
var zcid = "";
var fileid = "";
var countobj={};
var user= $.cookie('user');
var userobj=eval('('+user+')');
var bootheight;
$(function () {
    bootheight=parent.window.document.getElementById('chartheight').scrollHeight*0.85+"px";
    getCompanys();
    var zctype = parent.document.getElementById("InfoList").src.split("?")[1].split("&&")[0];
    zctype = zctype.substring(zctype.length - 1, zctype.length);
    param.zctype = zctype;
    param.gsmc=userobj.comId;
    //导出
    $("#exportSummary").click(function () {
        exportSummary();
    });
    //获取动态列
    getcolumn();
    $('#assetsTable').bootstrapTable({
        url: '/rczcgl/assetsconfig/getSumAssetsInfo.action',
        contentType: "application/json;charset=UTF-8",
        method: 'post',
        clickToSelect: true,
        showFooter:true,
        theadClasses: "fontstyle",//这里设置表头样式
        height:bootheight,
       // sidePagination: "server",
       // pagination: true,
       // pageNumber: 1,
       // pageSize: 5,
        //pageList: [5, 10, 20, 50, 100],
       // paginationPreText: "上一页",
        //paginationNextText: "下一页",
        columns: columns,
        queryParamsType : "limit",
        queryParams: function (params) {
            debugger;
            params.zctype = param.zctype;
            if(userobj.comId!==null&&userobj.auth!='8'){
                params.gsmc=userobj.comId;
            }
            return JSON.stringify(params);
        },
        onLoadSuccess: function (data) {
            var field,index,fcfield,fcindex;
            //合并
            for(var i=0;i<data.rows.length;i++){
               for(var j=0;j<columns.length;j++){
                   for(var obj in data.rows[0]){
                       if(obj==columns[j].field&&columns[j].title.indexOf("公司")>-1){
                           field=obj;
                           index=j;
                           break;
                       }
                   }
               }
            }
            mergeCells(data.rows,field,1,$("#assetsTable"));
            //
            for(var i=0;i<data.rows.length;i++){
                for(var j=0;j<columns.length;j++) {
                    for (var obj in data.rows[0]) {
                       if( obj==columns[j].field){
                           for (var k = 0; k < configdata.length; k++) {
                                   if ( columns[j].field==configdata[k].field  && configdata[k].zctype == "5") {
                                       fcfield = obj;
                                       fcindex = j;
                                       mergeFcCells(data.rows, fcfield, 1, $("#assetsTable"));
                                   }

                           }
                       }
                    }
                }
            }
        },
        onLoadError: function () {
        },
        onClickCell: function (field, value, row, $element) {
        },
        onCheck: function (row, $element) {
        }

    })

    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"93%");
});

function getcolumn() {
    debugger;
    columns = [
        {
            title:'序号',
            formatter:function(value,row,index){
                var pageSize=$("#assetsTable").bootstrapTable('getOptions').pageSize;
                var pageNumber=$("#assetsTable").bootstrapTable('getOptions').pageNumber;
                return pageSize*(pageNumber-1)+index+1;
            },
        },
    ];
    var type=param.zctype+",5";
    $.ajax({
        type: "post",
        url: "/rczcgl/assetsconfig/getConfigInfoshow.action",
        async: false,
        data: {'zctype':type},
        success: function (data) {

            configdata=data;
            gettotal(data[0].zctype,param.gsmc);
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                if(i==0){
                    obj.field = data[i].field;
                    obj.title = data[i].fieldname;
                    obj.footerFormatter="总计：";
                }else if(data[i].fieldType=="2"){
                    var count=0;
                    if(countobj!=null&&countobj!=""){
                        for(var sx in countobj){
                            if(sx==data[i].field){
                                count=countobj[sx];
                            }
                        }
                    }
                        obj={
                            field : data[i].field,
                            title : data[i].fieldname,
                            footerFormatter:count+""
                        }

                }else{
                    obj.field = data[i].field;
                    obj.title = data[i].fieldname;
                }

                columns.push(obj);
            }

        },
        error: function () {
        }
    })
}

function exportAssetsInfo() {
    $.ajax({
        type: "post",
        url: "/rczcgl/export/exportAssets.action",
        async: false,
        data: param,
        success: function (data) {
            var downloadA = document.createElement("a");
            downloadA.setAttribute("href", data.data);
            downloadA.setAttribute("target", "_blank");
            downloadA.click();
            downloadA.remove();
        },
        error: function () {
        }
    })
}


function loadData(row) {
    //var obj = eval("("+jsonStr+")");
    var obj = row;
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

/**
 * 合并行
 * @param data  原始数据（在服务端完成排序）
 * @param fieldName 合并属性名称数组
 * @param colspan 列数
 * @param target 目标表格对象
 */
function mergeCells(data, fieldName, colspan, target) {
    if (data.length == 0) {
        alert("不能传入空数据");
        return;
    }
   // var numArr = [];
    var value = data[0][fieldName];
    var num = 0;
    var index=0;
    for (var i = 0; i < data.length; i++) {
        if (value != data[i][fieldName]) {
            $(target).bootstrapTable('mergeCells', { index: index, field: fieldName, colspan: colspan, rowspan: num });
            value = data[i][fieldName];
            num=1;
            index=i;
            continue;
        }
        if(value==data[i][fieldName]&&i==(data.length-1)){
            $(target).bootstrapTable('mergeCells', { index: index, field: fieldName, colspan: colspan, rowspan: data.length-index });
        }
        num++;
    }
}

function mergeFcCells(data, fieldName, colspan, target) {
    var pdName='financeid';
    if (data.length == 0) {
        alert("不能传入空数据");
        return;
    }
    var value = data[0][pdName];
    var num = 0;
    var index=0;
    for (var i = 0; i < data.length; i++) {
        if (value != data[i][pdName]) {
            $(target).bootstrapTable('mergeCells', { index: index, field: fieldName, colspan: colspan, rowspan: num });
            value = data[i][pdName];
            num=1;
            index=i;
            continue;
        }
        if(value==data[i][pdName]&&i==(data.length-1)){
            $(target).bootstrapTable('mergeCells', { index: index, field: fieldName, colspan: colspan, rowspan: data.length-index });
        }
        num++;
    }
}

function gettotal(zctype,gs){
    debugger;
    var param={};
    if(zctype!=null&&zctype!=""){
        param.zctype=zctype;
    }
    if(gs!=null&&gs!=""&&gs!="allcompany"){
        param.gsmc=gs;
    }
        $.ajax({
            type: "post",
            url: "/rczcgl/assetsconfig/total.action",
            async:false,
            data:param,
            success: function (resonsedata) {
                countobj=resonsedata;
            },
            error: function () {
            }
        })
    return countobj;
}

function reloadTable(a){
    var comId= a.className;
    if(comId!=""&&comId!="allcompany"){
        param.gsmc = comId;
    }else{
        param.gsmc=null;
    }
    getcolumn();
    $('#assetsTable').bootstrapTable('refreshOptions', {
        queryParams: function (params) {
            params.zctype = param.zctype;
            if(comId!=""&&comId!="allcompany"){
                params.gsmc = comId;
            }
            return JSON.stringify(params);
        }, columns: columns

    })
    $(".bootstrap-table.bootstrap3").css('height',"100%");
    $(".fixed-table-container").css('height',"93%");
}


function getCompanys() {
    $.ajax({
        type: "post",
        url: "/rczcgl/depart/getDepart.action",
        data: {'depart': "company"},
        async: false,
        success: function (res) {
            var data = res.data;
            var htmlLeft = '';
            htmlLeft = htmlLeft +
                '<li class="active" style="flex: none"><a class="allcompany" data-toggle="tab" onclick="reloadTable(this)">所有公司</a></li>';

            for (var i = 0; i < data.length; i++) {
                //生成表单
                    htmlLeft = htmlLeft +
                        '<li style="flex: none"><a class="' + data[i].id + '" data-toggle="tab" onclick="reloadTable(this)">' + data[i].nodeName + '</a></li>';

            }
            if(userobj.auth.indexOf("9")>-1||userobj.auth.indexOf("8")>-1){
                $("#myTab").append(htmlLeft);
            }

        },
        error: function () {
        }
    })
}

//导出
function exportSummary(){
    debugger;
    var data={};
    data.zctype=param.zctype;
    if(userobj.auth.indexOf("8")<=-1){
        data.gsmc=param.gsmc;
    }
   $.ajax({
        type: "post",
        url: "/rczcgl/export/exportSummary.action",
        data:data,
        async: false,
        success: function (datas) {
            var downloadA = document.createElement("a");
            downloadA.setAttribute("href", datas.data);
            downloadA.setAttribute("target", "_blank");
            downloadA.click();
            downloadA.remove();
        },
        error: function () {
        }
    })

}