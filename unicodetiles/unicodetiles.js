/// File: unicodetiles.js
/// This file contains the main tile engine namespace.
/// All coordinates are assumed to be integers - behaviour is undefined
/// if you feed in floats (or anything other) as x and y (or similar) parameters.

/*jshint trailing:true latedef:true */
/*global document:true */

/// Namespace: ut
/// The tile engine classses etc. are wrapped inside this.
var ut = {

	/// Constants: Semi-internal constants for ut namespace
	/// NULLCHAR - Character used when none is specified otherwise.
	/// CSSCLASS - The CSS class name used for the tile engine element.
	/// NULLTILE - The tile used as placeholder for empty tile.
	NULLCHAR: " ",
	CSSCLASS: "unicodetiles",
	NULLTILE: {} // Initialized properly after the namespace

};


/// Class: Tile
/// Represents a unicode character tile with various attributes.

/// Constructor: Tile
/// Constructs a new Tile object.
///
/// Parameters:
///   ch - a character to display for this tile
///   r - (optional) red color component 0-255
///   g - (optional) green color component 0-255
///   b - (optional) blue color component 0-255
///   br - (optional) red background color component 0-255
///   bg - (optional) green background color component 0-255
///   bb - (optional) blue background color component 0-255
ut.Tile = function(ch, r, g, b, br, bg, bb) {
	"use strict";
	this.ch = ch || ut.NULLCHAR;
	this.r = r;
	this.g = g;
	this.b = b;
	this.br = br;
	this.bg = bg;
	this.bb = bb;
};

	/// Function: getChar
	/// Returns the character of this tile.
	ut.Tile.prototype.getChar = function() { return this.ch; };
	/// Function: setChar
	/// Sets the character of this tile.
	ut.Tile.prototype.setChar = function(ch) { this.ch = ch; };
	/// Function: setColor
	/// Sets the foreground color of this tile.
	ut.Tile.prototype.setColor = function(r, g, b) { this.r = r; this.g = g; this.b = b; };
	/// Function: setGrey
	/// Sets the foreground color to the given shade (0-255) of grey.
	ut.Tile.prototype.setGrey = function(grey) { this.r = grey; this.g = grey; this.b = grey; };
	/// Function: setBackground
	/// Sets the background color of this tile.
	ut.Tile.prototype.setBackground = function(r, g, b) { this.br = r; this.bg = g; this.bb = b; };
	/// Function: resetColor
	/// Clears the color of this tile / assigns default color.
	ut.Tile.prototype.resetColor = function() { this.r = this.g = this.b = undefined; };
	/// Function: resetBackground
	/// Clears the background color of this tile.
	ut.Tile.prototype.resetBackground = function() { this.br = this.bg = this.bb = undefined; };
	/// Function getColorHex
	/// Returns the hexadecimal representation of the color
	ut.Tile.prototype.getColorHex = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
		else return "";
	};
	/// Function getBackgroundHex
	/// Returns the hexadecimal representation of the background color
	ut.Tile.prototype.getBackgroundHex = function() {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return "#" + this.br.toString(16) + this.bg.toString(16) + this.bb.toString(16);
		else return "";
	};
	/// Function getColorRGB
	/// Returns the CSS rgb(r,g,b) representation of the color
	ut.Tile.prototype.getColorRGB = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return 'rgb('+this.r+','+this.g+','+this.b+')';
		else return "";
	};
	/// Function getBackgroundRGB
	/// Returns the CSS rgb(r,g,b) representation of the background color
	ut.Tile.prototype.getBackgroundRGB = function() {
		if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
			return 'rgb('+this.br+','+this.bg+','+this.bb+')';
		else return "";
	};

ut.NULLTILE = new ut.Tile();


/// Class: Viewport
/// The tile engine viewport / renderer / window.

