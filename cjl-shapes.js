var Cathmhaol = window.Cathmhaol || {};

/**
 * A collection of shapes as SVG path objects. Each shape contains a 'd' property that corresponds to the 'd' attribute of an SVG path, and an optionally an 'orient' property that identifies if the shape is oriented so the 'front' is pointing up.
 *
 * @author Robert King (hrobertking@cathmhaol.com)
 *
 */
Cathmhaol.Shapes = {
  Airplane: {d:"m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0l0.00002,0.00001z", orient:true, size:{height:45, width:45}},
  MapMarker: {d:"M11.513,12.38c-2.117,0-3.835-1.729-3.835-3.862c0-2.135,1.718-3.863,3.835-3.863s3.835,1.729,3.835,3.863  C15.348,10.65,13.63,12.38,11.513,12.38 M11.513,0C6.825,0,3.025,3.827,3.025,8.549c0,4.46,3.844,10.213,6.411,13.014  c0.959,1.045,2.076,2.454,2.076,2.454s1.2-1.417,2.229-2.493C16.306,18.84,20,13.451,20,8.549C20,3.827,16.2,0,11.513,0", orient:false, size:{height:24, width:24} },

  /**
   * Draws a shape in the specfied container
   * @return   {void}
   * @param    {object} shape
   * @param    {string|HTMLElement} container
   * @param    {string|number} width
   * @param    {string|number} height
   */
  draw: function() {
    var container = (typeof arguments[1] === 'string' && isNaN(arguments[1])) ?
                    document.getElementById(arguments[1]) : arguments[1]
      , height
      , node
      , path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      , shape = arguments[0]
      , width
    ;

    // make sure we have a valid shape
    if (shape && shape.d) {
      // set the width and height
      width = arguments[2] || (shape.size ? shape.size.width : 0);
      height = arguments[3] || (shape.size ? shape.size.height : 0);

      // make sure we have dimensions
      if (width && height) {
        // make sure we have a container for the shape
        if (container && container.nodeType === 1) {
          // if the specified container is not an svg, create one and append 
          // it to the container
          if (container.nodeName.toLowerCase() !== 'svg') {
            node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            container.appendChild(node);
            container = node;
          }

          // make sure the width and height attributes are set
          width = Math.max(width, container.clientWidth);
          height = Math.max(height, container.clientHeight);
          container.setAttribute('width', width);
          container.setAttribute('height', height);

          // draw the shape
          path.setAttribute('d', Cathmhaol.Shapes.Airplane.d);
          path.setAttribute('transform', 'matrix(' + 
                                Cathmhaol.Shapes.matrix(shape, width, height) +
                              ')');
          container.appendChild(path);

        }
      }
    }
    return;
  },

  /**
   * Resizes the shape to a container or specified width and height and centers it. The resize function may be called as resize(shape, container) or resize(shape, width, height), where 'container' is either a string corresponding to the ID of an HTML element or is an HTML element and width and height are numbers. The shape must contain a 'size' with a height and width.
   * @return   {string}
   * @param    {object} shape
   * @param    {string|HTMLElement} container | {string|number} width
   * @param    {string|number} height
   */
  matrix: function() {
    var container
      , height = 0
      , s = [ ]
      , scale = 0
      , shape = arguments[0]
      , size = shape.size
      , width = 0
      , x = 0
      , y = 0
    ;

    container = (typeof arguments[1] === 'string' && isNaN(arguments[1])) ? 
                document.getElementById(arguments[1]) : arguments[1];

    if (container && container.nodeType === 1) {
      width = container.clientWidth;
      height = container.clientHeight;
    } else if (!isNaN(container) && arguments.length === 3 && !isNaN(arguments[2])) {
      width = container;
      height = arguments[2];
    }

    if (width && height && size && size.height !== null && size.width !== null) {
      // calculate the maximum adjustment we can make
      scale = Math.min( Math.ceil((width/(size.width || width)) * 10) / 10,
                        Math.ceil((height/(size.height || height)) * 10) / 10
                      );

      // adjust the size
      size.width *= scale;
      size.height *= scale;

      x = Math.floor((width - size.width)/2);
      y = Math.floor((height - size.height)/2);

      s.push(scale.toString());  // x-axis scale
      s.push('0');
      s.push('0');
      s.push(scale.toString());  // y-axis scale
      s.push(x.toString());      // x-coordinate
      s.push(y.toString());      // y-coodinate
    }
    return s.join(' ');
  }
};
