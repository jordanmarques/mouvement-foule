const TILES_SIZE_FULL = 22;
function Tileset(url) {
	this.image = new Image();
	this.image.referenceDuTileset = this;
	this.image.onload = function() {
		this.referenceDuTileset.largeur = this.width / TILES_SIZE_FULL;
	};
	this.image.src = "tilesets/" + url;
}

Tileset.prototype.drawTile = function(numero, context, xDestination, yDestination) {
	var xSourceEnTiles = numero % this.largeur;
	if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;
	var ySourceEnTiles = Math.ceil(numero / this.largeur);
	
	var xSource = (xSourceEnTiles - 1) * TILES_SIZE_FULL;
	var ySource = (ySourceEnTiles - 1) * TILES_SIZE_FULL;
	
	context.drawImage(this.image, xSource, ySource, TILES_SIZE_FULL, TILES_SIZE_FULL, xDestination, yDestination, TILES_SIZE_FULL, TILES_SIZE_FULL);
};
