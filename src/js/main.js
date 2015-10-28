var ts = new Tileset("basique2.png");

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
    ts.dessinerTile(1, ctx, 10, 10);
    ts.dessinerTile(2, ctx, 50, 10);
    ts.dessinerTile(3, ctx, 90, 10);
    ts.dessinerTile(4, ctx, 130, 10);
    ts.dessinerTile(5, ctx, 170, 10);

}
