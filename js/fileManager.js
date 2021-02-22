
var area = document.getElementById('jsonText');
let fileInput = document.createElement('input');
fileInput.type="file";
area.style.display = "none";

function saveData(){
    decodedData = decodingData(objects, vertices, colors)
    beautifulData = JSON.stringify(decodedData, undefined, 4);
    
    var r = confirm("Press OK to download JSON file or Cancel to open in this window");
    if (r == true) {
        downloadData(beautifulData);
    } else {
        area.style.display = "block";
        area.value = beautifulData;
    }
}

function loadData(){
    if(area.style.display === "block"){
        let r = confirm("Press OK to load from local file or Cancel to load from browser editor");
        if (r == true) {
            putData(area.value);
            area.style.display = "none";
            return;
        }
    }
    fileInput.click();
}
function putData(fileContent){
    try{
        encodedData = encodingData(fileContent);
    }catch(err){
        console.log(err);
        alert("Please check your JSON text");
    }

    objects = encodedData.obj;
    vertices = encodedData.ver;
    colors = encodedData.col;
    area.style.display = "none";
    draw();
}

fileInput.addEventListener('change', function() { 
    var fr=new FileReader(); 
    fr.onload=function(){ 
        putData(fr.result);
    } 
    fr.readAsText(this.files[0]); 
}) 

function downloadData(exportObj){
    var filename = prompt("Please enter JSON filename", "vertexData");
    if (filename == null) {
        filename = "vertexData";
    }

    var a = document.createElement("a");
    var file = new Blob([exportObj], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = filename + ".json";
    a.click();
}

function encodingData(jsonString){
    listObject = JSON.parse(jsonString);
    result = {
        obj : [],
        ver : [],
        col : []
    }
    
    offset = 0;

    for (var i = 0; i<listObject.length; i++) {
        mode = listObject[i].name;
        listVertex = listObject[i].vertices;
        if(mode == "line") {
            result.obj.push({
                "name" : "line",
                "mode" : gl.LINES,
                "off" : offset,
                "count" : listVertex.length
            });
        }
        if(mode == "square") {
            result.obj.push({
                "name" : "square",
                "mode" : gl.TRIANGLE_STRIP,
                "off" : offset,
                "count" : listVertex.length
            });
        }
        if(mode == "polygon") {
            result.obj.push({
                "name" : "polygon",
                "mode" : gl.TRIANGLE_FAN,
                "off" : offset,
                "count" : listVertex.length
            });
        }
        offset += listVertex.length;
        for(var j = 0; j < listVertex.length; j++){
            result.ver.push(listVertex[j].xAxis);
            result.ver.push(listVertex[j].yAxis);
            result.col.push(
                listVertex[j].color.r,
                listVertex[j].color.g,
                listVertex[j].color.b
            );
        }
    }
    return result;
}

function decodingData(listObject, listVertex, listColor){
    result = [];
    
    for (var i = 0; i<listObject.length; i++) {
        var object = {"name" : listObject[i].name, vertices : []}

        var offset = listObject[i].off;
        var count = listObject[i].count;
        for(var j = offset * 2; j < (offset + count) * 2; j += 2){
            object.vertices.push({
                xAxis : listVertex[j],
                yAxis : listVertex[j+1],
                color :  {
                    r : listColor[j/2*3],
                    g : listColor[j/2*3+1],
                    b : listColor[j/2*3+2],
                }
            });
        }
        result.push(object);
    }
    return result;
}