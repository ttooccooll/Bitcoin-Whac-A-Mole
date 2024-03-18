const moles = document.querySelectorAll(".mole");
const scoreBoard = document.querySelector('.score');
const hashBoard = document.querySelector('.hash');
const yearBoard = document.querySelector('.year');
let timeUp = false;
let score = 0;
let hash = 0;
let year = 2008;
let started = false;
let hashInterval;
let yearInterval;

function popTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomMole() {
    const index = Math.floor(Math.random() * moles.length);
    return moles[index];
}

function pop() {
    const time = popTime(500, 1000);
    let mole = randomMole();
    while (mole.classList.contains('smashed')) {
        mole = randomMole();
    }
    mole.classList.add('up');
    setTimeout(() => {
        mole.classList.remove('up');
        if (!timeUp) {
            pop();
        } else {
            started = false;
        }
        unsmashMoles();
    }, time);
}


function startGame() {
    if (!started) { 
        score = 0;
        hash = 0;
        baseHashRate = 1;
        baseMissRate = 1; 
        year = 2008;    
        started = true;
        scoreBoard.textContent = "Banned in "+ 0 + " countries!";
        timeUp = false;
        increaseHashRate();
        increaseYearRate();
        const smashedMoles = document.querySelectorAll('.smashed');
        smashedMoles.forEach(mole => {
            mole.classList.remove('smashed');
        });
        setTimeout(() => timeUp = true, 30000);
        
        const unsmashedMoles = document.querySelectorAll('.mole:not(.smashed)');
        if (smashedMoles.length < 16) {
            pop();
        }
    }
}

function hit(e) {
    score++;
    const mole = this;
    if (!mole.classList.contains('smashed')) {
        mole.classList.remove('up');
        mole.classList.add('smashed');
        scoreBoard.textContent = "Banned in " + score + " countries!";
        const smashSound = new Audio('smash.mp3');
        smashSound.play();
        mole.smashedHash = hash;
        if (hash >= 1) {
            hash -= 1;
            hashBoard.textContent = "Hash rate: " + Math.floor(hash) + " EH/s";
            mole.smashedHash = hash;
        } else {
            hash = 0;
            hashBoard.textContent = "Hash rate: 0 EH/s";
        }
        unsmashMoles();
    }
}

function unsmashMoles() {
    const smashedMoles = document.querySelectorAll('.smashed');
    smashedMoles.forEach(mole => {
        if (hash >= mole.smashedHash + 500) {
            mole.classList.remove('smashed');
            score--;
            scoreBoard.textContent = "Banned in " + score + " countries!";
        }
    });
}

setInterval(unsmashMoles, 500);

moles.forEach(mole => mole.addEventListener('click', hit));

let baseMissRate = 1;
const incrementFactor = Math.log(4);

function miss(e) {
    if (!e.target.classList.contains('mole')) {
        hash += baseMissRate;
        hashBoard.textContent = "Hash rate: " + Math.floor(hash) + " EH/s";
        baseMissRate *= incrementFactor;
    }
}

document.addEventListener('click', miss);

function increaseHashRate() {
    let baseHashRate = 1;
    let incrementFactor = Math.log(4);

    hashInterval = setInterval(() => {
        hash += baseHashRate;
        hashBoard.textContent = "Hash rate: " + Math.floor(hash) + " EH/s";
        baseHashRate *= incrementFactor;
    }, 1000);

    setTimeout(() => {
        clearInterval(hashInterval);
    }, 30000);
}

function increaseYearRate() {
    yearInterval = setInterval(() => {
        year++;
        yearBoard.textContent = "Date: " + year;
    }, 1000);

    setTimeout(() => {
        clearInterval(yearInterval);
    }, 30000);
}
