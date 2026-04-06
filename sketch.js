////Celeste Final Project: Colour Tracking and Mandala Drawing
//// target = array: can hold multiple instances of an object
////  [i] stands for the loop variable 
// 
//
//let symmetry = 6;
//let angle = 360 / symmetry;
////calculate the angle at which each section is rotated.
//let mandalaLayer; //graphics layer to draw persistent mandala
//
//
//var video; //creates webcam video
//var target = []; //Stores selected colors to track: each clicked colour becomes a TargetColor object
//var threshold = 25; //Controls how similar colours must be to count as "matching" larger number = greater tolerance
//
//function setup() {
//  createCanvas(640, 480);
//  pixelDensity(1); //fixes pixel scaling issues
//  video = createCapture(VIDEO, { flipped: true }); //turns on webcam, flips video like a mirror
//  video.size(640, 480); // video resolution, same size as canvas
//  video.hide();//hides raw html video
//  noStroke();
//  
////Create consistent graphics layer
//mandalaLayer =  createGraphics (width, height);
//mandalaLayer.angleMode(DEGREES);
//}
//
//function draw() {
//  background(0); //clears screen to blank each frame
//  image(video, 0, 0); //draw webcam video onto canvas, or live webcam
//  image (mandalaLayer, 0,0);//create persistent mandala lines
//  
//  
//  video.loadPixels();
//  // loads pixel data to read colours
//  //moved into draw loop
//  
//  
//   // SCANS PIXELS FOR COLOUR
//  for (var i = 0; i < target.length; i++) {  
//
// // text that shows RGB values of each tracked colour
//    text(
//      "color " + i + ": " +
//      target[i].red + ", " +
//      target[i].green + ", " +
//      target[i].blue,
//      10,
//      40 + i * 20
//    );
//    
//    video.loadPixels();
//
//    varclosestX = 0;
//    var closestY = 0; 
//
//    for (var x = 0; x < video.width; x += 5) {
//      for (var y = 0; y < video.height; y += 5) {
//        //loops through video pixels and skips every 3 pixels
//
//        var index = (x + y * video.width) * 4; // finds pixel location inside pixel array
//        var redSource = video.pixels[index + 0];
//        var greenSource = video.pixels[index + 1];
//        var blueSource = video.pixels[index + 2];
//        // Extract RGB values from video pixel
//        
//// COMPARING COLOURS
//        var d = dist(
//          redSource,
//          greenSource,
//          blueSource,
//          target[i].red,
//          target[i].green,
//          target[i].blue
//        );
//        //Calculate distance between colours 
//        //Smaller distance = more similar 
//        
//// IF COLOUR MATCHES
//
//        if (d < threshold) { //If colour is similar enough 
//          target[i].avgX += x;
//          target[i].avgY += y;
//          target[i].count++;
//          // Adds pixel position to average calculation
//        }
//      }
//    }
//
//// IF MATCHING PIXELS WERE FOUND
//    if (target[i].count > 0) {
// 
//  //Draw Mandala on Mandala Layer
//  let currentX = target[i].avgX / target[i].count;
//  let currentY = target[i].avgY/ target[i].count;
//      
//
// // draws a dot at tracked position
//      push();
//      stroke(0);
//      strokeWeight(4);
//      fill(target[i].rgb);
//      ellipse(target[i].avgX, target[i].avgY, 16, 16);
//    
//      pop();
//
// 
//   // Draw onto the persistent Mandala Layer
//      if (target[i].prevX !== null) {
//        mandalaLayer.push();
//        mandalaLayer.translate(width / 2, height / 2);
//        
//        let mx = currentX - width / 2;
//        let my = currentY - height / 2;
//        let px = target[i].prevX - width / 2;
//        let py = target[i].prevY - height / 2;
//
//// symmetry function
//        for (let j = 0; j < symmetry; j++) {
//          mandalaLayer.rotate(angle);
//          mandalaLayer.stroke(target[i].rgb);
//          mandalaLayer.strokeWeight(3);
//          mandalaLayer.line(px, py, mx, my);
//          
//          // Mirroring logic
//          mandalaLayer.push();
//          mandalaLayer.scale(1, -1);
//          mandalaLayer.line(px, py, mx, my);
//          mandalaLayer.pop();
//        }
//        mandalaLayer.pop();
//      }
//
//      // Update previous positions for the next frame
//      target[i].prevX = currentX;
//      target[i].prevY = currentY;
//    } else {
//      // If color is lost, reset prevX/Y so it doesn't "jump" when found again
//      target[i].prevX = null;
//      target[i].prevY = null;
//    }
//
//    target[i].reset(); // Clear totals for next frame
//  }
//
//  image(mandalaLayer, 0, 0); // Show the drawing on top
//
// 
//// Writes text label
//      text("ID :", target[i].avgX + 20, target[i].avgY + 7);
//      text(i, target[i].avgX + 40, target[i].avgY + 7);
//    }
//
//
// function mousePressed(){ //when user clicks: get colour from video + store it as new Targetcolour object
//   //old codetarget.push(new TargetColor(video.get(mouseX, mouseY)));
//   
//  let newTarget = new TargetColor(video.get(mouseX, mouseY));
//  newTarget.prevX = mouseX;
//  newTarget.prevY = mouseY;
//  target.push(newTarget);
//}
//  
//  
//  // UI Text writes the word "threshold" for colour tracking
//  //shows threshold value on screen
//  noStroke();
//  fill(0);
//  text("Threshold = ", 10, 20); //position of text
//  text(threshold, 80, 20); //
//  
//
////4B
//function keyTyped(){
//  if (key === "i"){
//    threshold += 2.5;
//  } 
//  // increase threshold: higher threshold= more colours detected (mandala only appears within a certain threshold hmm)
//  
//  else if (key === "d") {
//    threshold -= 2.5;
//  }
////decrease threshold
//  
//  if (key === "r") {
//    target =[];
//  
//// reset all tracked colours
//  }
//} 
//
//function TargetColor(_color) { //creates colour tracking object
//  this.rgb = _color; //stores full colour
//  this.red = red(_color);
//  this.green = green(_color);
//  this.blue = blue(_color);
//// extract RGB components 
//  
//  
//// STORE PREVIOUS TRACKED POSITION (FOR MANDALA)
//  this.prevX = null;
//  this.prevY = null;
//  
//  
//  
////1B- used to average position
//  this.avgX = 0;
//  this.avgY = 0;
//  this.count = 0;
//
//  
////3A clears values after each frame
//  this.reset = function () {
//  this.avgX = 0;
//  this.avgY = 0;
//  this.count = 0;
//  
//};
//}
//
//
//
//
//

