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
   * @param {string|HTMLElement} elem  The unique ID of the HTML element to contain the object
   * @param {string} topo              The URI of a topo file
   * @param {number} size              The diameter of the globe in pixels
   *
   * @requires d3            http://d3js.org/d3.v3.min.js
   * @requires d3.geo        http://d3js.org/d3.geo.projection.v0.min.js
   * @requires topoJSON      http://d3js.org/topojson.v1.min.js
   * @requires topoJSONdata  e.g. world-110m.json
   *
   * @author Robert King (hrobertking@cathmhaol.com)
   *
   */
  Cathmhaol.Earth = function(ELEM, topo, height) {
    /**
     * Border color in hexadecimal format, e.g. #ff0000
     * @type     {string}
     * @default  "#ff0000"
     */
    this.getBorderColor = function() {
      return PALETTE.border;
    };
    this.setBorderColor = function(value) {
      if ((/^\#[A-F0-9]{6}/i).test(value)) {
        PALETTE.border = value;
      }
    };

    /**
     * The HTML element that is the parent for the map
     * @type     {string}
     */
    this.getElement = function() {
      return ELEM;
    };
    this.setElement = function(value) {
      if (typeof value === 'string') {
        value = document.getElementById(value);
      }
      if (value && value.nodeType === 1) {
        ELEM = value;
      }
    };

    /**
     * Marker animation, i.e., 'pulse' or 'ping'
     * @type     {string}
     * @default  "pulse"
     */
    this.getMarkerAnimation = function() {
      return MARKER_ANIMATION;
    };
    this.setMarkerAnimation = function(value) {
      if ((/^(pulse|ping|none)$/).test(value)) {
        MARKER_ANIMATION = value;
      }
    };

    /**
     * Marker color in hexadecimal format, e.g. #ff0000
     * @type     {string}
     * @default  "#ff0000"
     */
    this.getMarkerColor = function() {
      return PALETTE.marker;
    };
    this.setMarkerColor = function(value) {
      if ((/^\#[A-F0-9]{6}/i).test(value)) {
        PALETTE.marker = value;
      }
    };

    /**
     * The column headers of the marker description table. Note: column headers must match the data returned in the marker file
     * @type     {string[]}
     */
    this.getMarkerDescriptionData = function() {
      return MARKER_DESCRIPTION;
    };
    this.setMarkerDescriptionData = function(value) {
      if (value === null || value === undefined || value instanceof Array) {
        MARKER_DESCRIPTION = value;
      }
    };

    /**
     * URI of the marker file, e.g., '/popmap/cities.csv'
     * @type     {string}
     */
    this.getMarkerFile = function() {
      return MARKER_FILE;
    };
    this.setMarkerFile = function(uri, type) {
      if (type) {
        MARKER_FILE.name = uri;
        MARKER_FILE.type = type;
      } else {
        MARKER_FILE = uri;
      }
      MARKER_FILE.type = (/csv|json/i).test(MARKER_FILE.type) ? MARKER_FILE.type : 'csv';
    };

    /**
     * The opacity of the marker
     * @type     {float}
     * @default  1
     */
    this.getMarkerOpacity = function() {
      return PALETTE.markerOpacity;
    };
    this.setMarkerOpacity = function(value) {
      // Make sure the value is between 0.0 (transparent) and 1.0 (opaque), inclusive
      if (!isNaN(value) && Math.floor(value * 10) > -1 && Math.floor(value * 10) < 11) {
        PALETTE.markerOpacity = (Math.floor(value * 10) / 10).toString();
      }
    };

    /**
     * Default marker size in pixels
     * @type     {integer}
     * @default  3
     */
    this.getMarkerSize = function() {
      return MARKER_SIZE;
    };
    this.setMarkerSize = function(value) {
      var pc = (/\%/).test(value);
      if (pc) {
        value = value.replace(/\%/, '');
      }
      if (!isNaN(value) && value > 1) {
        MARKER_SIZE = Math.floor(value);
        MARKER_RELATIVE_SIZE = pc;
      }
    };

    /**
     * Array of hexadecimal colors, e.g., 
     * @type     {string[]}
     */
    this.getPalette = function() {
      return PALETTE.colors;
    };
    this.setPalette = function(value) {
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
      } else {
        PALETTE.colors = validate(value) || PALETTE.colors;
      }
    };

    /**
     * URI of the topojson file, e.g., '/world-110m.json'
     * @type     {string}
     */
    this.getTopoFile = function() {
      return topo;
    };
    this.setTopoFile = function(value) {
      if (typeof value === 'string' && value !== '') {
        topo = value;
      }
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
     * Returns a string array containing event names
     * @type     {string[]}
     */
    this.events = function() {
      return EVENTS;
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
        // Check to make sure it's an event that is fired
        if (eventname === evt) {
          handlers = EVENT_HANDLERS[eventname] || [ ];
          handlers.push(handler);
          EVENT_HANDLERS[eventname] = handlers;
          break;
        }
      }
    };

    /**
     * Map is rotatable, i.e., a globe
     * @type     {boolean}
     */
    this.rotatable = function() {
      return ROTATABLE;
    };

    /**
     * Map is rotating, i.e., rotable and the animation is set to run
     * @type     {boolean}
     */
    this.rotating = function() {
      return (ROTATABLE && ROTATE_3D);
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     */
    this.rotationDecrease = function() {
      if (VELOCITY > 0.01) {
        VELOCITY -= 0.005;
        fire('slowed');
      }
    };

    /**
     * Reduce the rotation velocity
     * @return   {void}
     */
    this.rotationIncrease = function() {
      VELOCITY += 0.005;
      fire('accelerated');
    };

    /**
     * Pause/stop the rotation
     * @return   {void}
     */
    this.rotationPause = function() {
      ROTATE_3D = false;
      fire('paused');
    };

    /**
     * Restart the rotation
     * @return   {void}
     */
    this.rotationResume = function() {
      ROTATE_3D = true;
      fire('resumed');
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
        MOUSE_DOWN = new Date();
      }
      function mousemove(evt) {
        if (MOUSE_DOWN && ROTATABLE) {
          // Ordinarily we would be able to just check to see if the mouse button
          // is down; however, we can't rely on that entirely because there
          // are browsers that trigger the mousemove event immediately after
          // the click event. Since it's nearly impossible for a user to
          // act in such tiny time increments, we're going to check for a 100ms 
          // difference between when the mousemove event fires. If the difference
          // between when the mousedown event fires and the mousemove event fires
          // is greater than 100ms, we assume the user is dragging. This will
          // also address accessibility issues that might come from motor
          // issues, e.g. tremors from Parkinson's Disease, that cause incidental
          // and unintended movement

          var d = new Date();
          DRAGGING = (d.getTime() - MOUSE_DOWN.getTime()) > 100;
          if (DRAGGING) {
            ROTATE_3D = false;

            //force rotate the globe
            var pos = d3.mouse(this)
              , lambda = d3.scale.linear().domain([0, MAP_WIDTH]).range([-180, 180])
              , phi = d3.scale.linear().domain([0, MAP_HEIGHT]).range([90, -90])
            ;

            LAMBDA = lambda(pos[0]);
            PHI = phi(pos[1]);
            projection.rotate([LAMBDA, PHI]);
            svg.selectAll('path').attr('d', path.projection(projection));
          }
        }
      }
      function mouseup(evt) {
        DRAGGING = false;
        MOUSE_DOWN = null;
        ROTATE_3D = ROTATABLE && !MOUSE_DOWN;
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

      // Draw the location markers based on the data contained in the file
      function drawMarkers(markers) {
        var table   // the marker description table
          , thead   // the header of the marker description table
          , tbody   // the body of the marker description table
          , trows   // rows in the marker description table
          , tcells  // cells in the marker description table
          , css     // stylesheet for the sortable table
        ;

        svg.select('#' + ID).append('g').attr('id', ID + '-markers')
           .selectAll('path').data(markers).enter().append('path')
             .attr('class', function(d) { return 'marker' + (d.country ? ' ' + d.country : ''); })
             .attr('data-description', function(d) { return d.description; })
             .style('fill', function(d) { return (d.color || PALETTE.marker); })
             .style('stroke', function(d) { return (d.color || PALETTE.marker); })
             .style('stroke-width', 0)
             .style('stroke-opacity', (PALETTE.markerOpacity || 1))
                 .datum(function(d) { var m = (MARKER_RELATIVE_SIZE ? (1/MAP_HEIGHT) : 1)
                                        , c = parseFloat(d.size || MARKER_SIZE)
                                        , size = c * m
                                      ;
                                      return { type:'Point', coordinates:[(d.longitude || d.lon), (d.latitude || d.lat)], size:size, color:d.color }; })
             .attr('d', path.pointRadius(2)) //radius of the circle
          ;

        // Add some visual interest to the markers via animation
        switch (MARKER_ANIMATION) {
          case 'ping':
            setInterval(ping, 1500);
            break;
          case 'pulse':
            setInterval(pulse, 1500);
            break;
          case 'none':
            d3.selectAll('path.marker').style('stroke-width', function(d, i) { return d.size; });
            break;
        }

        // Add a description table if it has been defined
        if (MARKER_DESCRIPTION && MARKER_DESCRIPTION.length) {
          // sample style for a scrollable table - hard-coded widths are based on the calculated widths of the header columns
          //   table.marker-description { border:1px solid #000; box-shadow: 10px 10px 5px #888888; position:absolute; right:10px; top:140px; }
          //   table.marker-description tbody { height:10em; overflow-y:scroll; }
          //   table.marker-description th:nth-of-type(1), table.marker-description td:nth-of-type(1) { width:60px; }
          //   table.marker-description th:nth-of-type(2), table.marker-description td:nth-of-type(2) { width:50px; }
          //   table.marker-description th:nth-of-type(3), table.marker-description td:nth-of-type(3) { width:170px; }
          //   table.marker-description th:nth-of-type(4), table.marker-description td:nth-of-type(4) { width:40px; }
          //   table.marker-description thead, table.marker-description tbody { display:block; }

          // style for a sortable table
          css = document.getElementById('cjl-sortable-css');
          if (!css) {
            css = document.createElement('style');
            css.setAttribute('id', 'cjl-sortable-css');
            css.setAttribute('type', 'text/css');
            // set the arrow style
            css.innerHTML += '.sortable { cursor:pointer; }\n';
            css.innerHTML += '.sortable:after { border-bottom:0.3em solid #000; border-left:0.3em solid transparent; border-right:0.3em solid transparent; bottom:0.75em; content:""; height:0; margin-left:0.1em; position:relative; width:0; }\n';
            css.innerHTML += '.sortable.desc:after { border-bottom:none; border-top:0.3em solid #000; top:0.75em; }\n';
            css.innerHTML += '.sortable.sorted { color:#ff0000; }\n';
            css.innerHTML += '.sortable.sorted:before { content:"*"; }\n';
            document.body.appendChild(css);
          }

          // create the table
          table = d3.select(ELEM).append('table')
                      .attr('class', 'marker-description')
            ;
          thead = table.append('thead');
          tbody = table.append('tbody');

          // append the header row
          thead.append('tr')
               .selectAll('th')
               .data(MARKER_DESCRIPTION)
               .enter()
               .append('th')
                 .attr('id', function(d, i) {
                    return 'marker-description-header-column-' + i;
                  })
                 .attr('class', 'sortable')
                 .text(function(d, i) {
                    return d.replace(/\b\w+/g, function(s) {
                      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
                    });
                  })
                 .on('click', function (d, i) {
                    var clicked = d3.select('#marker-description-header-column-' + i)
                      , sorted = d3.select(clicked.node().parentNode).selectAll('.sortable.sorted')
                      , desc = clicked.classed('desc')
                    ;

                    // reset the 'sorted' class on siblings
                    sorted.classed('sorted', false);

                    if (desc) {
                      clicked.classed({'desc': false, 'sorted': true});
                      tbody.selectAll('tr').sort(function ascending(a, b) {
                          a = a[d];  // select the property to compare
                          b = b[d];  // select the property to compare
                          if (a !== null && a !== undefined) {
                            if (a.localeCompare) {
                              return a.localeCompare(b);
                            } else {
                              return a - b;
                            }
                          }
                          return 0;
                        });
                    } else {
                      clicked.classed({'desc': true, 'sorted': true});
                      tbody.selectAll('tr').sort(function descending(a, b) {
                          a = a[d];  // select the property to compare
                          b = b[d];  // select the property to compare
                          if (b !== null && b !== undefined) {
                            if (b.localeCompare) {
                              return b.localeCompare(a);
                            } else {
                              return b - a;
                            }
                          }
                          return 0;
                        });
                    }
                  });
            ;

          // create a row for each object in the markers
          trows = tbody.selectAll('tr')
                       .data(markers)
                       .enter()
                       .append('tr')
            ;

          // create a cell in each row for each column
          tcells = trows.selectAll('td')
                        .data(function(row) {
                           return MARKER_DESCRIPTION.map(function(column) {
                             return {column: column, value: row[column]};
                           });
                         })
                        .enter()
                        .append('td')
                          .html(function(d) { return d.value; });
        }
      }
      // Make the markers 'pulse' 
      function ping() {
        // Larger size markers take pulse more slowly
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) { return Math.min(d.size * 250, 1400); })
                .style('stroke-width', function(d, i) { return d.size; })
              .transition()
                .duration(0)
                .style('stroke-width', 0)
        ;
      }

      // Make the markers 'pulse' 
      function pulse() {
        // Larger size markers take pulse more slowly
        var fade = d3.selectAll('path.marker')
              .transition()
                .duration(function(d) { return Math.min(d.size * 100, 500); })
                .style('stroke-width', function(d, i) { return d.size; })
              .transition()
                .duration(function(d, i) { return Math.min(d.size * 200, 1000); })
                .style('stroke-width', 0)
        ;
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

      // we only start rendering if we have a containing element
      if (ELEM) {
        var diameter = height || ELEM ? ELEM.clientWidth : 160
          , radius = diameter / 2
          , projection
          , LAMBDA = 0
          , PHI = 0
          , svg
          , path
          , g
          , zoom = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", zoomed)
        ;

        if (topo !== '') {
          // Set global variables
          MAP_WIDTH = diameter;
          MAP_HEIGHT = diameter;
          THEN = Date.now()
          ROTATE_3D = false;

          if (style === '2D') {
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
          svg = d3.select(ELEM).append('svg')
              .attr('width', (style === '2D' ? (diameter * 2) : diameter))
              .attr('height', diameter)
              .on('mousedown', mousedown).on('touchstart', mousedown)
              .on('mousemove', mousemove).on('touchmove', mousemove)
              .on('mouseup', mouseup).on('touchend', mouseup)
            ;

          path = d3.geo.path().projection(projection);

          // Load the topography and draw the detail in the callback
          d3.json(topo, function(error, world) {
               var countries = topojson.feature(world, world.objects.countries).features
                , color = d3.scale.ordinal().range(PALETTE.colors)
                    , neighbors = topojson.neighbors(world.objects.countries.geometries)
              ;

              // Draw the globe
              if (style === '2D') {
                svg.append('g').attr('id', ID)
                    .call(zoom)
                    .append('rect').attr('width', (diameter * 2)).attr('height', diameter)
                      .style('fill', PALETTE.oceans)
                      .style('stroke', '#333')
                      .style('stroke-width', '1.5px')
                  ;
              } else {
                svg.append('g').attr('id', ID)
                    .call(zoom)
                    .append('path').attr('id', 'oceans').datum({type: 'Sphere'}).attr('d', path)
                      .style('fill', PALETTE.oceans)
                      .style('stroke', '#333')
                      .style('stroke-width', '1.5px')
                  ;
              }

              // Draw the countries
              svg.select('#' + ID).append('g').attr('id', 'countries')
                .selectAll('path').data(countries).enter().append('path')
                  .attr('class', function(d, i) { return 'country ' + topoMap(d.id).iso; })
                  .attr('d', path)
                  .style('fill', function(d, i) { d.iso = topoMap(d.id).iso; d.name = topoMap(d.id).name; return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
                  .style('stroke', PALETTE.border)
                  .style('stroke-width', '0.5px')
                ;

              // Assign the click handlers if defined
              if (COUNTRY_HANDLERS && COUNTRY_HANDLERS.length) {
                svg.select('path.country')
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
                      drawMarkers(markers);
                    }
                  });
                } else {
                  d3.json(MARKER_FILE.name, function(error, markers) {
                    if (error) {
                      if (console.log) {
                        console.log('Error retrieving marker file');
                      }
                    } else if (markers) {
                      drawMarkers(markers);
                    }
                  });
                }
              }

              // We're done processing, so start the rotation
              ROTATE_3D = true;
              fire('rendered');
            });

          // Start the rotation timer
          d3.timer(function spin() {
              if (ROTATABLE && ROTATE_3D) {
                var tick = (Date.now() - THEN)
                  , angle = VELOCITY * tick
                ;

                LAMBDA += angle;
                projection.rotate([LAMBDA, PHI, 0]);
                svg.selectAll('path').attr('d', path.projection(projection));
              }
              THEN = Date.now();
            });
        }
      }
    };

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

    var d3Colors = d3.scale.category10()
      , MARKER_ANIMATION = 'pulse', MARKER_DESCRIPTION, MARKER_FILE = {}, MARKER_SIZE = 3, MARKER_RELATIVE_SIZE = false
      , PALETTE = {
          border: '#766951',
          colors: [d3Colors(1), d3Colors(2), d3Colors(3), d3Colors(4), d3Colors(5), d3Colors(6), d3Colors(7), d3Colors(8), d3Colors(9), d3Colors(10)],
          marker: '#ff0000',
          markerOpacity: '1.0',
          oceans: '#d8ffff'
        }
      , MAP_WIDTH, MAP_HEIGHT
      , THEN, VELOCITY = 0.05
      , ROTATE_3D, ROTATABLE, DRAGGING, MOUSE_DOWN
      , ID = 'cjl-globe-' + Math.random().toString().replace(/\./, '')
      , COUNTRY_HANDLERS = [ ]
      , EVENT_HANDLERS = { }
      , EVENTS = [ 'accelerated', 'paused', 'rendered', 'resumed', 'slowed' ]
    ;

    // set the container element
    if (typeof ELEM === 'string') {
      ELEM = document.getElementById(ELEM);
    }
    if (!ELEM || ELEM.nodeType !== 1) {
      ELEM = document.body;
    }
    return this;
  };

  return Cathmhaol;
}));
