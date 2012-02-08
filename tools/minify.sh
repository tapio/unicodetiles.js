#!/bin/sh -e
# Uses Google Closure Compiler web service to minify the js files

DIR=$(dirname $(readlink -f $0))
OUTDIR="$DIR/../compiled"
mkdir -p "$OUTDIR"
OUT="$OUTDIR/unicodetiles.min.js"

echo "Compiling JS codes..."
"$DIR/compile-js.py" "$DIR/../unicodetiles"/*.js \
	> "$OUT" || echo "Compilation failed."

echo "Minified & optimized file placed into $OUTDIR"

