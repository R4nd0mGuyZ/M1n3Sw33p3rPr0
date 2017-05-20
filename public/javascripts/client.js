(function () {
  var board,
    controller,
    scoreTable,
    ownPlayerId;

  var socket = window.io('/');

  socket.emit('join');

  socket.on('game', function (data) {
    console.log('game');

    ownPlayerId = data.player.id;
    board = new window.m1n3.Board(data.game);
    scoreTable = new window.m1n3.ScoreTable(ownPlayerId);
    controller = new window.m1n3.Controller(board, scoreTable, socket);

    data.playerList.players.forEach(function (playerData) {
      scoreTable.addPlayer(playerData);
    });
  });

  socket.on('nextGame', function (data) {
    console.log('nextGame');

    board.setGame(data.game);
    data.playerList.players.forEach(function (playerData) {
      scoreTable.addPlayer(playerData);
    });
  });

  socket.on('fields', function (data) {
    console.log('field');
    data.fields.forEach(function (field) {
      board.game.fields[field.x][field.y] = field;
      board.renderField(field);
    });
    scoreTable.updatePlayer(data.player);
  });
}());
