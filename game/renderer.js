

//var renderer, camera, scene, ents, game;

HD.Renderer = function() {
    var container = window.document.createElement('div');
    window.document.body.appendChild(container);

    var info = window.document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'Helpful Message';
    container.appendChild(info);

    var scene = new THREE.Scene();
    this.scene = scene;

    var gl = new THREE.WebGLRenderer({ antialiasing: true });
    this.gl = gl;
    gl.setSize(window.innerWidth, window.innerHeight);

    gl.setClearColor(0x336699, 1);

    gl.gammaInput = true;
    gl.gammaOutput = true;
    gl.physicallyBasedShading = true;

    gl.shadowMapEnabled = true;
    gl.shadowMapCullFace = THREE.CullFaceBack;


    

    container.appendChild(gl.domElement);

    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000000);
    this.camera = camera;
    camera.position = new THREE.Vector3(100, 100, 100);




    /*
    var geometry = new THREE.CubeGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    */
    camera.position.z = 5;
    

    var me = this;
    window.addEventListener('resize', function (event) { me.onWindowResize(event); }, false);    
    this.onRender();
};

HD.Renderer.prototype = {
    constructor: HD.Renderer,

    camera: null,
    scene: null,
    game: null,
    gl: null,

    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,

    eindex: 0,

    addGeometry: function(object3d)
    {
        var name = "ent" + this.eindex;
        this.eindex++;
        object3d.name=name;
        this.scene.add(object3d);
    },

    removeGeometry: function(object3d) {
        this.scene.remove(object3d);
    },

    onRender: function () {
        
        if (this.game)
            this.game.draw();
        
        this.gl.render(this.scene, this.camera);

        var me = this;
        requestAnimationFrame(function (event) { me.onRender(event); });
    },

    onWindowResize: function(e) {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.gl.setSize(window.innerWidth, window.innerHeight);
    }
};
