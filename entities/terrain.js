HD.Terrain = function (game) {

    var FLOOR = -12000;
    var planeMesh;
    var tex = THREE.ImageUtils.loadTexture('assets/dirt512.png');

    var width = 128;
    var height = 128;

    var plane = new THREE.PlaneGeometry(100, 100, width-1, height-1);

    tex.repeat.x = 500;
    tex.repeat.y = 500;

    tex.wrapS = true;
    tex.wrapT = true;

    var mat = new THREE.MeshPhongMaterial({
        map: tex,
        ambient: 0x224444, specular: 0x555555, shininess: 0,
        //bumpMap: tex, bumpScale: 1900,
        color: 0xFFFFFF,
        vertexColors: THREE.VertexColors
    })

    var me = this;

    var img = THREE.ImageUtils.loadTexture('assets/GrandCanyon128.png',null, function() {
        var data = getHeightData(img, width,height);
        for (var i = 0; i < plane.vertices.length; i++) {
            plane.vertices[i].z = data[i]*10;
        }
        planeMesh = addMesh(plane, 2000, 0, FLOOR, 0, -1.57, 0, 0, mat);

        plane.computeFaceNormals();
        plane.computeVertexNormals();

        planeMesh.receiveShadow= true;

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

function getHeightData(img, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    var size = width * height, data = new Float32Array(size);

    context.drawImage(img.image, 0, 0);


    var imgd = context.getImageData(0, 0, width, height);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i] + pix[i + 1] + pix[i + 2];
        data[j++] = all / (255*3);
    }

    return data;
};
	

			



