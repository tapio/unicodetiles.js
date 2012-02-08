/// File: unicodetiles.js
/// This file contains the main tile engine namespace.

/// Namespace: ut
/// The tile engine classses etc. are wrapped inside this.
var ut = {

	/// Constants: Semi-internal constants for ut namespace
	/// NULLCHAR - Character used when none is specified otherwise.
	/// CSSCLASS - The CSS class name used for the tile engine element.
	/// NULLTILE - The tile used as placeholder for empty tile
	NULLCHAR: " ",
	CSSCLASS: "unicodetiles",
	NULLTILE: {}, // Initialized properly after the namespace

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
	Tile: function(ch, r, g, b, br, bg, bb) {
		"use strict";
		this.ch = ch || ut.NULLCHAR;
		this.r = r; 
		this.g = g;
		this.b = b;
		this.br = br;
		this.bg = bg;
		this.bb = bb;

		/// Function: html
		/// Composes and returns the html representation of the tile.
		///
		/// Returns:
		///   The html representation of the tile.
		this.html = function() {
			// Check if we have foreground / background colors
			var fc = (this.r !== undefined && this.g !== undefined && this.b !== undefined);
			var bc = (this.br !== undefined && this.bg !== undefined && this.bb !== undefined);
			// If no coloring, just return the char
			if (!fc && !bc) return this.ch;
			// Inline CSS for coloring
			var ret = '<span style="';
			if (fc) ret += 'color:rgb('+this.r+','+this.g+','+this.b+');';
			if (bc) ret += 'background-color:rgb('+this.br+','+this.bg+','+this.bb+');';
			ret += '">' + this.ch + '</span>';
			return ret;
		};

		/// Function: getChar
		/// Returns the character of this tile.
		this.getChar = function() { return this.ch; };
		/// Function: setChar
		/// Sets the character of this tile.
		this.setChar = function(ch) { this.ch = ch; };
		/// Function: setColor
		/// Sets the foreground color of this tile.
		this.setColor = function(r, g, b) { this.r = r; this.g = g; this.b = b; };
		/// Function: setGrey
		/// Sets the foreground color to the given shade (0-255) of grey.
		this.setGrey = function(grey) { this.r = grey; this.g = grey; this.b = grey; };
		/// Function: setBackground
		/// Sets the background color of this tile.
		this.setBackground = function(r, g, b) { this.br = r; this.bg = g; this.bb = b; };
		/// Function: resetColor
		/// Clears the color of this tile / assigns default color.
		this.resetColor = function() { this.r = this.g = this.b = undefined; };
		/// Function: resetBackground
		/// Clears the background color of this tile.
		this.resetBackground = function() { this.br = this.bg = this.bb = undefined; };
	},

	/// Class: Viewport
	/// The tile engine viewport / renderer / window.

	/// Constructor: Viewport
	/// Constructs a new Viewport object.
	///
	/// Parameters:
	///   elem - the DOM element which shall be transformed into the tile engine
	///   w - width in tiles
	///   h - height in tiles
	Viewport: function(elem, w, h) {
		"use strict";
		this.elem = elem;
		this.w = w;
		this.h = h;
		this.cx = Math.floor(this.w/2);
		this.cy = Math.floor(this.h/2);

		// Add CSS class if not added already
		if (elem.className.indexOf(ut.CSSCLASS) === -1) {
			if (elem.className.length === 0) elem.className = ut.CSSCLASS;
			else elem.className += " " + ut.CSSCLASS;
		}

		// Create 2-dimensional array to hold the viewport tiles
		this.buffer = new Array(h);
		for (var j = 0; j < h; ++j)
			this.buffer[j] = new Array(w);

		/// Function: put
		/// Puts a tile to the given coordinates.
		/// Checks bounds and does nothing if invalid coordinates are given.
		///
		/// Parameters:
		///   tile - the tile to put
		///   x - x coordinate
		///   y - y coordinate
		this.put = function(tile, x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
			this.buffer[y][x] = tile;
		};

		/// Function: unsafePut
		/// Puts a tile to the given coordinates.
		/// Does *not* check bounds; throws exception if invalid coordinates are given.
		///
		/// Parameters:
		///   tile - the tile to put
		///   x - x coordinate
		///   y - y coordinate
		this.unsafePut = function(tile, x, y) {
			this.buffer[y][x] = tile;
		};

		/// Function: get
		/// Returns the tile in the given coordinates.
		/// Checks bounds and returns empty tile if invalid coordinates are given.
		///
		/// Parameters:
		///   x - x coordinate
		///   y - y coordinate
		///
		/// Returns:
		///   The tile.
		this.get = function(x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return ut.NULLTILE;
			return this.buffer[y][x];
		};

		/// Function: clear
		/// Clears the viewport buffer by assigning empty tiles.
		this.clear = function() {
			for (var j = 0; j < this.h; ++j)
				for (var i = 0; i < this.w; ++i)
					this.buffer[j][i] = ut.NULLTILE;
		};

		/// Function: render
		/// Renders the buffer as html to the element specified at construction.
		this.render = function() {
			var html = "";
			for (var j = 0; j < this.h; ++j) {
				for (var i = 0; i < this.w; ++i) {
					var tile = this.buffer[j][i];
					if (tile.html) html += tile.html(); // Real tile
					else html += tile; // Assumes string
				}
				html += "\n";
			}
			this.elem.innerHTML = html;
		};

		this.clear(); // Init the buffer by clearing it
	},

	/// Class: Engine
	/// The tile engine itself.

	/// Constructor: Engine
	/// Constructs a new Engine object.
	///
	/// Parameters:
	///   win - the ut.Window instance to use as the viewport
	///   tileFunc - the function used for fetching tiles
	Engine: function(win, tileFunc) {
		"use strict";
		this.window = win;
		this.tileFunc = tileFunc;

		/// Function: setTileFunc
		/// Sets the function to be called to fetch each tile according to coordinates.
		///
		/// Parameters:
		///   func - function taking parameters (x, y) and returning an ut.Tile
		this.setTileFunc = function(func) { this.maskFunc = func; };

		/// Function: setMaskFunc
		/// Sets the function to be called to fetch mask information according to coordinates.
		/// If mask function returns false to some coordinates, then that tile is not rendered.
		///
		/// Parameters:
		///   func - function taking parameters (x, y) and returning a true if the tile is visible
		this.setMaskFunc = function(func) { this.maskFunc = func; };

		/// Function: setShaderFunc
		/// Sets the function to be called to psot process / shade each visible tile.
		///
		/// Parameters:
		///   func - function taking parameters (tile, x, y) and returning an ut.Tile
		this.setShaderFunc = function(func) { this.shaderFunc = func; };

		/// Function: render
		/// Updates the window according to the given player coordinates.
		this.update = function(x, y) {
			x = x || 0;
			y = y || 0;
			var xx = x - this.window.cx;
			var yy = y - this.window.cy;
			var timeNow = new Date().getTime();
			for (var j = 0; j < this.window.h; ++j) {
				for (var i = 0; i < this.window.w; ++i) {
					if (!this.maskFunc || this.maskFunc(i+xx, j+yy)) {
						var tile = this.tileFunc(i+xx,j+yy);
						if (this.shaderFunc)
							tile = this.shaderFunc(tile, i+xx, j+yy, timeNow);
						this.window.unsafePut(tile, i, j);
					} else this.window.unsafePut(ut.NULLTILE, i, j);
				}
			}
		};
	}
};

ut.NULLTILE = new ut.Tile();
