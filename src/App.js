import { useState, useEffect } from "react";
import stepOneGeneration from "./gameOfLife";
import configurations from "./configurations";
import Board from "./components/Board";
import playButton from "./images/playButton.png";
import pauseButton from "./images/pauseButton.png";

function saveLayout(board) {
  let solids = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j]) {
        solids.push(`[${i},${j}]`);
      }
    }
  }
  navigator.clipboard.writeText(`[${solids}]`);
}

function fillBoard(rows, cols, randomised) {
  let array = [];
  let row;
  for (let i = 0; i < rows; i++) {
    row = [];
    for (let j = 0; j < cols; j++) {
      row.push(randomised ? (Math.random() < 0.3 ? 1 : 0) : 0);
    }
    array.push(row);
  }
  return array;
}

function sleep(ms) {
  return new Promise((resolve, ms) => setTimeout(resolve, ms));
}

export default function App() {
  let interval;
  const [rows, setRows] = useState(60);
  const [cols, setCols] = useState(60);
  const [speed, setSpeed] = useState(100);
  const [board, setBoard] = useState(fillBoard(rows, cols, true));
  const [playing, setPlaying] = useState(false);
  const [configuration, setConfiguration] = useState("glider gun")

  useEffect(() => {
    window.addEventListener("copy", () => {
      saveLayout(board);
    });

  }, [board]);

  function handleBoxClick(row, col) {
    let copyBoard = board.slice();
    copyBoard[row][col] = board[row][col] ? 0 : 1;
    setBoard(copyBoard);
  }

  function setLayout(layout) {
    let newBoard = fillBoard(rows, cols, false);

    for (let item of layout) {
      if (item[0] >= rows || item[1] >= cols) {
        alert("this configuration is too large for the current board");
        return;
      }
      newBoard[item[0]][item[1]] = 1;
    }
    setPlaying(false)
    setBoard(newBoard);

  }

  function handleResize(rows, cols) {
    setRows(rows);
    setCols(cols);
    setBoard(fillBoard(rows, cols, true));
  }

  useEffect(() => {
    interval = setInterval(() => {
      if (playing) {
        setBoard((board) => stepOneGeneration(board));
      }
    }, (101 - speed) * 3);

    return () => clearInterval(interval);
  }, [playing, speed]);

  return (
    <div className="App align-middle">
      <div className="mt-[30%] md:mt-0 flex justify-center items-center">
        <button
          onClick={() => {
            setBoard(fillBoard(rows, cols, true));
            setPlaying(false);
          }}
        >
          Randomise
        </button>
        <button
          onClick={() => {
            setBoard(fillBoard(rows, cols, false));
            setPlaying(false);
          }}
        >
          Clear
        </button>

        <select onInput={(event) => setLayout(JSON.parse(event.target.value))}>
          {configurations.map((configuration) => {
            return (
              <option value={JSON.stringify(configuration.layout)}>
                {configuration.name}
              </option>
            );
          })}
        </select>

        <button onClick={() => setPlaying(!playing)}>
          <img src={playing ? pauseButton : playButton} width={12} />
        </button>
      </div>

      <div className="flex justify-center mt-3 md:mt-0">
        <Board
          id="board"
          onCopy={() => saveLayout(board)}
          board={board}
          handleBoxClick={handleBoxClick}
        />
      </div>

      <div className="flex justify-center mt-[20px]">
        <p className="mr-16">Rows: {rows}</p>
        <p>Columns: {cols}</p>
        <p className="ml-16">Speed: {speed}</p>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-[28px] p-2 bg-gray-100 border-gray-200 border-[3px] rounded-full">
          <input
            type="range"
            min={window.innerWidth <= 600 ? 55 : 30}
            max={200}
            step={5}
            onInput={(event) => handleResize(event.target.value, cols)}
            value={rows}
            onChange={(event) => handleResize(event.target.value, cols)}
          />

          <input
            type="range"
            min={30}
            max={200}
            step={5}
            onInput={(event) => handleResize(rows, event.target.value)}
            value={cols}
            onChange={(event) => handleResize(rows, event.target.value)}
          />

          <input
            type="range"
            min={0}
            max={100}
            step={10}
            onInput={(event) => setSpeed(event.target.value)}
            value={speed}
            onChange={(event) => setSpeed(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
