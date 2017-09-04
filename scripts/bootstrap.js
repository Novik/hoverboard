/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  function lazyLoadWCPolyfillsIfNecessary(callback) {
    callback = callback || null;
    var onload = function () {
      // For native Imports, manually fire WCR so user code
      // can use the same code path for native and polyfill'd imports.
      if (!window.HTMLImports) {
        document.dispatchEvent(
          new CustomEvent('WebComponentsReady', {bubbles: true}));
      }
      if (callback) {
        callback();
      }
    };

    var webComponentsSupported = (
    'registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'));

    if (webComponentsSupported) {
      onload();
    } else {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'bower_components/webcomponentsjs/webcomponents-lite.min.js';
      script.onload = onload;
      document.head.appendChild(script);
    }

    if (!(HOVERBOARD.Util.getChromeVersion() &&
      HOVERBOARD.Util.getChromeVersion() >= 46 || HOVERBOARD.Util.getFirefoxVersion() && HOVERBOARD.Util.getFirefoxVersion() >= 40)) {
      var parent = document.querySelector('body');
      var swScript = document.querySelector('#sw-registration');
      var polyfillScript = document.createElement('script');
      polyfillScript.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,intl';
      parent.insertBefore(polyfillScript, swScript);

      console.log('Your browser is out-of-date. Please download one of these up-to-date, free and excellent browsers: Chrome, Chromium, Opera, Vivaldi');
    }
  }

  window.addEventListener('offline', function () {
    if (HOVERBOARD.Elements && HOVERBOARD.Elements.Template.$.toast) {
      HOVERBOARD.Elements.Template.$.toast.showMessage(
        'You can still work offline.');
    }
  });

  function initApp() {
    // wc.js brings in a URL() polyfill that we need to wait for in unsupported
    // browsers. In Chrome, lazyLoadWCPolyfillsIfNecessary is effectively not
    // async. It's a noop and its callback gets invoked right away. Therefore,
    // this shouldn't slow anything down.
    lazyLoadWCPolyfillsIfNecessary(function () {
      HOVERBOARD.Elements.init();
    });
  }

  initApp();
})();
