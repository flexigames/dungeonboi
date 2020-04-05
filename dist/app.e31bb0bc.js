// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/crtrdg-gameloop/node_modules/eventemitter2/lib/eventemitter2.js":[function(require,module,exports) {
var define;
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      this._events.maxListeners = conf.maxListeners !== undefined ? conf.maxListeners : defaultMaxListeners;
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);
      conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    } else {
      this._events.maxListeners = defaultMaxListeners;
    }
  }

  function logPossibleMemoryLeak(count, eventName) {
    var errorMsg = '(node) warning: possible EventEmitter memory ' +
        'leak detected. %d listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';

    if(this.verboseMemoryLeak){
      errorMsg += ' Event name: %s.';
      console.error(errorMsg, count, eventName);
    } else {
      console.error(errorMsg, count);
    }

    if (console.trace){
      console.trace();
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    this.verboseMemoryLeak = false;
    configure.call(this, conf);
  }
  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name !== undefined) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else {
          if (typeof tree._listeners === 'function') {
            tree._listeners = [tree._listeners];
          }

          tree._listeners.push(listener);

          if (
            !tree._listeners.warned &&
            this._events.maxListeners > 0 &&
            tree._listeners.length > this._events.maxListeners
          ) {
            tree._listeners.warned = true;
            logPossibleMemoryLeak.call(this, tree._listeners.length, name);
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    if (n !== undefined) {
      this._events || init.call(this);
      this._events.maxListeners = n;
      if (!this._conf) this._conf = {};
      this._conf.maxListeners = n;
    }
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();
      if (al > 3) {
        args = new Array(al);
        for (j = 0; j < al; j++) args[j] = arguments[j];
      }

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    var promises= [];

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all) {
      if (al > 3) {
        args = new Array(al);
        for (j = 1; j < al; j++) args[j] = arguments[j];
      }
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, args));
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener) {
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else {
      if (typeof this._events[type] === 'function') {
        // Change to array.
        this._events[type] = [this._events[type]];
      }

      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (
        !this._events[type].warned &&
        this._events.maxListeners > 0 &&
        this._events[type].length > this._events.maxListeners
      ) {
        this._events[type].warned = true;
        logPossibleMemoryLeak.call(this, this._events[type].length, type);
      }
    }

    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if (!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }

        this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }

        this.emit("removeListener", type, listener);
      }
    }

    function recursivelyGarbageCollect(root) {
      if (root === undefined) {
        return;
      }
      var keys = Object.keys(root);
      for (var i in keys) {
        var key = keys[i];
        var obj = root[key];
        if ((obj instanceof Function) || (typeof obj !== "object") || (obj === null))
          continue;
        if (Object.keys(obj).length > 0) {
          recursivelyGarbageCollect(root[key]);
        }
        if (Object.keys(obj).length === 0) {
          delete root[key];
        }
      }
    }
    recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++)
        this.emit("removeListenerAny", fns[i]);
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if (this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else if (this._events) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenerCount = function(type) {
    return this.listeners(type).length;
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],"../rbd/pnpm-volume/8804483f-7435-434d-ab8d-d8d811696a6a/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/crtrdg-gameloop/node_modules/performance-now/lib/performance-now.js":[function(require,module,exports) {
var process = require("process");
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

},{"process":"../rbd/pnpm-volume/8804483f-7435-434d-ab8d-d8d811696a6a/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/crtrdg-gameloop/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],"node_modules/crtrdg-gameloop/node_modules/raf/node_modules/performance-now/lib/performance-now.js":[function(require,module,exports) {
var process = require("process");
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



},{"process":"../rbd/pnpm-volume/8804483f-7435-434d-ab8d-d8d811696a6a/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/crtrdg-gameloop/node_modules/raf/index.js":[function(require,module,exports) {
var global = arguments[3];
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

},{"performance-now":"node_modules/crtrdg-gameloop/node_modules/raf/node_modules/performance-now/lib/performance-now.js"}],"node_modules/crtrdg-gameloop/node_modules/gameloop/index.js":[function(require,module,exports) {
var Emitter = require('eventemitter2').EventEmitter2
var now = require('performance-now')
var inherits = require('inherits')
var raf = require('raf')

module.exports = Game
inherits(Game, Emitter)

/**
* Create the game
* @name createGame
* @param {Object} options
* @param {Object} options.renderer
* @param {Number} options.fps
* @example
* var createGame = require('gameloop')
*
* var game = createGame({
*   renderer: document.createElement('canvas').getContext('2d')
* })
*/
function Game (options) {
  if (!(this instanceof Game)) return new Game(options)
  options = options || {}
  Emitter.call(this)
  this.paused = true
  this.renderer = options.renderer || {}
  this.fps = options.fps || 60
  this.step = 1 / this.fps
}

/**
* Start the game. Emits the `start` event.
* @name game.start
* @fires Game#start
* @param {Object} state – arbitrary starting game state emitted by `start` event.
* @example
* game.start()
*/
Game.prototype.start = function start (state) {
  this.paused = false
  this.last = now()
  this.time = 0
  this.accumulator = 0
  this.emit('start', state)
  raf(this.frame.bind(this))
}

/**
* Execute a frame
* @name game.frame
* @private
*/
Game.prototype.frame = function frame (time) {
  if (!this.paused) {
    var newTime = now()
    var dt = (newTime - this.last) / 1000
    if (dt > 0.2) dt = this.step
    this.accumulator += dt
    this.last = newTime

    while (this.accumulator >= this.step) {
      this.time += this.step
      this.accumulator -= this.step
      this.update(this.step, this.time)
    }

    this.draw(this.renderer, this.accumulator / this.step)
    raf(this.frame.bind(this))
  }
}

/**
* Update the game state. Emits the `update` event. You'll likely never call this method, but you may need to override it. Make sure to always emit the update event with the `delta` time.
* @name game.update
* @param {Number} interval – interval between each frame
* @param {Number} time – total time elapsed
* @fires Game#update
*/
Game.prototype.update = function update (interval, time) {
  this.emit('update', interval, time)
}

/**
* Draw the game. Emits the `draw` event. You'll likely never call this method, but you may need to override it. Make sure to always emit the update event with the renderer and `delta` time.
* @name game.draw
* @param {Object} renderer
* @param {Number} deltaTime – time remaining until game.update is called
* @fires Game#draw
*/
Game.prototype.draw = function draw (renderer, frameState) {
  this.emit('draw', renderer, frameState)
}

/**
* End the game. Emits the `end` event/
* @name game.end
* @param {Object} state – state of end game conditions
* @fires Game#end
* @example
* game.end()
*/
Game.prototype.end = function end (state) {
  this.emit('end', state)
}

/**
* Pause the game. Emits the `pause` event.
* @name game.pause
* @fires Game#pause
* @example
* game.pause()
*/
Game.prototype.pause = function pause () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

/**
* Resume the game. Emits the `resume` event.
* @name game.resume
* @fires Game#resume
* @example
* game.resume()
*/
Game.prototype.resume = function resume () {
  if (this.paused) {
    this.start()
    this.emit('resume')
  }
}

/**
* Pause or start game depending on game state. Emits either the `pause` or `resume` event.
* @name game.toggle
* @example
* game.toggle()
*/
Game.prototype.toggle = function toggle () {
  if (this.paused) this.resume()
  else this.pause()
}

/* Event documentation */

/**
* Start event. Fired when `game.start()` is called.
*
* @event Game#start
* @example
* game.on('start', function () {})
*/

/**
* End event. Fired when `game.end()` is called.
*
* @event Game#end
* @param {Object} state - state of end game conditions
* @example
* game.on('end', function (state) {})
*/

/**
* Update event.
*
* @event Game#update
* @param {Number} interval – interval between each frame
* @param {Number} frameState – current state of the completion of the frame
* @param {Number} time – total time elapsed
* @example
* game.on('update', function (interval, time) {
*   console.log(interval)
* })
*/

/**
* Draw event.
*
* @event Game#draw
* @param {Number} frameState – current state of the completion of the frame
* @param {Number} delta
* @example
* game.on('draw', function (renderer, dt) {
*   console.log(dt)
* })
*/

/**
* Pause event. Fired when `game.pause()` is called.
*
* @event Game#pause
* @example
* game.on('pause', function () {})
*/

/**
* Resume event. Fired when `game.resume()` is called.
*
* @event Game#resume
* @example
* game.on('resume', function () {})
*/

},{"eventemitter2":"node_modules/crtrdg-gameloop/node_modules/eventemitter2/lib/eventemitter2.js","performance-now":"node_modules/crtrdg-gameloop/node_modules/performance-now/lib/performance-now.js","inherits":"node_modules/crtrdg-gameloop/node_modules/inherits/inherits_browser.js","raf":"node_modules/crtrdg-gameloop/node_modules/raf/index.js"}],"node_modules/crtrdg-gameloop/node_modules/gameloop-canvas/index.js":[function(require,module,exports) {
var GameLoop = require('gameloop')

module.exports = function (options) {
  options || (options = {})
  var canvas

  if (!options.canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'game'
    document.body.appendChild(canvas)
  } else if (typeof options.canvas === 'string') {
    canvas = document.getElementById(options.canvas)
  } else if (typeof options.canvas === 'object' && options.canvas.tagName) {
    canvas = options.canvas
  }

  var game = new GameLoop({
    renderer: canvas.getContext('2d')
  })

  game.canvas = canvas
  game.width = canvas.width = options.width || 1024
  game.height = canvas.height = options.height || 480

  return game
}

},{"gameloop":"node_modules/crtrdg-gameloop/node_modules/gameloop/index.js"}],"node_modules/crtrdg-gameloop/node_modules/isarray/index.js":[function(require,module,exports) {
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],"node_modules/crtrdg-gameloop/index.js":[function(require,module,exports) {
var createGameLoop = require('gameloop-canvas')
var isarray = require('isarray')

/**
* Create the game
* @name createGame
* @extends module:gameloop-canvas
* @param {Object} options
* @param {Object} [options.canvas] – id or dom node of canvas tag
* @param {Number} [options.fps]
* @example
* var createGame = require('crtrdg-gameloop')
*
* var game = createGame({ canvas: 'game' })
*/
module.exports = function createGame (options) {
  options = options || {}
  var game = createGameLoop(options)

  /**
  * Draw to the canvas
  * @name game.draw
  * @param {Object} renderer
  * @param {Number} delta – time elapsed since last update
  * @fires Game#draw
  */
  game.draw = function crtrdg_gameloop_draw (context, delta) {
    context.clearRect(0, 0, game.width, game.height)
    game.emit('draw-background', context, delta)
    game.drawAllLayers(context, delta)
    game.emit('draw-foreground', context, delta)
  }

  game.drawAllLayers = function crtrdg_gameloop_drawAllLayers (context, dt) {
    if (game.layers && isarray(game.layers)) {
      for (var i = 0; i < game.layers.length; i++) {
        game.emit('draw-layer', game.layers[i], context, dt)

        if (game.layers[i] === 0) {
          game.emit('draw', context, dt)
        }
      }
    } else {
      game.emit('draw', context, dt)
    }
  }

  return game
}

/* gameloop documentation */

/**
* Update the game state. Emits the `update` event. You'll likely never call this method, but you may need to override it. Make sure to always emit the update event with the `delta` time.
* @name game.update
* @param {Number} delta – time elapsed since last update
* @fires Game#update
*/

/**
* End the game. Emits the `end` event/
* @name game.end
* @fires Game#end
* @example
* game.end()
*/

/**
* Pause or start game depending on game state. Emits either the `pause` or `resume` event.
* @name game.toggle
* @example
* game.toggle()
*/

/**
* Resume the game. Emits the `resume` event.
* @name game.resume
* @fires Game#resume
* @example
* game.resume()
*/

/* gameloop events */

/**
* Start event. Fired when `game.start()` is called.
*
* @event Game#start
* @example
* game.on('start', function () {})
*/

/**
* End event. Fired when `game.end()` is called.
*
* @event Game#end
* @example
* game.on('end', function () {})
*/

/**
* Update event.
*
* @event Game#update
* @param {Number} delta
* @example
* game.on('update', function (dt) {
*   console.log(dt)
* })
*/

/**
* Draw event.
*
* @event Game#draw
* @param {Object} renderer
* @param {Number} delta
* @example
* game.on('draw', function (renderer, dt) {
*   console.log(dt)
* })
*/

/**
* Pause event. Fired when `game.pause()` is called.
*
* @event Game#pause
* @example
* game.on('pause', function () {})
*/

/**
* Resume event. Fired when `game.resume()` is called.
*
* @event Game#resume
* @example
* game.on('resume', function () {})
*/


},{"gameloop-canvas":"node_modules/crtrdg-gameloop/node_modules/gameloop-canvas/index.js","isarray":"node_modules/crtrdg-gameloop/node_modules/isarray/index.js"}],"level.txt":[function(require,module,exports) {
module.exports = "................................\n................................\n................................\n................................\n................................\n....-...........................\n................................\n.-----------------------------x.\n._____________________________|.\n._____________________________|.\n._____________________________|.\n._____________________________|.\n.______________________________.\n.______________________________.\n.______________________________.\n.______________..______________.\n.______________________________.\n.______________________________.\n.______________________________.\n.______________________________.\n.______________________________.\n.______________________________.\n.______________________________.\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................\n................................";
},{}],"tiles_list_v1.3.txt":[function(require,module,exports) {
module.exports = "wall_top_left 16 0 16 16\nwall_top_mid 32 0 16 16\nwall_top_right 48 0 16 16\n\nwall_left 16 16 16 16\nwall_mid 32 16 16 16\nwall_right 48 16 16 16\n\nwall_fountain_top 64 0 16 16\nwall_fountain_mid_red_anim 64 16 16 16 3\nwall_fountain_basin_red_anim 64 32 16 16 3\nwall_fountain_mid_blue_anim 64 48 16 16 3\nwall_fountain_basin_blue_anim 64 64 16 16 3\n\nwall_hole_1 48 32 16 16\nwall_hole_2 48 48 16 16\n\nwall_banner_red 16 32 16 16\nwall_banner_blue 32 32 16 16\nwall_banner_green 16 48 16 16\nwall_banner_yellow 32 48 16 16\n\ncolumn_top 80 80 16 16\ncolumn_mid 80 96 16 16\ncoulmn_base 80 112 16 16\nwall_column_top 96 80 16 16\nwall_column_mid 96 96 16 16\nwall_coulmn_base 96 112 16 16\n\nwall_goo 64 80 16 16\nwall_goo_base 64 96 16 16\n\nfloor_1 16 64 16 16\nfloor_2 32 64 16 16\nfloor_3 48 64 16 16\nfloor_4 16 80 16 16\nfloor_5 32 80 16 16\nfloor_6 48 80 16 16\nfloor_7 16 96 16 16\nfloor_8 32 96 16 16\nfloor_ladder 48 96 16 16\n\nfloor_spikes_anim 16 176 16 16 4\n\nwall_side_top_left 0 112 16 16\nwall_side_top_right 16 112 16 16\nwall_side_mid_left 0 128 16 16\nwall_side_mid_right 16 128 16 16\nwall_side_front_left 0 144 16 16\nwall_side_front_right 16 144 16 16\n\nwall_corner_top_left 32 112 16 16\nwall_corner_top_right 48 112 16 16\nwall_corner_left 32 128 16 16\nwall_corner_right 48 128 16 16\nwall_corner_bottom_left 32 144 16 16\nwall_corner_bottom_right 48 144 16 16\nwall_corner_front_left 32 160 16 16\nwall_corner_front_right 48 160 16 16\n\nwall_inner_corner_l_top_left 80 128 16 16\nwall_inner_corner_l_top_rigth 64 128 16 16\nwall_inner_  corner_mid_left 80 144 16 16\nwall_inner_corner_mid_rigth 64 144 16 16\nwall_inner_corner_t_top_left 80 160 16 16\nwall_inner_corner_t_top_rigth 64 160 16 16\n\nedge 96 128 16 16\nhole  96 144 16 16\n\ndoors_all 16 221 64 35\ndoors_frame_left 16 224 16 32\ndoors_frame_top 32 221 32 3\ndoors_frame_righ 63 224 16 32\ndoors_leaf_closed 32 224 32 32\ndoors_leaf_open 80 224 32 32\n\nchest_empty_open_anim 304 288 16 16 3\nchest_full_open_anim 304 304 16 16 3\nchest_mimic_open_anim 304 320 16 16 3\n\nflask_big_red 288 224 16 16\nflask_big_blue 304 224 16 16\nflask_big_green 320 224 16 16\nflask_big_yellow 336 224 16 16\n\nflask_red 288 240 16 16\nflask_blue 304 240 16 16\nflask_green 320 240 16 16\nflask_yellow 336 240 16 16\n\nskull 288 320 16 16\ncrate 288 298 16 22\n\ncoin_anim 288 272 8 8 4\n\nui_heart_full 288 256 16 16\nui_heart_half 304 256 16 16\nui_heart_empty 320 256 16 16\n\nweapon_knife 293 18 6 13\nweapon_rusty_sword 307 26 10 21\nweapon_regular_sword 323 26 10 21\nweapon_red_gem_sword 339 26 10 21\nweapon_big_hammer 291 42 10 37\nweapon_hammer 307 55 10 24\nweapon_baton_with_spikes 323 57 10 22\nweapon_mace 339 55 10 24\nweapon_katana 293 82 6 29\nweapon_saw_sword 307 86 10 25\nweapon_anime_sword 322 81 12 30\nweapon_axe 341 90 9 21\nweapon_machete 294 121 5 22\nweapon_cleaver 310 124 8 19\nweapon_duel_sword 325 113 9 30\nweapon_knight_sword 339 114 10 29\nweapon_golden_sword 291 153 10 22\nweapon_lavish_sword 307 145 10 30\nweapon_red_magic_staff 324 145 8 30\nweapon_green_magic_staff 340 145 8 30\nweapon_spear 293 177 6 30\n\ntiny_zombie_idle_anim 368 16 16 16 4\ntiny_zombie_run_anim 432 16 16 16 4\ngoblin_idle_anim 368 32 16 16 4\ngoblin_run_anim 432 32 16 16 4\nimp_idle_anim 368 48 16 16 4\nimp_run_anim 432 48 16 16 4\nskelet_idle_anim 368 80 16 16 4\nskelet_run_anim 432 80 16 16 4\nmuddy_idle_anim 368 112 16 16 4\nmuddy_run_anim 368 112 16 16 4\nswampy_idle_anim 432 112 16 16 4\nswampy_run_anim 432 112 16 16 4\nzombie_idle_anim 368 144 16 16 4\nzombie_run_anim 368 144 16 16 4\nice_zombie_idle_anim 432 144 16 16 4\nice_zombie_run_anim 432 144 16 16 4\nmasked_orc_idle_anim 368 172 16 20 4\nmasked_orc_run_anim 432 172 16 20 4\norc_warrior_idle_anim 368 204 16 20 4\norc_warrior_run_anim 432 204 16 20 4\norc_shaman_idle_anim 368 236 16 20 4\norc_shaman_run_anim 432 236 16 20 4\nnecromancer_idle_anim 368 268 16 20 4\nnecromancer_run_anim 368 268 16 20 4\nwogol_idle_anim 368 300 16 20 4\nwogol_run_anim 432 300 16 20 4\nchort_idle_anim 368 328 16 24 4\nchort_run_anim 432 328 16 24 4\nbig_zombie_idle_anim 16 270 32 34 4\nbig_zombie_run_anim 144 270 32 34 4\nogre_idle_anim  16 320 32 32 4\nogre_run_anim 144 320 32 32 4\nbig_demon_idle_anim  16 364 32 36 4\nbig_demon_run_anim 144 364 32 36 4\n\nelf_f_idle_anim 128 4 16 28 4\nelf_f_run_anim 192 4 16 28 4\nelf_f_hit_anim 256 4 16 28 1\n\nelf_m_idle_anim 128 36 16 28 4\nelf_m_run_anim 192 36 16 28 4\nelf_m_hit_anim 256 36 16 28 1\n\nknight_f_idle_anim 128 68 16 28 4\nknight_f_run_anim 192 68 16 28 4\nknight_f_hit_anim 256 68 16 28 1\n\nknight_m_idle_anim 128 100 16 28 4\nknight_m_run_anim 192 100 16 28 4\nknight_m_hit_anim 256 100 16 28 1\n\nwizzard_f_idle_anim 128 132 16 28 4\nwizzard_f_run_anim 192 132 16 28 4\nwizzard_f_hit_anim 256 132 16 28 1\n\nwizzard_m_idle_anim 128 164 16 28 4\nwizzard_m_run_anim 192 164 16 28 4\nwizzard_m_hit_anim 256 164 16 28 1\n\nlizard_f_idle_anim 128 196 16 28 4\nlizard_f_run_anim 192 196 16 28 4\nlizard_f_hit_anim 256 196 16 28 1\n\nlizard_m_idle_anim 128 228 16 28 4\nlizard_m_run_anim 192 228 16 28 4\nlizard_m_hit_anim 256 228 16 28 1\n";
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _crtrdgGameloop = _interopRequireDefault(require("crtrdg-gameloop"));

var _level = _interopRequireDefault(require("./level.txt"));

var _tiles_list_v = _interopRequireDefault(require("./tiles_list_v1.3.txt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TILE_SIZE = 16;
var game = (0, _crtrdgGameloop.default)();
game.canvas.height = 512;
game.canvas.width = 512;
var tileset = new Image(512, 512); // Using optional size for image

tileset.src = "https://cdn.glitch.com/8804483f-7435-434d-ab8d-d8d811696a6a%2F0x72_DungeonTilesetII_v1.3.png?v=1586091258409";
game.on("draw", function (ctx, dt) {
  drawLevel(ctx);
});
game.start();

function drawLevel(ctx) {
  _level.default.split("\n").forEach(function (line, y) {
    return line.split("").forEach(function (tile, x) {
      if (tile === "_") {
        drawFloorTile(ctx, x, y);
      } else if (tile === "-") {
        drawWallTopTile(ctx, x, y);
      } else if (tile === "|") {
        drawWallRightTile(ctx, x, y);
      } else if (tile === "x") {
        drawWallCornerTopRightTile(ctx, x, y);
      }
    });
  });
}

function drawFloorTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE);
}

function drawWallTopTile(ctx, x, y) {
  drawSprite(ctx, "wall_top_mid", x * TILE_SIZE, y * TILE_SIZE);
}

function drawWallRightTile(ctx, x, y) {
  drawSprite(ctx, "floor_1", x * TILE_SIZE, y * TILE_SIZE);
  drawSprite(ctx, "wall_side_mid_right", x * TILE_SIZE, y * TILE_SIZE);
}

function drawWallCornerTopRightTile(ctx, x, y) {
  drawSprite(ctx, "wall_corner_top_right", x * TILE_SIZE, y * TILE_SIZE);
}

var sprites = _tiles_list_v.default.split("\n").map(function (line) {
  var _line$split = line.split(" "),
      _line$split2 = _slicedToArray(_line$split, 5),
      name = _line$split2[0],
      sx = _line$split2[1],
      sy = _line$split2[2],
      swidth = _line$split2[3],
      sheight = _line$split2[4];

  return {
    name: name,
    sx: parseInt(sx),
    sy: parseInt(sy),
    swidth: parseInt(swidth),
    sheight: parseInt(sheight)
  };
}).reduce(function (prev, _ref) {
  var name = _ref.name,
      rest = _objectWithoutProperties(_ref, ["name"]);

  return _objectSpread({}, prev, _defineProperty({}, name, _objectSpread({}, rest)));
}, {});

function drawSprite(ctx, name, x, y) {
  var sprite = sprites[name];

  if (sprite) {
    console.warn("".concat(name, " doesn't exist as a sprite"));
    var sx = sprite.sx,
        sy = sprite.sy,
        swidth = sprite.swidth,
        sheight = sprite.sheight;
    ctx.drawImage(tileset, sx, sy, swidth, sheight, x, y, swidth, sheight);
  }
}
},{"crtrdg-gameloop":"node_modules/crtrdg-gameloop/index.js","./level.txt":"level.txt","./tiles_list_v1.3.txt":"tiles_list_v1.3.txt"}],"../rbd/pnpm-volume/8804483f-7435-434d-ab8d-d8d811696a6a/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34861" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../rbd/pnpm-volume/8804483f-7435-434d-ab8d-d8d811696a6a/node_modules/.registry.npmjs.org/parcel-bundler/1.12.4/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/app.e31bb0bc.js.map