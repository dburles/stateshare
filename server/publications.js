Meteor.publish('userPresence', function() {
  var filter = { userId: { $exists: true }};
  return Meteor.presences.find(filter);
});

Meteor.publish('directory', function() {
  return Meteor.users.find();
});

// Meteor.publish('state', function() {
//   return State.find();
// });

// Meteor.publish('stateFormData', function() {
//   return StateFormData.find();
// });