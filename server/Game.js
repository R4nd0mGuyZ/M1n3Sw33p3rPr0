'use strict';
var PlayerList = require('./PlayerList.js'),
  Board = require('./Board.js');

module.exports = function Game () {
  this.playerList = new PlayerList(this);
  this.board = new Board();
  this.board.initialize();

  this.playerJoin = function (name, socket) {
    this.playerList.addPlayer(name, socket);
  };

  this.clickField = function (fieldData, rightClick) {
    var field = this.board.fields[fieldData.x] && this.board.fields[fieldData.x][fieldData.y];
    if (!field) {
      return false;
    }
    if (field.status === field.STATUS_CLOSED) {
      if (rightClick) {
        return this.flagField(field);
      } else {
        return this.openField(field);
      }
    } else if (field.status === field.STATUS_FLAGGED) {
      if (rightClick) {
        return this.flagField(field);
      }
    }
    return false;
  };

  this.openField = function (field) {
    if (!field.isMine) {
      this.board.calculateNeighbours(field);
      if (!this.board.openField()) {
        this.board.initialize();
        this.playerList.tellAllPlayers('nextGame', {game: this.board.getValues(), playerList: this.playerList.getValues()});
        return false;
      }
    }
    field.status = field.STATUS_OPEN;
    return field;
  };

  this.flagField = function (field) {
    field.status = (field.status === field.STATUS_FLAGGED ? field.STATUS_CLOSED : field.STATUS_FLAGGED);
    return field;
  };
};
