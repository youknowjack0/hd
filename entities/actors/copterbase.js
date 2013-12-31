HD.CopterBase = function () {
    var group = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry(25, 25,70);

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }

    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );



    var copter = new THREE.Mesh(geometry, material);

    copter.position = new THREE.Vector3(0, 0, 0);
    copter.castShadow = true;
    copter.receiveShadow = true;

    //copter.quaternion = new THREE.Quaternion(0, 1, 0, 0);


    var bladeG = new THREE.PlaneGeometry(300, 12);
    var bladeMat = new THREE.MeshBasicMaterial( {color: 0x000000});
    var blade = new THREE.Mesh(bladeG, bladeMat);
    blade.position = new THREE.Vector3(0, 27, 0);
    blade.rotation.x = -Math.PI / 2 + 0.1;
    group.add(copter);
    group.add(blade);

    this.object3d = group;
    this.blade = blade;

    // adjust these constants to make it awesome
    this.constants = {
        POWERMAX: 60,
            POWERMIN: 0,//power at idle
            GRAVITY: -20.81,
            UP: new THREE.Vector3(0, 1, 0),
            RESISTANCE: 0.2,
            RUDDER: 0.02, //radians/s/s
            RUDDERMAX: 4, //radians/s
            RUDDERRESISTANCE: 0.5,
            ROLLRESISTANCE: 0.5,
            PITCHRESISTANCE: 0.5,
            PITCH: 0.005, //radians/s/s
            PITCHMAX: 0.008, //radians/s
            ROLL: 0.001, //radians/s/s
            ROLLMAX: 0.010, //radians/s
            PROP: 10, //radians/s
            PROPPOWER: 50,
            CAMOFFSET: new THREE.Vector3(100, 100, 100),
            XAXIS: new THREE.Vector3(1, 0, 0),
            YAXIS: new THREE.Vector3(0, 1, 0),
            ZAXIS: new THREE.Vector3(0, 0, 1)
    };

};

HD.CopterBase.prototype = {


    getBladeRotation: function(game) {
        return new THREE.Quaternion().setFromAxisAngle(this.object3d.up, this.constants.PROPPOWER*game.delta);
    },


    draw: function (game) {

        //spin the prop
        this.blade.quaternion = this.blade.quaternion.multiplyQuaternions(this.getBladeRotation(game), this.blade.quaternion);

    }

};