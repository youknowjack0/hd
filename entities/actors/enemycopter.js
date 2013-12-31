HD.EnemyCopter = function () {
    HD.CopterBase.call(this);
};

HD.EnemyCopter.prototype = Object.create(HD.CopterBase.prototype);

HD.EnemyCopter.prototype.draw = function(game) {
    HD.CopterBase.prototype.draw.call(this,game);
    this.target.time += game.delta;

    var t = this.target.time / this.target.timetotal;

    //lerp position
    this.object3d.position = this.start.position.clone().lerp(this.target.position, t);
    if(t > 1)
        return;
    //lerp rotation
    this.object3d.quaternion = this.start.quaternion.clone().slerp(this.target.quaternion, t);
}

HD.EnemyCopter.prototype.update = function(message, game) {
    //this.target = message;
    this.target = {};
    this.start = {};
    this.target.timetotal = 0.70;
    this.target.time = 0.0;
    this.target.position = new THREE.Vector3(message.px, message.py, message.pz);
    this.start.position = this.object3d.position.clone();
    this.target.quaternion = new THREE.Quaternion(message.rx, message.ry,message.rz, message.rw);
    this.start.quaternion = this.object3d.quaternion.clone();
    /*
    this.object3d.position.x = message.px;
    this.object3d.position.y = message.py;
    this.object3d.position.z = message.pz;
    this.object3d.quaternion.x = message.rx;
    this.object3d.quaternion.y = message.ry;
    this.object3d.quaternion.z = message.rz;
    this.object3d.quaternion.w = message.rw;
    */
}