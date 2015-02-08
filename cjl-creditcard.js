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
   * Credit card validation object
   *
   * @param     {string|HTMLElement} acct
   * @param     {string|HTMLElement} mm
   * @param     {string|HTMLElement} yy
   * @param     {string|HTMLElement} csc
   * @param     {string|HTMLElement} type
   *
   * @requires  Cathmhaol.Validation
   *
   * @author    Robert King (hrobertking@cathmhaol.com)
   *
   * @version   1.1  Added type
   * @version   1.0
   */
  Cathmhaol.CreditCard = function(acct, mm, yy, csc, type) {
    /**
     * Card type
     * @type     {string}
     */
    this.type = null;

    /**
     * Returns the account number
     * @return   {string}
     */
    this.getAccount = function() {
      return pHtmAcct.element.value;
    };

    /**
     * Returns the card security code
     * @return   {string}
     */
    this.getCVV2 = function() {
      return pHtmCSC.element.value;
    };

    /**
     * Returns the expiration date
     * @return   {string}
     */
    this.getExpiry = function() {
      return pDatExpiry.toString();
    };

    /**
     * @event  Fired when the account number is invalid
     */
    this.acct = {
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
     * @event  Fired when the CVV is invalid
     */
    this.cvv = {
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
     * @event  Fired when the card is expired
     */
    this.expired = {
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
     * @event  Fired when the type changes
     */
    this.typeChanged = {
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
     * Adds an event listener.
     * @return   {void}
     * @param    {HTMLElement} node
     * @param    {string} type
     * @param    {function} handler
     * @private
     */
    function addListener(node, type, handler) {
      if (node && type && handler) {
        if (node.addEventListener) {
          node.addEventListener(type, handler, false);
        } else if (node.attachEvent) {
          node.attachEvent('on' + type, handler);
        }
      }
      return;
    }

    /**
     * Handle the blur event of the month and year inputs
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function onBlur_Expiry(evt) {
      if (validationExpired()) {
        if (pvtThis.expired) {
          pvtThis.expired.trigger();
        }
      }
      return;
    }

    /**
     * Handle the change event for the account
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function onChange_Type(evt) {
      var el = (evt || window.event).target || (evt || window.event).srcElement
        , key = ''
      ;

      switch (el.nodeName.toLowerCase()) {
        case 'select':
          if (pHtmType.selectedIndex > -1) {
            key = pHtmType.options[pHtmType.selectedIndex].value;
            if ((key || '') === '') {
              key = pHtmType.options[pHtmType.selectedIndex].text;
            }
          }
          break;
        case 'img':
          key = el.alt;
          if ((key || '') === '') {
            key = el.title;
          }
          break;
        default:
          break;
      }
      if ((key || '') !== '') {
        pObjValid = Cathmhaol.Validation.Types.CREDIT_CARD.types.lookup(key);
      }
      setType();
    }

    /**
     * Sets the type
     * @return   {void}
     * @private
     */
    function setType() {
      if (pObjValid) {
        if ((pObjValid.name || '') !== '') {
          pvtThis.type = pObjValid.name;
          if (pvtThis.typeChanged) {
            pvtThis.typeChanged.trigger();
          }
        }
      }
      return;
    }

    /**
     * Sets the validation type
     * @return   {void}
     * @param    {event} evt
     * @private
     */
    function validationConfigure(evt) {
      if (pHtmAcct.element) {
        pObjValid = Cathmhaol.Validation.Types.CREDIT_CARD.types.lookup(pHtmAcct.element.value);
        if (pObjValid) {
          pObjValid.lengths.sort();
          pHtmAcct.element.maxLength = pObjValid.lengths[pObjValid.lengths.length - 1];
          pHtmCSC.element.maxLength = pObjValid.csc;
        }
      }
      validationSelectType();
      return;
    }

    /**
     * Validates the card security code
     * @return   {boolean}
     * @param    {string} csc
     * @private
     */
    function validationCSC(csc) {
      csc = csc || pHtmCSC.element.value;
      return pObjValid ?
              (!(isNaN(csc) || (csc.length !== pObjValid.csc))) :
               true;
    }

    /**
     * Checks the provided month/year and returns true if it's valid, false
     * if it's expired. If the fireEvent argument is true, the related event
     * is fired.
     * @return   {boolean}
     * @private
     */
    function validationExpired() {
      var expired = false
        , mm = Math.floor(parseFloat(pHtmMonth.element.value))
        , yy = Math.floor(parseFloat(pHtmYear.element.value)) +
              (Math.floor(pDatNow.getFullYear()/100)*100)
      ;

      pHtmMonth.removeClass('expired');
      pHtmYear.removeClass('expired');
      if (!isNaN(mm) && !isNaN(yy)) {
        /*
         * A card doesn't actually expire until 00:00:00 of the day after the
         * month/year listed. For example, if the month/year is 12/2012, the
         * card doesn't actually expire until 2013-01-01 00:00:00. This makes
         * validation easier because we don't have to worry about a Leap Year
         * calculation we just have to know what the first day of the next month
         * is.
         */
        yy += (mm === 12) ? 1 : 0;
        mm += (mm === 12) ? -12 : 0;
        pDatExpiry = new Date( yy, mm, 1, 0, 0, 0 );
        expired = !(pDatExpiry.getTime() > pDatNow.getTime());
      }
      if (expired) {
        pHtmMonth.addClass('expired');
        pHtmYear.addClass('expired');
      }
      return expired;
    }

    /**
     * Returns a boolean indicating whether or not the length is valid
     * @return   {boolean}
     * @param    {string} acct
     * @private
     */
    function validationLength(acct) {
      var index
        , isOk = false
      ;

      acct = acct || pHtmAcct.element.value;
      if (pObjValid) {
        for (index = pObjValid.lengths.length - 1; index > -1; index -= 1) {
          if (acct.length === pObjValid.lengths[index]) {
            isOk = true;
            break;
          }
        }
      }
      return isOk;
    }

    /**
     * Returns true if the Luhn algorithm check passed
     * @return   {boolean}
     * @param    {string} acct
     * @private
     */
    function validationLuhn(acct) {
      var check = 0
        , index
        , prod = 0
      ;

      acct = (acct || pHtmAcct.element.value).split('');
      if (pObjValid.validation) {
        for (index = 0; index < acct.length; index += 1) {
          prod = (Math.floor(parseFloat(acct[index])) * 
                 (index % 2 === 0 ? 2 : 1));
          prod -= (prod > 9 ? 9 : 0);
          check += prod;
        }
      }
      return (check % 10 === 0);
    }

    /**
     * Selects the type
     * @return   {void}
     * @private
     */
    function validationSelectType() {
      var index
        , opts = pHtmType && pHtmType.options ? pHtmType.options : null
      ;

      if (opts && opts.length > 0) {
        for (index = opts.length - 1; index > -1; index -= 1) {
          opts[index].selected = false;
        }
        for (index = opts.length - 1; index > -1; index -= 1) {
          if (opts[index].value === name) {
            opts[index].selected = true;
            break;
          }
        }
      } else {
        setType();
      }
      return;
    }

    // Constructor
    var pBlnConfig = false
      , pDatNow = new Date()
      , pDatExpiry = new Date(pDatNow.getTime() - (1000 * 60 * 60 * 24))
      , pvtThis = this
      , pHtmAcct = new Cathmhaol.Validator( acct
                                          , true
                                          , Cathmhaol.Validation.Types.INTEGER
                                          , [validationLuhn
                                          , validationLength] )
      , pHtmCSC = new Cathmhaol.Validator( csc
                                         , true
                                         , Cathmhaol.Validation.Types.INTEGER
                                         , [validationCSC] )
      , pHtmMonth = new Cathmhaol.Validator( mm
                                           , true
                                           , Cathmhaol.Validation.Types.MONTH )
      , pHtmYear = new Cathmhaol.Validator( yy
                                          , true
                                          , Cathmhaol.Validation.Types.YR_FUTURE )
      , pHtmType = typeof(type) === 'string' ?
                     document.getElementById(type) :
                     type
      , pObjValid = { csc: 3
                    , lengths: []
                    , name:null
                    , validation: true }
    ;

    if (pHtmAcct) {
      pHtmAcct.invalid.listen(function() {
          if (this.acct) {
            this.acct.trigger();
          }
        }, pvtThis);
    }
    if (pHtmCSC) {
      pHtmCSC.invalid.listen(function() {
          if (this.cvv) {
            this.cvv.trigger();
          }
        }, pvtThis);
    }

    // Assign the event handlers to the HTMLElements
    if (pHtmAcct && pHtmAcct.element) {
      addListener(pHtmAcct.element, 'keypress', function(e) {
                    validationConfigure.apply(pvtThis, [e]);
                  });
    }
    if (pHtmType) {
      addListener(pHtmType, 'change', function(e) {
                    onChange_Type.apply(pvtThis, [e]);
                  });
    }
    if (pHtmMonth && pHtmMonth.element) {
      addListener(pHtmMonth.element, 'blur', function(e) {
                    onBlur_Expiry.apply(pvtThis, [e]);
                  });
    }
    if (pHtmYear && pHtmYear.element) {
      addListener(pHtmYear.element, 'blur', function(e) {
                    onBlur_Expiry.apply(pvtThis, [e]);
                  });
    }

    // If everything has gone OK, set the configured flag
    if (pHtmAcct && pHtmCSC && pHtmMonth && pHtmYear) {
      pBlnConfig = true;
    }
  };

  return Cathmhaol;
}));
