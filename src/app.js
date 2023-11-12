import {initializeGame, renderGameTable, updateMineCounter} from './minesweeper.js';

const stompClient = new StompJs.Client({
    brokerURL: 'ws://127.0.0.1:8080/gs-guide-websocket',
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    const board = initializeGame();
    stompClient.subscribe('/topic/greetings', (update) => {
        handleUpdate(board, JSON.parse(update.body));
    });
};

function handleUpdate(board, update) {
    updateMineCounter(update.remainingMines)
    renderGameTable(board, update.board)
}

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#send").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

export function sendAction(row, col, action) {
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({'row': row, 'col': col, 'action': action})
    });
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendAction());
});