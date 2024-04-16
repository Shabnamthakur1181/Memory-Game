// const moves = document.getElementById("moves-count");
// const timeValue = document.getElementById("time");
// const startButton = document.getElementById("start");
// const stopButton = document.getElementById("stop");
// const gameContainer = document.querySelector(".game-container");
// const result = document.getElementById("result");
// const control = docment.querySelector(".controls-container");
// let cards;
// let interval;
// let firstCard = false;
// let secondCard = false;

// //Items array
// const items = [
//     {name: "bee", image: "bee.png"},
//     {name:"crocodile", image:"crocodile.png"},
//     {name:"macaw", image:"macaw.png"},
//     {name:"gorilla", image:"gorilla.png"},
//     {name:"tiger", image:"tiger.png"},
//     {name:"monkey", image:"monkey.png"},
//     {name:"chameleon", image:"chameleon.png"},
//     {name:"piranha", image:"piranha.png"},
//     {name:"anaconda", image:"anaconda.png"},
//     {name:"sloth", image:"sloth.png"},
//     {name:"cockatoo", image:"cockatoo.png"},
//     {name:"toucan", image:"toucan.png"},
// ];

// //Initial time
// let seconds = 0,
//   minutes = 0;
// //Initial moves and win count
// let movesCount = 0,
//   winCount = 0;

// //For timer
// const timeGenerator = () => {
//     seconds += 1;

//     //minutes logic
//     if (seconds >= 60) {
//         minutes += 1;
//         seconds = 0;
//     }


// //format time before displaying
// let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
// let minutesValues = minutes < 10 ? `0${minutes}` : minutes;
// timeValue.innerHTML = `<span>Time:</span>${minutesValues}:${secondsValue}`;
// };

// //For calculating moves
// const movesCounter = () => {
//     movesCount += 1;
//     moves.innnerHTML = `<span>Moves:</span>${movesCount}`;

// };

// //pick random objects from the items array
// const generateRandom = (size = 4) => {
//     //temporary array
//     let tempArray = [...items];
//     //initializes cardValues array
//     let cardValues = [];
//     //size should be double (4*4 matrix)/2 since pairs of objects would exist
//     size = (size * size) / 2;
//     //Random object selection
//     for(let i=0; i< size;i++) {
//         const randomIndex = Math.floor(Math.random() * tempArray.length);
//         cardValues.push(tempArray[randomIndex]);
//         //once selected remove the object from temp array
//         tempArray.splice(randomIndex, 1);
//     }
//     return cardValues;
// };

// const matrixGenerator = (cardValue, size = 4) => {
//     gameContainer.innerHTML = "";
//     cardValues = [...cardValues, ...cardValues];
//     //simple shuffle
//     cardValues.sort(() => Math.random() -0.5);
//     for(let i=0; i<size*size; i++) {
//         /*
//         Create Cards
//         before => front side (contains question mark)
//         after => back side (contains actual image);
//         data-acrd-values is a custom attribute which stores the names of the cards to match later
//         */
//        gameContainer.innerHTML += `
//        <div class="card-container" data-card-value="${cardValues[i].name}">
//        <div class="card-before">?</div>
//        <div class="card-after">
//        <img src="${cardValues[i].image}" class="image"/></div>
//        </div>
//        `;
//     }

//     //grid
//     gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

// };

// //Initialize values and func calls
// const initializer = () => {
//     result.innerText = "";
//     winCount = 0;
//     let cardValues = generateRandom();
//     console.log(cardValues);
//     matrixGenerator(cardValues);
// };

// initializer();

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')  

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()