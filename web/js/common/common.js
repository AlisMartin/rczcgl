//�ж��Ƿ���ǰ���0
function getNow(s) {
    return s < 10 ? '0' + s: s;
}

function getNowDate(){
    var myDate = new Date();

    var year=myDate.getFullYear();        //��ȡ��ǰ��
    var month=myDate.getMonth()+1;   //��ȡ��ǰ��
    var date=myDate.getDate();            //��ȡ��ǰ��


    var h=myDate.getHours();              //��ȡ��ǰСʱ��(0-23)
    var m=myDate.getMinutes();          //��ȡ��ǰ������(0-59)
    var s=myDate.getSeconds();

    var now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
    return now;
}
