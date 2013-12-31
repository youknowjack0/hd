
HD.SceneLight = function (game) {
    var dl = new THREE.DirectionalLight(0xffffff);
    dl.offsetA =  new THREE.Vector3(1, 1, 1).normalize();
    this.object3d = dl;

    dl.castShadow = true;
    //dl.shadowCameraVisible = true;
    dl.shadowCameraNear = 0;
    dl.shadowCameraFar = 50000;
    dl.shadowCameraLeft = -100;
    dl.shadowCameraRight = 100;
    dl.shadowCameraBottom = -100;
    dl.shadowCameraTop = 100;

    game.directionalLight = dl;


};

HD.SceneLight.prototype = {
    constructor: HD.SceneLight,

    object3d: null
};