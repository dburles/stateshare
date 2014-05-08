Meteor.Presence.state = function() {
  return {
    route: Router.current() && Router.current().path || '',
    email: Meteor.user() && Meteor.user().email() || '',
    clientUserId: Session.get('clientUserId')
  };
};
