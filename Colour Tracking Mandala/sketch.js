//Celeste Final Project: Colour Tracking and Mandala Drawing
//This program uses webcam color tracking to allow users to draw kaleidoscopic mandala patterns by waving colored objects. 
// Thresholds and stroke weights are adjustable, multiple colors can be tracked at once 


let symmetry = 6; // creating 6 mandala slices
let angle = 360 / symmetry; // calculating how much to rotate each section, so the lines spread in a circle 
let mandalaLayer; // creates a variable that stores an off-screen drawing layer for the mandala, so  mandala lines don't disappear immediately after being drawn
var video; // Stores webcam video
var target = []; // creates an array to store tracked colours, each clicked colour becomes a TargetColour object
var threshold = 25; // Controls how similar colours must be to count as "matching" larger number = greater tolerance
let strokeW = 3; // default strokeweight is 3

function setup() {
  createCanvas(1250, 800);
  pixelDensity(1);
  video = createCapture(VIDEO, { flipped: true }); // turn on web cam, flips it like a mirror
  video.size(800, 600); // makes video size
  video.hide();

  mandalaLayer = createGraphics(800, 600); // Defining variable to create a consistent graphics layer 
  mandalaLayer.angleMode(DEGREES);//makes rotation use degrees instead of radians
}

function draw() {
  background(255);//changes screen to white each frame
  image(video, 0, 0); // Uses webcam video as background

// Draw UI panel background
  fill(40);           // dark grey
  noStroke();
  rect(800, 0, 240, 600);

// 1.Loads pixel data to read colours 
  video.loadPixels(); 

  // Loops through each tracked colour in the target array
  for (var i = 0; i < target.length; i++) {
    // [i] stands for the loop variable 

    
  // Draw colour swatch on the right to show which colours are being tracked 
    fill(target[i].rgb);
    stroke(0);
    rect(1050, 25 + i * 25, 15, 15);

    // Draw RGB label text
    fill(255);
    noStroke();
    fill(0);  
    text(
    "Color " + i + ": " +
    Math.round(target[i].red) + "," +
    Math.round(target[i].green) + "," +
    Math.round(target[i].blue),
      1075,
      36 + i * 25
      );
    
    // 2. Scan for color matches
    for (var x = 0; x < video.width; x += 5) { //loops across the video vertically, skipping 5 pixels (speedier)
      for (var y = 0; y < video.height; y += 5) { //loops across video horizontally, skipping 5 pixels 
      // finds pixel location within pixel index
        var index = (x + y * video.width) * 4;
      // reads red, green and blue values of the pixels 
        var r = video.pixels[index + 0];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];

        var d = dist(r, g, b, target[i].red, target[i].green, target[i].blue);// calculates how similar pixel colour is to tracked colour 

       // checks if colours are close enough to the selected colour, based on the threshold value 
        if (d < threshold) { 
      // calculates the average centre of the matching colour pixels 
          target[i].avgX += x;
          target[i].avgY += y;
          target[i].count++;
        }
      }
    }

    // 3. If the color is found, calculate center of the matching pixels (to draw an ellipse at that point)
    if (target[i].count > 0) {// runs only if matching pixels were found
     // calculates average position of the colour (Where ellipse position is from)
      let currentX = target[i].avgX / target[i].count;
      let currentY = target[i].avgY / target[i].count;

      // Draws an ellipse that shows the tracked colour at the centre of the detected colour area. the ellipse acts as a "pen" to draw the mandala
      push();
      stroke(255);
      strokeWeight(2);
      fill(target[i].rgb);
      ellipse(currentX, currentY, 16, 16);// Draws a circle on webcam feed to show where computer thinks the object is 
      
      // Label the ellipse "pen" with its ID
      fill(255);
      noStroke();
      text("ID: " + i, currentX + 15, currentY);
      pop();

    // 4. Draw onto the Mandala Layer
      // Converting the coordinates to a centre-based canvas
      if (target[i].prevX !== null) { // only draws if there is a previous position
        mandalaLayer.push(); // saves drawing settings
        mandalaLayer.translate(800 / 2, 600 / 2);// (0,0) origin is moved to the centre of the canvas 
        
        // calculate current ellipse position relative to the centre (So rotations and designs start from the centre point)
        let mx = currentX - 800 / 2; // middle of screen horizontally 
        let my = currentY - 600 / 2; // middle of screen vertically 
        
        // calculate previous ellipse position relative to the centre
        let px = target[i].prevX - 800 / 2;
        let py = target[i].prevY - 600 / 2;
        // Tracking the current and previous position allows movement to be tracked over time
        
    // Draw rotated mandala copies 
        for (let j = 0; j < symmetry; j++) { // repeats drawing 6 times
          mandalaLayer.rotate(angle); // rotates mandala by 60 degrees
          mandalaLayer.stroke(target[i].rgb); // makes line colour match tracked colour RGB
          mandalaLayer.strokeWeight(strokeW); // controls stroke thickness
          mandalaLayer.line(px, py, mx, my); // draws the main mandala line, connecting the tracked movement of the ellipse to the mandala pattern (current and previous position)
          
          mandalaLayer.push();
          mandalaLayer.scale(1, -1); // flips vertically to create a reflection, like a kaleidoscope
          mandalaLayer.line(px, py, mx, my); // draws mirrored line
          mandalaLayer.pop();
        }
        mandalaLayer.pop();
      }
    // Save Current position 
      target[i].prevX = currentX;
      target[i].prevY = currentY;
      // stores current position for next frame
    } else {
      target[i].prevX = null;
      target[i].prevY = null;
      // stops drawing lines if no colour is found
    }

    target[i].reset(); 
  } // Clears tracking data to end the color loop

  // 5. Draw the UI text and the Mandala Layer
  image(mandalaLayer, 0, 0);// displays stored mandala drawing 
  
  // instruction text 
    fill(255);
    textStyle(BOLD);
    text("Threshold = " + threshold, 815, 40); // text to show current threshold value
    text("Click video to track a colour", 815, 60);
    text("Wave coloured object to draw mandala", 815, 80);
  
    text("Press R to reset drawing", 815, 120); 
    text("Press I to increase threshold value", 815, 140);
    text("Press D to decrease threshold value", 815, 160);
  
    text("Press ] to increase stroke weight", 815, 200 );
    text("Press [ to decrease stroke weight", 815, 220);
  
  
  
} // END of draw()

