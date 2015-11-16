const TILES_SIZE_FULL = 22;
function Tileset(url) {
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuTileset = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		
		// Largeur du tileset en tiles
		this.referenceDuTileset.largeur = this.width / TILES_SIZE_FULL;
	};
	this.image.src = "tilesets/" + url;
}

// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées x et y
Tileset.prototype.drawTile = function(numero, context, xDestination, yDestination) {
	var xSourceEnTiles = numero % this.largeur;
	if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;
	var ySourceEnTiles = Math.ceil(numero / this.largeur);
	
	var xSource = (xSourceEnTiles - 1) * TILES_SIZE_FULL;
	var ySource = (ySourceEnTiles - 1) * TILES_SIZE_FULL;
	
	context.drawImage(this.image, xSource, ySource, TILES_SIZE_FULL, TILES_SIZE_FULL, xDestination, yDestination, TILES_SIZE_FULL, TILES_SIZE_FULL);
};
