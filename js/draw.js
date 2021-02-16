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
                colors.push(0,0,1,
                    0,0,1,
                    0,0,1,
                    0,0,1);

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
    console.log(vertices);

});

canvasElem.addEventListener('mousemove', (e) => {
    vec2 = getMousePosition(canvasElem, e);
    if(cursorMode && vec!=null){
        if(backupVertices == null) backupVertices = vertices;
        let deltaX = vec2[0] - vec[0]
        let deltaY = vec2[1] - vec[1]
        vertices = backupVertices.map((it,idx) => idx%2==0? it+deltaX : it+deltaY);
        draw()
    }
});

canvasElem.addEventListener('mouseup', (e) => {
    vec = null;
    backupVertices = null;
});

