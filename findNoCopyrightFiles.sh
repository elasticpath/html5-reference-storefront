for type in js html less css;
	do find public stylesrc tests -name "*.$type" | xargs grep ' * Copyright © 2014 Elastic Path Software Inc. All rights reserved.' -L | grep -v generated-sources;
done