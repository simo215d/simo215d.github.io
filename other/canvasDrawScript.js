window.addEventListener("load", load);

var selectedColor = "black";

function load() {
    console.log("it is tuesday my dudes!");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    resize();
    //ctx.fillStyle="blue";
    //ctx.fillRect(0,0,10,10);
    let isDrawing = false;
    function startPosition(e) {
        isDrawing = true;
        draw(e);
    }
    function finishedPosition() {
        isDrawing = false;
        ctx.beginPath();
    }
    function draw(e) {
        if (!isDrawing){
            return;
        }
        ctx.lineWidth = document.getElementById("sliderValue").innerHTML;
        ctx.lineCap = "round";
        ctx.strokeStyle = selectedColor;
        ctx.lineTo(e.clientX, e.clientY-100);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY-100);
    }
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);
}

function setColor(color, element){
    selectedColor = color;
    document.getElementById("blackDot").style.borderColor = "white";
    document.getElementById("redDot").style.borderColor = "white";
    document.getElementById("blueDot").style.borderColor = "white";
    document.getElementById("yellowDot").style.borderColor = "white";
    document.getElementById("greenDot").style.borderColor = "white";
    element.style.borderColor = "gray";
}

window.addEventListener("resize", resize);

function resize() {
    const canvas = document.querySelector("#canvas");
    canvas.height = window.innerHeight-8-100;
    canvas.width = window.innerWidth-8;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
};
