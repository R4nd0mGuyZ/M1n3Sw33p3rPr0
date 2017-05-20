'use strict';
var PlayerList = require('./PlayerList.js');
var Board = require('./Board.js');

module.exports = function Game () {
  this.playerList = new PlayerList(this);
  this.board = new Board();
  this.board.initialize();

  this.playerJoin = function (name, socket) {
    this.playerList.addPlayer(name, socket);
  };

  this.clickField = function (player, fieldData, rightClick, doubleClick) {
    var field = this.board.fields[fieldData.x] && this.board.fields[fieldData.x][fieldData.y];
    if (!field) {
      return;
    }

    if (rightClick) {
      if (this.board.flagField(field)) {
        console.log('toggled field flag');
        this.playerList.tellAllPlayers('fields', {fields: [field.getValues()], player: player.getValues()});
      }
      return;
    }

    var fields;
    if (doubleClick) {
      fields = this.board.openFieldNeighbours(field);
    } else {
      fields = this.board.openField(field);
    }
    if (!fields) {
      return;
    }
    fields = fields.filter(function (field) {
      if (field) {
        if (field.isMine) {
          player.addWackness();
        } else {
          player.addFame();
        }
        return true;
      }
    });

    console.log(player.name + ' has now ' + player.fame + ' fame and ' + player.wackness + ' wackness.');
    this.playerList.tellAllPlayers('fields', {fields: this.board.getFieldsValues(fields), player: player.getValues()});

    this.checkGameOver();
  };

  this.checkGameOver = function () {
    if (this.board.isCompleted()) {
      console.log('Game Over!');
      setTimeout(function () {
        this.board.initialize();
        this.playerList.tellAllPlayers('nextGame', {game: this.board.getValues(), playerList: this.playerList.getValues()});
      }.bind(this), 1000);
    }
  };
};
