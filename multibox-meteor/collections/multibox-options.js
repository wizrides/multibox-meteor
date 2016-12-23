MultiboxOptions = new Mongo.Collection("MultiboxOptions");

if (Meteor.isServer) {
	//MultiboxOptions._ensureIndex({ value: 1, mainLabel: 1, subLabel: 1 });
}