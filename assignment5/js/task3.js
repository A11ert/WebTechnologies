// data for the rules
const TYPES = [
    { name: 'Standard', price: 3000, seats: 50 },
    { name: 'VIP', price: 9000, seats: 3 },
    { name: 'Student', price: 1500, seats: 10 }
];
const SOLD_OUT = ['2026-11-14', '2026-11-21'];
const PROMOS = { SAVE10: 10, AITU20: 20 };
const STUDENT_EMAIL = '@astanait.edu.kz';

// messages for the HTML attributes (Constraint Validation API)
const TEXTS = {
    valueMissing: 'This field is required.',
    typeMismatch: 'Enter a valid email, e.g. name@mail.com.',
    tooShort: 'Enter at least 2 characters.',
    rangeUnderflow: 'At least 1 ticket.',
    rangeOverflow: 'At most 10 tickets per order.',
    stepMismatch: 'Enter a whole number.',
    badInput: 'Enter a number.'
};

const form = document.querySelector('#form');
const summary = document.querySelector('#summary');
const previewBox = document.querySelector('#preview');
const result = document.querySelector('#result');
const today = new Date().toISOString().slice(0, 10); // "2026-10-25"

form.noValidate = true; // turn off browser messages, checkValidity() still works
const fields = [...form.elements].filter(f => f.name);
const touched = new Set();

for (const t of TYPES) form.type.append(new Option(`${t.name} - ${t.price} ₸`, t.name));

function type() {
    return TYPES.find(t => t.name === form.type.value);
}

function discount() {
    return PROMOS[form.promo.value.trim().toUpperCase()] || 0;
}

function total() {
    const t = type();
    return t ? t.price * Number(form.quantity.value) * (100 - discount()) / 100 : 0;
}

// rules that HTML attributes cannot express
const rules = {
    date: () => {
        if (SOLD_OUT.includes(form.date.value)) return 'Sold out on this date, choose another one.';
        if (form.date.value < today) return 'This date has already passed.';
        return '';
    },
    quantity: () => {
        const t = type();
        return t && Number(form.quantity.value) > t.seats ? `Only ${t.seats} ${t.name} seats left.` : '';
    },
    email: () => {
        const t = type();
        return t && t.name === 'Student' && !form.email.value.endsWith(STUDENT_EMAIL) ? `Student tickets need an ${STUDENT_EMAIL} email.` : '';
    },
    promo: () => form.promo.value && !discount() ? 'Unknown promo code.' : ''
};

function errorFor(field) {
    for (const key in TEXTS) {
        if (field.validity[key]) return TEXTS[key];
    }
    return rules[field.name] ? rules[field.name]() : '';
}

// show or hide the message under one field
function check(field) {
    const error = errorFor(field);
    field.setAttribute('aria-invalid', error !== '');
    document.querySelector(`#${field.name}-error`).textContent = error;
    return error === '';
}

// lines of the ticket, used by the preview and by the final ticket
function lines() {
    const t = type();
    return [
        form.event.value || 'Event',
        form.date.value || 'Date',
        `${form.quantity.value || 0} × ${t ? t.name : 'ticket'}${t ? ` (${t.seats} seats left)` : ''}`,
        form.name.value || 'Your name',
        form.email.value || 'Your email',
        `Total: ${total()} ₸${discount() ? ` (-${discount()}%)` : ''}`
    ];
}

function fill(box, texts) {
    box.replaceChildren();
    for (const text of texts) {
        const p = document.createElement('p');
        p.textContent = text;
        box.append(p);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// a field is checked on blur first, then on every input
for (const field of fields) {
    field.addEventListener('blur', () => {
        touched.add(field);
        check(field);
    });
}

form.addEventListener('input', () => {
    for (const field of touched) check(field); // all touched fields, because rules compare fields
    fill(previewBox, lines());
});

form.addEventListener('submit', e => {
    e.preventDefault();

    const bad = fields.filter(f => !check(f));
    for (const field of fields) touched.add(field);

    if (bad.length > 0) {
        summary.textContent = `Please fix ${bad.length} error(s).`;
        bad[0].focus();
        return;
    }

    fill(result, ['Your ticket', ...lines(), `Booking code: TG-${random(100000, 999999)}`]);
    type().seats -= Number(form.quantity.value);
    result.hidden = false;
    summary.textContent = '';

    form.reset();
    touched.clear();
    for (const field of fields) {
        field.removeAttribute('aria-invalid');
        document.querySelector(`#${field.name}-error`).textContent = '';
    }
    fill(previewBox, lines());
});

fill(previewBox, lines());
