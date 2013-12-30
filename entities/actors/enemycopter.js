HD.EnemyCopter = function () {
    HD.CopterBase.call(this);
};

HD.EnemyCopter.prototype = Object.create(HD.CopterBase.prototype);

HD.EnemyCopter.prototype.update = function(message, game) {
    this.object3d.position.x = message.px;
    this.object3d.position.y = message.py;
    this.object3d.position.z = message.pz;
    this.object3d.quaternion.x = message.rx;
    this.object3d.quaternion.y = message.ry;
    this.object3d.quaternion.z = message.rz;
    this.object3d.quaternion.w = message.rw;
}