Meteor.subscribe('userPresence');
Meteor.subscribe('state');
Meteor.subscribe('stateFormData');
Meteor.subscribe('directory');

Template.layout.helpers({
  isClient: function() {
    return Session.equals('currentState', 'client');
  },
  isHost: function() {
    return Session.equals('currentState', 'host');
  },
  hostEmail: function() {
    var state = State.findOne({ clientUserId: Meteor.userId() });
    if (state) {
      var user = Meteor.users.findOne(state.hostUserId);
      return user && user.emails[0].address;
    }
  },
  activePage: function(routeName) {
    var context = Router.current();
    return context && (context.route.name === routeName) && 'active';
  }
});

Template.users.helpers({
  isClient: function() {
    return Session.equals('currentState', 'client');
  },
  users: function() {
    return Meteor.user() && Meteor.presences.find({ userId: { $exists: true }});
  },
  isMe: function() {
    return this.userId === Meteor.userId();
  },
  userIsHost: function() {
    return Session.equals('clientUserId', this.userId);
  }
});

Template.users.events({
  'click a.control': function() {
    Meteor.call('control', this.userId);
  },
  'click a.uncontrol': function() {
    Meteor.call('unControl', this.userId);
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
    /**
      observers for client
    */
    State.find({ clientUserId: Meteor.userId() }).observeChanges({
      changed: function (id, fields) {
        if (fields._lastAction)
          Session.set('lastAction', fields._lastAction);

        if (Session.equals('lastAction', 'host')) {
          if (fields.route)
            Router.go(fields.route);

          // if (fields.form)
          //   $('form').populate(fields.form);
        }
      },
      added: function (id, fields) {
        // update state so that host gains current state
        Meteor.call('updateStateClient', {
          route: Router.current().path,
          form: Session.get('form')
        });
        Session.set('hostUserId', fields.hostUserId);
        Session.set('currentState', 'client');
      },
      removed: function (id) {
        Session.set('hostUserId', '');
        Session.set('currentState', '');
      }
    });

    StateFormData.find({ clientUserId: Meteor.userId() }).observeChanges({
      changed: function(id, fields) {
        if (fields._lastAction)
          Session.set('lastAction', fields._lastAction);

        if (Session.equals('lastAction', 'host')) {
          _.each(fields, function(val, key) {
            $('#' + key).val(val);
          });
        }
      }
    });

    /**
      observers for host
    */
    State.find({ hostUserId: Meteor.userId() }).observeChanges({
      changed: function(id, fields) {
        if (fields._lastAction)
          Session.set('lastAction', fields._lastAction);

        if (Session.equals('lastAction', 'client')) {
          if (fields.route)
            Router.go(fields.route);

          // console.log(fields);

          // if (fields.form) {
          //   // console.log(fields.form);
          //   _.each(fields.form, function(element) {
          //     console.log('populate: ', element);
          //   });
          //   // $('form').populate(fields.form);
          // }
        }
      },
      added: function (id, fields) {
        Session.set('clientUserId', fields.clientUserId);
        Session.set('currentState', 'host');
      },
      removed: function (id) {
        Session.set('clientUserId', '');
        Session.set('currentState', '');
      }
    });

    StateFormData.find({ hostUserId: Meteor.userId() }).observeChanges({
      changed: function(id, fields) {
        if (fields._lastAction)
          Session.set('lastAction', fields._lastAction);

        if (Session.equals('lastAction', 'client')) {
          _.each(fields, function(val, key) {
            $('#' + key).val(val);
          });
        }
      }
    });
  });
});