(function ($) {
	
	/*
    * Example: $.fn.centerVertically(containerElement, element, "margin", "10", "0");
    */
    
    /*
    * For use when centering a child element within a container element using CSS margins
    *
    * @paramter containerElement - The container element to center the child within
    * @paramter element - The child element to center relative to the container
    * @paramter cssProperty - The CSS property name (in this case stick with margin for now)
    * @paramter cssPropertyValueRight - The CSS (margin) property value to apply to -right, top and bottom are calculated
    * @paramter cssPropertyValueLeft - The CSS (margin) property value to apply to -left, top and bottom are calculated
    *
    * @return - The child element that was centered
    */
	$.fn.centerVertically = function (containerElement, element, cssProperty, cssPropertyValueRight, cssPropertyValueLeft) {
		var dVerticalSpacing = ($(containerElement).height() - $(element).height()) / 2.0;

		var strVerticalSpacingPixelValue = dVerticalSpacing + "px";
		var strHorizontalSpacingPixelValueRight = cssPropertyValueRight + "px";
		var strHorizontalSpacingPixelValueLeft = cssPropertyValueLeft + "px";

		var strCssPropertyTop = cssProperty + "-top";
		var strCssPropertyBottom = cssProperty + "-bottom";
		var strCssPropertyRight = cssProperty + "-right";
		var strCssPropertyLeft = cssProperty + "-left";

		$(element).css(strCssPropertyTop, strVerticalSpacingPixelValue);
		$(element).css(strCssPropertyBottom, strVerticalSpacingPixelValue);

		$(element).css(strCssPropertyRight, strHorizontalSpacingPixelValueRight);
		$(element).css(strCssPropertyLeft, strHorizontalSpacingPixelValueLeft);
	};

}( jQuery ));