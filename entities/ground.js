HD.Ground = function () {

    var depth = 10000;
    var s = 128;
    var r = 10000;
    var geom = new THREE.PlaneGeometry(s * r, s * r, 10, 10);
    
    var tex = THREE.ImageUtils.loadTexture('assets/grass128.png');

    tex.repeat.x = r / 100;
    tex.repeat.y = r / 100;

    tex.wrapS = true;
    tex.wrapT = true;
    
    for (i = 0; i < geom.vertices.length; i++) {
        geom.vertices[i].z = -Math.random() * depth;
    }

    var depth2color = function(d) {
        var bytex =  0xff -Math.round((d) * -1 / depth * 0xFF);
        var res = bytex + bytex * 0x100 + bytex * 0x10000;
        return new THREE.Color(res);
    }

    for (i = 0; i < geom.faces.length; i++) {
        var face = geom.faces[i];
        face.vertexColors[0] = depth2color(geom.vertices[face.a].z);
        face.vertexColors[1] = depth2color(geom.vertices[face.b].z);
        face.vertexColors[2] = depth2color(geom.vertices[face.c].z);
    }


    var mat = new THREE.MeshPhongMaterial({
        map: tex,
        ambient: 0x050505,  specular: 0x555555, shininess: 30 ,
        //bumpMap: tex, bumpScale: 1900,
        color: 0xFFFFFF,
        vertexColors: THREE.VertexColors,
    });

    var i;

    
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