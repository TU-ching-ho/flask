let chart = echarts.init(document.querySelector("#main"))
let chart1 = echarts.init(document.querySelector("#six"))
let chart2 = echarts.init(document.querySelector("#county"))

let pm25HighSite = document.querySelector("#pm25_high_site");
let pm25HighValue = document.querySelector("#pm25_high_value");
let pm25LowSite = document.querySelector("#pm25_low_site");
let pm25LowValue = document.querySelector("#pm25_low_value");
let date1 = document.querySelector("#date");

$(document).ready(() => {
    drawpm25();
    drawsixpm25();
    drawcountypm25("南投縣");
});


window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart.resize();
}


$("#county_btn").click(() => {

    drawcountypm25($("#select_county").val());
});




function drawcountypm25(county) {
    chart2.showLoading();
    $.ajax(
        {
            url: `/pm25-county/${county}`,
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart2.hideLoading();

                drawpm25chart(data["site"], data["pm25"], "", chart2, "#32cd32")

            },
            error: () => {
                chart2.hideLoading();
                alert("讀取資料失敗")
            }
        }
    )
};




function drawsixpm25() {
    chart1.showLoading();
    $.ajax(
        {
            url: "/pm25-six-json",
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart1.hideLoading();

                drawpm25chart(data["site"], data["pm25"], title = "PM2.5六都平均值", chart1)

            },
            error: () => {
                chart1.hideLoading();
                alert("讀取資料失敗")
            }
        }
    )
};




function drawpm25() {
    chart.showLoading();
    $.ajax(
        {
            url: "/pm25-json",
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart.hideLoading();
                drawpm25chart(data["site"], data["pm25"], title = "全省PM2.5", chart)
                renderMAXPM25(data)
            },
            error: () => {
                chart.hideLoading();
                alert("讀取資料失敗")
            }
        }
    )
};





function drawpm25chart(xdata, ydata, title = "", chart = null, color = '#172b85') {

    let option = {
        title: {
            text: title
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'axis'
        },

        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            data: xdata
        },
        yAxis: {},

        series: [
            {
                itemStyle: {
                    color: color
                },
                name: '销量',
                type: 'bar',
                data: ydata
            }
        ]
    };


    chart.setOption(option)

}


function renderMAXPM25(data) {
    let pm25 = data["pm25"];
    let site = data["site"];
    let maxvlaue = Math.max(...pm25);
    let maxindex = pm25.indexOf(maxvlaue);
    let maxsite = site[maxindex];
    let minvlaue = Math.min(...pm25);
    let minindex = pm25.indexOf(minvlaue);
    let minsite = site[minindex];

    pm25HighSite.innerText = maxsite;
    pm25HighValue.innerText = maxvlaue;
    pm25LowSite.innerText = minsite;
    pm25LowValue.innerText = minvlaue;
    date1.innerText = data["date"];
}