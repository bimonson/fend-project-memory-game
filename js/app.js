/*
 * Create a list that holds all of your cards
 */


/*
 * visibility the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - visibility the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and visibility it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, visibility a message with the final score (put this functionality in another function that you call from this one)
 */

const deck = document.querySelector('.deck');

let flippedCards = [];

let moves = 0;

let timerOff = true;

let time = 0;

let timerId;

function startTimer() {
  timerId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function displayTime() {
  const timer = document.querySelector('.timer');
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if (seconds < 10 && minutes < 10) {
    timer.innerHTML = `0${minutes}:0${seconds}`;
  } else if (seconds >= 10 && minutes < 10) {
    timer.innerHTML = `0${minutes}:${seconds}`;
  } else {
    timer.innerHTML = `${minutes}:${seconds}`;
  }
}

// Counts the number of moves per round of play (two cards flipped)
function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  if (moves < 10) {
    movesText.innerHTML = moves;
  }
}

// Removes one star at 16 moves and another at 24 moves
function checkMoves() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

// Changes the visibility of the star to hidden
function hideStar() {
  const stars = document.querySelectorAll('.stars li');
  for (star of stars) {
    if (star.style.visibility !== 'hidden') {
      star.style.visibility = 'hidden';
      break;
    }
  }
}

// Calls the shuffle function and appends the shuffled cards to the deck
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();

// Adds eventListener to the deck and utilizes eventDelegation to listen to the cards and calls functions
deck.addEventListener('click', event => {
  const card = event.target;
  if (clickIsValid(card)) {
    if (timerOff) {
      startTimer();
      timerOff = false;
    }
    flipCard(card);
    addFlippedCard(card);
    if (flippedCards.length === 2) {
      checkMatch();
      addMove();
      checkMoves();
    }
  }
});

// Defines a valid click
function clickIsValid(card) {
  return (
    card.classList.contains('card') &&
    !card.classList.contains('match') &&
    flippedCards.length < 2 &&
    !flippedCards.includes(card)
  )
}

// Flips card by toggling .open and .show
function flipCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

// Adds flipped cards to the flippedCards array
function addFlippedCard(card) {
  flippedCards.push(card);
  console.log(flippedCards);
}

// Checks cards for matches and clears the flippedCards array
function checkMatch() {
  if (flippedCards[0].firstElementChild.className === flippedCards[1].firstElementChild.className) {
    flippedCards[0].classList.toggle('match');
    flippedCards[1].classList.toggle('match');
    flippedCards = [];
  } else {
    setTimeout(() => {
      flipCard(flippedCards[0]);
      flipCard(flippedCards[1]);
      flippedCards = [];
    }, 1000);
  }
}