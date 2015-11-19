(function(definition) {
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.astar = exports.astar;
        window.Graph = exports.Graph;
    }
})(function() {
    function pathTo(node){
        var current = node,
            path = [];
        while(current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }

    function getHeap() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    }

    var astar = {
        search: function(graph, start, end, options) {
            graph.cleanDirty();
            options = options || {};
            var heuristic = options.heuristic || astar.heuristics.front,
                closest = options.closest || false;

            var openHeap = getHeap(),
                closestNode = start;

            start.h = heuristic(start, end);

            openHeap.push(start);

            while(openHeap.size() > 0) {

                var currentNode = openHeap.pop();

                if(currentNode === end) {
                    return pathTo(currentNode);
                }

                currentNode.closed = true;

                var neighbors = graph.neighbors(currentNode);

                for (var i = 0, il = neighbors.length; i < il; ++i) {
                    var neighbor = neighbors[i];

                    if (neighbor.closed || neighbor.isWall()) {
                        continue;
                    }

                    var gScore = currentNode.g + neighbor.getCost(currentNode),
                        beenVisited = neighbor.visited;

                    if (!beenVisited || gScore < neighbor.g) {

                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h || heuristic(neighbor, end);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
                        graph.markDirty(neighbor);
                        if (closest) {
                            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                                closestNode = neighbor;
                            }
                        }

                        if (!beenVisited) {
                            openHeap.push(neighbor);
                        }
                        else {
                            openHeap.rescoreElement(neighbor);
                        }
                    }
                }
            }

            if (closest) {
                return pathTo(closestNode);
            }

            return [];
        },
        heuristics: {
            front: function(pos0, pos1) {
                var d1 = Math.abs(pos1.x - pos0.x);
                var d2 = Math.abs(pos1.y - pos0.y);
                return d1 + d2;
            },
            diagonal: function(pos0, pos1) {
                var D = 1;
                var D2 = Math.sqrt(2);
                var d1 = Math.abs(pos1.x - pos0.x);
                var d2 = Math.abs(pos1.y - pos0.y);
                return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
            }
        },
        cleanNode:function(node){
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    };

    function Graph(gridIn, options) {
        options = options || {};
        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.grid = [];
        for (var x = 0; x < gridIn.length; x++) {
            this.grid[x] = [];

            for (var y = 0, row = gridIn[x]; y < row.length; y++) {
                var node = new GridNode(x, y, row[y]);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }
        this.init();
    }

    Graph.prototype.init = function() {
        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            astar.cleanNode(this.nodes[i]);
        }
    };

    Graph.prototype.cleanDirty = function() {
        for (var i = 0; i < this.dirtyNodes.length; i++) {
            astar.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
    };

    Graph.prototype.markDirty = function(node) {
        this.dirtyNodes.push(node);
    };

    Graph.prototype.neighbors = function(node) {
        var ret = [],
            x = node.x,
            y = node.y,
            grid = this.grid;

        if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }

        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }

        if(grid[x] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }

        if(grid[x] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }

        if (this.diagonal) {
            if(grid[x-1] && grid[x-1][y-1]) {
                ret.push(grid[x-1][y-1]);
            }

            if(grid[x+1] && grid[x+1][y-1]) {
                ret.push(grid[x+1][y-1]);
            }

            if(grid[x-1] && grid[x-1][y+1]) {
                ret.push(grid[x-1][y+1]);
            }

            if(grid[x+1] && grid[x+1][y+1]) {
                ret.push(grid[x+1][y+1]);
            }
        }

        return ret;
    };

    Graph.prototype.toString = function() {
        var graphString = [],
            nodes = this.grid,
            rowDebug, row, y, l;
        for (var x = 0, len = nodes.length; x < len; x++) {
            rowDebug = [];
            row = nodes[x];
            for (y = 0, l = row.length; y < l; y++) {
                rowDebug.push(row[y].weight);
            }
            graphString.push(rowDebug.join(" "));
        }
        return graphString.join("\n");
    };

    function GridNode(x, y, weight) {
        this.x = x;
        this.y = y;
        this.weight = weight;
    }

    GridNode.prototype.toString = function() {
        return "[" + this.x + " " + this.y + "]";
    };

    GridNode.prototype.getCost = function(fromNeighbor) {
        if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
            return this.weight * 1.41421;
        }
        return this.weight;
    };

    GridNode.prototype.isWall = function() {
        return this.weight === 0;
    };

    function BinaryHeap(scoreFunction){
        this.content = [];
        this.scoreFunction = scoreFunction;
    }

    BinaryHeap.prototype = {
        push: function(element) {
            this.content.push(element);

            this.sinkDown(this.content.length - 1);
        },
        pop: function() {
            var result = this.content[0];
            var end = this.content.pop();
            if (this.content.length > 0) {
                this.content[0] = end;
                this.bubbleUp(0);
            }
            return result;
        },
        remove: function(node) {
            var i = this.content.indexOf(node);

            var end = this.content.pop();

            if (i !== this.content.length - 1) {
                this.content[i] = end;

                if (this.scoreFunction(end) < this.scoreFunction(node)) {
                    this.sinkDown(i);
                }
                else {
                    this.bubbleUp(i);
                }
            }
        },
        size: function() {
            return this.content.length;
        },
        rescoreElement: function(node) {
            this.sinkDown(this.content.indexOf(node));
        },
        sinkDown: function(n) {
            var element = this.content[n];

            while (n > 0) {

                var parentN = ((n + 1) >> 1) - 1,
                    parent = this.content[parentN];
                if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                    this.content[parentN] = element;
                    this.content[n] = parent;
                    n = parentN;
                }

                else {
                    break;
                }
            }
        },
        bubbleUp: function(n) {

            var length = this.content.length,
                element = this.content[n],
                elemScore = this.scoreFunction(element);

            while(true) {

                var child2N = (n + 1) << 1,
                    child1N = child2N - 1;

                var swap = null,
                    child1Score;

                if (child1N < length) {

                    var child1 = this.content[child1N];
                    child1Score = this.scoreFunction(child1);

                    if (child1Score < elemScore){
                        swap = child1N;
                    }
                }

                if (child2N < length) {
                    var child2 = this.content[child2N],
                        child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap === null ? elemScore : child1Score)) {
                        swap = child2N;
                    }
                }

                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = element;
                    n = swap;
                }
                else {
                    break;
                }
            }
        }
    };

    return {
        astar: astar,
        Graph: Graph
    };

});