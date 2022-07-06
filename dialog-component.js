//@ts-nocheck
let i18;

function noop$1() { }
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === 'function';
}
function not_equal(a, b) {
  return a != a ? b == b : a !== b;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(' ');
}
function empty() {
  return text('');
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_custom_element_data(node, prop, value) {
  if (prop in node) {
    node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
  }
  else {
    attr(node, prop, value);
  }
}
function to_number(value) {
  return value === '' ? null : +value;
}
function children(element) {
  return Array.from(element.childNodes);
}
function set_data(text, data) {
  data = '' + data;
  if (text.wholeText !== data)
    text.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
  node.style.setProperty(key, value, important ? 'important' : '');
}
function toggle_class(element, name, toggle) {
  element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}

if (typeof window !== "undefined") {

  class HtmlTag {
    constructor() {
      this.e = this.n = null;
    }
    c(html) {
      this.h(html);
    }
    m(html, target, anchor = null) {
      if (!this.e) {
        this.e = element(target.nodeName);
        this.t = target;
        this.c(html);
      }
      this.i(anchor);
    }
    h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert(this.t, this.n[i], anchor);
      }
    }
    p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
    d() {
      this.n.forEach(detach);
    }
  }
  function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
      result[attribute.name] = attribute.value;
    }
    return result;
  }

  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error('Function called outside component initialization');
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        // TODO are there situations where events could be dispatched
        // in a server (non-DOM) environment?
        const event = custom_event(type, detail);
        callbacks.slice().forEach(fn => {
          fn.call(component, event);
        });
      }
    };
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  const seen_callbacks = new Set();
  let flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
    const saved_component = current_component;
    do {
      // first, call beforeUpdate functions
      // and update components
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  const outroing = new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }

  function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block(key, child_ctx);
        block.c();
      }
      else if (dynamic) {
        block.p(child_ctx, dirty);
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        // do nothing
        next = new_block.first;
        o--;
        n--;
      }
      else if (!new_lookup.has(old_key)) {
        // remove old block
        destroy(old_block, lookup);
        o--;
      }
      else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert(new_block);
      }
      else if (did_move.has(old_key)) {
        o--;
      }
      else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert(new_block);
      }
      else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n)
      insert(new_blocks[n - 1]);
    return new_blocks;
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        }
        else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props,
      update: noop$1,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
      ? instance(component, options.props || {}, (i, ret, ...rest) => {
        const value = rest.length ? rest[0] : ret;
        if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
          if (!$$.skip_bound && $$.bound[i])
            $$.bound[i](value);
          if (ready)
            make_dirty(component, i);
        }
        return ret;
      })
      : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  let SvelteElement;
  if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        // @ts-ignore todo: improve typings
        for (const key in this.$$.slotted) {
          // @ts-ignore todo: improve typings
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr, _oldValue, newValue) {
        this[attr] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop$1;
      }
      $on(type, callback) {
        // TODO should this delegate to addEventListener?
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var consoleLogger = {
    type: 'logger',
    log: function log(args) {
      this.output('log', args);
    },
    warn: function warn(args) {
      this.output('warn', args);
    },
    error: function error(args) {
      this.output('error', args);
    },
    output: function output(type, args) {
      if (console && console[type]) console[type].apply(console, args);
    }
  };

  var Logger = function () {
    function Logger(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Logger);

      this.init(concreteLogger, options);
    }

    _createClass(Logger, [{
      key: "init",
      value: function init(concreteLogger) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.prefix = options.prefix || 'i18next:';
        this.logger = concreteLogger || consoleLogger;
        this.options = options;
        this.debug = options.debug;
      }
    }, {
      key: "setDebug",
      value: function setDebug(bool) {
        this.debug = bool;
      }
    }, {
      key: "log",
      value: function log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this.forward(args, 'log', '', true);
      }
    }, {
      key: "warn",
      value: function warn() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this.forward(args, 'warn', '', true);
      }
    }, {
      key: "error",
      value: function error() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return this.forward(args, 'error', '');
      }
    }, {
      key: "deprecate",
      value: function deprecate() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
      }
    }, {
      key: "forward",
      value: function forward(args, lvl, prefix, debugOnly) {
        if (debugOnly && !this.debug) return null;
        if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
        return this.logger[lvl](args);
      }
    }, {
      key: "create",
      value: function create(moduleName) {
        return new Logger(this.logger, _objectSpread(_objectSpread({}, {
          prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
        }), this.options));
      }
    }]);

    return Logger;
  }();

  var baseLogger = new Logger();

  var EventEmitter = function () {
    function EventEmitter() {
      _classCallCheck(this, EventEmitter);

      this.observers = {};
    }

    _createClass(EventEmitter, [{
      key: "on",
      value: function on(events, listener) {
        var _this = this;

        events.split(' ').forEach(function (event) {
          _this.observers[event] = _this.observers[event] || [];

          _this.observers[event].push(listener);
        });
        return this;
      }
    }, {
      key: "off",
      value: function off(event, listener) {
        if (!this.observers[event]) return;

        if (!listener) {
          delete this.observers[event];
          return;
        }

        this.observers[event] = this.observers[event].filter(function (l) {
          return l !== listener;
        });
      }
    }, {
      key: "emit",
      value: function emit(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (this.observers[event]) {
          var cloned = [].concat(this.observers[event]);
          cloned.forEach(function (observer) {
            observer.apply(void 0, args);
          });
        }

        if (this.observers['*']) {
          var _cloned = [].concat(this.observers['*']);

          _cloned.forEach(function (observer) {
            observer.apply(observer, [event].concat(args));
          });
        }
      }
    }]);

    return EventEmitter;
  }();

  function defer() {
    var res;
    var rej;
    var promise = new Promise(function (resolve, reject) {
      res = resolve;
      rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
  }
  function makeString(object) {
    if (object == null) return '';
    return '' + object;
  }
  function copy(a, s, t) {
    a.forEach(function (m) {
      if (s[m]) t[m] = s[m];
    });
  }

  function getLastOfPath(object, path, Empty) {
    function cleanKey(key) {
      return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
    }

    function canNotTraverseDeeper() {
      return !object || typeof object === 'string';
    }

    var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

    while (stack.length > 1) {
      if (canNotTraverseDeeper()) return {};
      var key = cleanKey(stack.shift());
      if (!object[key] && Empty) object[key] = new Empty();

      if (Object.prototype.hasOwnProperty.call(object, key)) {
        object = object[key];
      } else {
        object = {};
      }
    }

    if (canNotTraverseDeeper()) return {};
    return {
      obj: object,
      k: cleanKey(stack.shift())
    };
  }

  function setPath(object, path, newValue) {
    var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

    obj[k] = newValue;
  }
  function pushPath(object, path, newValue, concat) {
    var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

    obj[k] = obj[k] || [];
    if (concat) obj[k] = obj[k].concat(newValue);
    if (!concat) obj[k].push(newValue);
  }
  function getPath(object, path) {
    var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

    if (!obj) return undefined;
    return obj[k];
  }
  function getPathWithDefaults(data, defaultData, key) {
    var value = getPath(data, key);

    if (value !== undefined) {
      return value;
    }

    return getPath(defaultData, key);
  }
  function deepExtend(target, source, overwrite) {
    for (var prop in source) {
      if (prop !== '__proto__' && prop !== 'constructor') {
        if (prop in target) {
          if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
            if (overwrite) target[prop] = source[prop];
          } else {
            deepExtend(target[prop], source[prop], overwrite);
          }
        } else {
          target[prop] = source[prop];
        }
      }
    }

    return target;
  }
  function regexEscape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }
  var _entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  function escape(data) {
    if (typeof data === 'string') {
      return data.replace(/[&<>"'\/]/g, function (s) {
        return _entityMap[s];
      });
    }

    return data;
  }
  var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;
  var chars = [' ', ',', '?', '!', ';'];
  function looksLikeObjectPath(key, nsSeparator, keySeparator) {
    nsSeparator = nsSeparator || '';
    keySeparator = keySeparator || '';
    var possibleChars = chars.filter(function (c) {
      return nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0;
    });
    if (possibleChars.length === 0) return true;
    var r = new RegExp("(".concat(possibleChars.map(function (c) {
      return c === '?' ? '\\?' : c;
    }).join('|'), ")"));
    var matched = !r.test(key);

    if (!matched) {
      var ki = key.indexOf(keySeparator);

      if (ki > 0 && !r.test(key.substring(0, ki))) {
        matched = true;
      }
    }

    return matched;
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { })); return true; } catch (e) { return false; } }

  function deepFind(obj, path) {
    var keySeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    if (!obj) return undefined;
    if (obj[path]) return obj[path];
    var paths = path.split(keySeparator);
    var current = obj;

    for (var i = 0; i < paths.length; ++i) {
      if (!current) return undefined;

      if (typeof current[paths[i]] === 'string' && i + 1 < paths.length) {
        return undefined;
      }

      if (current[paths[i]] === undefined) {
        var j = 2;
        var p = paths.slice(i, i + j).join(keySeparator);
        var mix = current[p];

        while (mix === undefined && paths.length > i + j) {
          j++;
          p = paths.slice(i, i + j).join(keySeparator);
          mix = current[p];
        }

        if (mix === undefined) return undefined;

        if (path.endsWith(p)) {
          if (typeof mix === 'string') return mix;
          if (p && typeof mix[p] === 'string') return mix[p];
        }

        var joinedPath = paths.slice(i + j).join(keySeparator);
        if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
        return undefined;
      }

      current = current[paths[i]];
    }

    return current;
  }

  var ResourceStore = function (_EventEmitter) {
    _inherits(ResourceStore, _EventEmitter);

    var _super = _createSuper(ResourceStore);

    function ResourceStore(data) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        ns: ['translation'],
        defaultNS: 'translation'
      };

      _classCallCheck(this, ResourceStore);

      _this = _super.call(this);

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.data = data || {};
      _this.options = options;

      if (_this.options.keySeparator === undefined) {
        _this.options.keySeparator = '.';
      }

      if (_this.options.ignoreJSONStructure === undefined) {
        _this.options.ignoreJSONStructure = true;
      }

      return _this;
    }

    _createClass(ResourceStore, [{
      key: "addNamespaces",
      value: function addNamespaces(ns) {
        if (this.options.ns.indexOf(ns) < 0) {
          this.options.ns.push(ns);
        }
      }
    }, {
      key: "removeNamespaces",
      value: function removeNamespaces(ns) {
        var index = this.options.ns.indexOf(ns);

        if (index > -1) {
          this.options.ns.splice(index, 1);
        }
      }
    }, {
      key: "getResource",
      value: function getResource(lng, ns, key) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        var ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
        var path = [lng, ns];
        if (key && typeof key !== 'string') path = path.concat(key);
        if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
        }

        var result = getPath(this.data, path);
        if (result || !ignoreJSONStructure || typeof key !== 'string') return result;
        return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
      }
    }, {
      key: "addResource",
      value: function addResource(lng, ns, key, value) {
        var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
          silent: false
        };
        var keySeparator = this.options.keySeparator;
        if (keySeparator === undefined) keySeparator = '.';
        var path = [lng, ns];
        if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          value = ns;
          ns = path[1];
        }

        this.addNamespaces(ns);
        setPath(this.data, path, value);
        if (!options.silent) this.emit('added', lng, ns, key, value);
      }
    }, {
      key: "addResources",
      value: function addResources(lng, ns, resources) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
          silent: false
        };

        for (var m in resources) {
          if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
            silent: true
          });
        }

        if (!options.silent) this.emit('added', lng, ns, resources);
      }
    }, {
      key: "addResourceBundle",
      value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
        var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
          silent: false
        };
        var path = [lng, ns];

        if (lng.indexOf('.') > -1) {
          path = lng.split('.');
          deep = resources;
          resources = ns;
          ns = path[1];
        }

        this.addNamespaces(ns);
        var pack = getPath(this.data, path) || {};

        if (deep) {
          deepExtend(pack, resources, overwrite);
        } else {
          pack = _objectSpread$1(_objectSpread$1({}, pack), resources);
        }

        setPath(this.data, path, pack);
        if (!options.silent) this.emit('added', lng, ns, resources);
      }
    }, {
      key: "removeResourceBundle",
      value: function removeResourceBundle(lng, ns) {
        if (this.hasResourceBundle(lng, ns)) {
          delete this.data[lng][ns];
        }

        this.removeNamespaces(ns);
        this.emit('removed', lng, ns);
      }
    }, {
      key: "hasResourceBundle",
      value: function hasResourceBundle(lng, ns) {
        return this.getResource(lng, ns) !== undefined;
      }
    }, {
      key: "getResourceBundle",
      value: function getResourceBundle(lng, ns) {
        if (!ns) ns = this.options.defaultNS;
        if (this.options.compatibilityAPI === 'v1') return _objectSpread$1(_objectSpread$1({}, {}), this.getResource(lng, ns));
        return this.getResource(lng, ns);
      }
    }, {
      key: "getDataByLanguage",
      value: function getDataByLanguage(lng) {
        return this.data[lng];
      }
    }, {
      key: "hasLanguageSomeTranslations",
      value: function hasLanguageSomeTranslations(lng) {
        var data = this.getDataByLanguage(lng);
        var n = data && Object.keys(data) || [];
        return !!n.find(function (v) {
          return data[v] && Object.keys(data[v]).length > 0;
        });
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.data;
      }
    }]);

    return ResourceStore;
  }(EventEmitter);

  var postProcessor = {
    processors: {},
    addPostProcessor: function addPostProcessor(module) {
      this.processors[module.name] = module;
    },
    handle: function handle(processors, value, key, options, translator) {
      var _this = this;

      processors.forEach(function (processor) {
        if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
      });
      return value;
    }
  };

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { })); return true; } catch (e) { return false; } }
  var checkedLoadedFor = {};

  var Translator = function (_EventEmitter) {
    _inherits(Translator, _EventEmitter);

    var _super = _createSuper$1(Translator);

    function Translator(services) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Translator);

      _this = _super.call(this);

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, _assertThisInitialized(_this));
      _this.options = options;

      if (_this.options.keySeparator === undefined) {
        _this.options.keySeparator = '.';
      }

      _this.logger = baseLogger.create('translator');
      return _this;
    }

    _createClass(Translator, [{
      key: "changeLanguage",
      value: function changeLanguage(lng) {
        if (lng) this.language = lng;
      }
    }, {
      key: "exists",
      value: function exists(key) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          interpolation: {}
        };

        if (key === undefined || key === null) {
          return false;
        }

        var resolved = this.resolve(key, options);
        return resolved && resolved.res !== undefined;
      }
    }, {
      key: "extractFromKey",
      value: function extractFromKey(key, options) {
        var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
        if (nsSeparator === undefined) nsSeparator = ':';
        var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
        var namespaces = options.ns || this.options.defaultNS || [];
        var wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
        var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);

        if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
          var m = key.match(this.interpolator.nestingRegexp);

          if (m && m.length > 0) {
            return {
              key: key,
              namespaces: namespaces
            };
          }

          var parts = key.split(nsSeparator);
          if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
          key = parts.join(keySeparator);
        }

        if (typeof namespaces === 'string') namespaces = [namespaces];
        return {
          key: key,
          namespaces: namespaces
        };
      }
    }, {
      key: "translate",
      value: function translate(keys, options, lastKey) {
        var _this2 = this;

        if (_typeof(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
          options = this.options.overloadTranslationOptionHandler(arguments);
        }

        if (!options) options = {};
        if (keys === undefined || keys === null) return '';
        if (!Array.isArray(keys)) keys = [String(keys)];
        var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

        var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
          key = _this$extractFromKey.key,
          namespaces = _this$extractFromKey.namespaces;

        var namespace = namespaces[namespaces.length - 1];
        var lng = options.lng || this.language;
        var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

        if (lng && lng.toLowerCase() === 'cimode') {
          if (appendNamespaceToCIMode) {
            var nsSeparator = options.nsSeparator || this.options.nsSeparator;
            return namespace + nsSeparator + key;
          }

          return key;
        }

        var resolved = this.resolve(keys, options);
        var res = resolved && resolved.res;
        var resUsedKey = resolved && resolved.usedKey || key;
        var resExactUsedKey = resolved && resolved.exactUsedKey || key;
        var resType = Object.prototype.toString.apply(res);
        var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
        var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
        var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
        var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

        if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
          if (!options.returnObjects && !this.options.returnObjects) {
            if (!this.options.returnedObjectHandler) {
              this.logger.warn('accessing an object - but returnObjects options is not enabled!');
            }

            return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$2(_objectSpread$2({}, options), {}, {
              ns: namespaces
            })) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
          }

          if (keySeparator) {
            var resTypeIsArray = resType === '[object Array]';
            var copy = resTypeIsArray ? [] : {};
            var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

            for (var m in res) {
              if (Object.prototype.hasOwnProperty.call(res, m)) {
                var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
                copy[m] = this.translate(deepKey, _objectSpread$2(_objectSpread$2({}, options), {
                  joinArrays: false,
                  ns: namespaces
                }));
                if (copy[m] === deepKey) copy[m] = res[m];
              }
            }

            res = copy;
          }
        } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
          res = res.join(joinArrays);
          if (res) res = this.extendTranslation(res, keys, options, lastKey);
        } else {
          var usedDefault = false;
          var usedKey = false;
          var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
          var hasDefaultValue = Translator.hasDefaultValue(options);
          var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : '';
          var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;

          if (!this.isValidLookup(res) && hasDefaultValue) {
            usedDefault = true;
            res = defaultValue;
          }

          if (!this.isValidLookup(res)) {
            usedKey = true;
            res = key;
          }

          var missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
          var resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
          var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;

          if (usedKey || usedDefault || updateMissing) {
            this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);

            if (keySeparator) {
              var fk = this.resolve(key, _objectSpread$2(_objectSpread$2({}, options), {}, {
                keySeparator: false
              }));
              if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
            }

            var lngs = [];
            var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

            if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
              for (var i = 0; i < fallbackLngs.length; i++) {
                lngs.push(fallbackLngs[i]);
              }
            } else if (this.options.saveMissingTo === 'all') {
              lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
            } else {
              lngs.push(options.lng || this.language);
            }

            var send = function send(l, k, specificDefaultValue) {
              var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;

              if (_this2.options.missingKeyHandler) {
                _this2.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
              } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
                _this2.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
              }

              _this2.emit('missingKey', l, namespace, k, res);
            };

            if (this.options.saveMissing) {
              if (this.options.saveMissingPlurals && needsPluralHandling) {
                lngs.forEach(function (language) {
                  _this2.pluralResolver.getSuffixes(language, options).forEach(function (suffix) {
                    send([language], key + suffix, options["defaultValue".concat(suffix)] || defaultValue);
                  });
                });
              } else {
                send(lngs, key, defaultValue);
              }
            }
          }

          res = this.extendTranslation(res, keys, options, resolved, lastKey);
          if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);

          if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
            if (this.options.compatibilityAPI !== 'v1') {
              res = this.options.parseMissingKeyHandler(key, usedDefault ? res : undefined);
            } else {
              res = this.options.parseMissingKeyHandler(res);
            }
          }
        }

        return res;
      }
    }, {
      key: "extendTranslation",
      value: function extendTranslation(res, key, options, resolved, lastKey) {
        var _this3 = this;

        if (this.i18nFormat && this.i18nFormat.parse) {
          res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
            resolved: resolved
          });
        } else if (!options.skipInterpolation) {
          if (options.interpolation) this.interpolator.init(_objectSpread$2(_objectSpread$2({}, options), {
            interpolation: _objectSpread$2(_objectSpread$2({}, this.options.interpolation), options.interpolation)
          }));
          var skipOnVariables = typeof res === 'string' && (options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
          var nestBef;

          if (skipOnVariables) {
            var nb = res.match(this.interpolator.nestingRegexp);
            nestBef = nb && nb.length;
          }

          var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
          if (this.options.interpolation.defaultVariables) data = _objectSpread$2(_objectSpread$2({}, this.options.interpolation.defaultVariables), data);
          res = this.interpolator.interpolate(res, data, options.lng || this.language, options);

          if (skipOnVariables) {
            var na = res.match(this.interpolator.nestingRegexp);
            var nestAft = na && na.length;
            if (nestBef < nestAft) options.nest = false;
          }

          if (options.nest !== false) res = this.interpolator.nest(res, function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (lastKey && lastKey[0] === args[0] && !options.context) {
              _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));

              return null;
            }

            return _this3.translate.apply(_this3, args.concat([key]));
          }, options);
          if (options.interpolation) this.interpolator.reset();
        }

        var postProcess = options.postProcess || this.options.postProcess;
        var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

        if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
          res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$2({
            i18nResolved: resolved
          }, options) : options, this);
        }

        return res;
      }
    }, {
      key: "resolve",
      value: function resolve(keys) {
        var _this4 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var found;
        var usedKey;
        var exactUsedKey;
        var usedLng;
        var usedNS;
        if (typeof keys === 'string') keys = [keys];
        keys.forEach(function (k) {
          if (_this4.isValidLookup(found)) return;

          var extracted = _this4.extractFromKey(k, options);

          var key = extracted.key;
          usedKey = key;
          var namespaces = extracted.namespaces;
          if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
          var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

          var needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && _this4.pluralResolver.shouldUseIntlApi();

          var needsContextHandling = options.context !== undefined && (typeof options.context === 'string' || typeof options.context === 'number') && options.context !== '';
          var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
          namespaces.forEach(function (ns) {
            if (_this4.isValidLookup(found)) return;
            usedNS = ns;

            if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
              checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

              _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
            }

            codes.forEach(function (code) {
              if (_this4.isValidLookup(found)) return;
              usedLng = code;
              var finalKeys = [key];

              if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
                _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
              } else {
                var pluralSuffix;
                if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count, options);
                var zeroSuffix = '_zero';

                if (needsPluralHandling) {
                  finalKeys.push(key + pluralSuffix);

                  if (needsZeroSuffixLookup) {
                    finalKeys.push(key + zeroSuffix);
                  }
                }

                if (needsContextHandling) {
                  var contextKey = "".concat(key).concat(_this4.options.contextSeparator).concat(options.context);
                  finalKeys.push(contextKey);

                  if (needsPluralHandling) {
                    finalKeys.push(contextKey + pluralSuffix);

                    if (needsZeroSuffixLookup) {
                      finalKeys.push(contextKey + zeroSuffix);
                    }
                  }
                }
              }

              var possibleKey;

              while (possibleKey = finalKeys.pop()) {
                if (!_this4.isValidLookup(found)) {
                  exactUsedKey = possibleKey;
                  found = _this4.getResource(code, ns, possibleKey, options);
                }
              }
            });
          });
        });
        return {
          res: found,
          usedKey: usedKey,
          exactUsedKey: exactUsedKey,
          usedLng: usedLng,
          usedNS: usedNS
        };
      }
    }, {
      key: "isValidLookup",
      value: function isValidLookup(res) {
        return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
      }
    }, {
      key: "getResource",
      value: function getResource(code, ns, key) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
        return this.resourceStore.getResource(code, ns, key, options);
      }
    }], [{
      key: "hasDefaultValue",
      value: function hasDefaultValue(options) {
        var prefix = 'defaultValue';

        for (var option in options) {
          if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
            return true;
          }
        }

        return false;
      }
    }]);

    return Translator;
  }(EventEmitter);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var LanguageUtil = function () {
    function LanguageUtil(options) {
      _classCallCheck(this, LanguageUtil);

      this.options = options;
      this.supportedLngs = this.options.supportedLngs || false;
      this.logger = baseLogger.create('languageUtils');
    }

    _createClass(LanguageUtil, [{
      key: "getScriptPartFromCode",
      value: function getScriptPartFromCode(code) {
        if (!code || code.indexOf('-') < 0) return null;
        var p = code.split('-');
        if (p.length === 2) return null;
        p.pop();
        if (p[p.length - 1].toLowerCase() === 'x') return null;
        return this.formatLanguageCode(p.join('-'));
      }
    }, {
      key: "getLanguagePartFromCode",
      value: function getLanguagePartFromCode(code) {
        if (!code || code.indexOf('-') < 0) return code;
        var p = code.split('-');
        return this.formatLanguageCode(p[0]);
      }
    }, {
      key: "formatLanguageCode",
      value: function formatLanguageCode(code) {
        if (typeof code === 'string' && code.indexOf('-') > -1) {
          var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
          var p = code.split('-');

          if (this.options.lowerCaseLng) {
            p = p.map(function (part) {
              return part.toLowerCase();
            });
          } else if (p.length === 2) {
            p[0] = p[0].toLowerCase();
            p[1] = p[1].toUpperCase();
            if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          } else if (p.length === 3) {
            p[0] = p[0].toLowerCase();
            if (p[1].length === 2) p[1] = p[1].toUpperCase();
            if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
            if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
            if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
          }

          return p.join('-');
        }

        return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
      }
    }, {
      key: "isSupportedCode",
      value: function isSupportedCode(code) {
        if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
          code = this.getLanguagePartFromCode(code);
        }

        return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
      }
    }, {
      key: "getBestMatchFromCodes",
      value: function getBestMatchFromCodes(codes) {
        var _this = this;

        if (!codes) return null;
        var found;
        codes.forEach(function (code) {
          if (found) return;

          var cleanedLng = _this.formatLanguageCode(code);

          if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
        });

        if (!found && this.options.supportedLngs) {
          codes.forEach(function (code) {
            if (found) return;

            var lngOnly = _this.getLanguagePartFromCode(code);

            if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
            found = _this.options.supportedLngs.find(function (supportedLng) {
              if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
            });
          });
        }

        if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
        return found;
      }
    }, {
      key: "getFallbackCodes",
      value: function getFallbackCodes(fallbacks, code) {
        if (!fallbacks) return [];
        if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
        if (typeof fallbacks === 'string') fallbacks = [fallbacks];
        if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
        if (!code) return fallbacks["default"] || [];
        var found = fallbacks[code];
        if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
        if (!found) found = fallbacks[this.formatLanguageCode(code)];
        if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
        if (!found) found = fallbacks["default"];
        return found || [];
      }
    }, {
      key: "toResolveHierarchy",
      value: function toResolveHierarchy(code, fallbackCode) {
        var _this2 = this;

        var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
        var codes = [];

        var addCode = function addCode(c) {
          if (!c) return;

          if (_this2.isSupportedCode(c)) {
            codes.push(c);
          } else {
            _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
          }
        };

        if (typeof code === 'string' && code.indexOf('-') > -1) {
          if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
          if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
          if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
        } else if (typeof code === 'string') {
          addCode(this.formatLanguageCode(code));
        }

        fallbackCodes.forEach(function (fc) {
          if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
        });
        return codes;
      }
    }]);

    return LanguageUtil;
  }();

  var sets = [{
    lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'tl', 'ti', 'tr', 'uz', 'wa'],
    nr: [1, 2],
    fc: 1
  }, {
    lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kk', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
    nr: [1, 2],
    fc: 2
  }, {
    lngs: ['ay', 'bo', 'cgg', 'fa', 'ht', 'id', 'ja', 'jbo', 'ka', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
    nr: [1],
    fc: 3
  }, {
    lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
    nr: [1, 2, 5],
    fc: 4
  }, {
    lngs: ['ar'],
    nr: [0, 1, 2, 3, 11, 100],
    fc: 5
  }, {
    lngs: ['cs', 'sk'],
    nr: [1, 2, 5],
    fc: 6
  }, {
    lngs: ['csb', 'pl'],
    nr: [1, 2, 5],
    fc: 7
  }, {
    lngs: ['cy'],
    nr: [1, 2, 3, 8],
    fc: 8
  }, {
    lngs: ['fr'],
    nr: [1, 2],
    fc: 9
  }, {
    lngs: ['ga'],
    nr: [1, 2, 3, 7, 11],
    fc: 10
  }, {
    lngs: ['gd'],
    nr: [1, 2, 3, 20],
    fc: 11
  }, {
    lngs: ['is'],
    nr: [1, 2],
    fc: 12
  }, {
    lngs: ['jv'],
    nr: [0, 1],
    fc: 13
  }, {
    lngs: ['kw'],
    nr: [1, 2, 3, 4],
    fc: 14
  }, {
    lngs: ['lt'],
    nr: [1, 2, 10],
    fc: 15
  }, {
    lngs: ['lv'],
    nr: [1, 2, 0],
    fc: 16
  }, {
    lngs: ['mk'],
    nr: [1, 2],
    fc: 17
  }, {
    lngs: ['mnk'],
    nr: [0, 1, 2],
    fc: 18
  }, {
    lngs: ['mt'],
    nr: [1, 2, 11, 20],
    fc: 19
  }, {
    lngs: ['or'],
    nr: [2, 1],
    fc: 2
  }, {
    lngs: ['ro'],
    nr: [1, 2, 20],
    fc: 20
  }, {
    lngs: ['sl'],
    nr: [5, 1, 2, 3],
    fc: 21
  }, {
    lngs: ['he', 'iw'],
    nr: [1, 2, 20, 21],
    fc: 22
  }];
  var _rulesPluralsTypes = {
    1: function _(n) {
      return Number(n > 1);
    },
    2: function _(n) {
      return Number(n != 1);
    },
    3: function _(n) {
      return 0;
    },
    4: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    5: function _(n) {
      return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
    },
    6: function _(n) {
      return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
    },
    7: function _(n) {
      return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    8: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
    },
    9: function _(n) {
      return Number(n >= 2);
    },
    10: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
    },
    11: function _(n) {
      return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
    },
    12: function _(n) {
      return Number(n % 10 != 1 || n % 100 == 11);
    },
    13: function _(n) {
      return Number(n !== 0);
    },
    14: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
    },
    15: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    },
    16: function _(n) {
      return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
    },
    17: function _(n) {
      return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
    },
    18: function _(n) {
      return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
    },
    19: function _(n) {
      return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
    },
    20: function _(n) {
      return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
    },
    21: function _(n) {
      return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
    },
    22: function _(n) {
      return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
    }
  };
  var deprecatedJsonVersions = ['v1', 'v2', 'v3'];
  var suffixesOrder = {
    zero: 0,
    one: 1,
    two: 2,
    few: 3,
    many: 4,
    other: 5
  };

  function createRules() {
    var rules = {};
    sets.forEach(function (set) {
      set.lngs.forEach(function (l) {
        rules[l] = {
          numbers: set.nr,
          plurals: _rulesPluralsTypes[set.fc]
        };
      });
    });
    return rules;
  }

  var PluralResolver = function () {
    function PluralResolver(languageUtils) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, PluralResolver);

      this.languageUtils = languageUtils;
      this.options = options;
      this.logger = baseLogger.create('pluralResolver');

      if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === 'v4') && (typeof Intl === 'undefined' || !Intl.PluralRules)) {
        this.options.compatibilityJSON = 'v3';
        this.logger.error('Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.');
      }

      this.rules = createRules();
    }

    _createClass(PluralResolver, [{
      key: "addRule",
      value: function addRule(lng, obj) {
        this.rules[lng] = obj;
      }
    }, {
      key: "getRule",
      value: function getRule(code) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (this.shouldUseIntlApi()) {
          try {
            return new Intl.PluralRules(code, {
              type: options.ordinal ? 'ordinal' : 'cardinal'
            });
          } catch (_unused) {
            return;
          }
        }

        return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
      }
    }, {
      key: "needsPlural",
      value: function needsPlural(code) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var rule = this.getRule(code, options);

        if (this.shouldUseIntlApi()) {
          return rule && rule.resolvedOptions().pluralCategories.length > 1;
        }

        return rule && rule.numbers.length > 1;
      }
    }, {
      key: "getPluralFormsOfKey",
      value: function getPluralFormsOfKey(code, key) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this.getSuffixes(code, options).map(function (suffix) {
          return "".concat(key).concat(suffix);
        });
      }
    }, {
      key: "getSuffixes",
      value: function getSuffixes(code) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var rule = this.getRule(code, options);

        if (!rule) {
          return [];
        }

        if (this.shouldUseIntlApi()) {
          return rule.resolvedOptions().pluralCategories.sort(function (pluralCategory1, pluralCategory2) {
            return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
          }).map(function (pluralCategory) {
            return "".concat(_this.options.prepend).concat(pluralCategory);
          });
        }

        return rule.numbers.map(function (number) {
          return _this.getSuffix(code, number, options);
        });
      }
    }, {
      key: "getSuffix",
      value: function getSuffix(code, count) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var rule = this.getRule(code, options);

        if (rule) {
          if (this.shouldUseIntlApi()) {
            return "".concat(this.options.prepend).concat(rule.select(count));
          }

          return this.getSuffixRetroCompatible(rule, count);
        }

        this.logger.warn("no plural rule found for: ".concat(code));
        return '';
      }
    }, {
      key: "getSuffixRetroCompatible",
      value: function getSuffixRetroCompatible(rule, count) {
        var _this2 = this;

        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
        var suffix = rule.numbers[idx];

        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = 'plural';
          } else if (suffix === 1) {
            suffix = '';
          }
        }

        var returnSuffix = function returnSuffix() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };

        if (this.options.compatibilityJSON === 'v1') {
          if (suffix === 1) return '';
          if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === 'v2') {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }

        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }
    }, {
      key: "shouldUseIntlApi",
      value: function shouldUseIntlApi() {
        return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
      }
    }]);

    return PluralResolver;
  }();

  function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var Interpolator = function () {
    function Interpolator() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Interpolator);

      this.logger = baseLogger.create('interpolator');
      this.options = options;

      this.format = options.interpolation && options.interpolation.format || function (value) {
        return value;
      };

      this.init(options);
    }

    _createClass(Interpolator, [{
      key: "init",
      value: function init() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (!options.interpolation) options.interpolation = {
          escapeValue: true
        };
        var iOpts = options.interpolation;
        this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
        this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
        this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
        this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
        this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
        this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
        this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
        this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
        this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
        this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
        this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
        this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
        this.resetRegExp();
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this.options) this.init(this.options);
      }
    }, {
      key: "resetRegExp",
      value: function resetRegExp() {
        var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
        this.regexp = new RegExp(regexpStr, 'g');
        var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
        this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
        var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
        this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
      }
    }, {
      key: "interpolate",
      value: function interpolate(str, data, lng, options) {
        var _this = this;

        var match;
        var value;
        var replaces;
        var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

        function regexSafe(val) {
          return val.replace(/\$/g, '$$$$');
        }

        var handleFormat = function handleFormat(key) {
          if (key.indexOf(_this.formatSeparator) < 0) {
            var path = getPathWithDefaults(data, defaultData, key);
            return _this.alwaysFormat ? _this.format(path, undefined, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
              interpolationkey: key
            })) : path;
          }

          var p = key.split(_this.formatSeparator);
          var k = p.shift().trim();
          var f = p.join(_this.formatSeparator).trim();
          return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
            interpolationkey: k
          }));
        };

        this.resetRegExp();
        var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
        var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
        var todos = [{
          regex: this.regexpUnescape,
          safeValue: function safeValue(val) {
            return regexSafe(val);
          }
        }, {
          regex: this.regexp,
          safeValue: function safeValue(val) {
            return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
          }
        }];
        todos.forEach(function (todo) {
          replaces = 0;

          while (match = todo.regex.exec(str)) {
            var matchedVar = match[1].trim();
            value = handleFormat(matchedVar);

            if (value === undefined) {
              if (typeof missingInterpolationHandler === 'function') {
                var temp = missingInterpolationHandler(str, match, options);
                value = typeof temp === 'string' ? temp : '';
              } else if (options && options.hasOwnProperty(matchedVar)) {
                value = '';
              } else if (skipOnVariables) {
                value = match[0];
                continue;
              } else {
                _this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));

                value = '';
              }
            } else if (typeof value !== 'string' && !_this.useRawValueToEscape) {
              value = makeString(value);
            }

            var safeValue = todo.safeValue(value);
            str = str.replace(match[0], safeValue);

            if (skipOnVariables) {
              todo.regex.lastIndex += safeValue.length;
              todo.regex.lastIndex -= match[0].length;
            } else {
              todo.regex.lastIndex = 0;
            }

            replaces++;

            if (replaces >= _this.maxReplaces) {
              break;
            }
          }
        });
        return str;
      }
    }, {
      key: "nest",
      value: function nest(str, fc) {
        var _this2 = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var match;
        var value;

        var clonedOptions = _objectSpread$3({}, options);

        clonedOptions.applyPostProcessor = false;
        delete clonedOptions.defaultValue;

        function handleHasOptions(key, inheritedOptions) {
          var sep = this.nestingOptionsSeparator;
          if (key.indexOf(sep) < 0) return key;
          var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
          var optionsString = "{".concat(c[1]);
          key = c[0];
          optionsString = this.interpolate(optionsString, clonedOptions);
          optionsString = optionsString.replace(/'/g, '"');

          try {
            clonedOptions = JSON.parse(optionsString);
            if (inheritedOptions) clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
          } catch (e) {
            this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
            return "".concat(key).concat(sep).concat(optionsString);
          }

          delete clonedOptions.defaultValue;
          return key;
        }

        while (match = this.nestingRegexp.exec(str)) {
          var formatters = [];
          var doReduce = false;

          if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
            var r = match[1].split(this.formatSeparator).map(function (elem) {
              return elem.trim();
            });
            match[1] = r.shift();
            formatters = r;
            doReduce = true;
          }

          value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
          if (value && match[0] === str && typeof value !== 'string') return value;
          if (typeof value !== 'string') value = makeString(value);

          if (!value) {
            this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
            value = '';
          }

          if (doReduce) {
            value = formatters.reduce(function (v, f) {
              return _this2.format(v, f, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, {
                interpolationkey: match[1].trim()
              }));
            }, value.trim());
          }

          str = str.replace(match[0], value);
          this.regexp.lastIndex = 0;
        }

        return str;
      }
    }]);

    return Interpolator;
  }();

  function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function parseFormatStr(formatStr) {
    var formatName = formatStr.toLowerCase().trim();
    var formatOptions = {};

    if (formatStr.indexOf('(') > -1) {
      var p = formatStr.split('(');
      formatName = p[0].toLowerCase().trim();
      var optStr = p[1].substring(0, p[1].length - 1);

      if (formatName === 'currency' && optStr.indexOf(':') < 0) {
        if (!formatOptions.currency) formatOptions.currency = optStr.trim();
      } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
        if (!formatOptions.range) formatOptions.range = optStr.trim();
      } else {
        var opts = optStr.split(';');
        opts.forEach(function (opt) {
          if (!opt) return;

          var _opt$split = opt.split(':'),
            _opt$split2 = _toArray(_opt$split),
            key = _opt$split2[0],
            rest = _opt$split2.slice(1);

          var val = rest.join(':');
          if (!formatOptions[key.trim()]) formatOptions[key.trim()] = val.trim();
          if (val.trim() === 'false') formatOptions[key.trim()] = false;
          if (val.trim() === 'true') formatOptions[key.trim()] = true;
          if (!isNaN(val.trim())) formatOptions[key.trim()] = parseInt(val.trim(), 10);
        });
      }
    }

    return {
      formatName: formatName,
      formatOptions: formatOptions
    };
  }

  var Formatter = function () {
    function Formatter() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Formatter);

      this.logger = baseLogger.create('formatter');
      this.options = options;
      this.formats = {
        number: function number(val, lng, options) {
          return new Intl.NumberFormat(lng, options).format(val);
        },
        currency: function currency(val, lng, options) {
          return new Intl.NumberFormat(lng, _objectSpread$4(_objectSpread$4({}, options), {}, {
            style: 'currency'
          })).format(val);
        },
        datetime: function datetime(val, lng, options) {
          return new Intl.DateTimeFormat(lng, _objectSpread$4({}, options)).format(val);
        },
        relativetime: function relativetime(val, lng, options) {
          return new Intl.RelativeTimeFormat(lng, _objectSpread$4({}, options)).format(val, options.range || 'day');
        },
        list: function list(val, lng, options) {
          return new Intl.ListFormat(lng, _objectSpread$4({}, options)).format(val);
        }
      };
      this.init(options);
    }

    _createClass(Formatter, [{
      key: "init",
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          interpolation: {}
        };
        var iOpts = options.interpolation;
        this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      }
    }, {
      key: "add",
      value: function add(name, fc) {
        this.formats[name.toLowerCase().trim()] = fc;
      }
    }, {
      key: "format",
      value: function format(value, _format, lng, options) {
        var _this = this;

        var formats = _format.split(this.formatSeparator);

        var result = formats.reduce(function (mem, f) {
          var _parseFormatStr = parseFormatStr(f),
            formatName = _parseFormatStr.formatName,
            formatOptions = _parseFormatStr.formatOptions;

          if (_this.formats[formatName]) {
            var formatted = mem;

            try {
              var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
              var l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
              formatted = _this.formats[formatName](mem, l, _objectSpread$4(_objectSpread$4(_objectSpread$4({}, formatOptions), options), valOptions));
            } catch (error) {
              _this.logger.warn(error);
            }

            return formatted;
          } else {
            _this.logger.warn("there was no format function for ".concat(formatName));
          }

          return mem;
        }, value);
        return result;
      }
    }]);

    return Formatter;
  }();

  function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { })); return true; } catch (e) { return false; } }

  function remove(arr, what) {
    var found = arr.indexOf(what);

    while (found !== -1) {
      arr.splice(found, 1);
      found = arr.indexOf(what);
    }
  }

  var Connector = function (_EventEmitter) {
    _inherits(Connector, _EventEmitter);

    var _super = _createSuper$2(Connector);

    function Connector(backend, store, services) {
      var _this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, Connector);

      _this = _super.call(this);

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.backend = backend;
      _this.store = store;
      _this.services = services;
      _this.languageUtils = services.languageUtils;
      _this.options = options;
      _this.logger = baseLogger.create('backendConnector');
      _this.state = {};
      _this.queue = [];

      if (_this.backend && _this.backend.init) {
        _this.backend.init(services, options.backend, options);
      }

      return _this;
    }

    _createClass(Connector, [{
      key: "queueLoad",
      value: function queueLoad(languages, namespaces, options, callback) {
        var _this2 = this;

        var toLoad = [];
        var pending = [];
        var toLoadLanguages = [];
        var toLoadNamespaces = [];
        languages.forEach(function (lng) {
          var hasAllNamespaces = true;
          namespaces.forEach(function (ns) {
            var name = "".concat(lng, "|").concat(ns);

            if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
              _this2.state[name] = 2;
            } else if (_this2.state[name] < 0); else if (_this2.state[name] === 1) {
              if (pending.indexOf(name) < 0) pending.push(name);
            } else {
              _this2.state[name] = 1;
              hasAllNamespaces = false;
              if (pending.indexOf(name) < 0) pending.push(name);
              if (toLoad.indexOf(name) < 0) toLoad.push(name);
              if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
            }
          });
          if (!hasAllNamespaces) toLoadLanguages.push(lng);
        });

        if (toLoad.length || pending.length) {
          this.queue.push({
            pending: pending,
            loaded: {},
            errors: [],
            callback: callback
          });
        }

        return {
          toLoad: toLoad,
          pending: pending,
          toLoadLanguages: toLoadLanguages,
          toLoadNamespaces: toLoadNamespaces
        };
      }
    }, {
      key: "loaded",
      value: function loaded(name, err, data) {
        var s = name.split('|');
        var lng = s[0];
        var ns = s[1];
        if (err) this.emit('failedLoading', lng, ns, err);

        if (data) {
          this.store.addResourceBundle(lng, ns, data);
        }

        this.state[name] = err ? -1 : 2;
        var loaded = {};
        this.queue.forEach(function (q) {
          pushPath(q.loaded, [lng], ns);
          remove(q.pending, name);
          if (err) q.errors.push(err);

          if (q.pending.length === 0 && !q.done) {
            Object.keys(q.loaded).forEach(function (l) {
              if (!loaded[l]) loaded[l] = [];

              if (q.loaded[l].length) {
                q.loaded[l].forEach(function (ns) {
                  if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
                });
              }
            });
            q.done = true;

            if (q.errors.length) {
              q.callback(q.errors);
            } else {
              q.callback();
            }
          }
        });
        this.emit('loaded', loaded);
        this.queue = this.queue.filter(function (q) {
          return !q.done;
        });
      }
    }, {
      key: "read",
      value: function read(lng, ns, fcName) {
        var _this3 = this;

        var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
        var callback = arguments.length > 5 ? arguments[5] : undefined;
        if (!lng.length) return callback(null, {});
        return this.backend[fcName](lng, ns, function (err, data) {
          if (err && data && tried < 5) {
            setTimeout(function () {
              _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
            }, wait);
            return;
          }

          callback(err, data);
        });
      }
    }, {
      key: "prepareLoading",
      value: function prepareLoading(languages, namespaces) {
        var _this4 = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var callback = arguments.length > 3 ? arguments[3] : undefined;

        if (!this.backend) {
          this.logger.warn('No backend was added via i18next.use. Will not load resources.');
          return callback && callback();
        }

        if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
        if (typeof namespaces === 'string') namespaces = [namespaces];
        var toLoad = this.queueLoad(languages, namespaces, options, callback);

        if (!toLoad.toLoad.length) {
          if (!toLoad.pending.length) callback();
          return null;
        }

        toLoad.toLoad.forEach(function (name) {
          _this4.loadOne(name);
        });
      }
    }, {
      key: "load",
      value: function load(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {}, callback);
      }
    }, {
      key: "reload",
      value: function reload(languages, namespaces, callback) {
        this.prepareLoading(languages, namespaces, {
          reload: true
        }, callback);
      }
    }, {
      key: "loadOne",
      value: function loadOne(name) {
        var _this5 = this;

        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var s = name.split('|');
        var lng = s[0];
        var ns = s[1];
        this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
          if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
          if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

          _this5.loaded(name, err, data);
        });
      }
    }, {
      key: "saveMissing",
      value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
        var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

        if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
          this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          return;
        }

        if (key === undefined || key === null || key === '') return;

        if (this.backend && this.backend.create) {
          this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread$5(_objectSpread$5({}, options), {}, {
            isUpdate: isUpdate
          }));
        }

        if (!languages || !languages[0]) return;
        this.store.addResource(languages[0], namespace, key, fallbackValue);
      }
    }]);

    return Connector;
  }(EventEmitter);

  function get() {
    return {
      debug: false,
      initImmediate: true,
      ns: ['translation'],
      defaultNS: ['translation'],
      fallbackLng: ['dev'],
      fallbackNS: false,
      supportedLngs: false,
      nonExplicitSupportedLngs: false,
      load: 'all',
      preload: false,
      simplifyPluralSuffix: true,
      keySeparator: '.',
      nsSeparator: ':',
      pluralSeparator: '_',
      contextSeparator: '_',
      partialBundledLanguages: false,
      saveMissing: false,
      updateMissing: false,
      saveMissingTo: 'fallback',
      saveMissingPlurals: true,
      missingKeyHandler: false,
      missingInterpolationHandler: false,
      postProcess: false,
      postProcessPassResolved: false,
      returnNull: true,
      returnEmptyString: true,
      returnObjects: false,
      joinArrays: false,
      returnedObjectHandler: false,
      parseMissingKeyHandler: false,
      appendNamespaceToMissingKey: false,
      appendNamespaceToCIMode: false,
      overloadTranslationOptionHandler: function handle(args) {
        var ret = {};
        if (_typeof(args[1]) === 'object') ret = args[1];
        if (typeof args[1] === 'string') ret.defaultValue = args[1];
        if (typeof args[2] === 'string') ret.tDescription = args[2];

        if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
          var options = args[3] || args[2];
          Object.keys(options).forEach(function (key) {
            ret[key] = options[key];
          });
        }

        return ret;
      },
      interpolation: {
        escapeValue: true,
        format: function format(value, _format, lng, options) {
          return value;
        },
        prefix: '{{',
        suffix: '}}',
        formatSeparator: ',',
        unescapePrefix: '-',
        nestingPrefix: '$t(',
        nestingSuffix: ')',
        nestingOptionsSeparator: ',',
        maxReplaces: 1000,
        skipOnVariables: true
      }
    };
  }
  function transformOptions(options) {
    if (typeof options.ns === 'string') options.ns = [options.ns];
    if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
    if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

    if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
      options.supportedLngs = options.supportedLngs.concat(['cimode']);
    }

    return options;
  }

  function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { })); return true; } catch (e) { return false; } }

  function noop() { }

  function bindMemberFunctions(inst) {
    var mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
    mems.forEach(function (mem) {
      if (typeof inst[mem] === 'function') {
        inst[mem] = inst[mem].bind(inst);
      }
    });
  }

  var I18n = function (_EventEmitter) {
    _inherits(I18n, _EventEmitter);

    var _super = _createSuper$3(I18n);

    function I18n() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, I18n);

      _this = _super.call(this);

      if (isIE10) {
        EventEmitter.call(_assertThisInitialized(_this));
      }

      _this.options = transformOptions(options);
      _this.services = {};
      _this.logger = baseLogger;
      _this.modules = {
        external: []
      };
      bindMemberFunctions(_assertThisInitialized(_this));

      if (callback && !_this.isInitialized && !options.isClone) {
        if (!_this.options.initImmediate) {
          _this.init(options, callback);

          return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
        }

        setTimeout(function () {
          _this.init(options, callback);
        }, 0);
      }

      return _this;
    }

    _createClass(I18n, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : undefined;

        if (typeof options === 'function') {
          callback = options;
          options = {};
        }

        if (!options.defaultNS && options.ns) {
          if (typeof options.ns === 'string') {
            options.defaultNS = options.ns;
          } else if (options.ns.indexOf('translation') < 0) {
            options.defaultNS = options.ns[0];
          }
        }

        var defOpts = get();
        this.options = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, defOpts), this.options), transformOptions(options));

        if (this.options.compatibilityAPI !== 'v1') {
          this.options.interpolation = _objectSpread$6(_objectSpread$6({}, defOpts.interpolation), this.options.interpolation);
        }

        if (options.keySeparator !== undefined) {
          this.options.userDefinedKeySeparator = options.keySeparator;
        }

        if (options.nsSeparator !== undefined) {
          this.options.userDefinedNsSeparator = options.nsSeparator;
        }

        function createClassOnDemand(ClassOrObject) {
          if (!ClassOrObject) return null;
          if (typeof ClassOrObject === 'function') return new ClassOrObject();
          return ClassOrObject;
        }

        if (!this.options.isClone) {
          if (this.modules.logger) {
            baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
          } else {
            baseLogger.init(null, this.options);
          }

          var formatter;

          if (this.modules.formatter) {
            formatter = this.modules.formatter;
          } else if (typeof Intl !== 'undefined') {
            formatter = Formatter;
          }

          var lu = new LanguageUtil(this.options);
          this.store = new ResourceStore(this.options.resources, this.options);
          var s = this.services;
          s.logger = baseLogger;
          s.resourceStore = this.store;
          s.languageUtils = lu;
          s.pluralResolver = new PluralResolver(lu, {
            prepend: this.options.pluralSeparator,
            compatibilityJSON: this.options.compatibilityJSON,
            simplifyPluralSuffix: this.options.simplifyPluralSuffix
          });

          if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
            s.formatter = createClassOnDemand(formatter);
            s.formatter.init(s, this.options);
            this.options.interpolation.format = s.formatter.format.bind(s.formatter);
          }

          s.interpolator = new Interpolator(this.options);
          s.utils = {
            hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
          };
          s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
          s.backendConnector.on('*', function (event) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            _this2.emit.apply(_this2, [event].concat(args));
          });

          if (this.modules.languageDetector) {
            s.languageDetector = createClassOnDemand(this.modules.languageDetector);
            s.languageDetector.init(s, this.options.detection, this.options);
          }

          if (this.modules.i18nFormat) {
            s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
            if (s.i18nFormat.init) s.i18nFormat.init(this);
          }

          this.translator = new Translator(this.services, this.options);
          this.translator.on('*', function (event) {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }

            _this2.emit.apply(_this2, [event].concat(args));
          });
          this.modules.external.forEach(function (m) {
            if (m.init) m.init(_this2);
          });
        }

        this.format = this.options.interpolation.format;
        if (!callback) callback = noop;

        if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
          var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
        }

        if (!this.services.languageDetector && !this.options.lng) {
          this.logger.warn('init: no languageDetector is used and no lng is defined');
        }

        var storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
        storeApi.forEach(function (fcName) {
          _this2[fcName] = function () {
            var _this2$store;

            return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
          };
        });
        var storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
        storeApiChained.forEach(function (fcName) {
          _this2[fcName] = function () {
            var _this2$store2;

            (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);

            return _this2;
          };
        });
        var deferred = defer();

        var load = function load() {
          var finish = function finish(err, t) {
            if (_this2.isInitialized && !_this2.initializedStoreOnce) _this2.logger.warn('init: i18next is already initialized. You should call init just once!');
            _this2.isInitialized = true;
            if (!_this2.options.isClone) _this2.logger.log('initialized', _this2.options);

            _this2.emit('initialized', _this2.options);

            deferred.resolve(t);
            callback(err, t);
          };

          if (_this2.languages && _this2.options.compatibilityAPI !== 'v1' && !_this2.isInitialized) return finish(null, _this2.t.bind(_this2));

          _this2.changeLanguage(_this2.options.lng, finish);
        };

        if (this.options.resources || !this.options.initImmediate) {
          load();
        } else {
          setTimeout(load, 0);
        }

        return deferred;
      }
    }, {
      key: "loadResources",
      value: function loadResources(language) {
        var _this3 = this;

        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
        var usedCallback = callback;
        var usedLng = typeof language === 'string' ? language : this.language;
        if (typeof language === 'function') usedCallback = language;

        if (!this.options.resources || this.options.partialBundledLanguages) {
          if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
          var toLoad = [];

          var append = function append(lng) {
            if (!lng) return;

            var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

            lngs.forEach(function (l) {
              if (toLoad.indexOf(l) < 0) toLoad.push(l);
            });
          };

          if (!usedLng) {
            var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            fallbacks.forEach(function (l) {
              return append(l);
            });
          } else {
            append(usedLng);
          }

          if (this.options.preload) {
            this.options.preload.forEach(function (l) {
              return append(l);
            });
          }

          this.services.backendConnector.load(toLoad, this.options.ns, function (e) {
            if (!e && !_this3.resolvedLanguage && _this3.language) _this3.setResolvedLanguage(_this3.language);
            usedCallback(e);
          });
        } else {
          usedCallback(null);
        }
      }
    }, {
      key: "reloadResources",
      value: function reloadResources(lngs, ns, callback) {
        var deferred = defer();
        if (!lngs) lngs = this.languages;
        if (!ns) ns = this.options.ns;
        if (!callback) callback = noop;
        this.services.backendConnector.reload(lngs, ns, function (err) {
          deferred.resolve();
          callback(err);
        });
        return deferred;
      }
    }, {
      key: "use",
      value: function use(module) {
        if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
        if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

        if (module.type === 'backend') {
          this.modules.backend = module;
        }

        if (module.type === 'logger' || module.log && module.warn && module.error) {
          this.modules.logger = module;
        }

        if (module.type === 'languageDetector') {
          this.modules.languageDetector = module;
        }

        if (module.type === 'i18nFormat') {
          this.modules.i18nFormat = module;
        }

        if (module.type === 'postProcessor') {
          postProcessor.addPostProcessor(module);
        }

        if (module.type === 'formatter') {
          this.modules.formatter = module;
        }

        if (module.type === '3rdParty') {
          this.modules.external.push(module);
        }

        return this;
      }
    }, {
      key: "setResolvedLanguage",
      value: function setResolvedLanguage(l) {
        if (!l || !this.languages) return;
        if (['cimode', 'dev'].indexOf(l) > -1) return;

        for (var li = 0; li < this.languages.length; li++) {
          var lngInLngs = this.languages[li];
          if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;

          if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
            this.resolvedLanguage = lngInLngs;
            break;
          }
        }
      }
    }, {
      key: "changeLanguage",
      value: function changeLanguage(lng, callback) {
        var _this4 = this;

        this.isLanguageChangingTo = lng;
        var deferred = defer();
        this.emit('languageChanging', lng);

        var setLngProps = function setLngProps(l) {
          _this4.language = l;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
          _this4.resolvedLanguage = undefined;

          _this4.setResolvedLanguage(l);
        };

        var done = function done(err, l) {
          if (l) {
            setLngProps(l);

            _this4.translator.changeLanguage(l);

            _this4.isLanguageChangingTo = undefined;

            _this4.emit('languageChanged', l);

            _this4.logger.log('languageChanged', l);
          } else {
            _this4.isLanguageChangingTo = undefined;
          }

          deferred.resolve(function () {
            return _this4.t.apply(_this4, arguments);
          });
          if (callback) callback(err, function () {
            return _this4.t.apply(_this4, arguments);
          });
        };

        var setLng = function setLng(lngs) {
          if (!lng && !lngs && _this4.services.languageDetector) lngs = [];
          var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);

          if (l) {
            if (!_this4.language) {
              setLngProps(l);
            }

            if (!_this4.translator.language) _this4.translator.changeLanguage(l);
            if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
          }

          _this4.loadResources(l, function (err) {
            done(err, l);
          });
        };

        if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
          setLng(this.services.languageDetector.detect());
        } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
          this.services.languageDetector.detect(setLng);
        } else {
          setLng(lng);
        }

        return deferred;
      }
    }, {
      key: "getFixedT",
      value: function getFixedT(lng, ns, keyPrefix) {
        var _this5 = this;

        var fixedT = function fixedT(key, opts) {
          var options;

          if (_typeof(opts) !== 'object') {
            for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
              rest[_key3 - 2] = arguments[_key3];
            }

            options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
          } else {
            options = _objectSpread$6({}, opts);
          }

          options.lng = options.lng || fixedT.lng;
          options.lngs = options.lngs || fixedT.lngs;
          options.ns = options.ns || fixedT.ns;
          var keySeparator = _this5.options.keySeparator || '.';
          var resultKey = keyPrefix ? "".concat(keyPrefix).concat(keySeparator).concat(key) : key;
          return _this5.t(resultKey, options);
        };

        if (typeof lng === 'string') {
          fixedT.lng = lng;
        } else {
          fixedT.lngs = lng;
        }

        fixedT.ns = ns;
        fixedT.keyPrefix = keyPrefix;
        return fixedT;
      }
    }, {
      key: "t",
      value: function t() {
        var _this$translator;

        return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
      }
    }, {
      key: "exists",
      value: function exists() {
        var _this$translator2;

        return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
      }
    }, {
      key: "setDefaultNamespace",
      value: function setDefaultNamespace(ns) {
        this.options.defaultNS = ns;
      }
    }, {
      key: "hasLoadedNamespace",
      value: function hasLoadedNamespace(ns) {
        var _this6 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!this.isInitialized) {
          this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
          return false;
        }

        if (!this.languages || !this.languages.length) {
          this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
          return false;
        }

        var lng = this.resolvedLanguage || this.languages[0];
        var fallbackLng = this.options ? this.options.fallbackLng : false;
        var lastLng = this.languages[this.languages.length - 1];
        if (lng.toLowerCase() === 'cimode') return true;

        var loadNotPending = function loadNotPending(l, n) {
          var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

          return loadState === -1 || loadState === 2;
        };

        if (options.precheck) {
          var preResult = options.precheck(this, loadNotPending);
          if (preResult !== undefined) return preResult;
        }

        if (this.hasResourceBundle(lng, ns)) return true;
        if (!this.services.backendConnector.backend) return true;
        if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
        return false;
      }
    }, {
      key: "loadNamespaces",
      value: function loadNamespaces(ns, callback) {
        var _this7 = this;

        var deferred = defer();

        if (!this.options.ns) {
          callback && callback();
          return Promise.resolve();
        }

        if (typeof ns === 'string') ns = [ns];
        ns.forEach(function (n) {
          if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
        });
        this.loadResources(function (err) {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
    }, {
      key: "loadLanguages",
      value: function loadLanguages(lngs, callback) {
        var deferred = defer();
        if (typeof lngs === 'string') lngs = [lngs];
        var preloaded = this.options.preload || [];
        var newLngs = lngs.filter(function (lng) {
          return preloaded.indexOf(lng) < 0;
        });

        if (!newLngs.length) {
          if (callback) callback();
          return Promise.resolve();
        }

        this.options.preload = preloaded.concat(newLngs);
        this.loadResources(function (err) {
          deferred.resolve();
          if (callback) callback(err);
        });
        return deferred;
      }
    }, {
      key: "dir",
      value: function dir(lng) {
        if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
        if (!lng) return 'rtl';
        var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
        return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
      }
    }, {
      key: "cloneInstance",
      value: function cloneInstance() {
        var _this8 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        var mergedOptions = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, this.options), options), {
          isClone: true
        });

        var clone = new I18n(mergedOptions);
        var membersToCopy = ['store', 'services', 'language'];
        membersToCopy.forEach(function (m) {
          clone[m] = _this8[m];
        });
        clone.services = _objectSpread$6({}, this.services);
        clone.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        clone.translator = new Translator(clone.services, clone.options);
        clone.translator.on('*', function (event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            args[_key4 - 1] = arguments[_key4];
          }

          clone.emit.apply(clone, [event].concat(args));
        });
        clone.init(mergedOptions, callback);
        clone.translator.options = clone.options;
        clone.translator.backendConnector.services.utils = {
          hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
        };
        return clone;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          options: this.options,
          store: this.store,
          language: this.language,
          languages: this.languages,
          resolvedLanguage: this.resolvedLanguage
        };
      }
    }]);

    return I18n;
  }(EventEmitter);

  _defineProperty(I18n, "createInstance", function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;
    return new I18n(options, callback);
  });

  var instance$2 = I18n.createInstance();
  instance$2.createInstance = I18n.createInstance;

  instance$2.createInstance;
  instance$2.init;
  instance$2.loadResources;
  instance$2.reloadResources;
  instance$2.use;
  instance$2.changeLanguage;
  instance$2.getFixedT;
  instance$2.t;
  instance$2.exists;
  instance$2.setDefaultNamespace;
  instance$2.hasLoadedNamespace;
  instance$2.loadNamespaces;
  instance$2.loadLanguages;

  i18 = instance$2.createInstance();

  const cs = {
    translation: {
      "Zadejte platnou hodnotu": "Zadejte platnou hodnotu",
      Potvrdit: "Potvrdit",
      Zrušit: "Zrušit",
      Zpět: "Zpět",
    },
  };

  const en = {
    translation: {
      "Zadejte platnou hodnotu": "Enter valid value",
      Potvrdit: "Confirm",
      Zrušit: "Back",
      Zpět: "Zpět",
    },
  };

  const sk = {
    translation: {
      "Zadejte platnou hodnotu": "Zadajte platnú hodnotu",
      Potvrdit: "Potvrdiť",
      Zrušit: "Zrušiť",
      Zpět: "Späť",
    },
  };

  i18.init(
    {
      fallbackLng: "en",
      debug: true,
      resources: {
        cs: cs,
        "cs-CZ": cs,
        en: en,
        "en-US": en,
        sk: sk,
      },
      keySeparator: "__",
      contextSeparator: "__",
    },
    (err, t) => {
      // TEST
      // console.log({ langs: { cs, en } });
      // console.log("webcomponents translation", "Zpět", t("Zpět"));
    },
  );

  /* src\DialogModal.svelte generated by Svelte v3.45.0 */

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[53] = list[i];
    return child_ctx;
  }

  // (140:8) {#if type !== "alert"}
  function create_if_block_14(ctx) {
    let svg;
    let g;
    let path0;
    let path1;
    let path2;
    let path3;
    let defs;
    let linearGradient0;
    let stop0;
    let stop1;
    let linearGradient1;
    let stop2;
    let stop3;

    return {
      c() {
        svg = svg_element("svg");
        g = svg_element("g");
        path0 = svg_element("path");
        path1 = svg_element("path");
        path2 = svg_element("path");
        path3 = svg_element("path");
        defs = svg_element("defs");
        linearGradient0 = svg_element("linearGradient");
        stop0 = svg_element("stop");
        stop1 = svg_element("stop");
        linearGradient1 = svg_element("linearGradient");
        stop2 = svg_element("stop");
        stop3 = svg_element("stop");
        attr(path0, "d", "M18.0312 6.01025L6.01037 18.0311");
        attr(path0, "stroke", "white");
        attr(path0, "stroke-width", "2");
        attr(path0, "stroke-linecap", "round");
        attr(path0, "stroke-linejoin", "round");
        attr(path1, "d", "M18.0312 6.01025L6.01037 18.0311");
        attr(path1, "stroke", "url(#paint0_linear_2500_2)");
        attr(path1, "stroke-width", "2");
        attr(path1, "stroke-linecap", "round");
        attr(path1, "stroke-linejoin", "round");
        attr(path2, "d", "M18.0312 18.0312L6.01037 6.01043");
        attr(path2, "stroke", "white");
        attr(path2, "stroke-width", "2");
        attr(path2, "stroke-linecap", "round");
        attr(path2, "stroke-linejoin", "round");
        attr(path3, "d", "M18.0312 18.0312L6.01037 6.01043");
        attr(path3, "stroke", "url(#paint1_linear_2500_2)");
        attr(path3, "stroke-width", "2");
        attr(path3, "stroke-linecap", "round");
        attr(path3, "stroke-linejoin", "round");
        attr(g, "opacity", "0.6");
        attr(stop0, "stop-color", "white");
        attr(stop1, "offset", "1");
        attr(stop1, "stop-color", "white");
        attr(stop1, "stop-opacity", "0");
        attr(linearGradient0, "id", "paint0_linear_2500_2");
        attr(linearGradient0, "x1", "18.3847");
        attr(linearGradient0, "y1", "6.36381");
        attr(linearGradient0, "x2", "6.36393");
        attr(linearGradient0, "y2", "18.3846");
        attr(linearGradient0, "gradientUnits", "userSpaceOnUse");
        attr(stop2, "stop-color", "white");
        attr(stop3, "offset", "1");
        attr(stop3, "stop-color", "white");
        attr(stop3, "stop-opacity", "0");
        attr(linearGradient1, "id", "paint1_linear_2500_2");
        attr(linearGradient1, "x1", "17.6776");
        attr(linearGradient1, "y1", "18.3848");
        attr(linearGradient1, "x2", "5.65682");
        attr(linearGradient1, "y2", "6.36399");
        attr(linearGradient1, "gradientUnits", "userSpaceOnUse");
        attr(svg, "width", "25");
        attr(svg, "height", "25");
        attr(svg, "viewBox", "0 0 25 25");
        attr(svg, "fill", "none");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, g);
        append(g, path0);
        append(g, path1);
        append(g, path2);
        append(g, path3);
        append(svg, defs);
        append(defs, linearGradient0);
        append(linearGradient0, stop0);
        append(linearGradient0, stop1);
        append(defs, linearGradient1);
        append(linearGradient1, stop2);
        append(linearGradient1, stop3);
      },
      d(detaching) {
        if (detaching) detach(svg);
      }
    };
  }

  // (167:6) {#if type === "prompt"}
  function create_if_block_5(ctx) {
    let if_block_anchor;

    function select_block_type(ctx, dirty) {
      if (/*inputtype*/ ctx[4] === "number") return create_if_block_6;
      return create_else_block;
    }

    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type(ctx);

    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx);

          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if_block.d(detaching);
        if (detaching) detach(if_block_anchor);
      }
    };
  }

  // (172:8) {:else}
  function create_else_block(ctx) {
    let p;
    let t_1;
    let if_block0 = /*invalid*/ ctx[18] && create_if_block_13(ctx);

    function select_block_type_1(ctx, dirty) {
      if (/*inputtype*/ ctx[4] === "time") return create_if_block_7;
      if (/*inputtype*/ ctx[4] === "date") return create_if_block_8;
      if (/*inputtype*/ ctx[4] === "datetime") return create_if_block_9;
      if (/*inputtype*/ ctx[4] === "password") return create_if_block_10;
      if (/*inputtype*/ ctx[4] === "tel") return create_if_block_11;
      if (/*inputtype*/ ctx[4] === "url") return create_if_block_12;
      return create_else_block_1;
    }

    let current_block_type = select_block_type_1(ctx);
    let if_block1 = current_block_type(ctx);

    return {
      c() {
        p = element("p");
        if (if_block0) if_block0.c();
        t_1 = space();
        if_block1.c();
      },
      m(target, anchor) {
        insert(target, p, anchor);
        if (if_block0) if_block0.m(p, null);
        append(p, t_1);
        if_block1.m(p, null);
      },
      p(ctx, dirty) {
        if (/*invalid*/ ctx[18]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_13(ctx);
            if_block0.c();
            if_block0.m(p, t_1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1.d(1);
          if_block1 = current_block_type(ctx);

          if (if_block1) {
            if_block1.c();
            if_block1.m(p, null);
          }
        }
      },
      d(detaching) {
        if (detaching) detach(p);
        if (if_block0) if_block0.d();
        if_block1.d();
      }
    };
  }

  // (168:8) {#if inputtype === "number"}
  function create_if_block_6(ctx) {
    let p;
    let tangle_number_input;
    let mounted;
    let dispose;

    return {
      c() {
        p = element("p");
        tangle_number_input = element("tangle-number-input");
        set_custom_element_data(tangle_number_input, "min", /*min*/ ctx[6]);
        set_custom_element_data(tangle_number_input, "max", /*max*/ ctx[7]);
        set_custom_element_data(tangle_number_input, "value", /*value*/ ctx[0]);
        set_style(p, "display", "flex");
        set_style(p, "justify-content", "center");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, tangle_number_input);
			/*tangle_number_input_binding*/ ctx[29](tangle_number_input);

        if (!mounted) {
          dispose = listen(tangle_number_input, "change", /*change_handler*/ ctx[28]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*min*/ 64) {
          set_custom_element_data(tangle_number_input, "min", /*min*/ ctx[6]);
        }

        if (dirty[0] & /*max*/ 128) {
          set_custom_element_data(tangle_number_input, "max", /*max*/ ctx[7]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_custom_element_data(tangle_number_input, "value", /*value*/ ctx[0]);
        }
      },
      d(detaching) {
        if (detaching) detach(p);
			/*tangle_number_input_binding*/ ctx[29](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (174:12) {#if invalid}
  function create_if_block_13(ctx) {
    let small;
    let t_1;

    return {
      c() {
        small = element("small");
        t_1 = text(/*invalidtext*/ ctx[12]);
        attr(small, "class", "invalidtext");
      },
      m(target, anchor) {
        insert(target, small, anchor);
        append(small, t_1);
      },
      p(ctx, dirty) {
        if (dirty[0] & /*invalidtext*/ 4096) set_data(t_1, /*invalidtext*/ ctx[12]);
      },
      d(detaching) {
        if (detaching) detach(small);
      }
    };
  }

  // (191:12) {:else}
  function create_else_block_1(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "text");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_6*/ ctx[43](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_6*/ ctx[42]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_6*/ ctx[43](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (189:42) 
  function create_if_block_12(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "url");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_5*/ ctx[41](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_5*/ ctx[40]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_5*/ ctx[41](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (187:42) 
  function create_if_block_11(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "tel");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_4*/ ctx[39](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_4*/ ctx[38]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_4*/ ctx[39](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (185:47) 
  function create_if_block_10(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "password");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_3*/ ctx[37](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_3*/ ctx[36]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_3*/ ctx[37](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (183:47) 
  function create_if_block_9(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "datetime");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_2*/ ctx[35](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_2*/ ctx[34]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_2*/ ctx[35](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (181:43) 
  function create_if_block_8(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "date");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding_1*/ ctx[33](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler_1*/ ctx[32]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding_1*/ ctx[33](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (179:12) {#if inputtype === "time"}
  function create_if_block_7(ctx) {
    let input;
    let mounted;
    let dispose;

    return {
      c() {
        input = element("input");
        attr(input, "maxlength", /*maxlength*/ ctx[8]);
        attr(input, "type", "time");
        attr(input, "placeholder", /*placeholder*/ ctx[5]);
        attr(input, "class", "tangle-msg-box-dialog-textbox");
        toggle_class(input, "invalid", /*invalid*/ ctx[18]);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(input, /*value*/ ctx[0]);
			/*input_binding*/ ctx[31](input);

        if (!mounted) {
          dispose = listen(input, "input", /*input_input_handler*/ ctx[30]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*maxlength*/ 256) {
          attr(input, "maxlength", /*maxlength*/ ctx[8]);
        }

        if (dirty[0] & /*placeholder*/ 32) {
          attr(input, "placeholder", /*placeholder*/ ctx[5]);
        }

        if (dirty[0] & /*value*/ 1) {
          set_input_value(input, /*value*/ ctx[0]);
        }

        if (dirty[0] & /*invalid*/ 262144) {
          toggle_class(input, "invalid", /*invalid*/ ctx[18]);
        }
      },
      d(detaching) {
        if (detaching) detach(input);
			/*input_binding*/ ctx[31](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (197:6) {#if type === "choose" && content !== ""}
  function create_if_block_4(ctx) {
    let div;

    return {
      c() {
        div = element("div");
        set_style(div, "height", "12px");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      d(detaching) {
        if (detaching) detach(div);
      }
    };
  }

  // (200:6) {#if type === "choose"}
  function create_if_block_3(ctx) {
    let div;
    let each_blocks = [];
    let each_1_lookup = new Map();
    let each_value = /*options*/ ctx[19];
    const get_key = ctx => /*o*/ ctx[53].value;

    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }

    return {
      c() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr(div, "class", "choose-box");
      },
      m(target, anchor) {
        insert(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*options, value, handleChooseOption*/ 17301505) {
          each_value = /*options*/ ctx[19];
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
        }
      },
      d(detaching) {
        if (detaching) detach(div);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }

  // (202:10) {#each options as o (o.value)}
  function create_each_block(key_1, ctx) {
    let button;
    let span;
    let span_style_value;
    let t_1_value = /*o*/ ctx[53].label + "";
    let t_1;
    let mounted;
    let dispose;

    function click_handler() {
      return /*click_handler*/ ctx[44](/*o*/ ctx[53]);
    }

    return {
      key: key_1,
      first: null,
      c() {
        button = element("button");
        span = element("span");
        t_1 = text(t_1_value);
        attr(span, "class", "icon");
        attr(span, "style", span_style_value = "background: " + /*o*/ ctx[53].icon);
        attr(button, "class", "tangle-msg-box-dialog-option option");
        toggle_class(button, "selected", /*o*/ ctx[53].value === /*value*/ ctx[0]);
        this.first = button;
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, span);
        append(button, t_1);

        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;

        if (dirty[0] & /*options*/ 524288 && span_style_value !== (span_style_value = "background: " + /*o*/ ctx[53].icon)) {
          attr(span, "style", span_style_value);
        }

        if (dirty[0] & /*options*/ 524288 && t_1_value !== (t_1_value = /*o*/ ctx[53].label + "")) set_data(t_1, t_1_value);

        if (dirty[0] & /*options, value*/ 524289) {
          toggle_class(button, "selected", /*o*/ ctx[53].value === /*value*/ ctx[0]);
        }
      },
      d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  }

  // (209:6) {#if type !== "alert" && !secondary && cancel !== "null"}
  function create_if_block_2(ctx) {
    let button;
    let t_1_value = (/*cancel*/ ctx[11] || /*t*/ ctx[20]("Zrušit")) + "";
    let t_1;
    let mounted;
    let dispose;

    return {
      c() {
        button = element("button");
        t_1 = text(t_1_value);
        attr(button, "class", "tangle-msg-box-dialog-button cancel");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t_1);
			/*button_binding*/ ctx[45](button);

        if (!mounted) {
          dispose = listen(button, "click", /*exitDialog*/ ctx[21]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*cancel*/ 2048 && t_1_value !== (t_1_value = (/*cancel*/ ctx[11] || /*t*/ ctx[20]("Zrušit")) + "")) set_data(t_1, t_1_value);
      },
      d(detaching) {
        if (detaching) detach(button);
			/*button_binding*/ ctx[45](null);
        mounted = false;
        dispose();
      }
    };
  }

  // (212:6) {#if secondary && secondary !== "null"}
  function create_if_block_1(ctx) {
    let button;
    let t_1;
    let mounted;
    let dispose;

    return {
      c() {
        button = element("button");
        t_1 = text(/*secondary*/ ctx[10]);
        attr(button, "class", "tangle-msg-box-dialog-button secondary");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t_1);

        if (!mounted) {
          dispose = listen(button, "click", /*confirmDialogSecondary*/ ctx[23]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*secondary*/ 1024) set_data(t_1, /*secondary*/ ctx[10]);
      },
      d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  }

  // (215:6) {#if confirm !== "null"}
  function create_if_block(ctx) {
    let button;
    let t_1_value = (/*confirm*/ ctx[9] || /*t*/ ctx[20]("Potvrdit")) + "";
    let t_1;
    let mounted;
    let dispose;

    return {
      c() {
        button = element("button");
        t_1 = text(t_1_value);
        attr(button, "class", "tangle-msg-box-dialog-button");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t_1);
			/*button_binding_1*/ ctx[46](button);

        if (!mounted) {
          dispose = listen(button, "click", /*confirmDialog*/ ctx[22]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (dirty[0] & /*confirm*/ 512 && t_1_value !== (t_1_value = (/*confirm*/ ctx[9] || /*t*/ ctx[20]("Potvrdit")) + "")) set_data(t_1, t_1_value);
      },
      d(detaching) {
        if (detaching) detach(button);
			/*button_binding_1*/ ctx[46](null);
        mounted = false;
        dispose();
      }
    };
  }

  function create_fragment$1(ctx) {
    let div5;
    let div4;
    let div1;
    let div0;
    let t0;
    let t1;
    let t2;
    let div2;
    let p;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let div3;
    let t8;
    let t9;
    let t10;
    let html_tag;
    let raw_value = "<style>" + window.___tangleMsgBoxStyles + "</style>" + "";
    let mounted;
    let dispose;
    let if_block0 = /*type*/ ctx[1] !== "alert" && create_if_block_14();
    let if_block1 = /*type*/ ctx[1] === "prompt" && create_if_block_5(ctx);
    let if_block2 = /*type*/ ctx[1] === "choose" && /*content*/ ctx[3] !== "" && create_if_block_4();
    let if_block3 = /*type*/ ctx[1] === "choose" && create_if_block_3(ctx);
    let if_block4 = /*type*/ ctx[1] !== "alert" && !/*secondary*/ ctx[10] && /*cancel*/ ctx[11] !== "null" && create_if_block_2(ctx);
    let if_block5 = /*secondary*/ ctx[10] && /*secondary*/ ctx[10] !== "null" && create_if_block_1(ctx);
    let if_block6 = /*confirm*/ ctx[9] !== "null" && create_if_block(ctx);

    return {
      c() {
        div5 = element("div");
        div4 = element("div");
        div1 = element("div");
        div0 = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        t1 = text(/*title*/ ctx[2]);
        t2 = space();
        div2 = element("div");
        p = element("p");
        t3 = text(/*content*/ ctx[3]);
        t4 = space();
        if (if_block1) if_block1.c();
        t5 = space();
        if (if_block2) if_block2.c();
        t6 = space();
        if (if_block3) if_block3.c();
        t7 = space();
        div3 = element("div");
        if (if_block4) if_block4.c();
        t8 = space();
        if (if_block5) if_block5.c();
        t9 = space();
        if (if_block6) if_block6.c();
        t10 = space();
        html_tag = new HtmlTag();
        this.c = noop$1;
        attr(div0, "id", "exitElm");
        attr(div1, "class", "tangle-msg-box-dialog-header");
        attr(div2, "class", "tangle-msg-box-dialog-body");
        attr(div3, "class", "tangle-msg-box-dialog-footer");
        attr(div4, "class", "tangle-msg-box-dialog");
        toggle_class(div4, "tangle-msg-box-dialog-hide", /*msgboxCloseDialog*/ ctx[15]);
        html_tag.a = null;
        attr(div5, "class", "tangle-msg-box-modal");
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div4);
        append(div4, div1);
        append(div1, div0);
        if (if_block0) if_block0.m(div0, null);
        append(div1, t0);
        append(div1, t1);
        append(div4, t2);
        append(div4, div2);
        append(div2, p);
        append(p, t3);
        append(div2, t4);
        if (if_block1) if_block1.m(div2, null);
        append(div2, t5);
        if (if_block2) if_block2.m(div2, null);
        append(div2, t6);
        if (if_block3) if_block3.m(div2, null);
        append(div4, t7);
        append(div4, div3);
        if (if_block4) if_block4.m(div3, null);
        append(div3, t8);
        if (if_block5) if_block5.m(div3, null);
        append(div3, t9);
        if (if_block6) if_block6.m(div3, null);
			/*div4_binding*/ ctx[47](div4);
        append(div5, t10);
        html_tag.m(raw_value, div5);

        if (!mounted) {
          dispose = listen(div0, "click", /*exitDialog*/ ctx[21]);
          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (/*type*/ ctx[1] !== "alert") {
          if (if_block0); else {
            if_block0 = create_if_block_14();
            if_block0.c();
            if_block0.m(div0, null);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (dirty[0] & /*title*/ 4) set_data(t1, /*title*/ ctx[2]);
        if (dirty[0] & /*content*/ 8) set_data(t3, /*content*/ ctx[3]);

        if (/*type*/ ctx[1] === "prompt") {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_5(ctx);
            if_block1.c();
            if_block1.m(div2, t5);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (/*type*/ ctx[1] === "choose" && /*content*/ ctx[3] !== "") {
          if (if_block2); else {
            if_block2 = create_if_block_4();
            if_block2.c();
            if_block2.m(div2, t6);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (/*type*/ ctx[1] === "choose") {
          if (if_block3) {
            if_block3.p(ctx, dirty);
          } else {
            if_block3 = create_if_block_3(ctx);
            if_block3.c();
            if_block3.m(div2, null);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }

        if (/*type*/ ctx[1] !== "alert" && !/*secondary*/ ctx[10] && /*cancel*/ ctx[11] !== "null") {
          if (if_block4) {
            if_block4.p(ctx, dirty);
          } else {
            if_block4 = create_if_block_2(ctx);
            if_block4.c();
            if_block4.m(div3, t8);
          }
        } else if (if_block4) {
          if_block4.d(1);
          if_block4 = null;
        }

        if (/*secondary*/ ctx[10] && /*secondary*/ ctx[10] !== "null") {
          if (if_block5) {
            if_block5.p(ctx, dirty);
          } else {
            if_block5 = create_if_block_1(ctx);
            if_block5.c();
            if_block5.m(div3, t9);
          }
        } else if (if_block5) {
          if_block5.d(1);
          if_block5 = null;
        }

        if (/*confirm*/ ctx[9] !== "null") {
          if (if_block6) {
            if_block6.p(ctx, dirty);
          } else {
            if_block6 = create_if_block(ctx);
            if_block6.c();
            if_block6.m(div3, null);
          }
        } else if (if_block6) {
          if_block6.d(1);
          if_block6 = null;
        }

        if (dirty[0] & /*msgboxCloseDialog*/ 32768) {
          toggle_class(div4, "tangle-msg-box-dialog-hide", /*msgboxCloseDialog*/ ctx[15]);
        }
      },
      i: noop$1,
      o: noop$1,
      d(detaching) {
        if (detaching) detach(div5);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
        if (if_block3) if_block3.d();
        if (if_block4) if_block4.d();
        if (if_block5) if_block5.d();
        if (if_block6) if_block6.d();
			/*div4_binding*/ ctx[47](null);
        mounted = false;
        dispose();
      }
    };
  }

  function instance$1($$self, $$props, $$invalidate) {
    let options;
    let regexForValidation;
    let invalid;
    const { t } = i18;
    const component = get_current_component();
    const svelteDispatch = createEventDispatcher();

    const dispatch = (name, detail) => {
      svelteDispatch(name, detail);
      component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));

      if (typeof window !== "undefined" && window.top) {
        window.top.postMessage(JSON.stringify({ name, detail }), "*");
      }
    };

    let inputField;

    onMount(async () => {
      console.log(inputtype);
      $$invalidate(0, value = value || defaultvalue);
      component.focus();
      const style = document.createElement("style");
      style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');`;
      component.appendChild(style);

      setTimeout(
        () => {
          if (inputtype.match(/text|email|tel|url/)) {
            inputField && inputField.focus();
            inputField && inputField.click();

            inputField && setTimeout(
              () => {
                document.execCommand("selectall", null, false);
              },
              0
            );
          }
        },
        0
      );

      return () => style.remove();
    });

    document.addEventListener("keydown", e => {
      e.key === "Enter" && confirmDialog();
      e.key === "Escape" && exitDialog();
    });

    let msgboxDialog;
    let msgboxCloseDialog = false;

    function exitDialog() {
      const dialogElm = msgboxDialog;
      $$invalidate(15, msgboxCloseDialog = true);

      dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
        if (evt.animationName === "msg-box-dialog-hide") {
          dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
          dispatch("submit", undefined);
          component.remove();
        }
      });
    }

    function confirmDialog() {
      if (!invalid) {
        const dialogElm = msgboxDialog;
        $$invalidate(15, msgboxCloseDialog = true);

        dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
          if (evt.animationName === "msg-box-dialog-hide") {
            dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
            dispatch("submit", type === "prompt" || type === "choose" ? value : true);
            component.remove();
          }
        });
      }
    }

    function confirmDialogSecondary() {
      const dialogElm = msgboxDialog;
      $$invalidate(15, msgboxCloseDialog = true);

      dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
        if (evt.animationName === "msg-box-dialog-hide") {
          dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
          dispatch("submit", "secondary");
          component.remove();
        }
      });
    }

    let { type = "prompt" } = $$props;
    let { title = "" } = $$props;
    let { content = "" } = $$props;
    let { inputtype = "text" } = $$props;
    let { placeholder = "" } = $$props;
    let { min = -999999999 } = $$props;
    let { max = 999999999 } = $$props;
    let { maxlength = 999999999 } = $$props;
    let { confirm = "" } = $$props;
    let { secondary = "" } = $$props;
    let { cancel = "" } = $$props;
    let { regex = /.*/ } = $$props;
    let { jsonoptions = "[]" } = $$props;
    let { defaultvalue = "" } = $$props;
    let { value = "" } = $$props;

    function handleChooseOption(v) {
      $$invalidate(0, value = v);

      if (!(confirm && confirm !== "null")) {
        confirmDialog();
      }
    }

    let { invalidtext = t("Zadejte platnou hodnotu") } = $$props;

    function validate(value) {
      return regexForValidation.test(value);
    }

    // new RegExp('.+\\*.+')
    let confirmBtn;

    let cancelBtn;
    const change_handler = e => $$invalidate(0, value = e.detail.value);

    function tangle_number_input_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_1() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_1($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_2() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_2($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_3() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_3($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_4() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_4($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_5() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_5($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    function input_input_handler_6() {
      value = this.value;
      $$invalidate(0, value);
    }

    function input_binding_6($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        inputField = $$value;
        $$invalidate(13, inputField);
      });
    }

    const click_handler = o => handleChooseOption(o.value);

    function button_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        cancelBtn = $$value;
        $$invalidate(17, cancelBtn);
      });
    }

    function button_binding_1($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        confirmBtn = $$value;
        $$invalidate(16, confirmBtn);
      });
    }

    function div4_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](() => {
        msgboxDialog = $$value;
        $$invalidate(14, msgboxDialog);
      });
    }

    $$self.$$set = $$props => {
      if ('type' in $$props) $$invalidate(1, type = $$props.type);
      if ('title' in $$props) $$invalidate(2, title = $$props.title);
      if ('content' in $$props) $$invalidate(3, content = $$props.content);
      if ('inputtype' in $$props) $$invalidate(4, inputtype = $$props.inputtype);
      if ('placeholder' in $$props) $$invalidate(5, placeholder = $$props.placeholder);
      if ('min' in $$props) $$invalidate(6, min = $$props.min);
      if ('max' in $$props) $$invalidate(7, max = $$props.max);
      if ('maxlength' in $$props) $$invalidate(8, maxlength = $$props.maxlength);
      if ('confirm' in $$props) $$invalidate(9, confirm = $$props.confirm);
      if ('secondary' in $$props) $$invalidate(10, secondary = $$props.secondary);
      if ('cancel' in $$props) $$invalidate(11, cancel = $$props.cancel);
      if ('regex' in $$props) $$invalidate(25, regex = $$props.regex);
      if ('jsonoptions' in $$props) $$invalidate(26, jsonoptions = $$props.jsonoptions);
      if ('defaultvalue' in $$props) $$invalidate(27, defaultvalue = $$props.defaultvalue);
      if ('value' in $$props) $$invalidate(0, value = $$props.value);
      if ('invalidtext' in $$props) $$invalidate(12, invalidtext = $$props.invalidtext);
    };

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*jsonoptions*/ 67108864) {
        $$invalidate(19, options = JSON.parse(jsonoptions));
      }

      if ($$self.$$.dirty[0] & /*regex*/ 33554432) {
        regexForValidation = new RegExp(regex.toString().slice(1, -1));
      }

      if ($$self.$$.dirty[0] & /*value*/ 1) {
        $$invalidate(18, invalid = !validate(value));
      }
    };

    return [
      value,
      type,
      title,
      content,
      inputtype,
      placeholder,
      min,
      max,
      maxlength,
      confirm,
      secondary,
      cancel,
      invalidtext,
      inputField,
      msgboxDialog,
      msgboxCloseDialog,
      confirmBtn,
      cancelBtn,
      invalid,
      options,
      t,
      exitDialog,
      confirmDialog,
      confirmDialogSecondary,
      handleChooseOption,
      regex,
      jsonoptions,
      defaultvalue,
      change_handler,
      tangle_number_input_binding,
      input_input_handler,
      input_binding,
      input_input_handler_1,
      input_binding_1,
      input_input_handler_2,
      input_binding_2,
      input_input_handler_3,
      input_binding_3,
      input_input_handler_4,
      input_binding_4,
      input_input_handler_5,
      input_binding_5,
      input_input_handler_6,
      input_binding_6,
      click_handler,
      button_binding,
      button_binding_1,
      div4_binding
    ];
  }

  class DialogModal extends SvelteElement {
    constructor(options) {
      super();
      this.shadowRoot.innerHTML = `<style>:root{--body-bg:#191919;--text:#9b9b9b}*{font-family:"Poppins", sans-serif !important}.tangle-msg-box-modal{font-family:inherit;width:100%;height:100%;display:flex;justify-content:center;align-items:center;overflow:auto;position:fixed;top:0;left:0;z-index:100000}.tangle-msg-box-dialog{width:calc(100% - 2em);max-width:314px;overflow:hidden;box-sizing:border-box;box-shadow:0 0.5em 1em rgba(0, 0, 0, 0.5);border-radius:25px;animation:msg-box-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28);background:#191919}.tangle-msg-box-dialog .tangle-msg-box-dialog-header,.tangle-msg-box-dialog .tangle-msg-box-dialog-body,.tangle-msg-box-dialog .tangle-msg-box-dialog-footer{background-color:inherit}.tangle-msg-box-dialog-header{color:inherit;text-align:center;font-weight:500;font-size:16px;padding:16px;padding-top:42px;padding-bottom:0px}.tangle-msg-box-dialog-body{color:inherit;padding-bottom:24px;padding-top:16px}.tangle-msg-box-dialog-body>p{text-align:center;font-size:12px;color:var(--text);line-height:18px;font-weight:300;padding:0;margin:0;margin-left:22px;margin-right:22px;overflow-wrap:break-word}.tangle-msg-box-dialog-footer{color:inherit;display:flex;flex-direction:column-reverse;justify-content:stretch;padding-left:22px;padding-right:22px;padding-bottom:20px}.tangle-msg-box-dialog-button{color:inherit;font-family:inherit;font-size:inherit;background-color:rgba(0, 0, 0, 0);width:100%;max-width:100%;margin-top:8px;padding:16px;padding-top:14.5px;padding-bottom:14.5px;border:none;outline:0;border-radius:0px;transition:background-color 225ms ease-out}.tangle-msg-box-dialog-button:focus{background-color:rgba(0, 0, 0, 0.05)}.tangle-msg-box-dialog-button:active{background-color:rgba(0, 0, 0, 0.15)}.tangle-msg-box-dialog-textbox{width:100%;margin-top:16px;transition:border 125ms ease-out, border 125ms ease-out;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white;margin-bottom:-10px !important;outline:none !important}.tangle-msg-box-dialog-textbox:focus{box-shadow:none}.tangle-msg-box-modal{background-color:rgba(31, 31, 31, 0.5)}.tangle-msg-box-dialog{color:white}.tangle-msg-box-dialog-textbox{background-color:#2f2f2f}.tangle-msg-box-dialog-header{background:#191919}.tangle-msg-box-dialog-button{border-radius:20px;font-weight:500;font-size:14px;color:#777777 !important;cursor:pointer}.tangle-msg-box-dialog-button:hover{color:white}.tangle-msg-box-dialog-button:last-of-type{background:#ff257e !important;color:white !important}.tangle-msg-box-dialog-button:last-of-type:hover{background:#ff4a94 !important}.tangle-msg-box-dialog-button.cancel{margin-bottom:-10px}.tangle-msg-box-dialog-option{color:inherit;font-family:inherit;font-size:inherit;background-color:rgba(0, 0, 0, 0);width:100%;max-width:100%;margin-top:8px;padding:16px;padding-top:14.5px;padding-bottom:14.5px;border:none;outline:0;border-radius:0px;transition:background-color 225ms ease-out;border-radius:20px;font-weight:500;font-size:14px;color:#777777 !important;cursor:pointer;display:flex;background:#303030;border:1px solid transparent;align-items:center;color:white !important}.tangle-msg-box-dialog-option.selected{background:#5a5a5a !important;border:1px solid white}#exitElm{height:0;width:0;margin-top:-30px;float:right;transform:translateX(-20px)}.tangle-msg-box-dialog.tangle-msg-box-dialog-hide{opacity:0;animation:msg-box-dialog-hide 265ms ease-in}@keyframes msg-box-dialog-show{0%{opacity:0;transform:translateY(-100%)}100%{opacity:1;transform:translateX(0)}}@keyframes msg-box-dialog-hide{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateY(-50%)}}.invalidtext{color:red;margin-top:8px;display:block}.invalid{border:1px solid red}.secondary{background:#303030 !important;margin-top:15px}.icon{width:20px;height:20px;margin-right:16px;display:block;background-repeat:no-repeat;background-size:cover !important}.choose-box{margin-left:22px;margin-right:22px;margin-bottom:-10px}</style>`;

      init(
        this,
        {
          target: this.shadowRoot,
          props: attribute_to_object(this.attributes),
          customElement: true
        },
        instance$1,
        create_fragment$1,
        not_equal,
        {
          type: 1,
          title: 2,
          content: 3,
          inputtype: 4,
          placeholder: 5,
          min: 6,
          max: 7,
          maxlength: 8,
          confirm: 9,
          secondary: 10,
          cancel: 11,
          regex: 25,
          jsonoptions: 26,
          defaultvalue: 27,
          value: 0,
          invalidtext: 12
        },
        null,
        [-1, -1]
      );

      if (options) {
        if (options.target) {
          insert(options.target, this, options.anchor);
        }

        if (options.props) {
          this.$set(options.props);
          flush();
        }
      }
    }

    static get observedAttributes() {
      return [
        "type",
        "title",
        "content",
        "inputtype",
        "placeholder",
        "min",
        "max",
        "maxlength",
        "confirm",
        "secondary",
        "cancel",
        "regex",
        "jsonoptions",
        "defaultvalue",
        "value",
        "invalidtext"
      ];
    }

    get type() {
      return this.$$.ctx[1];
    }

    set type(type) {
      this.$$set({ type });
      flush();
    }

    get title() {
      return this.$$.ctx[2];
    }

    set title(title) {
      this.$$set({ title });
      flush();
    }

    get content() {
      return this.$$.ctx[3];
    }

    set content(content) {
      this.$$set({ content });
      flush();
    }

    get inputtype() {
      return this.$$.ctx[4];
    }

    set inputtype(inputtype) {
      this.$$set({ inputtype });
      flush();
    }

    get placeholder() {
      return this.$$.ctx[5];
    }

    set placeholder(placeholder) {
      this.$$set({ placeholder });
      flush();
    }

    get min() {
      return this.$$.ctx[6];
    }

    set min(min) {
      this.$$set({ min });
      flush();
    }

    get max() {
      return this.$$.ctx[7];
    }

    set max(max) {
      this.$$set({ max });
      flush();
    }

    get maxlength() {
      return this.$$.ctx[8];
    }

    set maxlength(maxlength) {
      this.$$set({ maxlength });
      flush();
    }

    get confirm() {
      return this.$$.ctx[9];
    }

    set confirm(confirm) {
      this.$$set({ confirm });
      flush();
    }

    get secondary() {
      return this.$$.ctx[10];
    }

    set secondary(secondary) {
      this.$$set({ secondary });
      flush();
    }

    get cancel() {
      return this.$$.ctx[11];
    }

    set cancel(cancel) {
      this.$$set({ cancel });
      flush();
    }

    get regex() {
      return this.$$.ctx[25];
    }

    set regex(regex) {
      this.$$set({ regex });
      flush();
    }

    get jsonoptions() {
      return this.$$.ctx[26];
    }

    set jsonoptions(jsonoptions) {
      this.$$set({ jsonoptions });
      flush();
    }

    get defaultvalue() {
      return this.$$.ctx[27];
    }

    set defaultvalue(defaultvalue) {
      this.$$set({ defaultvalue });
      flush();
    }

    get value() {
      return this.$$.ctx[0];
    }

    set value(value) {
      this.$$set({ value });
      flush();
    }

    get invalidtext() {
      return this.$$.ctx[12];
    }

    set invalidtext(invalidtext) {
      this.$$set({ invalidtext });
      flush();
    }
  }

  customElements.define("tangle-modal", DialogModal);

  /* src\NumberPicker.svelte generated by Svelte v3.45.0 */

  function create_fragment(ctx) {
    let main;
    let div0;
    let t0;
    let input;
    let t1;
    let div1;
    let t2;
    let html_tag;
    let raw_value = "<style>" + window.___tangleMsgBoxStyles + "</style>" + "";
    let mounted;
    let dispose;

    return {
      c() {
        main = element("main");
        div0 = element("div");
        div0.innerHTML = `<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.620667 10.5L13.6138 0.540707L13.6138 20.4593L0.620667 10.5Z" fill="white"></path></svg>`;
        t0 = space();
        input = element("input");
        t1 = space();
        div1 = element("div");
        div1.innerHTML = `<svg width="18" height="28" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.0483 10.5L0.0551758 20.4593L0.0551758 0.540708L13.0483 10.5Z" fill="white"></path></svg>`;
        t2 = space();
        html_tag = new HtmlTag();
        this.c = noop$1;
        attr(input, "type", "number");
        attr(input, "min", /*min*/ ctx[1]);
        attr(input, "max", /*max*/ ctx[2]);
        html_tag.a = null;
      },
      m(target, anchor) {
        insert(target, main, anchor);
        append(main, div0);
        append(main, t0);
        append(main, input);
        set_input_value(input, /*value*/ ctx[0]);
        append(main, t1);
        append(main, div1);
        append(main, t2);
        html_tag.m(raw_value, main);

        if (!mounted) {
          dispose = [
            listen(div0, "click", /*click_handler*/ ctx[3]),
            listen(input, "input", /*input_input_handler*/ ctx[4]),
            listen(div1, "click", /*click_handler_1*/ ctx[5])
          ];

          mounted = true;
        }
      },
      p(ctx, [dirty]) {
        if (dirty & /*min*/ 2) {
          attr(input, "min", /*min*/ ctx[1]);
        }

        if (dirty & /*max*/ 4) {
          attr(input, "max", /*max*/ ctx[2]);
        }

        if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
          set_input_value(input, /*value*/ ctx[0]);
        }
      },
      i: noop$1,
      o: noop$1,
      d(detaching) {
        if (detaching) detach(main);
        mounted = false;
        run_all(dispose);
      }
    };
  }

  function instance($$self, $$props, $$invalidate) {
    let { min = -999999999 } = $$props;
    let { max = 999999999 } = $$props;
    let { value = 0 } = $$props;
    const component = get_current_component();
    const svelteDispatch = createEventDispatcher();

    const dispatch = (name, detail) => {
      svelteDispatch(name, detail);
      component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));
    };

    function limitNumber(val) {
      console.log({ val, min, max });

      if (val < min) {
        $$invalidate(0, value = min);
      }

      if (val > max) {
        $$invalidate(0, value = max);
      }

      return val;
    }

    const click_handler = _ => value > min && $$invalidate(0, value--, value);

    function input_input_handler() {
      value = to_number(this.value);
      $$invalidate(0, value);
    }

    const click_handler_1 = _ => value < max && $$invalidate(0, value++, value);

    $$self.$$set = $$props => {
      if ('min' in $$props) $$invalidate(1, min = $$props.min);
      if ('max' in $$props) $$invalidate(2, max = $$props.max);
      if ('value' in $$props) $$invalidate(0, value = $$props.value);
    };

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*value*/ 1) {
        dispatch("change", { value });
      }

      if ($$self.$$.dirty & /*value*/ 1) {
        limitNumber(value);
      }
    };

    return [value, min, max, click_handler, input_input_handler, click_handler_1];
  }

  class NumberPicker extends SvelteElement {
    constructor(options) {
      super();
      this.shadowRoot.innerHTML = `<style>main{display:flex;align-items:center;margin-top:4px;margin-bottom:-16px}input{width:75.79px;border-radius:10px;background:#303030;padding:13px 0px;border:none;text-align:center;font-family:"Poppins", sans-serif;-moz-appearance:textfield;font-size:16px;font-weight:500;color:white;outline:none !important;box-shadow:none !important}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}div{padding:26px}svg{padding-top:4px}</style>`;

      init(
        this,
        {
          target: this.shadowRoot,
          props: attribute_to_object(this.attributes),
          customElement: true
        },
        instance,
        create_fragment,
        not_equal,
        { min: 1, max: 2, value: 0 },
        null
      );

      if (options) {
        if (options.target) {
          insert(options.target, this, options.anchor);
        }

        if (options.props) {
          this.$set(options.props);
          flush();
        }
      }
    }

    static get observedAttributes() {
      return ["min", "max", "value"];
    }

    get min() {
      return this.$$.ctx[1];
    }

    set min(min) {
      this.$$set({ min });
      flush();
    }

    get max() {
      return this.$$.ctx[2];
    }

    set max(max) {
      this.$$set({ max });
      flush();
    }

    get value() {
      return this.$$.ctx[0];
    }

    set value(value) {
      this.$$set({ value });
      flush();
    }
  }

  customElements.define("tangle-number-input", NumberPicker);

  const { t } = i18;
  // TODO handle confirm, cancel text HERE instead in sveltecomponent
  i18.on("languageChanged", lang => {
    console.log("Current language", lang);
  });



  new DialogModal({});
  new NumberPicker({});
}

function initGlobals() {
  window.TangleMsgBox = TangleMsgBox;

  window.prompt = TangleMsgBox.prompt;
  window.confirm = TangleMsgBox.confirm;
  window.alert = TangleMsgBox.alert;
}

/**
   * @type {string}
   */

class TangleMsgBox {
  /**
   * @param {string} stringWithStyles
   */
  static setStyles(stringWithStyles) {
    window.___tangleMsgBoxStyles = stringWithStyles;
  }

  static async create(title, content, type, { confirm, cancel }) {
    let { t } = i18;

    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", type);
    confirm && dialogBox.setAttribute("confirm", confirm);
    cancel && dialogBox.setAttribute("cancel", cancel);
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }

  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<true>}
   * Creates the alert dialog element
   */
  static async alert(content, title = "", { confirm } = { confirm: "Ok" }) {
    let { t } = i18;

    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);

    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", "alert");
    confirm && dialogBox.setAttribute("confirm", confirm);
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<boolean>}
   * Creates the confirm dialog element
   */
  static async confirm(content, title = "", { confirm, cancel, secondary } = {}) {
    let { t } = i18;

    const dialogBox = document.createElement("tangle-modal");

    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", "confirm");

    dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
    dialogBox.setAttribute("cancel", cancel || t("Zrušit"));
    (secondary || secondary === "") && dialogBox.setAttribute("secondary", secondary);

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @param {'number'|'text'|'string'|RegExp} inputtype
   * @returns {Promise<string>}
   * Creates the confirm dialog element
   */
  static async prompt(
    content,
    value,
    title = "",
    inputtype,
    { placeholder, min, max, regex, invalidText, maxlength } = { placeholder: undefined, min: undefined, max: undefined, regex: undefined, maxlength: undefined },
    { confirm, cancel } = {},
  ) {
    let { t } = i18;

    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("value", value);
    title && dialogBox.setAttribute("title", title);
    content && dialogBox.setAttribute("content", content);
    maxlength > 1 && dialogBox.setAttribute("maxlength", maxlength);
    dialogBox.setAttribute("type", "prompt");
    dialogBox.setAttribute("inputtype", inputtype);

    typeof min === "number" && dialogBox.setAttribute("min", min);
    typeof max === "number" && dialogBox.setAttribute("max", max);

    placeholder && dialogBox.setAttribute("placeholder", placeholder);
  /*(confirm || confirm === "") &&*/ dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
  /*(cancel || cancel === "")  && */ dialogBox.setAttribute("cancel", cancel || t("Zrušit"));
    regex && dialogBox.setAttribute("regex", regex);
    invalidText && dialogBox.setAttribute("invalidtext", invalidText);

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }

  static async choose(content, { defaultValue, options }, title = "", { confirm, cancel } = {}) {
    let { t } = i18;

    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("type", "choose");
    title && dialogBox.setAttribute("title", title);
    content && dialogBox.setAttribute("content", content);

    defaultValue && dialogBox.setAttribute("defaultvalue", defaultValue);
    options && dialogBox.setAttribute("jsonoptions", JSON.stringify(options));

    dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
    dialogBox.setAttribute("cancel", cancel || t("Zrušit"));

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
}


// use without initializing class
// const tangleMsgBoxLegacy = new TangleMsgBox();
// export { tangleMsgBoxLegacy };

// import {tangleMsgBoxLegacy as TangleMsgBox} from '....'




export { TangleMsgBox, TangleMsgBox as default, i18 as i18webcomponents, initGlobals };
//# sourceMappingURL=dialog-component.js.map
