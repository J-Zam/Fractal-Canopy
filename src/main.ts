import "./style.css";
import { $ } from "./utils/shortHand";
import Picker from "vanilla-picker";
import "vanilla-picker/dist/vanilla-picker.csp.css";

let canvas = $("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let sliderAngle = $("angleBifurcation") as HTMLInputElement;
let sliderLength = $("brachLengthVariation") as HTMLInputElement;
let colorPickerLeaf = $("colorPickerLeaf") as HTMLElement;
let colorPickerTrunk = $("colorPickerTrunk") as HTMLElement;
let displayLeaves = $("displayLeaves") as HTMLInputElement;
let displayCurves = $("displayCurves") as HTMLInputElement;
let angleBifurcation = 15;
let branchVariation = 0.8;
let displayLeavesValue = true;
let displayCurvesValue = true;

let pickerLeaf = new Picker(colorPickerLeaf);
let pickerTrunk = new Picker(colorPickerTrunk);
let leafColor = "#ffffff";
let trunkColor = "#ff0071ff";

document.addEventListener("DOMContentLoaded", function () {
  sliderAngle.value = "15";
  sliderLength.value = "0.80";
  displayLeaves.checked = true;
  displayCurves.checked = true;
  colorPickerLeaf.style.backgroundColor = leafColor;
  colorPickerTrunk.style.backgroundColor = trunkColor;
});

window.addEventListener("resize", function () {
  resizing();
  start();
});

pickerLeaf.onChange = function (color) {
  colorPickerLeaf.style.background = color.rgbaString;
  leafColor = color.hex;
  start();
};

pickerTrunk.onChange = function (color) {
  colorPickerTrunk.style.background = color.rgbaString;
  trunkColor = color.hex;
  start();
};

[sliderAngle, sliderLength, displayLeaves, displayCurves].forEach((item) => {
  item.addEventListener("input", () => {
    angleBifurcation = parseInt(sliderAngle.value);
    branchVariation = parseFloat(sliderLength.value);
    displayLeavesValue = displayLeaves.checked; 
    displayCurvesValue = displayCurves.checked; 
    start();
  });
});

function draw(x: number, y: number, distance: number, angle: number, branchWidth: number) {
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = trunkColor;
  ctx.fillStyle = leafColor;
  ctx.lineWidth = branchWidth;
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.moveTo(0, 0);

  if (displayCurvesValue) {
    ctx.bezierCurveTo(10, -distance/2, 5, -distance/2, 0, -distance)
  } else {
    ctx.lineTo(0, -distance)
  }
  ctx.stroke();

  if (distance < 10) {
    if (displayLeavesValue) {
      ctx.beginPath();
      ctx.arc(0, -distance, 8, 0, Math.PI / 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  draw(0, -distance, distance * branchVariation, angle + angleBifurcation, branchWidth * 0.7);
  draw(0, -distance, distance * branchVariation, angle - angleBifurcation, branchWidth * 0.7);
  ctx.restore();
}

function resizing() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}

function start() {
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  draw(canvas.width / 2, canvas.height - 80, 115, 0, 10);
}

resizing();
start();
