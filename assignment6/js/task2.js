const rooms = [
    {
        id: 'balcony', name: 'Balcony', floor: 2,
        guests: [
            { name: 'Aigerim', color: 'green', time: '20:45', aitu: true, things: ['cup', 'crumbs'] },
            { name: 'Aliya', color: 'black', time: '21:15', aitu: false, things: ['phone', 'cup'] },
            { name: 'Madina', color: 'green', time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'] },
            { name: 'Ivan', color: 'black', time: '20:10', aitu: true, things: ['cup'] }
        ]
    },
    {
        id: 'hall', name: 'Hall', floor: 2,
        guests: [
            { name: 'Arman', color: 'yellow', time: '20:35', aitu: false, things: ['bag', 'glasses'] },
            { name: 'Sophia', color: 'purple', time: '21:20', aitu: true, things: ['phone'] },
            { name: 'Dias', color: 'green', time: '19:45', aitu: true, things: [] },
            { name: 'Bekzat', color: 'purple', time: '20:55', aitu: false, things: ['bag', 'cup', 'crumbs'] },
            { name: 'Aruzhan', color: 'blue', time: '21:50', aitu: true, things: ['phone'] },
            { name: 'Saule', color: 'green', time: '21:25', aitu: false, things: ['glasses'] }
        ]
    },
    {
        id: 'kitchen', name: 'Kitchen', floor: 1,
        guests: [
            { name: 'Nurlan', color: 'red', time: '19:40', aitu: true, things: ['phone', 'cup'] },
            { name: 'Emma', color: 'black', time: '20:15', aitu: false, things: ['bag'] },
            { name: 'Timur', color: 'green', time: '21:05', aitu: true, things: ['phone', 'bag', 'crumbs'] },
            { name: 'Sergey', color: 'yellow', time: '20:50', aitu: false, things: [] },
            { name: 'Yerlan', color: 'red', time: '21:40', aitu: true, things: ['glasses', 'phone'] },
            { name: 'Kamila', color: 'green', time: '20:05', aitu: false, things: ['cup'] }
        ]
    },
    {
        id: 'living', name: 'Living room', floor: 1,
        guests: [
            { name: 'Daniel', color: 'blue', time: '19:55', aitu: true, things: ['glasses'] },
            { name: 'Zarina', color: 'green', time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'] },
            { name: 'Natasha', color: 'yellow', time: '20:30', aitu: true, things: [] },
            { name: 'Askar', color: 'black', time: '21:00', aitu: true, things: ['phone'] },
            { name: 'Inkar', color: 'purple', time: '20:20', aitu: false, things: ['bag'] }
        ]
    }
];

const icons = { phone: '📱', glasses: '👓', bag: '👜', cup: '☕', crumbs: '🍰' };

function makeGuest(guest) {
    const $card = $('<div class="guest"></div>')
        .attr('id', guest.name.toLowerCase())
        .addClass(guest.color)
        .attr('data-name', guest.name)
        .attr('data-time', guest.time)
        .attr('data-color', guest.color)
        .attr('data-things', guest.things.join(' '));

    const $avatar = $('<div class="avatar"></div>')
        .append($('<img alt="">').attr('src', 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + guest.name));

    if (guest.aitu) {
        $card.addClass('aitu');
        $avatar.append('<span class="badge" title="AITU student">🎓</span>');
    }

    const $things = $('<div class="things"></div>');
    guest.things.forEach(function (thing) {
        $things.append($('<span class="thing"></span>').addClass(thing).attr('title', thing).text(icons[thing]));
    });

    return $card.append(
        $avatar,
        $('<span class="name"></span>').text(guest.name),
        $('<span class="time"></span>').text('🕒 ' + guest.time),
        $things
    );
}

const sorted = {};

function buildParty() {
    $('.flying').remove();
    const $house = $('#house').empty();

    [2, 1].forEach(function (floor) {
        const $floor = $('<div class="floor"></div>')
            .attr('id', 'floor' + floor)
            .attr('data-floor', floor)
            .append($('<div class="floor-label"></div>').text('Floor ' + floor));

        rooms.filter(room => room.floor === floor).forEach(function (room) {
            const $guests = $('<div class="guests"></div>');
            let list = room.guests;
            if (sorted[room.id]) {
                list = room.guests.slice().sort((a, b) => a.time.localeCompare(b.time));
            }
            list.forEach(guest => $guests.append(makeGuest(guest).attr('data-order', room.guests.indexOf(guest))));

            const $head = $('<div class="room-head"></div>').append(
                $('<h2></h2>').text(room.name),
                $('<button class="sort"></button>').text(sorted[room.id] ? 'Picture order' : 'Sort by time')
            );

            $floor.append(
                $('<section class="room"></section>')
                    .attr('id', room.id)
                    .attr('data-name', room.name)
                    .append($head, $guests)
            );
        });

        $house.append($floor);
    });
}

const cases = [
    { question: 'Who is in the hall?', find: () => $('#hall .guest') },
    { question: 'Who is dressed in yellow or purple?', find: () => $('.guest.yellow, .guest.purple') },
    { question: 'Which AITU students are upstairs?', find: () => $('#floor2 .aitu') },
    { question: 'Who has glasses or a bag?', find: () => $('.guest:has(.glasses), .guest:has(.bag)') },
    { question: 'Who came with nothing at all?', find: () => $('.guest:not(:has(.thing))') },
    { question: 'Who has a phone but no bag?', find: () => $('.guest:has(.phone):not(:has(.bag))') },
    {
        question: 'Who arrived between 20:30 and 21:00?',
        find: () => $('.guest').filter((i, el) => $(el).data('time') >= '20:30' && $(el).data('time') <= '21:00')
    },
    {
        question: 'Who arrived after 21:00 and is not an AITU student?',
        find: () => $('.guest:not(.aitu)').filter((i, el) => $(el).data('time') > '21:00')
    },
    { question: 'Who stands right next to Askar?', find: () => $('#askar').prev().add($('#askar').next()) },
    { question: 'Who stands last in each room?', find: () => $('.guest:last-child') },
    { question: 'Who stands third in each room?', find: () => $('.guest:nth-child(3)') },
    { question: 'Who stands after Timur in his room?', find: () => $('#timur').nextAll() },
    { question: 'Who stands right before someone in black?', find: () => $('.black').prev() },
    { question: 'In which room is Aruzhan?', find: () => $('#aruzhan').closest('.room') },
    {
        question: 'Which rooms have fewer than 6 guests?',
        find: () => $('.room').filter((i, el) => $(el).find('.guest').length < 6)
    },
    {
        question: 'In which rooms does somebody have a cup, but nobody wears glasses?',
        find: () => $('.room:has(.cup):not(:has(.glasses))')
    },
    {
        question: 'Who came first to each room?',
        find: () => $('.guest').filter((i, el) =>
            $(el).siblings().filter((j, other) => $(other).data('time') < $(el).data('time')).length === 0)
    },
    {
        question: 'Miras comes and stands between Askar and Inkar.',
        find: () => makeGuest({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] })
            .hide()
            .insertAfter('#askar')
            .fadeIn(800)
    },
    {
        question: 'Natasha says goodbye and goes home.',
        find: () => $('#natasha').fadeOut(800, function () {
            $(this).remove();
        })
    },
    {
        question: 'Who took the cake?',
        find: () => $('#floor1 .guest:has(.crumbs):not(:has(.cup))')
            .filter((i, el) => $(el).data('time') > '21:00' && $(el).data('time') < '21:30')
            .filter((i, el) => $(el).prev().add($(el).next()).is('.aitu'))
    }
];

function showCase(number) {
    buildParty();

    const $found = cases[number - 1].find();
    const names = $found.map((i, el) => $(el).data('name')).get();

    // Spotlight: found guests (or the guests of found rooms) stay bright, the rest go pale
    const $bright = $found.filter('.guest').add($found.filter('.room').find('.guest'));
    $('.guest').not($bright).children().fadeTo(300, 0.2);

    $found.addClass('found');
    $found.filter('.guest').animate({ top: -20 }, 200).animate({ top: 0 }, 200);

    $('#result').html('<b>Case ' + number + '. ' + cases[number - 1].question + '</b>')
        .append('Found ' + $found.length + ': ' + (names.join(', ') || 'nobody'));
}

function clearSpotlight() {
    $('.guest').children().stop(true).fadeTo(300, 1);
    $('.found').removeClass('found');
    $('#cases button').removeClass('active');
    $('#result').text('Choose a case.');
}

// Guest card
const words = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };
let openId = null;

