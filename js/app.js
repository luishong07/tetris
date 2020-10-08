document.addEventListener('DOMContentLoaded',() => {
    const grid = document.querySelector('.grid')
    const startBtn = document.querySelector('button')
    let squares = Array.from(grid.querySelectorAll('div'))
    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-display')
    const displaySquares = document.querySelectorAll('.previous-grid div')
    const width = 10
    const height = 20
    let currentPosition = 4
    let currentIndex = 0
    let timerId
    let score = 0
    let lines = 0

    function control(e){
        if(e.code === 'ArrowRight'){
            moveRight()
        }
        else if(e.code === 'ArrowUp'){
            rotate()
        }
        else if(e.code === 'ArrowLeft'){
            moveLeft()
        }
        else if(e.code === 'ArrowDown'){
            moveDown()
        }
    }

    document.addEventListener('keyup',control)

    const lTetromino = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino =[
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino =[
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominos =[
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino
    ]

    let random = Math.floor(Math.random()*theTetrominos.length)
    let currentRotation = 0
    let current = theTetrominos[random][currentRotation]


    function draw(){//draw the shape
        current.forEach(index => (
            squares[currentPosition + index].classList.add('block')
        ))
    }

    function undraw(){//undraw shape
        current.forEach(index => (
            squares[currentPosition + index].classList.remove('block')

        ))
    }

    function moveDown(){//move shape down
        undraw()
        currentPosition = currentPosition += width
        draw()
        freeze()
    }


    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))){
            currentPosition -= 1
        }
        draw()
    }


    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))){
            currentPosition += 1
        }
        draw()
    }

    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }
    
    const displayWidth = 4 
    const displayIndex = 0
    let nextRandom = 0

    const smallTetrominos = [
        [1,displayWidth+1,displayWidth*2+1,2],// lTetromino
        [0,displayWidth,displayWidth+1,displayWidth*2+1],//zTetromino
        [1,displayWidth,displayWidth+1,displayWidth+2],//tTetromino
        [0,1,displayWidth,displayWidth+1],//oTetromino
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]//iTetromino
    ]


    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('block')
        })
        smallTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block')
        })
    }



    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('block3') || 
        squares[currentPosition + index + width].classList.contains('block2'))){
            current.forEach(index => squares[index + currentPosition].classList.add('block2'))

            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            gameOver()
        }
    }

    startBtn.addEventListener('click',() => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        }
        else{
            draw()
            timerId =setInterval(moveDown,1000)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })

    ///game over funciton
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))){
            scoreDisplay.innerHTML = "game over"
            clearInterval(timerId)
        }
    }


    //add score

    function addScore(){
        for(currentIndex = 0 ; currentIndex < 199; currentIndex += width){
            const row = [currentIndex,
                currentIndex+1,
                currentIndex+2,
                currentIndex+3,
                currentIndex+4,
                currentIndex+5,
                currentIndex+6,
                currentIndex+7,
                currentIndex+8,
                currentIndex+9
            ]
            if(row.every(index => squares[index].classList.contains('block2'))){
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                linesDisplay.innerHTML = lines
                row.forEach(index =>{
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                })
                //splice array
                const squaresRemoved = squares.splice(currentIndex,width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }

        }


    }


})