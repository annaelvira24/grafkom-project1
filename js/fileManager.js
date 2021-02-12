
var area = document.getElementById('jsonText');
area.style.display = "none";

function saveData(){
    area.style.display = "block";
    area.value = JSON.stringify(lineVertices, undefined, 4);
    alert("Copy text below to your json file");
}

function loadData(){
    if(area.style.display === "none"){
        area.value = "";
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
