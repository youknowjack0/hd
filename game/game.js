var Game = function () {
    var me = this;
    window.document.addEventListener('keydown', function(e) { me.onKeyDown(e); }, false);
    window.document.addEventListener('keyup', function (e) { me.onKeyUp(e); }, false);
    window.document.addEventListener('mousemove', function (e) { me.onMouseMove(e); }, false);

    var copter = new HD.Copter();
    this.addEntity(copter);
    this.addEntity(new HD.Terrain());
    this.addEntity(new HD.SceneLight());
};

Game.prototype = {
    constructor: Game,

    onDrawSubscribers: [],

    clock: Date.now(),
    delta: 0,

    keys: {
        w: false,
        s: false,
        a: false,
        d: false
    },
    
    onKeyDown: function(event) {
        switch(event.keyCode) {
            case 87: //w
                this.keys.w = true;
                break;
            case 65: //a
                this.keys.a = true;
                break;
            case 68: //d
                this.keys.d = true;
                break;
        }
    },

    onKeyUp: function(event) {
        switch (event.keyCode) {
            case 87: //w
                this.keys.w = false;
                break;
            case 65: //a
                this.keys.a = false;
                break;
            case 68: //d
                this.keys.d = false;
                break;
        }
    },

    onMouseMove: function(event) {
        this.mousePos = {
            x: event.clientX,
            y: event.clientY
        };
    },

    addEntity: function(entity) {
        if (entity.object3d) {
            HD.renderer.addGeometry(entity.object3d);            
        }
        if (entity.draw)
            this.onDrawSubscribers.push(entity);
    },

    draw: function () {
        var now = Date.now();
        var last = this.clock || now;
        this.delta = (now - last) / 1000.0;
        this.clock = now;
        for (var i = 0; i < this.onDrawSubscribers.length; i++) {
            this.onDrawSubscribers[i].draw(this);
        }
    }

};

HD.init = function() {
    HD.renderer = new HD.Renderer(); 
    HD.game = new Game();
    HD.game.camera = HD.renderer.camera;
    HD.game.renderer = HD.renderer;
    HD.renderer.game = HD.game;
    console.log("game loaded");
};

