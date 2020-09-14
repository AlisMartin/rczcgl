$(function(){
    //getconfiglist();
    $('#flowTable').bootstrapTable({
        url:'/rczcgl/flow/getConfigInfo.action',
        method:'post',
        clickToSelect:true,
        sidePagination:"client",
        pagination:true,
        pageNumber:1,
        pageSize:5,
        pageList:[5,10,20,50,100],
        paginationPreText:"��һҳ",
        paginationNextText:"��һҳ",
        columns:[
            {
                checkbox:true
            },
            {
                field:'flowId',
                title:'���̱��'
            },
            {
                field:'zctype',
                title:'�ʲ�����',
                formatter:function(value,row,index){
                    if(value=='1'){
                        return "�����ʲ�";
                    }else if(value=='2'){
                        return "�����ʲ�";
                    }else if(value='3'){
                        return "�����ʲ�";
                    }
                }
            },
            {
                field:'field',
                title:'�ʲ���Ӧ��',
                hidden:true
            },
            {
                field:"fieldname",
                title:'�ʲ���Ϣ��'
            }
        ],
        onLoadSuccess:function(){
        },
        onLoadError:function(){
        }
    })

})

function getconfiglist(){
    debugger;
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/getConfigInfo.action",
        sync:false,
        data:{},
        success:function(data){
            debugger;
            for(var i=0;i<data.length;i++){
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
        },
        error:function(){
        }
    })
}

function insertConfig(){
    debugger;
    var zctype=$("#zctype").val();
    var fieldname=$("#fieldname").val();
    var fieldlength="field";
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
    $.ajax({
        type:"post",
        url:"/rczcgl/assetsconfig/insertConfig.action",
        sync:false,
        data:{'fieldname':fieldname,'zctype':zctype,'field':fieldlength},
        success:function(data){
            debugger;
            if(data=='1'){
                alert("��ӳɹ���");
                landassets.zcinfo=[];
                houseassets.zcinfo=[];
                seaassets.zcinfo=[];
                $("#addConfig").modal('hide');
                $("#configTable").bootstrapTable('refresh');
            }
            getconfiglist();
        },
        error:function(){
            alert("���ʧ�ܣ����Ժ����ԣ�");
            $("#addConfig").modal('hide');
        }
    })
}