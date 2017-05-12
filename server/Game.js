'use strict';
var PlayerList = require('./PlayerList.js'),
  Action = require('./Action.js'),
  Field = require('./Field.js');

module.exports = function Game () {
  this.size = 10;
  this.mines = 20;
  this.fields = [];
  this.openedFields = 0;
  this.playerList = new PlayerList(this);
  this.action = new Action(this);

  this.getValues = function () {
    return {
      size: this.size,
      mines: this.mines,
      fields: this.fields.map(function (fields) {
        return fields.map(function (field) {
          return field.getValues();
        });
      })
    };
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
    var neighbours = 0;
    for (var x = field.x - 1; x <= field.x + 1; x++) {
      for (var y = field.y - 1; y <= field.y + 1; y++) {
        if (x === field.x && y === field.y) {
          continue;
        }
        if (!this.fields[x] || !this.fields[x][y]) {
          continue;
        }
        if (this.fields[x][y].isMine) {
          neighbours++;
        }
      }
    }
    field.neighbours = neighbours;
    return neighbours;
  };

  this.openField = function () {
    this.openedFields++;
    if (this.openedFields >= this.size * this.size - this.mines) {
      this.initialize();
      this.playerList.tellAllPlayers('game', {game: this.getValues(), playerList: this.playerList.getValues()});
      return false;
    }
    return true;
  };

  this.initialize = function () {
    this.generateFields();
    this.generateMines();
    this.openedFields = 0;
  };
};
