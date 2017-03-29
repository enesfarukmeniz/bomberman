var pixel_unit = 30;
var bomberman_pixel_unit = 21;
var bomb_pixel_unit = 16;
if (moveSpeed > 5) {
    moveSpeed = 5;
}
var myMoveSpeed = moveSpeed;
var pixel_x = dimension_x * 2 * pixel_unit + pixel_unit;
var pixel_y = dimension_y * 2 * pixel_unit + pixel_unit;
var readyToMove = true;
var smallingSize;
var timerDiv;
var players = new Array();

var player_coords = new Array([pixel_unit + (pixel_unit - bomberman_pixel_unit) / 2,
                               pixel_unit + (pixel_unit - bomberman_pixel_unit) / 2], [pixel_unit * (dimension_x * 2 - 1) + (pixel_unit - bomberman_pixel_unit) / 2,
                                                                                       pixel_unit * (dimension_y * 2 - 1) + (pixel_unit - bomberman_pixel_unit) / 2], [pixel_unit * (dimension_x * 2 - 1) + (pixel_unit - bomberman_pixel_unit) / 2,
                                                                                                                                                                       pixel_unit + (pixel_unit - bomberman_pixel_unit) / 2], [pixel_unit + (pixel_unit - bomberman_pixel_unit) / 2,
                                                                                                                                                                                                                               pixel_unit * (dimension_y * 2 - 1) + (pixel_unit - bomberman_pixel_unit) / 2]);

function loginScreen(players) {
    var loginFlag = true;
    var existCount = 0;
    document.getElementById('startDiv').style.display = "block"
    for (var i = 0; i < 4; i++) {
        if (i == playerNumber) {
            document.getElementById('player' + i + 'button').style.display = "block";
            document.getElementById('player' + i + 'ready').style.display = "none";
            document.getElementById('player' + i + 'img').src = 'img/player_start' + i + '.png';
            existCount++;
        }
        else {
            document.getElementById('player' + i + 'button').style.display = "none";
            if (players[i].exist) {
                existCount++;
                document.getElementById('player' + i + 'img').src = 'img/player_start' + i + '.png';
                if (players[i].ready) {
                    document.getElementById('player' + i + 'ready').innerHTML = "<font color=limegreen>Hazır</font>";
                } else {
                    document.getElementById('player' + i + 'ready').innerHTML = "<font color=red>Hazır Değil</font>";
                }
            }
            else {
                document.getElementById('player' + i + 'ready').innerHTML = "Oyuncu Yok";
                document.getElementById('player' + i + 'img').src = 'img/player_empty.png';
            }

        }
        if ((players[i].exist && !players[i].ready)) {
            loginFlag = false;
        }
    }
    if (loginFlag && existCount > 1) {
        countDown(players);
    }
}

function countDown(players) {
    timerDiv = document.getElementById('timerDiv');
    starting();
    setTimeout(function () {
        document.getElementById('startDiv').style.display = "none"
        timerDiv.style.display = "none"
        startGame(players);
    }, 3000);
    totalSeconds = 3;
    count();
}

function count() {
    totalSeconds = totalSeconds - 0.01;
    timerDiv.innerHTML = totalSeconds.toFixed(2);
    if (totalSeconds >= 0) {
        setTimeout("count()", 10);
    }
}

