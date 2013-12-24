
HD.SceneLight = function () {
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.object3d = directionalLight;
    console.log("added light");
};

HD.SceneLight.prototype = {
    constructor: HD.SceneLight,

    object3d: null
};