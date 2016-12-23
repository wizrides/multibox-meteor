MultiboxOptionInterface = {
	Build: function (option) {
		var that = this;
		var oObject = option.find("div.multibox-option");

		if (option.data.showCheck) {
    		$(oObject).addClass("ui-selectee");
    		$(oObject).append(MultiboxOptionCheckInterface.Build());
    	}

    	var moLabel = that.BuildLabel(option.data.mainLabel, option.data.subLabel);
    	$(oObject).append(moLabel);

		if (option.data.showBadge) {
    		$(oObject).append(MultiboxOptionBadgeInterface.Build(
    			option.data.badgeLabel, 
    			option.data.badgeAction, 
    			option.data.badgeActionParams
			));
    	}

    	$(oObject).data("group", option.data.groups);
    	$(oObject).resize(that.Resize);

    	$("#multibox").multibox("appendOption", $(oObject));
	},

	BuildLabel: function (mainLabel, subLabel) {
		return $("<div>").addClass("multibox-option-label-container")
				   		.append($("<label>").addClass("multibox-option-main-label")
									   		.text(mainLabel))
				   		.append($("<label>").addClass("multibox-option-sub-label")
										   	.text(subLabel));
	},

	BuildBadge: function (label, action, actionParams) {
		return MultiboxOptionBadgeInterface.Build(label, action, actionParams);
	},

	BuildCheck: function () {
		return MultiboxOptionCheckInterface.Build();
	},

	Resize: function () {
		var oCheck = $(this).find("div.multibox-option-check-container");
		$.fn.centerVertically(this, oCheck, "margin", "10", "0");

		var oBadge = $(this).find("div.multibox-option-badge-container");
		$.fn.centerVertically(this, oBadge, "margin", "5", "0");
	}
};

MultiboxOptionCheckInterface = {
	CheckLigature: "check_circle",
	CancelLigature: "cancel",

	GetCheckIcon: function () {
		return $("<i>").addClass("material-icons")
						.addClass("md-18 green")
						.html(MultiboxOptionCheckInterface.CheckLigature);
	},

	GetCancelIcon: function () {
		return $("<i>").addClass("material-icons")
						.addClass("md-18 green")
						.html(MultiboxOptionCheckInterface.CancelLigature);
	},

	Build: function () {
		var that = this;
		return $("<div>").addClass("multibox-option-check-container")
							.css("display", "none")
							.append(MultiboxOptionCheckInterface.GetCheckIcon())
							.on("mouseup", MultiboxOptionCheckInterface.OnMouseUp)
                            .hover(MultiboxOptionCheckInterface.OnHoverOver, MultiboxOptionCheckInterface.OnHoverOut);
	},

	OnMouseUp: function () {
		var that = this;

		// If selected or selecting and mouse upped on cancel, deselect
		var oMultiboxOption = $(that).closest("div.multibox-option");
		if ((oMultiboxOption.hasClass("ui-selected") || oMultiboxOption.hasClass("ui-selecting"))
			&& that.innerHTML === "cancel") {
			oMultiboxOption.removeClass("ui-selected").removeClass("ui-selecting");
			$(that).closest("div.multibox-option-check-container")
					.css("display", "none");
			$(that).html(MultiboxOptionCheckInterface.GetCheckIcon())
					.removeClass("red")
					.addClass("green");
		}

		$("#multibox").multibox("selectionChanged");
	},

	OnHoverOver: function () {
		var cancelIcon = MultiboxOptionCheckInterface.GetCancelIcon();
        $(this).html(cancelIcon[0].outerHTML).removeClass("green").addClass("red");
	},

	OnHoverOut: function () {
		var checkIcon = MultiboxOptionCheckInterface.GetCheckIcon();
        $(this).html(checkIcon[0].outerHTML).removeClass("red").addClass("green");	
	}
};

MultiboxOptionBadgeInterface = {
	GetMaterialIcon: function (label, action, actionParams) {
		var that = this;
		return $("<i>").addClass("material-icons")
			  	     	.html("info")
			  		 	.data("label", label)
					  	.bind("click", function () {
					  		that.OnClick(label, action, actionParams);
					  	});
	},

	Build: function (label, action, actionParams) {
		var that = this;
		return $("<div>").addClass("multibox-option-badge-container")
						.addClass("float-right")
			   			.append(
			   				that.GetMaterialIcon(label, action, actionParams)
		   				);
	},

	OnClick: function (action, actionParams) {
		if ((action === null) || (action === undefined)) {
  			return;
  		}

  		action.apply(this, actionParams);
	}
};
