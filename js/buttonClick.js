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

function polygonButton(){
    cursorMode = false;
    lineMode = false;
    squareMode = false;
    polygonMode = true;
}

