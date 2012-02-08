#!/bin/sh -e
# Builds documentation

ND="naturaldocs"
MD="markdown"
AWK="awk"
$ND -h >/dev/null 2>&1 || echo "Cannot find NaturalDocs!"
$MD -v >/dev/null 2>&1 || echo "Cannot find markdown!"
$AWK -W version >/dev/null 2>&1 || echo "Cannot find awk!"

DIR=$(dirname $(readlink -f $0))
DOCSDIR="$DIR/../docs"

NDOUTDIR="$DOCSDIR/html"
NDDIR="$DOCSDIR/NaturalDocs"
mkdir -p "$NDOUTDIR" "$NDDIR"

echo "Building API documentation..."
$ND -i "$DIR/.." \
	-o HTML "$NDOUTDIR" \
	-p "$NDDIR"

echo "Building Readme..."
COMPILEDREADME="$DOCSDIR/Readme.html"
$MD "$DIR/../README.markdown" > "$COMPILEDREADME"

echo "Building index page..."
awk -v readme="$COMPILEDREADME" '
    /INCLUDES/ { system("cat " readme); }
    {print}
' "$DOCSDIR/template.html" > "$DIR/../index.html"

echo "All done."

