Meteor.Presence.state = function() {
  return {
    online: true,
    path: Router.current().path,
    email: Meteor.user() ? Meteor.user().emails[0].address : '',
    controlling: Session.get('controlling'),
    scrollPos: Session.get('scrollPos')
  };
};
