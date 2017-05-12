(function () {
  // Board
  var Board = function (game) {
    this.game = game;
    this.canvas = document.getElementById('canvas');
    this.bombIcon = document.getElementById('bombicon');
    this.context = this.canvas.getContext('2d');

    this.fieldSize = 50;

    var size = this.fieldSize * this.game.size;
    this.canvas.setAttribute('width', size);
    this.canvas.setAttribute('height', size);

    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, size, size);

    this.renderField = function (field) {
      if (field.status === 1) {
        this.context.fillStyle = 'lightgrey';
      } else if (field.status === 2) {
        this.context.fillStyle = 'orange';
      } else if (field.status === 3) {
        this.context.fillStyle = 'white';
      }
      this.context.fillRect(field.x * this.fieldSize + 1, field.y * this.fieldSize + 1, this.fieldSize - 2, this.fieldSize - 2);

      if (field.status === 3 && field.isMine) {
            	this.context.drawImage(this.bombIcon, field.x * this.fieldSize + 1, field.y * this.fieldSize + 1, this.fieldSize - 2, this.fieldSize - 2);
      }

      if (field.status === 3 && field.neighbours) {
        this.context.fillStyle = 'black';
        this.context.font = '30px Arial';
        this.context.fillText(field.neighbours, field.x * this.fieldSize + 16.5, field.y * this.fieldSize + 35);
      }
    };

    for (var x = 0; x < this.game.size; x++) {
      for (var y = 0; y < this.game.size; y++) {
        this.renderField(this.game.fields[x][y]);
      }
    }
  };

  // Controller
  var Controller = function (board, scoreTable, socket) {
    this.board = board;
    this.scoreTable = scoreTable;
    this.socket = socket;

    this.board.canvas.addEventListener('click', function (event) {
      var x = Math.floor(event.offsetX / this.board.fieldSize);
      var y = Math.floor(event.offsetY / this.board.fieldSize);
      var field = this.board.game.fields[x] && this.board.game.fields[x][y];
      if (field) {
        this.clickField(field, false);
      }
    }.bind(this));

    this.board.canvas.addEventListener('contextmenu', function (event) {
      var x = Math.floor(event.offsetX / this.board.fieldSize);
      var y = Math.floor(event.offsetY / this.board.fieldSize);
      var field = this.board.game.fields[x] && this.board.game.fields[x][y];
      if (field) {
        this.clickField(field, true);
      }
      event.preventDefault();
      return false;
    }.bind(this));

    this.clickField = function (field, rightClick) {
      console.log('clickField');
      socket.emit('clickField', {field: field, rightClick: rightClick});
    };

    socket.on('PlayerJoined', function (data) {
      console.log('PlayerJoined #' + data.player.id);

      this.scoreTable.addPlayer(data.player);
    }.bind(this));

    socket.on('PlayerLeft', function (data) {
      console.log('PlayerLeft #' + data.id);

      this.scoreTable.removePlayer(data.id);
    }.bind(this));
  };

  // ScoreTable
  var ScoreTable = function () {
    this.table = document.getElementById('scoretable');
    this.tableHead = this.table.tHead;

    this.addPlayer = function (playerData) {
      var row = document.createElement('tr');
      row.id = 'scoreTableRow' + playerData.id;

      if (!this.tableHead.childElementCount) {
        for (attribute in playerData) {
          var headColumn = document.createElement('td');
          headColumn.innerText = attribute;
          this.tableHead.append(headColumn);
        }
      }

      for (attribute in playerData) {
        var column = document.createElement('td');
        column.id = 'scoreTableColumn' + playerData.id + attribute;
        column.innerText = playerData[attribute];
        row.append(column);
      }

      this.table.append(row);
    };

    this.updatePlayer = function (playerData) {
      for (attribute in playerData) {
        var column = document.getElementById('scoreTableColumn' + playerData.id + attribute);
        column.innerText = playerData[attribute];
      }
    };

    this.removePlayer = function (playerId) {
      var row = document.getElementById('scoreTableRow' + playerId);
      row.remove();
    };
  };

  // game
  var board,
    controller,
    scoreTable;

  var socket = io('/');

  socket.emit('join');

  socket.on('game', function (data) {
    console.log('game');

    board = new Board(data.game);
    scoreTable = new ScoreTable();
    controller = new Controller(board, scoreTable, socket);

    data.playerList.players.forEach(function (playerData) {
      scoreTable.addPlayer(playerData);
    });
  });

  socket.on('field', function (data) {
    console.log('field');

    board.game.fields[data.field.x][data.field.y] = data.field;
    board.renderField(data.field);
    scoreTable.updatePlayer(data.player);
  });
}());
