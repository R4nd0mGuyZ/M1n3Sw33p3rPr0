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
};
