
var area = document.getElementById('jsonText');
area.style.display = "none";

function saveData(){
    area.style.display = "block";
    area.value = "Copy this text to your json file\n\n" + JSON.stringify(lineVertices, undefined, 4);
}

function loadData(){
    if(area.style.display === "none"){
        area.value = "Copy your json file's content here.";
        area.style.display = "block";
        return;
    }
    
    try{
        lineVertices = JSON.parse(area.value);
        area.style.display = "none";
        drawLine(gl, shaderProgram, lineVertices);
    }catch(err){
        console.log(err);
        alert("Please check your JSON text");
    }
}
