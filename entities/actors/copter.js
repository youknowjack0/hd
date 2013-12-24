HD.Copter = function () {
    var group = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry(10, 10,40);

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
    

    var bladeG = new THREE.PlaneGeometry(100, 10);
    var bladeMat = new THREE.MeshBasicMaterial( {color: 0x000000});
    var blade = new THREE.Mesh(bladeG, bladeMat);
    blade.position = new THREE.Vector3(0, 12, 0);
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
        POWER: 20,
        GRAVITY: -9.81,
        UP: new THREE.Vector3(0, 1, 0),
        RESISTANCE: 0.995,
        RUDDER: 0.02, //radians/s/s
        RUDDERMAX: 4, //radians/s
        RUDDERRESISTANCE: 0.98,
        ROLLRESISTANCE: 0.98,
        PITCHRESISTANCE: 0.98,
        PITCH: 0.01, //radians/s/s
        PITCHMAX: 10, //radians/s
        ROLL: 0.01, //radians/s/s
        ROLLMAX: 10, //radians/s
        PROP: 10, //radians/s
        PROPPOWER: 30,
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
        this.applyAcceleration();

        this.updateRotationAcceleration(game);
        this.applyRotationChange(game);

        this.applyVelocity();

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
        camera.position.multiplyScalar(300);
        
        camera.position.add(this.object3d.position);
        //camera.position.z += 50;
        //camera.lookAt(this.object3d.position);
    },

    getBladeRotation: function(game) {
        return new THREE.Quaternion().setFromAxisAngle(this.object3d.up, (game.keys.w ? this.constants.PROPPOWER : this.constants.PROP)*game.delta);
    },

    updateAcceleration: function (game) {
        var gravity = this.constants.UP.clone().multiplyScalar(this.constants.GRAVITY * game.delta);
        this.acceleration = gravity;
        if (game.keys.w) {
            var power = this.getUpUnitVector().multiplyScalar(this.constants.POWER * game.delta);
            this.acceleration.add(power);            
        }
    },

    applyAcceleration: function() {
        this.velocity.add(this.acceleration);
    },

    applyVelocity: function() {
        this.velocity.multiplyScalar(this.constants.RESISTANCE);

        this.object3d.position.add(this.velocity);        
        
        if (this.object3d.position.y < 0) {
            this.object3d.position.y = 0;
            this.velocity.y = 0;
        }
    },

    updateRotationAcceleration: function(game) {


        if (game.mousePos) {
            this.pitch += this.getPitch(game);
            this.roll += this.getRoll(game);
        }

        
        this.rudder += this.getRudder(game);
        this.rudder *= this.constants.RUDDERRESISTANCE;
        this.roll *= this.constants.ROLLRESISTANCE;
        this.pitch *= this.constants.PITCHRESISTANCE;
    },

    getRoll: function (game) {
        var roll = 0;
        if (this.object3d.position.y > 1) {
            var xd = game.mousePos.x - game.renderer.windowHalfX;
            xd = xd / 100 * this.constants.ROLL;
            roll = -xd;
        }
        return roll;
    },

    getPitch: function(game) {
        var pitch = 0;
        if (this.object3d.position.y > 1) {
            var yd = game.mousePos.y - game.renderer.windowHalfY;
            yd = yd / 100 * this.constants.PITCH;
            pitch = yd;
        }
        return pitch;
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