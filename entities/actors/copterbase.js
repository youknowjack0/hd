HD.CopterBase = function () {
    var group = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry(2, 2, 8);

    for (var i = 0; i < geometry.faces.length; i += 2) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex(hex);
        geometry.faces[ i + 1 ].color.setHex(hex);
    }

    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

    var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });


    var copter = new THREE.Mesh(geometry, material);

    copter.position = new THREE.Vector3(0, 0, 0);
    copter.receiveShadow = true;
    copter.castShadow = true;

    //copter.quaternion = new THREE.Quaternion(0, 1, 0, 0);


    var bladeG = new THREE.PlaneGeometry(30, 1.5);
    var bladeMat = new THREE.MeshBasicMaterial({color: 0x000000});
    var blade = new THREE.Mesh(bladeG, bladeMat);
    blade.position = new THREE.Vector3(0, 3, 0);
    blade.rotation.x = -Math.PI / 2 + 0.1;
    group.add(copter);
    group.add(blade);

    blade.castShadow = true;

    this.object3d = group;
    this.blade = blade;

    // adjust these constants to make it awesome
    this.constants = {
        POWERMAX: 20,
        POWERMIN: 0,//power at idle
        GRAVITY: -9.81,
        UP: new THREE.Vector3(0, 1, 0),
        RESISTANCE: 0.00000505,
        RUDDER: 0.015, //radians/s/s
        RUDDERMAX: 4, //radians/s
        RUDDERRESISTANCE: 0.5,
        ROLLRESISTANCE: 0,
        PITCHRESISTANCE: 0,
        PITCH: 0.002, //radians/s/s
        PITCHMAX: 0.02, //radians/s
        ROLL: 0.002, //radians/s/s
        ROLLMAX: 0.02, //radians/s
        PROP: Math.PI / 32, //radians/s
        PROPPOWER: Math.PI / 8 + 0.005,
        CAMOFFSET: new THREE.Vector3(100, 100, 100),
        XAXIS: new THREE.Vector3(1, 0, 0),
        YAXIS: new THREE.Vector3(0, 1, 0),
        ZAXIS: new THREE.Vector3(0, 0, 1)
    };

};

HD.CopterBase.prototype = {


    getBladeRotation: function (game) {
        return new THREE.Quaternion().setFromAxisAngle(this.object3d.up, this.constants.PROPPOWER);
    },


    draw: function (game) {

        //spin the prop
        this.blade.quaternion = this.blade.quaternion.multiplyQuaternions(this.getBladeRotation(game), this.blade.quaternion);

    }

};