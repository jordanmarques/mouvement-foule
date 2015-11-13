function Door() {
    this.x = null;
    this.y = null;
    this.mouseStock = [];
    this.isEmpty = false;
}

function Door(x, y) {
    this.x = x;
    this.y = y;
    this.mouseStock = [];
    this.isEmpty = false;
}

Array.prototype.getFreePositionsArroundDoor = function (door) {
    var freePosition = [];
    var doorX = door.x;
    var doorY = door.y;
    if (this[doorY-1][doorX-1].weight == 1 || this[doorY-1][doorX-1].weight == 2) freePosition.push(new Position(doorX-1, doorY-1));
    if (this[doorY-1][doorX].weight == 1 || this[doorY-1][doorX].weight == 2) freePosition.push(new Position(doorX, doorY-1));
    if (this[doorY-1][doorX+1].weight == 1 || this[doorY-1][doorX+1].weight == 2) freePosition.push(new Position(doorX+1, doorY-1));
    if (this[doorY][doorX-1].weight == 1 || this[doorY][doorX-1].weight == 2) freePosition.push(new Position(doorX-1, doorY));
    if (this[doorY][doorX+1].weight == 1 || this[doorY][doorX+1].weight == 2) freePosition.push(new Position(doorX+1, doorY));
    if (this[doorY+1][doorX-1].weight == 1 || this[doorY+1][doorX-1].weight == 2) freePosition.push(new Position(doorX-1, doorY+1));
    if (this[doorY+1][doorX].weight == 1 || this[doorY+1][doorX].weight == 2) freePosition.push(new Position(doorX, doorY+1));
    if (this[doorY+1][doorX+1].weight == 1 || this[doorY+1][doorX+1].weight == 2) freePosition.push(new Position(doorX+1, doorY+1));

    return freePosition;
};

Door.prototype.initMouseStock = function (numberOfMouses) {
    for (var i = 0; i < numberOfMouses; i++) {
        var mouse = new Mouse();
        this.mouseStock.push(mouse);
    }
};