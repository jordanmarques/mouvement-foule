function Door() {
    this.x = null;
    this.y = null;
    this.mouseStock = [];
}

function Door(x, y) {
    this.x = x;
    this.y = y;
    this.mouseStock = [];
}

Graph.prototype.getFreePositionsArroundDoor = function (door) {
    var freePosition = [];
    var doorX = door.x;
    var doorY = door.y;
    if (this[doorX-1][doorY-1] == 1 || this[doorX-1][doorY-1] == 2) freePosition.push(new Position(doorX-1, doorY-1));
    if (this[doorX][doorY+1] == 1 || this[doorX][doorY+1] == 2) freePosition.push(new Position(doorX, doorY+1));
    if (this[doorX+1][doorY-1] == 1 || this[doorX+1][doorY-1] == 2) freePosition.push(new Position(doorX+1, doorY-1));
    if (this[doorX-1][doorY] == 1 || this[doorX-1][doorY] == 2) freePosition.push(new Position(doorX-1, doorY));
    if (this[doorX+1][doorY] == 1 || this[doorX+1][doorY] == 2) freePosition.push(new Position(doorX+1, doorY));
    if (this[doorX-1][doorY+1] == 1 || this[doorX-1][doorY+1] == 2) freePosition.push(new Position(doorX-1, doorY+1));
    if (this[doorX][doorY-1] == 1 || this[doorX][doorY-1] == 2) freePosition.push(new Position(doorX, doorY-1));
    if (this[doorX+1][doorY+1] == 1 || this[doorX+1][doorY+1] == 2) freePosition.push(new Position(doorX+1, doorY+1));

    return freePosition;
};

Door.prototype.initMouseStock = function (numberOfMouses) {
    for (var i = 0; i < numberOfMouses; i++) {
        var mouse = new Mouse();
        this.mouseStock.push(mouse);
    }
};