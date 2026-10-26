// rules of the board
const COLUMNS = ['New', 'Preparing', 'Picked up'];
const MAX_PREPARING = 3;

// data: id (number), title (string), tag (string), priority (number 1-3), vegan (boolean), column (index in COLUMNS)
const orders = [
    { id: 1, title: 'Croissant bag', tag: 'bakery', priority: 3, vegan: false, column: 0 },
    { id: 2, title: 'Bread box', tag: 'bakery', priority: 1, vegan: true, column: 0 },
    { id: 3, title: 'Donut mix', tag: 'bakery', priority: 2, vegan: false, column: 1 },
    { id: 4, title: 'Coffee & cake', tag: 'cafe', priority: 2, vegan: false, column: 0 },
    { id: 5, title: 'Salad bowl', tag: 'cafe', priority: 3, vegan: true, column: 1 },
    { id: 6, title: 'Sandwich bag', tag: 'cafe', priority: 1, vegan: false, column: 2 },
    { id: 7, title: 'Fruit box', tag: 'grocery', priority: 3, vegan: true, column: 0 },
    { id: 8, title: 'Dairy bag', tag: 'grocery', priority: 2, vegan: false, column: 0 },
    { id: 9, title: 'Veggie box', tag: 'grocery', priority: 1, vegan: true, column: 2 },
    { id: 10, title: 'Snack pack', tag: 'grocery', priority: 2, vegan: false, column: 0 }
];

const board = document.querySelector('#board');
const search = document.querySelector('#search');
const tag = document.querySelector('#tag');
const sort = document.querySelector('#sort');
const message = document.querySelector('#message');
const empty = document.querySelector('#empty');
const progress = document.querySelector('#progress');
const progressText = document.querySelector('#progressText');

// own loop: how many orders are in column c
function count(c) {
    let n = 0;
    for (const order of orders) {
        if (order.column === c) n++;
    }
    return n;
}

// arrow button; disabled when there is no column on that side
function arrow(text, order, step) {
    const button = document.createElement('button');
    button.textContent = text;
    button.dataset.id = order.id;
    button.dataset.step = step;
    button.disabled = order.column + step < 0 || order.column + step >= COLUMNS.length;
    return button;
}

function card(order) {
    const item = document.createElement('article');
    item.classList.add('order', 'p' + order.priority);

    const title = document.createElement('h3');
    title.textContent = order.title + (order.vegan ? ' 🌱' : '');

    const info = document.createElement('p');
    info.textContent = `${order.tag} · priority ${order.priority}`;

    item.append(title, info, arrow('←', order, -1), arrow('→', order, 1));
    return item;
}

// the page is always built from the array
function render() {
    const text = search.value.trim().toLowerCase();
    const list = orders.filter(o => o.title.toLowerCase().includes(text) && (tag.value === 'all' || o.tag === tag.value));
    if (sort.checked) list.sort((a, b) => b.priority - a.priority);

    board.replaceChildren();
    for (let c = 0; c < COLUMNS.length; c++) {
        const column = document.createElement('section');
        column.classList.add('column');

        const heading = document.createElement('h2');
        heading.textContent = `${COLUMNS[c]} (${count(c)})`;
        column.append(heading);

        for (const order of list) {
            if (order.column === c) column.append(card(order));
        }
        board.append(column);
    }

    empty.hidden = list.length > 0;

    const done = count(COLUMNS.length - 1);
    progress.max = orders.length;
    progress.value = done;
    progressText.textContent = `${done} of ${orders.length}`;
}

// one listener for the buttons of all cards (event delegation)
board.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    const order = orders.find(o => o.id === Number(button.dataset.id));
    const target = order.column + Number(button.dataset.step);

    // rule: Preparing holds at most MAX_PREPARING orders
    if (COLUMNS[target] === 'Preparing' && count(target) >= MAX_PREPARING) {
        message.textContent = `Blocked: "Preparing" can hold at most ${MAX_PREPARING} orders.`;
        message.className = 'lose';
        return;
    }

    order.column = target;
    message.textContent = '';
    render();
});

search.addEventListener('input', render);
tag.addEventListener('change', render);
sort.addEventListener('change', render);

render();
