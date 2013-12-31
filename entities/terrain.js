HD.Terrain = function (game) {

    var FLOOR = -320000;
    var planeMesh;
    var tex = THREE.ImageUtils.loadTexture('assets/grass128.png');

    var plane = new THREE.PlaneGeometry(100, 100, 127, 127);

    tex.repeat.x = 100;
    tex.repeat.y = 100;

    tex.wrapS = true;
    tex.wrapT = true;

    var mat = new THREE.MeshPhongMaterial({
        map: tex,
        ambient: 0x050505, specular: 0x555555, shininess: 15,
        //bumpMap: tex, bumpScale: 1900,
        color: 0xFFFFFF,
        vertexColors: THREE.VertexColors
    })

    var me = this;

    var img = THREE.ImageUtils.loadTexture('assets/heightmap_128.jpg',null, function() {
        var data = getHeightData(img);
        for (var i = 0, l = plane.vertices.length; i < l; i++) {
            plane.vertices[i].z = data[i];
        }
        planeMesh = addMesh(plane, 16000, 0, FLOOR, 0, -1.57, 0, 0, mat);

        plane.computeFaceNormals();
        plane.computeVertexNormals();

        me.object3d = planeMesh;

        game.addEntity(me);
    });


};

HD.Terrain.prototype = {
    constructor: HD.Terrain,
    object3d: null
};


function addMesh(geometry, scale, x, y, z, rx, ry, rz, material) {

    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.rotation.x = rx;
    mesh.rotation.y = ry;
    mesh.rotation.z = rz;
    mesh.overdraw = true;
    mesh.doubleSided = false;
    mesh.updateMatrix();

    return mesh;
};

function getHeightData(img) {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext('2d');

    var size = 128 * 128, data = new Float32Array(size);

    context.drawImage(img.image, 0, 0);

    for (var i = 0; i < size; i++) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, 128, 128);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i] + pix[i + 1] + pix[i + 2];
        data[j++] = all / 30;
    }

    return data;
};
	

			



