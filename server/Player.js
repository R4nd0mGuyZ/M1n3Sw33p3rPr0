'use strict';
module.exports = function Player (name, id, socket, game) {
  this.id = id;
  this.name = name;
  this.socket = socket;
  this.game = game;
  this.fame = 0;
  this.wackness = 0;

  this.socket.on('clickField', function (data) {
    console.log(this.name + ' clickedField');
    var field = game.action.clickField(data.field, data.rightClick);
    if (field) {
      if (field.status === field.STATUS_OPEN) {
        if (field.isMine) {
          this.wackness ++;
        } else {
          this.fame ++;
        }
      }
      console.log(this.name + ' has now ' + this.fame + ' fame and ' + this.wackness + ' wackness.');
      this.game.playerList.tellAllPlayerList('field', {field: field, player: this.getValues()});
    }
  }.bind(this));

  this.getValues = function () {
    return {
      id: this.id,
      name: this.name,
      fame: this.fame,
      wackness: this.wackness
    };
  };
};
