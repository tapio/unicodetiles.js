/// File: unicodetiles.js
/// This file contains the main tile engine namespace.

/*jshint trailing:true latedef:true */
/*global document:true */

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
		/// Function getColorHex
		/// Returns the hexadecimal representation of the color
		this.getColorHex = function() {
			if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
				return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
			else return "";
		};
		/// Function getBackgroundHex
		/// Returns the hexadecimal representation of the background color
		this.getBackgroundHex = function() {
			if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
				return "#" + this.br.toString(16) + this.bg.toString(16) + this.bb.toString(16);
			else return "";
		};
		/// Function getColorRGB
		/// Returns the CSS rgb(r,g,b) representation of the color
		this.getColorRGB = function() {
			if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
				return 'rgb('+this.r+','+this.g+','+this.b+')';
			else return "";
		};
		/// Function getBackgroundRGB
		/// Returns the CSS rgb(r,g,b) representation of the background color
		this.getBackgroundRGB = function() {
			if (this.br !== undefined && this.bg !== undefined && this.bb !== undefined)
				return 'rgb('+this.br+','+this.bg+','+this.bb+')';
			else return "";
		};
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
		for (j = 0; j < h; ++j) {
			this.buffer[j] = new Array(w);
			this.spans[j] = new Array(w);
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
			for (var j = 0; j < this.h; ++j) {
				for (var i = 0; i < this.w; ++i) {
					var tile = this.buffer[j][i];
					var span = this.spans[j][i];
					// Check and update colors
					// We use "data-" attributes for storing color info,
					// so that we have a consistent format for it.
					var fg = tile.getColorRGB();
					var bg = tile.getBackgroundRGB();
					if (fg !== span.getAttribute("data-fg") || bg !== span.getAttribute("data-bg")) {
						span.setAttribute("data-fg", fg);
						span.setAttribute("data-bg", bg);
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

		this.clear(); // Init the buffer by clearing it
	},

	/// Class: Engine
	/// The tile engine itself.

	/// Constructor: Engine
	/// Constructs a new Engine object. For the Engine to be functional,
	/// either <setTileFunc> or <setTileArray> must also be called.
	///
	/// Parameters:
	///   win - the ut.Window instance to use as the viewport
	Engine: function(win) {
		"use strict";
		this.window = win;

		/// Function: setTileArray
		/// Sets the array that is used for reading the tiles.
		/// The array must two dimensional (Array of Arrays) containing ut.Tile objects.
		/// This will also undefine the tile function.
		///
		/// Parameters:
		///   arr - the Array of Arrays of ut.Tile
		this.setTileArray = function(arr) { this.tileArray = arr; this.tileFunc = undefined; };

		/// Function: setTileFunc
		/// Sets the function to be called to fetch each tile according to coordinates.
		/// This will also undefine the tile array.
		///
		/// Parameters:
		///   func - function taking parameters (x, y) and returning an ut.Tile
		this.setTileFunc = function(func) { this.tileFunc = func; this.tileArray = undefined; };

		/// Function: setMaskArray
		/// Sets the array that is used for reading masking information.
		/// The array must two dimensional (Array of Arrays) containing booleans (true or false).
		/// If the mask array cell for some coordinates is false, then that tile is not rendered.
		/// This will also undefine the mask function.
		///
		/// Parameters:
		///   arr - the Array of Arrays of booleans
		this.setMaskArray = function(arr) { this.maskArray = arr; this.maskFunc = undefined; };

		/// Function: setMaskFunc
		/// Sets the function to be called to fetch mask information according to coordinates.
		/// If mask function returns false to some coordinates, then that tile is not rendered.
		/// This will also undefine the mask array.
		///
		/// Parameters:
		///   func - function taking parameters (x, y) and returning a true if the tile is visible
		this.setMaskFunc = function(func) { this.maskFunc = func; this.maskArray = undefined; };

		/// Function: setShaderFunc
		/// Sets the function to be called to post process / shade each visible tile.
		///
		/// Parameters:
		///   func - function taking parameters (tile, x, y) and returning an ut.Tile
		this.setShaderFunc = function(func) { this.shaderFunc = func; };

		/// Function: testMask
		/// Returns true if the tile at the given coordinates shoudl be displayed.
		/// This means that either mask array or mask function have returned true, or neither exists.
		this.testMask = function(x, y) {
			if (!this.maskArray) {
				if (!this.maskFunc) return true;
				else return this.maskFunc(x, y);
			} else return this.maskArray[y][x];
		};

		/// Function: getTile
		/// Returns a tile from the tile array at the given coordinates.
		/// If tile array has not been set, uses the tile function.
		/// If neither is set, throws an error.
		this.getTile = function(x, y) {
			if (!this.tileArray) {
				if (!this.tileFunc) throw "No tile array or function set.";
				else return this.tileFunc(x, y);
			} else return this.tileArray[y][x];
		};

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
					if (this.testMask(i+xx, j+yy)) {
						var tile = this.getTile(i+xx,j+yy);
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
