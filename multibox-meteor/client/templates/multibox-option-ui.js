MultiboxOptionInterface = {
	build: function (option) {
		var that = this;
		var oObject = option.find("div.multibox-option");

		if (option.data.showCheck) {
    		$(oObject).addClass("ui-selectee");
    		$(oObject).append(MultiboxOptionCheckInterface.build());
    	}

    	var moLabel = that.buildLabel(option.data.mainLabel, option.data.subLabel);
    	$(oObject).append(moLabel);

		if (option.data.showBadge) {
    		$(oObject).append(MultiboxOptionBadgeInterface.build(
    			option.data.badgeLabel, 
    			option.data.badgeAction, 
    			option.data.badgeActionParams
			));
    	}

    	$(oObject).data("group", option.data.groups);
    	$(oObject).resize(that.resize);

    	$("#multibox").multibox("appendOption", $(oObject));
	},
	buildLabel: function (mainLabel, subLabel) {
		return $("<div>").addClass("multibox-option-label-container")
				   		.append($("<label>").addClass("multibox-option-main-label")
									   		.text(mainLabel))
				   		.append($("<label>").addClass("multibox-option-sub-label")
										   	.text(subLabel));
	},
	buildBadge: function (label, action, actionParams) {
		return MultiboxOptionBadgeInterface.build(label, action, actionParams);
	},
	buildCheck: function () {
		return MultiboxOptionCheckInterface.build();
	},
	resize: function () {
		var oCheck = $(this).find("div.multibox-option-check-container");
		$.fn.centerVertically(this, oCheck, "margin", "10", "0");

		var oBadge = $(this).find("div.multibox-option-badge-container");
		$.fn.centerVertically(this, oBadge, "margin", "5", "0");
	}
};

MultiboxOptionCheckInterface = {
	materialIconLigature: "check_circle",

	getMaterialIcon: function () {
		return $("<i>").addClass("material-icons")
						.addClass("md-18 green")
						.html("check_circle");
	},
	build: function () {
		var that = this;
		return $("<div>").addClass("multibox-option-check-container")
							.css("display", "none")
							.append(that.getMaterialIcon())
							.on("mouseup", that.onMouseUp)
                            .hover(that.onHoverOver, that.onHoverOut);
	},
	onMouseUp: function () {
		// If selected or selecting and mouse upped on cancel, deselect
		var oMultiboxOption = $(this).closest("div.multibox-option");
		if ((oMultiboxOption.hasClass("ui-selected") || oMultiboxOption.hasClass("ui-selecting"))
			&& this.innerHTML === "cancel") 
		{
			oMultiboxOption.removeClass("ui-selected").removeClass("ui-selecting");
			$(this).closest("div.multibox-option-check-container")
					.css("display", "none");
			$(this).html("check_circle")
					.removeClass("red")
					.addClass("green");
		}

		$("#multibox").multibox("selectionChanged");
	},
	onHoverOver: function () {
        $(this).html("cancel").removeClass("green").addClass("red");
	},
	onHoverOut: function () {
        $(this).html("check_circle").removeClass("red").addClass("green");	
	}
};

MultiboxOptionBadgeInterface = {
	getMaterialIcon: function (label, action, actionParams) {
		var that = this;
		return $("<i>").addClass("material-icons")
			  	     	.html("info")
			  		 	.data("label", label)
					  	.bind("click", function () {
					  		that.onClick(label, action, actionParams);
					  	});
	},
	build: function (label, action, actionParams) {
		var that = this;
		return $("<div>").addClass("multibox-option-badge-container")
						.addClass("float-right")
			   			.append(
			   				that.getMaterialIcon(label, action, actionParams)
		   				);	
	},
	onClick: function (action, actionParams) {
		if ((action === null) || (action === undefined)) {
  			return;
  		}

  		action.apply(this, actionParams);
	}
};
