(function(document) {
  'use strict';

  var webComponentsSupported = ('registerElement' in document &&
  'import' in document.createElement('link') &&
  'content' in document.createElement('template'));

  function finishLazyLoading() {
    var link = document.querySelector('#bundle');

    function onImportLoaded() {
      var skeleton = document.getElementById('skeleton');
      skeleton.remove();

      console.log('Elements are upgraded!');
    }

    if (link.import && link.import.readyState === 'complete') {
      console.log('async Import loaded too quickly! Please wait...');
      onImportLoaded();
    }else {
      console.log('Removing skeleton...');
      link.addEventListener('load', onImportLoaded);
    }
  }

  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
    console.log('web-components polyfill is needed!');
  }else {
    console.log('Native Shadow DOM supported! finishlazyLoading...');
    finishLazyLoading();
  }

  window.addEventListener('WebComponentsReady', function() {
    console.log('web-components-ready');
  });

  var blog = document.querySelector('semafloor-app-page');

  function once(node, event, fn, args) {
    /* jshint validthis: true */
    var _self = this;
    var listener = function() {
      fn.apply(_self, args);
      node.removeEventListener(event, listener, false);
    };
    node.addEventListener(event, listener, false);
  }

  page('/:category/list', function(ctx) {
    console.log(ctx);
    var category = ctx.params.category;

    function setData() {

      blog.category = category;
      blog.page = category;
      window.scrollTo(0, 0);
    }

    if (!blog.upgraded) {
      once(blog, 'upgraded', setData);
    }else {
      setData();
    }
  });

  page('*', function() {
    console.log('Cant\'t find: ' +
    window.location.href +
    '. Redirected you to Home Page');
    page.redirect('/profile/list');
  });

  page();
})(document);
