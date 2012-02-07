
/// Namespace: UT
/// The tile engine classses etc. are wrapped inside this.
var UT = {

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
	///   char - a character to display for this tile
	///   r - (optional) red color component
	///   g - (optional) green color component
	///   b - (optional) blue color component
	///   br - (optional) red background color component
	///   bg - (optional) green background color component
	///   bb - (optional) blue background color component
	Tile: function(char, r, g, b, br, bg, bb) {
		"use strict";
		this.char = char || UT.NULLCHAR;
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
			if (!fc && !bc) return this.char;
			// Inline CSS for coloring
			var ret = '<span style="';
			if (fc) ret += 'color:rgb('+this.r+','+this.g+','+this.b+');';
			if (bc) ret += 'background-color:rgb('+this.br+','+this.bg+','+this.bb+');';
			ret += '">' + this.char + '</span>';
			return ret;
		};

		this.getChar = function() { return this.char; };
		this.setChar = function(char) { this.char = char; };
		this.setColor = function(r, g, b) { this.r = r; this.g = g; this.b = b; };
		this.setGrey = function(grey) { this.r = grey; this.g = grey; this.b = grey; };
		this.setBackground = function(r, g, b) { this.br = r; this.bg = g; this.bb = b; };
		this.resetColor = function() { this.r = undefined; this.g = undefined; this.b = undefined; };
		this.resetBackground = function() { this.br = undefined; this.bg = undefined; this.bb = undefined; };
	},


	/// Class: Window
	/// The tile engine viewport / container / "the thing".

	/// Constructor: Window
	/// Constructs a new Window object.
	///
	/// Parameters:
	///   elem - the DOM element which shall be transformed into the tile engine
	///   w - width in tiles
	///   h - height in tiles
	Window: function(elem, w, h) {
		"use strict";
		this.elem = elem;
		this.w = w;
		this.h = h;
		this.cx = Math.floor(this.w/2);
		this.cy = Math.floor(this.h/2);

		// Add CSS class if not added already
		if (elem.className.indexOf(UT.CSSCLASS) === -1) {
			if (elem.className.length === 0) elem.className = UT.CSSCLASS;
			else elem.className += " " + UT.CSSCLASS;
		}

		this.buffer = new Array(h);
		for (var j = 0; j < h; ++j)
			this.buffer[j] = new Array(w);

		this.put = function(tile, x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
			this.buffer[y][x] = tile;
		};

		this.get = function(x, y) {
			x = Math.round(x);
			y = Math.round(y);
			if (x < 0 || y < 0 || x >= this.w || y >= this.h) return new UT.Tile();
			return this.buffer[y][x];
		};

		this.proceduralFill = function(func, offsetx, offsety) {
			offsetx = offsetx || 0;
			offsety = offsety || 0;
			for (var j = 0; j < this.h; ++j)
				for (var i = 0; i < this.w; ++i)
					this.buffer[j][i] = func(i+offsetx, j+offsety);
		};

		this.clear = function(char) {
			for (var j = 0; j < this.h; ++j)
				for (var i = 0; i < this.w; ++i)
					this.buffer[j][i] = new UT.Tile(char);
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
	}

};
