
var area = document.getElementById('jsonText');
area.style.display = "none";

function saveData(){
    area.style.display = "block";
    area.innerHTML = "Copy this text to your json file\n\n" + JSON.stringify(lineVertices, undefined, 4);
}

function loadData(){
    if(area.style.display === "none"){
        area.innerHTML = "Copy your json file's content here."
        area.style.display = "block";
        return;
    }
    
    area.style.display = "none"
}
