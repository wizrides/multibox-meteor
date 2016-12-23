if (Meteor.isClient) {
    Template.multibox.helpers({
    	multiboxOptions: function () {
    		return MultiboxOptions.find({}).fetch();
    	}
    });

    Template.multiboxOptionCreate.onRendered(function () {
        MultiboxOptionCreateInterface.Build();
    });

    Template.multiboxOptionCreate.events({
        "submit .multibox-option-create-form": function (event) {
            event.preventDefault();

            var number = parseInt(event.target.number.value);
            var mainLabel = event.target.mainLabel.value;
            var subLabel = event.target.subLabel.value;

            var oOption = MultiboxOptionCreateInterface.Add(number, mainLabel, subLabel);

            MultiboxOptions.insert(oOption);

            event.target.number.value = null;
            event.target.mainLabel.value = "";
            event.target.subLabel.value = "";
        }
    });

    Template.multibox.onRendered(function () {
        MultiboxPlayground.Ready();
    });

    Template.multiboxOption.onRendered(function () {
    	MultiboxOptionInterface.Build(this);
    });
}

// Code to run on server
if (Meteor.isServer) {
    Meteor.startup(function () {
        var options = MultiboxOptions.find({}).fetch();
        options.forEach(function (option) {
            MultiboxOptions.remove({ _id: option._id });
        });

        for (var i = 0; i < 3; i++) {
            var strSubLabel = "even";
            if (i % 2 === 1) {
                strSubLabel = "odd";
            }

            MultiboxOptions.insert({
                _id: "" + i + "",
                value: i,
                groups: [strSubLabel],
                mainLabel: "Main Label " + i,
                subLabel: "" + strSubLabel + " " + i,
                showBadge: true,
                showCheck: true,
                badgeLabel: i,
                badgeAction: function (count) { alert(count); },
                badgeActionParams: i
            });
        }
    });
}
