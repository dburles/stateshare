Meteor.methods({
  control: function(userId) {
    if (typeof userId !== 'undefined' && Meteor.user()) {
      State.remove({ clientUserId: userId, hostUserId: Meteor.userId() });
      State.insert({ clientUserId: userId, hostUserId: Meteor.userId() });
    }
  },
  unControl: function(userId) {
    if (typeof userId !== 'undefined' && Meteor.user()) {
      State.remove({ clientUserId: userId, hostUserId: Meteor.userId() });
    }
  },
  updateStateHost: function(obj) {
    if (typeof obj !== 'undefined' && Meteor.user()) {
      State.update({ hostUserId: Meteor.userId() }, { $set: _.extend(obj, { lastAction: 'host' }) });
    }
  },
  updateStateClient: function(obj) {
    if (typeof obj !== 'undefined' && Meteor.user()) {
      State.update({ clientUserId: Meteor.userId() }, { $set: _.extend(obj, { lastAction: 'client' }) });
    }
  }
});
