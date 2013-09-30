Meteor.subscribe('userPresence');
Meteor.subscribe('state');
Meteor.subscribe('directory');

Template.layout.helpers({
  isUnderControl: function() {
    return Meteor.user() && Meteor.presences.find({ 'state.controlling': Meteor.userId() }).count() > 0;
  },
  controller: function() {
    var presence = Meteor.presences.findOne({ 'state.controlling': Meteor.userId() });
    if (presence) {
      var user = Meteor.users.findOne(presence.userId);
      return user && user.emails[0].address;
    }
  },
  isControlling: function() {
    return !!Session.get('controlling');
  },
  activePage: function(routeName) {
    var context = Router.current();
    return context && (context.route.name === routeName) && 'active';
  }
});

Template.users.helpers({
  users: function() {
    return Meteor.user() && Meteor.presences.find({ userId: { $exists: true }});
  },
  me: function() {
    return this.userId === Meteor.userId();
  },
  controlling: function() {
    return Session.equals('controlling', this.userId);
  }
});

Template.users.events({
  'click a.control': function() {
    Session.set('controlling', this.userId);
  },
  'click a.uncontrol': function() {
    Session.set('controlling', '');
  }
});

Deps.autorun(function() {
  var presence;
  // If controlling
  // presence = Meteor.presences.findOne({ userId: Session.get('controlling') });
  // if (presence) {
  //   // if (Router.current().path !== presence.state.path)
  //   //   Router.go(presence.state.path);
  //   // if (Session.get('scrollPos') !== presence.state.scrollPos)
  //     // $(window).scrollTop(presence.state.scrollPos);
  // }

  // If under control
  presence = Meteor.presences.findOne({ 'state.controlling': Meteor.userId() });
  if (presence) {
    Router.go(presence.state.path);
    // if (Session.get('scrollPos') !== presence.state.scrollPos)
    $(window).scrollTop(presence.state.scrollPos);
  }
});

$(window).on('scroll', function() {
  Session.set('scrollPos', $(window).scrollTop());
});
