cjl
===

# cjl - Cathmhaol JavaScript Library

## What is this?

**cjl** is, simply, a collection of JavaScript libraries that began their life over at [cathmhaol.com](http://js.cathmhaol.com) many years ago and are now being (slowly) refactored and ported over to where they're more accessible.

Each library is documented as much as possible, and none are minified. If you want a minified version, please feel free to run the code through a minifier. It is my intention to only commit un-minified versions to this repo so that all of the comments are intact and other engineers can easily see what I'm doing, how I'm doing it, and *most importantly*, why I'm doing it.

## Weapons in the arsenal

Not all libraries have been refactored, so your choice of weapons is somewhat limited. Feel free to grab stuff off http://js.cathmhaol.com, however.

-----
### *Calendar*
A handy little library that facilitates date arithmetic and internationalization.

###### Constructor Parameters
- None

###### Example
var thanksgiving = Cathmhaol.Calendar.ordinalDate(2015, Cathmhaol.Calendar.NOVEMBER, 3, Cathmhaol.Calendar.THURSDAY);

##### Requires
- None

##### Demo
- None

##### Events
- None

##### Properties
- ***APRIL***: Numerical constant 3.
- ***AUGUST***: Numerical constant 7.
- ***DAYS***: A collection of day names (longName and shortName) for several languages. For example, Cathmhaol.Calendar.DAYS['de'][0].longName = 'Sonntag' and Cathmhaol.Calendar.DAYS['en'][6].shortName = 'Sun'.
- ***DECEMBER***: Numerical constant 11.
- ***FEBRUARY***: Numerical constant 1.
- ***FRIDAY***: Numerical constant 5.
- ***JANUARY***: Numerical constant 0.
- ***JULY***: Numerical constant 6.
- ***JUNE***: Numerical constant 5.
- ***MARCH***: Numerical constant 2.
- ***MAY***: Numerical constant 4.
- ***MONDAY***: Numerical constant 1.
- ***MONTHS***: A collection of month names (longName and shortName) for several languages. For example, Cathmhaol.Calendar.MONTHS['es'][3].longName = 'abril' and Cathmhaol.Calendar.MONTHS['en'][9].shortName = 'Oct'.
- ***NOVEMBER***: Numerical constant 10.
- ***OCTOBER***: Numerical constant 9.
- ***PERIODS***: A collection of periods, each period contains a code, abbreviation, and name. For example, Cathmhaol.Calendar.PERIODS.DAY.name = 'day' and Cathmhaol.Calendar.PERIODS.MONTH.code = 'm'.
    * DAY
    * HOUR
    * MINUTE
    * MONTH
    * QUARTER
    * SECOND
    * WEEK
    * YEAR
- ***SATURDAY***: Numerical constant 6.
- ***SEPTEMBER***: Numerical contant 8.
- ***SUNDAY***: Numerical constant 0.
- ***THURSDAY***: Numerical constant 4.
- ***TUESDAY***: Numerical constant 2.
- ***WEDNESDAY***: Numerical constant 3.

##### Methods
- ***date* dateAdd(*string*|*Cathmhaol.Calendar.PERIOD* period, *number* periods, *date*|*number*|*string* start)**: Adds the specified number of periods to the starting date and returns the result.
- ***float* dateDiff(*string*|*Cathmhaol.Calendar.PERIOD* period, *date*|*number*|*string* start, *date*|*number*|*string* end)**: Returns the number of periods between the start and end dates
- ***integer* dayOfTheWeek(*date*|*number*|*string* date)**: Returns a number between 0 and 6 representing the day of the week. Sunday is 0 and Saturday is 6.
- ***integer* daysInMonth(*date*|*number*|*string* date)**: Returns the number of days in the month represented by the date provided.
- ***object* getLocalizedDate(*date*|*number*|*string* date, *string* language)**: Returns an object containing the 'date', 'day', 'dayName', 'month', 'monthName', and 'year' representing the specified date for the given ISO 639-1 language code.
- ***boolean* isDate(*object* date)**: Returns true if the provided object is a date object.
- ***boolean* isLeapYear(*date*|*number*|*string* date)**: Returns true if the provided date is during a leap year.
- ***boolean* isSupportedLanguage(*string* language)**: Returns true if the provided ISO 639-1 code represents a supported language.
- ***date* ordinalDate(*number* year, *number* month, *number* ordinalIndex, *number* dayOfTheWeek)**: Returns a date representing the ordinal day of the week. For example, the 3rd Monday in January of 2015 (var d = Cathmhaol.Calendar.ordinalDate(2015, Cathmhaol.Calendar.JANUARY, 3, Cathmhaol.Calendar.MONDAY) would return January 19th, 2015.
- ***date* parse(*date*|*number*|*string* date[, *boolean* default])**: Returns a parsed date. If the parsed date is invalid, the value returned is either null or the current date (if the 'default' parameter is true).
- ***string[]* supportedLanguages()**: Returns an array of supported ISO 639-1 language codes.

-----
### *CreditCard*
This library facilitates the validation of credit cards, relying on the validation engine built using the Validator library. The CreditCard object can be created by passing the
form elements into the constructor using the named parameters below.

###### Constructor Parameters
- ***string|HTMLElement* acct**:
- ***string|HTMLElement* mm**:
- ***string|HTMLElement* yy**:
- ***string|HTMLElement* csc**:
- ***string|HTMLElement* type**:

###### Example
var ccn = new Cathmhaol.CreditCard(document.getElementById('card-number'), document.getElementById('card-exp-mo'), document.getElementById('card-exp-yr'), document.getElementById('card-cscnum'));

##### Requires
- Cathmhaol.Validator --- http://js.cathmhaol.com/cjl-validator.js
- Cathmhaol.Validation --- http://js.cathmhoal.com/cjl-validation.js

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/cc-input/)

##### Events
- ***acct*** is fired when the account number is invalid.
- ***cvv*** is fired when the CVV (or CSC) is invalid.
- ***expired*** is fired when the card is expired.
- ***typeChanged*** is fired when the card type is changed.

##### Properties
- ***string* type**: One of Cathmhaol.Validation.Types.CREDIT_CARD.types, e.g., AMEX, CHINA_UNION_PAY, DISCOVER, or VISA

##### Methods
- ***string* getAccount()**: Returns the account number.
- ***string* getCVV2()**: Returns the CVV
- ***string* getExpiry()**: Returns the expiration date.

-----
### *Earth*
A handy little library for quickly developing a map with location markers. You can see a working prototype over at http://products.cathmhaol.com/prototypes/earth/.

###### Constructor Parameters
- ***string|HTMLElement* container**: The unique ID of the HTML element to contain the object
- ***string* topo**: The URI of a topo file
- ***number* width**: The diameter of the globe or the width of the map in pixels
- ***string* style**: The style to use
- ***string|HTMLElement* descriptor**: The element (or unique id identifying it) to contain the descriptor table

###### Example
var earth = Cathmhaol.Earth('map', '/popmap/world-110m.json', 320);

##### Requires:
- d3 --- http://d3js.org/d3.v3.min.js
- d3.geo --- http://d3js.org/d3.geo.projection.v0.min.js
- topoJSON --- http://d3js.org/topojson.v1.min.js
- topoJSONdata --- e.g. world-110m.json

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/earth/)

