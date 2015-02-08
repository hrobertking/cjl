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

  Cathmhaol = window.Cathmhaol || {};

  /**
   * Creates profile image with a profile progress/completion bar
   *
   * @param     {string|HTMLElement} img     Profile image
   * @param     {number} comp                Percentage complete
   * @param     {string|HTMLElement} canvas  The canvas element
   * @param     {number} imgHeight           Height of the profile picture
   * @param     {number} height              Height of profile component
   * @param     {number} width               Width of profile component
   * @param     {number} thickness           Thickness of the progress bar
   * @param     {string|object} color        Color to be used for the progress bar/circle
   * @param     {string|object} bgColor      Color to be used for the uncompleted portion of the progress bar/circle
   * @param     {string} overlay             Overlay percentage complete as text
   * @param     {string} font                Font to use for overlay
   * @param     {boolean} animate            Animate the progress
   * @param     {boolean} bar                Use a bar instead of a circle
   * @param     {boolean} sqr                The profile picture should be square
   *
   * @author    Robert King (hrobertking@cathmhaol.com)
   *
   * @version   1.0
   */
  Cathmhaol.ProfileProgress = function(img, comp, canvas, imgHeight, height, width, thickness, color, bgColor, overlay, font, animate, bar, sqr) {
    /**
     * Animation method
     * @return  {void}
     */
    this.animate = function() {
      INDEX = animate ? 0 : 100;
      TIMER = window.setInterval(bar ? animateBar : animateCircle, 16);
    };

    /**
     * Animate the progress bar
     * @return  {void}
     */
    function animateBar() {
      var pc = INDEX / 100;

      clear();
      drawPic();

      if (pc < comp) {
        INDEX += 1;
        drawBar(pc);
      } else {
        if (TIMER) {
          window.clearInterval(TIMER);
        }
        drawBar(comp);
      }

      return;
    }

    /**
     * Animate the progress circle
     * @return  {void}
     */
    function animateCircle() {
      var pc = Math.min(INDEX / 100, comp);

      clear();

      if (pc < comp) {
        INDEX += 1;
        drawCircle(pc);
      } else {
        if (TIMER) {
          window.clearInterval(TIMER);
        }
        drawCircle(comp);
      }

      return;
    }

    /**
     * Clear the canvas
     * @return  {void}
     */
    function clear() {
      CONTEXT.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    /**
     * Draws a progress bar beneath the profile pic
     * @return  {void}
     * @param  {number} pc  Percent complete
     * @example  drawBar(0.50);
     */
    function drawBar(pc) {
      var ht = Math.floor(PROGRESS.height * 1.5)
        , gradBar = CONTEXT.createLinearGradient( PROGRESS.x
                                                , PROGRESS.y
                                                , PROGRESS.x
                                                , ht)
        , borderWidth = 3
      ;

      CONTEXT.lineWidth = borderWidth;

      // create the background
      CONTEXT.fillStyle = bgColor.hex;
      CONTEXT.fillRect( PROGRESS.x - borderWidth
                      , PROGRESS.y - (borderWidth * 1.5)
                      , PROGRESS.width + (borderWidth * 2)
                      , PROGRESS.height + borderWidth );

      // render the bar
      gradBar.addColorStop(0, color.hex);
      gradBar.addColorStop(1, '#fff');
      CONTEXT.fillStyle = gradBar;
      CONTEXT.fillRect( PROGRESS.x - borderWidth
                      , PROGRESS.y - borderWidth
                      , Math.round(pc * PROGRESS.width)
                      , PROGRESS.height );

      // render the border
      CONTEXT.strokeStyle = color.darker;
      CONTEXT.rect( PROGRESS.x - borderWidth
                  , PROGRESS.y - borderWidth
                  , Math.round(pc * PROGRESS.width)
                  , PROGRESS.height );
      CONTEXT.stroke();

      drawPic();
      drawText(pc);

      return;
    }

    /**
     * Draws a percentage complete band
     * @return  {void}
     * @param  {number} pc  Percent complete
     * @example  drawCircle(0.50);
     */
    function drawCircle(pc) {
      var N = 1.5
        , NE = 1.75
        , NW = 1.25
        , E = 0
        , S = 0.5
        , SE = .25
        , SW = 0.75
        , W = 1
        , startingAngle = (Math.PI * N)
        , lineOffset = pc === 1 ? 0 : 0.0009
        , lineStart = (Math.PI * (N + lineOffset))
      ;

      CONTEXT.lineWidth = 3;

      // draw the background
      CONTEXT.save();
      CONTEXT.beginPath();
      CONTEXT.arc( CENTER.x
                 , CENTER.y
                 , RADIUS
                 , 0
                 , Math.PI * 2 );
      CONTEXT.closePath();
      CONTEXT.strokeStyle = color.darker;
      CONTEXT.stroke();
      CONTEXT.fillStyle = bgColor.hex;
      CONTEXT.fill();
      CONTEXT.restore();

      // draw the slice
      CONTEXT.save()
      CONTEXT.beginPath();
      CONTEXT.moveTo(CENTER.x, CENTER.y);
      CONTEXT.arc( CENTER.x
                 , CENTER.y
                 , RADIUS
                 , startingAngle
                 , startingAngle + ((Math.PI * 2) * pc) );
      CONTEXT.lineTo(CENTER.x, CENTER.y);
      CONTEXT.closePath();
      CONTEXT.strokeStyle = color.darker;
      CONTEXT.stroke();
      CONTEXT.fillStyle = color.hex;
      CONTEXT.fill();
      CONTEXT.restore();

      // clear out the inner portion of the circle
      CONTEXT.globalCompositeOperation = 'destination-out';
      CONTEXT.save();
      CONTEXT.beginPath();
      CONTEXT.arc( CENTER.x
                 , CENTER.y
                 , RADIUS - thickness
                 , 0
                 , Math.PI * 2 );
      CONTEXT.closePath();
      CONTEXT.fillStyle = bgColor.hex;
      CONTEXT.fill();
      CONTEXT.restore();
      CONTEXT.globalCompositeOperation = 'source-over';

      // draw an inner circle
      CONTEXT.save();
      CONTEXT.lineWidth = 2;
      CONTEXT.beginPath();
      CONTEXT.arc( CENTER.x
                 , CENTER.y
                 , RADIUS - thickness
                 , 0
                 , Math.PI * 2 );
      CONTEXT.closePath();
      CONTEXT.strokeStyle = color.darker;
      CONTEXT.stroke();
      CONTEXT.restore();

      drawPic();
      drawText(pc);

      return;
    }

    /**
     * Draw the profile pic
     * @return  {void}
     * @example  drawPic();
     */
    function drawPic() {
      var x
        , y
      ;
      if (PIC) {
        x = CENTER.x - Math.floor(PIC.width / 2);
        y = CENTER.y - Math.floor(PIC.height / 2);
        CONTEXT.save();
        CONTEXT.beginPath();
        if (!sqr) {
          CONTEXT.arc( CENTER.x
                     , CENTER.y
                     , RADIUS - thickness + 10
                     , 0
                     , Math.PI * 2, true );
        } else {
          CONTEXT.rect( x
                      , y
                      , RADIUS * 2
                      , RADIUS * 2 );
        }
        CONTEXT.closePath();
        CONTEXT.clip();
        CONTEXT.drawImage( PIC
                         , x
                         , y
                         , PIC.width
                         , PIC.height );
        CONTEXT.restore();
      }
      return;
    }

    /**
     * Draws the text
     * @return  {void}
     * @param  {string} pc  Percent complete
     * @example  drawText(0.50);
     */
    function drawText(pc) {
      if (overlay) {
        if (font) {
          CONTEXT.font = font;
        }
        CONTEXT.textAlign = 'center';
        CONTEXT.fillStyle = 'rgba(' + 
                            color.red + ', ' + 
                            color.green + ', ' + 
                            color.blue + ', 0.7)';
        CONTEXT.fillText( overlay.replace(/\b\d{1,}\b/
                        , Math.floor(pc * 100))
                        , CENTER.x
                        , CENTER.y );
      }
      return;
    }

    /**
     * Translate the color from it's original value to an object with red, green, and blue values
     * @return  {object}
     * @param  {string|object} color
     */
    function translateColor(color) {
      var obj = {blue: 0, darker:'#000000', green: 0, hex:'#151515' , red: 0}
        , short = (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i).exec(color)
        , full = (/^\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i).exec(color)
        , b, g, r, num
      ;

      if (color) {
        obj.blue = color.blue ?
                     color.blue :
                     short ? 
                       parseInt(short[3] + short[3], 16) :
                       full ? 
                         parseInt(full[3], 16) :
                         0;
        obj.green = color.green ?
                      color.green :
                      short ?
                        parseInt(short[2] + short[2], 16) :
                        full ?
                          parseInt(full[2], 16) :
                          0;
        obj.red = color.red ?
                    color.red :
                      short ?
                        parseInt(short[1] + short[1], 16) :
                        full ?
                          parseInt(full[1], 16) :
                          0;

        obj.blue = Math.min(Math.max(obj.blue, 21), 255);
        obj.green = Math.min(Math.max(obj.green, 21), 255);
        obj.red = Math.min(Math.max(obj.red, 21), 255);

        obj.hex = '#' + ('0' + Math.floor(obj.red).toString(16)).substr(-2) +
                        ('0' + Math.floor(obj.green).toString(16)).substr(-2) +
                        ('0' + Math.floor(obj.blue).toString(16)).substr(-2);

        // calculate the darker value
        obj.darken = obj.hex.slice(1);
        num = parseInt(obj.darken, 16);
        r = (num >> 16) - 40;
        r = Math.max(Math.min(r, 255), 0);
        b = ((num >> 8) & 0x00FF) - 40;
        b = Math.max(Math.min(b, 255), 0);
        g = (num & 0x0000FF) - 40;
        g = Math.max(Math.min(g, 255), 0);
        num = (g | (b << 8) | (r << 16)).toString(16);
        obj.darker = '#' + ('00000' + num).substr(-6);
      }

      return obj;
    }

    var APSECT                         // Image height/width ratio
      , CONTAINER                      // Element to contain the canvas
      , CONTEXT                        // Drawing context
      , CENTER                         // The center of the canvas
      , DEF = { rad: 100, thick: 10 }  // Default radius and thickness
      , PIC                            // The profile image
      , PROGRESS = {}                  // The progress bar object
      , RADIUS                         // Radius of the progress circle
      , TIMER                          // Animation timer
      , INDEX                          // Generic loop index
      , obj                            // Argument object
      , prop                           // Index for the object property loop
    ;

    /**
     * Set all the defining properties
     */
    for (INDEX = 0; INDEX < arguments.length; INDEX += 1) {
      if (arguments[INDEX] !== null && typeof arguments[INDEX] === 'object') {
        obj = arguments[INDEX];
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            switch (prop) {
              case 'animate':
                animate = obj[prop];
                break;
              case 'bar':
                bar = obj[prop];
                break;
              case 'bgColor':
                bgColor = obj[prop];
                break;
              case 'canvas':
                canvas = obj[prop];
                break;
              case 'color':
                color = obj[prop];
                break;
              case 'comp':
                comp = obj[prop];
                break;
              case 'font':
                font = obj[prop];
                break;
              case 'height':
                height = obj[prop];
                break;
              case 'img':
                img = obj[prop];
                break;
              case 'imgHeight':
                imgHeight = obj[prop];
                break;
              case 'overlay':
                overlay = obj[prop];
                break;
              case 'sqr':
                sqr = obj[prop];
                break;
              case 'thickness':
                thickness = obj[prop];
                break;
              case 'width':
                width = obj[prop];
                break;
            }
          }
        }
      }
    }

    /**
     * Sanity check
     */
    if (!comp || !canvas) {
      return;
    }

    /**
     * Set the image
     */
    PIC = new Image();
    PIC.src = (typeof img === 'string') ? img : img.src;
    ASPECT = (PIC.height || 1) / (PIC.width || PIC.height || 1 );

    /**
     * Set the completion as a percentage
     */
    comp = Math.floor(comp) ? comp / 100 : comp;

    /**
     * Set the canvas
     */
    if (typeof canvas === 'string') {
      canvas = document.getElementById(canvas);
    }
    canvas = canvas || document.createElement('canvas');
    if (canvas.nodeName !== 'CANVAS') {
      CONTAINER = canvas;
      canvas = document.createElement('canvas');
      CONTAINER.appendChild(canvas);
    } else {
      CONTAINER = canvas.parentNode;
    }
    if (!CONTAINER) {
      document.body.appendChild(canvas);
      CONTAINER = canvas.parentNode;
    }

    /**
     * Set the thickness of the progress bar
     */
    thickness = (!thickness || isNaN(thickness)) ? 10 : thickness;

    /**
     * Set the radius of the progress bar
     */
    height = Math.max( height || DEF.rad, PIC.height || DEF.rad
                     , canvas.height || DEF.rad );
    width = Math.max( width || DEF.rad, PIC.width || DEF.rad
                    , canvas.width || DEF.rad );
    if ( height === canvas.height || 
         width === canvas.width || 
         height === PIC.height || 
         width === PIC.width ) {
      RADIUS = height - thickness;
    } else {
      RADIUS = (imgHeight || PIC.height);
      thickness = height - RADIUS;
    }
    RADIUS = Math.floor(RADIUS / 2);

    /**
     * Set the dimensions of the profile pic using the radius
     */
    if (RADIUS > 0) {
      if (Math.floor(ASPECT) > 1) {
        PIC.height = (RADIUS * 1.8) - thickness;
        PIC.width = PIC.height / ASPECT;
      } else {
        PIC.height = (RADIUS * 1.8) - thickness;
        PIC.width = PIC.height * ASPECT;
      }
    }

    if (height > canvas.height) {
      canvas.height = height;
    }
    if (width > canvas.width) {
      canvas.width = width;
    }

    /**
     * Calculate the color
     */
    color = translateColor(color);
    bgColor = translateColor(bgColor || '#ccc');

    /**
     * Calculate the center
     */
    CENTER = {x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) };

    /**
     * Calculate the progress bar properties
     */
    PROGRESS.height = thickness;
    PROGRESS.width = width - 10;
    PROGRESS.x = Math.floor((width - PROGRESS.width)/2);
    PROGRESS.y = Math.floor(height - PROGRESS.height);

    /**
     * Set the context
     */
    CONTEXT = canvas.getContext('2d');
    CONTEXT.globalCompositeOperation = 'source-over';
  };

  return Cathmhaol;
}));