function startGame(p) {
    Crafty.init(pixel_x, pixel_y);
    Crafty.scene("loading", function () {
        Crafty.load(["img/player_start" + playerNumber + ".png"], function () {
            Crafty.scene("main");
        });
        Crafty.background("#CCC");

        Crafty.e("2D, DOM, Text").attr(
            {
                w: 100,
                h: 20,
                x: pixel_x / 2,
                y: pixel_y / 2
            }).text("Yükleniyor").css(
            {
                "text-align": "center"
            });
    });
    Crafty.scene("loading");

    Crafty.sprite(pixel_unit, "img/game-sprites2.png",
        {
            grass: [0, 0],
            brick: [1, 0],
            steel: [2, 0],
            fire_vertical: [0, 1],
            fire_horizontal: [1, 1],
            fire_center: [2, 1],
            extraBomb: [0, 2],
            upgradeBombSize: [1, 2],
            skeleton: [2, 2]
        });

    Crafty.sprite(bomberman_pixel_unit, "img/bomberman-sprites.png",
        {
            player0: [0, 0],
            player1: [0, 1],
            player2: [0, 2],
            player3: [0, 3]
        });

    Crafty.sprite(bomb_pixel_unit, "img/bomb-sprites.png",
        {
            bomb: [0, 0]
        });

    Crafty.c('Bomberman',
        {
            Bomberman: function (bPlayerNumber) {
                this.requires("SpriteAnimation, Collision").animate("down", 0, bPlayerNumber, 2).animate("left", 3, bPlayerNumber, 5).animate("up", 6, bPlayerNumber, 8).animate("right", 9, bPlayerNumber, 11).animate("die", 12, bPlayerNumber, 18).bind('Moved', function (from) {

                    for (var i = 0; i < 2; i++) {
                        if (this.inBomb[i] != null && ((this.pos()._x > (this.inBomb[i].obj.pos()._x + bomb_pixel_unit)) || (this.pos()._x < (this.inBomb[i].obj.pos()._x - bomberman_pixel_unit)) || (this.pos()._y > (this.inBomb[i].obj.pos()._y + bomb_pixel_unit)) || (this.pos()._y < (this.inBomb[i].obj.pos()._y - bomberman_pixel_unit)))) {
                            this.inBomb[i].obj.addComponent('solid');
                            this.inBomb[i] = null;
                        }
                    }

                    if (!this.hit('solid')) {
                        var direction =
                            {
                                x: (this.pos()._x - from.x) % (((playerNumber == bPlayerNumber) ? myMoveSpeed : moveSpeed) + 1),
                                y: (this.pos()._y - from.y) % (((playerNumber == bPlayerNumber) ? myMoveSpeed : moveSpeed) + 1),
                            };

                        this.attr(
                            {
                                x: from.x,
                                y: from.y
                            });

                        if (readyToMove) {
                            readyToMove = false;
                            sendMoveKey(direction);
                        }
                    }
                    else {
                        this.attr(
                            {
                                x: from.x,
                                y: from.y
                            });
                    }
                })
                this.onHit("fire", function () {
                    this.animate("die", 50, 1);
                    this.disableControl();
                    setTimeout(function (th) {
                        th.destroy();
                    }, 1000, this);
                    if (playerNumber == bPlayerNumber) {
                        died();
                    }
                });

                this.onHit("upgrade", function (upgrade) {
                    if (playerNumber == bPlayerNumber) {
                        upgrade[0].obj.curseFn();
                    }
                    upgrade[0].obj.destroy();
                });

                if (playerNumber == bPlayerNumber) {
                    this.onHit("bomb", function (bomb) {
                        this.inBomb = bomb;
                    });

                    this.bind('KeyDown', function (e) {
                        if (e.key != Crafty.keys.SPACE) {
                            return;
                        }

                        bombDropKey(this, playerNumber);
                    });
                }

                return this;
            },
            animatePlayer: function (direction) {
                if (direction.x < 0) {
                    if (!this.isPlaying("left")) {
                        this.stop().animate("left", 10, 1);
                    }
                }
                else if (direction.x > 0) {
                    if (!this.isPlaying("right")) {
                        this.stop().animate("right", 10, 1);
                    }
                }
                else if (direction.y < 0) {
                    if (!this.isPlaying("up")) {
                        this.stop().animate("up", 10, 1);
                    }
                }
                else if (direction.y > 0) {
                    if (!this.isPlaying("down")) {
                        this.stop().animate("down", 10, 1);
                    }
                }
            },
            movePlayer: function (data) {
                this.attr(
                    {
                        x: this.pos()._x + (data.x),
                        y: this.pos()._y + (data.y)
                    });

                this.animatePlayer(data);
            },
            dropBomb: function (data) {
                Crafty.e("Bomb").initBomb(data);
            }
        });

    Crafty.c("Controls",
        {
            init: function () {
                this.requires('Multiway');
            },
            moveSpeed: function (speed) {
                this.multiway(speed * 2,
                    {
                        UP_ARROW: -90,
                        DOWN_ARROW: 90,
                        RIGHT_ARROW: 0,
                        LEFT_ARROW: 180
                    });
                return this;
            }
        });

    Crafty.c("Bomb",
        {
            initBomb: function (data) {
                this.requires("2D, DOM, SpriteAnimation, bomb").attr(
                    {
                        x: data.x,
                        y: data.y,
                        z: 500,
                        size: data.s
                    }).animate('bombAnimation', 0, 0, 2).animate('bombAnimation', 50, -1).timeout(function () {
                    this.trigger("explode");
                }, bombExplodeTime).bind('explode', function () {
                    players[data.pN].droppedBombCount--;

                    Crafty.e("2D, DOM, Fire, fire_center, Collision").attr(
                        {
                            x: this.x - this.x % pixel_unit,
                            y: this.y - this.y % pixel_unit,
                            z: 6
                        });

                    createFire(0, this, "fire_horizontal", 1, 1, 0);
                    createFire(0, this, "fire_horizontal", -1, 1, 0);
                    createFire(0, this, "fire_vertical", 1, 0, 1);
                    createFire(0, this, "fire_vertical", -1, 0, 1);

                    this.destroy();
                });

                if ((players[playerNumber].pos()._x > (this.pos()._x + bomb_pixel_unit)) || (players[playerNumber].pos()._x < (this.pos()._x - bomberman_pixel_unit)) || (players[playerNumber].pos()._y > (this.pos()._y + bomb_pixel_unit)) || (players[playerNumber].pos()._y < (this.pos()._y - bomberman_pixel_unit))) {
                    this.addComponent('solid');
                }
                return this;
            }
        });

    Crafty.c('Fire',
        {
            init: function () {
                this.requires("2D, DOM, SpriteAnimation, fire").timeout(function () {
                    this.destroy();
                }, bombExplosionTime)
                return this;
            }
        });

    Crafty.scene("main", function () {
        createMap();
        if (p[0].exist == true) {
            players[0] = Crafty.e("2D, DOM, Bomberman, player0, Controls").attr(
                {
                    x: player_coords[0][0],
                    y: player_coords[0][1],
                    z: 1000
                }).Bomberman(0)
        }
        if (p[1].exist == true) {
            players[1] = Crafty.e("2D, DOM, Bomberman, player1, Controls").attr(
                {
                    x: player_coords[1][0],
                    y: player_coords[1][1],
                    z: 1000
                }).Bomberman(1);
        }
        if (p[2].exist == true) {
            players[2] = Crafty.e("2D, DOM, Bomberman, player2, Controls").attr(
                {
                    x: player_coords[2][0],
                    y: player_coords[2][1],
                    z: 1000
                }).Bomberman(2);
        }
        if (p[3].exist == true) {
            players[3] = Crafty.e("2D, DOM, Bomberman, player3, Controls").attr(
                {
                    x: player_coords[3][0],
                    y: player_coords[3][1],
                    z: 1000
                }).Bomberman(3);
        }
        players[playerNumber].attr(
            {
                droppedBombCount: 0,
                bombCount: bombCount,
                bombSize: bombSize,
                inBomb: Array(null, null)
            }).moveSpeed(moveSpeed);
    });
};

