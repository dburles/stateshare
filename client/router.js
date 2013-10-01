Router.configure({
  layout: 'layout'
});

Router.map(function() {
  this.route('home', { path: '/', controller: 'MainRouteController' });
  this.route('about', { path: '/about', controller: 'MainRouteController' });
  this.route('contact', { path: '/contact', controller: 'MainRouteController' });
  this.route('form', { path: '/form', controller: 'MainRouteController' });
});

MainRouteController = RouteController.extend({
  onAfterRun: function() {
    if (Session.equals('currentState', 'client')) {
      Meteor.call('updateStateClient', { route: Router.current().path });
    }
    if (Session.equals('currentState', 'host')) {
      Meteor.call('updateStateHost', { route: Router.current().path });
    }
  }
});