##### Events
- ***accelerated*** is fired when the rotation of a globe is accelerated
- ***paused*** is fired when the rotation of a globe is paused
- ***rendered*** is fired when the map is rendered
- ***resumed*** is fired when the rotation of a globe is restarted/resumed
- ***slowed*** is fired when the rotation of a globe is slowed

##### Properties
- None

##### Methods
- ***void* addOnCountryClick(*function* handler)**: Adds an event handler for the click event for a country. Inside the handler, the 'this' keyword refers to the country clicked, and will have the following properties:
    * color: the index of the palette color used
    * geometry: object containing the type of shape, e.g., Polygon or MultiPolygon, called 'type' and a floating point array called 'coordinates'
    * id: the topoJSON id
    * iso: the ISO 3166 Alpha-2 code
    * name: the country name (in English)
    * properties: an empty object
    * type: the string 'Feature'
- ***void* addOnMarkerClick(*function* handler)**: Adds an event handler for the click event for a marker. Inside the handler, the 'this' keyword refers to the marker
clicked, and will hae the following properties:
    * coordinates: a two-element array containing the longitude (element 0) and latitude (element 1) of the marker
    * marker: all data elements contained in the original dataset, e.g, latitude, longitude, size, and color
    * type: the string 'Point'
- ***string* borderColor(*string* color)**: Sets and returns the border color to the provided hexadecimal value
- ***HTMLElement* element(*HTMLElement*|*string* element)**: Sets the element to attach the SVG and returns the element
- ***string[]* events()**: Returns a string array listing event names for all events fired by the map
- ***string* id()**: Returns the id of the SVG used to display the map.
- ***string* markerAnimation(*string* type)**: Sets and returns the marker animation. Valid values are 'none', 'ping', or 'pulse'.
- ***number* markerAnimationDuration(*number* duration)**: The number of milliseconds the marker animation should run in a cycle. Default is 1500 (i.e. 1.5 seconds)
- ***string* markerColor(*string* color)**: Sets and returns the marker color to the provided hexadecimal value
- ***string[]* markerDescriptionData(*string[]* headers)**: Sets and returns the column headers for the marker description table. Note: column headers must match the data returned in the marker file. If headers are defined, a table is added to the container element (appended after the SVG) and data is pulled from the marker file. For example, using setMarkerDescriptionData(['city', 'country', 'amount']) in conjunction with the example CSV file (shown below), will render an HTML table as &lt;table&gt;&lt;thead&gt;&lt;tr&gt;&lt;th&gt;City&lt;/th&gt;&lt;th&gt;Country&lt;/th&gt;&lt;th&gt;Amount&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;Toronto&lt;/td&gt;&lt;td&gt;CA&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Frakfurt&lt;/td&gt;&lt;td&gt;DE&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Madrid&lt;/td&gt;&lt;td&gt;ES&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Paris&lt;/td&gt;&lt;td&gt;FR&lt;/td&gt;&lt;td&gt;3456&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;London&lt;/td&gt;&lt;td&gt;GB&lt;/td&gt;&lt;td&gt;7890&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Pantelleria&lt;/td&gt;&lt;td&gt;IT&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Milan&lt;/td&gt;&lt;td&gt;IT&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Miami&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Dallas&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;3456&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;San Jose&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;7890&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Washington (DC)&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;1234&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;New York&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;5678&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Nulato&lt;/td&gt;&lt;td&gt;US&lt;/td&gt;&lt;td&gt;9012&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;
- ***object* markerFile(*string*|*object* resource[, *string* type])**: Sets the URL of the file containing marker data and the file type. The marker parameter may either be a URL string, if the type is provided, or it may be an object containing the url and type, e.g., {name:'/my-markers.csv', type:'csv'}. Returns an object containing the URL of the file containing marker data and the file type, e.g., {name:'/my-markers.csv', type:'csv'}. Each marker definition in the marker file must contain 'longitude', 'latitude', and 'size'. If the marker definition contains 'color', the specified color will be used as the marker color. If the marker definition contains 'country', the country will be added to the marker class. If the marker definition contains
'description', the description will be used to populate the 'data-description' attribute of the marker. Marker file examples are below.
- ***float* markerOpacity(*number*|*string* opacity)**: Sets and returns the opacity of the marker animation. Valid values are between 0 (transparent) and 1 (opaque).
- ***float* markerSize(*number*|*string* size)**: Sets and returns the marker size to the size provided. Size may be specified as a number or as a percentage of overall size, e.g., '10%'
- ***void* on(*string* eventname, *function* handler)**: Subscribes an event handler to the specified event. Valid event names can be found in the array returned by the 'events' function, but are at this time limited to 'accelerated', 'paused', 'rendered', 'resumed', and 'slowed'.
- ***object* palette(*string[]*|*object* palette)**: Sets and returns the palette. The palette parameter may either be an array of hexadecimal strings representing colors or it may be an object containing an array of colors as its 'colors' property. It may optionally have the 'border', 'marker', and 'oceans' colors as properties, e.g. {border:'#333333', colors:['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff'], marker:'#663399', oceans:'#99ccff'}
- ***void* parseMarkerData(*string*|*HTMLElement* table)**: Enables passing in marker data via an HTML table rather than as a file that is obtained via AJAX. Tables, like marker file data, must contain latitude, longitude, and size information and may optionally contain more detail. *See **markerFile** for more information.*
- ***void* refreshMarkerData([*string*|*number* interval])**: Retrieves the marker data and fires an event when the marker data is retrieved. If an interval (in seconds) is specified, it is used to automatically refresh the marker data. The interval value must be greater than 59 seconds.
- ***void* render([*string* style])**: Draws the map. The only valid option for the 'style' parameter at this time is '2D', which renders a flat (Spherical Mercator) map.
- ***boolean* rendered()**: Returns true if countries have been rendered on the map.
- ***boolean* rotatable()**: Returns true when the map can rotate.
- ***boolean* rotating()**: Returns true when the map is actively rotating.
- ***void* rotationDecrease(*string*|*number* rate)**: Slows the rotation by the specified rate. Rate may be either a string, including a percentage (e.g., '50%') or a number. If the rate is a percentage, the adjustment is a percentage of the current velocity (degrees per millisecond). Default rate is 0.005 degrees per millisecond.
- ***void* rotationIncrease(*string*|*number* rate)**: Accelerates the rotation by the specified rate. Rate may be either a string, including a percentage (e.g., '50%') or a number. If the rate is a percentage, the adjustment is a percentage of the current velocity (degrees per millisecond). Default rate is 0.005 degrees per millisecond.
- ***void* rotationPause()**: Pauses the rotation until it is resumed explicitly or by the end of a drag event.
- ***void* rotationResume()**: Restarts the rotation
- ***void* rotationStop()**: Stops the rotation until it is resumed
- ***string* style(*string* style)**: Sets and returns the style of map to use. Valid value is '2D' - any other value reverts to 'globe'.
- ***string[]* supportedTypes()**: Returns an array of supported map styles, e.g., 'Albers', 'Baker', 'Craster Parabolic', 'Equirectangular (Plate Carrée)', 'Hammer', 'Goode Homolosine', 'Kavrayskiy VII', 'Lagrange', 'McBryde-Thomas Flat-Polar Parabolic', 'Natural Earth', 'Orthographic', 'Polyconic', 'Robinson', 'Sinusoidal', 'van der Grinten', 'Wagner IV'
- ***string* topoFile(*string* url)**: Sets and returns the URL of the topoJSON file
- ***void* transition(*string* style[, *number* duration])**: Animates the transition from the current map style to the map style provided (an enum of supportedTypes). Animation runs for the specified duration (in milliseconds) or 750ms. Because of the overhead involved in transitions, it is recommended to limit the number of transitions, also, be aware that there may be some difficulties in transitioning between two different projections and it may be better to render the new style rather than animate the transition.
- ***void* travel(*string*|*object*|*object[]* data[, *object* marker[, *number* duration[, *boolean* loop[, *boolean* combineAnimation]]]])**: Animates travel along routes defined in the specified data - identified by a resource object (i.e., a URL string or an object with 'name' and type' properties) or an array of objects with 'origin' and 'destination' properties - using the specified marker. The animation runs for the specified duration (in milliseconds) or 1000ms and will loop when specified. For example, earth.travel([ { origin:[-84.428067, 33.636719], destination:[[-115.15225, 36.080056], [-115.15225, 36.080056], [-104.673178, 39.861656], [-87.904842, 41.978603], [0.461389, 51.4775]] } ], {d:"m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0l0.00002,0.00001z", orient:true, scale:0.3 }, 2000, true); will create an animated loop that will show airplanes flying from LAX to LAS, LAS to DEN, DEN to ORD, and ORD to LHR.

###### Marker Data Examples
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

*HTML Table*
```html
<table>  
  <thead>  
    <tr><th>Country</th><th>City</th><th>Activity</th><th>Name</th><th>Latitude</th><th>Longitude</th><th>Size</th></tr>  
  </thead>  
  <tbody>  
    <tr><td>US</td><td>ATL</td><td>68343</td><td>Hartsfield Jackson Atlanta International</td><td>33.636719</td><td>-84.428067</td><td>16</td></tr>  
    <tr><td>US</td><td>ORD</td><td>59692</td><td>Chicago O'Hare International</td><td>41.978603</td><td>-87.904842</td><td>14</td></tr>  
    <tr><td>US</td><td>DFW</td><td>56496</td><td>Dallas Fort Worth International</td><td>32.896828</td><td>-97.037997</td><td>12</td></tr>  
    <tr><td>US</td><td>LAX</td><td>51396</td><td>Los Angeles International</td><td>33.942536</td><td>-118.408075</td><td>10</td></tr>  
    <tr><td>CN</td><td>PEK</td><td>48226</td><td>Capital International</td><td>40.080111</td><td>116.584556</td><td>10</td></tr>  
    <tr><td>US</td><td>CLT</td><td>44583</td><td>Charlotte Douglas International</td><td>35.214</td><td>-80.943139</td><td>8</td></tr>  
    <tr><td>US</td><td>DEN</td><td>44438</td><td>Denver International</td><td>39.861656</td><td>-104.673178</td><td>8</td></tr>  
    <tr><td>US</td><td>LAS</td><td>41164</td><td>McCarran International</td><td>36.080056</td><td>-115.15225</td><td>6</td></tr>  
    <tr><td>US</td><td>IAH</td><td>39808</td><td>George Bush Intercontinental</td><td>29.984433</td><td>-95.341442</td><td>6</td></tr>  
    <tr><td>GB</td><td>LHR</td><td>37680</td><td>London Heathrow</td><td>51.4775</td><td>-0.461389</td><td>4</td></tr>  
  </tbody>  
</table>  
```

-----
### *ProfileProgress*
A small library that will draw an avatar with a progress bar, showing the degree of profile completion. The constructor can accept
either several parameters, as listed below, or a single configuration object with properties named according to the parameter names,
e.g., { 'animate':true, 'img':'http://www.cathmhaol.com/images/home.gif', 'comp':oUserProfile.completion, 'canvas':'profile' }.

###### Constructor Parameters
- ***string|HTMLElement* img**: Profile image
- ***number* comp**: Percentage complete
- ***string|HTMLElement* canvas**: The canvas element
- ***number* imgHeight**: Height of the profile picture
- ***number* height**: Height of profile component
- ***number* width**: Width of profile component
- ***number* thickness**: Thickness of the progress bar
- ***string|object* color**: Color to be used for the progress bar/circle
- ***string|object* bgColor**: Color to be used for the uncompleted portion of the progress bar/circle
- ***string* overlay**: Overlay percentage complete as text
- ***string* font**: Font to use for overlay
- ***boolean* animate**: Animate the progress
- ***boolean* bar**: Use a bar instead of a circle
- ***boolean* sqr**: The profile picture should be square

###### Example
var prof = new Cathmhaol.ProfileProgress( { img:'http://www.cathmhaol.com/images/home.gif', comp:user_profile.completion * 100, canvas:'profile', height:300, thickness:10, color:{red:124, green:192, blue:220}, overlay:comp.innerHTML, font:'20px Verdana', animate:true });

##### Requires
- None

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/profile/)

