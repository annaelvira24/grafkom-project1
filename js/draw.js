function getMousePosition(canvas, event) { 
    let temp = [];
    let rect = canvas.getBoundingClientRect(); 
    // let x = (event.clientX - rect.left);
    console.log(canvas.width);
    // let y = (event.clientY - rect.top); 
    let x = ((event.clientX - rect.left)/(canvas.width))*2-1; 
    let y = -((event.clientY - rect.top)/(canvas.height))*2+1; 
    console.log("Coordinate x: " + x,  
                "Coordinate y: " + y);
    temp.push(x);
    temp.push(y)
    return(temp);
} 

function setUpBuffer(gl, shaderProgram, lineVertices){
    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);

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

function drawLine(gl, shaderProgram, lineVertices){
    setUpBuffer(gl, shaderProgram, lineVertices);
    gl.drawArrays(gl.LINES, 0, (lineVertices.length)/2);
}

var canvasElem = document.querySelector("canvas"); 
var vec;

canvasElem.addEventListener('mousedown', (e) => 
{ 
    vec = getMousePosition(canvasElem, e);
    if(lineMode == true){
        lineVertices.push(vec[0]);
        lineVertices.push(vec[1]);
        console.log(lineVertices);
        drawLine(gl, shaderProgram, lineVertices);
    }
});



