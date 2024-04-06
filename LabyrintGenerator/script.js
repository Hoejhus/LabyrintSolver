"use strict";

document.getElementById("generate").addEventListener("click", generateMaze);
let GRID_HEIGHT = null;
let GRID_WIDTH = null;
let model = [];

document.getElementById("copyButton").addEventListener("click", function() {
    const textToCopy = document.getElementById("mazeData").innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalButtonText = this.innerText;
        this.innerText = 'Copied!';
            // reset copybutton text
        setTimeout(() => this.innerText = originalButtonText, 2000);
        });
});

function generateMaze() {
    console.log("Maze Generator Running...");
    GRID_HEIGHT = parseInt(document.getElementById("rows").value);
    GRID_WIDTH = parseInt(document.getElementById("cols").value);
    document.documentElement.style.setProperty('--GRID-WIDTH', GRID_WIDTH);
    model = createModel(GRID_HEIGHT, GRID_WIDTH);
    createView();
    displayMazeData();
}

function createModel(height, width) {
    let maze = [];

    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        let row = [];

        for (let colIndex = 0; colIndex < width; colIndex++) {
            let cell = {
                visited: false,
                walls: {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                }
            };
            row.push(cell);
        }
    maze.push(row);
    }

    let stack = [];
    let currentCell = { row: 0, col: 0 };
    maze[currentCell.row][currentCell.col].visited = true;
    let totalCells = width * height;
    let visitedCells = 1;

    while (visitedCells < totalCells) {
        let neighbors = getUnvisitedNeighbors(currentCell, maze);

        if (neighbors.length > 0) {
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];

            removeWall(currentCell, next, maze);

            stack.push(currentCell);
            currentCell = next.cell;
            maze[currentCell.row][currentCell.col].visited = true;
            visitedCells++;
        } else if (stack.length > 0) {
            currentCell = stack.pop();
        }
    }
    return maze;
}

function getUnvisitedNeighbors(cell, maze) {
    let neighbors = [];

    const directions = [
        { name: 'top', row: -1, col: 0 },
        { name: 'right', row: 0, col: 1 },
        { name: 'bottom', row: 1, col: 0 },
        { name: 'left', row: 0, col: -1 }
    ];

    for (let i = 0; i < directions.length; i++) {
        let neighborRow = cell.row + directions[i].row;
        let neighborCol = cell.col + directions[i].col;

        // check if neighbor is within maze and unvisited
        if (neighborRow >= 0 && neighborRow < GRID_HEIGHT && neighborCol >= 0 && neighborCol < GRID_WIDTH && !maze[neighborRow][neighborCol].visited) {
            neighbors.push({
                direction: directions[i].name,
                cell: { 
                    row: neighborRow,
                    col: neighborCol
                }
            });
        }
    }
    return neighbors;
}

function removeWall(current, next, maze) {
    const directionToWalls = {
        'right': {current: 'right', next: 'left'},
        'left': {current: 'left', next: 'right'},
        'down': {current: 'bottom', next: 'top'},
        'up': {current: 'top', next: 'bottom'}
    };
    
    let row = next.cell.col - current.col;
    let col = next.cell.row - current.row;
    let directionKey;

    if (row === 1) directionKey = 'right';
    else if (row === -1) directionKey = 'left';
    else if (col === 1) directionKey = 'down';
    else if (col === -1) directionKey = 'up';

    // remove walls
    if (directionKey) {
        const walls = directionToWalls[directionKey];
        maze[current.row][current.col].walls[walls.current] = false;
        maze[next.cell.row][next.cell.col].walls[walls.next] = false;
    }
}

    // create divs add element properties for styling
function createView() {
    const board = document.querySelector("#board");
    board.innerHTML = ''; // clear maze
    board.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, var(--cell-size))`;

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (model[row][col].walls.top) cell.classList.add("top-wall");
            if (model[row][col].walls.right) cell.classList.add("right-wall");
            if (model[row][col].walls.bottom) cell.classList.add("bottom-wall");
            if (model[row][col].walls.left) cell.classList.add("left-wall");
            board.appendChild(cell);
        }
    }
}

function displayMazeData() {
    let mazeData = {
        rows: GRID_HEIGHT,
        cols: GRID_WIDTH,
        start: { row: 0, col: 0 },
        goal: { row: GRID_HEIGHT - 1, col: GRID_WIDTH - 1 },
        maze: []
    };

    for (let row = 0; row < GRID_HEIGHT; row++) {
        let mazeRow = [];
        for (let col = 0; col < GRID_WIDTH; col++) {
            let cell = model[row][col];
            mazeRow.push({
                row: row,
                col: col,
                north: cell.walls.top,
                east: cell.walls.right,
                south: cell.walls.bottom,
                west: cell.walls.left
            });
        }
        mazeData.maze.push(mazeRow);
    }

    // display maze data in json
    let mazeDataElement = document.getElementById("mazeData");
    mazeDataElement.id = "mazeData";
    document.body.appendChild(mazeDataElement);
    mazeDataElement.textContent = JSON.stringify(mazeData, null, 2);
}