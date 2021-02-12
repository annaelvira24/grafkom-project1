function getMousePosition(canvas, event) { 
    let temp = [];
    let rect = canvas.getBoundingClientRect(); 
    let x = ((event.clientX - rect.left)/(canvas.width))*2-1; 
    let y = -((event.clientY - rect.top)/(canvas.height))*2+1; 
    console.log("Coordinate x: " + x,  
                "Coordinate y: " + y);
    temp.push(x);
    temp.push(y)
    return(temp);
} 

function defineSquare(vec){
    
}
// Create an empty buffer object
var vertex_buffer = gl.createBuffer();

function setUpBuffer(){
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*======= Associating shaders to buffer objects ======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    for (var i = 0; i<objects.length; i++) {
        console.log(objects[i]);
        gl.drawArrays(objects[i].mode, objects[i].off, objects[i].count);
    }
}

var canvasElem = document.querySelector("#glcanvas"); 
var vec;
var vertexCount = 0;
var vecTemp = [];
setUpBuffer();

canvasElem.addEventListener('mousedown', (e) => 
{ 
    vec = getMousePosition(canvasElem, e);
    if(!cursorMode){
        vertices.push(vec[0]);
        vertices.push(vec[1]);
        if(lineMode == true){
            vertexCount += 1;
            if(vertexCount == 2){
                objects.push({
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

                objects.push({
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
            if(vertexCount == numVert){
                objects.push({
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
    console.log(vertices);

});



