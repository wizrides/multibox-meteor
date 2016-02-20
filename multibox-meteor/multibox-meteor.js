MultiboxOptions = new Mongo.Collection("MultiboxOptions");

// Code to run on client
if (Meteor.isClient) {
    Template.multibox.helpers({
    	multiboxOptions: function () {
    		return MultiboxOptions.find({}).fetch();
    	}
    });

    Template.multibox.onRendered(function () {
        MultiboxPlayground.Ready();
    });

    Template.multiboxOption.onRendered(function () {
    	MultiboxOptionInterface.build(this);
    });
}

// Code to run on server
if (Meteor.isServer) {
    Meteor.startup(function () {
        var options = MultiboxOptions.find({}).fetch();
        options.forEach(function (option) {
            MultiboxOptions.remove({ _id: option._id });
        });

        for (var i = 0; i < 100; i++) {
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
                badgeLabel: i,
                showCheck: true,
                badgeLabel: i,
                badgeAction: function (count) { alert(count); },
                badgeActionParams: i
            });
        }
    });
}
