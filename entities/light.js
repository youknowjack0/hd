
HD.SceneLight = function () {
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.object3d = directionalLight;

    directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;

    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;

    directionalLight.shadowCameraNear = 200;
    directionalLight.shadowCameraFar = 1500;

    directionalLight.shadowCameraLeft = -500;
    directionalLight.shadowCameraRight = 500;
    directionalLight.shadowCameraTop = 500;
    directionalLight.shadowCameraBottom = -500;

    directionalLight.shadowBias = -0.005;
    directionalLight.shadowDarkness = 0.35;
    console.log("added light");
};

HD.SceneLight.prototype = {
    constructor: HD.SceneLight,

    object3d: null
};