(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([ ], function() {
      return (root.Cathmhaol = factory(root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Cathmhaol = factory(root);
  }
}(this, function(window) {
  'use strict';

  var Cathmhaol = window.Cathmhaol || {};

  /**
   * Input validation object. Takes a string or node as an argument and attaches the validation listeners accordingly.
   *
   * @param    {string|HTMLElement} node
   * @param    {boolean} required
   * @param    {Cathmhaol.Validation.Types} type
   * @param    {function[]} validators
   *
   * @requires  Cathmhaol.Validation
   *
   * @author  Robert King (hrobertking@cathmhaol.com)
   *
   * @version  1.0
   */
  Cathmhaol.Validator = function(node, required, type, validators) {
    /**
     * The HTMLElement validated
     * @type     {HTMLElement}
     */
    this.element = ( typeof(node) === 'string' ?
                      document.getElementById(node) :
                      node );

    /**
     * Adds a class to the element
     * @return   {void}
     * @param    {string} str
     */
    this.addClass = function(str) {
      pvtThis.element.className += ' ' + str;
    };

    /**
     * Removes a class from the element
     * @return   {void}
     * @param    {string} str
     */
    this.removeClass = function(str) {
      var rex = new RegExp('\\b' + str + '\\b');
      pvtThis.element.className = pvtThis.element.className.replace(rex, '');
    };

    /**
     * @event  Fired when the value is invalid
     */
    this.invalid = {
      /**
       * Subscribes a function to the event
       * @return   {void}
       * @param    {function} handler
       * @param    {object} scope
       */
      listen: function(handler, scope) {
        if (typeof(handler) === 'function') {
          this.pvtListeners.push({fn: handler, scope: scope});
        }
        return;
      },

      /**
       * Fires the event, invoking the listeners
       * @return   {void}
       */
      trigger: function() {
        var args = [].slice.call(arguments, 0)
          , count = this.pvtListeners.length
          , index
          , listener
        ;

        if (count > 0) {
          for (index = count; index > 0; index -= 1) {
            listener = this.pvtListeners[index - 1];
            if (listener && listener.fn && listener.fn.call) {
              listener.fn.call((listener.scope || window), args);
            }
          }
        }
        return;
      },

      /**
       * Array of handlers
       * @type     {object[]}
       * @private
       */
      pvtListeners: [ ]
    };

    /**
     * @event  Fired when the value is missing
     */
    this.missing = {
      /**
       * Subscribes a function to the event
       * @return   {void}
       * @param    {function} handler
       * @param    {object} scope
       */
      listen: function(handler, scope) {
        if (typeof(handler) === 'function') {
          this.pvtListeners.push({fn: handler, scope: scope});
        }
        return;
      },

      /**
       * Fires the event, invoking the listeners
       * @return   {void}
       */
      trigger: function() {
        var args = [].slice.call(arguments, 0)
          , count = this.pvtListeners.length
          , index
          , listener
        ;

        if (count > 0) {
          for (index = count; index > 0; index -= 1) {
            listener = this.pvtListeners[index - 1];
            if (listener && listener.fn && listener.fn.call) {
              listener.fn.call((listener.scope || window), args);
            }
          }
        }
        return;
      },

      /**
       * Array of handlers
       * @type     {object[]}
       * @private
       */
      pvtListeners: [ ]
    };

    /**
     * @event  Fired when the value is valid
     */
    this.valid = {
      /**
       * Subscribes a function to the event
       * @return   {void}
       * @param    {function} handler
       * @param    {object} scope
       */
      listen: function(handler, scope) {
        if (typeof(handler) === 'function') {
          this.pvtListeners.push({fn: handler, scope: scope});
        }
        return;
      },

      /**
       * Fires the event, invoking the listeners
       * @return   {void}
       */
      trigger: function() {
        var args = [].slice.call(arguments, 0), count = this.pvtListeners.length, index, listener;
        if (count > 0) {
          for (index = count; index > 0; index -= 1) {
            listener = this.pvtListeners[index - 1];
            if (listener && listener.fn && listener.fn.call) {
              listener.fn.call((listener.scope || window), args);
            }
          }
        }
        return;
      },

      /**
       * Array of handlers
       * @type     {object[]}
       * @private
       */
      pvtListeners: []
    };

    /**
     * Adds an event listener.
     * @return   {void}
     * @param    {HTMLElement} node
     * @param    {string} type
     * @param    {function} handler
     * @private
     */
    function listen(node, type, handler) {
      var func = function(e) {
          return handler.call(pvtThis, listenTo(e, node));
        };
      if (node && type && handler) {
        if (node.addEventListener) {
          node.addEventListener(type, func, false);
        } else if (node.attachEvent) {
          node.attachEvent('on' + type, func);
        }
      }
      return;
    }

    /**
     * Resolves an event
     * @return   {void}
     * @param    {event} evt
     * @param    {HTMLElement} node
     * @private
     */
    function listenTo(evt, node) {
      var ev = evt || window.event, invoker;
      if (!ev) {
        invoker = listenTo.caller;
        while (invoker) {
          ev = invoker.arguments[0];
          if (ev && Event == ev.constructor) {
            break;
          }
          invoker = invoker.caller;
        }
      }
      return ev;
    }

    /**
     * Handle the blur event of the input. This method has one (undocumented) argument, the event that calls it.
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function onBlur(evt) {
      var index
        , isValid = true
      ;

      function gtm(max, val) {
        if (max) {
          if (val > max) {
            return true;
          }
        }
        return false;
      }
      function ltm(min, val) {
        if (min) {
          if (val < min) {
            return true;
          }
        }
        return false;
      }

      if (pvtThis.element && pvtThis.element.value !== '') {
        // we have a value - do a valid format test if one is specified
        if (pvtConfig.type) {
          if (!pvtConfig.type.complete.test(pvtThis.element.value)) {
            pvtThis.removeClass('validated');
            pvtThis.removeClass('invalid');
            pvtThis.element.className += ' invalid';
            isValid = false;
            if (this.invalid) {
              this.invalid.trigger();
            }
          }
          if (pvtConfig.type.max || pvtConfig.type.min) {
            // a bounds test is specified
            if ( !isNaN(pvtThis.element.value) && 
                 ( gtm(pvtConfig.type.max, pvtThis.element.value) || 
                   ltm(pvtConfig.type.min, pvtThis.element.value) ) ) {
              pvtThis.removeClass('validated');
              pvtThis.removeClass('invalid');
              pvtThis.element.className += ' invalid';
              isValid = false;
              if (this.invalid) {
                this.invalid.trigger();
              }
            }
          }
          if (pvtBlur) {
            // a user-defined onblur test is specified
            for (index = pvtBlur.length - 1; index > -1; index -= 1) {
              if (!pvtBlur[index].apply(this, [pvtThis.element.value])) {
                pvtThis.removeClass('validated');
                pvtThis.removeClass('invalid');
                pvtThis.element.className += ' invalid';
                isValid = false;
                if (this.invalid) {
                  this.invalid.trigger();
                  break;
                }
              }
            }
          }
        }
      } else if (pvtConfig.required) {
        // Required and missing
        pvtThis.removeClass('validated');
        pvtThis.removeClass('invalid');
        pvtThis.removeClass('missing');
        pvtThis.element.className += ' missing';
        isValid = false;
        if (this.missing) {
          this.missing.trigger();
        }
      }

      if (isValid) {
        if (pvtThis.element) {
          pvtThis.removeClass('validated');
          pvtThis.removeClass('invalid');
          pvtThis.removeClass('missing');
          pvtThis.element.className += ' validated';
        }
        if (this.valid) {
          this.valid.trigger();
        }
      }
      return;
    }

    /**
     * Handle the event
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function onFocus(evt) {
      if (pvtThis.element) {
        pvtThis.removeClass('validated');
        pvtThis.removeClass('invalid');
      }
      return;
    }

    /**
     * Handle the event
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function onChange(evt) {
      if (pvtThis.element) {
        pvtThis.removeClass('validated');
        pvtThis.removeClass('invalid');
      }
      return;
    }

    /**
     * @private
     * Handle the event
     * @return   {void}
     *
     * @param    {event} evt
     */
    function onKeyPress(evt) {
      var key
        , stopped = false
        , str
        , target
        , val
      ;

      // normalize the event
      evt = evt || window.event;
      key = evt.charCode || evt.keyCode;
      str = String.fromCharCode(key);
      target = evt.target || evt.srcElement;

      if ( target.selectionStart !== undefined &&
           target.selectionEnd !== undefined ) {
        // most JS engines should have these set as the insertion point
        // substitute the key passed in the value
        val = target.value.substr(0, target.selectionStart) + 
              str + 
              target.value.substr(target.selectionEnd);
      } else {
        // backward compatible failover
        val = target.value + str;
      }

      if ( evt.which !== 0 && 
           evt.which !== 8 && 
           evt.which !== 9 && 
           !evt.altKey && 
           !evt.ctrlKey ) {
        // not a special key and not BACKSPACE and not a TAB
        if (pvtConfig && pvtConfig.type) {
          if (!pvtConfig.type.key.test(str)) {
            // invalid key pressed
            stopped = true;
            stopEvent(evt);
          } else if (pvtConfig.type.restricted) {
            // input is restricted to completed values only
            if (!pvtConfig.type.complete.test(val)) {
              stopped = true;
              stopEvent(evt);
            }
          }
        }
        if (!stopped) {
          pvtThis.removeClass('validated');
          pvtThis.removeClass('invalid');
          pvtThis.removeClass('missing');
        }
      }
      return;
    }

    /**
     * Stops the specified event
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function stopEvent(evt) {
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
      return;
    }

    /**
     * CONSTRUCTOR
     */
    var pvtBlur = validators
      , pvtConfig = { required:required, type:type }
      , pvtThis = this
    ;

    if (pvtThis.element && pvtThis.element.nodeType === 1) {
      listen(pvtThis.element, 'blur', onBlur);
      listen(pvtThis.element, 'focus', onFocus);
      listen(pvtThis.element, 'change', onChange);
      listen(pvtThis.element, 'keypress', onKeyPress);
    } else {
      pvtThis.element = null;
    }
  };

  return Cathmhaol;
}));
