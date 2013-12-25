HD.Ground = function () {

    var s = 128;
    var r = 10000;
    var geom = new THREE.PlaneGeometry(s * r, s * r, 10, 10);

    var tex = THREE.ImageUtils.loadTexture('assets/grass128.png');

    tex.repeat.x = r / 100;
    tex.repeat.y = r / 100;

    tex.wrapS = true;
    tex.wrapT = true;

    var mat = new THREE.MeshPhongMaterial({
        map: tex,
        ambient: 0x050505,  specular: 0x555555, shininess: 30 ,
        vertexColors: THREE.FaceColors,
    });

    var i;

    for (i = 0; i < geom.vertices.length; i++) {
        geom.vertices[i].z = -Math.random() * 100000 - 50;
    }

    geom.computeFaceNormals();
    geom.computeVertexNormals();
    



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