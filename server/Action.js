'use strict';
module.exports = function Action (game) {
  this.game = game;

  this.playerJoin = function (name, socket) {
    this.game.playerList.addPlayer(name, socket);
  };

  this.clickField = function (fieldData, rightClick) {
    var field = this.game.fields[fieldData.x] && this.game.fields[fieldData.x][fieldData.y];
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
        	game.calculateNeighbours(field);
    }
    field.status = field.STATUS_OPEN;
    return field;
  };

  this.flagField = function (field) {
    field.status = (field.status === field.STATUS_FLAGGED ? field.STATUS_CLOSED : field.STATUS_FLAGGED);
    return field;
  };
};
