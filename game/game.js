var Game = function () {
    var me = this;
    window.document.addEventListener('keydown', function(e) { me.onKeyDown(e); }, false);
    window.document.addEventListener('keyup', function (e) { me.onKeyUp(e); }, false);
    window.document.addEventListener('mousemove', function (e) { me.onMouseMove(e); }, false);

    this.copter = new HD.PlayerCopter();
    this.addEntity(this.copter);
    this.addEntity(new HD.Terrain());
    this.addEntity(new HD.SceneLight());
    this.net = new HD.Network();
    this.net.join(this);

    this.enemies = {}
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
            case 69: //e
                this.keys.e = true;
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
            case 69: //e
                this.keys.e = false;
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
    },


    removeEntity: function (entity) {
        if (entity.object3d) {
            HD.renderer.removeGeometry(entity.object3d);
        }
        if (entity.draw) {
            var i = this.onDrawSubscribers.indexOf(entity);
            this.onDrawSubscribers.splice(i,1);
        }
    },

    enemyChopper : function(message) {
        var enemies2 = {};
        for(var i = 0;i< message.players.length;i++) {
            var id = message.players[i].playerId;

            if(!this.enemies[id]) {
                enemies2[id] = new HD.EnemyCopter();
                this.addEntity(enemies2[id]);
            } else {
                enemies2[id] = this.enemies[id];
                this.enemies[id] = null;
            }
            enemies2[id].update(message.players[i],this);
        }

        for (var key in this.enemies) {
            if(this.enemies[key] != null)
                this.removeEntity(this.enemies[key]);
        }

        this.enemies = enemies2;
    ;}

}

HD.init = function() {
    HD.renderer = new HD.Renderer(); 
    HD.game = new Game();
    HD.game.camera = HD.renderer.camera;
    HD.game.renderer = HD.renderer;
    HD.renderer.game = HD.game;
    console.log("game loaded");
};

