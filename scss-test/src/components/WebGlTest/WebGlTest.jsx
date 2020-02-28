import React, {
    Component
} from 'react';
import './WebGlTest.scss';
import m4 from './m4.js';

export default class WebGlTest extends Component {

    gl = {};
    canvas = {};
    rivers = [];

    constructor(props) {
        super(props);
        this.state = {
            river: {},
            xOffset: 0.0,
            yOffset: 0.0,
            zOffset: 0.0,
        };
    }

    getVerticiesFromRiver(river) {
        if(!Array.isArray(river))
            return null;
        let retValue = [];
        let indices = [];
        let counter = 0;
        river.forEach((x) => {
            // console.log("River obj:", x);
            indices.push(counter++);
            let prevX = 0.0;
            let prevY = 0.0;
            x.forEach((y) => {
                let xv = y[0] - 20.;
                let yv = y[1] - 70.;
                xv /= 20;
                yv /= 20;
                if(prevX === 0.0){
                    prevX = xv;
                    prevY = yv;
                    return;
                }
                retValue.push(prevX);
                retValue.push(yv);
                retValue.push(0.0);

                retValue.push(xv);
                retValue.push(prevY);
                retValue.push(0.0);

                prevX = xv;
                prevY = yv;
            });
        });
        return indices, retValue;
    }

    radToDeg(r) {
        return r * 180 / Math.PI;
    }

    degToRad(d) {
        return d * Math.PI / 180;
    }

    drawTriangle2(){
        if (this.rivers.length == 0) {
            console.log("Not ready");
            return;
        } else {
            console.log("Ready");
        }


        let riverData = this.getVerticiesFromRiver(this.state.river);
        // let riverData = [];
        this.rivers.forEach((r) => {
            // console.log(r.geometry.coordinates);
            riverData = riverData.concat(this.getVerticiesFromRiver(r.geometry.coordinates));
        });
        let indices = [];
        for(let i = 0; i < riverData.length; i++){
            indices.push(i);
        }
        let vertices = riverData;

         // Create an empty buffer object
         var vertex_buffer = this.gl.createBuffer();

         // Bind appropriate array buffer to it
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);

         // Pass the vertex data to the buffer
         this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

         // Unbind the buffer
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

         /*=================== Shaders ====================*/

         // Vertex shader source code
         var vertCode =
             'attribute vec3 coordinates;' +
             'uniform mat4 u_matrix;'+
             'void main(void) {' +
             'gl_Position = vec4(coordinates, 1.0) * u_matrix;' +
             '}';

