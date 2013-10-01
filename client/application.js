Meteor.subscribe('userPresence');
Meteor.subscribe('state');
Meteor.subscribe('directory');

Template.layout.helpers({
  isUnderControl: function() {
    return !!Session.get('controlled');
  },
  controller: function() {
    var state = State.findOne({ userId: Meteor.userId() });
    if (state) {
      var user = Meteor.users.findOne(state.controllerUserId);
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
  isUnderControl: function() {
    return !!Session.get('controlled');
  },
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
    var form = {
      name: $('#name').val(),
      email: $('#email').val(),
      message: $('#message').val()
    };
    Session.set('form', form);

    if (Session.get('controlled')) {
      Meteor.call('updateStateControlled', { form: form });
    }
    if (Session.get('controlling')) {
      Meteor.call('updateStateControlling', { form: form });
    }
  }
});

Meteor.startup(function() {
  /**
    observers for controlled
  */
  State.find({ userId: Meteor.userId() }).observeChanges({
    changed: function (id, fields) {
      if (fields.route)
        Router.go(fields.route);

      if (fields.form)
        $('form').populate(fields.form);
    },
    added: function (id, fields) {
      // update state so that controller gains current state
      Meteor.call('updateStateControlled', {
        route: Router.current().path,
        form: Session.get('form')
      });
      Session.set('controlled', fields.controllerUserId);
    },
    removed: function (id) {
      Session.set('controlled', '');
    }
  });

  /**
    observers for controller
  */
  State.find({ controllerUserId: Meteor.userId() }).observeChanges({
    changed: function(id, fields) {
      if (fields.route)
        Router.go(fields.route);

      if (fields.form)
        $('form').populate(fields.form);
    },
    added: function (id, fields) {
      Session.set('controlling', fields.userId);
    },
    removed: function (id) {
      Session.set('controlling', '');
    }
  });
});
