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
   * @param    {string|HTMLElement} container  The HTML element that will contain the table
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
    var default_sort
      , id_style = 'cjl-STable-style'                                                 // id for the style element
      , id_table = 'cjl-STable-' + (new Date()).getTime()                             // unique table id
      , keys = { }                                                                    // variable used to obtain keys from the data file if columns are not passed
      , prop                                                                          // variable used to obtain keys from the data file if columns are not passed
      , row                                                                           // variable used to obtain keys from the data file if columns are not passed
      , ndx                                                                           // loop index
      , rules = [ ]                                                                   // stylesheet rules
      , sorted = false                                                                // table has been sorted
      , style = document.getElementById(id_style) || document.createElement('style')  // the style element for the table
      , table                                                                         // the table
      , tbody                                                                         // the body of the table
      , tcells                                                                        // cells in the table
      , tfoot                                                                         // the table footer
      , thead                                                                         // the header of the table
      , trows                                                                         // rows in the table
    ;

    function parseTable() {
      var i, obj, key_index;

      // parse the table
      table = container;

      id_table = table.id || id_table;

      thead = table.getElementsByTagName('thead').item(0);
      tbody = table.getElementsByTagName('tbody').item(0);
      tfoot = table.getElementsByTagName('tfoot').item(0);

      container = table.parentNode;
      data = [ ];
      columns = columns || [ ];

      tcells = thead.rows[0].cells
      for (ndx = 0; ndx < tcells.length; ndx += 1) {
        obj = {name:null, classed:null, sortable:null};
        for (i = 0; i < columns.length; i += 1) {
          if ((columns[i].name || columns[i] || '').toLowerCase() === tcells[ndx].innerHTML.toLowerCase()) {
            obj = columns[i];
            break;
          }
        }
        key_index = (obj.name || tcells[ndx].innerHTML);
        keys[key_index] = { name:key_index, classed:(obj.classed || tcells[ndx].className), sortable:(obj.sortable === false ? false : true)};
        columns[ndx] = keys[key_index];
      }

      function row(spec, trow) {
        var ndx, obj = { };
        for (ndx = 0; ndx < spec.length; ndx += 1) {
          obj[spec[ndx].name] = {_value:trow.cells[ndx].innerHTML, _classed:trow.cells[ndx].className };
        }
        return obj;
      }

      trows = tbody.rows;
      for (ndx = 0; ndx < trows.length; ndx += 1) {
        data.push(new row(columns, trows[ndx]));
      }
    }

    // if we're passed an existing table set up the data
    if ((/table/i).test(container.nodeName)) {
      parseTable();
    }

    if (data && data.length) {
      // default the columns
      if (!columns || !columns.length) {
        columns = [ ];
        for (row in data) {
          for (prop in data[row]) {
            keys[prop] = true;
          }
        }
        for (prop in keys) {
          keys[prop] = { name:prop, classed:null, sortable:true };
          columns.push(keys[prop]);
        }
      } else {
        // set the keys and columns
      }

      // add a table if it has been defined
      if (columns && columns.length) {
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
        table = table ? d3.select(table) : d3.select(container).append('table');

        // set the scrollable attributes
        table.attr('class', [table.attr('class'), 'scrollable'].join(' '))
             .attr('id', id_table)
          ;

        // set the headers as sortable
        if (!thead) {
          thead = thead || table.append('thead');
        } else {
          thead = d3.select(thead);
          thead.html('');
        }

        // append the header row
        thead.append('tr')
             .selectAll('th')
             .data(columns)
             .enter()
             .append('th')
               .attr('class', function(d, i) {
                  var issort = (d.sortable === null || d.sortable === undefined) ? true : d.sortable
                    , classes = [ ]
                  ;
                  classes.push(d.classed);
                  classes.push((d.name || d).toLowerCase().replace(/\s/g, '-'));
                  classes.push(issort ? 'sortable' : null);
                  return classes.join(' ');
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
                        a = a[d]._value || a[d];  // select the property to compare
                        b = b[d]._value || b[d];  // select the property to compare
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
                        a = a[d]._value || a[d];  // select the property to compare
                        b = b[d]._value || b[d];  // select the property to compare
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

        if (!tfoot) {
          tfoot = table.append('tfoot');
        } else {
          tfoot = d3.select(tfoot);
          tfoot.html('');
        }

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

        // set the table body
        if (!tbody) {
          tbody = table.append('tbody');
        } else {
          tbody = d3.select(tbody);
          tbody.html('');
        }

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
                           return { column: (column.name || column)
                                  , value: (row[(column.name || column)]._value || row[(column.name || column)])
                                  , classed: (row[(column.name || column)]._classed || '')
                             };
                         });
                       })
                      .enter()
                      .append('td')
                        .attr('class', function(d) {
                           return d.column.toLowerCase().replace(/\s/g, '-') + (d.classed ? ' ' : '') + d.classed;
                         })
                        .html(function(d) {
                           return d.value;
                         })
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
  };

  return Cathmhaol;
}));