         // Create a vertex shader object
         var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);

         // Attach vertex shader source code
         this.gl.shaderSource(vertShader, vertCode);

         // Compile the vertex shader
         this.gl.compileShader(vertShader);

         // Fragment shader source code
         var fragCode =
            'void main(void) {' +
               'gl_FragColor = vec4(0.0, 0.0, 1.0, 0.2);' +
            '}';

         // Create fragment shader object
         var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

         // Attach fragment shader source code
         this.gl.shaderSource(fragShader, fragCode);

         // Compile the fragmentt shader
        this.gl.compileShader(fragShader);
        if (!this.gl.getShaderParameter(fragShader, this.gl.COMPILE_STATUS)) {
            console.error("Shader compilation failed");
            console.error("FragCode:", fragCode);
            console.error(this.gl.getShaderInfoLog(fragShader));
        }

         // Create a shader program object to store
         // the combined shader program
         var shaderProgram = this.gl.createProgram();

         // Attach a vertex shader
         this.gl.attachShader(shaderProgram, vertShader);

         // Attach a fragment shader
         this.gl.attachShader(shaderProgram, fragShader);

         // Link both the programs
         this.gl.linkProgram(shaderProgram);

         // Use the combined shader program object
         this.gl.useProgram(shaderProgram);

         /*======= Associating shaders to buffer objects ======*/

         // Bind vertex buffer object
         this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);

         // Get the attribute location
         var coord = this.gl.getAttribLocation(shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
         this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);

         // Enable the attribute
         this.gl.enableVertexAttribArray(coord);

         /*============ Drawing the trianthis.gle =============*/

         // Clear the canvas
         this.gl.clearColor(0.5, 0.5, 0.5, 0.9);

         // Enable the depth test
         this.gl.enable(this.gl.DEPTH_TEST);

         // Clear the color and depth buffer
         this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Set the view port
        // this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
        // Compute the projection matrix
        var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

        var numFs = 5;
        var radius = 2000;

        var cameraAngleRadians = this.degToRad(0);
        var fieldOfViewRadians = this.degToRad(10);
        var zNear = 1;
        var zFar = 2000;
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        // Compute the position of the first F
        var fPosition = [radius, 0, 0];

        // lookup uniforms
        var matrixLocation = this.gl.getUniformLocation(shaderProgram, "u_matrix");

        // Use matrix math to compute a position on a circle where
        // the camera is
        var cameraMatrix = m4.yRotation(cameraAngleRadians);
        cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

        // Get the camera's position from the matrix we computed
        var cameraPosition = [
            cameraMatrix[12] + this.state.xOffset,
            cameraMatrix[13] + this.state.yOffset,
            cameraMatrix[14] + this.state.zOffset,
        ];
        var up = [0, 1, 0];

        // Compute the camera's matrix using look at.
        var matrix = m4.lookAt(cameraPosition, fPosition, up);

        // Make a view matrix from the camera matrix
        var viewMatrix = m4.inverse(cameraMatrix);

        // Compute a view projection matrix
        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        // starting with the view projection matrix
        // compute a matrix for the F
        // var matrix = m4.translate(viewProjectionMatrix, 0.5, 0, 0.5);

        // Set the matrix.
        this.gl.uniformMatrix4fv(matrixLocation, false, matrix);


        // Draw the trianthis.gle
        this.gl.drawArrays(this.gl.LINES, 0, 71000);

         // POINTS, LINE_STRIP, LINE_LOOP, LINES,
         // TRIANTHIS.GLE_STRIP,TRIANTHIS.GLE_FAN, TRIANTHIS.GLES
    }

    componentDidMount() {
        this.canvas = document.querySelector("canvas");
        this.gl = this.canvas.getContext("experimental-webgl");

        let shapefile = require('shapefile');
        // console.log(shapefile);
        let river = [];
        console.time("Loading shapefile");
        shapefile.open("http://localhost:3000/NOR_wat/NOR_water_areas_dcw.shp")
            .then(source => source.read()
                .then(function log(result) {
                    if (result.done) return null;
                    // console.log(result.value);
                    river.push(result.value);
                    return source.read().then(log);
                })).then(() => {
                console.timeEnd("Loading shapefile");
                console.log(river);

                let elv = river[29].geometry.coordinates;
                this.rivers = river;
                console.log("Elv:", elv);
                console.table(elv);
                this.setState({
                    river: elv
                });

            })
            .catch(error => console.error(error.stack));
    }

    setX(){
        this.setState({xOffset: this.state.xOffset + 1});
    }
    setY(){
        this.setState({yOffset: this.state.yOffset + 1});
    }
    setZ(){
        this.setState({zOffset: this.state.zOffset + 1});
    }

    render() {
        this.drawTriangle2();
        // console.log("Verticies from river", this.getVerticiesFromRiver(this.state.river));
        return ( <div>
                   <div>
                     <button onClick={this.setX.bind(this)}>PushX</button>
                     <button onClick={this.setY.bind(this)}>PushY</button>
                     <button onClick={this.setZ.bind(this)}>PushZ</button>
                   </div>
                   <canvas width = "570"
                           height = "570"
                           id = "canvas" >
                   </canvas>
                 </div>
        );
    }
}
