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
   * Extends the functionality offered in the Date object
   *
   * @author	Robert King (hrobertking@cathmhaol.com)
   *
   * @example	var sShortDayName = Cathmhaol.Calendar.DAYS['en'][Cathmhaol.Calendar.SUNDAY].shortName
   */
  Cathmhaol.Calendar = {
    /**
     * Hash of day names that uses an ISO 639-1 code as a key. Each language code property contains an array of objects, each element of which contains a longName and shortName for the day. Sunday is element 0, Saturday is element 6.
     * @type     {object}
     */
    DAYS: {
      'da':[
             { longName:'s&#248;ndag', shortName:'s&#248;n' },
             { longName:'mandag', shortName:'man' },
             { longName:'tirsdag', shortName:'tirs' },
             { longName:'onsdag', shortName:'ons' },
             { longName:'torsdag', shortName:'tors' },
             { longName:'fredag', shortName:'fre' },
             { longName:'l&#248;rdag', shortName:'l&#248;r'}
           ],
      'de':[
             { longName:'Sonntag', shortName:'So' },
             { longName:'Montag', shortName:'Mo' },
             { longName:'Dienstag', shortName:'Di' },
             { longName:'Mittwoch', shortName:'Mi' },
             { longName:'Donnerstag', shortName:'Do' },
             { longName:'Freitag', shortName:'Fr' },
             { longName:'Samstag', shortName:'Sa'}
           ],
      'en':[
             { longName:'Sunday', shortName:'Sun' },
             { longName:'Monday', shortName:'Mon' },
             { longName:'Tuesday', shortName:'Tue' },
             { longName:'Wednesday', shortName:'Wed' },
             { longName:'Thursday', shortName:'Thu' },
             { longName:'Friday', shortName:'Fri' },
             { longName:'Saturday', shortName:'Sat'}
           ],
      'es':[
             { longName:'domingo', shortName:'dom' },
             { longName:'lunes', shortName:'lun' },
             { longName:'martes', shortName:'mar' },
             { longName:'mi&#233;rcoles', shortName:'mi&#233;' },
             { longName:'jueves', shortName:'jue' },
             { longName:'viernes', shortName:'vie' },
             { longName:'s&#225;bado', shortName:'s&#225;b'}
           ],
      'fi':[
             { longName:'sunnuntai', shortName:'su' },
             { longName:'maanantai', shortName:'ma' },
             { longName:'tiistai', shortName:'ti' },
             { longName:'keskiviiko', shortName:'ke' },
             { longName:'torstai', shortName:'to' },
             { longName:'perjantai', shortName:'pe' },
             { longName:'lauantai', shortName:'la'}
           ],
      'fr':[
             { longName:'dimanche', shortName:'dim' },
             { longName:'lundi', shortName:'lun' },
             { longName:'mardi', shortName:'mar' },
             { longName:'mercredi', shortName:'mer' },
             { longName:'jeudi', shortName:'jeu' },
             { longName:'vendredi', shortName:'ven' },
             { longName:'samedi', shortName:'sam'}
           ],
      'ga':[
             { longName:'D&#233; Domhnaigh', shortName:'Dom' },
             { longName:'D&#233; Luain', shortName:'Lua' },
             { longName:'D&#233; M&#225;irt', shortName:'M&#225;i' },
             { longName:'D&#233; Ch&#233;adaoin', shortName:'Ch&#233;' },
             { longName:'D&#233;ardaoin', shortName:'Dao' },
             { longName:'D&#233; hAoine', shortName:'Aoi' },
             { longName:'D&#233; Sathairn', shortName:'Sat'}
           ],
      'hu':[
             { longName:'vas&#225;map', shortName:'vas' },
             { longName:'h&#233;tf&#246;', shortName:'h&#233;' },
             { longName:'kedd', shortName:'ked' },
             { longName:'szerda', shortName:'sze' },
             { longName:'cs&#252;t&#246;rt&#246;k', shortName:'cs&#252' },
             { longName:'p&#233;ntek', shortName:'p&#233;n' },
             { longName:'szombat', shortName:'szo'}
           ],
      'it':[
             { longName:'domenica', shortName:'dom' },
             { longName:'lunedì', shortName:'lun' },
             { longName:'martedì', shortName:'mar' },
             { longName:'mercoledì', shortName:'mer' },
             { longName:'giovedì', shortName:'gio' },
             { longName:'venerdì', shortName:'ven' },
             { longName:'sabato', shortName:'sab'}
           ],
      'nl':[
             { longName:'zondag', shortName:'zondag' },
             { longName:'maandag', shortName:'maan-' },
             { longName:'dinsdag', shortName:'dins-' },
             { longName:'woensdag', shortName:'woens-' },
             { longName:'donderdag', shortName:'donder-' },
             { longName:'vrijdag', shortName:'vrij-' },
             { longName:'zaterdag', shortName:'zat-'}
           ],
      'pl':[
             { longName:'niedziela', shortName:'nie' },
             { longName:'poniedzia&#322;ek', shortName:'pon' },
             { longName:'wtorek', shortName:'wto' },
             { longName:'&#347;roda', shortName:'&#347;rd' },
             { longName:'czwartek', shortName:'czw' },
             { longName:'pi&#261;tek', shortName:'pi&#261;' },
             { longName:'sobota', shortName:'sob'}
           ],
      'pt':[
             { longName:'domingo', shortName:'dom' },
             { longName:'segunda-feira', shortName:'seg' },
             { longName:'ter&#231;a-feira', shortName:'ter' },
             { longName:'quarta-feira', shortName:'qua' },
             { longName:'quinta-feira', shortName:'qui' },
             { longName:'sexta-feira', shortName:'sex' },
             { longName:'s&#225;bado', shortName:'s&#225;'}
           ],
      'sv':[
             { longName:'s&#246;ndag', shortName:'s&#246;n' },
             { longName:'m&#229;ndag', shortName:'m&#229;n' },
             { longName:'tisdag', shortName:'tis' },
             { longName:'onsdag', shortName:'ons' },
             { longName:'torsdag', shortName:'tors' },
             { longName:'fredag', shortName:'fre' },
             { longName:'l&#246;rdag', shortName:'l&#246;r'}
           ]
    },

    /**
     * Constant numeric value of Friday
     * @type     {number}
     */
    FRIDAY: 5,

    /**
     * Constant numeric value of Monday
     * @type     {number}
     */
    MONDAY: 1,

    /**
     * Hash of month names that uses an ISO 639-1 code as a key. Each language code property contains an array of objects, each element of which contains a longName and shortName for the day. January is element 0, December is element 11.
     * @type     {object}
     */
    MONTHS: {
      'da':[
             { longName: 'Januar', shortName:'jan' },
             { longName:'Februar', shortName:'feb' },
             { longName:'Marts', shortName:'mar' },
             { longName:'April', shortName:'apr' },
             { longName:'Maj', shortName:'maj' },
             { longName:'Juni', shortName:'jun' },
             { longName:'Juli', shortName:'jul' },
             { longName:'August', shortName:'aug' },
             { longName:'September', shortName:'sep' },
             { longName:'Oktober', shortName:'okt' },
             { longName:'November', shortName:'nov' },
             { longName:'December', shortName:'dec'}
           ],
      'de':[
             { longName: 'Januar', shortName:'Jan' },
             { longName:'Februar', shortName:'Feb' },
             { longName:'M&#228;rz', shortName:'M&#228;rz' },
             { longName:'April', shortName:'Apr' },
             { longName:'Mai', shortName:'Mai' },
             { longName:'Juni', shortName:'Juni' },
             { longName:'Juli', shortName:'Juli' },
             { longName:'August', shortName:'Aug' },
             { longName:'September', shortName:'Sept' },
             { longName:'Oktober', shortName:'Okt' },
             { longName:'November', shortName:'Nov' },
             { longName:'Dezember', shortName:'Dez'}
           ],
      'en':[
             { longName: 'January', shortName:'Jan' },
             { longName:'February', shortName:'Feb' },
             { longName:'March', shortName:'Mar' },
             { longName:'April', shortName:'Apr' },
             { longName:'May', shortName:'May' },
             { longName:'June', shortName:'Jun' },
             { longName:'July', shortName:'Jul' },
             { longName:'August', shortName:'Aug' },
             { longName:'September', shortName:'Sep' },
             { longName:'October', shortName:'Oct' },
             { longName:'November', shortName:'Nov' },
             { longName:'December', shortName:'Dec'}
           ],
      'es':[
             { longName: 'enero', shortName:'ene' },
             { longName:'febrero', shortName:'feb' },
             { longName:'marzo', shortName:'mar' },
             { longName:'abril', shortName:'abr' },
             { longName:'mayo', shortName:'may' },
             { longName:'junio', shortName:'jun' },
             { longName:'julio', shortName:'jul' },
             { longName:'agosto', shortName:'ago' },
             { longName:'septiembre', shortName:'sep' },
             { longName:'octubre', shortName:'oct' },
             { longName:'noviembre', shortName:'nov' },
             { longName:'diciembre', shortName:'dic'}
           ],
      'fi':[
             { longName: 'tammikuu', shortName:'tammik.' },
             { longName:'helmikuu', shortName:'helmik.' },
             { longName:'maaliskuu', shortName:'maalisk.' },
             { longName:'huhtikuu', shortName:'huhtik.' },
             { longName:'toukokuu', shortName:'toukok.' },
             { longName:'kes&#228;kuu', shortName:'kes&#228;k.' },
             { longName:'hein&#228;kuu', shortName:'hein&#228;k.' },
             { longName:'elokuu', shortName:'elok.' },
             { longName:'syyskuu', shortName:'syysk.' },
             { longName:'lokakuu', shortName:'lokak.' },
             { longName:'marraskuu', shortName:'marrask.' },
             { longName:'joulukuu', shortName:'jouluk.'}
           ],
      'fr':[
             { longName: 'janvier', shortName:'janv' },
             { longName:'f&#232;vrier', shortName:'f&#232;vr' },
             { longName:'mars', shortName:'mars' },
             { longName:'avril', shortName:'avril' },
             { longName:'mai', shortName:'mai' },
             { longName:'juin', shortName:'juin' },
             { longName:'juillet', shortName:'juil' },
             { longName:'ao&#251;t', shortName:'ao&#251;t' },
             { longName:'septembre', shortName:'sept' },
             { longName:'octobre', shortName:'oct' },
             { longName:'novembre', shortName:'nov' },
             { longName:'d&#232;cembre', shortName:'d&#232;c'}
           ],
      'ga':[
             { longName: 'M&#237; Eanair', shortName:'Ean' },
             { longName:'M&#237; Feabhra', shortName:'Fea' },
             { longName:'M&#237; M&#225;rta', shortName:'Mar' },
             { longName:'M&#237; Aibre&#225;n', shortName:'Aib' },
             { longName:'M&#237; Bealtaine', shortName:'Bea' },
             { longName:'M&#237; Meitheamh', shortName:'Mei' },
             { longName:'M&#237; I&#250;il', shortName:'I&#250;l' },
             { longName:'M&#237; L&#250;nasa', shortName:'L&#250;n' },
             { longName:'M&#237; Me&#225;n Fomhair', shortName:'Mfo' },
             { longName:'M&#237; Deireadh Fomhair', shortName:'Dfo' },
             { longName:'M&#237; na Samhna', shortName:'Sam' },
             { longName:'M&#237; na Nollag', shortName:'Nol'}
           ],
      'hu':[
             { longName: 'janu&#225;r', shortName:'jan' },
             { longName:'febru&#225;r', shortName:'feb' },
             { longName:'m&#225;rcius', shortName:'m&#255;' },
             { longName:'&#225;prilis', shortName:'&#255;pr' },
             { longName:'m&#225;jus', shortName:'m&#255;j' },
             { longName:'j&#250;nius', shortName:'j&#250;n' },
             { longName:'j&#250;lius', shortName:'j&#250;l' },
             { longName:'augusztus', shortName:'aug' },
             { longName:'szeptember', shortName:'sep' },
             { longName:'okt&#243;ber', shortName:'okt' },
             { longName:'november', shortName:'nov' },
             { longName:'december', shortName:'dec'}
           ],
      'it':[
             { longName: 'gennaio', shortName:'gen' },
             { longName:'febbraio', shortName:'feb' },
             { longName:'marzo', shortName:'mar' },
             { longName:'aprile', shortName:'apr' },
             { longName:'maggio', shortName:'mag' },
             { longName:'giugno', shortName:'giu' },
             { longName:'luglio', shortName:'lug' },
             { longName:'agosto', shortName:'ago' },
             { longName:'settembre', shortName:'sett' },
             { longName:'ottobre', shortName:'ott' },
             { longName:'novembre', shortName:'nov' },
             { longName:'dicembre', shortName:'dic'}
           ],
      'nl':[
             { longName: 'januari', shortName:'jan' },
             { longName:'februari', shortName:'feb' },
             { longName:'mart', shortName:'mrt' },
             { longName:'april', shortName:'apr' },
             { longName:'mei', shortName:'mei' },
             { longName:'juni', shortName:'jun' },
             { longName:'juli', shortName:'jul' },
             { longName:'augustus', shortName:'aug' },
             { longName:'september', shortName:'sep' },
             { longName:'oktober', shortName:'okt' },
             { longName:'november', shortName:'nov' },
             { longName:'december', shortName:'dec'}
           ],
      'pl':[
             { longName: 'stycze&#324;', shortName:'sty' },
             { longName:'luty', shortName:'luty' },
             { longName:'marzec', shortName:'mar' },
             { longName:'kwiecie&#324;', shortName:'kwi' },
             { longName:'maj', shortName:'maj' },
             { longName:'czerwiec', shortName:'cze' },
             { longName:'lipiec', shortName:'lip' },
             { longName:'sierpie&#324;', shortName:'sier' },
             { longName:'wrzesie&#324;', shortName:'wrze' },
             { longName:'pa&#378;dziernik', shortName:'pa&#378;' },
             { longName:'listopad', shortName:'list' },
             { longName:'grudzie&#324;', shortName:'gru'}
           ],
      'pt':[
             { longName: 'janeiro', shortName:'jan' },
             { longName:'fevereiro', shortName:'fev' },
             { longName:'mar&#231;o', shortName:'mar' },
             { longName:'abril', shortName:'abr' },
             { longName:'maio', shortName:'mai' },
             { longName:'junho', shortName:'jun' },
             { longName:'julho', shortName:'jul' },
             { longName:'agosto', shortName:'ago' },
             { longName:'setembro', shortName:'set' },
             { longName:'outubro', shortName:'out' },
             { longName:'novembro', shortName:'nov' },
             { longName:'dezembro', shortName:'dez'}
           ],
      'sv':[
             { longName: 'januari', shortName:'jan' },
             { longName:'februari', shortName:'febr' },
             { longName:'mars', shortName:'mars' },
             { longName:'april', shortName:'april' },
             { longName:'maj', shortName:'maj' },
             { longName:'juni', shortName:'juni' },
             { longName:'juli', shortName:'juli' },
             { longName:'augusti', shortName:'aug' },
             { longName:'september', shortName:'sept' },
             { longName:'october', shortName:'okt' },
             { longName:'november', shortName:'nov' },
             { longName:'december', shortName:'dec'}
           ]
    },

    /**
     * An enumeration of periods
     * @type     {object}
     */
    PERIOD: {
      DAY: {code: 'd', abbreviation:'dy', name:'day' },
      HOUR: {code: 'h', abbreviation:'hr', name:'hour' },
      MINUTE: {code: 'n', abbreviation:'min', name:'minute' },
      MONTH: {code: 'm', abbreviation:'mo', name:'month' },
      QUARTER: {code: 'q', abbreviation:'qt', name:'quarter' },
      SECOND: {code: 's', abbreviation:'sec', name:'second' },
      WEEK: {code: 'w', abbreviation:'wk', name:'week' },
      YEAR: {code: 'y', abbreviation:'yr', name:'year' },
      normalize: function(s) {
        var obj;

        if (typeof s === 'string') {
          if ((/^da?y?$/i).test(s)) {
            obj = this.DAY;
          } else if ((/^h(ou)?r?$/i).test(s)) {
            obj = this.HOUR;
          } else if ((/^(min|n|minute)$/i).test(s)) {
            obj = this.MINUTE;
          } else if ((/^mo?(nth)?$/i).test(s)) {
            obj = this.MONTH;
          } else if ((/^(q|qt|quarter)$/i).test(s)) {
            obj = this.QUARTER;
          } else if ((/^s((ec)?(ond))?$/i).test(s)) {
            obj = this.SECOND;
          } else if ((/^w(ee)?k?$/i).test(s)) {
            obj = this.WEEK;
          } else if ((/^y(ea)?r?$/i).test(s)) {
            obj = this.YEAR;
          }
        } else if (typeof s === 'object') {
          switch (s.code || s.name || s.abbreviation) {
            case 'd':
            case 'day':
            case 'dy':
              obj = this.DAY;
              break;
            case 'h':
            case 'hour':
            case 'hr':
              obj = this.HOUR;
              break;
            case 'n':
            case 'minute':
            case 'min':
              obj = this.MINUTE;
              break;
            case 'm':
            case 'month':
            case 'mo':
              obj = this.MONTH;
              break;
            case 'q':
            case 'quarter':
            case 'qt':
              obj = this.QUARTER;
              break;
            case 's':
            case 'second':
            case 'sec':
              obj = this.SECOND;
              break;
            case 'w':
            case 'week':
            case 'wk':
              obj = this.WEEK;
              break;
            case 'y':
            case 'year':
            case 'yr':
              obj = this.YEAR;
              break;
          }
          if ( obj.abbreviation !== s.abbreviation ||
               obj.code !== s.code ||
               obj.name !== s.name
             ) {
            obj = null;
          }
        }

        return obj;
      }
    },

    /**
     * Constant numeric value of Saturday
     * @type     {number}
     */
    SATURDAY: 6,

    /**
     * Constant numeric value of Sunday
     * @type     {number}
     */
    SUNDAY: 0,

    /**
     * Constant numeric value of Thursday
     * @type     {number}
     */
    THURSDAY: 4,

    /**
     * Constant numeric value of Tuesday
     * @type     {number}
     */
    TUESDAY: 2,

    /**
     * Constant numeric value of Wednesday
     * @type     {number}
     */
    WEDNESDAY: 3,

    /**
     * Returns a date after adding the specified number of periods to the starting date. The specified period must be a string specifying one of the following: y[ear], q[uarter], m[onth], d[ay], w[eek], h[our], [mi]n[ute], or s[econd].
     * @return   {date}
     * @param    {string|Cathmhaol.Calendar.PERIOD} period
     * @param    {number} periods
     * @param    {string|number|date} ds
     */
    dateAdd: function(period, periods, ds) {
      var d;

      // normalize
      period = this.PERIOD.normalize(period);
      periods = Math.parseFloat(periods || 0);
      ds = this.parse(ds, true);
      if (this.isDate(ds)) {
        switch ((period || {}).code) {
          case this.PERIOD.DAY.code:
            d = new Date(ds.setDate(ds.getDate() + periods));
            break;
          case this.PERIOD.HOUR.code:
            d = new Date(ds.setHours(ds.getHours() + periods));
            break;
          case this.PERIOD.MONTH.code:
            d = new Date(ds.setMonth(ds.getMonth() + periods));
            break;
          case this.PERIOD.MINUTE.code:
            d = new Date(ds.setMinutes(ds.getMinutes() + periods));
            break;
          case this.PERIOD.QUARTER.code:
            d = new Date(ds.setMonth(ds.getMonth() + (periods * 3)));
            break;
          case this.PERIOD.SECOND.code:
            d = new Date(ds.setSeconds(ds.getSeconds() + periods));
            break;
          case this.PERIOD.WEEK.code:
            d = new Date(ds.setDate(ds.getDate() + (periods * 7)));
            break;
          case this.PERIOD.YEAR.code:
            d = new Date(ds.setFullYear(ds.getFullYear() + periods));
            break;
        }
      }

      return d;
    },

    /**
     * Returns the number of specified intervals between the start date and the end date. The specified period must be a string specifying one of the following: y[ear], q[uarter], m[onth], d[ay], w[eek], h[our], [mi]n[ute], or s[econd].
     * @return   {float}
     * @param    {string|Cathmhaol.Calendar.PERIOD} period
     * @param    {string|number|date} ds
     * @param    {string|number|date} de
     */
    dateDiff: function(period, ds, de) {
      var d = 0;

      // normalize
      period = this.PERIOD.normalize(period);
      ds = this.parse(ds, true);
      de = this.parse(de, true);

      if (this.isDate(ds) && this.isDate(de)) {
        switch ((period || {}).code) {
          case this.PERIOD.DAY.code:
            d += ((de.getTime() - ds.getTime())/(1000 * 60 * 60 * 24));
            break;
          case this.PERIOD.HOUR.code:
            d += ((de.getTime() - ds.getTime())/(1000 * 60 * 60));
            break;
          case this.PERIOD.MONTH.code:
            d += ((de.getFullYear() - ds.getFullYear()) * 12);
            d += (de.getMonth() - ds.getMonth());
            break;
          case this.PERIOD.MINUTE.code:
            d += ((de.getTime() - ds.getTime())/(1000 * 60));
            break;
          case this.PERIOD.QUARTER.code:
            d += ((de.getFullYear() - ds.getFullYear()) * 4);
            d += ((de.getMonth() - ds.getMonth())/4);
            break;
          case this.PERIOD.SECOND.code:
            d += ((de.getTime() - ds.getTime())/1000);
            break;
          case this.PERIOD.WEEK.code:
            d += ((de.getTime() - ds.getTime())/(1000 * 60 * 60 * 24 * 7));
            break;
          case this.PERIOD.YEAR.code:
            d += de.getFullYear() - ds.getFullYear();
            break;
        }
      }

      return d;
    },

    /**
     * Returns the day of the week for the specified date - 0 for Sunday, 6 for Saturday
     * @return   {number}
     * @param    {string|number|date} d
     */
    dayOfTheWeek: function(d) {
      d = this.parse(d, true);
      if (this.isDate(d)) {
        return d.getDay();
      }
      return;
    },

    /**
     * Calculates the number of days in a month.
     * @return   {number}
     * @param    {string|number|date} d
     */
    daysInMonth: function(d) {
      d = this.parse(d, true);
      if (this.isDate(d)) {
        switch (d.getMonth()) {
          case 1:
            if (this.isLeapYear(d.getFullYear())) {
              return 29;
            } else {
              return 28;
            }
          case 3:
          case 5:
          case 8:
          case 10:
            return 30;
          default:
            return 31; 
        }
      }
      return;
    },

    /**
     * Returns an object containing a localized date when given a date and a ISO language code. Object returned contains: year: the 4-digit year, month: the month number - 1..12, monthName: the name of the month, day: the day of the week - 0..6 (Sunday..Saturday), dayName: the name of the day of the week, date: the day of the month 1..31
     * @return   {object}
     * @param    {date|string|number} d
     * @param    {string} locale
     */
    getLocalizedDate: function(d, locale) {
      var obj = {
            year:null,
            month:null,
            monthName:null,
            day:null,
            dayName:null,
            date:null
          }
        , dt
        , days = this.DAYS[locale] || this.DAYS['en']
        , months = this.MONTHS[locale] || this.MONTHS['en']
      ;

      // make sure we have a date
      switch (typeof d) {
        case 'string':
          // when converting strings to dates, js subtracts if the delimiter
          // is a "-" so we change it to another character
          dt = new Date(d.replace(/\-/, '.'));
          break;
        case 'number':
          dt = new Date(d);
          break;
        default:
          if (d && typeof d.getTime === 'function') {
            dt = d;
          }
      }
      // if we haven't be able to determine the date, use the
      // parse method
      if (!dt || isNaN(dt.getTime())) {
        dt = this.parse(d);
      }

      // if we have a valid date, turn it into a detailed object
      if (this.isDate(dt)) {
        obj.year = dt.getFullYear();
        obj.month = dt.getMonth();
        obj.day = dt.getDay();
        obj.date = dt.getDate();

        obj.monthName = months[obj.month].longName;
        obj.dayName = days[obj.day].longName;

        obj.month += 1;
      }

      return obj;
    },

    /**
     * Returns true if the object passed is a date
     * @return   {boolean}
     * @param    {date} d
     */
    isDate: function(d) {
      return ( d &&
               d.getDate &&
               d.getFullYear &&
               d.getHours  &&
               d.getMinutes && d.getMonth &&
               d.getSeconds &&
               d.getTime &&
               !isNaN(d.getTime())
             );
    },

    /**
     * Returns true if the year evaluated is a leap year, false if not, and null if the year is invalid.
     * @return   {boolean}
     * @param    {number|string|date} yr
     */
    isLeapYear: function(yr) {
      var ok;

      // normalize the input
      if (typeof yr === 'object' && typeof yr.getFullYear === 'function') {
        yr = yr.getFullYear();
      } else if (typeof yr !== 'number' && typeof yr !== 'string') {
        yr = (new Date()).getFullYear();
      }

      // validate the input
      if (yr > 0 && !isNaN(yr)) {
        ok = ((yr % 4 == 0) && (yr % 100 != 0)) || (yr % 400 == 0);
      }

      return ok;
    },

    /**
     * Returns true if the specified language code is supported.
     * @return   {boolean}
     * @argument {string} iso_639
     */
    isSupportedLanguage: function(iso_639) {
      var map = this.DAYS[iso_639];

      return (map !== null && map !== undefined && map.longName);
    },

    /**
     * Returns an ordinal date given the year, month, ordinal index (must be 1 (first), 2 (second), 3 (third), 4 (fourth), or 5 (fifth)), and day of the week (Sunday = 0, Monday = 1, .. Saturday = 6). For example, ordinalDate(2008, 2, 5, Cathmhaol.Calendar.SUNDAY) would return the fifth Sunday in March, 2008 -- 30-MAR-08.
     * @return   {date}
     * @param    {number} yy
     * @param    {number} mm
     * @param    {number} oi
     * @param    {number} dd
     */
    ordinalDate: function(yy, mm, oi, dd) {
      var dat                              // value to return
        , min = (((oi || 1) - 1) * 7) + 1  // min value using ordinal
        , max = min + 7                    // max value using ordinal
        , ndx                              // loop index
      ;

      // check to make sure we have all the require params
      if ( !yy || (yy < 1) ||               // year missing or invalid
           !mm || (mm < 0) || (mm > 11) ||  // month missing or invalid
           !oi || (oi < 1) || (oi > 5) ||   // ordinal index missing or invalid
           !dd || (dd < 0) || (dd > 6)      // day of week missing or invalid
         ) {
        return;
      }

      // loop through, min to max to find the date
      for (ndx = min; ndx <= max; ndx += 1) {
        dat = new Date(yy, mm, ndx);
        if (dat.getDay() == dd) {
          break;
        }
      }

      return dat;
    },

    /**
     * Parses a date. Optionally defaults to the current date
     * @return   {date}
     * @param    {string|date|number} d
     * @param    {boolean} useDefault
     */
    parse: function(d, useDefault) {
      var format = /\D(\d+)\D/g
        , parts
        , yr
        , mo
        , dy
      ;
      if (typeof d === 'number') {
        d = new Date(d);
      } else if (typeof d === 'string') {
        parts = new Date(d.replace(/\-/, '.'));
        if (!isNaN(parts.getTime())) {
          d = parts;
        }
      }

      d = this.isDate(d) ? d : (useDefault) ? (new Date()) : null;

      return d;
    },

    /**
     * Returns an array of ISO 639-1 language codes supported.
     * @return   {string[]}
     */
    supportedLanguages: function() {
      var a = [ ]
        , langCode
      ;

      for (langCode in this.DAYS) {
        a.push(langCode.toLowerCase());
      }
      return a;
    }
  };

  return Cathmhaol;
}));
