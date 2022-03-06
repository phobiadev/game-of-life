import { useState, useEffect } from "react"
import stepOneGeneration from "./gameOfLife"
import configurations from "./configurations"
import Board from "./components/Board"

function saveLayout(board) {
  let solids = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j]) {
        solids.push(`[${i},${j}]`)
      }
    }
  }
  navigator.clipboard.writeText(`[${solids}]`)
  alert("copied")
}

function fillBoard(rows,cols, randomised) {
  let array = []
  let row
  for (let i = 0; i < rows; i++) {
    row = []
    for (let j = 0; j < cols; j++) {
      row.push(randomised ? (Math.random() < 0.3 ? 1: 0) : 0)
    }
    array.push(row)
  }
  return array
}

function sleep(ms) {
  return new Promise((resolve,ms) => setTimeout(resolve,ms))
}

export default function App() {
  let interval
  const [rows, setRows] = useState(60)
  const [cols, setCols] = useState(60)
  const [speed, setSpeed] = useState(100)
  const [board, setBoard] = useState(fillBoard(rows,cols,true))
  const [playing, setPlaying] = useState(false)
  

  function handleBoxClick(row,col) {
    let copyBoard = board.slice()
    copyBoard[row][col] = board[row][col] ? 0 : 1
    setBoard(copyBoard)
  }


  function setLayout(layoutName) {
    let layout

    for (let config of configurations) {
      if (config.name == layoutName) {

        layout = config.layout
        console.log(layout)

        let newBoard = fillBoard(rows,cols,false)

        for (let item of layout) {
          if (item[0] >= rows || item[1] >= cols) {
            alert("this configuration is too large for the current board")
            return
          }
          newBoard[item[0]][item[1]] = 1
        }
        setBoard(newBoard)
      }
    } 
  }


  function handleResize(rows,cols) {
    setRows(rows)
    setCols(cols)
    setBoard(fillBoard(rows,cols,true))
  }


  useEffect(() => {
    interval = setInterval(() => {
      if (playing) {
        setBoard(board => stepOneGeneration(board))
      }
    },(200/(speed+1))+8)

    return () => clearInterval(interval)
  },[playing,speed])



  return (
    <div className="App">

      <div className="flex justify-center items-center m-2">
        <button onClick={() => saveLayout(board)}>(debug) copy layout</button>
        <button onClick={() => {setBoard(fillBoard(rows,cols,true)); setPlaying(false)}}>Randomise</button>
        <button onClick={() => {setBoard(fillBoard(rows,cols,false)); setPlaying(false)}}>Clear</button>
        <button onClick={() => setBoard(stepOneGeneration(board))}>step</button>
        <button onClick={() => setPlaying(!playing)}>{playing ? "stop" : "start"}</button>

        <select onInput={event => setLayout(event.target.value)}>
          {configurations.map(configuration => {
            return (
              <option value={configuration.name}>{configuration.name}</option>
            )
          })}
          <option value="not real">test</option>
        </select>
      </div>

      <div className="flex justify-center">
        <Board board={board} handleBoxClick={handleBoxClick}/>      
      </div>

      <div className="flex justify-center mt-[20px]">
        <p className="mr-16">Rows: {rows}</p>
        <p>Columns: {cols}</p>
        <p className="ml-16">Speed: {speed}</p>
      </div>

      <div className="flex justify-center space-x-8">
          <input type="range" min={30} max={80} step={10} onInput={event => handleResize(event.target.value,cols)} value={rows} onChange={event => handleResize(event.target.value,cols)}/>
          <input type="range" min={30} max={80} step={10} onInput={event => handleResize(rows,event.target.value)} value={cols} onChange={event => handleResize(rows,event.target.value)}/>
          <input type="range" min={0} max={100} step={10} onInput={event => setSpeed(event.target.value)} value={speed} onChange={event => setSpeed(event.target.value)}/>
      </div>
      
    </div>
    

  )
}