function createFire(size, th, type, direction, horizontal, vertical) {
    if (size == th.size) {
        return;
    }
    Crafty.e("2D, DOM, Fire, " + type + ", Collision").attr(
        {
            x: (th.x - th.x % pixel_unit) + ((size + 1) * pixel_unit * direction) * horizontal,
            y: (th.y - th.y % pixel_unit) + ((size + 1) * pixel_unit * direction) * vertical,
            z: 5
        }).collision().onHit('bomb', function (o) {
        o[0].obj.trigger("explode");
    }).onHit('brick', function (o) {
        setTimeout(function (x, y) {
            Crafty.e("2D, DOM, grass, grassReal").attr(
                {
                    x: x,
                    y: y,
                    z: 1
                });
        }, bombExplosionTime * 1.5, o[0].obj.pos()._x, o[0].obj.pos()._y);
        o[0].obj.destroy();
    }).onHit('grassReal', function (o) {
        size++;
        if (size >= th.size) {
            return;
        }

        setTimeout(function (x, y) {
            Crafty.e("2D, DOM, grass, grassReal").attr(
                {
                    x: x,
                    y: y,
                    z: 1
                });
        }, bombExplosionTime * 1.5, o[0].obj.pos()._x, o[0].obj.pos()._y);
        o[0].obj.destroy();
        createFire(size, th, type, direction, horizontal, vertical);
    });

}

