(function () {
  window.m1n3 = (window.m1n3 || {});
  window.m1n3.ScoreTable = function (ownPlayerId) {
    this.ownPlayerId = ownPlayerId;
    this.table = document.getElementById('scoretable');
    this.tableHead = this.table.tHead;

    this.addPlayer = function (playerData) {
      var row = document.getElementById('scoreTableRow' + playerData.id);
      if (!row) {
        row = document.createElement('tr');
        row.id = 'scoreTableRow' + playerData.id;
        if (playerData.id === this.ownPlayerId) {
          row.setAttribute('class', 'ownPlayerRow');
        }
        this.table.appendChild(row);

        if (!this.tableHead.childElementCount) {
          for (var attribute in playerData) {
            var headColumn = document.createElement('td');
            headColumn.innerText = attribute;
            this.tableHead.appendChild(headColumn);
          }
        }
      }

      this.updatePlayer(playerData);
    };

    this.updatePlayer = function (playerData) {
      for (var attribute in playerData) {
        var column = document.getElementById('scoreTableColumn' + playerData.id + attribute);
        if (!column) {
          column = document.createElement('td');
          column.id = 'scoreTableColumn' + playerData.id + attribute;
          var row = document.getElementById('scoreTableRow' + playerData.id);
          row.appendChild(column);
        }
        column.innerText = playerData[attribute];
      }
    };

    this.removePlayer = function (playerId) {
      var row = document.getElementById('scoreTableRow' + playerId);
      row.remove();
    };
  };
}());
