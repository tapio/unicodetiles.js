UnicodeTiles.js
===============

This JavaScript library provides a text character based tile engine for creating [roguelike](http://en.wikipedia.org/wiki/Roguelike) games etc. The bundled font ([DejaVu Sans Mono](http://dejavu-fonts.org/)) has decent coverage (3289 glyphs) of Unicode, providing monospace characters for [various miscellaneous symbols](http://tapio.github.com/unicodetiles.js/examples/01-minimal.html) that can be useful in creating fancy looking character based games and user interfaces. This page itself uses the font.

You might also be interested to know that a third-party [Ruby port of this library exists](http://kmees.github.com/projects/unicodetiles.html).


Current features
----------------

* Viewport - _character grid display_
	- Three rendering engines: WebGL, 2d canvas and slow DOM
	- Automatically picks the best renderer supported by user's browser
	- Rendering engine can be switched on-the-fly
	- Colored characters
	- Colored character backgrounds
	- Arbitrary character viewport size
	- Character size customizable through CSS
	- Can make the layout square
	- Utilizes CSS3 Web Fonts (@font-face) to provide consistent look across platforms.
* Engine - _the tile engine_
	- Viewport updating according to player coordinates
	- Tile reading through a callback
	- Optional caching for cases where the tile callback is heavy
	- Masking callback (for FOV etc.)
	- Shader callback (for animating tiles)
* Input - _keyboard handling_
	- Simple addon that makes keyboard managing easier
* Meta - _general stuff_
	- Comprehensive API documentation
		+ Generated with Natural Docs from source code comments
	- Broad browser support
		+ Best on latest Chrome and Firefox
		+ IE9+ and Opera 11.61+ supported, but less frequently tested
		+ IE8 and below are not targeted
	- Static analysis frequently performed
		+ [JSHint](http://www.jshint.com/) (on every git commit)
		+ [Google Closure Compiler](http://closure-compiler.appspot.com/)
	- Several examples / tutorials
		+ See examples/ subfolder
	- Minification toolchain through [Google Closure Compiler](http://closure-compiler.appspot.com/)
	- Boilerplate native app for removing browser dependency
		+ Based on QtWebkit (so requires Qt)
		+ Just compile the tiny app and drop it next to your games files - no browser needed anymore


Documentation
-------------

See docs/html-subdirectory: [local link](docs/html/) | [online](http://tapio.github.com/unicodetiles.js/docs/html/)


Examples
--------

See examples-subdirectory: [local link](examples/) | [online](http://tapio.github.com/unicodetiles.js/examples/)


Tests
-----

There are some, mostly performance related tests/benchmarks that you can run in the tests-subdirectory:
[local link](tests/) | [online](http://tapio.github.com/unicodetiles.js/tests/)


Version history
---------------

* v2.1
	- Improved chracter texture generation for WebGLRenderer
	- Small Viewport and Tile improvements
	- New example: 08-raycaster
* v2.0
	- WebGLRenderer
	- Renderers in their own files
	- More test cases
* v1.1
	- Transition effects
	- Native app based on QtWebkit
* v1.0
	- Initial release


License
-------

Deja Vu fonts &copy; Bitstream. See the license at [http://dejavu-fonts.org/wiki/License](http://dejavu-fonts.org/wiki/License) for more information.

The actual code and all other things are licensed under the [MIT license](http://opensource.org/licenses/MIT), which is as follows:

Copyright (c) 2012 Tapio Vierros
	
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

