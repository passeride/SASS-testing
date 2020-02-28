import React, { Component } from 'react';
import * as THREE from 'three';



export default class Three extends Component{
    gl = {};
    canvas = {};
    rivers = [];
    cavnas = {};
    scene = {};
    camera = {};
    renderer = {};
    setUpComplete = false;
    riverGeometry = {};
    offset = {
        t: 0,
        r: 0,
    };
    moveDampening = 0.01;

    constructor(props){
        super(props);
        this.buildGeometry = this.buildGeometry.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.renderThreeJS = this.renderThreeJS.bind(this);
    }

    buildGeometry(){
        console.log("Building Geometry");

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 0, 10 );
        this.camera.lookAt( 0, 0, 0 );


        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        let material = new THREE.LineBasicMaterial({ color : 0x8080ff });

        this.rivers.forEach((r) => {
            // console.log(r);
            r.geometry.coordinates.forEach((geometryList) => {
                let VectorArray = [];
                geometryList.forEach((geometry) => {
                    let xv = geometry[0] - 20;
                    let yv = geometry[1] - 70;
                    let vec = new THREE.Vector3(xv, yv, 0.0);
                    VectorArray.push(vec);
                });
                this.riverGeometry = new THREE.BufferGeometry().setFromPoints(VectorArray);

                var line = new THREE.Line( this.riverGeometry, material);

                this.scene.add(line);
            });
        });


        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.setUpComplete = true;
    }

    lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

    renderThreeJS(){
        requestAnimationFrame(this.renderThreeJS);

        if(!this.setUpComplete)
        return;
        // console.log("Rendering");

        // Update Camera
        let cameraPosition = this.camera.position;

        let cx = cameraPosition.x;
        let deltaCx = this.lerp(cx, this.offset.r, this.moveDampening);
        let cameraNewPositionX = deltaCx;

        cameraPosition.x = cameraNewPositionX;

        this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

        // this.camera.translateX(cameraNewPositionX);

        this.renderer.render(this.scene, this.camera);
    }

    moveUp(){
        this.camera.translateY( 1 );
        this.renderThreeJS();
    }

    moveDown(){
        this.camera.translateY( -1 );
        this.renderThreeJS();
    }

    moveLeft(){
        // this.camera.translateX( 1 );
        this.offset.r -= 1;
        this.renderThreeJS();
    }

    moveRight(){
        // this.camera.translateX( -1 );
        this.offset.r += 1;
        this.renderThreeJS();
    }

    zoomOut(){
        this.camera.translateZ( 1 );
        this.renderThreeJS();
    }

    zoomIn(){
        this.camera.translateZ( -1 );
        this.renderThreeJS();
    }

    componentDidMount(){
        this.loadShapeFile("http://localhost:3000/NOR_wat/NOR_water_areas_dcw.shp", this.buildGeometry.bind(this));
        requestAnimationFrame(this.renderThreeJS);
    }

    loadShapeFile(url, callback){
        let shapefile = require('shapefile');
        // console.log(shapefile);
        let river = [];
        console.time("Loading shapefile");
        shapefile.open(url)
            .then(source => source.read()
                  .then(function log(result) {
                      if (result.done) return null;
                      // console.log(result.value);
                      river.push(result.value);
                      return source.read().then(log);
                  })).then(() => {
                      console.timeEnd("Loading shapefile");

                      let elv = river[29].geometry.coordinates;
                      this.rivers = river;
                      this.setState({
                          river: elv
                      });
                      callback();
                  })
            .catch(error => console.error(error.stack));
    }

    render(){
        // this.renderThreeJS();
        return(
            <div>
              <div>
                <button onClick={this.moveUp}>Up</button>
                <button onClick={this.moveDown}>Down</button>
                <button onClick={this.moveRight}>Right</button>
                <button onClick={this.moveLeft}>Left</button>
                <button onClick={this.zoomIn}>Zoom</button>
                <button onClick={this.zoomOut}>UnZoom</button>
              </div>
              <canvas
                width="300px"
                height="300px"
                id="ThreeCanvas"
                ref={(elm) => this.canvas = elm}></canvas>
            </div>
        );
    }
}
