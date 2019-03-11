// grey  RGB: (129,129,129)
// white RGB: (250,250,250)

// array of rects (20 X 20 = 400)
var rects = [];
// my canvas
var myCanvas = undefined;
var cvsCtx = undefined;
// rects width and height in pixel
var rectWH = 20;
// mouse position buffer
var mousePos = []

// Rectangle in Canvas
class Rectangle
{
    constructor(pX, pY)
    {
        this.x = pX;
        this.y = pY;
        this.r = 129;
        this.g = 129;
        this.b = 129;
        this.realColor = 129;
        this.isWhite = false; // 0 means gray, 1 means absolute white
    }

    // draw on canvas
    draw()
    {
        cvsCtx.fillStyle = "rgb("+this.r.toString()+","+this.g.toString()+","+this.b.toString()+")";
        cvsCtx.fillRect(this.x, this.y, rectWH, rectWH);
    }

    setRGB(r, g, b, isWhite=false)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.isWhite = isWhite;
    }

    setColor(color, isWhite=false)
    {
        this.r = color;
        this.g = color;
        this.b = color;
        this.isWhite = isWhite;
    }

    setRealColor(color)
    {
        this.realColor = color;
    }
}

// load rects on start
function loadRectangles()
{
    myCanvas = document.getElementById("board_board");
    myCanvas.addEventListener('mousedown', cvsDraw, false);
    myCanvas.addEventListener('mouseup', cvsDone, false);
    cvsCtx = myCanvas.getContext("2d");
    // create rects
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            let pX = j * 20;
            let pY = i * 20;
            let newRect = new Rectangle(pX, pY);
            rects.push(newRect);
        }
    }
    refresh(false);
}

// refresh rects on canvas
function refresh(running=true)
{
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            let thisRect = rects[i + 20 * j];
            if(running)
            {
                if(!thisRect.isWhite)
                {
                    let counter = 0;
                    counter += checkColor(i-1, j-1);
                    counter += checkColor(i-1, j+1);
                    counter += checkColor(i-1, j);
                    counter += checkColor(i+1, j);
                    counter += checkColor(i+1, j-1);
                    counter += checkColor(i+1, j+1);
                    counter += checkColor(i, j-1);
                    counter += checkColor(i, j+1);
                    if(counter != 0)
                    {
                        let newColor = (counter * 250 + (8-counter) * 129) / 8;
                        thisRect.setColor(Math.floor(newColor));
                        thisRect.setRealColor(newColor)
                    }
                }
            }
            thisRect.draw();
        }
    }
}

// check the gray color
function checkColor(i, j)
{
    if(i < 0 || j < 0 || i > 19 || j > 19)
        return 0;
    if(rects[i + 20 * j].isWhite)
        return 1;
    else
        return 0;
}

// draw on canvas after mouse down
function cvsDraw()
{
    console.log("mouse down");
    myCanvas.addEventListener('mousemove', drawing);
    myCanvas.addEventListener('mousemove', setDrawingResult);
    myCanvas.addEventListener('mouseout', mouseOut);
    mousePos = [];
}
// stop drawing after mouse up
function cvsDone()
{
    console.log("mouse up");
    myCanvas.removeEventListener('mousemove', drawing);
    myCanvas.removeEventListener('mousemove', setDrawingResult);
    mousePos = [];
    refresh();
}
function mouseOut()
{
    cvsDone();
    myCanvas.removeEventListener('mouseout', mouseOut);
}

// function that handles drawing
function drawing(e)
{
    let posX = e.clientX - 200;
    let posY = e.clientY - 200;
    let i = Math.floor(posX / 20);
    let j = Math.floor(posY / 20);
    if(i < 1 || i > 20 || j < 1 || j > 20)
        return;
    mousePos.push(i);
    mousePos.push(j);
}

function setDrawingResult()
{
    if(mousePos.length != 0 && mousePos.length > 2)
    {
        let i = mousePos[0];
        let j = mousePos[1];
        rects[i - 1 + 20 * (j - 1)].setColor(250, true);
        rects[i - 1 + 20 * (j - 1)].setRealColor(250);
        mousePos.shift();
        mousePos.shift();
        // fill the gap caused by mouse move event (important)
        if(mousePos.length != 0)
        {
            if((mousePos[0] - i) > 1)
            {
                if((mousePos[1] - j) > 1)
                {
                    mousePos.unshift(j+1);
                    mousePos.unshift(i+1);
                }
                else if((j - mousePos[1]) > 1)
                {
                    mousePos.unshift(j-1);
                    mousePos.unshift(i+1);
                }
                else
                {
                    mousePos.unshift(j);
                    mousePos.unshift(i+1);
                }
            }
            else if((i - mousePos[0]) > 1)
            {
                if((mousePos[1] - j) > 1)
                {
                    mousePos.unshift(j+1);
                    mousePos.unshift(i-1);
                }
                else if((j - mousePos[1]) > 1)
                {
                    mousePos.unshift(j-1);
                    mousePos.unshift(i-1);
                }
                else
                {
                    mousePos.unshift(j);
                    mousePos.unshift(i-1);
                }
            }
            else if((mousePos[1] - j) > 1)
            {
                if((mousePos[1] - i) > 1)
                {
                    // mousePos.unshift(j+1);
                    // mousePos.unshift(i+1);
                }
                else if((i - mousePos[1]) > 1)
                {
                    // mousePos.unshift(j+1);
                    // mousePos.unshift(i-1);
                }
                else
                {
                    mousePos.unshift(j+1);
                    mousePos.unshift(i);
                }
            }
            else if((j - mousePos[1]) > 1)
            {
                if((mousePos[1] - i) > 1)
                {
                    // mousePos.unshift(j-1);
                    // mousePos.unshift(i+1);
                }
                else if((i - mousePos[1]) > 1)
                {
                    // mousePos.unshift(j-1);
                    // mousePos.unshift(i-1);
                }
                else
                {
                    mousePos.unshift(j-1);
                    mousePos.unshift(i);
                }
            }
        }
        setDrawingResult();
    }
    refresh();
}

// clear canvas
function clearCVS()
{
    console.log("clear");
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 20; j++)
        {
            rects[i + 20 * j].setColor(129);
            rects[i + 20 * j].setRealColor(129);
        }
    }
    refresh();
}

async function genValues()
{
    let rectArray = [];
    for(let i = 0; i < rects.length; i++)
    {
        let newNum = await convertNum(rects[i].realColor);
        rectArray.push(newNum);
    }
    transferRects(rectArray);
}

function convertNum(number)
{
    //let epsilon = Math.random() * (0.02) - 0.01;
    let result = ((number - 129)/(250 - 129) > 0.3) ? 1 : 0;
    return result;
}