var app = require('http').createServer(handler), io = require('socket.io').listen(app,
    {
        log: false
    }), fs = require('fs'), node_static = require('node-static');

app.listen(80);

var fileServer = new node_static.Server('./');
var socketArray = new Array();
var gameStarted = false;
var sendState = false;
var communicationSpeed = 70;
var checkGameOverTime = 1500;
var playersState = new Array(null,
    null,
    null,
    null);

var players = [
    {
        exist: false,
        ready: false,
        dead: true
    },
    {
        exist: false,
        ready: false,
        dead: true
    },
    {
        exist: false,
        ready: false,
        dead: true
    },
    {
        exist: false,
        ready: false,
        dead: true
    }];
function handler(request, response) {
    request.addListener('end',
        function () {
            fileServer.serve(request,
                response);
        });
}

io.sockets.on('connection',
    function (socket) {
        var thisPlayer = null;
        if (!gameStarted) {
            for (var i = 0; i < 4; i++) {
                if (socketArray[i] == undefined) {
                    if (thisPlayer == null) {
                        socketArray[i] = socket;
                        players[i].exist = true;
                        players[i].dead = false;
                        thisPlayer = i;
                    }
                }
            }
            if (thisPlayer != null) {
                socket.emit('login',
                    {
                        access: true,
                        playerNumber: thisPlayer,
                        players: players,
                        communicationSpeed: communicationSpeed
                    });
                socket.broadcast.emit('playersStatusUpdate',
                    {
                        players: players
                    });
                socket.playerNumber = thisPlayer;
            }
            else {
                socket.emit('login',
                    {
                        access: false,
                        reason: "full"
                    });
                socket.disconnect()
            }
        }
        else {
            socket.emit('login',
                {
                    access: false,
                    reason: "started"
                });
            socket.disconnect()
        }

        socket.on('disconnect',
            function () {
                if (socket.playerNumber != undefined) {
                    delete (socketArray[socket.playerNumber]);
                    players[socket.playerNumber].exist = false;
                    players[socket.playerNumber].ready = false;
                    players[socket.playerNumber].dead = true;
                    if (gameStarted == true) {
                        gameStarted = false;
                        for (var i = 0; i < 4; i++) {
                            if (players[i].exist == true) {
                                gameStarted = true;
                            }
                        }
                    }
                    if (!gameStarted) {
                        socket.broadcast.emit('playersStatusUpdate',
                            {
                                players: players
                            });
                    }
                }
            });

        socket.on('playerReady',
            function (data) {
                players[data.playerNumber].ready = true;
                io.sockets.emit('playersStatusUpdate',
                    {
                        players: players
                    });
            });

        socket.on('gameStarted',
            function (data) {
                if (gameStarted) {
                    return;
                }
                gameStarted = true;
                var bricks = new Array(data.i);
                var curses = new Array(data.i);
                for (var i = 0; i < data.i; i++) {
                    bricks[i] = new Array(data.j);
                    curses[i] = new Array(data.j);
                    for (var j = 0; j < data.j; j++) {
                        if (Math.random() < data.brick_density) {
                            curses[i][j] =
                                {};
                            bricks[i][j] = true;
                            curses[i][j].curse = false;
                            curses[i][j].type = null;
                            var maxRandom = 0;
                            var tempRandom = Math.random();
                            if (Math.random() < data.extra_bomb_density) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "extraBomb";
                                curses[i][j].img = "extraBomb";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.upgrade_bomb_size_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "upgradeBombSize";
                                curses[i][j].img = "upgradeBombSize";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.nonstop_dropbomb_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "nonStopBomb";
                                curses[i][j].img = "skeleton";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.big_bombsize_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "bigBomb";
                                curses[i][j].img = "skeleton";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.no_dropbomb_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "noBomb";
                                curses[i][j].img = "skeleton";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.small_bombsize_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "smallBomb";
                                curses[i][j].img = "skeleton";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.double_speed_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "doubleSpeed";
                                curses[i][j].img = "skeleton";
                                tempRandom = maxRandom;
                            }
                            tempRandom = Math.random();
                            if (Math.random() < data.half_speed_curse_density && tempRandom > maxRandom) {
                                curses[i][j].curse = true;
                                curses[i][j].type = "halfSpeed";
                                curses[i][j].img = "skeleton";
                            }
                        }
                        else {
                            bricks[i][j] = false;
                        }
                    }
                }

                io.sockets.emit('createBricks',
                    {
                        bricks: bricks,
                        curses: curses
                    });

                setInterval(function () {
                        if (sendState == true) {
                            io.sockets.emit('movePlayer',
                                playersState);
                            for (var i = 0; i < 4; i++) {
                                playersState[i] = null;
                            }
                            sendState = false;
                        }
                    },
                    communicationSpeed);

                setInterval(function () {
                        if (gameStarted == true) {
                            var aliveCount = 4;
                            var winner = -1;
                            var i;
                            for (i = 0; i < 4; i++) {
                                if (players[i].dead == true) {
                                    aliveCount--;
                                } else {
                                    winner = i;
                                }
                            }
                            if (aliveCount < 2) {
                                io.sockets.emit('gameIsOver',
                                    winner);
                                gameStarted = false;
                                for (i = 0; i < 4; i++) {
                                    if (socketArray[i] != undefined) {
                                        socketArray[i].disconnect();
                                    }
                                }
                            }
                        }
                    },
                    checkGameOverTime);
            });

        socket.on('sendMoveKey',
            function (data) {
                if (data != null) {
                    sendState = true;
                    playersState[data.pN] =
                        {
                            d_x: data.d_x,
                            d_y: data.d_y
                        }
                }
            });

        socket.on('stopAnimation',
            function (data) {
                io.sockets.emit('movePlayer',
                    data);
            });

        socket.on('requestBombDrop',
            function (data) {
                io.sockets.emit('dropBomb',
                    data);
            });

        socket.on('died',
            function (data) {
                players[data].dead = true;
            });

    });
