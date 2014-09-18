cjl
===

# cjl - Cathmhaol JavaScript Library

## What is this?

**cjl** is, simply, a collection of JavaScript libraries that began their life over at [link](http://js.cathmhaol.com) many years ago and are now being (slowly) refactored and ported over to where they're more accessible.

Each library is documented as much as possible, and none are minified. If you want a minified version, please feel free to run the code through a minifier. It is my intention to only commit un-minified versions to this repo so that all of the comments are intact and other engineers can easily see what I'm doing, how I'm doing it, and *most importantly*, why I'm doing it.

## Weapons in the arsenal

Not all libraries have been refactored, so your choice of weapons is somewhat limited. Feel free to grab stuff off http://js.cathmhaol.com, however.

### Earth
A handy little library for quickly developing a map with location markers. You can see a working prototype over at http://products.cathmhaol.com/prototypes/earth/.

*object* Cathmhaol.Earth([*HTMLElement|string* element[, *string* topoJSONuri[, *number* height]]]);  
Example: var earth = Cathmhaol.Earth('map', '/popmap/world-110m.json', 320);

#### Requires:
* d3 --- http://d3js.org/d3.v3.min.js
* d3.geo --- http://d3js.org/d3.geo.projection.v0.min.js
* topoJSON --- http://d3js.org/topojson.v1.min.js
* topoJSONdata --- e.g. world-110m.json

#### Properties

#### Methods
- *void* addOnCountryClick(*function* handler): Adds an event handler for the click event for a country. Inside the handler, the 'this' keyword, refers to the country clicked, and will have the following properties:
    * type: the string 'Feature'
    * id: the topoJSON id
    * properties: an empty object
    * geometry: object containing the type of shape, e.g., Polygon or MultiPolygon, called 'type' and a floating point array called 'coordinates'
    * iso: the ISO 3166 Alpha-2 code
    * name: the country name (in English)
    * color: the index of the palette color used
- *string* borderColor(*string* color): Sets and returns the border color to the provided hexadecimal value
- *HTMLElement* element(*HTMLElement*|*string* element): Sets the element to attach the SVG and returns the element
- *string* markerColor(*string* color): Sets and returns the marker color to the provided hexadecimal value
- *string[]* markerDescriptionData(*string[]* headers): Sets and returns the column headers for the marker description table. Note: column headers must match the data returned in the marker file. If headers are defined, a table is added to the container element (appended after the SVG) and data is pulled from the marker file. For example, using setMarkerDescriptionData(['city', 'country', 'amount']) in conjunction with the example CSV file (shown below), will render an HTML table as &lt;table&gt;&lt;thead&gt;&lt;tr&gt;&lt;th&gt;City&lt;/th&gt;&lt;th&gt;Country&lt;/th&gt;&lt;th&gt;Amount&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;Toronto&lt;/td&gt;&lt;td&gt;CA&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Frakfurt&lt;/td&gt;&lt;td&gt;DE&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Madrid&lt;/td&gt;&lt;td&gt;ES&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Paris&lt;/td&gt;&lt;td&gt;FR&lt;/td&gt;&lt;td&gt;3456&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;London&lt;/td&gt;&lt;td&gt;GB&lt;/td&gt;&lt;td&gt;7890&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Pantelleria&lt;/td&gt;&lt;td&gt;IT&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Milan&lt;/td&gt;&lt;td&gt;IT&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Miami&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Dallas&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;3456&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;San Jose&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;7890&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Washington (DC)&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;New York&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Nulato&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;
- *object* markerFile(*string*|*object* resource[, *string* type]): Sets the URL of the file containing marker data and the file type. The marker parameter may either be a URL string, if the type is provided, or it may be an object containing the url and type, e.g., {name:'/my-markers.csv', type:'csv'}. Returns an object containing the URL of the file containing marker data and the file type, e.g., {name:'/my-markers.csv', type:'csv'}. Each marker definition in the marker file must contain 'longitude', 'latitude', and 'size'. If the marker definition contains 'color', the specified color will be used as the marker color. If the marker definition contains 'country', the country will be added to the marker class. If the marker definition contains
'description', the description will be used to populate the 'data-description' attribute of the marker. Marker file examples are below.
- *float* markerSize(*number*|*string* size): Sets and returns the marker size to the size provided. Size may be specified as a number or as a percentage of overall size, e.g., "10%"
- *object* palette(*string[]*|*object* palette): Sets and returns the palette. The palette parameter may either be an array of hexadecimal strings representing colors or it may be an object containing an array of colors as its 'colors' property. It may optionally have the 'border', 'marker', and 'oceans' colors as properties, e.g. {border:'#333333', colors:['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff'], marker:'#663399', oceans:'#99ccff'}
- *string* topoFile(*string* url): Sets and returns the URL of the topoJSON file
- *void* render([*string* style]): Draws the map. The only valid option for the 'style' parameter at this time is '2D', which renders a flat (Spherical Mercator) map.
- *boolean* rotatable: Returns true when the map can rotate.
- *boolean* rotating: Returns true when the map is actively rotating.
- *void* rotationDecrease: Slows the rotation
- *void* rotationIncrease: Speeds up the rotation
- *void* rotationPause: Pauses the rotation until it is resumed explicitly or by the end of a drag event.
- *void* rotationResume: Restarts the rotation
- *void* rotationStop: Stops the rotation until it is resumed

#### Marker File Examples
*JSON*

    [
      { "country":"GB", "city":"London", "latitude":"51.508056", "longitude":"-0.127778", "size":7 },
      { "country":"DE", "city":"Frankfurt", "latitude":"50.030194", "longitude":"8.588047", "size":3 },
      { "country":"IT", "city":"Milan", "latitude":"45.445103", "longitude":"9.276739", "size":2 },
      { "country":"US", "city":"Phoenix", "latitude":"33.4322013855", "longitude":"-112.007003784", "size":5 }
    ]

*CSV*

    country,latitude,longitude,size,color,amount,city  
    CA,43.677223,-79.630556,2,#9933CC,1234,Toronto  
    DE,50.030194,8.588047,2,#660099,5678,Frakfurt  
    ES,40.493556,-3.566764,2,#CC00FF,9012,Madrid  
    FR,48.856389,2.352222,2,#CC99CC,3456,Paris  
    GB,51.508056,-0.127778,2,#9933DD,7890,London  
    IT,38.175958,13.091019,2,#AA00FF,1234,Pantelleria  
    IT,45.445103,9.276739,2,#AA00FF,5678,Milan  
    US,25.79325,-80.290556,2,#663399,9012,Miami  
    US,32.847111,-96.851778,2,#663399,3456,Dallas  
    US,37.3626,-121.929022,2,#663399,7890,San Jose  
    US,38.944533,-77.455811,3,#663399,1234,Washington (DC)  
    US,40.777245,-73.872608,2,#663399,5678,New York  
    US,64.729444,-158.074167,2,#663399,9012,Nulato 

### ScrollableTable
A handy little library for quickly developing a scrollable, sortable table. The constructor can accept columns specified as strings, e.g.,
['city', 'country', 'latitude', 'longitude'], objects, e.g., [{name:'city', sortable:true}, {name:'country', sortable:true, sort:true}, 
{name:'latitude', sortable:true}, {name:'longitude', sortable:false}], or a even a mixture, e.g., [{name:'city', sortable:true}, 'country', 
{name:'latitude', sortable:false}, {name:'longitude', sortable:false}]. Columns not specified as non-sortable, i.e., without a sortable 
property equal to false, are treated as sortable. The last column containing the sort property will be used as the initial sort. If no
column is specified as the default sort, the first sortable column is used.


*object* Cathmhaol.ScrollableTable(*HTMLElement|string* element, *string[]|object[]* columns, *object[]* data);  
Example:

    d3.csv('/my_rest_api?format=json', function(error, data) {  
     if (error) {
       throw new ReferenceError('Data not available');
     } else if (data) {
       var table = new Cathmhaol.ScrollableTable(document.body, 
         ['city', 'country', 'latitude', 'longitude'], 
         data);
     }
    });
    
    -- will append the following HTML to the document body --
    <table id="cjl-scrollabletable-1410468610353">
      <thead>
        <tr>
          <th id="cjl-scrollabletable-1410468610353-header-column-0" class="sortable desc sorted">
            City
          </th>
          <th id="cjl-scrollabletable-1410468610353-header-column-1" class="sortable">
            Country
          </th>
          <th id="cjl-scrollabletable-1410468610353-header-column-2" class="sortable">
            Latitude
          </th>
          <th id="cjl-scrollabletable-1410468610353-header-column-3" class="sortable">
            Longitude
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Phoenix</td>
          <td>US</td>
          <td>33.4322013855</td>
          <td>-112.007003784</td>
        </tr>
        <tr>
          <td>Milan</td>
          <td>IT</td>
          <td>45.445103</td>
          <td>9.276739</td>
        </tr>
        <tr>
          <td>London</td>
          <td>GB</td>
          <td>51.508056</td>
          <td>-0.127778</td>
        </tr>
        <tr>
          <td>Frankfurt</td>
          <td>DE</td>
          <td>50.030194</td>
          <td>8.588047</td>
        </tr>
      </tbody>
    </table>
    
    -- and the following style (widths may be different, based on font sizes) --
    <style id="cjl-scrollabletable-style" type="text/css">
      #cjl-scrollabletable-1410468610353 .sortable { 
        cursor:pointer; 
        padding:inherit 0.1em; 
      }
      #cjl-scrollabletable-1410468610353 .sortable:after { 
        border-bottom:0.3em solid #000;
        border-left:0.3em solid transparent;
        border-right:0.3em solid transparent;
        bottom:0.75em;
        content:"";
        height:0;
        margin-left:0.1em;
        position:relative;
        width:0;
      }
      #cjl-scrollabletable-1410468610353 .sortable.desc:after { 
        border-bottom:none;
        border-top:0.3em solid #000;
        top:0.75em;
      }
      #cjl-scrollabletable-1410468610353 .sortable.sorted { 
        color:#ff0000;
      }
      #cjl-scrollabletable-1410468610353 { 
        border:1px solid #000;
        box-shadow:0.5em 0.5em 0.25em rgba(136, 136, 136, 0.5);
      }
      #cjl-scrollabletable-1410468610353 tbody { 
        height:10em;
        overflow-y:scroll;
      }
      #cjl-scrollabletable-1410468610353 thead, 
      #cjl-scrollabletable-1410468610353 tbody { 
        display:block;
      }
      #cjl-scrollabletable-1410468610353 th:nth-of-type(1),
      #cjl-scrollabletable-1410468610353 td:nth-of-type(1) { 
        width:185px;
      }
      #cjl-scrollabletable-1410468610353 th:nth-of-type(2),
      #cjl-scrollabletable-1410468610353 td:nth-of-type(2) { 
        width:80px;
      }
      #cjl-scrollabletable-1410468610353 th:nth-of-type(3),
      #cjl-scrollabletable-1410468610353 td:nth-of-type(3) { 
        width:185px;
      }
      #cjl-scrollabletable-1410468610353 th:nth-of-type(4),
      #cjl-scrollabletable-1410468610353 td:nth-of-type(4) { 
        width:185px;
      }
    </style>


