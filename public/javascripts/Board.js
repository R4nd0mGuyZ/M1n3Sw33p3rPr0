(function () {
  window.m1n3 = (window.m1n3 || {});
  window.m1n3.Board = function (game) {
    this.canvas = document.getElementById('canvas');
    this.bombIcon = document.getElementById('bombicon');
    this.context = this.canvas.getContext('2d');

    this.fieldSize = 50;

    var NeighbourColors = {1: 'blue', 2: 'green', 3: 'red', 4: 'darkblue', 5: 'brown', 6: 'cyan', 7: 'black', 8: 'grey'};

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
}());
