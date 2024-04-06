import {GRID_HEIGHT, GRID_WIDTH} from "./controller.js";

export function createView() {
    const board = document.getElementById("board");
    board.style.setProperty("--GRID-WIDTH", GRID_WIDTH);

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
            console.log("Cell created: " + row + ", " + col);
        }
    }
}

export function parseModel(jsonModelData) {;
    const maze = jsonModelData.maze;
    const rows = jsonModelData.rows;
    const cols = jsonModelData.cols;
    const start = jsonModelData.start;
    const goal = jsonModelData.goal;
    const cells = document.querySelectorAll("#board .cell");

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellData = maze[row][col];
            const index = row * cols + col;
            const cell = cells[index];

            if (cellData.north) {
                cell.classList.add("top-wall");
            }
            if (cellData.east) {
                cell.classList.add("right-wall");
            }
            if (cellData.south) {
                cell.classList.add("bottom-wall");
            }
            if (cellData.west) {
                cell.classList.add("left-wall");
            }
            if (row === start.row && col === start.col) {
                cell.classList.add("player");
            }
            if (row === goal.row && col === goal.col) {
                cell.classList.add("goal");
            }
            console.log("Cell data written: " + row + ", " + col + ": " + JSON.stringify(cellData));
        }
    }
    console.log("Model parsed Succesfully.");
}