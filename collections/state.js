State = new Meteor.Collection('state');
State.allow({
  update: function() { return true; }
});