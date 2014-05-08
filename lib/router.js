Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/'
  });
  this.route('about', {
    path: '/about'
  });
  this.route('contact', {
    path: '/contact'
  });
  this.route('form', {
    path: '/form'
  });
});
