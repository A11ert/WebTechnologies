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

function buildParty() {
    const $house = $('#house').empty();

    [2, 1].forEach(function (floor) {
        const $floor = $('<div class="floor"></div>')
            .attr('id', 'floor' + floor)
            .attr('data-floor', floor)
            .append($('<div class="floor-label"></div>').text('Floor ' + floor));

        rooms.filter(room => room.floor === floor).forEach(function (room) {
            const $guests = $('<div class="guests"></div>');
            room.guests.forEach(guest => $guests.append(makeGuest(guest)));

            $floor.append(
                $('<section class="room"></section>')
                    .attr('id', room.id)
                    .attr('data-name', room.name)
                    .append($('<h2></h2>').text(room.name), $guests)
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

    $found.addClass('found');
    $found.filter('.guest').animate({ top: -20 }, 200).animate({ top: 0 }, 200);

    $('#result').html('<b>Case ' + number + '. ' + cases[number - 1].question + '</b>')
        .append('Found ' + $found.length + ': ' + (names.join(', ') || 'nobody'));
}

$(function () {
    buildParty();

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
