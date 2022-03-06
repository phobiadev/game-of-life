function getTouching(grid,row,col) {
  let touching = 0
  // up, down, right, left, diagupright, diagupleft, diagdownright, diagdownleft
  let connections = {
    up: [row-1,col],
    down: [row+1,col],
    right: [row,col+1],
    left: [row,col-1],
    diagUpRight: [row-1,col+1],
    diagUpLeft: [row-1,col-1],
    diagDownRight: [row+1,col+1],
    diagDownLeft: [row+1,col-1]
}

  if (row == 0) {
    delete connections.up
    delete connections.diagUpRight
    delete connections.diagUpLeft
  } else if (row == grid.length-1) {
    delete connections.down
    delete connections.diagDownRight
    delete connections.diagDownLeft
  }

  if (col == 0) {
    delete connections.left
    delete connections.diagUpLeft
    delete connections.diagDownLeft
  } else if (col == grid[0].length-1) {
    delete connections.right
    delete connections.diagUpRight
    delete connections.diagDownRight
  }

  Object.values(connections).forEach(connection => {
    touching += grid[connection[0]][connection[1]]
  })

  return touching

}

function stepOneGeneration(grid) {
  let touching
  let newGrid = JSON.parse(JSON.stringify(grid))
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      touching = getTouching(grid,i,j)
      if (grid[i][j]) {
        if (touching !== 2 && touching !== 3) {
          newGrid[i][j] = 0
        }
      } else {
        if (touching == 3) {
          newGrid[i][j] = 1
        }
      }
    }
  }
  return newGrid
}

export default stepOneGeneration