function fillCard($guest) {
    const things = $guest.attr('data-things').split(' ').filter(t => t !== '').map(t => words[t]);
    let thingsText = 'Came with nothing';
    if (things.length === 1) {
        thingsText = 'Has ' + things[0];
    }
    if (things.length > 1) {
        thingsText = 'Has ' + things.slice(0, -1).join(', ') + ' and ' + things[things.length - 1];
    }

    const $room = $guest.closest('.room');
    const $list = $('<ul></ul>').append(
        $('<li></li>').text('Came at ' + $guest.data('time')),
        $('<li></li>').text($guest.hasClass('aitu') ? 'AITU student' : 'Not an AITU student'),
        $('<li></li>').text('Wears ' + $guest.data('color')),
        $('<li></li>').text(thingsText),
        $('<li></li>').text('Stands in the ' + $room.data('name').toLowerCase() + ', floor ' + $room.closest('.floor').data('floor'))
    );

    const $moves = $('<div class="moves"></div>');
    $('.room').not($room).each(function () {
        $moves.append(
            $('<button class="move"></button>')
                .attr('data-room', this.id)
                .text('Move to the ' + $(this).data('name').toLowerCase())
        );
    });

    $('#info .info-inner').empty().append(
        $('<img alt="">').attr('src', $guest.find('img').attr('src')),
        $('<h3></h3>').text($guest.data('name')),
        $list,
        $moves
    );
}

