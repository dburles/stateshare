Meteor.Presence.state = function() {
  return {
    online: true,
    route: Router.current().path,
    email: Meteor.user() ? Meteor.user().emails[0].address : '',
    // controlling: Session.get('controlling'),
    // scrollPos: Session.get('scrollPos'),
    // form: Session.get('form')
  };
};
