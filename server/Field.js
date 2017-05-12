'use strict';
module.exports = function Field () {
  this.STATUS_CLOSED = 1;
  this.STATUS_FLAGGED = 2;
  this.STATUS_OPEN = 3;

  this.x = null;
  this.y = null;

  this.isMine = false;
  this.neighbours = null;

  this.status = null;

  this.getValues = function () {
    var isMine = (this.status === this.STATUS_OPEN ? this.isMine : null);
    return {
      x: this.x,
      y: this.y,
      isMine: isMine,
      neighbours: this.neighbours,
      status: this.status
    };
  };
};