#### Requires:
* d3 --- http://d3js.org/d3.v3.min.js

#### Properties

#### Methods

#### Data File Examples
*JSON*

    [
      { "country":"GB", "city":"London", "latitude":"51.508056", "longitude":"-0.127778", "size":7 },
      { "country":"DE", "city":"Frankfurt", "latitude":"50.030194", "longitude":"8.588047", "size":3 },
      { "country":"IT", "city":"Milan", "latitude":"45.445103", "longitude":"9.276739", "size":2 },
      { "country":"US", "city":"Phoenix", "latitude":"33.4322013855", "longitude":"-112.007003784", "size":5 }
    ]

*CSV*

    country,latitude,longitude,size,color,amount,city  
    CA,43.677223,-79.630556,2,#9933CC,1234,Toronto  
    DE,50.030194,8.588047,2,#660099,5678,Frakfurt  
    ES,40.493556,-3.566764,2,#CC00FF,9012,Madrid  
    FR,48.856389,2.352222,2,#CC99CC,3456,Paris  
    GB,51.508056,-0.127778,2,#9933DD,7890,London  
    IT,38.175958,13.091019,2,#AA00FF,1234,Pantelleria  
    IT,45.445103,9.276739,2,#AA00FF,5678,Milan  
    US,25.79325,-80.290556,2,#663399,9012,Miami  
    US,32.847111,-96.851778,2,#663399,3456,Dallas  
    US,37.3626,-121.929022,2,#663399,7890,San Jose  
    US,38.944533,-77.455811,3,#663399,1234,Washington (DC)  
    US,40.777245,-73.872608,2,#663399,5678,New York  
    US,64.729444,-158.074167,2,#663399,9012,Nulato 

## Licensing

Who are we kidding here? If I tried to provide a license other than *do whatever you want* what would be the point? Seriously. The only thing you *can't* do is contribute back to this repo. ***I am the Cathmhaol*. *There can be only one*.**
