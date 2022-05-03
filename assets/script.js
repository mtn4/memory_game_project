const landingPage = document.getElementById("landing-page");
const landingBtn = document.querySelector("button");
const container = document.querySelector(".game-container");
const moveCounter = document.querySelector(".moves");
const timer = document.querySelector(".timer");
const gameBoard = document.querySelector(".game-board");
const won = document.getElementById("overlay");
const wonContent = document.getElementById("won-page");
const wonBtn = document.querySelector(".won-page__btn");
const moveCounterEnd = document.querySelector(".moves-end");
const timerEnd = document.querySelector(".timer-end");
const themeButton = document.getElementById("theme");
const radioButtons = document.querySelectorAll('input[name="difficulty"]');

const gameObj = {
  gameStarted: false,
  difficulty: 6,
  flippedCards: 0,
  totalFlips: 0,
  totalTime: 0,
  loop: null,
};

landingBtn.addEventListener("click", () => {
  landingPage.classList.toggle("display-none");
  container.classList.toggle("display-none");
  gameObj.gameStarted = true;
  for (let i = 0; i < 3; i++) {
    if (radioButtons[i].checked) {
      if (i === 1) {
        gameBoard.classList.add("game-board__medium");
        gameObj.difficulty = 9;
      }
      if (i === 2) {
        gameBoard.classList.add("game-board__hard");
        gameObj.difficulty = 12;
      }
      break;
    }
  }
  gameObj.loop = setInterval(() => {
    gameObj.totalTime++;
    moveCounter.innerText = `Total Moves: ${gameObj.totalFlips}`;
    timer.innerText = `Time Elapsed: ${gameObj.totalTime} Seconds`;
  }, 1000);
  drawBoard();
});

themeButton.addEventListener("click", (e) => {
  const cardFront = document.querySelectorAll(".card-front");
  if (e.target.textContent === "Dark Mode") {
    for (let i = 0; i < cardFront.length; i++) {
      cardFront[i].classList.add("card-front__dark");
    }
    container.classList.add("game-container__dark");
    moveCounter.style.color = "white";
    timer.style.color = "white";
    e.target.textContent = "Light Mode";
  } else {
    for (let i = 0; i < cardFront.length; i++) {
      cardFront[i].classList.remove("card-front__dark");
    }
    container.classList.remove("game-container__dark");
    moveCounter.style.color = "black";
    timer.style.color = "black";
    e.target.textContent = "Dark Mode";
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const randomizeArray = (arr) => {
  let newArr = [];
  while (arr.length > 0) {
    let rand = getRandomInt(0, arr.length);
    newArr.push(arr[rand]);
    arr.splice(rand, 1);
  }
  return newArr;
};
const pickNumItems = (arr, num) => {
  let newArr = [];
  while (newArr.length < num) {
    let rand = getRandomInt(0, arr.length);
    newArr.push(arr[rand]);
    arr.splice(rand, 1);
  }
  return newArr;
};
const drawBoard = () => {
  const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "orange",
    "purple",
    "cyan",
    "magenta",
    "silver",
    "brown",
    "pink",
    "teal",
  ];
  const pickColorsPerDiff = pickNumItems(colors, gameObj.difficulty);
  const items = randomizeArray([...pickColorsPerDiff, ...pickColorsPerDiff]);
  for (let i = 0; i < items.length; i++) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back", items[i]);
    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    gameBoard.appendChild(cardElement);
  }
};

gameBoard.addEventListener("click", (e) => {
  const eventTarget = e.target;
  const eventParent = eventTarget.parentElement;
  if (
    eventTarget.className.includes("card") &&
    !eventParent.className.includes("flipped")
  ) {
    flipCard(eventParent);
  }
});

const flipCard = (card) => {
  gameObj.flippedCards++;
  if (gameObj.flippedCards <= 2) {
    gameObj.totalFlips++;
    card.classList.add("flipped");
  }

  if (gameObj.flippedCards === 2) {
    const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
    if (
      flippedCards[0].childNodes[1].classList[1] ===
      flippedCards[1].childNodes[1].classList[1]
    ) {
      flippedCards[0].classList.add("matched");
      flippedCards[1].classList.add("matched");
    }
    setTimeout(() => {
      flipBackCards();
    }, 1000);
  }
  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    setTimeout(() => {
      won.style.width = "100%";
      clearInterval(gameObj.loop);
      moveCounterEnd.innerText = `Total Moves: ${gameObj.totalFlips}`;
      timerEnd.innerText = `Time Elapsed: ${gameObj.totalTime} Seconds`;
    }, 1000);
  }
};
const flipBackCards = () => {
  document.querySelectorAll(".card:not(.matched)").forEach((card) => {
    card.classList.remove("flipped");
  });
  gameObj.flippedCards = 0;
};

wonBtn.addEventListener("click", () => {
  won.style.width = "0%";
  gameObj.flippedCards = 0;
  gameObj.totalFlips = 0;
  gameObj.totalTime = 0;
  gameObj.loop = setInterval(() => {
    gameObj.totalTime++;
    moveCounter.innerText = `Total Moves: ${gameObj.totalFlips}`;
    timer.innerText = `Time Elapsed: ${gameObj.totalTime} Seconds`;
  }, 1000);
  gameBoard.innerHTML = "";
  drawBoard();
});
