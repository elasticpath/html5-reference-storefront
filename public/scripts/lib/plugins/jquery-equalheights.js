/*--------------------------------------------------------------------

	Resize Page Elements
	• looks for all elements of a given classname and resizes to max found height

--------------------------------------------------------------------*/

$.fn.equalHeights = function() {
	console.log('|||| RESIZING ELEMENTS: '+window.currentTallest);
	window.currentTallest = 0;

	// scan elements for largest height
	$(this).each(function(){
		$(this).css({'min-height': 0});

		$elHeight = $(this).outerHeight();
		$maxHeight = window.currentTallest;
		// console.log('|||| current element height: '+$elHeight);
		// console.log('|||| largest element height: '+$maxHeight);

		if ($elHeight > $maxHeight) {
			window.currentTallest = $elHeight;
		}
	});
	console.log('|||| max height found: '+window.currentTallest);
	console.log('|||| applying max height: '+window.currentTallest);


	// apply largest found height to all elements
	$(this).each(function(){

		$(this).css({'min-height': 0});

		// for ie6, set height since min-height isn't supported
		if ($.browser.msie && $.browser.version == 6.0) { $(this).css({'height': currentTallest}); }

		$(this).css({'min-height': window.currentTallest});
	});

	return this;
};