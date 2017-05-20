(function () {
  window.m1n3 = (window.m1n3 || {});
  window.m1n3.Controller = function (board, scoreTable, socket) {
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
}());
