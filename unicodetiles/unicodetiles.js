/// File: unicodetiles.js
/// This file contains the main tile engine namespace.
/// All coordinates are assumed to be integers - behaviour is undefined
/// if you feed in floats (or anything other) as x and y (or similar) parameters.

/*jshint browser:true trailing:true latedef:true */

/// Namespace: ut
/// Container namespace.
var ut = ut || {};

/// Constants: Semi-internal constants for ut namespace
/// NULLCHAR - Character used when none is specified otherwise.
/// CSSCLASS - The CSS class name used for the tile engine element.
/// NULLTILE - The tile used as placeholder for empty tile.
ut.NULLCHAR = " ";
ut.CSSCLASS = "unicodetiles";
ut.NULLTILE = {}; // Initialized properly after ut.Tile is defined

/// Class: Tile
/// Represents a unicode character tile with various attributes.

/// Constructor: Tile
/// Constructs a new Tile object.
///
/// Parameters:
///   ch - a character to display for this tile
///   r - (optional) red foregorund color component 0-255
///   g - (optional) green foreground color component 0-255
///   b - (optional) blue foreground color component 0-255
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
	/// Function getColorJSON
	/// Returns the JSON representation of the color, i.e. object { r, g, b }
	ut.Tile.prototype.getColorJSON = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.r, "g": this.g, "b": this.b };
		else return {};
	};
	/// Function getBackgroundJSON
	/// Returns the JSON representation of the background color, i.e. object { r, g, b }
	ut.Tile.prototype.getBackgroundJSON = function() {
		if (this.r !== undefined && this.g !== undefined && this.b !== undefined)
			return { "r": this.br, "g": this.bg, "b": this.bb };
		else return {};
	};

ut.NULLTILE = new ut.Tile();


/// Class: Viewport
/// The tile engine viewport / renderer / window.

