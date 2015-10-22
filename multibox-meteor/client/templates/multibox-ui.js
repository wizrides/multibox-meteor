MultiboxPlayground = {

    Ready: function () {
        var that = this;

        $("#multibox").multibox({
            change: function (event, ui) {
                that.DisplaySelectionChanged("#multibox");
                that.DisplaySelected("#multibox");
            }
        });

        $("#multibox-control-panel").multibox();

        that.ApplySearch();
        that.ApplyControls();

        //that.Rebuild("#multibox");
        //that.RebuildControlPanel("#multibox-control-panel")
    },

    ApplySearch: function () {
        var watermark = "Search";
        $("#search").val(watermark);
        $("#search").css("color", "#CCC");
        
        $("#search").focus(function () {
            if ($(this).val() === watermark) {
                $(this).val("");
                $(this).css("color", "#000");
            }
        });

        $("#search").blur(function () {
            if ($(this).val() == "") {
                $(this).val(watermark);
                $(this).css("color", "#CCC");
            }
        });

        $("#search").bind("keyup", function () {
            $("#multibox").multibox("search", $(this).val());
        });
    },

    ApplyControls: function () {
        var that = this;

        $("#rebuild").bind("click", function () {
            MultiboxPlayground.Rebuild("#multibox");
        });
        $("#clear").bind("click", function () {
            var options = MultiboxOptions.find({});
            options.forEach(function (option) {
                MultiboxOptions.remove({ _id: option._id });
            });
            //$("#multibox").multibox("clearOptions");
        });

        that.ApplySelectionControls();
        that.ApplyDisplayControls();
    },
    
    ApplySelectionControls: function () {
        $("#select-all").bind("click", function () {
            $("#multibox").multibox("selectAll");
        });
        $("#clear-selection").bind("click", function () {
            $("#multibox").multibox("clearSelection");
        });
        $("#select-odd").bind("click", function () {
            $("#multibox").multibox("selectGroup", "odd");
        });
        $("#select-even").bind("click", function () {
            $("#multibox").multibox("selectGroup", "even");
        });

        $("#selection-mode-single").bind("click", function () {
            $("#selection-mode-multiple").removeClass("current-selection");
            $("#selection-mode-single").addClass("current-selection");

            $("#multibox").multibox("option", "selectionMode", "single");
        });
        $("#selection-mode-multiple").bind("click", function () {
            $("#selection-mode-single").removeClass("current-selection");
            $("#selection-mode-multiple").addClass("current-selection");

            $("#multibox").multibox("option", "selectionMode", "multiple");
        });
    },

    ApplyDisplayControls: function () {
        $("#display-all").bind("click", function () {
            $("#display-selected").removeClass("current-selection");
            $("#display-all").addClass("current-selection");

            $("#multibox").multibox("showAll");
        });
        $("#display-selected").bind("click", function () {
            $("#display-all").removeClass("current-selection");
            $("#display-selected").addClass("current-selection");

            $("#multibox").multibox("showSelected");
        });
    },

    DisplaySelected: function (multiboxSelector) {
        var vals = $(multiboxSelector).multibox("getSelectedValues");
        var display = "";
        for (var i = 0; i < vals.length; i++) {
            if (display === "") {
            display = vals[i];
            }
            else {
                display = display + ", " + vals[i];
            }
        }

        $("#num-selected").val(display);
    },

    DisplaySelectionChanged: function (multiboxSelector) {
        $("#selection-changed").text("")
                                .show()
                                .css("color", "green")
                                .text("selection changed")
                                .fadeOut({
                                    duration: 600
                                });
    },

    GetDisplaySelection: function () {
        if ($("display-selected").hasClass("current-selection")) {
            return "selected";
        }

        return "all";
    },

    ShowAlert: function (message) {
        alert(message);
    },

    Rebuild: function (multiboxSelector) {
        $(multiboxSelector).multibox("clearOptions");

        //var oOverlay = document.createElement("div");
        //oOverlay.className = "loader";
        //$(multiboxSelector).append(oOverlay);

        var count = 300;
        for (var i = 0; i < count; i++) {
            var subOptionLabel = "Even";
            if (((i + 1) % 2) === 1) {
                subOptionLabel = "Odd";
            }

            subOptionLabel += " Sub Option";

            var multiboxOptionObject = {
                value: i,
                groups: [subOptionLabel],
                mainLabel: "Main Label " + (i + 1),
                subLabel: subOptionLabel,
                showBadge: true,
                badgeLabel: i + 1,
                showCheck: true,
                badgeAction: MultiboxPlayground.ShowAlert,
                badgeActionParams: [i + 1]
            };

            var multiboxOption = $(multiboxSelector).multibox("buildMultiboxOption", multiboxOptionObject);
            $(multiboxSelector).multibox("appendOption", multiboxOption);
        }

        $(multiboxSelector).multibox("initChecks");
        $(multiboxSelector).multibox("centerVerticallyBadges");
        $(multiboxSelector).multibox("enableHover");

        $("#display-all").addClass("current-selection");
        $("#display-selected").removeClass("current-selection");

        $("#selection-mode-multiple").addClass("current-selection");
        $("#selection-mode-single").removeClass("current-selection");
    },

    RebuildControlPanel: function (multiboxSelector) {
        $(multiboxSelector).multibox("clearOptions");

        var mcoAll = {
            value: "all",
            buttonValue: "Show All"
        };
        var mcoSelected = {
            value: "selected",
            buttonValue: "Show Selected"
        };

        var mcAll = $(multiboxSelector).multibox("buildMultiboxControl", mcoAll);
        var mcSelected = $(multiboxSelector).multibox("buildMultiboxControl", mcoSelected);
        $(multiboxSelector).multibox("appendOption", mcAll);
        $(multiboxSelector).multibox("appendOption", mcSelected);
    }
};