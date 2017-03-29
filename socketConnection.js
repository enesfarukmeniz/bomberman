var socket;
var playerNumber;
var playerState;
var communicationSpeed;

function socketInit()
{
	socket = io.connect(document.URL);
	socket.on('login', function(data)
	{
		if (data.access)
		{
			playerNumber = data.playerNumber;
			loginScreen(data.players);
			communicationSpeed = data.communicationSpeed;
		}
		else
		{
			if (data.reason == "full")
				alert("Oyunumuz dolmuştur, üzgünüz :(");
			else if (data.reason == "started")
				alert("Oyunumuz başlamıştır, lütfen daha sonra tekrar deneyiniz :(");
		}
	});

	socket.on('playersStatusUpdate', function(data)
	{
		loginScreen(data.players);
	});

	socket.on('createBricks', function(data)
	{
		generateRandomBrick.randomBricks = data.bricks;
		generateRandomCurse.randomCurses = data.curses;
		setInterval(function()
		{
			if (playerState != null)
			{
				socket.emit('sendMoveKey', playerState);
				playerState = null;

			}
		}, communicationSpeed);
	});

	socket.on('movePlayer', function(data)
	{
		for (var i = 0; i < 4; i++)
			if (data[i] != null && players[i])
			{
				players[i].movePlayer(
				{
					x : data[i].d_x,
					y : data[i].d_y
				});
				if (i == playerNumber)
					readyToMove = true;
			}
	});

	socket.on('dropBomb', function(data)
	{
		players[data.pN].dropBomb(data);
	});

	socket.on('stopAnimation', function(data)
	{
		players[data].stop();
	});

	socket.on('gameIsOver', function(data)
	{
		gameOver(data);
	});

}

function ready()
{
	document.getElementById('player' + playerNumber + 'button').disabled = true;
	socket.emit('playerReady',
	{
		playerNumber : playerNumber
	});
}

function starting()
{
	socket.emit('gameStarted',
	{
		i : dimension_x * 2,
		j : dimension_y * 2,
		brick_density : brick_density,
		extra_bomb_density : extra_bomb_density,
		upgrade_bomb_size_density : upgrade_bomb_size_density,
		nonstop_dropbomb_curse_density : nonstop_dropbomb_curse_density,
		big_bombsize_curse_density : big_bombsize_curse_density,
		no_dropbomb_curse_density : no_dropbomb_curse_density,
		small_bombsize_curse_density : small_bombsize_curse_density,
		double_speed_curse_density : double_speed_curse_density,
		half_speed_curse_density : half_speed_curse_density
	});
}

function sendMoveKey(direction)
{
	playerState =
	{
		d_x : direction.x,
		d_y : direction.y,
		pN : playerNumber
	}
}

function stopAnimation()
{
	socket.emit('stopAnimation', playerNumber);
}

function requestBombDrop(data)
{
	socket.emit('requestBombDrop', data)
}

function died()
{
	socket.emit('died', playerNumber);
}