##### Events
- None

##### Properties
- None

##### Methods
- ***void* animate()**: Animates the progress bar.

-----
### *ScrollableTable*
A handy little library for quickly developing a scrollable, sortable table. The constructor can accept columns specified as strings, e.g.,
['city', 'country', 'latitude', 'longitude'], objects, e.g., [{name:'city', sortable:true}, {name:'country', sortable:true, sort:true}, 
{name:'latitude', sortable:true}, {name:'longitude', sortable:false}], or a even a mixture, e.g., [{name:'city', sortable:true}, 'country', 
{name:'latitude', sortable:false}, {name:'longitude', sortable:false}]. Columns not specified as non-sortable, i.e., without a sortable 
property equal to false, are treated as sortable. The last column containing the sort property will be used as the initial sort. If no
column is specified as the default sort, the first sortable column is used.

If the *element* parameter is a table node, the table is not appended to the element, but is instead transformed into a scrollable, sortable
table. Columns are considered to be 'sortable' unless they are specifically identified as not sortable. You can see a working prototype over at 
http://products.cathmhaol.com/prototypes/scrollabletable/

###### Constructor Parameters
- ***string|HTMLElement* element**: The table element or the element to contain the scrollable table
- ***string[]|object[]* columns**: A collection of column names or objects containing column names.
- ***object[]* data**: A d3 dataset.

