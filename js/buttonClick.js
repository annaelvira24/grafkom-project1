function cursorButton(){
    cursorMode = true;
    lineMode = false;
    squareMode = false;
    polygonMode = false;
}

function lineButton(){
    cursorMode = false;
    lineMode = true;
    squareMode = false;
    polygonMode = false;
}

function squareButton(){
    cursorMode = false;
    lineMode = false;
    squareMode = true;
    polygonMode = false;
}

var numVert;

function polygonButton(){
    cursorMode = false;
    lineMode = false;
    squareMode = false;
    polygonMode = true;

    numVert = Number(prompt("Please enter number of vertices of your polygon", 3));
}

