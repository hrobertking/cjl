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
   * Shared validation methods
   *
   * @author    Robert King (hrobertking@cathmhaol.com)
   *
   * @version   1.0
   */
  Cathmhaol.Validation = {
    /**
     * Validation types
     */
    Types: {
      ALPHA: {
        /**
         * Valid individual keypress - alpha keys only
         * @type     {RegExp}
         */
        key: new RegExp('[a-z\\u00A1-\\uFFFF]', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('(([a-z\\u00A1-\\uFFFF])+\b)+', 'i')
      },
      CREDIT_CARD: {
        /**
         * Valid individual keypress
         * @type     {RegExp}
         */
        key: new RegExp('\\d', 'i'),  // digits

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('\\d{12,19}', 'i'),

        /**
         * Types of credit cards. Each type has a 'bin' (Bank Issuer Number)
         * pattern, a 'csc' (Card Security Code length, an array of valid
         * account number 'lengths', and whether or not it uses the LUHN
         * algorithm for 'validation'
         */
        types: {
          /**
           * American Express
           */
          AMEX: {
            bin: /^3(4|7)/,   // Issuer number regex
            csc: 4,           // CSV length
            lengths: [15],    // Valid lengths for a card number
            validation: true  // Uses the Luhn algorithm
          },
          /*
           * Bancomer branded Visa
          BANCOMER: {
            bin: /^4(1018(0|1)|18(073|075|080|090)|41311|44085|55(500|501|503|504|505|508|513|525|526|527|529|540|545)|93(160|161|162)|94398)/,
            csc: 3,
            lengths: [12,13,14,15,16],
            validation: true
          },
           */
          /**
           * China Union Pay
           */
          CHINA_UNION_PAY: {
            bin: /^62([0-1]\d|2(0\d|1[0-1]\d|12[0-5])|(292[6-9]|29[3-9]\d|[3-9]\d))/,
            csc: 3,
            lengths: [16,17,18,19],
            validation: false
          },
          /**
           * Discover card
           */
          DISCOVER: {
            bin: /^6(011|2212(6|7|8|9)|221(3-9)|22[2-8]|229[0-1]|2292[0-5]|4[4-9]|5)/,
            csc: 3,
            lengths: [16],
            validation: true
          },
          /**
           * Visa debit
           */
          ELECTRON: {
            bin: /^(4026|417500|4508|4844|4913|4917)/,
            csc: 3,
            lengths: [16],
            validation: true
          },
          /**
           * Japan Credit Bureau
           */
          JCB: {
            bin: /^35(2[8-9]|[3-8])/,
            csc: 3,
            lengths: [16],
            validation: true
          },
          /**
           * Ceased 28-Feb-14. Irish debit card, replaced by Visa and Mastercard
          LASER: {
            bin: /^6(304|706|709|771)/,
            csc: 3,
            lengths: [12,13,14,15,16],
            validation: true
          },
           */
          /**
           * Mastercard debit
           */
          MAESTRO: {
            bin: /^(50(18|20|38)|6304|67(59|6[1-3])|0604)/,
            csc: 3,
            lengths: [12,13,14,15,16,17,18,19],
            validation: true
          },
          /**
           * Mastercard
           */
          MASTERCARD: {
            bin: /^5[1-5]/,
            csc: 3,
            lengths: [16],
            validation: true
          },
          /**
           * Cease 31-Mar-11. UK debit card companion to Switch
          SOLO: {
            bin: /6334[5-9]/,
            csc: 3,
            lengths: [16],
            validation: true
          },
           */
          /**
           * Visa
           */
          VISA: {
            bin: /^40([0-1]|2[0-5]|2[7-9]|[3-9])|41([0-6]|7[0-4])|41(75(0[1-9]|[1-9])|7[6-9]|[8-9])|4[2-4]|450[0-7]|4509|45[1-9]|4[6-7]|48[0-3]|484[0-3]|484[5-9]|48[5-9]|490|491[0-2]|491[4-6]|491[8-9]|49[2-9]/,
            csc: 3,
            lengths: [16],
            validation: true
          },

          /**
           * Looks up a type based on an account number
           * @return   {Cathmhaol.CreditCard.Type}
           * @param    {string} str
           */
          lookup: function(str) {
            var key
              , card_type
            ;

            // do an IIN lookup if the lookup key is a number;
            // otherwise, lookup by name
            if ((/\d{1,}/).test(str)) {
              for (key in this) {
                // ignore functions and inherited properties
                if ( this.hasOwnProperty(key) &&
                     typeof(this[key]) !== 'function' ) {
                  if (this[key].bin.test(str)) {
                    card_type = this[key];
                    card_type.name = key;
                    break;
                  }
                }
              }
            } else {
              card_type = this[str];
            }
            return card_type;
          },

          /**
           * Returns a comma-separated string containing all types
           * @return   {string}
           */
          toString: function() {
            var key
              , card_types = [ ]
            ;

            for (key in this) {
              // ignore functions and inherited properties
              if ( this.hasOwnProperty(key) &&
                   typeof(this[key]) !== 'function') {
                card_types.push(key);
              }
            }
            return card_types.join(',');
          }
        }
      },
      DAY: {
        /**
         * Valid individual keypress - digits only
         * @type     {RegExp}
         */
        key: new RegExp('\\d', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^(0[1-9]?|[1-9]|(1|2)[0-9]|3(0|1))$', 'i'),

        /**
         * Maximum valid value
         * @type     {RegExp}
         */
        max: 31,

        /**
         * Minimum valid value
         * @type     {RegExp}
         */
        min: 1,

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      },
      EMAIL: {
        /**
         * Valid individual keypress - alpha, digits, any of 
         * !#$%&'*+-/=?^_`{|}~><. Space and (),:;[\] are allowed by RFC 5322,
         * but disallowed by this type
         * @type     {RegExp}
         */
        key: new RegExp('[\\w\\!\\#\\$\\%\\&\\x27\\"\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~\\.\\@\\>\\<]', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('[\\w\\!\\#\\$\\%\\&\\x27\\"\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~\\.\\>\\<]+\\@((([a-z0-9]+\\-?)+\\.)+([a-z0-9]+))', 'i')
      },
      IBAN: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('[a-z\\d\\s]', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^([a-z]{2})\\s*(\\d{2})\\s*([a-z\\d\\s]{1,30})$', 'i'),

        /**
         * Special validation function. Returns an object that contains two properties: 'status' and 'message'.
         * @return   {object}
         * @param    {string} value
         */
        validator: function(value) {
           var bites = this.completed.exec(value)
             , hashed = bites && bites.length > 3 ?
                          (bites[3] + bites[1] + bites[2]).replace(/\s*/g, '') : 
                          value
             , indx = ''
             , len
             , result = { status:null, message:'' }
           ;

           // replace letters with numeric constants
           function normalize(str) {
             var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
               , ndx
               , offset = 10
             ;
             for (ndx = 0; ndx < letters.length; ndx += 1) {
               str = str.replace(new RegExp(letters[ndx], 'gi'), offset + ndx);
             }
             return str;
           }

           if (!bites) {
             result.status = false;
             result.message = 'Format invalid';
             if ((/[\W\_]+/).test(value)) {
               result.message = 'Invalid characters in account number';
             } else if (!(/^[a-z]{2}/i).test(value)) {
               result.message = 'Missing country code';
             } else if (!(/^[a-z]{2}\s*\d{2}/i).test(value)) {
               result.message = 'Missing check digits';
             }
           } else {
             // Convert alpha to number
             hashed = normalized(hashed);
         
             // This could be a 38-digit number, so we have to do the MOD-97-10
             // validation (ISO/IEC 7064:2003) in chunks
             while (hashed.length > 0 && !isNaN(hashed) && !isNaN(indx)) {
               indx = (indx !== '' && indx < 10 ? '0' : '') + indx;
               len = 9 - indx.length;
               indx = ((indx + hashed.substr(0, len)) % 97).toString();
               hashed = hashed.slice(len);
             }
             result.status = !(isNaN(indx) || isNaN(hashed) || (indx * 1) !== 1);
             if (!result.status) {
               result.message = 'Validation failed';
             }
           }
           return result;
        }
      },
      INTEGER: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('\\d+', 'i')
      },
      HEX: {
        /**
         * Valid individual keypress - digits and A through F
         * @type     {RegExp}
         */
        key: new RegExp('[0-9A-F]', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('[0-9A-F]+', 'i')
      },
      FLOAT: {
        /**
         * Valid individual keypress - digits, decimal, or comma
         * @type     {RegExp}
         */
        key: new RegExp('([0-9]|\\.|\\,)', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('[\\.\\,]?\\d+|\\d+[\\.\\,]?\\d*', 'i')
      },
      MONTH: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^(0[1-9]?|[1-9]|1[0-2])$', 'i'),

        /**
         * Maximum valid value
         * @type     {RegExp}
         */
        max: 12,

        /**
         * Minimum valid value
         * @type     {RegExp}
         */
        min: 1,

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      },
      NAME: {
        /**
         * Valid individual keypress - alpha key, unicode characters, comma, hyphen, space, or single quote
         * @type     {RegExp}
         */
        key: new RegExp('[a-z\\u00A1-\\uFFFF\\,\\-\\s\\x27]', 'i'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('[a-z\\u00A1-\\uFFFF\\,\\-\\s\\x27]+', 'i')
      },
      SIGNED: {
        /**
         * Valid individual keypress - digits, decimal, comma, and + or -
         * @type     {RegExp}
         */
        key: new RegExp('[\\+\\-\\.\\,\\d]'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('(\\+|\\-)?(\\.|\\,)?(\\d(\\.|\\,)?)+', 'i')
      },
      TIME: {
        /**
         * Valid individual keypress - digits or colon
         * @type     {RegExp}
         */
        key: new RegExp('[\\d\\:]'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('(\\d{1}|[0-1]\\d|2[0-4])\\:[0-5]\\d(\\:[0-5]\\d)?', 'i')
      },
      YEAR_FUTURE: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^20'+(((new Date).getFullYear() % 100) < 10) ? '0[' + (((new Date).getFullYear() % 10) + '-9]?|[1-9]\\d?') : (((new Date).getFullYear() % 100) < 20) ? '1[' + (((new Date).getFullYear() % 10) + '-9]?|[2-9]\\d?') : (((new Date).getFullYear() % 100) < 30) ? '2[' + (((new Date).getFullYear() % 10) + '-9]?|[3-9]\\d?') : (((new Date).getFullYear() % 100) < 40) ? '3[' + (((new Date).getFullYear() % 10) + '-9]?|[4-9]\\d?') : (((new Date).getFullYear() % 100) < 50) ? '4[' + (((new Date).getFullYear() % 10) + '-9]?|[5-9]\\d?') : (((new Date).getFullYear() % 100) < 60) ? '5[' + (((new Date).getFullYear() % 10) + '-9]?|[6-9]\\d?') : (((new Date).getFullYear() % 100) < 70) ? '6[' + (((new Date).getFullYear() % 10) + '-9]?|[7-9]\\d?') : (((new Date).getFullYear() % 100) < 80) ? '7[' + (((new Date).getFullYear() % 10) + '-9]?|[8-9]\\d?') : (((new Date).getFullYear() % 100) < 90) ? '8[' + (((new Date).getFullYear() % 10) + '-9]?|9\\d?') : '9[' + (((new Date).getFullYear() % 10) + '-9]?)') + '$', 'i'),

        /**
         * Minimum valid value
         * @type     {RegExp}
         */
        min: ((new Date()).getFullYear() % 100),

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      },
      YEAR_PAST: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^([0-1]\\{1,3}|20?(' + ( (((new Date).getFullYear() % 100) < 10) ? '0[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 20) ? '[0-0]\\d|1[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 30) ? '[0-1]\\d|2[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 40) ? '[0-2]\\d|3[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 50) ? '[0-3]\\d|4[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 60) ? '[0-4]\\d|5[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 70) ? '[0-5]\\d|6[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 80) ? '[0-6]\\d|7[0-' + ((new Date).getFullYear() % 10) + ']' : (((new Date).getFullYear() % 100) < 90) ? '[0-7]\\d|8[0-' + ((new Date).getFullYear() % 10) + ']' : '[0-8]\\d|9[0-' + ((new Date).getFullYear() % 10) + ']' ) + ')?)$', 'i'),

        /**
         * Maximum valid value
         * @type     {RegExp}
         */
        max: (new Date()).getFullYear() - 1,

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      },
      YR_FUTURE: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^('+ ( (((new Date).getFullYear() % 100) < 10) ? '0[' + (((new Date).getFullYear() % 10) + '-9]?|[1-9]\\d?') : (((new Date).getFullYear() % 100) < 20) ? '1[' + (((new Date).getFullYear() % 10) + '-9]?|[2-9]\\d?') : (((new Date).getFullYear() % 100) < 30) ? '2[' + (((new Date).getFullYear() % 10) + '-9]?|[3-9]\\d?') : (((new Date).getFullYear() % 100) < 40) ? '3[' + (((new Date).getFullYear() % 10) + '-9]?|[4-9]\\d?') : (((new Date).getFullYear() % 100) < 50) ? '4[' + (((new Date).getFullYear() % 10) + '-9]?|[5-9]\\d?') : (((new Date).getFullYear() % 100) < 60) ? '5[' + (((new Date).getFullYear() % 10) + '-9]?|[6-9]\\d?') : (((new Date).getFullYear() % 100) < 70) ? '6[' + (((new Date).getFullYear() % 10) + '-9]?|[7-9]\\d?') : (((new Date).getFullYear() % 100) < 80) ? '7[' + (((new Date).getFullYear() % 10) + '-9]?|[8-9]\\d?') : (((new Date).getFullYear() % 100) < 90) ? '8[' + (((new Date).getFullYear() % 10) + '-9]?|9\\d?') : '9[' + (((new Date).getFullYear() % 10) + '-9]?') ) + ')$', 'i'),

        /**
         * Minimum valid value
         * @type     {RegExp}
         */
        min: ((new Date()).getFullYear() % 10),

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      },
      YR_PAST: {
        /**
         * Valid individual keypress - digits
         * @type     {RegExp}
         */
        key: new RegExp('\\d'),

        /**
         * Valid value when complete
         * @type     {RegExp}
         */
        complete: new RegExp('^(' + ( (((new Date).getFullYear() % 100) < 10) ? '0[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 20) ? '0\\d?|1[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 30) ? '[0-1]\\d?|2[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 40) ? '[0-2]\\d?|3[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 50) ? '[0-3]\\d?|4[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 60) ? '[0-4]\\d?|5[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 70) ? '[0-5]\\d?|6[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 80) ? '[0-6]\\d?|7[0-' + ((new Date).getFullYear() % 10) + ']?' : (((new Date).getFullYear() % 100) < 90) ? '[0-7]\\d?|8[0-' + ((new Date).getFullYear() % 10) + ']?' : '[0-8]\\d?|9[0-' + ((new Date).getFullYear() % 10) + ']?' ) + ')$', 'i'),

        /**
         * Maximum valid value
         * @type     {RegExp}
         */
        max: (new Date()).getFullYear() - 1,

        /**
         * Input is restricted to 'complete' values only
         * @type     {RegExp}
         */
        restricted: true
      }
    }
  };

  return Cathmhaol;
}));