/// Constructor: Viewport
/// Constructs a new Viewport object.
///
/// Parameters:
///   elem - the DOM element which shall be transformed into the tile engine
///   w - (integer) width in tiles
///   h - (integer) height in tiles
ut.Viewport = function(elem, w, h) {
	"use strict";
	this.elem = elem;
	this.elem.innerHTML = "";
	this.w = w;
	this.h = h;
	this.cx = Math.floor(this.w/2);
	this.cy = Math.floor(this.h/2);
	var i, j;

	// Add CSS class if not added already
	if (elem.className.indexOf(ut.CSSCLASS) === -1) {
		if (elem.className.length === 0) elem.className = ut.CSSCLASS;
		else elem.className += " " + ut.CSSCLASS;
	}

	// Create two 2-dimensional arrays to hold the viewport tiles and <span> elements
	this.buffer = new Array(h);
	this.spans = new Array(h);
	this.colors = new Array(h);
	for (j = 0; j < h; ++j) {
		this.buffer[j] = new Array(w);
		this.spans[j] = new Array(w);
		this.colors[j] = new Array(w);
	}

	// Create a matrix of <span> elements, cache references
	for (j = 0; j < this.h; ++j) {
		for (i = 0; i < this.w; ++i) {
			this.spans[j][i] = document.createElement("span");
			this.elem.appendChild(this.spans[j][i]);
		}
		// Line break
		this.spans[j].push(document.createElement("br"));
		this.elem.appendChild(this.spans[j][this.w]);
	}
};

	/// Function: put
	/// Puts a tile to the given coordinates.
	/// Checks bounds and does nothing if invalid coordinates are given.
	///
	/// Parameters:
	///   tile - the tile to put
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	ut.Viewport.prototype.put = function(tile, x, y) {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
		this.buffer[y][x] = tile;
	};

	/// Function: unsafePut
	/// Puts a tile to the given coordinates.
	/// Does *not* check bounds; throws exception if invalid coordinates are given.
	///
	/// Parameters:
	///   tile - the tile to put
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	ut.Viewport.prototype.unsafePut = function(tile, x, y) {
		this.buffer[y][x] = tile;
	};

	/// Function: get
	/// Returns the tile in the given coordinates.
	/// Checks bounds and returns empty tile if invalid coordinates are given.
	///
	/// Parameters:
	///   x - (integer) x coordinate
	///   y - (integer) y coordinate
	///
	/// Returns:
	///   The tile.
	ut.Viewport.prototype.get = function(x, y) {
		if (x < 0 || y < 0 || x >= this.w || y >= this.h) return ut.NULLTILE;
		return this.buffer[y][x];
	};

	/// Function: clear
	/// Clears the viewport buffer by assigning empty tiles.
	ut.Viewport.prototype.clear = function() {
		for (var j = 0; j < this.h; ++j) {
			for (var i = 0; i < this.w; ++i) {
				this.buffer[j][i] = ut.NULLTILE;
				this.colors[j][i] = "";
			}
		}
	};

	/// Function: render
	/// Renders the buffer as html to the element specified at construction.
	ut.Viewport.prototype.render = function() {
		for (var j = 0; j < this.h; ++j) {
			for (var i = 0; i < this.w; ++i) {
				var tile = this.buffer[j][i];
				var span = this.spans[j][i];
				// Check and update colors
				var fg = tile.getColorRGB();
				var bg = tile.getBackgroundRGB();
				var colorHash = fg + bg;
				if (colorHash !== this.colors[j][i]) {
					this.colors[j][i] = colorHash;
					span.style.color = fg;
					span.style.backgroundColor = bg;
				}
				// Check and update character
				var ch = tile.getChar();
				if (ch !== span.innerHTML)
					span.innerHTML = ch;
			}
		}
	};


/// Class: Engine
/// The tile engine itself.

/// Constructor: Engine
/// Constructs a new Engine object. If width or height is given,
/// it will not attempt to fetch tiles outside the boundaries.
/// In that case 0,0 is assumed as the upper-left corner of the world,
/// but if no width/height is given also negative coords are valid.
///
/// Parameters:
///   vp - the ut.Viewport instance to use as the viewport
///   func - the function used for fetching tiles
///   w - (integer) (optional) world width in tiles
///   h - (integer) (optional) world height in tiles
ut.Engine = function(vp, func, w, h) {
	"use strict";
	this.viewport = vp;
	this.tileFunc = func;
	this.w = w;
	this.h = h;
};

	/// Function: setTileFunc
	/// Sets the function to be called with coordinates to fetch each tile.
	///
	/// Parameters:
	///   func - function taking parameters (x, y) and returning an ut.Tile
	ut.Engine.prototype.setTileFunc = function(func) { this.tileFunc = func; };

	/// Function: setMaskFunc
	/// Sets the function to be called to fetch mask information according to coordinates.
	/// If mask function returns false to some coordinates, then that tile is not rendered.
	///
	/// Parameters:
	///   func - function taking parameters (x, y) and returning a true if the tile is visible
	ut.Engine.prototype.setMaskFunc = function(func) { this.maskFunc = func; };

	/// Function: setShaderFunc
	/// Sets the function to be called to post process / shade each visible tile.
	///
	/// Parameters:
	///   func - function taking parameters (tile, x, y) and returning an ut.Tile
	ut.Engine.prototype.setShaderFunc = function(func) { this.shaderFunc = func; };

	/// Function: update
	/// Updates the viewport according to the given player coordinates.
	/// The algorithm goes as follows:
	///   * Record the current time
	///   * For each viewport tile:
	///   * Check if the tile is visible by testing the mask
	///   * If not visible, continue to the next tile in the viewport
	///   * Otherwise, fetch the tile and check for shader function presence
	///   * If there is shader function, apply it to the tile, passing the recorded time
	///   * Put the tile to viewport
	///
	/// Parameters:
	///   x - (integer) viewport center x coordinate in the tile world
	///   y - (integer) viewport center y coordinate in the tile world
	ut.Engine.prototype.update = function(x, y) {
		x = x || 0;
		y = y || 0;
		var xx = x - this.viewport.cx;
		var yy = y - this.viewport.cy;
		var timeNow = new Date().getTime();
		for (var j = 0; j < this.viewport.h; ++j) {
			for (var i = 0; i < this.viewport.w; ++i) {
				var ixx = i+xx, jyy = j+yy;
				// Check horizontal bounds if requested
				if (this.w && (ixx < 0 || ixx >= this.w)) {
					this.viewport.unsafePut(ut.NULLTILE, i, j);
				// Check vertical bounds if requested
				} else if (this.h && (jyy < 0 || jyy >= this.w)) {
					this.viewport.unsafePut(ut.NULLTILE, i, j);
				// Check mask
				} else if (!this.maskFunc || this.maskFunc(ixx, jyy)) {
					var tile = this.tileFunc(ixx,jyy);
					if (this.shaderFunc)
						tile = this.shaderFunc(tile, ixx, jyy, timeNow);
					this.viewport.unsafePut(tile, i, j);
				} else this.viewport.unsafePut(ut.NULLTILE, i, j);
			}
		}
	};
