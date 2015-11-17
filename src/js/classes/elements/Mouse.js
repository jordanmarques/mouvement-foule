function Mouse(){
    this.x = null;
    this.y = null;
    this.path = null;
    this.waiting = false;
    this.previousTiles = null
    this.grass = false;
}

Mouse.prototype.ComputeShortestPath = function(arrayOfCheeses, immutableGraph){
    var i = 0;
    var reference = astar.search(immutableGraph, immutableGraph.grid[this.y][this.x], immutableGraph.grid[arrayOfCheeses[i].y][arrayOfCheeses[i].x]);
    i++;
    for(i ; i < arrayOfCheeses.length; i++){
        var number = astar.search(immutableGraph, immutableGraph.grid[this.y][this.x], immutableGraph.grid[arrayOfCheeses[i].y][arrayOfCheeses[i].x]);
        if(!(number.length == 0 || reference.length == 0)){
            if(number.length < reference.length){
                reference = number;
            }
        }

    }
    return reference;
};