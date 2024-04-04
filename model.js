import { GRID_HEIGHT, GRID_WIDTH } from './controller.js';

export let route = [];
export const model = [];

export function createModel() {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        const newRow = [];
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (row === 0 && col === 0) {
                newRow[col] = 1; // player
            } else if (row === 2 && col === 3) {
                newRow[col] = 2; // goal
            } else {
                newRow[col] = 0;
            }
        }
        model[row] = newRow;
    }
}

export function writeToCell(row, col, value) {
    model[row][col] = value;
}
  
export function readFromCell(row, col) {
    return model[row][col];
}

export function writeToCellWallData(row, col, cellData) {
    model[row][col] = {
        north: cellData.north,
        east: cellData.east,
        south: cellData.south,
        west: cellData.west,
    };
}