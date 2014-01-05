
HD.AmbientLight = function () {
    var light = new THREE.AmbientLight(0xffffff);
    this.object3d = light;
};

HD.AmbientLight.prototype = {
    constructor: HD.AmbientLight,

    object3d: null
};