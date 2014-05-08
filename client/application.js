Meteor.subscribe('userPresence');
// Meteor.subscribe('stateFormData');
Meteor.subscribe('directory');

Template.layout.helpers({
  isClient: function() {
    return Presences.find({ clientUserId: Meteor.userId() }).count() > 0;
  },
  isHost: function() {
    return !!Session.get('clientUserId');
  },
  email: function() {
    var user = Presences.findOne({ clientUserId: Meteor.userId() });
    return user && user.email;
  },
  activePage: function(routeName) {
    var context = Router.current();
    return context && (context.route.name === routeName) && 'active';
  }
});

Template.users.helpers({
  users: function() {
    return Meteor.user() && Meteor.presences.find();
  }
});

Template.user.helpers({
  isMe: function() {
    return this.userId === Meteor.userId();
  },
  isMyClient: function() {
    return Session.get('clientUserId') === this.userId;
  },
  imNotAClient: function() {
    return Presences.find({ clientUserId: Meteor.userId() }).count() === 0;
  }
});

Template.users.events({
  'click a.control': function() {
    Session.set('clientUserId', this.userId);
  },
  'click a.uncontrol': function() {
    Session.set('clientUserId', '');
  }
});

// $(window).on('scroll', function() {
//   Session.set('scrollPos', $(window).scrollTop());
// });

Template.form.events({
  'keyup input, keyup textarea': function(event, template) {
    Session.set('form', {
      name: $('#name').val(),
      email: $('#email').val(),
      message: $('#message').val()
    });

    var update = {};
    update[event.target.id] = event.target.value;

    if (Session.equals('currentState', 'client')) {
      Meteor.call('updateStateFormDataClient', update);
    }
    if (Session.equals('currentState', 'host')) {
      Meteor.call('updateStateFormDataHost', update);
    }
  }
});

Meteor.startup(function() {
  Deps.autorun(function() {
    // watch for someone controlling me
    Presences.find({ clientUserId: Meteor.userId() }).observeChanges({
      added: function(id, fields) {
        console.log(fields);

        if (fields.route)
          Router.go(fields.route);
      },
      changed: function(id, fields) {
        console.log(fields);

        if (fields.route)
          Router.go(fields.route);
      },
      removed: function(id) {

      }
    });

    // act on changes made by the user i'm controlling
    Presences.find({ userId: Session.get('clientUserId') }).observeChanges({
      added: function(id, fields) {
        console.log(fields);

        if (fields.route)
          Router.go(fields.route);
      },
      changed: function(id, fields) {
        console.log(fields);

        if (fields.route)
          Router.go(fields.route);
      },
      removed: function(id) {

      }
    });
  });
});