import { useRef, useEffect } from "react"

export default function Board({ board, handleBoxClick, onCopy }) {
    let canvas

    let mini = (window.innerWidth <= 600)

    const divider = 500 / board.length

    const canvasRef = useRef(null)

    useEffect(() => {
        canvas = canvasRef.current

        const context = canvas.getContext("2d")

        context.fillStyle = "rgb(254 202 202)"

        context.fillRect(-1, -1, canvas.width, canvas.height)

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                context.fillStyle = board[i][j] ? "rgb(239 68 68)" : "white"
                context.fillRect((j) * divider, (i) * divider, divider * .96, divider * .96)
            }
        }
    })

    return (
        <canvas 
            onClick={event => {
            var rect = canvas.getBoundingClientRect();

            var x = Math.round((event.clientX - rect.left) / (divider))-1;
            if (x >= board[0].length) {
                x = board[0].length - 1
            }

            var y = Math.round((event.clientY - rect.top) / (divider))-1;
            if (y >= board.length) {
                y = board.length - 1
            }

            if (mini) {
                x *= 2
                y *= 2
            }

            handleBoxClick(y, x)
        }}  className="border-red-200 border-[5px] rounded-lg" 
            width={(board[0].length * divider)}
            height={(board.length * divider)}
            ref={canvasRef} />
    )
}