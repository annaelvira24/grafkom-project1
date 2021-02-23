function cursorButton(){
    cursorMode = true;
    resizeMode = false;
    lineMode = false;
    squareMode = false;
    polygonMode = false;
    colorMode = false;
}

function resizeButton(){
    cursorMode = false;
    resizeMode = true;
    lineMode = true;
    squareMode = false;
    polygonMode = false;
    colorMode = false;
}

function lineButton(){
    cursorMode = false;
    resizeMode = false;
    lineMode = true;
    squareMode = false;
    polygonMode = false;
    colorMode = false;
}

function squareButton(){
    cursorMode = false;
    resizeMode = false;
    lineMode = false;
    squareMode = true;
    polygonMode = false;
    colorMode = false;
}

var numVert;

function polygonButton(){
    cursorMode = false;
    resizeMode = false;
    lineMode = false;
    squareMode = false;
    polygonMode = true;
    colorMode = false;

    numVert = Number(prompt("Please enter number of vertices of your polygon", 3));
}

function colorButton(){
    cursorMode = false;
    resizeMode = false;
    lineMode = false;
    squareMode = false;
    polygonMode = false;
    colorMode = true;
}