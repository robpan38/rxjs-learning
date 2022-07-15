import { fromEvent } from 'rxjs';

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let mouseUp = true;
let colorPicker = document.querySelector<HTMLInputElement>(".color-picker input");
let resetBtn = document.querySelector<HTMLButtonElement>(".color-picker button");

function drawGrid(): void {
    for (let i = 10; i < 500; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
        ctx.stroke();
    }
}

drawGrid()

function getLowerBoundaries(event: MouseEvent): number[] {
    let currentX = event.clientX;
    let currentY = event.clientY;

    while (currentX % 10 !== 0) {
        currentX -= 1;
    }
    while (currentY % 10 !== 0) {
        currentY -= 1;
    }
    
    return [currentX, currentY];
}

function drawRectangle(event: MouseEvent): void {
    let [lowX, lowY] = getLowerBoundaries(event);
    ctx.fillRect(lowX, lowY, 10, 10);
}

let detectMouseDownObservable = fromEvent(canvas, "mousedown")
    .subscribe((e: PointerEvent) => mouseUp = false)

let detectMouseUpObservable = fromEvent(canvas, "mouseup")
    .subscribe((e: PointerEvent) => mouseUp = true)

let detectMouseMovementObservable = fromEvent(canvas, "mousemove")
    .subscribe((e: MouseEvent) => {
        if (mouseUp === false) {
            drawRectangle(e);
        }
    })

let detectChangeOfColor = fromEvent(colorPicker, "input")
    .subscribe((e: InputEvent) => {
        ctx.fillStyle = (<HTMLInputElement>e.target).value;
    })

let detectResetClick = fromEvent(resetBtn, "click")
    .subscribe((e: PointerEvent) => {
        let previousColor = ctx.fillStyle;
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, 500, 500);
        drawGrid();
        ctx.fillStyle = previousColor;
    })