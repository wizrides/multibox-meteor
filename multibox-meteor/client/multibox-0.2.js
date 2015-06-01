(function ($) {
	
	/*
    * Example: $.fn.centerVertically(containerElement, element, 'margin', '10', '0');
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

		var strVerticalSpacingPixelValue = dVerticalSpacing + 'px';
		var strHorizontalSpacingPixelValueRight = cssPropertyValueRight + 'px';
		var strHorizontalSpacingPixelValueLeft = cssPropertyValueLeft + 'px';

		var strCssPropertyTop = cssProperty + '-top';
		var strCssPropertyBottom = cssProperty + '-bottom';
		var strCssPropertyRight = cssProperty + '-right';
		var strCssPropertyLeft = cssProperty + '-left';

		$(element).css(strCssPropertyTop, strVerticalSpacingPixelValue);
		$(element).css(strCssPropertyBottom, strVerticalSpacingPixelValue);

		$(element).css(strCssPropertyRight, strHorizontalSpacingPixelValueRight);
		$(element).css(strCssPropertyLeft, strHorizontalSpacingPixelValueLeft);
	};

}( jQuery ));


(function( $, undefined ) {

$.widget("ui.multibox", $.ui.mouse, {
	version: "1.10.2",
	options: {
		// Append to for selection helper display
		appendTo: "body",

		// Refresh selectees on each selection
		autoRefresh: true,
		
		// Required for ui.mouse
		distance: 0,

		// Filter by multibox-option items for selection
		filter: "div.multibox-option",

		// Show selection area when selecting
		showSelectionHelper: false,

		// Option to allow selection
		allowSelection: true,

		// Option to allow drag selection
		allowDragSelection: true,

		// "single" or "multiple"
		selectionMode: "multiple",

		// 'all' or 'selected'
        displayFilter: "all",

		// Callbacks
		change: null,
		selected: null,
		selecting: null,
		start: null,
		stop: null,
		unselected: null,
		unselecting: null
	},
	_create: function() {
		var selectees,
			selected,
			that = this;

		this.element.addClass("ui-multibox");

		this.dragged = false;

		// Cache selectee children based on filter
		this.refresh = function() {
			selected = $(that.options.filter + '.ui-selected', that.element[0]);

			selectees = $(that.options.filter, that.element[0]);
			selectees.addClass("ui-selectee");
			selectees.each(function() {
				var $this = $(this),
					pos = $this.offset();

				$.data(this, "multibox-item", {
					element: this,
					$element: $this,

					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					
					startselected: false,
					isStartElement: false,
					
					selected: $this.hasClass("ui-selected"),
					selecting: $this.hasClass("ui-selecting"),
					unselecting: $this.hasClass("ui-unselecting")
				});
			});
		};
		this.refresh();

		/*
		this.oScrollTop = 0;
		this.mousePositionX = 0;
		this.mousePositionY = 0;
		this.element.on("scroll", function (event) {
			var currentScrollTop = $(this).scrollTop();
			var delta = currentScrollTop - that.oScrollTop;

			that.oScrollTop = currentScrollTop;
			
			console.log(that.mousePositionX);
			that.mousePositionX = that.mousePositionX + delta;
			console.log(that.mousePositionX);

			that._doMouseDrag(that.mousePositionX, that.mousePositionY);
		});
		*/

		/*
		// Handle mousewheel scroll
		this.element.unbind().bind('mousewheel DOMMouseScroll', function (event) {
			if ((event.originalEvent.wheelDelta > 0) || (event.originalEvent.detail < 0)) {
		        console.log("up " + event.originalEvent.wheelDelta);

		        //event.pageX = event.pageX + event.originalEvent.wheelDelta;
		        //event.pageY = event.pageY + event.originalEvent.wheelDelta;
		        
		        //that._mouseDrag(event);
		    }
		    else {
		        console.log("down " + event.originalEvent.wheelDelta);	
		    }
		});
		*/
		

		this.selected = selected;
		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		if (this.options.showSelectionHelper) {
			this.helper = $("<div class='ui-multibox-helper'></div>");
		}
	},

	_destroy: function() {
		this.selectees
			.removeClass("ui-selectee")
			.removeData("multibox-item");
		this.element
			.removeClass("ui-multibox ui-multibox-disabled");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var that = this,
			options = this.options;

		if (this.options.disabled) {
			return;
		}

		if (!this.options.allowSelection) {
			return;
		}

		// Don't select when badge is clicked
		if (this._checkBadgeClicked(event)) {
			return;
		}

		// Set the starting mouse position to create selection area
		this.opos = [ event.pageX, event.pageY ];
		//console.log("start x: " + event.pageX + " start y: " + event.pageY);

		// Cache selected and selectees on start of new selection
		this.selected = $(options.filter + '.ui-selected', that.element[0]);
		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		if (this.options.showSelectionHelper) {
			$(options.appendTo).append(this.helper);
			// Position helper for selection area display
			this.helper.css({
				"left": event.pageX,
				"top": event.pageY,
				"width": 0,
				"height": 0
			});
		}

		if (options.autoRefresh) {
			this.refresh();
		}

		// Find the parent multibox option
		// event.target - the html element that caused the mouse start event (mouse down)
		var oSelectedOption = $(event.target).closest('div.multibox-option');
		var oSelectedOptionValue = oSelectedOption.attr('value');

		// If selection mode is single, unselect selected options
		if (this.options.selectionMode === 'single') {
			this.selected.each(function() {
				var bIsTarget = false;
				var selectee = $.data(this, "multibox-item");

				// Sets the selectee as selected at the start of selection
				selectee.startselected = true;

				var oSelecteeValue = $(this).attr('value');
				
				// Don't unselect itself in single selection mode
				if (oSelecteeValue === oSelectedOptionValue) {
					bIsTarget = true;
					selectee.isStartElement = true;
				}

				// If found selected that isn't the target, unselect
				if (!bIsTarget) {
					that._setUnselecting(event, selectee);
				}
			});
		}
		else {
			this.selected.each(function () {
				var selectee = $.data(this, "multibox-item");

				// Set start of current selection
				selectee.startselected = true;
			});
		}

		// Find parents in case of nested multibox-option items, up to the parent multibox
		// Include selected option (event.target) with addBack
		oSelectedOption.parentsUntil('div.multibox.ui-multibox').addBack().each(function() {
			var bDoSelect,
				selectee = $.data(this, "multibox-item");
			
			// If a multibox-item
			if (selectee) {
				// Set as the start selection element
				selectee.isStartElement = true;
				
				// Don't allow click to toggle on single selection mode
				//bDoSelect = (that.options.selectionMode === 'single') || !selectee.$element.hasClass("ui-selected");

				// Allow click to toggle
				bDoSelect = !selectee.$element.hasClass("ui-selected");

				// Select if not already selected, initially unselect if selected
				selectee.$element
					.removeClass(bDoSelect ? "ui-unselecting" : "ui-selected")
					.addClass(bDoSelect ? "ui-selecting" : "ui-unselecting");

				selectee.unselecting = !bDoSelect;
				selectee.selecting = bDoSelect;
				selectee.selected = bDoSelect;
				
				if (bDoSelect) {
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
				else {
					that._trigger("unselecting", event, {
						unselecting: selectee.element
					});
				}

				return false;
			}
		});
	},

	_mouseDrag: function(event) {
		this.dragged = true;

		if (this.options.disabled) {
			return;
		}

		if (!this.options.allowSelection) {
			return;
		}

		if (!this.options.allowDragSelection) {
			return;
		}

		if (this._checkBadgeClicked(event)) {
			return;
		}

		// Update the opos on drag to prevent multiple selection for single selection mode
		// Only a single multibox-option will be 'hit'
		if (this.options.selectionMode === "single") {
			this.opos = [ event.pageX, event.pageY ];
		}

		var tmp,
			that = this,
			options = this.options,
			x1 = this.opos[0],
			y1 = this.opos[1],
			x2 = event.pageX,
			y2 = event.pageY;

		// X1, Y1 always the top left, maintain selection orientation
		if (x1 > x2) {
			tmp = x2;
			x2 = x1;
			x1 = tmp;
		}
		if (y1 > y2) {
			tmp = y2;
			y2 = y1;
			y1 = tmp;
		}

		if (this.options.showSelectionHelper) {
			this.helper.css({ left: x1, top: y1, width: x2 - x1, height: y2 - y1 });
		}

		this.selectees.each(function() {
			var thisSelectee = this;
			var selectee = $.data(this, "multibox-item"),
				hit = false;

			// Prevent helper from being selected if appendTo: multibox
			if (!selectee || (selectee.element === that.element[0])) {
				return;
			}

			// Hit if any point of selection area is within the selectee area
			// (y1 + 1) to account for 1px border bottom, prevent simultaneous selection
			hit = ( !((selectee.left > x2) || (selectee.right < x1) || (selectee.top > y2) || (selectee.bottom < (y1 + 1))) );

			if (that.options.selectionMode === "single") {
				if (hit) {
					that._setSelecting(event, selectee);
				}
				else {
					// If the selectee was being selected or started out selected, set unselecting
					if (selectee.selecting || selectee.startselected) {
						that._setUnselecting(event, selectee);
					}
				}
			}
			else {
				if (hit) {
					// If not already selecting and not already selected, set selecting
					if (!selectee.selecting && !selectee.selected) {
						that._setSelecting(event, selectee);
					}
				}
				else {
					// Selecting on multiple selection drag
					if (selectee.selecting) {
						// Maintain start selection
						if (selectee.startselected) {
							selectee.$element.removeClass("ui-selecting");
							selectee.selecting = false;
							selectee.$element.addClass("ui-selected");
							selectee.selected = true;
						}
						else {
							// Unselecting if the selectee wasn't selected at the start of new selection
							that._setUnselecting(event, selectee);
						}
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var that = this;

		this.dragged = false;

		if (this.options.disabled) {
			return;
		}

		if (!this.options.allowSelection) {
			return;
		}

		if (this._checkBadgeClicked(event)) {
			return;
		}

		//if (this._checkCancelHover(event)) {
		//	$(event.target).closest("div.multibox-option").removeClass("ui-selected");
		//}

		//console.log("stop x: " + event.pageX + " stop y: " + event.pageY);
		//console.log("delta x: " + (event.pageX - this.opos[0]) + " delta y: " + (event.pageY - this.opos[1]));

		this.selectees.each(function() {
			var selectee = $.data(this, "multibox-item");
			selectee.isStartElement = false;
		});

		$(".ui-unselecting", this.element[0]).each(function() {
			var selectee = $.data(this, "multibox-item");
			that._setUnselected(event, selectee);
		});
		$(".ui-selecting", this.element[0]).each(function() {
			var selectee = $.data(this, "multibox-item");
			that._setSelected(event, selectee);
		});

		// If the selection changed, trigger changed
		if (this._didSelectionChange(event)) {
			this.selectionChanged();
		}

		this._trigger("stop", event);

		if (this.options.showSelectionHelper) {
			this.helper.remove();
		}

		return false;
	},

	_setSelecting: function (event, selectee) {
		selectee.$element.removeClass('ui-unselecting').addClass("ui-selecting");
		selectee.selecting = true;
		selectee.unselecting = false;
		
		this._trigger("selecting", event, {
			selecting: selectee.element
		});
	},

	_setSelected: function (event, selectee) {
		selectee.$element.removeClass("ui-selecting").addClass("ui-selected");
		selectee.selecting = false;
		selectee.selected = true;
		selectee.startselected = true;

		this._trigger("selected", event, {
			selected: selectee.element
		});
	},

	_setUnselecting: function (event, selectee) {
		selectee.$element.removeClass("ui-selected").removeClass("ui-selecting");
		selectee.selected = false;
		selectee.selecting = false;
		selectee.$element.addClass("ui-unselecting");
		selectee.unselecting = true;
		
		this._trigger("unselecting", event, {
			unselecting: selectee.element
		});
	},

	_setUnselected: function (event, selectee) {
		selectee.$element.removeClass("ui-unselecting");
		selectee.unselecting = false;
		selectee.selected = false;
		selectee.startselected = false;

		this._trigger("unselected", event, {
			unselected: selectee.element
		});
	},

	_checkCancelHover: function (event) {
		if ((event === null) || (event === undefined) || (event.target === null) || (event.target === undefined)) {
			return false;
		}

		if ($(event.target).hasClass("material-icons") 
			&& $(event.target).innerHTML === "cancel") {
			return true;
		}

		return false;
	},

	_checkBadgeClicked: function (event) {
		if ((event === null) || (event === undefined) || (event.target === null) || (event.target === undefined)) {
			return false;
		}

		if ($(event.target).hasClass("material-icons")) {
			return true;
		}

		return false;
	},

	/*
	* Checks if the selection has changed
	* Assumes unique value in the .attr("value") of the option to compare
	*/
	_didSelectionChange: function (event) {
		// If no previous selection, selection changed
		if ((this.selected === null) || (this.selected === undefined) || (this.selected.length === 0)) {
			return true;
		}

		var bDidSelectionChange = false;

		// Get current selection
		var lstNewSelection = $(this.options.filter + '.ui-selected', this.element[0]);

		// If number of selected items doesn't match, selection changed
		if (this.selected.length !== lstNewSelection.length) {
			bDidSelectionChange = true;
		}
		else {
			// Compare selected items
			this.selected.each(function () {
				// If previous selected value doesn't exist in new selection, selection changed
				var oValueToFind = $(this).attr('value');
				var bFound = false;

				// Compare to the new selection
				lstNewSelection.each(function () {
					var oValue = $(this).attr('value');
					if (oValueToFind === oValue) {
						bFound = true;

						// Returning false from $.each() breaks
						return false;
					}
				});

				if (!bFound) {
					bDidSelectionChange = true;

					// Returning false from $.each() breaks
					return false;
				}
			});
		}

		return bDidSelectionChange;
	},

	selectionChanged: function (event) {
		var that = this;

		// Handle checkbox display
        var options = this.getOptions();
        for (var i = 0; i < options.length; i++) {
            if ($(options[i]).hasClass('ui-selected')) {
                $(options[i]).find('div.multibox-option-check-container').each(function () {
                    //$(this).find('input[type="checkbox"]').prop('checked', true);
                    $(this).css('display', 'inline-block');
                });
            }
            else {
                $(options[i]).find('div.multibox-option-check-container').each(function () {
                    $(this).css("display", "none");
                    //$(this).find('input[type="checkbox"]').prop('checked', false);
                });
            }
        }

        // Handle display filter setting
        if (this.options.displayFilter === 'selected') {
            this.getOptions().each(function () {
            	//if (that.selectionMode !=== "single") {
	                if (!$(this).hasClass('ui-selected')) {
	                    $(this).slideUp('fast');
	                }
	                else {
	                    $(this).slideDown('fast');
	                }
            	//}
            });
        }

        this._trigger('change', event);
	},

	getOptions: function () {
		return this.element.find('div.multibox-option');
	},

	getSelected: function () {
		return this.element.find('div.multibox-option.ui-selected');
	},

	getValues: function (multiboxOptions) {
		var values = [];

		if ((multiboxOptions === null) || (multiboxOptions === undefined) || (multiboxOptions.length === 0)) {
			return values;
		}

		for (var i = 0; i < multiboxOptions.length; i++) {
			values[i] = $(multiboxOptions[i]).attr('value');
		}

		return values;
	},

	getOptionValues: function () {
		return this.getValues(this.getOptions());
	},

	getSelectedValues: function () {
		return this.getValues(this.getSelected());
	},

	getSelectedControl: function () {
		var control;
		this.element.find('div.multibox-option.multibox-control.multibox-control-selected').each(function () {
			if ((this !== null) && (this !== undefined)) {
				control = this;
			}
		});
		return control;
	},

	getSelectecControlValue: function () {
		return this.getSelectedControl().attr('value');
	},

	containsOption: function (multiboxOption) {
		var values = this.getOptionValues();

		if ((values === null) || (values === undefined) || (values.length === 0)) {
			return false;
		}

		if ($.inArray($(multiboxOption).attr('value'), values) > -1) {
			return true;
		}

		return false;
	},

	showAll: function () {
        this.options.displayFilter = 'all';

		this.element.find('div.multibox-option').slideDown('fast');
	},

	showSelected: function () {
        this.options.displayFilter = 'selected';

		this.element.find('div.multibox-option').css("display", "none");
		this.element.find('div.multibox-option.ui-selected').slideDown('fast');
	},

	selectAll: function () {
		this.element.find('div.multibox-option').each(function () {
            if (!$(this).hasClass('ui-selected')) {
                $(this).addClass('ui-selected');
            }
        });
        this.selectionChanged();
	},

	clearSelection: function() {
		this.element.find('div.multibox-option').removeClass('ui-selected');
		this.selectionChanged();
	},

	clearOptions: function () {
		var bSelectionChanged = false;
		if (this.getSelected().length > 0) {
			bSelectionChanged = true;
		}

		this.element.find('div.multibox-option').remove();

		if (bSelectionChanged) {
			this.selectionChanged();
		}
	},

	removeSelected: function () {
		var bSelectionChanged = false;
		var lstSelected = this.getSelected();
		if (lstSelected.length > 0) {
			bSelectionChanged = true;
		}

		lstSelected.remove();

		if (bSelectionChanged) {
			this.selectionChanged();
		}
	},

	selectGroup: function (group) {
		this.element.find('div.multibox-option').removeClass('ui-selected');
		this.element.find('div.multibox-option').each(function () {
			if ($.inArray(group, $(this).data('group')) > -1) {
				$(this).addClass('ui-selected');
			}
		});

		this.selectionChanged();
	},

	moveSelected: function (toMultiboxSelector) {
		this.moveOptions(this.getSelected(), toMultiboxSelector);
	},

	moveAll: function (toMultiboxSelector) {
		this.moveOptions(this.getOptions(), toMultiboxSelector);
	},

	moveOptions: function (multiboxOptions, toMultiboxSelector) {
		if ((multiboxOptions === null) || (multiboxOptions === undefined) || (multiboxOptions.length === 0)) {
			return;
		}

		for (var i = 0; i < multiboxOptions.length; i++) {
			$(toMultiboxSelector).append($(multiboxOptions[i]));
		}
	},

	enableHover: function () {
		this.element.hover(function (event) {
			$(this).css('cursor', 'pointer');
			$(this).find('*').css('cursor', 'pointer');
		}, function (event) {
			$(this).css('cursor', 'default');
			$(this).find('*').css('cursor', 'default');
		});
	},

	disableHover: function () {
		this.element.hover(function (event) {
			$(this).css('cursor', 'default');
			$(this).find('*').css('cursor', 'default');
		}, function (event) {
			$(this).css('cursor', 'default');
			$(this).find('*').css('cursor', 'default');
		});
	},

	enableSelection: function () {
        this.options.allowSelection = true;
        this.element.find('div.multibox-option').addClass('ui-selectee');
        this.enableHover();
    },

    disableSelection: function () {
        this.options.allowSelection = false;
        this.element.find('div.multibox-option').removeClass('ui-selectee');
        this.disableHover();
    },

	appendOption: function (multiboxOption) {
		this.element.append(multiboxOption);
	},

	buildMultiboxControl: function (multiboxControl) {
		var multiboxControlButton = {
			value: multiboxControl.buttonValue,
			onClick: '',
			dataKey: '',
			data: ''
		};

		return $('<div>').attr('value', multiboxControl.value)
						   	.addClass('multibox-option multibox-control')
						   	.data('', '')
						   	.append(this.buildMultiboxControlButton(multiboxControlButton));
	},

	buildMultiboxControlButton: function (multiboxControlButton) {
		var that = this;
		return $('<div>').addClass('multibox-option-control-button-container')
							.append($('<a>').attr('id', multiboxControlButton.value)
												.addClass('multibox-control-button')
												.html(multiboxControlButton.value)
												.data(multiboxControlButton.dataKey, multiboxControlButton.data)
												.bind('click', function () {
													$(this).closest('div.multibox-option.multibox-control')
															.addClass('multibox-control-selected');

													// that = multibox
													that.element.find('div.multibox-option.multibox-control').each(function () {
														$(this).removeClass('multibox-control-selected');
													});
												}));
	},

	buildMultiboxOption: function (multiboxOption) {
		var multiboxLabel = {
			mainLabel: multiboxOption.mainLabel,
			subLabel: multiboxOption.subLabel
		};

		if (multiboxOption.showBadge) {
			if (multiboxOption.showCheck) {
				return $('<div>').attr('value', multiboxOption.value)
							   		.addClass('multibox-option border-bottom')
							   		.addClass('ui-selectee')
								   	.data('group', multiboxOption.groups)
								   	.append(this.buildMultiboxCheck())
								   	.append(this.buildMultiboxLabel(multiboxLabel))
								   	.append(this.buildMultiboxBadge(multiboxOption.badgeLabel, multiboxOption.badgeAction, multiboxOption.badgeActionParams))
								   	.resize(function (event) {
						    			var oCheck = $(this).find('div.multibox-option-check-container');
										$.fn.centerVertically(this, oCheck, 'margin', '10', '0');

						    			var oBadge = $(this).find('div.multibox-option-badge-container');
										$.fn.centerVertically(this, oBadge, 'margin', '5', '0');
								   	});
		    }
		    else {
		    	return $('<div>').attr('value', multiboxOption.value)
							   		.addClass('multibox-option border-bottom')
							   		.addClass('ui-selectee')
								   	.data('group', multiboxOption.groups)
								   	.append(this.buildMultiboxLabel(multiboxLabel))
								   	.append(this.buildMultiboxBadge(multiboxOption.badgeLabel))
								   	.resize(function (event) {
						    			var oBadge = $(this).find('div.multibox-option-badge-container');
										$.fn.centerVertically(this, oBadge, 'margin', '5', '0');
								   	});
		    }
		}
		else {
			if (multiboxOption.showCheck) {
				return $('<div>').attr('value', multiboxOption.value)
							   		.addClass('multibox-option border-bottom')
							   		.addClass('ui-selectee')
								   	.data('group', multiboxOption.groups)
								   	.append(this.buildMultiboxCheck())
								   	.append(this.buildMultiboxLabel(multiboxLabel))
								   	.resize(function (event) {
						    			var oCheck = $(this).find('div.multibox-option-check-container');
										$.fn.centerVertically(this, oCheck, 'margin', '10', '0');
								   	});
		    }
		    else {
		    	return $('<div>').attr('value', multiboxOption.value)
							   		.addClass('multibox-option border-bottom')
							   		.addClass('ui-selectee')
								   	.data('group', multiboxOption.groups)
								   	.append(this.buildMultiboxLabel(multiboxLabel));
		    }
		}
	},

	buildMultiboxCheck: function () {
		// Save multibox reference 'this' so we can access within click event
        var that = this;
		return $('<div>').addClass('multibox-option-check-container')
							.css("display", "none")
							.append($("<i>").addClass("material-icons md-18 green")
											.html("check_circle")
											.on("mouseup", function () {
												// If selected or selecting and mouse upped on cancel, deselect
												var oMultiboxOption = $(this).closest("div.multibox-option");
												if ((oMultiboxOption.hasClass("ui-selected") || oMultiboxOption.hasClass("ui-selecting"))
													&& this.innerHTML === "cancel") {
													oMultiboxOption.removeClass("ui-selected").removeClass("ui-selecting");
													$(this).closest("div.multibox-option-check-container")
															.css("display", "none");
													$(this).html("check_circle")
															.removeClass("red")
															.addClass("green");
												}

												that.selectionChanged();
		                                    })
		                                    .hover(function () {
	                                            $(this).html("cancel").removeClass("green").addClass("red");
		                                    }, function () {
	                                            $(this).html("check_circle").removeClass("red").addClass("green");
		                                    }));
	},

	buildMultiboxLabel: function (multiboxLabel) {
		return $('<div>').addClass('multibox-option-label-container')
					   		.append($('<label>').addClass('multibox-option-main-label')
										   		.text(multiboxLabel.mainLabel))
					   		.append($('<label>').addClass('multibox-option-sub-label')
											   	.text(multiboxLabel.subLabel));
   	},

   	buildMultiboxBadge: function (badgeLabel, badgeAction, badgeActionParams) {
   		return $('<div>').addClass('multibox-option-badge-container float-right')
			   			.append($('<i>').addClass('material-icons')
								  	     	.html("info")
								  		 	.data('badgeLabel', badgeLabel)
										  	.bind('click', function (event) {
										  		if ((badgeAction === null) || (badgeAction === undefined)) {
										  			return;
										  		}

										  		badgeAction.apply(this, badgeActionParams);
										  	})
										  	.hover(function (event) {
								  		 	}, function (event) {
							  		 		}));	
	},

	search: function (token) {
		if ((token === null) || (token === undefined) || (token.length === 0)) {
            if (this.options.displayFilter === 'selected') {
                this.showSelected();
            }
            else {
                this.showAll();
            }

            return;
        }

        this.element.find('div.multibox-option').css("display", "none");
        var token = token.trim().toLowerCase();

        // Blank search token
        if (token.length === 0) {
            return;
        }

        // Search options based on current display filter
        var options = [];
        if (this.options.displayFilter === 'selected') {
            options = this.getSelected();
        }
        else {
            options = this.getOptions();
        }

        // Find token within options and display
        options.each(function () {
            if (($(this).data('group')[0].toLowerCase().indexOf(token) > -1)
                || ($(this).find('label.multibox-option-main-label').text().toLowerCase().indexOf(token) > -1)
                || ($(this).find('label.multibox-option-sub-label').text().toLowerCase().indexOf(token) > -1)) {

                $(this).slideDown('fast');
            }
        });
	},

	initChecks: function () {
		this.centerVerticallyChecks();
		this.getOptions().each(function () {
			if (!$(this).hasClass('ui-selected')) {
	            $(this).find('div.multibox-option-check-container').css("display", "none");
	        }
		});
	},

	centerVerticallyChecks: function () {
		this.getOptions().each(function () {
			var oCheck = $(this).find('div.multibox-option-check-container');
			var oIcon = oCheck.find("i.material-icons");

			// Make it visible so that it can center properly
			oCheck.css("display", "inline-block");

			$.fn.centerVertically(this, oCheck, 'margin', '10', '0');
			$.fn.centerVertically(oCheck, oIcon, "margin", "0", "0");
		});
	},

	centerVerticallyBadges: function () {
		this.getOptions().each(function () {
			var oBadge = $(this).find('div.multibox-option-badge-container');
			var oIcon = oBadge.find("i.material-icons");
			
			$.fn.centerVertically(this, oBadge, 'margin', '5', '0');
			$.fn.centerVertically(oBadge, oIcon, "margin", "0", "0");
		});
	}

});

})(jQuery);