/// Constructor: Viewport
/// Constructs a new Viewport object.
/// If you wish to display a player character at the center, you should use odd sizes.
///
/// Parameters:
///   elem - the DOM element which shall be transformed into the tile engine
///   w - (integer) width in tiles
///   h - (integer) height in tiles
///   renderer - (optional) choose rendering engine, see <Viewport.setRenderer>, defaults to "auto".
ut.Viewport = function(elem, w, h, renderer) {
	"use strict";
	this.elem = elem;
	this.elem.innerHTML = "";
	this.w = w;
	this.h = h;
	this.cx = Math.floor(this.w/2);
	this.cy = Math.floor(this.h/2);
	var i, j;
	renderer = renderer || "auto";

	// Add CSS class if not added already
	if (elem.className.indexOf(ut.CSSCLASS) === -1) {
		if (elem.className.length === 0) elem.className = ut.CSSCLASS;
		else elem.className += " " + ut.CSSCLASS;
	}

	// Create two 2-dimensional array to hold the viewport tiles
	this.buffer = new Array(h);
	for (j = 0; j < h; ++j)
		this.buffer[j] = new Array(w);

	/// Function: updateStyle
	/// If the style of the parent element is modified, this needs to be called.
	this.updateStyle = function() {
		var s = window.getComputedStyle(this.elem, null);
		this.ctx.font = s.fontSize + "/" + s.lineHeight + " " + s.fontFamily;
		this.ctx.textBaseline = "middle";
		this.tw = this.ctx.measureText("M").width;
		this.th = parseInt(s.fontSize, 10);
		this.defaultColor = s.color;
		this.defaultBackground = s.backgroundColor;
	};

	/// Function: setRenderer
	/// Switch renderer at runtime. All methods fallback to "dom" if unsuccesful.
	/// Possible values:
	///   * "canvas" - Use HTML5 <canvas> element
	///   * "dom" - Use regular HTML element manipulation through DOM
	///   * "auto" - Use best available, currently same as "canvas"
	this.setRenderer = function(newrenderer) {
		// Reset stuff
		this.elem.innerHTML = "";
		this.spans = this.canvas = this.offscreen = this.ctx = this.ctx2 = undefined;
		// Canvas
		if (newrenderer === "auto" || newrenderer === "canvas") {
			// Create the visible canvas
			this.canvas = document.createElement("canvas");
			if (!!(this.canvas.getContext && this.canvas.getContext('2d') && this.canvas.getContext('2d').fillText)) {
				this.elem.appendChild(this.canvas);
				// Create an offscreen canvas for rendering
				this.offscreen = document.createElement("canvas");
				this.ctx = this.offscreen.getContext("2d");
				this.ctx2 = this.canvas.getContext("2d");
				this.updateStyle();
				this.canvas.width = this.tw * w;
				this.canvas.height = this.th * h;
				this.offscreen.width = this.canvas.width;
				this.offscreen.height = this.canvas.height;
				// Doing this again since setting canvas w/h resets the state
				this.updateStyle();
				return;
			} else {
				// Canvas failed
				this.canvas = undefined;
				newrenderer = "dom";
			}
		}

		// If we got here, all other methods have failed, or DOM was requested
		// Create a matrix of <span> elements, cache references
		this.spans = new Array(h);
		this.colors = new Array(h);
		for (j = 0; j < this.h; ++j) {
			this.spans[j] = new Array(w);
			this.colors[j] = new Array(w);
			for (i = 0; i < this.w; ++i) {
				this.spans[j][i] = document.createElement("div");
				this.elem.appendChild(this.spans[j][i]);
			}
			// Line break
			this.spans[j].push(document.createElement("br"));
			this.elem.appendChild(this.spans[j][this.w]);
		}
	};

	this.setRenderer(renderer);
};

	/// Function: getRendererString
	/// Gets the currently used renderer.
	///
	/// Returns:
	///   "canvas" if the HTML5 <canvas> renderer is used, "dom" otherwise.
	ut.Viewport.prototype.getRendererString = function() {
		if (this.ctx && this.ctx2 && this.canvas && this.offscreen)
			return "canvas";
		return "dom";
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

	/// Function: putString
	/// Creates a row of tiles with the chars of the given string.
	/// Wraps to next line if it can't fit the chars on one line.
	///
	/// Parameters:
	///   str - (string) the string to put
	///   x - (integer) x coordinate (column)
	///   y - (integer) y coordinate (row)
	///   r - (optional) red foregorund color component 0-255
	///   g - (optional) green foreground color component 0-255
	///   b - (optional) blue foreground color component 0-255
	///   br - (optional) red background color component 0-255
	///   bg - (optional) green background color component 0-255
	///   bb - (optional) blue background color component 0-255
	ut.Viewport.prototype.putString = function(str, x, y, r, g, b, br, bg, bb) {
		var len = str.length;
		var tile;
		if (x < 0 || y < 0) return;
		for (var i = 0; i < len; ++i) {
			if (x >= term.w) { x = 0; ++y;}
			if (y >= term.h) return;
			tile = new ut.Tile(str[i], r, g, b, br, bg, bb);
			this.unsafePut(tile, x, y);
			++x;
		}
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
				if (!this.ctx) this.colors[j][i] = "";
			}
		}
	};

	/// Function: renderCanvas
	/// Renders the buffer to <canvas> element created in constructor.
	ut.Viewport.prototype.renderCanvas = function() {
		var tile, ch, fg, bg, x, y;
		var hth = 0.5*this.th;
		// Clearing with one big rect is much faster than with individual char rects
		this.ctx.fillStyle = this.defaultBackground;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		for (var j = 0; j < this.h; ++j) {
			for (var i = 0; i < this.w; ++i) {
				tile = this.buffer[j][i];
				ch = tile.ch;
				fg = tile.getColorRGB();
				bg = tile.getBackgroundRGB();
				x = Math.floor(i * this.tw);
				y = Math.floor((j+0.5) * this.th); // 0.5 because textBaseline is middle
				// Only render background if the color is non-default
				if (bg.length && bg !== this.defaultBackground) {
					this.ctx.fillStyle = bg;
					this.ctx.fillRect(x, y-hth, this.tw, this.th);
				}
				// Do not attempt to render empty char
				if (ch.length) {
					if (!fg.length) fg = this.defaultColor;
					this.ctx.fillStyle = fg;
					this.ctx.fillText(ch, x, y);
				}
			}
		}
		this.ctx2.drawImage(this.offscreen, 0, 0);
	};

	/// Function: render
	/// Renders the buffer as html to the element specified at construction.
	ut.Viewport.prototype.render = function() {
		if (this.ctx) { this.renderCanvas(); return; }
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
///   vp - the <Viewport> instance to use as the viewport
///   func - the function used for fetching tiles
///   w - (integer) (optional) world width in tiles
///   h - (integer) (optional) world height in tiles
ut.Engine = function(vp, func, w, h) {
	"use strict";
	this.viewport = vp;
	this.tileFunc = func;
	this.w = w;
	this.h = h;
	this.refreshCache = true;
	this.cacheEnabled = false;
	this.cachex = 0;
	this.cachey = 0;
	this.tileCache = new Array(vp.h);
	this.tileCache2 = new Array(vp.h);
	for (var j = 0; j < vp.h; ++j) {
		this.tileCache[j] = new Array(vp.w);
		this.tileCache2[j] = new Array(vp.w);
	}
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
	/// Sets the function to be called to post-process / shade each visible tile.
	/// Shader function is called even if caching is enabled, see <Engine.setCacheEnabled>.
	///
	/// Parameters:
	///   func - function taking parameters (tile, x, y) and returning an ut.Tile
	ut.Engine.prototype.setShaderFunc = function(func) { this.shaderFunc = func; };

	/// Function: setCacheEnabled
	/// Enables or disables the usage of tile cache. This means that
	/// extra measures are taken to not call the tile function unnecessarily.
	/// This means that all animating must be done in a shader function,
	/// see <Engine.setShaderFunc>.
	/// Cache is off by default, but should be enabled if the tile function
	/// does more computation than a simple array look-up.
	///
	/// Parameters:
	///   mode - true to enable, false to disable
	ut.Engine.prototype.setCacheEnabled = function(mode) { this.cacheEnabled = mode; this.refreshCache = true; };

	/// Function: update
	/// Updates the viewport according to the given player coordinates.
	/// The algorithm goes as follows:
	///   * Record the current time
	///   * For each viewport tile:
	///   * Check if the tile is visible by testing the mask
	///   * If not visible, continue to the next tile in the viewport
	///   * Otherwise, if cache is enabled try to fetch the tile from there
	///   * Otherwise, call the tile function and check for shader function presence
	///   * If there is shader function, apply it to the tile, passing the recorded time
	///   * Put the tile to viewport
	///
	/// Parameters:
	///   x - (integer) viewport center x coordinate in the tile world
	///   y - (integer) viewport center y coordinate in the tile world
	ut.Engine.prototype.update = function(x, y) {
		x = x || 0;
		y = y || 0;
		// World coords of upper left corner of the viewport
		var xx = x - this.viewport.cx;
		var yy = y - this.viewport.cy;
		var timeNow = new Date().getTime(); // For passing to shaderFunc
		var tile;
		// For each tile in viewport...
		for (var j = 0; j < this.viewport.h; ++j) {
			for (var i = 0; i < this.viewport.w; ++i) {
				var ixx = i+xx, jyy = j+yy;
				// Check horizontal bounds if requested
				if (this.w && (ixx < 0 || ixx >= this.w)) {
					tile = ut.NULLTILE;
				// Check vertical bounds if requested
				} else if (this.h && (jyy < 0 || jyy >= this.w)) {
					tile = ut.NULLTILE;
				// Check mask
				} else if (this.maskFunc && !this.maskFunc(ixx, jyy)) {
					tile = ut.NULLTILE;
				// Check cache
				} else if (this.cacheEnabled && !this.refreshCache) {
					var lookupx = ixx - this.cachex;
					var lookupy = jyy - this.cachey;
					if (lookupx >= 0 && lookupx < this.viewport.w && lookupy >= 0 && lookupy < this.viewport.h) {
						tile = this.tileCache[lookupy][lookupx];
						if (tile === ut.NULLTILE) tile = this.tileFunc(ixx, jyy);
					} else // Cache miss
						tile = this.tileFunc(ixx, jyy);
				// If all else fails, call tileFunc
				} else tile = this.tileFunc(ixx, jyy);
				// Save the tile to cache
				if (this.cacheEnabled) this.tileCache2[j][i] = tile;
				// Apply shader function
				if (this.shaderFunc && tile !== ut.NULLTILE)
					tile = this.shaderFunc(tile, ixx, jyy, timeNow);
				// Put shaded tile to viewport
				this.viewport.unsafePut(tile, i, j);
			}
		}
		if (this.cacheEnabled) {
			// Save the new cache origin
			this.cachex = xx;
			this.cachey = yy;
			// Swap cache buffers
			var tempCache = this.tileCache;
			this.tileCache = this.tileCache2;
			this.tileCache2 = tempCache;
			this.refreshCache = false;
		}
	};
