Router.configure({
  layout: 'layout'
});


Router.map(function() {
  var afterRunHook = function() {
    
  };
  this.route('home', { path: '/', onAfterRun: afterRunHook() });
  this.route('about', { path: '/about', onAfterRun: afterRunHook() });
  this.route('contact', { path: '/contact', onAfterRun: afterRunHook() });
});