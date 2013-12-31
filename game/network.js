HD.Network = function() {
    this.url = "http://hd-server.appspot.com/v1?q="; //currently shunts everyone into the same game
    //this.url = "http://localhost:8080/v1?q=";
};

HD.Network.prototype = {};

HD.Network.prototype.join = function(game) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", this.url + "join", true );

    var joinRequest = {
        "gameId" : 0
    }

    var net = this;

    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 ){
            if(xmlHttp.status == 200 && xmlHttp.responseText != null) {
                game.playerId = JSON.parse(xmlHttp.responseText).playerId;
                console.log("joined server with player id: " + game.playerId);
                net.ping(game);
            }
            else
                alert("Unable to join the server for some reason. Enjoy single player!");
        }
    }

    xmlHttp.send(JSON.stringify(joinRequest));



}

HD.Network.prototype.ping = function(game) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", this.url + "pu", true );

    var my = game.copter.object3d;

    var request = {
        "gameId" : -1, //not yet used

        "myPosition" : {
            "playerId" : game.playerId,
            "px" : my.position.x,
            "py" : my.position.y,
            "pz" : my.position.z,
            "rw" : my.quaternion.w,
            "rx" : my.quaternion.x,
            "ry" : my.quaternion.y,
            "rz" : my.quaternion.z
        }
    };

    var net = this;

    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 ){
            if(xmlHttp.status == 200 && xmlHttp.responseText != null)
            {
                game.enemyChopper(JSON.parse(xmlHttp.responseText));
            }
            setTimeout(function() {net.ping(game)},500);
        }
    }

    xmlHttp.send(JSON.stringify(request));

}
