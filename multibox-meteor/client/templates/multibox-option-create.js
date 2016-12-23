MultiboxOptionCreateInterface = {
      Build: function () {
	},

	Add: function (number, mainLabel, subLabel) {
		return {
            _id: "" + number + "",
            value: number,
            groups: [subLabel, number],
            mainLabel: mainLabel,
            subLabel: subLabel,
            showBadge: true,
            badgeLabel: number,
            showCheck: true,
            badgeAction: function (count) { alert(count); },
            badgeActionParams: number
        };
	}
};