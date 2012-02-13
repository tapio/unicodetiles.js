UnicodeTiles.js
===============

This JavaScript library provides a text character based tile engine for creating [roguelike](http://en.wikipedia.org/wiki/Roguelike) games etc. The bundled font ([DejaVu Sans Mono](http://dejavu-fonts.org/)) has decent coverage (3289 glyphs) of Unicode, providing monospace characters for [various miscellaneous symbols](http://tapio.github.com/unicodetiles.js/examples/01-minimal.html) that can be useful in creating fancy looking character based games and user interfaces. This page itself uses the font.


Current features
----------------
* Viewport - _character grid display_
	- Colored characters
	- Colored character backgrounds
	- Arbitrary character viewport size
	- Character size customizable through CSS
	- Utilizes CSS3 Web Fonts (@font-face) to provide consistent look across platforms.
* Engine - _the tile engine_
	- Viewport updating according to player coordinates
	- Tile reading through a callback
	- Masking callback (for FOV etc.)
	- Shader callback (for animating tiles)
* Meta - _General meta stuff_
	- Comprehensive API documentation
		+ Generated with Natural Docs from source code comments
	- Broad browser support
		+ Tested with Firefox 10, Chromium 16, Google Chrome 18b, Opera 11.61 + 12.0a
		+ IE9+ is not yet thoroughly tested, but will be supported
		+ IE8 and below are not targeted
	- Static analysis frequently performed
		+ [JSHint](http://www.jshint.com/)
		+ [Google Closure Compiler](http://closure-compiler.appspot.com/)
	- Several examples / tutorials
		+ See examples/ subfolder
	- Minification toolchain through [Google Closure Compiler](http://closure-compiler.appspot.com/)


Documentation
-------------

See [docs/html](docs/html/).


Examples
--------

See [examples-subdirectory](examples/).


License
-------

Deja Vu fonts &copy; Bitstream. See the license at [http://dejavu-fonts.org/wiki/License](http://dejavu-fonts.org/wiki/License) for more information.

The actual code and all other things are licensed under the [MIT license](http://opensource.org/licenses/MIT), which is as follows:

Copyright (c) 2012 Tapio Vierros
	
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

