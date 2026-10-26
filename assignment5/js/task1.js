// all numbers of the game - change them here and the game follows
const LIVES = 3;
const MIN_PRICE = 500;
const MAX_PRICE = 5000;

const priceText = document.querySelector('#price');
const message = document.querySelector('#message');
const stats = document.querySelector('#stats');

let lives;
let streak;
let best = 0;
let price;

// whole number from min to max, both included
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// show the state after every move
function show(text, state) {
    priceText.textContent = price + ' ₸';
    stats.textContent = `Lives: ${lives} · Streak: ${streak} · Best streak: ${best}`;
    message.textContent = text;
    message.className = state;
}

function start() {
    lives = LIVES;
    streak = 0;
    price = random(MIN_PRICE, MAX_PRICE);
    show('Higher or lower?', '');
}

function guess(choice) {
    // invalid move: the game is over, so nothing changes
    if (lives === 0) {
        message.textContent = 'Game over! Press Restart to play again.';
        return;
    }

    const next = random(MIN_PRICE, MAX_PRICE);
    const old = price;
    price = next;

    // equal prices count as a right guess
    if ((choice === 'higher' && next >= old) || (choice === 'lower' && next <= old)) {
        streak++;
        if (streak > best) best = streak;
        show(`Right! ${old} → ${next} ₸`, 'win');
    } else {
        lives--;
        streak = 0;
        if (lives === 0) show(`Wrong: ${old} → ${next} ₸. Game over!`, 'over');
        else show(`Wrong: ${old} → ${next} ₸`, 'lose');
    }
}

document.querySelector('#higher').addEventListener('click', () => guess('higher'));
document.querySelector('#lower').addEventListener('click', () => guess('lower'));
document.querySelector('#restart').addEventListener('click', start);

start();