function openCard($guest) {
    const start = $guest.find('.avatar').offset();
    const width = Math.min(320, $(window).width() - 32);

    fillCard($guest);
    $('#info .info-inner').css('width', width);

    // measure the full card while it is invisible
    const $info = $('#info').stop(true).css({ display: 'block', visibility: 'hidden', width: width, height: 'auto' });
    const height = $info.outerHeight();
    const left = $(window).scrollLeft() + ($(window).width() - width) / 2;
    const top = $(window).scrollTop() + Math.max(16, ($(window).height() - height) / 2);

    $info.css({ visibility: 'visible', left: start.left, top: start.top, width: 64, height: 64, opacity: 0.3, borderRadius: 32 })
        .animate({ left: left, top: top, width: width, height: height, opacity: 1, borderRadius: 16 }, 400);

    openId = $guest.attr('id');
}

function closeCard(done) {
    if (!openId) {
        if (done) done();
        return;
    }

    const $avatar = $('#' + openId + ' .avatar');
    const end = $avatar.length ? $avatar.offset() : $('#info').offset();
    openId = null;

    $('#info').stop(true).animate({ left: end.left, top: end.top, width: 64, height: 64, opacity: 0, borderRadius: 32 }, 300, function () {
        $(this).hide();
        if (done) done();
    });
}

// Move a guest to the end of another room
function moveGuest(id, toId) {
    const $guest = $('#' + id);
    const fromId = $guest.closest('.room').attr('id');

    const fromRoom = rooms.find(room => room.id === fromId);
    const toRoom = rooms.find(room => room.id === toId);
    const index = fromRoom.guests.findIndex(guest => guest.name === $guest.data('name'));
    if (index !== -1) {
        toRoom.guests.push(fromRoom.guests.splice(index, 1)[0]);
    }
    sorted[toId] = false;
    $('#' + toId + ' .sort').text('Sort by time');

    const start = $guest.offset();
    const $clone = $guest.clone().removeAttr('id').addClass('flying')
        .css({ left: start.left, top: start.top })
        .appendTo('body');
    $clone.children().css('opacity', 1);

    const $space = $('<div class="space"></div>')
        .css('height', $guest.outerHeight())
        .appendTo('#' + toId + ' .guests');

    $guest.stop(true).addClass('leaving')
        .animate({ width: 0, paddingLeft: 0, paddingRight: 0, marginRight: -8 }, 600);

    $space.animate({ width: 92, marginRight: 0 }, 600, function () {
        const end = $space.offset();
        $clone.animate({ left: end.left, top: end.top }, 700, function () {
            $clone.remove();
            $space.replaceWith($guest.removeClass('leaving').removeAttr('style'));
        });
    });
}

// Sort a room by arrival time, or back to the picture order
function sortRoom(id) {
    const $room = $('#' + id);
    if ($room.find('.leaving, .space').length) return;

    sorted[id] = !sorted[id];
    $room.find('.sort').text(sorted[id] ? 'Picture order' : 'Sort by time');

    const $cards = $room.find('.guest');
    const order = $cards.get().sort(function (a, b) {
        if (sorted[id]) return $(a).data('time').localeCompare($(b).data('time'));
        return ($(a).data('order') ?? 99) - ($(b).data('order') ?? 99);
    });

    // remember where every card is now, move them in the DOM, then slide them from the old place
    $cards.stop(true);
    const before = $cards.map((i, el) => $(el).offset()).get();
    $cards.css({ left: 0, top: 0 });
    $room.find('.guests').append(order);

    $cards.each(function (i) {
        const now = $(this).offset();
        $(this).css({ left: before[i].left - now.left, top: before[i].top - now.top })
            .animate({ left: 0, top: 0 }, 600);
    });
}

$(function () {
    buildParty();

    $('#clear').on('click', clearSpotlight);

    $('#house').on('click', '.guest', function () {
        const $guest = $(this);
        if (openId === $guest.attr('id')) return;
        closeCard(() => openCard($guest));
    });

    $('#house').on('click', '.sort', function () {
        sortRoom($(this).closest('.room').attr('id'));
    });

    $('#info').on('click', '.move', function () {
        const id = openId;
        const toId = $(this).data('room');
        if (!id) return;
        closeCard();
        moveGuest(id, toId);
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#info, .guest').length) closeCard();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeCard();
    });

    cases.forEach(function (item, index) {
        const $button = $('<button></button>').text((index + 1) + '. ' + item.question);

        $button.on('click', function () {
            $('#cases button').removeClass('active');
            $(this).addClass('active');
            showCase(index + 1);
        });

        $('#cases').append($button);
    });
});
