
/// Namespace: ut
/// The tile engine classses etc. are wrapped inside this.
var ut = {

	/// Constants: Unicodetiles constants
	/// NULLCHAR - Character used when none is specified otherwise.
	/// CSSCLASS - The CSS class name used for the tile engine element.
	NULLCHAR: " ",
	CSSCLASS: "unicodetiles",

	/// Class: Tile
	/// Represents a unicode character tile with various attributes.

	/// Constructor: Tile
	/// Constructs a new Tile object.
	///
	/// Parameters:
	///   ch - a character to display for this tile
	///   r - (optional) red color component
	///   g - (optional) green color component
	///   b - (optional) blue color component
	///   br - (optional) red background color component
	///   bg - (optional) green background color component
	///   bb - (optional) blue background color component
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
		/// The html representation of the tile.
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

		this.getChar = function() { return this.ch; };
		this.setChar = function(ch) { this.ch = ch; };
		this.setColor = function(r, g, b) { this.r = r; this.g = g; this.b = b; };
		this.setGrey = function(grey) { this.r = grey; this.g = grey; this.b = grey; };
		this.setBackground = function(r, g, b) { this.br = r; this.bg = g; this.bb = b; };
		this.resetColor = function() { this.r = this.g = this.b = undefined; };
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

		this.put = function(tile, x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
			this.buffer[y][x] = tile;
		};

		this.unsafePut = function(tile, x, y) {
			this.buffer[y][x] = tile;
		};

		this.get = function(x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return new ut.Tile();
			return this.buffer[y][x];
		};

		this.clear = function() {
			for (var j = 0; j < this.h; ++j)
				for (var i = 0; i < this.w; ++i)
					this.buffer[j][i] = ut.NULLCHAR;
		};

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

		this.clear();
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
		///   func - function taking parameters (x, y) and returning a ut.Tile
		this.setTileFunc = function(func) { this.maskFunc = func; };

		/// Function: setMaskFunc
		/// Sets the function to be called to fetch mask information according to coordinates.
		///
		/// Parameters:
		///   func - function taking parameters (x, y) and returning a true if the tile is visible
		this.setMaskFunc = function(func) { this.maskFunc = func; };

		/// Function: render
		/// Updates the window according to the given player coordinates.
		this.update = function(x, y) {
			x = x || 0;
			y = y || 0;
			var xx = x - this.window.cx;
			var yy = y - this.window.cy;
			for (var j = 0; j < this.window.h; ++j) {
				for (var i = 0; i < this.window.w; ++i) {
					if (!this.maskFunc || this.maskFunc(i+xx, j+yy))
						this.window.unsafePut(this.tileFunc(i+xx,j+yy), i, j);
					else this.window.unsafePut(ut.NULLCHAR, i, j);
				}
			}
		};

	}
};
