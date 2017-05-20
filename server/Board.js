'use strict';
var Field = require('./Field.js');

module.exports = function Board () {
  this.size = 10;
  this.mines = 20;
  this.fields = [];
  this.openedFields = 0;

  this.getValues = function () {
    return {
      size: this.size,
      mines: this.mines,
      fields: this.fields.map(function (fields) {
        return this.getFieldsValues(fields);
      }.bind(this))
    };
  };

  this.getFieldsValues = function (fields) {
    return fields.map(function (field) {
      return field.getValues();
    });
  };

  this.generateFields = function () {
    this.fields = [];
    for (var x = 0; x < this.size; x++) {
      this.fields[x] = [];
      for (var y = 0; y < this.size; y++) {
        var field = new Field();
        field.x = x;
        field.y = y;
        field.status = field.STATUS_CLOSED;
        this.fields[x][y] = field;
      }
    }
  };

  this.generateMines = function () {
    for (var i = 0; i < this.mines; i++) {
      var x = Math.floor(Math.random() * this.size);
      var y = Math.floor(Math.random() * this.size);
      var field = this.fields[x][y];
      if (field.isMine) {
        i--;
        continue;
      }
      field.isMine = true;
    }
  };

  this.calculateNeighbours = function (field) {
    if (field.neighbours !== null) {
      return field.neighbours;
    }
    var mineCount = 0;
    this.forEachNeighbour(field, function (neighbour) {
      if (neighbour.isMine) {
        mineCount++;
      }
    });
    field.neighbours = mineCount;
    return mineCount;
  };

  this.forEachNeighbour = function (field, callback) {
    for (var x = field.x - 1; x <= field.x + 1; x++) {
      for (var y = field.y - 1; y <= field.y + 1; y++) {
        if (x === field.x && y === field.y) {
          continue;
        }
        if (!this.fields[x] || !this.fields[x][y]) {
          continue;
        }
        callback(this.fields[x][y]);
      }
    }
  };

  this.openField = function (field) {
    if (!field.open()) {
      return false;
    }
    var fields = [field];
    if (!field.isMine) {
      this.openedFields++;
      if (!this.calculateNeighbours(field)) {
        fields = fields.concat(this.openFieldNeighbours(field));
      }
    }
    return fields;
  };

  this.openFieldNeighbours = function (field) {
    if (!field.isOpen() || field.isFlagged() || field.isClosed() || field.isMine) {
      return false;
    }
    var fields = [];
    var flagNum = 0;
    this.forEachNeighbour(field, function (neighbour) {
      if (neighbour.isFlagged() || neighbour.isOpen() && neighbour.isMine) {
        flagNum++;
      } else {
        fields.push(neighbour);
      }
    });
    if (flagNum !== this.calculateNeighbours(field) && field.neighbours > 0) {
      return false;
    }
    var openedFields = [];
    fields.forEach(function (field2) {
      var openedFields2 = this.openField(field2);
      if (openedFields2) {
        openedFields2.forEach(function (field3) {
          if (field3 instanceof Array) {
            openedFields = openedFields.concat(field3);
          } else {
            openedFields.push(field3);
          }
        });
      }
    }.bind(this));
    return openedFields;
  };

  this.flagField = function (field) {
    return field.toggleFlag(field);
  };

  this.isCompleted = function () {
    return this.openedFields >= this.size * this.size - this.mines;
  };

  this.initialize = function () {
    this.generateFields();
    this.generateMines();
    this.openedFields = 0;
  };
};
