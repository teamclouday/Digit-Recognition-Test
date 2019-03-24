// weight1 : 128 X 784
// weight2 : 64  X 128
// weight3 : 10  X 64
// g(x) = 0 (if x <=0) ; x (if x>0)

var z1 = [];
var a2 = [];
var z2 = [];
var a3 = [];
var z3 = [];
var a4 = [];
var z4 = [];
var w1 = [];
var w2 = [];
var w3 = [];
var b1 = [];
var b2 = [];
var b3 = [];

var len=28;
var size=len*len;

var myChart = undefined;


async function transferRects(rectArray)
{
    z1 = rectArray;
    for(let j=0;j<z1.length;j++){
        z1[j] = (z1[j]-0.5)/0.5;
    }

    //math.reshape(math.transpose(math.reshape(rectArray, [len, len])), [size]);
    if(w1.length == 0)
    {
        await getText("https://williamwuyantao.github.io/pytorch_weight1.tex", 1);
        await getText("https://williamwuyantao.github.io/pytorch_bias1.tex", 2);
        await getText("https://williamwuyantao.github.io/pytorch_weight2.tex", 3);
        await getText("https://williamwuyantao.github.io/pytorch_bias2.tex", 4);
        await getText("https://williamwuyantao.github.io/pytorch_weight3.tex", 5);
        await getText("https://williamwuyantao.github.io/pytorch_bias3.tex", 6);
        await waitW();
    }
    else
    {
        await calcZ2();
        await calcA2(z2);
        await calcZ3();
        await calcA3(z3);
        await calcZ4();
        await calcA4(z4);
    }
}

// load w123 and b123 from file
function loadW(file, num)
{
    if(num == 1)
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length - 1; i++)
        {
            let nums = lines[i].split(",");
            let innerArr = [];
            for(let j = 0; j < nums.length; j++)
            {
                innerArr.push(parseFloat(nums[j]));
            }
            w1.push(innerArr);
        }
    }
    else if(num == 2)
    {
        let nums = file.split('\n');
        for(let j = 0; j < nums.length; j++)
        {
            b1.push(parseFloat(nums[j]));
        }
        
    }
    else if(num == 3)
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length - 1; i++)
        {
            let nums = lines[i].split(",");
            let innerArr = [];
            for(let j = 0; j < nums.length; j++)
            {
                innerArr.push(parseFloat(nums[j]));
            }
            w2.push(innerArr);
        }
    }
    else if(num == 4)
    {
        let nums = file.split('\n');
        for(let j = 0; j < nums.length; j++)
        {
            b2.push(parseFloat(nums[j]));
        }
        
    }
    else if(num == 5)
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length - 1; i++)
        {
            let nums = lines[i].split(",");
            let innerArr = [];
            for(let j = 0; j < nums.length; j++)
            {
                innerArr.push(parseFloat(nums[j]));
            }
            w3.push(innerArr);
        }
    }
    else if(num == 6)
    {
        let nums = file.split('\n');
        for(let j = 0; j < nums.length; j++)
        {
            b3.push(parseFloat(nums[j]));
        }
    }
    
}

// wait for W1 and W2 to set
async function waitW()
{
    if(w1.length != 0 && w2.length != 0 && w3.length != 0 && b1.length != 0 && b2.length != 0 && b3.length != 0)
    {
        await calcZ2();
        await calcA2(z2);
        await calcZ3();
        await calcA3(z3);
        await calcZ4();
        await calcA4(z4);
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
        z2 = math.multiply(math.matrix(w1), z1).toArray();
        
        for(var i=0; i< z2.length; i++) {
            var add = b1[i]
            z2[i] += add;
        }

        await calcA2(z2);
        await calcZ3();
        await calcA3(z3);
        await calcZ4();
        await calcA4(z4);
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
        a_ele = (zArr[i]<0)? 0 : zArr[i] ;
        a2.push(a_ele);
    }

}

async function calcZ3()
{
    if(z3.length == 0)
    {
        console.log("Calculating Z3...");
        z3 = math.multiply(math.matrix(w2), a2).toArray();

        for(var i=0; i< z3.length; i++) {
            z3[i] += b2[i];
        }

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
        a_ele = (zArr[i]<0)? 0 : zArr[i] ;
        a3.push(a_ele);
    }
}

async function calcZ4()
{
    if(z4.length == 0)
    {
        console.log("Calculating Z3...");
        z4 = math.multiply(math.matrix(w3), a3).toArray();

        for(var i=0; i< z4.length; i++) {
            z4[i] += b3[i];
        }

        await calcA3(z4);
        output();
    }
    else
    {
        z4 = [];
        calcZ4();
    }
}

function calcA4(zArr)
{
    a4 = [];
    sum=0.0;
    psum=0.0
    for(let i = 0; i < zArr.length; i++)
    {
        a_ele = Math.exp(zArr[i]);
        sum+=a_ele;
        a4.push(a_ele);
    }
    for(let i=0;i< zArr.length; i++){
        a4[i] = Math.pow(a4[i]/sum,1);
        psum += a4[i];
    }
    for(let i=0;i< zArr.length;i++){
        a4[i] = a4[i]/psum;
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
            labels: ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"],
            datasets: [{
                label: 'output',
                data: a4,
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