###### Example
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


##### Requires:
- d3 --- http://d3js.org/d3.v3.min.js

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/scrollabletable/)

##### Events
- None

##### Properties
- None

##### Methods
- None

###### Data File Examples
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

-----
### *Shapes*
A handy little collection of SVG shapes a method to draw them and a method to resize and center them. Each shapes has the following properties:
- ***d***: The value to use as the 'd' attribute of a path element
- ***orient***: The 'front' of the object, e.g., an airplane, faces north and should be oriented during movement.
- ***size***: The pixel size. Contains both height and width properties.

###### Example
var shape = Cathmhaol.Shapes.Airplane;

##### Requires
- None

##### Demo
- None

##### Events
- None

##### Properties
- **Airplane**: An airplane facing north
- **MapMarker**: A circle inside a teardrop pointing south

##### Methods
- ***void* draw(*shape* shape, *string*|*HTMLElement* container[, *string*|*number* width[, *string*|*number* height]])**: Draws the specified shape, using the specified dimensions or the height and width of the container. Example: Cathmhaol.Shapes.draw(Cathmhaol.Shapes.Airplane, document.body, 100, 100);
- ***string* matrix(*object* shape, (*string*|*HTMLElement* container | *string*|*number* width, *string*|*number* height))**: Returns the maxtrix string for transformation. Example: path.setAttribute('transform', 'matrix(''matrix(' + Cathmhaol.Shapes.matrix(Cathmhaol.Shapes.MapMarker, 50, 50) + ')'); or path.setAttribute('transform', 'matrix(''matrix(' + Cathmhaol.Shapes.matrix(Cathmhaol.Shapes.MapMarker, document.getElementById('foo')) + ')');

