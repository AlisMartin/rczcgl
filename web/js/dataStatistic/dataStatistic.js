var sjdata;
$(function(){
    $("#tjsx").selectpicker('val', ['1','2']);
    getdata();
   // initsdechart();
    initsxechart();
    initsxechart1();
    initzzechart1();
    initzzechart();
    //initzxechart();
    //initzzechart();
    $("#zclx").change(function(){
        getdata();
        // initsdechart();
        initsxechart();
        initsxechart1();
        initzzechart1();
        initzzechart();
    })
})

function initzzechart(){
    var name=[];
    var value=[];
    for(var i=0;i<sjdata.zj.length;i++){
        name.push(sjdata.zj[i].name);
        value.push(sjdata.zj[i].value);
    }
    var myChart = echarts.init(document.getElementById('zzechart'));
  var  option = {
      title: {
          text: '各公司房租汇总',
          // subtext: '纯属虚构',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} '
      },
        xAxis: {
            type: 'category',
            data: name
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: value,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }]
    };

    myChart.setOption(option);
}

function initzzechart1(){
    var name=[];
    var value=[];
    for(var i=0;i<sjdata.rzje.length;i++){
        name.push(sjdata.rzje[i].name);
        value.push(sjdata.rzje[i].value);
    }
    var myChart = echarts.init(document.getElementById('zzechart1'));
    var  option = {
        title: {
            text: '各公司融资金额汇总',
            // subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} '
        },
        xAxis: {
            type: 'category',
            data: name
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: value,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }]
    };

    myChart.setOption(option);
}
function initsxechart(){
    var myChart = echarts.init(document.getElementById('sxechart'));
    var option = {
        title: {
            text: '各公司房租汇总',
           // subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
    /*    legend: {
            orient: 'vertical',
            left: 'left',
            data: ['土地', '房屋', '海域', '其他']
        },*/
        series: [
            {
              //  name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data:sjdata.zj,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    myChart.setOption(option);
}
function initsxechart1(){
    var myChart = echarts.init(document.getElementById('sxechart1'));
    var option = {
        title: {
            text: '各公司融资金额汇总',
            // subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
    /*    legend: {
            orient: 'vertical',
            left: 'left',
            data: ['土地', '房屋', '海域', '其他']
        },*/
        series: [
            {
              //  name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data:sjdata.rzje,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    myChart.setOption(option);
}

function initsdechart(){
    var myChart = echarts.init(document.getElementById('sdechart'));
    var option;
    setTimeout(function () {

        option = {
            legend: {},
            tooltip: {
                trigger: 'axis',
                showContent: false
            },
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017', '2018', '2019', '2020'],
                    ['土地', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
                    ['房屋', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
                    ['海域', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
                    ['其他', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid: {top: '55%'},
            series: [
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {
                    type: 'pie',
                    id: 'pie',
                    radius: '30%',
                    center: ['50%', '25%'],
                    label: {
                        formatter: '{b}: {@2012} ({d}%)'
                    },
                    encode: {
                        itemName: 'product',
                        value: '2012',
                        tooltip: '2012'
                    }
                }
            ]
        };

        myChart.on('updateAxisPointer', function (event) {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
                var dimension = xAxisInfo.value + 1;
                myChart.setOption({
                    series: {
                        id: 'pie',
                        label: {
                            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                        },
                        encode: {
                            value: dimension,
                            tooltip: dimension
                        }
                    }
                });
            }
        });

        myChart.setOption(option);

    });
}

function makeWord(max, min) {
    var nameList = [
        '土地', '海域', '房屋', '其他'
    ];
    var nameLen = Math.ceil(Math.random() * max + min);
    var name = [];
    for (var i = 0; i < nameLen; i++) {
        name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
    }
    return name.join('');
}
function genData(count) {
    var legendData = [];
    var seriesData = [];
    var selected = {};
    for (var i = 0; i < count; i++) {
        name = Math.random() > 0.65
            ? makeWord(4, 1) + '·' + makeWord(3, 0)
            : makeWord(2, 1);
        legendData.push(name);
        seriesData.push({
            name: name,
            value: Math.round(Math.random() * 100000)
        });
        selected[name] = i < 6;
    }

    return {
        legendData: legendData,
        seriesData: seriesData,
        selected: selected
    };

}
function getcomIds(){
    var comids;
    $.ajax({
        type:"post",
        url:"/rczcgl/statistic/getComIds.action",
        async:false,
        success:function(resData){
            comids=resData.data;
        }
    })
    return comids;
}

function getdata(){
    debugger;
    var param={};
    var tjvalue=$("#tjsx").val();
    var zclx=$("#zclx").val();
    var sxs="";
    for(var i=0;i<tjvalue.length;i++){
        sxs=sxs+tjvalue[i]+",";
    }
    param.sx=sxs;
    if(zclx!=null&&zclx!=""&&zclx!="5"){
        param.zctype=zclx;
    }
    //
    $.ajax({
        type:"post",
        url:"/rczcgl/statistic/getTj.action",
        data:param,
        async:false,
        success:function(resData){
            sjdata=resData.data;
        }
    })
}