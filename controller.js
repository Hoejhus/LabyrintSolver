import { createModel, route, readFromCell, writeToCell, model } from "./model.js";
import { createView, displayBoard, parseModel } from "./view.js";

"use strict";

window.addEventListener("load", start);

export let GRID_HEIGHT = null;
export let GRID_WIDTH = null;
let jsonModelData = null;

async function start() {
    console.log("Labyrint Solver Running...");
    jsonModelData = await loadJsonModel();
    createView();
    createModel();
    parseModel(jsonModelData);
    route.push(jsonModelData.start);
    tick();
    console.log("Game Loaded...");
}

    // Load JSON Maze model
async function loadJsonModel() {
    const response = await fetch("maze.json");
    const json = await response.json();
    GRID_HEIGHT = json.rows;
    GRID_WIDTH = json.cols;
    return json;
}

function tick() {
    setTimeout(tick, 200);
    visitCell();
    displayBoard();
    checkGoal();
}

    // Player logic to move through the maze + update player view.
function visitCell() {
    let cells = document.querySelectorAll("#board .cell");
    let currentCell = route[route.length - 1];
    let cellElement;

    // Find the cell element in the view
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].dataset.row == currentCell.row && cells[i].dataset.col == currentCell.col) {
            cellElement = cells[i];
            break;
        }
    }

    let hasTopWall = cellElement.classList.contains("top-wall");
    let hasRightWall = cellElement.classList.contains("right-wall");
    let hasBottomWall = cellElement.classList.contains("bottom-wall");
    let hasLeftWall = cellElement.classList.contains("left-wall");

    console.log(`Cell at row ${currentCell.row}, col ${currentCell.col} has top wall: ${hasTopWall}, right wall: ${hasRightWall}, bottom wall: ${hasBottomWall}, left wall: ${hasLeftWall}`);

    // Check if the player can move in any direction
    if (route.length > 1) {
        let previousCell = route[route.length - 2];
        if (previousCell.row == currentCell.row && previousCell.col == currentCell.col + 1) {
            hasRightWall = true;
        }
        else if (previousCell.row == currentCell.row && previousCell.col == currentCell.col - 1) {
            hasLeftWall = true;
        }
        else if (previousCell.row == currentCell.row + 1 && previousCell.col == currentCell.col) {
            hasBottomWall = true;
        }
        else if (previousCell.row == currentCell.row - 1 && previousCell.col == currentCell.col) {
            hasTopWall = true;
        }
    }
    if (!hasRightWall) {
        let nextCell = { row: currentCell.row, col: currentCell.col + 1 };
        route.push(nextCell);
    }
    else if (!hasBottomWall) {
        let nextCell = { row: currentCell.row + 1, col: currentCell.col };
        route.push(nextCell);
    }
    else if (!hasLeftWall) {
        let nextCell = { row: currentCell.row, col: currentCell.col - 1 };
        route.push(nextCell);
    }
    else if (!hasTopWall) {
        let nextCell = { row: currentCell.row - 1, col: currentCell.col };
        route.push(nextCell);
    }
    else {
        route.pop();
    }

    // Update the player's position in the model
    writeToCell(currentCell.row, currentCell.col, 0); // Remove player from old position
    let newCell = route[route.length - 1];
    if (readFromCell(newCell.row, newCell.col) != 2) { // Don't overwrite the goal
    writeToCell(newCell.row, newCell.col, 1); // Add player to new position
    }

    // Update the view with trace behind each step
    let oldCellElement;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].dataset.row == currentCell.row && cells[i].dataset.col == currentCell.col) {
            oldCellElement = cells[i];
            break;
        }
    }
    oldCellElement.classList.add("trace");
}

function checkGoal() {
    let currentCell = route[route.length - 1];

    if (currentCell.row == jsonModelData.goal.row && currentCell.col == jsonModelData.goal.col) {

        // Highlight the goal cell
        let cells = document.querySelectorAll("#board .cell");
        let cellElement;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].dataset.row == jsonModelData.goal.row && cells[i].dataset.col == jsonModelData.goal.col) {
                cellElement = cells[i];
                break;
            }
        }
        cellElement.classList.add("trace");
        cellElement.classList.remove("player");
        setTimeout(() => {
            alert("Congratulations! You reached the goal!");
        }, 200);
    }
} 