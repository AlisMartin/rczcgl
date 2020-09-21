$(function(){
    initsdechart();
    initsxechart();
    initzxechart();
    initzzechart();
})
function initzzechart(){
    var myChart = echarts.init(document.getElementById('zzechart'));
    var option = {
        title:{
            text:'各类资产汇总'
        },
        legend: {},
        tooltip: {},
        dataset: {
            dimensions: ['product', '2018', '2019', '2020'],
            source: [
                {product: '土地资产', '2018': 43.3, '2019': 85.8, '2020': 93.7},
                {product: '房屋资产', '2018': 83.1, '2019': 73.4, '2020': 55.1},
                {product: '海域资产', '2018': 86.4, '2019': 65.2, '2020': 82.5},
                {product: '其他资产', '2018': 72.4, '2019': 53.9, '2020': 39.1}
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {
            name:'单位（万元）'
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {type: 'bar'},
            {type: 'bar'},
            {type: 'bar'}
        ]
    };
    myChart.setOption(option);
}
function initzxechart(){
    var myChart = echarts.init(document.getElementById('zxechart'));
    var option = {
        title:{
            text:'土地资产汇总'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        yAxis: {
            type: 'value',
            name:'单位（万元）'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {}
        }]
    };
    myChart.setOption(option);
}
function initsxechart(){
    var myChart = echarts.init(document.getElementById('sxechart'));
    var data = genData(50);

    var option = {
        title: {
            text: '各类资产统计',
           // subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['土地', '房屋', '海域', '其他']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '土地'},
                    {value: 310, name: '海域'},
                    {value: 234, name: '房屋'},
                    {value: 135, name: '土地'}
                ],
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