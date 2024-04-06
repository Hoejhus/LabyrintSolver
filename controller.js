import { createView, parseModel } from "./view.js";

"use strict";

window.addEventListener("load", start);

export let GRID_HEIGHT = null;
export let GRID_WIDTH = null;
export let route = [];
let jsonModelData = null;

async function start() {
    console.log("Labyrint Solver Running...");
    jsonModelData = await loadJsonModel();
    createView();
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
    setTimeout(tick, 100);
    visitCell();
    checkGoal();
}

function visitCell() {
    let currentCell = route.at(-1);

    if (!tryMoveFromCell(currentCell, null)) {
        console.log("Dead end, attempting to backtrack and find new paths...");
        tryBacktrackAndMove();
    }
}

    // Backtracking to previous
function tryBacktrackAndMove() {
    while (route.length > 1) {
        let lastCell = route.pop();
        let currentCell = route.at(-1);
        
        updatePlayerPosition(lastCell, currentCell);

        if (tryMoveFromCell(currentCell, lastCell)) {
            console.log(`Found new path after backtracking to cell: Row ${currentCell.row}, Col ${currentCell.col}`);
            break;
        }
    }
}

function tryMoveFromCell(currentCell, lastCell) {
    let cellElement = document.querySelector(`#board .cell[data-row="${currentCell.row}"][data-col="${currentCell.col}"]`);
    const directions = [
        { name: 'right', wall: 'right-wall', row: 0, col: 1 },
        { name: 'bottom', wall: 'bottom-wall', row: 1, col: 0 },
        { name: 'left', wall: 'left-wall', row: 0, col: -1 },
        { name: 'top', wall: 'top-wall', row: -1, col: 0 },
    ];

    for (let i = 0; i < directions.length; i++) {
        let direction = directions[i];
        if (!cellElement.classList.contains(direction.wall)) {
            let nextCell = { row: currentCell.row + direction.row, col: currentCell.col + direction.col };
    
            if ((lastCell && nextCell.row === lastCell.row && nextCell.col === lastCell.col) || isCellVisited(nextCell)) {
                continue;
            }
    
            route.push(nextCell);
            console.log(`Moving to cell: Row ${nextCell.row}, Col ${nextCell.col}`);
            updatePlayerPosition(currentCell, nextCell);
            return true;
        }
    }

    return false;
}

function isCellVisited(nextCell) {
    for (let i = 0; i < route.length; i++) {
        if (route[i].row === nextCell.row && route[i].col === nextCell.col) {
            return true;
        }
    }
    return false;
}

function updatePlayerPosition(oldCell, newCell) {
    movePlayerToNewCell(newCell);
    if (oldCell !== newCell) {
        markOldCellAsVisited(oldCell);
    }
}

function movePlayerToNewCell(newCell) {
    const newCellElement = getCellElement(newCell);
    newCellElement.classList.add("player");
}

function markOldCellAsVisited(oldCell) {
    const oldCellElement = getCellElement(oldCell);
    oldCellElement.classList.remove("player");
    oldCellElement.classList.add("trace");
}

function getCellElement(cell) {
    const selector = `#board .cell[data-row="${cell.row}"][data-col="${cell.col}"]`;
    return document.querySelector(selector);
}

async function resetGame() {
    console.log("Resetting game...");
    route.length = 0;

    const cells = document.querySelectorAll("#board .cell");
    cells.forEach(cell => {
        cell.classList.remove("player", "trace");
    });
    createView();
    parseModel(jsonModelData);
    route.push(jsonModelData.start);
}

function checkGoal() {
    let currentCell = route.at(-1);

    if (currentCell.row == jsonModelData.goal.row && currentCell.col == jsonModelData.goal.col) {
        // Goal cell
        let cellElement = document.querySelector(`#board .cell[data-row="${jsonModelData.goal.row}"][data-col="${jsonModelData.goal.col}"]`);
        cellElement.classList.add("trace");
        cellElement.classList.remove("player");
        setTimeout(() => {
            alert("Congratulations! You reached the goal!");
            resetGame();
        }, 200);
    }
}
