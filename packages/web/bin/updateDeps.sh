#!/bin/bash

export TEMP=`mktemp -d`

cd $TEMP

set -e

wget `npm view @adobe/coral-spectrum dist.tarball`
tar xzvf coral-spectrum-*.tgz
cp package/dist/css/coral.min.css $OLDPWD/themes/spectrum/static/css/coral.min.css
cp package/dist/js/coral.min.js* $OLDPWD/themes/spectrum/static/js/
cp package/dist/resources/spectrum-* $OLDPWD/themes/spectrum/static/resources/
rm -rf coral-spectrum-*.tgz package

wget `npm view mermaid dist.tarball`
tar xzvf mermaid-*.tgz
cp package/dist/mermaid.min.js* $OLDPWD/themes/spectrum/static/js/
rm -rf mermaid-*.tgz package

wget `npm view mathjax dist.tarball`
tar xzvf mathjax-*.tgz
cp package/es5/tex-svg-full.js $OLDPWD/themes/spectrum/static/js/mathjax-tex-svg-full.js
rm -rf mathjax-*.tgz package

wget https://casual-effects.com/markdeep/latest/markdeep.min.js -O $OLDPWD/themes/spectrum/static/js/markdeep.min.js

cd $OLDPWD

cd themes/spectrum/

./download-stork.sh

cd $OLDPWD


