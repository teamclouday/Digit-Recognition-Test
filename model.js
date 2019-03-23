// w1 1: 25 X 785
// w2 2: 10 X 26
// g(x) = 1 / (1 + e^(-x))

var a1 = [];
var a2 = [];
var a3 = [];
var z1 = [];
var z2 = [];
var z3 = [];
var w1 = [];
var w2 = [];

var len=28;
var size=len*len;

var myChart = undefined;


async function transferRects(rectArray)
{
    z1 = math.reshape(math.transpose(math.reshape(rectArray, [len, len])), [size]);
    a1 = [1].concat(z1);
    if(w1.length == 0)
    {
        await getText("https://williamwuyantao.github.io/w1.tex", 1);
        await getText("https://williamwuyantao.github.io/w2.tex", 2);
        await waitW();
    }
    else
    {
        await calcZ2();
    }
}

// load w1 and w2 from file
function loadW(file, num)
{
    if(num == 1)
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length - 1; i++)
        {
            let nums = lines[i].split("&");
            let innerArr = [];
            for(let j = 0; j < nums.length; j++)
            {
                innerArr.push(parseFloat(nums[j]));
            }
            w1.push(innerArr);
        }
    }
    else
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length - 1; i++)
        {
            let nums = lines[i].split("&");
            let innerArr = [];
            for(let j = 0; j < nums.length; j++)
            {
                innerArr.push(parseFloat(nums[j]));
            }
            w2.push(innerArr);
        }
    }
}

// wait for W1 and W2 to set
async function waitW()
{
    if(w1.length != 0 && w2.length != 0)
    {
        await calcZ2();
    }
    else
    {
        setTimeout(waitW, 1000);
    }
}

// get text from online url
function getText(url, num)
{
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send(null);
    request.addEventListener("load", () => {console.log("file retrieved");});
    request.onreadystatechange = async function()
    {
        if(request.readyState === 4 && request.status === 200)
        {
            f = request.responseText;
            await loadW(f, num);
        }
    }
}

// calc Z2
async function calcZ2()
{
    if(z2.length == 0)
    {
        console.log("Calculating Z2...");
        z2 = math.multiply(math.matrix(w1), a1).toArray();
        await calcA2(z2);
        await calcZ3();
    }
    else
    {
        z2 = [];
        calcZ2();
    }
}

function calcA2(zArr)
{
    a2 = [];
    for(let i = 0; i < zArr.length; i++)
    {
        a2.push((1 / (1 + Math.pow(Math.E, -zArr[i]))));
    }
    a2.unshift(1);
}

async function calcZ3()
{
    if(z3.length == 0)
    {
        console.log("Calculating Z3...");
        z3 = math.multiply(math.matrix(w2), a2).toArray();
        await calcA3(z3);
        output();
    }
    else
    {
        z3 = [];
        calcZ3();
    }
}

function calcA3(zArr)
{
    a3 = [];
    for(let i = 0; i < zArr.length; i++)
    {
        a3.push((1 / (1 + Math.pow(Math.E, -zArr[i]))));
    }
}

// final output
function output()
{
    if(myChart != undefined)
    {
        myChart.destroy();
        myChart = undefined;
    }
    var ctx = document.getElementById("myChart");
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            datasets: [{
                label: 'output',
                data: a3,
                backgroundColor: [
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)',
                    'rgba(200, 100, 50, 0.5)'
                ],
                borderColor: [
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)',
                    'rgba(250, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function destroyChart()
{
    if(myChart != undefined)
        myChart.destroy();
}