function bombDropKey(th, pN) {
    if (th.droppedBombCount < th.bombCount) {
        th.droppedBombCount++;
        requestBombDrop(
            {
                x: ((th.pos()._x + bomberman_pixel_unit / 2) - (th.pos()._x + bomberman_pixel_unit / 2) % pixel_unit) + (pixel_unit - bomb_pixel_unit) / 2,
                y: ((th.pos()._y + bomberman_pixel_unit / 2) - (th.pos()._y + bomberman_pixel_unit / 2) % pixel_unit) + (pixel_unit - bomb_pixel_unit) / 2,
                pN: pN,
                s: th.bombSize
            });
    }
}

function generateRandomBrick(i, j) {
    return generateRandomBrick.randomBricks[i][j];
}

function generateRandomCurse(i, j) {
    //@f:off
    return {
        curse: generateRandomCurse.randomCurses[i][j].curse,
        type: eval(generateRandomCurse.randomCurses[i][j].type),
        img: generateRandomCurse.randomCurses[i][j].img
    };
    //@f:on
}

var extraBomb = function () {
    players[playerNumber].bombCount++;
};

var upgradeBombSize = function () {
    players[playerNumber].bombSize++;
};

var nonStopBomb = function () {
    for (var i = 0; i < cursePeriod / 100; i++) {
        setTimeout(function () {
            bombDropKey(players[playerNumber], playerNumber);
        }, i * 100);
    }
};

var bigBomb = function () {
    players[playerNumber].bombSize += 10;
    setTimeout(function () {
        players[playerNumber].bombSize -= 10;
    }, cursePeriod);
};

var noBomb = function () {
    players[playerNumber].bombCount -= 100;
    setTimeout(function () {
        players[playerNumber].bombCount += 100;
    }, cursePeriod);
};

var smallBomb = function () {
    smallingSize = players[playerNumber].bombSize - 1;
    players[playerNumber].bombSize = players[playerNumber].bombSize - smallingSize;
    setTimeout(function () {
        players[playerNumber].bombSize += smallingSize;
    }, cursePeriod);
};

var doubleSpeed = function () {
    if (myMoveSpeed > moveSpeed) {
        return;
    }
    myMoveSpeed *= 2;
    setTimeout(function () {
        myMoveSpeed /= 2;
    }, cursePeriod);
};

var halfSpeed = function () {
    if (myMoveSpeed < moveSpeed) {
        return;
    }
    myMoveSpeed /= 2;
    setTimeout(function () {
        myMoveSpeed *= 2;
    }, cursePeriod);
};

function createMap() {
    for (var i = 0; i < pixel_x / pixel_unit; i++)
        for (var j = 0; j < pixel_y / pixel_unit; j++) {
            Crafty.e("2D, DOM, grass, grassFake").attr(
                {
                    x: i * pixel_unit,
                    y: j * pixel_unit,
                    z: 1
                });
            if (i == 0 || i == dimension_x * 2 || j == 0 || j == dimension_y * 2 || ((i % 2 == 0) && (j % 2 == 0))) {
                Crafty.e("2D, DOM, solid, steel").attr(
                    {
                        x: i * pixel_unit,
                        y: j * pixel_unit,
                        z: 100
                    });
            }
            else {
                if (generateRandomBrick(i, j) == true && i > 0 && i < dimension_x * 2 && j > 0 && j < dimension_y * 2 && !((i == 1 || i == 2 || i == dimension_x * 2 - 1 || i == dimension_x * 2 - 2) && (j == 1 || j == 2 || j == dimension_y * 2 - 1 || j == dimension_y * 2 - 2))) {
                    Crafty.e("2D, DOM, solid, brick").attr(
                        {
                            x: i * pixel_unit,
                            y: j * pixel_unit,
                            z: 50
                        });

                    if (generateRandomCurse(i, j).curse == true) {
                        Crafty.e("2D, DOM, upgrade, " + generateRandomCurse(i, j).img).attr(
                            {
                                x: i * pixel_unit,
                                y: j * pixel_unit,
                                z: 4,
                                curseFn: generateRandomCurse(i, j).type,
                                visibility: false
                            });
                    }
                }
                else {
                    Crafty.e("2D, DOM, grass, grassReal").attr(
                        {
                            x: i * pixel_unit,
                            y: j * pixel_unit,
                            z: 1
                        });
                }
            }
        }
}

function gameOver(data) {
    if (data == -1) {
        alert("BERABERE!");
    } else {
        alert((data + 1) + " numaralı oyuncu kazandı!");
    }

    document.location.reload(true);

}