function mousePressed() { 
  let col = video.get(mouseX, mouseY); //if mouse is clicked, gets colour of pxiel under mouse 
  let newTarget = new TargetColor(col);
  newTarget.prevX = mouseX;
  newTarget.prevY = mouseY;
  target.push(newTarget);
}

function keyTyped() { //key functions to increase and decrease threshold
  if (key === "i") threshold += 2.5;
  if (key === "d") threshold -= 2.5;
  
  // increase or decrease stroke weight 
  if (key === "]") strokeW += 1; 
  if (key === "[") strokeW =max(1, strokeW - 1); 
  
  // reset mandala drawing 
  if (key === "r") { 
    target = [];
    mandalaLayer.clear();
    threshold = 25;// resets threshold level back to default
    StrokeW = 3;
 
  }
}

// Target = array: can hold multiple instances of an object
function TargetColor(_color) {
  // stores specific RGB values 
  this.rgb = _color;
  this.red = red(_color);
  this.green = green(_color);
  this.blue = blue(_color);
  // stores previous X/Y coordinates, which is needed for drawing continuous lines
  this.prevX = null;
  this.prevY = null;
  // stores variables needed to find the centre of the color every frame
  this.avgX = 0;
  this.avgY = 0;
  this.count = 0;

  // resets avg position of coloured pixels 
  this.reset = function() { 
    this.avgX = 0;
    this.avgY = 0;
    this.count = 0;
  };
}


