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
   * @param {string|HTMLElement} CONTAINER   The unique ID of the HTML element to contain the object
   * @param {string} TOPO                    The URI of a topo file
   * @param {number} WIDTH                   The diameter of the globe or the width of the map in pixels
   * @param {string} STYLE                   The style to use
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
  Cathmhaol.Earth = function(CONTAINER, TOPO, WIDTH, STYLE, DESCRIPTOR) {
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
     * Border color in hexadecimal format, e.g. #ff0000
     * @type     {string}
     * @default  "#ff0000"
     */
    this.borderColor = function(value) {
      // validate that we have a hexadecimal color that is exactly 6 bytes
      if ((/^\#[A-F0-9]{6}/i).test(value)) {
        PALETTE.border = value;
      }
      return PALETTE.border;
    };

    /**
     * The HTML element that is the parent for the map
     * @type     {HTMLElement}
     */
    this.element = function(value) {
      // if a string is passed, try to get an element with that id
      value = getElement(value);
      if (value) {
        CONTAINER = value;
      }
      return CONTAINER;
    };

    /**
     * Returns a string array containing event names
     * @type     {string[]}
     */
    this.events = function() {
      return EVENTS;
    };

    /**
     * Marker animation, e.g., 'pulse' or 'ping'. An enum of pulse, ping, and none
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
      // validate that we have a hexadecimal color that is exactly 6 bytes
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
     * URI of the marker file, e.g., '/popmap/cities.csv', and the type, e.g. csv or json
     * @type     {object}
     */
    this.markerFile = function(uri, type) {
      uri = (typeof uri === 'string') ? { name:uri, type:type } : uri;
      uri = (uri.name && uri.type) ? {name:uri.name, type:uri.type} : null;
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
      // make sure the value is between 0.0 (transparent) and 1.0 (opaque)
      if (!isNaN(value)) {
        value = Math.floor(value * 10);
        if (value > -1 && value < 11) {
          PALETTE.markerOpacity = (value / 10).toString();
        }
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
        , pc = reg.test(value)
      ;

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
     * Adds an event handler
     * @return   {void}
     * @param    {string} eventname
     * @param    {function} handler
     */
    this.on = function(eventname, handler) {
      var evt
        , i
        , handlers
      ;

      if (typeof eventname === 'string' && typeof handler === 'function') {
        eventname = (eventname || '').toLowerCase();
        for (i = 0; i < EVENTS.length; i += 1) {
          evt = (EVENTS[i] || '').toLowerCase();
          // check to make sure it's an event that is published
          if (eventname === evt) {
            handlers = EVENT_HANDLERS[eventname] || [ ];
            handlers.push(handler);
            EVENT_HANDLERS[eventname] = handlers;
            break;
          }
        }
      }
    };

    /**
     * Object specifying color palette, containing 'border', 'countries', 'marker', 'ocean'
     * @type     {object}
     */
    this.palette = function(value) {
      /**
       * Convert a specification to an array and validate the elements
       * @return   {string[]}
       * @param    {string[]|string} colors
       */
      function validate(colors) {
        var i
          , reg = /(\#[A-Z0-9]{6})[^A-Z0-9]?/i
        ;

        // if we get a string, convert it to an array
        if (typeof colors === 'string') {
          colors = colors.split(reg);
        }

        if (colors instanceof Array) {
          // loop through the colors and if they're not valid, remove them
          for (i = 0; i < colors.length; i += 1) {
            if (!reg.test(colors[i])) {
              colors.splice(i, 1);
            }
          }
        } else {
          colors = [ ];
        }
        return colors;
      }

      var border = value.border
        , countries = value.colors || value.countries
        , marker = value.marker
        , ocean = value.ocean || value.oceans
      ;

      if (border || countries || marker || ocean) {
        PALETTE.border = validate(border).shift() || PALETTE.border;
        PALETTE.countries = validate(countries) || PALETTE.countries;
        PALETTE.marker = validate(marker).shift() || PALETTE.marker;
        PALETTE.ocean = validate(ocean).shift() || PALETTE.ocean;
      } else if (value instanceof Array) {
        PALETTE.countries = validate(value) || PALETTE.countries;
      }
      return PALETTE;
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

      /**
       * Convert a table row to an object given a specified order of properties
       * @return   {object}
       * @param    {string[]} spec
       * @param    {HTMLElement} trow
       */
      function data_element(spec, trow) {
        var ndx, obj = { };
        if (spec && trow) {
          for (ndx = 0; ndx < spec.length; ndx += 1) {
            obj[spec[ndx]] = trow.cells[ndx].innerHTML;
          }
        }
        return obj;
      }

      try {
        // make sure the marker table flag is reset, in case the table is null
        MARKER_TABLE = false;

        // normalize the parameter to an HTMLElement
        table = getElement(table);
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
     * Renders the map.
     * @return   {void}
     * @param    {string} style
     * @example  var earth = new Cathmhaol.Earth('flatmap', '/js/world-110m.json'); earth.render('2D');
     * @example  var earth = new Cathmhaol.Earth('flatmap', '/js/world-110m.json'); earth.render();
     */
    this.render = function(style) {
      /**
       * Normalize a location (longitude, latitude, and roll) between +/-180 longitude and +/-90 latitude
       * @return   {number[]}
       * @param    {number[]} coord
       */
      function normalize(coord) {
         // longitude; range is ±180°
         coord[0] = (Math.abs(coord[0]) > 180 ? -1 : 1) * (coord[0] % 180);
         // latitude; range is ±90°
         coord[1] = (Math.abs(coord[1]) >  90 ? -1 : 1) * (coord[1] % 90);
         // axial tilt is between -90° and 270° so we handle it in steps
         coord[2] = (coord[2] || 0);
         coord[2] = (coord[2] > 270) ? coord[2]-360 : coord[2];
         coord[2] = (coord[2] < -90) ? coord[2]+360 : coord[2];
         return coord;
      }

      /**
       * Handlers for drag events listening to dragable regions
       * @return   {void}
       */
      function dragended() {
        DRAGGING = false;
        THEN = Date.now();
        ROTATE_3D = rotates();
      }
      function dragged(d, i) {
        // the map can only display 180 degrees of longitude and 90 degrees 
        // of latitude at one time, so we convert the delta in position to 
        // those ranges before we rotate the projection and update the path 
        // elements

        var lambda = d3.scale.linear().domain([0, WIDTH]).range([0, 180])
          , phi = d3.scale.linear().domain([0, WIDTH]).range([0, -90])
        ;

        LOCATION = normalize([ LOCATION[0]+lambda(d3.event.dx)
                             , LOCATION[1]+phi(d3.event.dy)
                             , LOCATION[2] || 0 ]);

        projection.rotate(LOCATION);
        d3.select('#'+ID).selectAll('path')
                           .attr('d', PROJECTION_PATH.projection(projection));
      }
      function dragstarted() {
        DRAGGING = true;
        rotationPause();
      }

      /**
       * Handlers for zoom events listening to zoomable regions
       * @return   {void}
       */
      function zoomed(evt) {
        var container = d3.select(this);
        if (d3.event.scale === 1) {
          container.attr('transform', null);
        } else {
          container.attr('transform', 'translate('+d3.event.translate+')' +
                         'scale('+d3.event.scale+')');
        }
      }

      /**
       * Maps a topo id to the ISO 3166 Alpha-2 code and name (English)
       * @return   {object}
       * @param    {number} id
       */
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
        STYLE = PROJECTIONS.map(style);
      }

      // we only start rendering if we have a containing element
      if (CONTAINER) {
        var radius = WIDTH/2
          , projection
          , zoom = d3.behavior.zoom().scaleExtent([1, 10]).on('zoom', zoomed)
        ;

        // set global variables
        rotationTimerEnd();
        projection = (STYLE || { }).projection;

        if (TOPO !== '' && projection) {
          // create the SVG and initialize the mouse/touch handlers
          if (!document.getElementById(ID)) {
            // create an svg element that is a square - rectangular 
            // maps will display with bottom and top margin, but globes 
            // will take up all available real estate
            d3.select(CONTAINER).append('svg')
                .attr('id', ID)
                .attr('width', WIDTH)
                .attr('height', WIDTH)
              ;

            // add the map container
            d3.select('#'+ID).append('g').attr('id', ID+'-map');
          }

          switch (STYLE.shape) {
            case 'rectangle':
              if (STYLE.name === 'Mercator') {
                // make the center 0° W longitude and 5° N latitude and rotate 
                // the map -10° longitude, 0° latitude before setting the zoom
                // and moving the projection to the center
                projection.center([0, 5])
                          .precision(.1)
                          .rotate([-10, 0])
                          .scale((WIDTH+1)/2/Math.PI)
                  ;
              } else if (STYLE.scale) {
                // if the style is not 'mercator' but we have a scale, use it
                projection.scale(STYLE.scale);
              }
              break;
            case 'sphere':
              projection.scale(radius-2);
              break;
            default:
              if (STYLE.scale) {
                projection.scale(STYLE.scale);
              }
              break;
          }
          // center the projection
          projection.translate(center());
          if (STYLE.parallels) {
            projection.parallels(STYLE.parallels);
          }
          PROJECTION_PATH = d3.geo.path().projection(projection);

          // load the topography and draw the detail in the callback
          d3.json(TOPO, function(error, data) {
              if (error) { return; }

              var cnt = topojson.feature(data, data.objects.countries).features
                , color = d3.scale.ordinal().range(PALETTE.countries)
                , nexto = topojson.neighbors(data.objects.countries.geometries)
              ;

              // draw the oceans
              d3.select('#'+ID+'-map').append('g').attr('id', ID+'-oceans')
                  .append('path')
                    .datum({type:'Sphere'})
                    .attr('id', ID+'-oceans')
                    .attr('d', PROJECTION_PATH)
                    .style('fill', PALETTE.ocean)
                    .style('stroke', '#333')
                    .style('stroke-width', '1.5px')
                ;

              // draw the countries
              d3.select('#'+ID+'-map').append('g').attr('id', ID+'-countries')
                .selectAll('path').data(cnt).enter().append('path')
                  .attr('class', function(d, i) { 
                     return 'country '+topoMap(d.id).iso; 
                   })
                  .attr('d', PROJECTION_PATH)
                  .style('fill', function(d, i) { 
                     d.iso = topoMap(d.id).iso; 
                     d.name = topoMap(d.id).name; 
                     return color(d.color = d3.max(nexto[i], function(n) { 
                       return cnt[n].color;
                     }) + 1 | 0); 
                   })
                  .style('stroke', PALETTE.border)
                  .style('stroke-width', '0.5px')
                ;

              // assign the click handlers if defined
              if (COUNTRY_HANDLERS && COUNTRY_HANDLERS.length) {
                d3.select('#'+ID+'-countries').selectAll('path.country')
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
                  // draw the markers
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

              // add the map interaction handlers
              d3.select('#'+ID+'-map')
                  .call(zoom)
                  .call( d3.behavior.drag()
                           .on('drag', dragged)
                           .on('dragend', dragended)
                           .on('dragstart', dragstarted)
                   )
                ;

              // we're done processing, so start the rotation
              rotationStart();
              fire('rendered', [projection]);
            });
        }
      }
    };

    /**
     * Map is rotatable, i.e., a globe
     * @type     {boolean}
     */
    this.rotatable = function() {
      return rotates();
    };

    /**
     * Map is rotating, i.e., rotable and the animation is set to run
     * @type     {boolean}
     */
    this.rotating = function() {
      return ( rotates() && ROTATE_3D && !ROTATE_STOPPED );
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     * @param    {number} rate
     */
    this.rotationDecrease = function(rate) {
      if (VELOCITY > 0.01) {
        rate = rate || '';
        if (rate.indexOf('%') > -1) { 
          rate = rate.replace(/\%/g, '') / 100; 
          rate = (( rate || 0 ) * VELOCITY);
        }
        rate = ((isNaN(rate) ? 0.005 : rate) || 0.005);
        VELOCITY -= rate;
        fire('slowed');
      }
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     * @param    {number} rate
     */
    this.rotationIncrease = function(rate) {
      if (VELOCITY > 0.01) {
        rate = rate || '';  
        if (rate.indexOf('%') > -1) {   
          rate = rate.replace(/\%/g, '') / 100;   
          rate = (( rate || 0 ) * VELOCITY);  
        }
        rate = ((isNaN(rate) ? 0.005 : rate) || 0.005);  
        VELOCITY += rate;  
        fire('accelerated');
      }
    };

    /**
     * Pause the rotation. Rotation that is 'paused' is waiting for a implicit triggering event, such as a 'mouse up' or 'drag end'.
     * @return   {void}
     */
    this.rotationPause = function() {
      rotationPause();
    };

    /**
     * Restart the rotation
     * @return   {void}
     */
    this.rotationResume = function() {
      rotationStart();
      fire('resumed'); 
    };

    /**
     * Stop the rotation. Rotation that is 'stopped' is waiting for an explicity restart.
     * @return   {void}
     */
    this.rotationStop = function() {
      ROTATE_STOPPED = true;
    };

    /**
     * The style of the map to generate
     * @type     {string}
     */
    this.style = function(value) {
      value = PROJECTIONS.map(value);
      if (value) {
        STYLE = value;
      }
      return STYLE.name;
    };

    /**
     * An array of supported map styles
     * @type     {string[]}
     */
    this.supportedTypes = function() {
      var supported = [ ]
        , prop
        , proj = PROJECTIONS
      ;
      for (prop in proj) {
        if (proj.hasOwnProperty(prop)) {
          if (typeof proj[prop] !== 'function' && proj[prop].name) {
            supported.push(proj[prop].name);
          }
        }
      }
      return supported;
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
     * Returns the x and y coordinates of the center of the svg
     * @return   {object}
     */
    function center() {
      var svg = document.getElementById(ID)
        , pos = [0, 0]
      ;
      if (svg) {
        pos[0] = Math.floor(svg.clientWidth/2);
        pos[1] = Math.floor(svg.clientHeight/2);
      }
      return pos;
    }

    /**
     * Draws the location markers based on the marker data
     * @return   {void}
     */
    function drawMarkers() {
      var columns = MARKER_DESCRIPTION              // column/object property
        , container = DESCRIPTOR || CONTAINER       // contains the table
        , data = MARKER_DATA                        // array containing data
        , default_sort                              // column to default sort
        , id_style = 'cjl-STable-style'             // id for the style element
        , id_table = 'cjl-STable-'+Date.now()       // unique table id
        , markers                                   // markers collection
        , ndx                                       // loop index
        , rules = [ ]                               // stylesheet rules
        , style = document.getElementById(id_style) // style element
        , table                                     // the table
        , tbody                                     // the body of the table
        , tcells                                    // cells in the table
        , tfoot                                     // the table footer
        , thead                                     // the header of the table
        , trows                                     // rows in the table
        , keys = { }                                // dataset properties
        , prop                                      // property of an element
        , row                                       // a specific data element
        , marker_lg                                 // the largest marker size
      ;

      /**
       * Animation transitions. Larger size markers have a longer duration (i.e., they're slower)
       * @return   {void}
       */
      function ping() {
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) {
                   // set the actual animation to 90% of the time
                   // before setting the size-relative duration
                   // and setting the duration to the minimum value
                   var max_ms = Math.floor(MARKER_ANIMATION_DURATION * .9)
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)
                     , ms = Math.min(rel_ms, max_ms)
                   ;
                   return ms;
                 })
                .style('stroke-width', function(d, i) { 
                   var sz = d.marker.size;
                   sz *= (sz < 1) ? MARKER_SIZE : 1;
                   return sz;
                 })
              .transition()
                .duration(0)
                .style('stroke-width', 0)
        ;
      }
      function pulse() {
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) {
                   // set the actual animation to .3 of 90% of the time
                   // before setting the size-relative duration
                   // and setting the duration to the minimum value
                   var max_ms = Math.floor((MARKER_ANIMATION_DURATION*.9)/3)
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)
                     , ms = Math.min(rel_ms, max_ms)
                   ;
                   return ms;
                 })
                .style('stroke-width', function(d, i) { 
                   var sz = d.marker.size;
                   sz *= (sz < 1) ? MARKER_SIZE : 1;
                   return sz;
                 })
              .transition()
                .duration(function(d, i) {
                   // set the actual animation to .6 of 90% of the time
                   // before setting the size-relative duration
                   // and setting the duration to the minimum value
                   var max_ms = Math.floor((MARKER_ANIMATION_DURATION*.9)/3)*2
                     , rel_ms = Math.floor(d.marker.rel_size * max_ms)
                     , ms = Math.min(rel_ms, max_ms)
                   ;
                   return ms;
                 })
                .style('stroke-width', 0)
        ;
      }

      style = style || document.createElement('style');
      marker_lg = d3.max(data, function(d) { return d.size || d.Size; });

      // if the largest size isn't set, set it to the marker size
      marker_lg = marker_lg || MARKER_SIZE;

      // if the map has not been rendered yet then call the render method, 
      // otherwise, go ahead and draw the markers
      if (!document.getElementById(ID+'-map')) {
        self.render();
      } else {
        // delete all the existing markers
        markers = document.getElementById(ID+'-markers');
        if (markers) {
          while (markers.firstChild) {
            markers.removeChild(markers.firstChild);
          }
        }

        // add the markers using the data provided
        d3.select('#'+ID+'-map').append('g').attr('id', ID+'-markers')
           .selectAll('path').data(data).enter().append('path')
             .datum(function(d) {
                var m = (MARKER_RELATIVE_SIZE ? (1/WIDTH) : 1)
                  , c = parseFloat(d.size || d.Size || MARKER_SIZE)
                  , size = c * m
                  , lg = marker_lg * m
                  , lat = (d.latitude || d.Latitude || d.lat || d.Lat)
                  , lon = (d.longitude || d.Longitude || d.lon || d.Lon)
                ;
                d.size = size;
                d.rel_size = size / (lg || 1);
                return { type:'Point', 
                         coordinates:[ lon, lat ], 
                         marker:d };
              })
             .attr('class', function(d) {
                var country = (d.country || d.Country || '');
                return (new Array('marker', country)).join(' ');
              })
             .attr('d', PROJECTION_PATH.pointRadius(1))
             .attr('data-description', function(d) {
                return (d.description || d.Description);
              })
             .style('fill', function(d) {
                return (d.color || d.Color || PALETTE.marker);
              })
             .style('stroke', function(d) {
                return (d.color || d.Color || PALETTE.marker);
              })
             .style('stroke-width', 0)
             .style('stroke-opacity', (PALETTE.markerOpacity || 1))
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
            // markers are set at 1px when created, this sets them to the
            // maximum radius because they never grow using animation
            d3.selectAll('path.marker').style('stroke-width', function(d, i) {
                return d.size || d.Size || MARKER_SIZE;
              });
            break;
        }

        // assign the click handlers if defined
        if (MARKER_HANDLERS && MARKER_HANDLERS.length) {
          d3.select('#'+ID+'-markers').selectAll('path.marker')
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

        // add a data table if one does not exist and columns have been 
        // specified, using the same logic as cjl-scrollabletable
        if (!MARKER_TABLE && columns && columns.length) {
          // build the stylesheet
          if (style) {
            style.setAttribute('id', id_style);
            style.setAttribute('type', 'text/css');
          }

          // write the sortable styles so we get the adjusted widths when we 
          // write the scrollable styles
          if (style) {
            // style for a sortable table
            rules = [];
            rules.push('#'+id_table+' .sortable { cursor:pointer; padding:inherit 0.1em; }');
            rules.push('#'+id_table+' .sortable:after { border-bottom:0.3em solid #000; border-left:0.3em solid transparent; border-right:0.3em solid transparent; bottom:0.75em; content:""; height:0; margin-left:0.1em; position:relative; width:0; }');
            rules.push('#'+id_table+' .sortable.desc:after { border-bottom:none; border-top:0.3em solid #000; top:0.75em; }');
            rules.push('#'+id_table+' .sortable.sorted { color:#ff0000; }');

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
                    var issort = (d.sortable === false) ? false : true;
                    return (d.name || d)+(issort ? ' sortable' : '');
                  })
                 .text(function(d, i) {
                    var name = d.name || d;
                    return name.replace(/\b\w+/g, function(s) {
                      return s.charAt(0).toUpperCase() + 
                             s.substr(1).toLowerCase();
                    });
                  })
            ;

          // attach the click handler
          thead.selectAll('th.sortable')
                 .on('click', function (d, i) {
                    var clicked = d3.select(this)
                      , sorted = d3.select(clicked.node().parentNode)
                                   .selectAll('.sortable.sorted')
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
                              ret = a-b;
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
                              ret = b-a;
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
                             var col = (column.name || column);
                             return {column:col, value:row[col]};
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
            rules.push('#'+id_table+'.scrollable { display:inline-block; padding:0 0.5em 1.5em 0; }');
            rules.push('#'+id_table+'.scrollable tbody { height:12em; overflow-y:scroll; }');
            rules.push('#'+id_table+'.scrollable tbody > tr { height:1.2em; margin:0; padding:0; }');
            rules.push('#'+id_table+'.scrollable tbody > tr > td { line-height:1.2em; margin:0; padding-bottom:0; padding-top:0; }');
            rules.push('#'+id_table+'.scrollable tfoot { bottom:0; position:absolute; }'); 
            rules.push('#'+id_table+'.scrollable thead, #'+id_table+' tfoot, #'+id_table+' tbody { cursor:default; display:block; margin:0.5em 0; }');
            rules.push('tbody.banded tr:nth-child(odd) { background-color:rgba(187, 187, 187, 0.8); }');

            tcells = document.getElementById(id_table).getElementsByTagName('tr').item(0).childNodes;
            for (ndx = 0; ndx < tcells.length; ndx += 1) {
              rules.push('#'+id_table+' th:nth-of-type('+(ndx+1)+'), #'+id_table+' td:nth-of-type('+(ndx+1)+') { width:'+(tcells.item(ndx).offsetWidth+15)+'px; }'); // add 15 pixels to accommodate sort markers
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
          default_sort = d3.select('th.sortable.'+(columns[ndx].name || columns[ndx])).node() || d3.select('th.sortable').node();
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
     * @param    {array} params
     */
    function fire(eventname, params) {
      var i
        , handlers = EVENT_HANDLERS[eventname] || [];
      ;
      for (i = 0; i < handlers.length; i += 1) {
        handlers[i].apply(this, params);
      }
    }

    /**
     * Returns an HTMLElement
     * @return   {HTMLElement}
     * @param    {string|HTMLElement} value
     */
    function getElement(value) {
      if (typeof value === 'string') {
        value = document.getElementById(value);
      }
      if (!value || value.nodeType !== 1) {
        value = null;
      }
      return value;
    }

    /**
     * Returns true if the map style selected can rotate (i.e. globe or orthographic)
     * @return   {boolean}
     */
    function rotates() {
      // the map can rotate - i.e. it's a globe
      return STYLE.rotates === true;                                                     
    }

    /**
     * Pauses the rotation
     * @return   {void}
     */
    function rotationPause() {
      ROTATE_3D = false;
      fire('paused');  
    }

    /**
     * Starts the rotation
     * @return   {void}
     */
    function rotationStart() {
      // update the ticker to reduce janky-ness and 
      // reset the stopped and paused flags
      THEN = Date.now();
      ROTATE_3D = true;
      ROTATE_STOPPED = false;
    }

    /**
     * Ends the rotation
     * @return   {void}
     */
    function rotationTimerEnd() {
      // a D3 timer cannot be cleared once started
      ROTATE_STOPPED = true;
      ROTATE_3D = false;
    }

    /**
     * Starts the rotation
     * @return   {void}
     * @param    {projection} projection
     */
    function rotationTimerStart(projection) {
      if (projection) {
        // start the rotation timer
        d3.timer(function spin() {
            // if the map can rotate and has not been stopped and is not paused
            if (rotates() && !ROTATE_STOPPED && ROTATE_3D) {
              var tick = (Date.now()-THEN)
                , angle = VELOCITY * tick
              ;

              LOCATION[0] += angle;
              projection.rotate(LOCATION);
              d3.select('#'+ID)
                .selectAll('path')
                .attr('d', PROJECTION_PATH.projection(projection));
            }
            THEN = Date.now();
          });
      }
    }

    var D3COLORS = d3.scale.category10()
      , MARKER_ANIMATION = 'pulse'
      , MARKER_ANIMATION_DURATION = 1500
      , MARKER_DATA = []
      , MARKER_DESCRIPTION
      , MARKER_FILE = {}
      , MARKER_RELATIVE_SIZE = false
      , MARKER_SIZE = 3
      , MARKER_TABLE = false
      , PALETTE = {
          border: '#766951',
          countries: [ D3COLORS(1)
                     , D3COLORS(2)
                     , D3COLORS(3)
                     , D3COLORS(4)
                     , D3COLORS(5)
                     , D3COLORS(6)
                     , D3COLORS(7)
                     , D3COLORS(8)
                     , D3COLORS(9)
                     , D3COLORS(10)
          ],
          marker: '#ff0000',
          markerOpacity: '1.0',
          ocean: '#d8ffff'
        }
      , PROJECTIONS = {
          aitoff: {
            name:'Aitoff',
            projection:d3.geo.aitoff()
          },
          albers: {
            name:'Albers',
            projection:d3.geo.albers(),
            scale:145,
            parallels:[20, 50]
          },
          august: {
            name:'August',
            projection:d3.geo.august(),
            scale:60
          },
          baker: {
            name:'Baker',
            projection:d3.geo.baker(),
            scale:100
          },
          boggs: {
            name:'Boggs',
            projection:d3.geo.boggs()
          },
          bonne: {
            name:'Bonne',
            projection:d3.geo.bonne(),
            scale:120
          },
          bromley: {
            name:'Bromley',
            projection:d3.geo.bromley()
          },
          collignon: {
            name:'Collignon',
            projection:d3.geo.collignon(),
            scale:93
          },
          crasterparabolic: {
            name:'Craster Parabolic',
            projection:d3.geo.craster()
          },
          eckerti: {
            name:'Eckert I',
            projection:d3.geo.eckert1(),
            scale:165
          },
          eckertii: {
            name:'Eckert II',
            projection:d3.geo.eckert2(),
            scale:165
          },
          eckertiii: {
            name:'Eckert III',
            projection:d3.geo.eckert3(),
            scale:180
          },
          eckertiv: {
            name:'Eckert IV',
            projection:d3.geo.eckert4(),
            scale:180
          },
          eckertv: {
            name:'Eckert V',
            projection:d3.geo.eckert5(),
            scale:170
          },
          eckertvi: {
            name:'Eckert VI',
            projection:d3.geo.eckert6(),
            scale:170
          },
          eisenlohr: {
            name:'Eisenlohr',
            projection:d3.geo.eisenlohr(),
            scale:60
          },
          equirectangular: {
            name:'Equirectangular (Plate Carrée)',
            projection:d3.geo.equirectangular()
          },
          hammer: {
            name:'Hammer',
            projection:d3.geo.hammer(),
            scale:165
          },
          hill: {
            name:'Hill',
            projection:d3.geo.hill()
          },
          globe: {
            name:'Globe',
            projection:d3.geo.orthographic().clipAngle(90),
            rotates:true,
            shape:'sphere'
          },
          goodehomolosine: {
            name:'Goode Homolosine',
            projection:d3.geo.homolosine()
          },
          kavrayskiyvii: {
            name:'Kavrayskiy VII',
            projection:d3.geo.kavrayskiy7()
          },
          lambertcylindricalequalarea: {
            name:'Lambert cylindrical equal-area',
            projection:d3.geo.cylindricalEqualArea()
          },
          lagrange: {
            name:'Lagrange',
            projection:d3.geo.lagrange(),
            scale:120
          },
          larrivee: {
            name:'Larrivee',
            projection:d3.geo.larrivee(),
            scale:95
          },
          laskowski: {
            name:'Laskowski',
            projection:d3.geo.laskowski(),
            scale:120
          },
          loximuthal: {
            name:'Loximuthal',
            projection:d3.geo.loximuthal()
          },
          mercator: {
            name:'Mercator',
            projection:d3.geo.mercator(),
            shape:'rectangle'
          },
          miller: {
            name:'Miller',
            projection:d3.geo.miller(),
            scale:100
          },
          mcbrydethomasflatpolarparabolic: {
            name:'McBryde-Thomas Flat-Polar Parabolic',
            projection:d3.geo.mtFlatPolarParabolic()
          },
          mcbrydethomasflatpolarquartic: {
            name:'McBryde-Thomas Flat-Polar Quartic',
            projection:d3.geo.mtFlatPolarQuartic()
          },
          mcbrydethomasflatpolarsinusoidal: {
            name:'McBryde-Thomas Flat-Polar Sinusoidal',
            projection:d3.geo.mtFlatPolarSinusoidal()
          },
          mollweide: {
            name:'Mollweide',
            projection:d3.geo.mollweide(),
            scale:165
          },
          naturalearth: {
            name:'Natural Earth',
            projection:d3.geo.naturalEarth()
          },
          nellhammer: {
            name:'Nell-Hammer',
            projection:d3.geo.nellHammer()
          },
          orthographic: {
            name:'Orthographic (globe)',
            projection:d3.geo.orthographic().clipAngle(90),
            rotates:true,
            shape:'sphere'
          },
          polyconic: {
            name:'Polyconic',
            projection:d3.geo.polyconic(),
            scale:100
          },
          robinson: {
            name:'Robinson',
            projection:d3.geo.robinson()
          },
          sinusoidal: {
            name:'Sinusoidal',
            projection:d3.geo.sinusoidal()
          },
          sinumollweide: {
            name:'Sinu-Mollweide',
            projection:d3.geo.sinuMollweide()
          },
          vandergrinten: {
            name:'van der Grinten',
            projection:d3.geo.vanDerGrinten(),
            scale:75
          },
          vandergrinteniv: {
            name:'van der Grinten IV',
            projection:d3.geo.vanDerGrinten4(),
            scale:120
          },
          wagneriv: {
            name:'Wagner IV',
            projection:d3.geo.wagner4()
          },
          wagnervi: {
            name:'Wagner VI',
            projection:d3.geo.wagner6()
          },
          wagnervii: {
            name:'Wagner VII',
            projection:d3.geo.wagner7()
          },
          winkeltripel: {
            name:'Winkel Tripel',
            projection:d3.geo.winkel3()
          },

          // map to property
          map: function(name) {
            var prop;
            // added '2D' handling for backward compatibility
            name = (name === '2D') ? 'mercator' : (name || '');
            // normalize the name
            name = name.replace(/\([^\)]+\)/g, '');
            name = name.replace(/[^\w]/g, '').toLowerCase();
            // search for the requested projection
            for (prop in this) {
              if (this.hasOwnProperty(prop)) {
                if (prop === name) {
                  return this[prop];
                }
              }
            }
          }
        }
      , THEN
      , VELOCITY = 0.05
      , DRAGGING = false
      , LOCATION = [0, 0, 0]
      , PROJECTION_PATH
      , ROTATE_3D = false
      , ROTATE_STOPPED = false
      , ID = 'cjl-globe-'+Math.random().toString().replace(/\./, '')
      , COUNTRY_HANDLERS = [ ]
      , MARKER_HANDLERS = [ ]
      , EVENT_HANDLERS = { }      
      , EVENTS = [ 'accelerated'
                 , 'paused'
                 , 'rendered'
                 , 'resumed'
                 , 'slowed'
                 ]
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
    if (typeof CONTAINER === 'string') {
      CONTAINER = document.getElementById(CONTAINER);
    }

    // set the width
    WIDTH = (WIDTH || (CONTAINER && CONTAINER.nodeType === 1) ? CONTAINER.clientWidth : 160);

    // set the map style
    STYLE = PROJECTIONS.map(STYLE || 'globe');

    // set the table descriptor element
    if (typeof DESCRIPTOR === 'string') {
      DESCRIPTOR = document.getElementById(DESCRIPTOR);
    }
    if (DESCRIPTOR && DESCRIPTOR.nodeType !== 1) {
      DESCRIPTOR = null;
    }

    // default the containing element
    if (!CONTAINER || CONTAINER.nodeType !== 1) {
      CONTAINER = document.body;
    }

    this.on('rendered', rotationTimerStart);

    return this;
  };

  return Cathmhaol;
}));
