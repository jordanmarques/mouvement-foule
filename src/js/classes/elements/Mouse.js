function Mouse(){
    this.x = null;
    this.y = null;
    this.path = null;
    this.waiting = false;
}

Mouse.prototype.ComputeShortestPath = function(arrayOfCheeses, graph){
    var i = 0;
    var reference = astar.search(graph, graph.grid[this.y][this.x], graph.grid[arrayOfCheeses[i].y][arrayOfCheeses[i].x]);
    i++;
    for(i; i < arrayOfCheeses.length; i++){
        var number = astar.search(graph, graph.grid[this.y][this.x], graph.grid[arrayOfCheeses[i].y][arrayOfCheeses[i].x]);
        if(number.length < reference.length){
            reference = number;
        }
    }
    return reference;
};