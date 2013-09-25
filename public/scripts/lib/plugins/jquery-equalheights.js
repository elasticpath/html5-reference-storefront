/*--------------------------------------------------------------------
 * JQuery Plugin: "EqualHeights" & "EqualWidths"
 * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 *
 * Copyright (c) 2007 Filament Group
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Description: Compares the heights or widths of the top-level children of a provided element
 		and sets their min-height to the tallest height (or width to widest width). Sets in em units
 		by default if pxToEm() method is available.
 * Dependencies: jQuery library, pxToEm method	(article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)
 * Usage Example: $(element).equalHeights();
   						      Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
 * Version: 2.0, 07.24.2008
 * Changelog:
 *  08.02.2007 initial Version 1.0
 *  07.24.2008 v 2.0 - added support for widths
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------

	MODIFIED FOR ELASTICPATH 2013
	• now looks for all elements of a given classname, rather than children of a given object
	• also eliminated width-setting function (not needed)

--------------------------------------------------------------------*/

$.fn.equalHeights = function(px) {
	window.currentTallest = 0;

	// scan elements for largest height
	$(this).each(function(){
		$(this).css({'min-height': 0});

		$elHeight = $(this).outerHeight();
		$maxHeight = window.currentTallest;

		if ($elHeight > $maxHeight) {
			window.currentTallest = $elHeight;
			// alert('upping max to: ' + window.currentTallest);
		}
	});
	// alert('tallest: ' + window.currentTallest);


	// apply largest found height to all elements
	$(this).each(function(){

		$(this).css({'min-height': 0});

		// for ie6, set height since min-height isn't supported
		if ($.browser.msie && $.browser.version == 6.0) { $(this).css({'height': currentTallest}); }

		$(this).css({'min-height': window.currentTallest});
	});

	return this;
};