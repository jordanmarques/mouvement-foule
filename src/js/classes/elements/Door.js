function Door(){
    this.x = null;
    this.y = null;
    this.mouseStock = [];
}

function Door(x, y){
    this.x = x;
    this.y = y;
    this.mouseStock = [];
}

Graph.prototype.getFreePositions = function(door){
  return new Array();
};