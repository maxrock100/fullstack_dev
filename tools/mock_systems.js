// outputs ZMQ messages once per second
const TIMESTAMP_OFFSET_MS = 0;

import ZmqProducer from './lib/zmqProducer';

const socketA = new ZmqProducer(20001).on('connect', address =>
    console.debug('System A - ZMQ producer running ' + address),
);
const socketB = new ZmqProducer(20002).on('connect', address =>
    console.debug('system B - ZMQ producer running ' + address),
);

const sendMessage = (topicName, socket, timestamp, room, data) => {
    socket.send(topicName, timestamp, room, data);
};

setInterval(() => {
    const room = {
        label: 'Room 1',
        ward: 'Oakley Ward',
    };

    const timestamp = Date.now();

    const aData = {
        hr: randomIntBetween(6, 40),
        br: randomIntBetween(40, 160),
        location: 'InBed',
    };

    const bData = {
        movement: randomIntBetween(0, 10),
    };

    sendMessage('System A', socketA, timestamp, room, aData);
    setTimeout(() => sendMessage('System B', socketB, timestamp, room, bData), randomIntBetween(0, 1500));
}, 1000);

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
