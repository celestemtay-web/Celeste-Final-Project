/* DN1010 Experimental Interaction, Ashley Hi 2026
 * Week 5 - Computer Vision
 * Colour Tracking
 */


let symmetry = 6;

// The angle button will calculate the angle at which each section is rotated.
let angle = 360 / symmetry;

var video;
var target = [];
var threshold = 25;

function setup() {
  createCanvas(640, 480);
  angleMode(DEGREES);
  pixelDensity(1);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  noStroke();
}
function draw() {
  background(0);
  image(video, 0, 0);

  // ----- Mandala drawing -----
  push();
  translate(width / 2, height / 2);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

    let lineStartX = mouseX - width / 2;
    let lineStartY = mouseY - height / 2;
    let lineEndX = pmouseX - width / 2;
    let lineEndY = pmouseY - height / 2;

    if (mouseIsPressed) {
      for (let i = 0; i < symmetry; i++) {
        rotate(angle);
        stroke(255);
        strokeWeight(3);
        line(lineStartX, lineStartY, lineEndX, lineEndY);

        push();
        scale(1, -1);
        line(lineStartX, lineStartY, lineEndX, lineEndY);
        pop();
      }
    }
  }

  pop();
  // ----- End Mandala -----

  noStroke();
  fill(0);
  text("Threshold = ", 10, 20);
  text(threshold, 80, 20);

  video.loadPixels();

  for (var i = 0; i < target.length; i++) {

    text(
      "color " + i + ": " +
      target[i].red + ", " +
      target[i].green + ", " +
      target[i].blue,
      10,
      40 + i * 20
    );

    for (var x = 0; x < video.width; x += 3) {
      for (var y = 0; y < video.height; y += 3) {

        var index = (x + y * video.width) * 4;

        var redSource = video.pixels[index];
        var greenSource = video.pixels[index + 1];
        var blueSource = video.pixels[index + 2];

        var d = dist(
          redSource,
          greenSource,
          blueSource,
          target[i].red,
          target[i].green,
          target[i].blue
        );

        if (d < threshold) {
          target[i].avgX += x;
          target[i].avgY += y;
          target[i].count++;
        }
      }
    }

    if (target[i].count > 0) {

      target[i].avgX /= target[i].count;
      target[i].avgY /= target[i].count;

      push();
      stroke(0);
      strokeWeight(4);
      fill(target[i].rgb);
      ellipse(target[i].avgX, target[i].avgY, 16, 16);
      pop();

      text("ID :", target[i].avgX + 20, target[i].avgY + 7);
      text(i, target[i].avgX + 40, target[i].avgY + 7);
    }

    target[i].reset();
  }
}
