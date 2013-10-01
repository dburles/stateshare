Meteor.methods({
  control: function(userId) {
    if (typeof userId !== 'undefined' && Meteor.user()) {
      State.remove({ userId: userId, controllerUserId: Meteor.userId() });
      State.insert({ userId: userId, controllerUserId: Meteor.userId() });
    }
  },
  unControl: function(userId) {
    if (typeof userId !== 'undefined' && Meteor.user()) {
      State.remove({ userId: userId, controllerUserId: Meteor.userId() });
    }
  },
  updateStateControlling: function(obj) {
    if (typeof obj !== 'undefined' && Meteor.user()) {
      State.update({ controllerUserId: Meteor.userId() }, { $set: obj });
    }
  },
  updateStateControlled: function(obj) {
    if (typeof obj !== 'undefined' && Meteor.user()) {
      State.update({ userId: Meteor.userId() }, { $set: obj });
    }
  }
});
