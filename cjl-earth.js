(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], function(d3, topojson) {
      return (root.Cathmhaol = factory(d3, topojson, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.Cathmhaol = factory(root.d3, root.topojson, root);
  }
}(this, function(d3, topojson, window) {
  'use strict';

  var Cathmhaol = window.Cathmhaol || {};

  /**
   * Creates a world map. Map can be rendered as 2D (Mercator) or as a globe (default)
   *
   * @param {string|HTMLElement} ELEM        The unique ID of the HTML element to contain the object
   * @param {string} TOPO                    The URI of a topo file
   * @param {number} HEIGHT                  The diameter of the globe or the height of the map in pixels
   * @param {string} MAP_STYLE               The style to use - '2D' renders a Mercator projection everything else is a globe
   * @param {string|HTMLElement} DESCRIPTOR  The element (or unique id identifying it) to contain the descriptor table
   *
   * @requires d3            http://d3js.org/d3.v3.min.js
   * @requires d3.geo        http://d3js.org/d3.geo.projection.v0.min.js
   * @requires topoJSON      http://d3js.org/topojson.v1.min.js
   * @requires topoJSONdata  e.g. world-110m.json
   *
   * @author Robert King (hrobertking@cathmhaol.com)
   *
   */
  Cathmhaol.Earth = function(ELEM, TOPO, HEIGHT, MAP_STYLE, DESCRIPTOR) {
    /**
     * Border color in hexadecimal format, e.g. #ff0000
     * @type     {string}
     * @default  "#ff0000"
     */
    this.borderColor = function(value) {
      if ((/^\#[A-F0-9]{6}/i).test(value)) {
        PALETTE.border = value;
      }
      return PALETTE.border;
    };

    /**
     * The HTML element that is the parent for the map
     * @type     {string}
     */
    this.element = function(value) {
      if (typeof value === 'string') {
        value = document.getElementById(value);
      }
      if (value && value.nodeType === 1) {
        ELEM = value;
      }
      return ELEM;
    };

    /**
     * Returns a string array containing event names
     * @type     {string[]}
     */
    this.events = function() {
      return EVENTS;
    };

    /**
     * Marker animation, i.e., 'pulse' or 'ping'
     * @type     {string}
     * @default  "pulse"
     */
    this.markerAnimation = function(value) {
      if ((/^(pulse|ping|none)$/).test(value)) {
        MARKER_ANIMATION = value;
      }
      return MARKER_ANIMATION;
    };

    /**
     * Marker animation duration, in milliseconds. The value must be greater than 100ms.
     * @type     {number}
     * @default  1500
     */
    this.markerAnimationDuration = function(value) {
      if (!isNaN(value) && value > 100) {
        MARKER_ANIMATION_DURATION = Math.floor(value);
      }
      return MARKER_ANIMATION_DURATION;
    };

    /**
     * Marker color in hexadecimal format, e.g. #ff0000
     * @type     {string}
     * @default  "#ff0000"
     */
    this.markerColor = function(value) {
      if ((/^\#[A-F0-9]{6}/i).test(value)) {
        PALETTE.marker = value;
      }
      return PALETTE.marker;
    };

    /**
     * The column headers of the marker description table. Note: column headers must match the data returned in the marker file
     * @type     {string[]}
     */
    this.markerDescriptionData = function(value) {
      if (value === null || value === undefined || value instanceof Array) {
        MARKER_DESCRIPTION = value;
      }
      return MARKER_DESCRIPTION;
    };

    /**
     * URI of the marker file, e.g., '/popmap/cities.csv'
     * @type     {string}
     */
    this.markerFile = function(uri, type) {
      uri = (typeof uri === 'string') ? { name:uri, type:type } : (uri.name && uri.type) ? {name:uri.name, type:uri.type} : null;
      if (uri && uri.name) {
        MARKER_FILE.name = uri.name;
        MARKER_FILE.type = (/csv|json/i).test(uri.type) ? uri.type : 'csv';
      }
      return MARKER_FILE;
    };

    /**
     * The opacity of the marker
     * @type     {float}
     * @default  1
     */
    this.markerOpacity = function(value) {
      // Make sure the value is between 0.0 (transparent) and 1.0 (opaque), inclusive
      if (!isNaN(value) && Math.floor(value * 10) > -1 && Math.floor(value * 10) < 11) {
        PALETTE.markerOpacity = (Math.floor(value * 10) / 10).toString();
      }
      return PALETTE.markerOpacity;
    };

    /**
     * Default marker size in pixels
     * @type     {integer}
     * @default  3
     */
    this.markerSize = function(value) {
      var reg = /\%/
        , pc = reg.test(value);
      if (pc) {
        value = value.replace(reg, '');
      }
      if (!isNaN(value) && value > 1) {
        MARKER_SIZE = Math.floor(value);
        MARKER_RELATIVE_SIZE = pc;
      }
      return MARKER_SIZE;
    };

    /**
     * Array of hexadecimal colors, e.g., 
     * @type     {string[]}
     */
    this.palette = function(value) {
      function validate(value) {
        var i
          , reg = /(\#[A-Z0-9]{6})[^A-Z0-9]?/i
        ;
        if (typeof value === 'string') {
          value = value.split(reg);
        }
        if (value instanceof Array) {
          for (i = 0; i < value.length; i += 1) {
            if (!reg.test(value[i])) {
              value.splice(i, 1);
            }
          }
          if (value.length) {
             return value;
          }
        }
        return [ ];
      }

      if (value.colors || value.marker || value.border || value.oceans) {
        PALETTE.border = validate(value.border).shift() || PALETTE.border;
        PALETTE.colors = validate(value.colors) || PALETTE.colors;
        PALETTE.marker = validate(value.marker).shift() || PALETTE.marker;
        PALETTE.oceans = validate(value.oceans).shift() || PALETTE.oceans;
      } else if (value instanceof Array) {
        PALETTE.colors = validate(value) || PALETTE.colors;
      }
      return PALETTE;
    };

    /**
     * The style of the map to generate
     * @type     {string}
     */
    this.style = function(value) {
      if (value === '2D') {
        MAP_STYLE = value;
      }
      return MAP_STYLE;
    };

    /**
     * URI of the topojson file, e.g., '/world-110m.json'
     * @type     {string}
     */
    this.topoFile = function(value) {
      if (typeof value === 'string' && value !== '') {
        TOPO = value;
      }
      return TOPO;
    };

    /**
     * Adds click event listener for a country
     * @type     {string}
     * @return   {void}
     * @param    {function} handler
     */
    this.addOnCountryClick = function(handler) {
      if (typeof handler === 'function') {
        COUNTRY_HANDLERS.push(handler);
      }
    };

    /**
     * Adds click event listener for a country
     * @type     {string}
     * @return   {void}
     * @param    {function} handler
     */
    this.addOnMarkerClick = function(handler) {
      if (typeof handler === 'function') {
        MARKER_HANDLERS.push(handler);
      }
    };

    /**
     * Adds an event handler
     * @return   {void}
     * @param    {string} eventname
     * @param    {string} handler
     */
    this.on = function(eventname, handler) {
      var evt
        , i
        , handlers
      ;

      eventname = (eventname || '').toLowerCase();

      for (i = 0; i < EVENTS.length; i += 1) {
        evt = (EVENTS[i] || '').toLowerCase();
        // Check to make sure it's an event that is published
        if (eventname === evt) {
          handlers = EVENT_HANDLERS[eventname] || [ ];
          handlers.push(handler);
          EVENT_HANDLERS[eventname] = handlers;
          break;
        }
      }
    };

    /**
     * Parses a data table to load marker data
     * @return   {void}
     * @param    {string|HTMLElement} table
     */
    this.parseMarkerData = function(table) {
      var hdrs = [ ]
        , index
        , tbody
        , tcells
        , thead
      ;

      function data_element(spec, trow) {
        var ndx, obj = { };
        for (ndx = 0; ndx < spec.length; ndx += 1) {
          obj[spec[ndx]] = trow.cells[ndx].innerHTML;
        }
        return obj;
      }

      try {
        // make sure the marker table flag is reset, in case the table parameter is null
        MARKER_TABLE = false;

        // normalize the parameter to an HTMLElement
        table = (typeof table === 'string') ? document.getElementById(table) : table;
        table = (table.nodeType === 1) ? table : null;

        if (table && table.nodeName.toLowerCase() === 'table') {
          DESCRIPTOR = table.parentNode;
          MARKER_DATA = [ ];

          // parse the table
          thead = table.getElementsByTagName('thead').item(0);
          tbody = table.getElementsByTagName('tbody').item(0);
          if (thead && tbody) {
            // get the column headers
            tcells = thead.rows[0].cells
            for (index = 0; index < tcells.length; index += 1) {
              hdrs.push(tcells[index].innerHTML);
            }

            // get the data
            tcells = tbody.rows;
            for (index = 0; index < tcells.length; index += 1) {
              MARKER_DATA.push(new data_element(hdrs, tcells[index]));
            }

            // set the flag so we don't generate the data table again
            MARKER_TABLE = true;

            // fire the event to show we have the data
            fire('marker-data');
          }
        }
      } catch (err) {
      }
    };

    /**
     * Map is rotatable, i.e., a globe
     * @type     {boolean}
     */
    this.rotatable = function() {
      return ROTATABLE;        // the map can rotate - i.e. it's a globe
    };

    /**
     * Map is rotating, i.e., rotable and the animation is set to run
     * @type     {boolean}
     */
    this.rotating = function() {
      return ( ROTATABLE &&    // the map can rotate - i.e. it's a globe
               ROTATE_3D &&    // the rotation is not paused
              !ROTATE_STOPPED  // the rotation is not stopped
        );
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     * @param    {number} rate
     */
    this.rotationDecrease = function(rate) {
      if (VELOCITY > 0.01) {                             // if the velocity is not visually stopped
        rate = rate || '';                               // default the rate to an empty string
        if (rate.indexOf('%') > -1) {                    // adjust if we're using a percentage
          rate = rate.replace(/\%/g, '') / 100;          // translate the string into a floating-point value
          rate = (( rate || 0 ) * VELOCITY);             // do the calculation since it's a percentage of velocity
        }
        rate = ((isNaN(rate) ? 0.005 : rate) || 0.005);  // make sure we're adjusting it by a rate
        VELOCITY -= rate;                                // decrease the velocity
        fire('slowed');                                  // fire the event
      }
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     * @param    {number} rate
     */
    this.rotationIncrease = function(rate) {
      rate = rate || '';                               // default the rate to an empty string
      if (rate.indexOf('%') > -1) {                    // adjust if we're using a percentage
        rate = rate.replace(/\%/g, '') / 100;          // translate the string into a floating-point value
        rate = (( rate || 0 ) * VELOCITY);             // do the calculation since it's a percentage of velocity
      }
      rate = ((isNaN(rate) ? 0.005 : rate) || 0.005);  // make sure we're adjusting it by a rate
      VELOCITY += rate;                                // decrease the velocity
      fire('accelerated');                             // fire the event
    };

    /**
     * Pause the rotation. Rotation that is 'paused' is waiting for a implicit triggering event, such as a 'mouse up' or 'drag end'.
     * @return   {void}
     */
    this.rotationPause = function() {
      ROTATE_3D = false;       // resume a 'paused' rotation
      fire('paused');          // fire the event
    };

    /**
     * Restart the rotation
     * @return   {void}
     */
    this.rotationResume = function() {
      THEN = Date.now();       // update the ticker so we don't jank
      ROTATE_3D = true;        // resume a 'paused' rotation
      ROTATE_STOPPED = false;  // restart a 'stopped' rotation
      fire('resumed');         // fire the event
    };

    /**
     * Stop the rotation. Rotation that is 'stopped' is waiting for an explicity restart.
     * @return   {void}
     */
    this.rotationStop = function() {
      ROTATE_STOPPED = true;   // the rotation is not 'paused'
    };

    /**
     * Renders the map. If the style presented is '2D', the map is rendered as a flat (Spherical Mercator) map, otherwise, it's rendered as a globe.
     * @return   {void}
     * @param    {string} style
     * @example  var earth = new Cathmhaol.Earth('flatmap', '/js/world-110m.json'); earth.render('2D');
     * @example  var earth = new Cathmhaol.Earth('flatmap', '/js/world-110m.json'); earth.render();
     */
    this.render = function(style) {
      // Drag handler for dragable regions
      function mousedown(evt) {
        var o = projection.invert(d3.mouse(this))                                                   // longitude & latitude at the clicked pixel
          , dpp = [180/MAP_HEIGHT, 180/MAP_WIDTH]                                                   // degrees per pixel - only 180° can be shown at once
          , xycenter = [MAP_HEIGHT/2, MAP_WIDTH/2]                                                  // the x-coordinate and y-coordinate of the center of the map
          , offset                                                                                  // the offset of the center from the click
        ;

        xy_down = d3.mouse(this);                                                                   // set the x,y of the mouse down
        offset = [ (xycenter[0] - xy_down[0]) * dpp[0],                                             // the offset in degrees 
                   (xycenter[1] - xy_down[1]) * dpp[1] ];

        offset = [ o[0] + offset[0], o[1] - offset[1] ];                                            // the longitude, latitude of the displayed map center
                              

        offset[0] = (Math.abs(offset[0]) > 180 ? -1 : 1) * (offset[0] % 180);                       // normalize the longitude
        offset[1] = (Math.abs(offset[1]) > 90 ? -1 : 1) * (offset[1] % 90);                         // normalize the latitude

        if (!isNaN(offset[0]) && !isNaN(offset[1])) {                                               // if longitude and latitude are numbers
          rotational_center = offset;                                                               // set the rotational center
          ROTATE_3D = false;                                                                        // pause the rotation
          d3.event.preventDefault();                                                                // prevent the default behavior
        }
      }
      function mousemove(evt) {
        var dpp = [180/MAP_HEIGHT, 180/MAP_WIDTH]                                                   // degrees per pixel - only 180° can be shown at once
          , pos = d3.mouse(this)                                                                    // the x/y coordinate of the event
          , have_data = rotational_center && rotational_center.length &&                            // make sure we have all the data we need
                        xy_down && xy_down.length && 
                        pos && pos.length && 
                        dpp && dpp.length
          , x                                                                                       // the amount moved on the x-axis
          , y                                                                                       // the amount moved on the y-axis
        ;

        if (have_data) {
          x = pos[0] - xy_down[0];                                                                  // calculate the amount moved on x-axis
          y = pos[1] - xy_down[1];                                                                  // calculate the amount moved on y-axis
          location = [x * dpp[0], y * dpp[1]];                                                      // calculate the offset
          location = [rotational_center[0] + location[0], rotational_center[1] - location[1]];      // calculate the displayed center
          projection.rotate(location);                                                              // rotate the projection
          d3.select('#' + ID).selectAll('path').attr('d', PROJECTION_PATH.projection(projection));  // display the projection
          d3.event.preventDefault();                                                                // prevent the default behavior
        }
      }
      function mouseup(evt) {
        rotational_center = null;                                                                   // discard the rotational center
        ROTATE_3D = ROTATABLE && !rotational_center;                                                // restart the rotation
      }

      // Zoom hanlder for zoomable regions
      function zoomed(evt) {
        var container = d3.select(this);
        if (d3.event.scale === 1) {
          container.attr('transform', null);
        } else {
          container.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }
      }

      // topoJSON to ISO 3166 Alpha-2 code map
      function topoMap(id) {
        var data = [
            { topo:-1, iso:"CY", name:"Northern Cyprus" },
            { topo:-2, iso:"RS", name:"Kosovo" },
            { topo:-3, iso:"SO", name:"Somaliland" },
            { topo:4, iso:"AF", name:"Afghanistan" },
            { topo:8, iso:"AL", name:"Albania" },
            { topo:10, iso:"AQ", name:"Antarctica" },
            { topo:12, iso:"DZ", name:"Algeria" },
            { topo:16, iso:"AS", name:"American Samoa" },
            { topo:20, iso:"AD", name:"Andorra" },
            { topo:24, iso:"AO", name:"Angola" },
            { topo:28, iso:"AG", name:"Antigua and Barbuda" },
            { topo:31, iso:"AZ", name:"Azerbaijan" },
            { topo:32, iso:"AR", name:"Argentina" },
            { topo:36, iso:"AU", name:"Australia" },
            { topo:40, iso:"AT", name:"Austria" },
            { topo:44, iso:"BS", name:"Bahamas" },
            { topo:48, iso:"BH", name:"Bahrain" },
            { topo:50, iso:"BD", name:"Bangladesh" },
            { topo:51, iso:"AM", name:"Armenia" },
            { topo:52, iso:"BB", name:"Barbados" },
            { topo:56, iso:"BE", name:"Belgium" },
            { topo:60, iso:"BM", name:"Bermuda" },
            { topo:64, iso:"BT", name:"Bhutan" },
            { topo:68, iso:"BO", name:"Bolivia, Plurinational State of" },
            { topo:70, iso:"BA", name:"Bosnia and Herzegovina" },
            { topo:72, iso:"BW", name:"Botswana" },
            { topo:74, iso:"BV", name:"Bouvet Island" },
            { topo:76, iso:"BR", name:"Brazil" },
            { topo:84, iso:"BZ", name:"Belize" },
            { topo:86, iso:"IO", name:"British Indian Ocean Territory" },
            { topo:90, iso:"SB", name:"Solomon Islands" },
            { topo:92, iso:"VG", name:"Virgin Islands, British" },
            { topo:96, iso:"BN", name:"Brunei Darussalam" },
            { topo:100, iso:"BG", name:"Bulgaria" },
            { topo:104, iso:"MM", name:"Myanmar" },
            { topo:108, iso:"BI", name:"Burundi" },
            { topo:112, iso:"BY", name:"Belarus" },
            { topo:116, iso:"KH", name:"Cambodia" },
            { topo:120, iso:"CM", name:"Cameroon" },
            { topo:124, iso:"CA", name:"Canada" },
            { topo:132, iso:"CV", name:"Cape Verde" },
            { topo:136, iso:"KY", name:"Cayman Islands" },
            { topo:140, iso:"CF", name:"Central African Republic" },
            { topo:144, iso:"LK", name:"Sri Lanka" },
            { topo:148, iso:"TD", name:"Chad" },
            { topo:152, iso:"CL", name:"Chile" },
            { topo:156, iso:"CN", name:"China" },
            { topo:158, iso:"TW", name:"Taiwan, Province of China" },
            { topo:162, iso:"CX", name:"Christmas Island" },
            { topo:166, iso:"CC", name:"Cocos (Keeling) Islands" },
            { topo:170, iso:"CO", name:"Colombia" },
            { topo:174, iso:"KM", name:"Comoros" },
            { topo:175, iso:"YT", name:"Mayotte" },
            { topo:178, iso:"CG", name:"Congo" },
            { topo:180, iso:"CD", name:"Congo, the Democratic Republic of the" },
            { topo:184, iso:"CK", name:"Cook Islands" },
            { topo:188, iso:"CR", name:"Costa Rica" },
            { topo:191, iso:"HR", name:"Croatia" },
            { topo:192, iso:"CU", name:"Cuba" },
            { topo:196, iso:"CY", name:"Cyprus" },
            { topo:203, iso:"CZ", name:"Czech Republic" },
            { topo:204, iso:"BJ", name:"Benin" },
            { topo:208, iso:"DK", name:"Denmark" },
            { topo:212, iso:"DM", name:"Dominica" },
            { topo:214, iso:"DO", name:"Dominican Republic" },
            { topo:218, iso:"EC", name:"Ecuador" },
            { topo:222, iso:"SV", name:"El Salvador" },
            { topo:226, iso:"GQ", name:"Equatorial Guinea" },
            { topo:231, iso:"ET", name:"Ethiopia" },
            { topo:232, iso:"ER", name:"Eritrea" },
            { topo:233, iso:"EE", name:"Estonia" },
            { topo:234, iso:"FO", name:"Faroe Islands" },
            { topo:238, iso:"FK", name:"Falkland Islands (Malvinas)" },
            { topo:239, iso:"GS", name:"South Georgia and the South Sandwich Islands" },
            { topo:242, iso:"FJ", name:"Fiji" },
            { topo:246, iso:"FI", name:"Finland" },
            { topo:248, iso:"AX", name:"Åland Islands" },
            { topo:250, iso:"FR", name:"France" },
            { topo:254, iso:"GF", name:"French Guiana" },
            { topo:258, iso:"PF", name:"French Polynesia" },
            { topo:260, iso:"TF", name:"French Southern Territories" },
            { topo:262, iso:"DJ", name:"Djibouti" },
            { topo:266, iso:"GA", name:"Gabon" },
            { topo:268, iso:"GE", name:"Georgia" },
            { topo:270, iso:"GM", name:"Gambia" },
            { topo:275, iso:"PS", name:"Palestine, State of" },
            { topo:276, iso:"DE", name:"Germany" },
            { topo:288, iso:"GH", name:"Ghana" },
            { topo:292, iso:"GI", name:"Gibraltar" },
            { topo:296, iso:"KI", name:"Kiribati" },
            { topo:300, iso:"GR", name:"Greece" },
            { topo:304, iso:"GL", name:"Greenland" },
            { topo:308, iso:"GD", name:"Grenada" },
            { topo:312, iso:"GP", name:"Guadeloupe" },
            { topo:316, iso:"GU", name:"Guam" },
            { topo:320, iso:"GT", name:"Guatemala" },
            { topo:324, iso:"GN", name:"Guinea" },
            { topo:328, iso:"GY", name:"Guyana" },
            { topo:332, iso:"HT", name:"Haiti" },
            { topo:334, iso:"HM", name:"Heard Island and McDonald Islands" },
            { topo:336, iso:"VA", name:"Holy See (Vatican City State)" },
            { topo:340, iso:"HN", name:"Honduras" },
            { topo:344, iso:"HK", name:"Hong Kong" },
            { topo:348, iso:"HU", name:"Hungary" },
            { topo:352, iso:"IS", name:"Iceland" },
            { topo:356, iso:"IN", name:"India" },
            { topo:360, iso:"ID", name:"Indonesia" },
            { topo:364, iso:"IR", name:"Iran, Islamic Republic of" },
            { topo:368, iso:"IQ", name:"Iraq" },
            { topo:372, iso:"IE", name:"Ireland" },
            { topo:376, iso:"IL", name:"Israel" },
            { topo:380, iso:"IT", name:"Italy" },
            { topo:384, iso:"CI", name:"Côte d'Ivoire" },
            { topo:388, iso:"JM", name:"Jamaica" },
            { topo:392, iso:"JP", name:"Japan" },
            { topo:398, iso:"KZ", name:"Kazakhstan" },
            { topo:400, iso:"JO", name:"Jordan" },
            { topo:404, iso:"KE", name:"Kenya" },
            { topo:408, iso:"KP", name:"Korea, Democratic People's Republic of" },
            { topo:410, iso:"KR", name:"Korea, Republic of" },
            { topo:414, iso:"KW", name:"Kuwait" },
            { topo:417, iso:"KG", name:"Kyrgyzstan" },
            { topo:418, iso:"LA", name:"Lao People's Democratic Republic" },
            { topo:422, iso:"LB", name:"Lebanon" },
            { topo:426, iso:"LS", name:"Lesotho" },
            { topo:428, iso:"LV", name:"Latvia" },
            { topo:430, iso:"LR", name:"Liberia" },
            { topo:434, iso:"LY", name:"Libya" },
            { topo:438, iso:"LI", name:"Liechtenstein" },
            { topo:440, iso:"LT", name:"Lithuania" },
            { topo:442, iso:"LU", name:"Luxembourg" },
            { topo:446, iso:"MO", name:"Macao" },
            { topo:450, iso:"MG", name:"Madagascar" },
            { topo:454, iso:"MW", name:"Malawi" },
            { topo:458, iso:"MY", name:"Malaysia" },
            { topo:462, iso:"MV", name:"Maldives" },
            { topo:466, iso:"ML", name:"Mali" },
            { topo:470, iso:"MT", name:"Malta" },
            { topo:474, iso:"MQ", name:"Martinique" },
            { topo:478, iso:"MR", name:"Mauritania" },
            { topo:480, iso:"MU", name:"Mauritius" },
            { topo:484, iso:"MX", name:"Mexico" },
            { topo:492, iso:"MC", name:"Monaco" },
            { topo:496, iso:"MN", name:"Mongolia" },
            { topo:498, iso:"MD", name:"Moldova, Republic of" },
            { topo:499, iso:"ME", name:"Montenegro" },
            { topo:500, iso:"MS", name:"Montserrat" },
            { topo:504, iso:"MA", name:"Morocco" },
            { topo:508, iso:"MZ", name:"Mozambique" },
            { topo:512, iso:"OM", name:"Oman" },
            { topo:516, iso:"NA", name:"Namibia" },
            { topo:520, iso:"NR", name:"Nauru" },
            { topo:524, iso:"NP", name:"Nepal" },
            { topo:528, iso:"NL", name:"Netherlands" },
            { topo:531, iso:"CW", name:"Curaçao" },
            { topo:533, iso:"AW", name:"Aruba" },
            { topo:534, iso:"SX", name:"Sint Maarten (Dutch part)" },
            { topo:535, iso:"BQ", name:"Bonaire, Sint Eustatius and Saba" },
            { topo:540, iso:"NC", name:"New Caledonia" },
            { topo:548, iso:"VU", name:"Vanuatu" },
            { topo:554, iso:"NZ", name:"New Zealand" },
            { topo:558, iso:"NI", name:"Nicaragua" },
            { topo:562, iso:"NE", name:"Niger" },
            { topo:566, iso:"NG", name:"Nigeria" },
            { topo:570, iso:"NU", name:"Niue" },
            { topo:574, iso:"NF", name:"Norfolk Island" },
            { topo:578, iso:"NO", name:"Norway" },
            { topo:580, iso:"MP", name:"Northern Mariana Islands" },
            { topo:581, iso:"UM", name:"United States Minor Outlying Islands" },
            { topo:583, iso:"FM", name:"Micronesia, Federated States of" },
            { topo:584, iso:"MH", name:"Marshall Islands" },
            { topo:585, iso:"PW", name:"Palau" },
            { topo:586, iso:"PK", name:"Pakistan" },
            { topo:591, iso:"PA", name:"Panama" },
            { topo:598, iso:"PG", name:"Papua New Guinea" },
            { topo:600, iso:"PY", name:"Paraguay" },
            { topo:604, iso:"PE", name:"Peru" },
            { topo:608, iso:"PH", name:"Philippines" },
            { topo:612, iso:"PN", name:"Pitcairn" },
            { topo:616, iso:"PL", name:"Poland" },
            { topo:620, iso:"PT", name:"Portugal" },
            { topo:624, iso:"GW", name:"Guinea-Bissau" },
            { topo:626, iso:"TL", name:"Timor-Leste" },
            { topo:630, iso:"PR", name:"Puerto Rico" },
            { topo:634, iso:"QA", name:"Qatar" },
            { topo:638, iso:"RE", name:"Réunion" },
            { topo:642, iso:"RO", name:"Romania" },
            { topo:643, iso:"RU", name:"Russian Federation" },
            { topo:646, iso:"RW", name:"Rwanda" },
            { topo:652, iso:"BL", name:"Saint Barthélemy" },
            { topo:654, iso:"SH", name:"Saint Helena, Ascension and Tristan da Cunha" },
            { topo:659, iso:"KN", name:"Saint Kitts and Nevis" },
            { topo:660, iso:"AI", name:"Anguilla" },
            { topo:662, iso:"LC", name:"Saint Lucia" },
            { topo:663, iso:"MF", name:"Saint Martin (French part)" },
            { topo:666, iso:"PM", name:"Saint Pierre and Miquelon" },
            { topo:670, iso:"VC", name:"Saint Vincent and the Grenadines" },
            { topo:674, iso:"SM", name:"San Marino" },
            { topo:678, iso:"ST", name:"Sao Tome and Principe" },
            { topo:682, iso:"SA", name:"Saudi Arabia" },
            { topo:686, iso:"SN", name:"Senegal" },
            { topo:688, iso:"RS", name:"Serbia" },
            { topo:690, iso:"SC", name:"Seychelles" },
            { topo:694, iso:"SL", name:"Sierra Leone" },
            { topo:702, iso:"SG", name:"Singapore" },
            { topo:703, iso:"SK", name:"Slovakia" },
            { topo:704, iso:"VN", name:"Viet Nam" },
            { topo:705, iso:"SI", name:"Slovenia" },
            { topo:706, iso:"SO", name:"Somalia" },
            { topo:710, iso:"ZA", name:"South Africa" },
            { topo:716, iso:"ZW", name:"Zimbabwe" },
            { topo:724, iso:"ES", name:"Spain" },
            { topo:728, iso:"SS", name:"South Sudan" },
            { topo:729, iso:"SD", name:"Sudan" },
            { topo:732, iso:"EH", name:"Western Sahara" },
            { topo:740, iso:"SR", name:"Suriname" },
            { topo:744, iso:"SJ", name:"Svalbard and Jan Mayen" },
            { topo:748, iso:"SZ", name:"Swaziland" },
            { topo:752, iso:"SE", name:"Sweden" },
            { topo:756, iso:"CH", name:"Switzerland" },
            { topo:760, iso:"SY", name:"Syrian Arab Republic" },
            { topo:762, iso:"TJ", name:"Tajikistan" },
            { topo:764, iso:"TH", name:"Thailand" },
            { topo:768, iso:"TG", name:"Togo" },
            { topo:772, iso:"TK", name:"Tokelau" },
            { topo:776, iso:"TO", name:"Tonga" },
            { topo:780, iso:"TT", name:"Trinidad and Tobago" },
            { topo:784, iso:"AE", name:"United Arab Emirates" },
            { topo:788, iso:"TN", name:"Tunisia" },
            { topo:792, iso:"TR", name:"Turkey" },
            { topo:795, iso:"TM", name:"Turkmenistan" },
            { topo:796, iso:"TC", name:"Turks and Caicos Islands" },
            { topo:798, iso:"TV", name:"Tuvalu" },
            { topo:800, iso:"UG", name:"Uganda" },
            { topo:804, iso:"UA", name:"Ukraine" },
            { topo:807, iso:"MK", name:"Macedonia, the former Yugoslav Republic of" },
            { topo:818, iso:"EG", name:"Egypt" },
            { topo:826, iso:"GB", name:"United Kingdom" },
            { topo:831, iso:"GG", name:"Guernsey" },
            { topo:832, iso:"JE", name:"Jersey" },
            { topo:833, iso:"IM", name:"Isle of Man" },
            { topo:834, iso:"TZ", name:"Tanzania, United Republic of" },
            { topo:840, iso:"US", name:"United States" },
            { topo:850, iso:"VI", name:"Virgin Islands, U.S." },
            { topo:854, iso:"BF", name:"Burkina Faso" },
            { topo:858, iso:"UY", name:"Uruguay" },
            { topo:860, iso:"UZ", name:"Uzbekistan" },
            { topo:862, iso:"VE", name:"Venezuela, Bolivarian Republic of" },
            { topo:876, iso:"WF", name:"Wallis and Futuna" },
            { topo:882, iso:"WS", name:"Samoa" },
            { topo:887, iso:"YE", name:"Yemen" },
            { topo:894, iso:"ZM", name:"Zambia" }
          ]
            , i = data.length
        ;
        while (i -= 1 > -1) {
          if (data[i].topo === id) {
            return data[i];
          }
        }
        return { topo:id, iso:null, name:null };
      }

      // set the style if it's passed in
      if (style) {
        MAP_STYLE = style;
      }

      // we only start rendering if we have a containing element
      if (ELEM) {
        var diameter = HEIGHT || ELEM ? ELEM.clientWidth : 160
          , radius = diameter / 2
          , projection
          , location = [0, 0, 0]
          , xy_down
          , last_pos
          , rotational_center
          , g
          , zoom = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", zoomed)
        ;

        if (TOPO !== '') {
          // Set global variables
          MAP_WIDTH = diameter;
          MAP_HEIGHT = diameter;
          THEN = Date.now()
          ROTATE_3D = false;

          if (MAP_STYLE === '2D') {
            projection = d3.geo.mercator()                                                    // Use a Mercator format
                  .center([0, 5])                                                             // Make the center 0° W longitude and 5° N latitude
                  .translate([Math.floor((diameter * 2) * 0.5), Math.floor(diameter * 0.5)])  // Move the projection to the center
                  .scale((diameter + 1) / 2 / Math.PI)                                        // 'Zoom'
                  .precision(.1)
                  .rotate([-10, 0])                                                           // Rotate the map -10° longitude, 0° latitude, and roll 0°. 
              ;
          } else {
            projection = d3.geo.orthographic()
                  .scale(radius - 2)
                  .translate([radius, radius])
                  .clipAngle(90)
              ;
            ROTATABLE = true;
          }

          // Create the SVG and initialize the mouse/touch handlers
          d3.select(ELEM).append('svg')
              .attr('id', ID)
              .attr('width', (MAP_STYLE === '2D' ? (diameter * 2) : diameter))
              .attr('height', diameter)
              .on('mousedown', mousedown).on('touchstart', mousedown)
              .on('mousemove', mousemove).on('touchmove', mousemove)
              .on('mouseup', mouseup).on('touchend', mouseup)
            ;
          d3.select(ELEM).on('mouseout', mouseup);

          PROJECTION_PATH = d3.geo.path().projection(projection);

          // Load the topography and draw the detail in the callback
          d3.json(TOPO, function(error, world) {
               var countries = topojson.feature(world, world.objects.countries).features
                 , color = d3.scale.ordinal().range(PALETTE.colors)
                 , neighbors = topojson.neighbors(world.objects.countries.geometries)
              ;

              // Draw the globe
              if (MAP_STYLE === '2D') {
                d3.select('#' + ID).append('g').attr('id', ID + '-map')
                    .call(zoom)
                    .append('rect').attr('id', ID + '-oceans').attr('width', (diameter * 2)).attr('height', diameter)
                      .style('fill', PALETTE.oceans)
                      .style('stroke', '#333')
                      .style('stroke-width', '1.5px')
                  ;
              } else {
                d3.select('#' + ID).append('g').attr('id', ID + '-map')
                    .call(zoom)
                    .append('path').attr('id', ID + '-oceans').datum({type: 'Sphere'}).attr('d', PROJECTION_PATH)
                      .style('fill', PALETTE.oceans)
                      .style('stroke', '#333')
                      .style('stroke-width', '1.5px')
                  ;
              }

              // Draw the countries
              d3.select('#' + ID + '-map').append('g').attr('id', ID + '-countries')
                .selectAll('path').data(countries).enter().append('path')
                  .attr('class', function(d, i) { return 'country ' + topoMap(d.id).iso; })
                  .attr('d', PROJECTION_PATH)
                  .style('fill', function(d, i) { d.iso = topoMap(d.id).iso; d.name = topoMap(d.id).name; return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
                  .style('stroke', PALETTE.border)
                  .style('stroke-width', '0.5px')
                ;

              // Assign the click handlers if defined
              if (COUNTRY_HANDLERS && COUNTRY_HANDLERS.length) {
                d3.select('#' + ID + '-countries').selectAll('path.country')
                  .on('click', function country_onClick(country) {
                     var i;
                     if (!DRAGGING) {
                       for (i = 0; i < COUNTRY_HANDLERS.length; i += 1) {
                         COUNTRY_HANDLERS[i].call(country);
                       }
                     }
                   })
                ;
              }

              if (MARKER_FILE.name && MARKER_FILE.type) {
                if ((/csv/i).test(MARKER_FILE.type)) {
                  // Draw the markers
                  d3.csv(MARKER_FILE.name, function(error, markers) {
                    if (error) {
                      if (console.log) {
                        console.log('Error retrieving marker file');
                      }
                    } else if (markers) {
                      MARKER_DATA = markers;
                      fire('marker-data');
                    }
                  });
                } else {
                  d3.json(MARKER_FILE.name, function(error, markers) {
                    if (error) {
                      if (console.log) {
                        console.log('Error retrieving marker file');
                      }
                    } else if (markers) {
                      MARKER_DATA = markers
                      fire('marker-data');
                    }
                  });
                }
              } else if (MARKER_DATA.length) {
                fire('marker-data');
              }

              // We're done processing, so start the rotation
              THEN = Date.now();
              ROTATE_3D = true;
              fire('rendered');
            });

          // Start the rotation timer
          d3.timer(function spin() {
              // if the map can rotate - i.e., is a sphere - and has not been stopped and is not paused
              if (ROTATABLE && !ROTATE_STOPPED && ROTATE_3D) {
                var tick = (Date.now() - THEN)
                  , angle = VELOCITY * tick
                ;

                location[0] += angle;
                projection.rotate(location);
                d3.select('#' + ID).selectAll('path').attr('d', PROJECTION_PATH.projection(projection));
              }
              THEN = Date.now();
            });
        }
      }
    };

    /**
     * Draws the location markers based on the marker data
     * @return   {void}
     */
    function drawMarkers() {
      var columns = MARKER_DESCRIPTION                                                  // a string array containing column names corresponding to property names in D3 data
        , container = DESCRIPTOR || ELEM                                                // the HTML element that will contain the table
        , data = MARKER_DATA                                                            // using the generic 'data' to maintain consistency with scrollabletable
        , default_sort                                                                  // column to default sort
        , id_style = 'cjl-STable-style'                                                 // id for the style element
        , id_table = 'cjl-STable-' + (new Date()).getTime()                             // unique table id
        , markers                                                                       // the markers HTMLElement collection
        , ndx                                                                           // loop index
        , rules = [ ]                                                                   // stylesheet rules
        , style = document.getElementById(id_style) || document.createElement('style')  // the style element for the table
        , table                                                                         // the table
        , tbody                                                                         // the body of the table
        , tcells                                                                        // cells in the table
        , tfoot                                                                         // the table footer
        , thead                                                                         // the header of the table
        , trows                                                                         // rows in the table
        , keys = { }                                                                    // a collection of keys as they're defined in the dataset
        , prop                                                                          // property of a specific data element
        , row                                                                           // a specific data element
        , marker_lg = d3.max(data, function(d) { return d.size || d.Size; })            // the largest marker size
      ;

      // If the largest size isn't set, set it to the marker size
      marker_lg = marker_lg || MARKER_SIZE;

      // Make the markers 'ping' - larger sizes have a longer duration (are slower)
      function ping() {
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) {
                   var max_ms = Math.floor(MARKER_ANIMATION_DURATION * .9) // set the actual animation to 90% of the time
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)     // set the size-relative duration
                     , ms = Math.min(rel_ms, max_ms)                       // set the duration to the minimum value
                   ;
                   return ms;
                 })
                .style('stroke-width', function(d, i) { 
                   var sz = (d.marker.size < 1) ? (d.marker.size * MARKER_SIZE) : d.marker.size;
                   return sz;
                 })
              .transition()
                .duration(0)
                .style('stroke-width', 0)
        ;
      }
      // Make the markers 'pulse' - larger sizes have a longer duration (are slower)
      function pulse() {
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) {
                   var max_ms = Math.floor((MARKER_ANIMATION_DURATION*.9)/3)  // set the actual animation to 90% of the time
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)        // set the size-relative duration
                     , ms = Math.min(rel_ms, max_ms)                          // set the duration to the minimum value
                   ;
                   return ms;
                 })
                .style('stroke-width', function(d, i) { 
                   var sz = (d.marker.size < 1) ? (d.marker.size * MARKER_SIZE) : d.marker.size;
                   return sz;
                 })
              .transition()
                .duration(function(d, i) {
                   var max_ms = Math.floor((MARKER_ANIMATION_DURATION*.9)/3)*2  // set the actual animation to 90% of the time
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)          // set the size-relative duration
                     , ms = Math.min(rel_ms, max_ms)                            // set the duration to the minimum value
                   ;
                   return ms;
                 })
                .style('stroke-width', 0)
        ;
      }

      // if the map has not been rendered yet then call the render method, otherwise, go ahead and draw the markers
      if (!document.getElementById(ID + '-map')) {
        self.render();
      } else {
        // delete all the existing markers
        markers = document.getElementById(ID + '-markers');
        if (markers) {
          while (markers.firstChild) {
            markers.removeChild(markers.firstChild);
          }
        }

        // add the markers using the data provided
        d3.select('#' + ID + '-map').append('g').attr('id', ID + '-markers')
           .selectAll('path').data(data).enter().append('path')
             .attr('class', function(d) { return 'marker' + ((d.country || d.Country || '') ? ' ' + (d.country || d.Country || '') : ''); })
             .attr('data-description', function(d) { return (d.description || d.Description); })
             .style('fill', function(d) { return (d.color || d.Color || PALETTE.marker); })
             .style('stroke', function(d) { return (d.color || d.Color || PALETTE.marker); })
             .style('stroke-width', 0)
             .style('stroke-opacity', (PALETTE.markerOpacity || 1))
             .datum(function(d) { var m = (MARKER_RELATIVE_SIZE ? (1/MAP_HEIGHT) : 1)
                                    , c = parseFloat(d.size || d.Size || MARKER_SIZE)
                                    , size = c * m
                                    , lg = marker_lg * m
                                  ;
                                  d.size = size;
                                  d.rel_size = size / (lg || 1);
                                  return { type:'Point', coordinates:[(d.longitude || d.Longitude || d.lon || d.Lon), (d.latitude || d.Latitude || d.lat || d.Lat)], marker:d }; })
             .attr('d', PROJECTION_PATH.pointRadius(1)) //radius of the circle
          ;

        // add some visual interest to the markers via animation
        switch (MARKER_ANIMATION) {
          case 'ping':
            setInterval(ping, MARKER_ANIMATION_DURATION);
            break;
          case 'pulse':
            setInterval(pulse, MARKER_ANIMATION_DURATION);
            break;
          case 'none':
            d3.selectAll('path.marker').style('stroke-width', function(d, i) { return d.size || d.Size || MARKER_SIZE; });
            break;
        }

        // assign the click handlers if defined
        if (MARKER_HANDLERS && MARKER_HANDLERS.length) {
          d3.select('#' + ID + '-markers').selectAll('path.marker')
            .on('click', function marker_onClick(marker) {
               var i;
               if (!DRAGGING) {
                 for (i = 0; i < MARKER_HANDLERS.length; i += 1) {
                   MARKER_HANDLERS[i].call(marker);
                 }
               }
             })
          ;
        }

        // add a data table if one does not exist and columns have been specified, using the same logic as cjl-scrollabletable
        if (!MARKER_TABLE && columns && columns.length) {
          // build the stylesheet
          if (style) {
            style.setAttribute('id', id_style);
            style.setAttribute('type', 'text/css');
          }

          // write the sortable styles so we get the adjusted widths when we write the scrollable styles
          if (style) {
            // style for a sortable table
            rules = [];
            rules.push('#' + id_table + ' .sortable { cursor:pointer; padding:inherit 0.1em; }');
            rules.push('#' + id_table + ' .sortable:after { border-bottom:0.3em solid #000; border-left:0.3em solid transparent; border-right:0.3em solid transparent; bottom:0.75em; content:""; height:0; margin-left:0.1em; position:relative; width:0; }');
            rules.push('#' + id_table + ' .sortable.desc:after { border-bottom:none; border-top:0.3em solid #000; top:0.75em; }');
            rules.push('#' + id_table + ' .sortable.sorted { color:#ff0000; }');

            style.innerHTML += rules.join('\n');

            if (!style.parentNode) {
              document.body.appendChild(style);
            }
          }

          // create the table
          table = d3.select(container).append('table')
                      .attr('class', 'scrollable marker-description')
                      .attr('id', id_table)
            ;
          thead = table.append('thead');
          tfoot = table.append('tfoot');
          tbody = table.append('tbody');

          // append the header row
          thead.append('tr')
               .selectAll('th')
               .data(columns)
               .enter()
               .append('th')
                 .attr('class', function(d, i) {
                    var issort = (d.sortable === null || d.sortable === undefined) ? true : d.sortable;
                    return (d.name || d) + (issort ? ' sortable' : '');
                  })
                 .text(function(d, i) {
                    var name = d.name || d;
                    return name.replace(/\b\w+/g, function(s) {
                      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
                    });
                  })
            ;

          // attach the click handler
          thead.selectAll('th.sortable')
                 .on('click', function (d, i) {
                    var clicked = d3.select(this)
                      , sorted = d3.select(clicked.node().parentNode).selectAll('.sortable.sorted')
                      , desc = clicked.classed('desc')
                    ;

                    // normalize the data
                    d = d.name || d;

                    // reset the 'sorted' class on siblings
                    sorted.classed('sorted', false);

                    if (desc) {
                      clicked.classed({'desc': false, 'sorted': true});
                      tbody.selectAll('tr').sort(function ascending(a, b) {
                          var ret = 0;
                          a = a[d];  // select the property to compare
                          b = b[d];  // select the property to compare
                          if (a !== null && a !== undefined) {
                            if (a.localeCompare && (isNaN(a) || isNaN(b))) {
                              ret = a.localeCompare(b);
                            } else {
                              ret = a - b;
                            }
                          }
                          return ret;
                        });
                    } else {
                      clicked.classed({'desc': true, 'sorted': true});
                      tbody.selectAll('tr').sort(function descending(a, b) {
                          var ret = 0;
                          a = a[d];  // select the property to compare
                          b = b[d];  // select the property to compare
                          if (b !== null && b !== undefined) {
                            if (b.localeCompare && (isNaN(a) || isNaN(b))) {
                              ret = b.localeCompare(a);
                            } else {
                              ret = b - a;
                            }
                          }
                          return ret;
                        });
                    }
                  })
            ;

          // create the footer
          tfoot.append('tr')
               .selectAll('td')
               .data(columns)
               .enter()
               .append('td')
                 .attr('class', function(d, i) {
                    return (d.name || d);
                  })
                 .html('&nbsp;')
            ;

          // create a row for each object in the markers
          trows = tbody.selectAll('tr')
                       .data(data)
                       .enter()
                       .append('tr')
            ;

          // create a cell in each row for each column
          tcells = trows.selectAll('td')
                        .data(function(row) {
                           return columns.map(function(column) {
                             return {column: (column.name || column), value: row[(column.name || column)]};
                           });
                         })
                        .enter()
                        .append('td')
                          .attr('class', function(d) { return d.column; })
                          .html(function(d) { return d.value; })
            ;

          // build the stylesheet
          if (style) {
            // style for a scrollable table
            rules.push('#' + id_table + '.scrollable { display:inline-block; padding:0 0.5em 1.5em 0; }');
            rules.push('#' + id_table + '.scrollable tbody { height:12em; overflow-y:scroll; }');
            rules.push('#' + id_table + '.scrollable tbody > tr { height:1.2em; margin:0; padding:0; }');
            rules.push('#' + id_table + '.scrollable tbody > tr > td { line-height:1.2em; margin:0; padding-bottom:0; padding-top:0; }');
            rules.push('#' + id_table + '.scrollable tfoot { bottom:0; position:absolute; }'); 
            rules.push('#' + id_table + '.scrollable thead, #' + id_table + ' tfoot, #' + id_table + ' tbody { cursor:default; display:block; margin:0.5em 0; }');
            rules.push('tbody.banded tr:nth-child(odd) { background-color:rgba(187, 187, 187, 0.8); }');

            tcells = document.getElementById(id_table).getElementsByTagName('tr').item(0).childNodes;
            for (ndx = 0; ndx < tcells.length; ndx += 1) {
              rules.push('#' + id_table + ' th:nth-of-type(' + (ndx + 1) + '), #' + id_table + ' td:nth-of-type(' + (ndx + 1) + ') { width:' + (tcells.item(ndx).offsetWidth + 15) + 'px; }'); // add 15 pixels to accommodate sort markers
            }

            style.innerHTML = rules.join('\n');

            if (style.parentNode) {
              style.parentNode.removeChild(style);
            }
            document.body.appendChild(style);
          }

          // sort the table on the first sortable column by default
          ndx = columns.length;
          while (ndx -= 1 > -1) {
            if (columns[ndx].sortable !== false && columns[ndx].sort) {
              break;
            }
          }
          ndx = Math.max(0, ndx);
          default_sort = d3.select('th.sortable.' + (columns[ndx].name || columns[ndx])).node() || d3.select('th.sortable').node();
          if (default_sort) {
            default_sort.click();
          }
        }
      }
    }

    /**
     * Fires an event
     * @return   {void}
     * @param    {string} eventname
     */
    function fire(eventname) {
      var i
        , handlers = EVENT_HANDLERS[eventname] || [];
      ;
      for (i = 0; i < handlers.length; i += 1) {
        handlers[i].call();
      }
    }

    var D3COLORS = d3.scale.category10()
      , MARKER_ANIMATION = 'pulse', MARKER_ANIMATION_DURATION = 1500, MARKER_DATA = [], MARKER_DESCRIPTION, MARKER_FILE = {}, MARKER_RELATIVE_SIZE = false, MARKER_SIZE = 3, MARKER_TABLE = false
      , PALETTE = {
          border: '#766951',
          colors: [D3COLORS(1), D3COLORS(2), D3COLORS(3), D3COLORS(4), D3COLORS(5), D3COLORS(6), D3COLORS(7), D3COLORS(8), D3COLORS(9), D3COLORS(10)],
          marker: '#ff0000',
          markerOpacity: '1.0',
          oceans: '#d8ffff'
        }
      , MAP_WIDTH, MAP_HEIGHT
      , THEN, VELOCITY = 0.05
      , DRAGGING = false, PROJECTION_PATH, MOUSE_DOWN = false, ROTATE_3D = false, ROTATE_STOPPED = false, ROTATABLE = false
      , ID = 'cjl-globe-' + Math.random().toString().replace(/\./, '')
      , COUNTRY_HANDLERS = [ ], MARKER_HANDLERS = [ ]
      , EVENT_HANDLERS = { }
      , EVENTS = [ 'accelerated', 'paused', 'rendered', 'resumed', 'slowed' ]
      , self = this
    ;

    // make sure the polyfill for the Date.now method is present
    if (!Date.now) {
      Date.now = function now() {
        return (new Date()).getTime();
      };
    }

    // subscribe the drawMarkers function to the 'marker-data' event
    EVENT_HANDLERS['marker-data'] = new Array(drawMarkers);

    // set the container element
    if (typeof ELEM === 'string') {
      ELEM = document.getElementById(ELEM);
    }
    if (!ELEM || ELEM.nodeType !== 1) {
      ELEM = document.body;
    }

    // set the table descriptor element
    if (typeof DESCRIPTOR === 'string') {
      DESCRIPTOR = document.getElementById(DESCRIPTOR);
    }
    if (DESCRIPTOR && DESCRIPTOR.nodeType !== 1) {
      DESCRIPTOR = null;
    }

    return this;
  };

  return Cathmhaol;
}));
