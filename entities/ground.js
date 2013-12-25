HD.Ground = function() {
    var geom = new THREE.PlaneGeometry(100000,100000,100,100);

    var mat = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('assets/grass128.png')    
    });

    

    for (var i = 0; i < geom.vertices.length; i++) {
        geom.vertices[i].z = -Math.random() * 1000 - 50;
    }

    var mesh = new THREE.Mesh(geom, mat);

    mesh.receiveShadow = true;
    mesh.rotation.x = -Math.PI / 2;
    mesh.overdraw = true;
    
    this.object3d = mesh;
};

HD.Ground.prototype = {
    constructor: HD.Ground,

    object3d: null
};