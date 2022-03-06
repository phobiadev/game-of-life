import { useRef, useEffect } from "react"

export default function Board({ board, handleBoxClick }) {
    let canvas

    let mini = (window.innerWidth < 600)

    const divider = 500 / board.length

    const canvasRef = useRef(null)

    useEffect(() => {
        canvas = canvasRef.current

        const context = canvas.getContext("2d")

        context.fillStyle = "black"

        context.fillRect(-1, -1, canvas.width, canvas.height)

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                context.fillStyle = board[i][j] ? "red" : "white"
                context.fillRect((j) * divider, (i) * divider, divider * .9, divider * .9)
            }
        }
    })

    return (
        <canvas 
            onClick={event => {
            var rect = canvas.getBoundingClientRect();

            var x = Math.floor((event.clientX - rect.left) / (divider));
            if (x >= board[0].length) {
                x = board[0].length - 1
            }

            var y = Math.floor((event.clientY - rect.top) / (divider));
            if (y >= board.length) {
                y = board.length - 1
            }

            if (mini) {
                x *= 2
                y *= 2
            }

            handleBoxClick(y, x)
        }}  className="border-black border-[5px] rounded-lg" 
            width={(board[0].length * divider)}
            height={(board.length * divider)}
            ref={canvasRef} />
    )
}