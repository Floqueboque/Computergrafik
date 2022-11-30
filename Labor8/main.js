const mat4 = glMatrix.mat4;
let cubeRotation = 0.0;

let canvas = document.getElementById("myCanvas3D");
let gl = canvas.getContext("webgl2");

let uProjectionMatrix;
let uModelViewMatrix;
let uSampler;

main();

function main(){
  if(!gl){
      alert("WebGL is not available");
      return;
  }
  gl.viewport(0,0, canvas.clientWidth, canvas.height);

  //vertex-shader
  let vertElem = document.getElementById("vertex-shader");
  vertShdr = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShdr, vertElem.text);
  gl.compileShader(vertShdr);

  //fragment-shader
  let fragElem = document.getElementById("fragment-shader");
  fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShdr, fragElem.text);
  gl.compileShader(fragShdr);

  //Programm-Objekt
  let program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);


  // add this for extra debugging
  if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
      var info = gl.getProgramInfoLog(program);
      throw new Error('Could not compile WebGL program. \n\n' + info);
  }

  uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
  uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
  uSampler = gl.getUniformLocation(program, 'uTexture');
  

  let then = 0;

  let positionBuffer = initPositionBuffer();
  let colorBuffer = initColorBuffer();
  let indicesBuffer = initIndicesBuffer();
  let textureBuffer = initTextureBuffer();
  let backgroundCanvasBuffer = initBackgroundCanvasBuffer();
  let backgroundCanvasTextureBuffer = initBackgroundCanvasTextureBuffer();

  let texture = loadTexture();
  let background = loadBackground();

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundCanvasBuffer);
  let vPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  let vColorPosition = gl.getAttribLocation( program, "aVertexColor" );
  gl.vertexAttribPointer( vColorPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColorPosition );

  //Background
  // gl.activeTexture(gl.TEXTURE1);
  // gl.bindTexture(gl.TEXTURE_2D, background);
  // gl.uniform1i(uSampler, 1);

  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;
    draw(positionBuffer, colorBuffer, indicesBuffer, textureBuffer, texture, background, backgroundCanvasBuffer, backgroundCanvasTextureBuffer, program, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function initPositionBuffer(){
  const positions = [
      // Front face
      -0.5, -0.5,  0.5,
      0.5, -0.5,  0.5,
      0.5,  0.5,  0.5,
      -0.5,  0.5,  0.5,
    
      // Back face
      -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,
      0.5,  0.5, -0.5,
      0.5, -0.5, -0.5,
    
      // Top face
      -0.5,  0.5, -0.5,
      -0.5,  0.5,  0.5,
      0.5,  0.5,  0.5,
      0.5,  0.5, -0.5,
    
      // Bottom face
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5,
    
      // Right face
      0.5, -0.5, -0.5,
      0.5,  0.5, -0.5,
      0.5,  0.5,  0.5,
      0.5, -0.5,  0.5,
    
      // Left face
      -0.5, -0.5, -0.5,
      -0.5, -0.5,  0.5,
      -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5,
    ];

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}

function initColorBuffer(){
  const faceColors = [
      [0.0,  0.0,  0.0,  1.0],    // Front face: black
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
      ];

  // Convert the array of colors into a table for all the vertices.
  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
  }

  //Color buffer
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

function initIndicesBuffer(){
  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
    const indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];

  // Now send the element array to GL
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return indexBuffer;
}

function initTextureBuffer(){
  const textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  return textureBuffer;
}

function initBackgroundCanvasBuffer(){
  let verticesCanvas = new Float32Array( [
    -1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0,
    1.0, -1.0 ] );
  let backgroundBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCanvas), gl.STATIC_DRAW);
  return backgroundBuffer;
}

function initBackgroundCanvasTextureBuffer(){
  let textureCoordinatesCanvas = new Float32Array([
    // 2 Dreiecke für Canvas
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0 ]);
  let backgroundTextureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundTextureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinatesCanvas), gl.STATIC_DRAW);
  return backgroundTextureBuffer;
}

function loadBackground(){
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = './background.jpg';
  return texture;
}

function loadTexture(){
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = './WM_BrickWork-50_1024.png';
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function draw(positionBuffer, colorBuffer, indicesBuffer, textureBuffer, texture, background, backgroundCanvasBuffer, backgroundCanvasTextureBuffer, program, deltaTime){
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear( gl.COLOR_BUFFER_BIT );
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();
  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (Y)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0]
  ); // axis to rotate around (X)

  //Get positions from vertices from positionBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let vPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  //Binding of Index to the current Vertex Buffer
  gl.enableVertexAttribArray( vPosition );

  //Get color from colorBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  let vColorPosition = gl.getAttribLocation( program, "aVertexColor" );
  gl.vertexAttribPointer( vColorPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColorPosition );

  //Get texture from textureBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  let vTextureCoord = gl.getAttribLocation( program, "aTextureCoord" );
  gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTextureCoord );

  // Texture of cube
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(uSampler, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

  gl.uniformMatrix4fv(
    uProjectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    uModelViewMatrix,
    false,
    modelViewMatrix
  );
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  cubeRotation += deltaTime;
}