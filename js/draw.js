function getMousePosition(canvas, event) { 
    let temp = [];
    let rect = canvas.getBoundingClientRect(); 
    let x = ((event.clientX - rect.left)/(canvas.width))*2-1; 
    let y = -((event.clientY - rect.top)/(canvas.height))*2+1; 
    temp.push(x);
    temp.push(y)
    return(temp);
} 

// Create an empty buffer object
var vertex_buffer = gl.createBuffer();
// Create an empty buffer object and store color data
var color_buffer = gl.createBuffer ();

function setUpBuffer(){
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

    /*======= Associating shaders to buffer objects ======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
         
    // get the attribute location
    var color = gl.getAttribLocation(shaderProgram, "color");

    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;

    // enable the color attribute
    gl.enableVertexAttribArray(color);

    gl.clearColor(0, 0, 0, 0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);
}

function draw(){
    gl.useProgram(shaderProgram);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    for (var i = 0; i<objects.length; i++) {
        gl.drawArrays(objects[i].mode, objects[i].off, objects[i].count);
    }
}

var canvasElem = document.querySelector("#glcanvas"); 
var vec, selectedVertex, selectedObject;
var vertexCount = 0;
var vecTemp = [];
var backupVertices;
setUpBuffer();

canvasElem.addEventListener('mousedown', (e) => 
{ 
    vec = getMousePosition(canvasElem, e);
    if(resizeMode || cursorMode || colorMode){
        selectedVertex = -1;
        selectedObject = -1;
        for(var i = 0; i < vertices.length; i+=2){
            if(((vertices[i]).toFixed(1) == (vec[0]).toFixed(1)) 
            && ((vertices[i+1]).toFixed(1) == (vec[1]).toFixed(1))){
                selectedVertex = i;
                break;
            }
        }
        if(selectedVertex != -1){
            console.log(selectedVertex);
            console.log(objects);
            for(var i = objects.length-1; i >= 0; i--){
                if(objects[i].off*2 <= selectedVertex){
                    selectedObject = i;
                    break;
                }
                selectedObject = 0;
            }
    
        }
        if(colorMode && objects[selectedObject].name == "polygon"){
            var tempColor = prompt("Red, Green, Blue value (0-255) separated with coma , :", "0,0,0");
            var colorChange = tempColor.split(",");
            console.log(objects[selectedObject].off);
            for (var i = 0; i< objects[selectedObject].count*3; i+=3) {          
                colors[objects[selectedObject].off*3+i] = Number(colorChange[0]);
                colors[objects[selectedObject].off*3+i+1] = Number(colorChange[1]);
                colors[objects[selectedObject].off*3+i+2] = Number(colorChange[2]);
            }
            vec = null;
        }
        draw();
        backupVertices = vertices.slice();
    }
    else {
        vertices.push(vec[0]);
        vertices.push(vec[1]);
        if(lineMode == true){
            vertexCount += 1;
            if(vertexCount == 2){
                colors.push(1,0,0,
                    0,0,1);
                objects.push({
                    "name" : "line",
                    "mode" : gl.LINES,
                    "off" : offset,
                    "count" : 2
                });
                offset += 2;
                vertexCount = 0;
            }
        }
        else if(squareMode == true){
            vecTemp.push(vec);
            vertexCount += 1;
            if(vertexCount == 2){
                let deltaX = (vecTemp[1][0] - vecTemp[0][0]) * (100/48);
                let deltaY = (vecTemp[1][1] - vecTemp[0][1]) * 0.48;
                vertices.push(vecTemp[0][0] - deltaY);
                vertices.push(vecTemp[0][1] + deltaX);
                vertices.push(vecTemp[1][0] - deltaY);
                vertices.push(vecTemp[1][1] + deltaX);
                colors.push(0.290, 0.223, 0.937,
                    1, 0.301, 0.458,
                    0.290, 0.223, 0.937,
                    1, 0.301, 0.458);

                objects.push({
                    "name" : "square",
                    "mode" : gl.TRIANGLE_STRIP,
                    "off" : offset,
                    "count" : 4
                });
                offset += 4;
                vertexCount = 0;
                vecTemp = [];
            }
        }

        else if(polygonMode == true){
            vertexCount += 1;
            colors.push(0,0,1);
            if(vertexCount == numVert){
                objects.push({
                    "name" : "polygon",
                    "mode" : gl.TRIANGLE_FAN,
                    "off" : offset,
                    "count" : numVert
                });
                offset += numVert;
                vertexCount = 0;
            }
        }
        draw();
    }
});

canvasElem.addEventListener('mousemove', (e) => {
    if(vec!=null){
        vec2 = getMousePosition(canvasElem, e);
        if(cursorMode){
            let deltaX = vec2[0] - vec[0];
            let deltaY = vec2[1] - vec[1];
            if(selectedObject == -1){
                vertices = backupVertices.map((it,idx) => idx%2==0? it+deltaX : it+deltaY);
            }
            else {
                for(var i = objects[selectedObject].off*2; i < objects[selectedObject].off*2 + objects[selectedObject].count*2; i+=2){
                    vertices[i] = backupVertices[i] + deltaX;
                    vertices[i+1] = backupVertices[i+1] + deltaY;
                }
            }
           
            draw();
        }
        else if(resizeMode && selectedObject != -1){
            if(objects[selectedObject].name == "line"){
                let centerX = (backupVertices[objects[selectedObject].off*2] + backupVertices[objects[selectedObject].off*2+2])/2;
                let centerY = (backupVertices[objects[selectedObject].off*2+1] + backupVertices[objects[selectedObject].off*2+3])/2;
                
                let scaleX = (Math.abs(vec2[0] - centerX))/(Math.abs(vec[0] - centerX));
                let scaleY = (Math.abs(vec2[1] - centerY))/(Math.abs(vec[1] - centerY));
                
                let a2 = Math.pow(vec[0]-centerX,2) + Math.pow(vec[1]-centerY,2);
                let b2 = Math.pow(vec2[0]-centerX,2) + Math.pow(vec2[1]-centerY,2);
                let c2 = Math.pow(vec[0]-vec2[0],2) + Math.pow(vec[1]-vec2[1],2);
                let cosArc = (a2+b2-c2)/(2*Math.sqrt(a2*b2));
                let sinArc = Math.sqrt(1-cosArc*cosArc);
                // cek arah vec2
                if((vec2[1]-centerY)/(vec[1]-centerY)<(vec2[0]-centerX)/(vec[0]-centerX)){
                    sinArc = -sinArc;
                }

                let normalizedX = cosArc*(vec2[0]-centerX)-sinArc*(vec2[1]-centerY);
                let normalizedY = sinArc*(vec2[0]-centerX)+cosArc*(vec2[1]-centerY);

                scaleX = Math.abs(normalizedX/(vec[0] - centerX));
                scaleY = Math.abs(normalizedY/(vec[1] - centerY));

                var tempVertices = [];
                for(var i = objects[selectedObject].off*2; i < objects[selectedObject].off*2 + objects[selectedObject].count*2; i++){
                    tempVertices.push(vertices[i]);
                }

                for(var i = 0; i<tempVertices.length; i+=2){
                    tempVertices[i] -= centerX;
                    tempVertices[i+1] -= centerY;
                }

                for(var i = 0; i<tempVertices.length; i+=2){
                    tempVertices[i] = (backupVertices[objects[selectedObject].off*2+i]-centerX)*scaleX;
                    tempVertices[i+1] =(backupVertices[objects[selectedObject].off*2+i+1]-centerY)*scaleY;
                }

                for(var i = 0; i<tempVertices.length; i+=2){
                    tempVertices[i] += centerX;
                    tempVertices[i+1] += centerY;
                }

                var j = 0;
                for(var i = objects[selectedObject].off*2; i < objects[selectedObject].off*2 + objects[selectedObject].count*2; i++){  
                    vertices[i] = tempVertices[j];
                    j++;
                }
            }
            else if(objects[selectedObject].name == "square"){
                let centerX = (backupVertices[objects[selectedObject].off*2] + backupVertices[objects[selectedObject].off*2+6])/2;
                let centerY = (backupVertices[objects[selectedObject].off*2+1] + backupVertices[objects[selectedObject].off*2+7])/2;

                let scaleX = (vec2[0] - centerX)/(vec[0] - centerX);
                let scaleY = (vec2[1] - centerY)/(vec[1] - centerY);

                let a2 = Math.pow(vec[0]-centerX,2) + Math.pow(vec[1]-centerY,2);
                let b2 = Math.pow(vec2[0]-centerX,2) + Math.pow(vec2[1]-centerY,2);
                let c2 = Math.pow(vec[0]-vec2[0],2) + Math.pow(vec[1]-vec2[1],2);
                let cosArc = (a2+b2-c2)/(2*Math.sqrt(a2*b2));
                let sinArc = Math.sqrt(1-cosArc*cosArc);
                // cek arah vec2
                if((vec2[1]-centerY)/(vec[1]-centerY)<(vec2[0]-centerX)/(vec[0]-centerX)){
                    sinArc = -sinArc;
                }
                if((selectedVertex-selectedObject)==0||(selectedVertex-selectedObject)==6){
                    console.log("woii")
                    sinArc = -sinArc;
                }

                let normalizedX = cosArc*(vec2[0]-centerX)-sinArc*(vec2[1]-centerY);
                let normalizedY = sinArc*(vec2[0]-centerX)+cosArc*(vec2[1]-centerY);

                scaleX = Math.abs(normalizedX/(vec[0] - centerX));
                scaleY = Math.abs(normalizedY/(vec[1] - centerY));

                var tempVertices = [];
                for(var i = objects[selectedObject].off*2; i < objects[selectedObject].off*2 + objects[selectedObject].count*2; i+=2){
                    if((i-selectedObject)%2 == 0){
                        tempVertices.push((backupVertices[i]-centerX)*scaleX+centerX);
                        tempVertices.push((backupVertices[i+1]-centerY)*scaleY+centerY);
                    }else{
                        tempVertices.push((backupVertices[i]-centerX)*scaleY+centerX);
                        tempVertices.push((backupVertices[i+1]-centerY)*scaleX+centerY);
                    }
                }

                var j = 0;
                for(var i = objects[selectedObject].off*2; i < objects[selectedObject].off*2 + objects[selectedObject].count*2; i++){  
                    vertices[i] = tempVertices[j];
                    j++;
                }

            }
            draw();
        }
    }
    
});

canvasElem.addEventListener('mouseup', (e) => {
    vec = null;
    backupVertices = null;
});

