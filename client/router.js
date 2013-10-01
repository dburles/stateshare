Router.configure({
  layout: 'layout'
});


Router.map(function() {
  var afterReRunHook = function() {
    console.log(Session.get('controlled'));
    // if (Session.get('controlled')) {
    //   console.log('updateState');
    //   Meteor.call('updateState', { route: Router.current().path });
    // }
  };
  this.route('home', { path: '/', controller: 'MainRouteController' });
  this.route('about', { path: '/about', controller: 'MainRouteController' });
  this.route('contact', { path: '/contact', controller: 'MainRouteController' });
  this.route('form', { path: '/form', controller: 'MainRouteController' });
});

MainRouteController = RouteController.extend({
  onAfterRun: function() {
    if (Session.get('controlled')) {
      Meteor.call('updateStateControlled', { route: Router.current().path });
    }
    if (Session.get('controlling')) {
      Meteor.call('updateStateControlling', { route: Router.current().path });
    }
  }
});