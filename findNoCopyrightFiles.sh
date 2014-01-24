#!/bin/bash
# search for ep source files without correct copyright header

echo 'The following files do not have correct EP copyright header';

for type in js html less css;
do
	find . -name "*.$type" \
		| grep -v public/scripts \
		| grep -v node_modules \
		| grep -v tests/libs \
		| grep -v tests/css \
		| grep -v stylesrc/bootstrap \
		| grep -v "stylesrc/theme-core/load-bootstrap.less" \
		| grep -v "stylesrc/theme-core/jquery.toastmessage.less" \
		| grep -v "public/text.js"\
		| xargs grep ' * Copyright © 2014 Elastic Path Software Inc. All rights reserved.' -L;
done