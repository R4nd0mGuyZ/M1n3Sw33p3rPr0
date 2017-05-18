(function () {
  // Board
  var Board = function (game) {
    this.canvas = document.getElementById('canvas');
    this.bombIcon = document.getElementById('bombicon');
    this.context = this.canvas.getContext('2d');

    this.fieldSize = 50;

    var NeighbourColors = {1: 'blue', 2: 'green', 3: 'red', 4: 'darkblue', 5: 'brown', 6: 'cyan', 7: 'black', 8: 'grey' };

    var StatusColor = {1: 'lightgrey', 2: 'orange', 3: 'white'};
    this.FIELD_STATUS_CLOSED = 1;
    this.FIELD_STATUS_FLAGGED = 2;
    this.FIELD_STATUS_OPEN = 3;

    this.renderField = function (field) {
      this.context.fillStyle = StatusColor[field.status];

      this.context.fillRect(field.x * this.fieldSize + 1, field.y * this.fieldSize + 1, this.fieldSize - 2, this.fieldSize - 2);

      if (field.status === this.FIELD_STATUS_OPEN && field.isMine) {
            	this.context.drawImage(this.bombIcon, field.x * this.fieldSize + 1, field.y * this.fieldSize + 1, this.fieldSize - 2, this.fieldSize - 2);
      }

      if (field.status === this.FIELD_STATUS_OPEN && field.neighbours) {
        this.context.fillStyle = NeighbourColors[field.neighbours];
        this.context.font = '30px Arial';
        this.context.fillText(field.neighbours, field.x * this.fieldSize + 16.5, field.y * this.fieldSize + 35);
      }
    };

    this.setGame = function (game) {
      this.game = game;

      var size = this.fieldSize * this.game.size;
      this.canvas.setAttribute('width', size);
      this.canvas.setAttribute('height', size);

      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, size, size);

      for (var x = 0; x < this.game.size; x++) {
        for (var y = 0; y < this.game.size; y++) {
          this.renderField(this.game.fields[x][y]);
        }
      }

      return this;
    };
    this.setGame(game);
  };

  // Controller
  var Controller = function (board, scoreTable, socket) {
    this.board = board;
    this.scoreTable = scoreTable;
    this.socket = socket;

    this.board.canvas.addEventListener('click', function (event) {
      console.log('click');
      var field = this.calculateField(event.offsetX, event.offsetY);
      if (field) {
        this.clickField(field, false);
      }
    }.bind(this));

    this.board.canvas.addEventListener('contextmenu', function (event) {
      console.log('contextmenu');
      var field = this.calculateField(event.offsetX, event.offsetY);
      if (field) {
        this.clickField(field, true);
      }
      event.preventDefault();
      return false;
    }.bind(this));

    this.board.canvas.addEventListener('dblclick', function (event) {
      console.log('doubleClick');
      var field = this.calculateField(event.offsetX, event.offsetY);
      if (field) {
        this.clickField(field, false, true);
      }
    }.bind(this));

    this.calculateField = function (offsetX, offsetY) {
      var x = Math.floor(offsetX / this.board.fieldSize);
      var y = Math.floor(offsetY / this.board.fieldSize);
      return this.board.game.fields[x] && this.board.game.fields[x][y];
    };

    this.clickField = function (field, rightClick, doubleClick) {
      socket.emit('clickField', {field: field, rightClick: rightClick, doubleClick: doubleClick});
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
  var ScoreTable = function (ownPlayerId) {
    this.ownPlayerId = ownPlayerId;
    this.table = document.getElementById('scoretable');
    this.tableHead = this.table.tHead;

    this.addPlayer = function (playerData) {
      var row = document.getElementById('scoreTableRow' + playerData.id);
      if (!row) {
        row = document.createElement('tr');
        row.id = 'scoreTableRow' + playerData.id;
        if (playerData.id === this.ownPlayerId) {
          row.setAttribute('class', 'ownPlayerRow');
        }
        this.table.appendChild(row);

        if (!this.tableHead.childElementCount) {
          for (attribute in playerData) {
            var headColumn = document.createElement('td');
            headColumn.innerText = attribute;
            this.tableHead.appendChild(headColumn);
          }
        }
      }

      this.updatePlayer(playerData);
    };

    this.updatePlayer = function (playerData) {
      for (attribute in playerData) {
        var column = document.getElementById('scoreTableColumn' + playerData.id + attribute);
        if (!column) {
          var column = document.createElement('td');
          column.id = 'scoreTableColumn' + playerData.id + attribute;
          var row = document.getElementById('scoreTableRow' + playerData.id);
          row.appendChild(column);
        }
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
    scoreTable,
    ownPlayerId;

  var socket = io('/');

  socket.emit('join');

  socket.on('game', function (data) {
    console.log('game');

    ownPlayerId = data.player.id;
    board = new Board(data.game);
    scoreTable = new ScoreTable(ownPlayerId);
    controller = new Controller(board, scoreTable, socket);

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
