Meteor.publish('userPresence', function() {
  var filter = {};
  return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
});

Meteor.publish('directory', function() {
  return Meteor.users.find();
});

Meteor.publish('state', function() {
  return State.find();
});