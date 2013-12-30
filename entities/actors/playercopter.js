HD.PlayerCopter = function() {

    HD.CopterBase.call(this);
};

HD.PlayerCopter.prototype = Object.create(HD.CopterBase.prototype);

HD.PlayerCopter.prototype.velocity = new THREE.Vector3(0, 0, 0);
HD.PlayerCopter.prototype.acceleration = new THREE.Vector3(0, 0, 0);

//rotation acceleration
HD.PlayerCopter.prototype.rudder = 0;
HD.PlayerCopter.prototype.pitch = 0;
HD.PlayerCopter.prototype.roll = 0;

//local up
HD.PlayerCopter.prototype.getUpUnitVector = function () {
    return this.constants.UP.clone().applyQuaternion(this.object3d.quaternion).normalize();
};

HD.PlayerCopter.prototype.positionCamera = function (game) {
    var camera = game.camera;

    /* this puts the camera behind the copter and locks it to the copter's orientation */
    var q = this.object3d.quaternion;
    camera.quaternion = q.clone();//.inverse();


    camera.position = new THREE.Vector3(0, 0, 1);
    camera.position.applyQuaternion(q);
    camera.position.multiplyScalar(300);

    camera.position.add(this.object3d.position);
    camera.position.add(this.getUpUnitVector().multiplyScalar(100));
};

HD.PlayerCopter.prototype.getBladeRotation = function(game) {
    return new THREE.Quaternion().setFromAxisAngle(this.object3d.up, (game.keys.w ? this.constants.PROPPOWER : this.constants.PROP)*game.delta);
};

HD.PlayerCopter.prototype.updateAcceleration = function (game) {
    var gravity = this.constants.UP.clone().multiplyScalar(this.constants.GRAVITY);
    this.acceleration = gravity;
    var power = this.getUpUnitVector().multiplyScalar((game.keys.w ? this.constants.POWERMAX : this.constants.POWERMIN));
    this.acceleration.add(power);
};

HD.PlayerCopter.prototype.applyAcceleration = function(game) {
    this.velocity.add(this.acceleration);
};

HD.PlayerCopter.prototype.applyVelocity = function(game) {
    this.velocity.multiplyScalar(1 - this.constants.RESISTANCE * game.delta);

    this.object3d.position.add(this.velocity.clone().multiplyScalar(game.delta));

};

HD.PlayerCopter.prototype.updateRotationAcceleration = function(game) {


    if (game.mousePos) {
        this.pitch += this.getPitch(game);
        this.roll += this.getRoll(game);
    }


    this.rudder += this.getRudder(game);
    this.rudder *= 1 - game.delta* this.constants.RUDDERRESISTANCE;
};

HD.PlayerCopter.prototype.limit = function(val, lower, upper) {
    return val > lower ? ((val < upper) ? val : upper) : lower;
};

HD.PlayerCopter.prototype.getRoll = function (game) {
    var xd = game.mousePos.x - game.renderer.windowHalfX;
    xd = - xd * this.constants.ROLL;
    xd = xd - this.roll;
    return this.limit(xd, - this.constants.ROLLMAX, this.constants.ROLLMAX);
};

HD.PlayerCopter.prototype.getPitch = function(game) {
    var xd = game.mousePos.y - game.renderer.windowHalfY;
    xd = xd * this.constants.PITCH;
    xd = xd - this.pitch;
    return this.limit(xd, -this.constants.PITCHMAX, this.constants.PITCHMAX);
};

HD.PlayerCopter.prototype.getRudder = function (game) {
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
};

HD.PlayerCopter.prototype.applyRotationChange = function (game) {
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
};

HD.PlayerCopter.prototype.draw = function(game) {

    HD.CopterBase.prototype.draw.call(this,game);

    this.updateAcceleration(game);
    this.applyAcceleration(game);

    this.updateRotationAcceleration(game);
    this.applyRotationChange(game);

    this.applyVelocity(game);

    this.positionCamera(game);

};
