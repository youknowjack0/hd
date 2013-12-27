HD.Copter = function () {
    var group = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry(2, 2,10);

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
    console.log(copter.quaternion);
    

    var bladeG = new THREE.PlaneGeometry(30, 0.5);
    var bladeMat = new THREE.MeshBasicMaterial( {color: 0x000000});
    var blade = new THREE.Mesh(bladeG, bladeMat);
    blade.position = new THREE.Vector3(0, 3, 0);
    blade.rotation.x = -Math.PI / 2 + 0.5;
    group.add(copter);
    group.add(blade);

    this.object3d = group;
    this.blade = blade;
};

HD.Copter.prototype = {
    constructor: HD.Copter,

    // adjust these constants to make it awesome
    constants: {
        POWERMAX: 30,
        POWERMIN: 0,//power at idle
        GRAVITY: -20.81,
        UP: new THREE.Vector3(0, 1, 0),
        RESISTANCE: 0.2,
        RUDDER: 0.02, //radians/s/s
        RUDDERMAX: 4, //radians/s
        RUDDERRESISTANCE: 0.5,
        ROLLRESISTANCE: 0.5,
        PITCHRESISTANCE: 0.5,
        PITCH: 0.002, //radians/s/s
        PITCHMAX: 0.010, //radians/s
        ROLL: 0.001, //radians/s/s
        ROLLMAX: 0.010, //radians/s
        PROP: 10, //radians/s
        PROPPOWER: 50,
        CAMOFFSET: new THREE.Vector3(100, 100, 100),
        XAXIS: new THREE.Vector3(1, 0, 0),
        YAXIS: new THREE.Vector3(0, 1, 0),
        ZAXIS: new THREE.Vector3(0, 0, 1),
    },

    blade: null,

    object3d: null,


    //orientation: new THREE.Quaternion(0, 1, 0, 0),

    velocity: new THREE.Vector3(0, 0, 0),

    acceleration: new THREE.Vector3(0, 0, 0),
    
    //rotation acceleration
    rudder: 0,
    pitch: 0,
    roll: 0,

    draw: function (game) {
        

        this.updateAcceleration(game);
        this.applyAcceleration(game);

        this.updateRotationAcceleration(game);
        this.applyRotationChange(game);

        this.applyVelocity(game);

        //spin the prop
        this.blade.quaternion = this.blade.quaternion.multiplyQuaternions(this.getBladeRotation(game), this.blade.quaternion);

        this.positionCamera(game);
        
    },

    //local up
    getUpUnitVector: function () {
        return this.constants.UP.clone().applyQuaternion(this.object3d.quaternion).normalize();
    },

    positionCamera: function (game) {
        var camera = game.camera;
        
        var q = this.object3d.quaternion;
        camera.quaternion = q.clone();//.inverse();
        

        camera.position = new THREE.Vector3(0, 0, 1);
        camera.position.applyQuaternion(q);
        camera.position.multiplyScalar(30);
        
        camera.position.add(this.object3d.position);
        camera.position.add(this.getUpUnitVector().multiplyScalar(20));
        //camera.position.z += 50;
        //camera.lookAt(this.object3d.position);
    },

    getBladeRotation: function(game) {
        return new THREE.Quaternion().setFromAxisAngle(this.object3d.up, (game.keys.w ? this.constants.PROPPOWER : this.constants.PROP)*game.delta);
    },

    updateAcceleration: function (game) {
        var gravity = this.constants.UP.clone().multiplyScalar(this.constants.GRAVITY);
        this.acceleration = gravity;
        var power = this.getUpUnitVector().multiplyScalar((game.keys.w ? this.constants.POWERMAX : this.constants.POWERMIN));
        this.acceleration.add(power);            
    },

    applyAcceleration: function(game) {
        this.velocity.add(this.acceleration);
    },

    applyVelocity: function(game) {
        this.velocity.multiplyScalar(1 - this.constants.RESISTANCE * game.delta);

        this.object3d.position.add(this.velocity.clone().multiplyScalar(game.delta));        
        
    },

    updateRotationAcceleration: function(game) {


        if (game.mousePos) {
            this.pitch += this.getPitch(game);
            this.roll += this.getRoll(game);
        }

        
        this.rudder += this.getRudder(game);
        /*this.rudder *= 1 - game.delta* this.constants.RUDDERRESISTANCE;
        this.roll *= 1 - game.delta * this.constants.ROLLRESISTANCE;
        this.pitch *= 1 - game.delta * this.constants.PITCHRESISTANCE;*/
    },

    limit: function(val, lower, upper) {
        return val > lower ? ((val < upper) ? val : upper) : lower;
    },

    getRoll: function (game) {
        var xd = game.mousePos.x - game.renderer.windowHalfX;
        xd = - xd * this.constants.ROLL;
        xd = xd - this.roll;
        return this.limit(xd, - this.constants.ROLLMAX, this.constants.ROLLMAX);


    },

    getPitch: function(game) {
        var xd = game.mousePos.y - game.renderer.windowHalfY;
        xd = xd * this.constants.PITCH;
        xd = xd - this.pitch;
        return this.limit(xd, -this.constants.PITCHMAX, this.constants.PITCHMAX);
    },

    getRudder: function (game) {
        var rudder = 0;
        if (game.keys.a === true) {
            rudder += this.constants.RUDDER;
            if (rudder > this.constants.RUDDERMAX)
                rudder = this.constants.RUDDERMAX;
        }
        if (game.keys.d === true) {
            rudder -= this.constants.RUDDER;
            if (rudder < -this.constants.RUDDERMAX)
                rudder = -this.constants.RUDDERMAX;
        }
        return rudder;
    },

    applyRotationChange: function (game) {
        var current = this.object3d.quaternion;
        var up = this.getUpUnitVector();
        var rollv = this.constants.ZAXIS.clone().applyQuaternion(this.object3d.quaternion).normalize();
        var pitchv = this.constants.XAXIS.clone().applyQuaternion(this.object3d.quaternion).normalize();
        var rudder = new THREE.Quaternion().setFromAxisAngle(up, this.rudder * game.delta);
        var roll = new THREE.Quaternion().setFromAxisAngle(rollv, this.roll * game.delta);
        var pitch = new THREE.Quaternion().setFromAxisAngle(pitchv, this.pitch * game.delta);
        current.multiplyQuaternions(rudder, current);
        current.multiplyQuaternions(roll, current);
        current.multiplyQuaternions(pitch, current);
    },
};