let symmetry = 6; // creating 6 mandala slices
let angle = 360 / symmetry; // calculating how much to rotate each section, so the lines spread in a circle 
let mandalaLayer; // creates a variable that stores an off-screen drawing layer for the mandala , so  mandala lines don't disappear immediately after being drawn
var video; // Stores webcam video
var target = []; // creates an array to store tracked colours, each clicked colour becomes a TargetColour object
var threshold = 25; // larger value = more colours match

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  mandalaLayer = createGraphics(width, height);
  mandalaLayer.angleMode(DEGREES);
}

function draw() {
  background(0);
  image(video, 0, 0); // Background video
  
  video.loadPixels();

  for (var i = 0; i < target.length; i++) {
    // 1. Label the tracked colors at the top left
    fill(255);
    noStroke();
    text("color " + i + ": " + Math.round(target[i].red) + "," + Math.round(target[i].green) + "," + Math.round(target[i].blue), 10, 40 + i * 20);

    // 2. Scan for color matches
    for (var x = 0; x < video.width; x += 5) {
      for (var y = 0; y < video.height; y += 5) {
        var index = (x + y * video.width) * 4;
        var r = video.pixels[index + 0];
        var g = video.pixels[index + 1];
        var b = video.pixels[index + 2];

        var d = dist(r, g, b, target[i].red, target[i].green, target[i].blue);

        if (d < threshold) {
          target[i].avgX += x;
          target[i].avgY += y;
          target[i].count++;
        }
      }
    }

    // 3. If the color is found, calculate center and draw
    if (target[i].count > 0) {
      let currentX = target[i].avgX / target[i].count;
      let currentY = target[i].avgY / target[i].count;

      // Draw the "Pen" dot at the ACTUAL center
      push();
      stroke(255);
      strokeWeight(2);
      fill(target[i].rgb);
      ellipse(currentX, currentY, 16, 16);
      
      // Label the pen with its ID
      fill(255);
      noStroke();
      text("ID: " + i, currentX + 15, currentY);
      pop();

      // Draw onto the Mandala Layer
      if (target[i].prevX !== null) {
        mandalaLayer.push();
        mandalaLayer.translate(width / 2, height / 2);
        
        let mx = currentX - width / 2;
        let my = currentY - height / 2;
        let px = target[i].prevX - width / 2;
        let py = target[i].prevY - height / 2;

        for (let j = 0; j < symmetry; j++) {
          mandalaLayer.rotate(angle);
          mandalaLayer.stroke(target[i].rgb);
          mandalaLayer.strokeWeight(3);
          mandalaLayer.line(px, py, mx, my);
          
          mandalaLayer.push();
          mandalaLayer.scale(1, -1);
          mandalaLayer.line(px, py, mx, my);
          mandalaLayer.pop();
        }
        mandalaLayer.pop();
      }

      target[i].prevX = currentX;
      target[i].prevY = currentY;
    } else {
      target[i].prevX = null;
      target[i].prevY = null;
    }

    target[i].reset(); 
  } // END of color loop

  // 4. Draw the UI and the Mandala Layer
  image(mandalaLayer, 0, 0);
  
  fill(255);
  text("Threshold = " + threshold, 10, 20);
} // END of draw()

function mousePressed() {
  let col = video.get(mouseX, mouseY);
  let newTarget = new TargetColor(col);
  newTarget.prevX = mouseX;
  newTarget.prevY = mouseY;
  target.push(newTarget);
}

function keyTyped() {
  if (key === "i") threshold += 2.5;
  if (key === "d") threshold -= 2.5;
  if (key === "r") {
    target = [];
    mandalaLayer.clear();
  }
}

function TargetColor(_color) {
  this.rgb = _color;
  this.red = red(_color);
  this.green = green(_color);
  this.blue = blue(_color);
  this.prevX = null;
  this.prevY = null;
  this.avgX = 0;
  this.avgY = 0;
  this.count = 0;

  this.reset = function() {
    this.avgX = 0;
    this.avgY = 0;
    this.count = 0;
  };
}


