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

Requires:
* d3 --- http://d3js.org/d3.v3.min.js
* d3.geo --- http://d3js.org/d3.geo.projection.v0.min.js
* topoJSON --- http://d3js.org/topojson.v1.min.js
* topoJSONdata --- e.g. world-110m.json

*Methods*
- *void* addOnCountryClick(*function* handler): Adds an event handler for the click event for a country. Inside the handler, the 'this' keyword, refers to the country clicked, and will have the following properties:
    * type: the string 'Feature'
    * id: the topoJSON id
    * properties: an empty object
    * geometry: object containing the type of shape, e.g., Polygon or MultiPolygon, called 'type' and a floating point array called 'coordinates'
    * iso: the ISO 3166 Alpha-2 code
    * name: the country name (in English)
    * color: the index of the palette color used
- *string* getBorderColor: Returns the border color in hexadecimal format, e.g. #000000
- *HTMLElement* getElement: Returns the HTML element to which the SVG is attached
- *string* getMarkerColor: Returns the marker color in hexadecimal format
- *object* getMarkerFile: Returns an object containing the URL of the file containing marker data and the file type, e.g., {name:'/my-markers.csv', type:'csv'}.  
Each marker definition in the marker file must contain 'longitude', 'latitude', and 'size'. If the marker definition contains 'color', the specified color will
be used as the marker color. If the marker definition contains 'country', the country will be added to the marker class. If the marker definition contains
'description', the description will be used to populate the 'data-description' attribute of the marker.  
**Example:  **

    [  
      { "country":"KR", "latitude":"37.469075", "longitude":"126.450517", "size":7 },  
      { "country":"DE", "latitude":"50.030194", "longitude":"8.588047", "size":2 },  
      { "country":"IT", "latitude":"45.445103", "longitude":"9.276739", "size":2 },  
      { "country":"US", "latitude":"33.942536", "longitude":"-118.408075", "size":2 }    
    ]  

**Example:  **

    country,latitude,longitude,size,color  
    CA,43.677223,-79.630556,2,#9933CC  
    DE,50.030194,8.588047,2,#660099  
    ES,40.493556,-3.566764,2,#CC00FF  
    FR,48.856389,2.352222,2,#CC99CC  
    GB,51.508056,-0.127778,2,#9933DD  
    IT,38.175958,13.091019,2,#AA00FF  
    IT,45.445103,9.276739,2,#AA00FF  
    US,25.79325,-80.290556,2,#663399  
    US,32.847111,-96.851778,2,#663399  
    US,37.3626,-121.929022,2,#663399  
    US,38.944533,-77.455811,3,#663399  
    US,40.777245,-73.872608,2,#663399  
    US,64.729444,-158.074167,2,#663399 
   
- *float* getMarkerSize: Returns the size of the marker
- *string[]* getPalette: Returns the colors used for countries
- *string* getTopoFile: Returns the URL of the topoJSON file
- *void* render([*string* style]): Draws the map. The only valid option for the 'style' parameter at this time is '2D', which renders a flat (Spherical Mercator) map.
- *boolean* rotatable: Returns true when the map can rotate.
- *boolean* rotating: Returns true when the map is actively rotating.
- *void* rotationDecrease: Slows the rotation
- *void* rotationIncrease: Speeds up the rotation
- *void* rotationPause: Stops the rotation
- *void* rotationResume: Restarts the rotation
- *void* setBorderColor(*string* color): Sets the border color to the provided hexadecimal value
- *void* setElement(*HTMLElement*|*string* element): Sets the element to attach the SVG
- *void* setMarkerColor(*string* color): Sets the marker color to the provided hexadecimal value
- *void* setMarkerFile(*string*|*object* marker[, *string* type]): Sets the URL of the file containing marker data and the file type. The marker parameter may either be a URL string, if the type is provided, or it may be an object containing the url and type, e.g., {name:'/my-markers.csv', type:'csv'}
- *void* setMarkerSize(*number*|*string*): Sets the marker size to the size provided. Size may be specified as a number or as a percentage of overall size, e.g., "10%"
- *void* setPalette(*string[]*|*object* palette): Sets the palette. The palette parameter may either be an array of hexadecimal strings representing colors or it may be an object containing an array of colors as its 'colors' property. It may optionally have the 'border' and 'marker' colors as properties, e.g. {border:'#333333', marker:'#663399', colors:['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff']}
- *void* setTopoFile(*string* url): Sets the URL of the topoJSON file

## Licensing

Who are we kidding here? If I tried to provide a license other than *do whatever you want* what would be the point? Seriously. The only thing you *can't* do is contribute back to this repo. ***I am the Cathmhaol*. *There can be only one*.**