-----
### *Validation*
Each validation object will have the properties 'key' and 'complete', and may have one or more of the following properties: 'max' - the maximum numeric value the type may hold (e.g., 12 for MONTH
or 31 for DAY); 'min' - the minimum numeric value the type may hold (e.g., 1 for MONTH or DAY); and 'restricted' - the value after a keypress must be valid according to the 'completed' regular expression.

The CREDIT_CARD type has a 'types' property that is a collection of objects, each containing a 'bin', a 'csc', a 'lengths' array, and a 'validation' flag. Additionally, the CREDIT_CARD
'types' property has two methods: 'lookup', which takes an account number as a string as a parameter and returns the matching CREDIT_CARD.types object, and 'toString', which returns
a string array of card types (e.g., ['AMEX', 'CHINA_UNION_PAY', 'JCB', 'MASTERCARD', 'VISA']).

##### Requires
- None

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/profile/)

##### Events
- None

##### Properties
- ***object* Types**:
    * ***object* ALPHA**: Alpha characters only. Valid characters are A to Z and Unicode characters 00A1 through FFFF.
    * ***object* CREDIT_CARD**: Credit/debit card types
    * ***object* DAY**: A numeric value 1 to 31
    * ***object* EMAIL**: A valid email address.
    * ***object* IBAN**: An International Bank Account Number (see [wikipedia](http://en.wikipedia.org/wiki/International_Bank_Account_Number) for more details).
    * ***object* INTEGER**: Any integer.
    * ***object* HEX**: A hexadecimal number, represented by (case-insensitive) characters 0 through 9 and A through F
    * ***object* FLOAT**: A floating-point number.
    * ***object* MONTH**: A numeric value 1 to 12.
    * ***object* NAME**: Characters typically used in an individual's name, i.e., A to Z, Unicode characters 00A1 through FFFF, comma, hyphen, and space.
    * ***object* SIGNED**: A signed floating-point number
    * ***object* TIME**: Digits separated by a colon.
    * ***object* YEAR_FUTURE**: A four-digit integer, with the minimum value equal to the current year.
    * ***object* YEAR_PAST**: An integer, with the maximum value equal to the current year.
    * ***object* YR_FUTURE**: A two-digit integer, with the minimum value equal to the current year.
    * ***object* YR_PAST**: A two-digit integer, with the maximum value equal to the current year.

##### Methods
- None

-----
### *Validator*
This library is the Cathmhaol validation engine. With it, validation routines can be assigned to HTMLElements with ease, including enhanced validation (beyond the
keystroke and completion validation easily implemented with the Cathmhaol Validation library.

###### Constructor Parameters
- ***string|HTMLElement* node**: The a string containing the id of the HTMLElement, or the HTMLElement itself, that should be validated.
- ***boolean* required**: When true, marks the HTMLElement validation as requiring a non-empty string.
- ***Cathmhaol.Validation.Types* type**: The validation type, e.g., Cathmhaol.Validation.Types.INTEGER or Cathmhaol.Validation.Types.EMAIL.
- ***function[]* validators**: Additional validation methods.

###### Example
var pHtmCCAcct = new Cathmhaol.Validator(acct, true, Cathmhaol.Validation.Types.INTEGER, [validationLuhn, validationLength]);

##### Requires
- Cathmhaol.Validation --- http://js.cathmhoal.com/cjl-validation.js

##### Demo
- [cathmhaol.com](http://products.cathmhaol.com/prototypes/cc-input/)

##### Events
- ***invalid*** is fired when the value in the input is invalid. Additionally, the class 'invalid' is added to the element.
- ***missing*** is fired when the value in the input is missing. Additionally, the class 'missing' is added to the element.
- ***valid*** is fired when the value in the input is valid. Additionally, the class 'validated' is added to the element.

##### Properties
- ***HTMLElement* element**: The HTMLElement object being validated.

##### Methods
- ***void* addClass(*string* class)**:
- ***void* removeClass(*string* class)**:

## Licensing

Who are we kidding here? If I tried to provide a license other than *do whatever you want* what would be the point? Seriously. The only thing you *can't* do is contribute back to this repo. ***I am the Cathmhaol*. *There can be only one*.**
