(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['d3'], function(d3) {
      return (root.Cathmhaol = factory(d3, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'));
  } else {
    root.Cathmhaol = factory(root.d3, root);
  }
}(this, function(d3, window) {
  'use strict';

  var Cathmhaol = window.Cathmhaol || {};

  /**
   * Creates a scrollable, sortable table
   *
   * @param    {string|HTMLElement} container  The unique ID of the HTML element to contain the object
   * @param    {string[]} columns              A string array containing column names corresponding to property names in D3 data
   * @param    {object[]} data                 The D3 data collection
   *
   * @requires d3            http://d3js.org/d3.v3.min.js
   *
   * @author   Robert King (hrobertking@cathmhaol.com)
   *
   * @example  d3.csv('/my_rest_api?format=csv', function(error, data) { if (error) { throw new ReferenceError('Data not available'); } else if (data) { var table = new Cathmhaol.ScrollableTable(document.body, ['foo', 'bar', 'snafu'], data); }
   */
  Cathmhaol.ScrollableTable = function(container, columns, data) {
    var id_style = 'cjl-scrollabletable-style'
      , id_table = 'cjl-scrollabletable-' + (new Date()).getTime()
      , ndx          // loop index
      , rules = [ ]  // stylesheet rules
      , style = document.getElementById(id_style) || document.createElement('style')
      , table        // the marker description table
      , tbody        // the body of the marker description table
      , tcells       // cells in the marker description table
      , thead        // the header of the marker description table
      , trows        // rows in the marker description table
    ;

    // Add a description table if it has been defined
    if (columns && columns.length) {
      id_style = 'cjl-scrollabletable-style';
      id_table = 'cjl-scrollabletable-' + (new Date()).getTime();

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

        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
        document.body.appendChild(style);
      }

      // create the table
      table = d3.select(container).append('table')
                  .attr('id', id_table)
        ;
      thead = table.append('thead');
      tbody = table.append('tbody');

      // append the header row
      thead.append('tr')
           .selectAll('th')
           .data(columns)
           .enter()
           .append('th')
             .attr('id', function(d, i) {
                return id_table + '-header-column-' + i;
              })
             .attr('class', 'sortable')
             .text(function(d, i) {
                return d.replace(/\b\w+/g, function(s) {
                  return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
                });
              })
             .on('click', function (d, i) {
                var clicked = d3.select('#' + id_table + '-header-column-' + i)
                  , sorted = d3.select(clicked.node().parentNode).selectAll('.sortable.sorted')
                  , desc = clicked.classed('desc')
                ;

                // reset the 'sorted' class on siblings
                sorted.classed('sorted', false);

                if (desc) {
                  clicked.classed({'desc': false, 'sorted': true});
                  tbody.selectAll('tr').sort(function ascending(a, b) {
                      var ret = 0;
                      a = a[d];  // select the property to compare
                      b = b[d];  // select the property to compare
                      if (a !== null && a !== undefined) {
                        if (a.localeCompare) {
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
                        if (b.localeCompare) {
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

      // create a row for each object in the data
      trows = tbody.selectAll('tr')
                   .data(data)
                   .enter()
                   .append('tr')
        ;

      // create a cell in each row for each column
      tcells = trows.selectAll('td')
                    .data(function(row) {
                       return columns.map(function(column) {
                         return {column: column, value: row[column]};
                       });
                     })
                    .enter()
                    .append('td')
                      .html(function(d) { return d.value; })
        ;

      // build the stylesheet
      if (style) {
        // style for a scrollable table
        rules = [];
        rules.push('#' + id_table + ' { border:1px solid #000; box-shadow:0.5em 0.5em 0.25em rgba(136, 136, 136, 0.5); }');
        rules.push('#' + id_table + ' tbody { height:10em; overflow-y:scroll; }');
        rules.push('#' + id_table + ' thead, #' + id_table + ' tbody { display:block; }');

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
      tcells = document.getElementById(id_table).getElementsByTagName('th');
      for (ndx = 0; ndx < tcells.length; ndx += 1) {
        if ((/\bsortable\b/).test(tcells.item(ndx).className)) {
          tcells.item(ndx).click();
          break;
        }
      }
    }

  };

  return Cathmhaol;
}));
