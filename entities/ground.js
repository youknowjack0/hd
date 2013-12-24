HD.Ground = function() {
    var geom = new THREE.PlaneGeometry(10000,10000);

    var mat = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('assets/grass128.png')    
    });

    

    var mesh = new THREE.Mesh(geom, mat);

    mesh.overdraw = true;
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -50;
    this.object3d = mesh;
};

HD.Ground.prototype = {
    constructor: HD.Ground,

    object3d: null
};