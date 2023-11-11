const stompClient = new StompJs.Client({
    brokerURL: 'ws://127.0.0.1:8080/gs-guide-websocket',
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (greeting) => {
        showGreeting(JSON.parse(greeting.body));
    });
};

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
    if (connected) {
        $("#conversation").show();
    }
    else {
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

function sendAction(row, col, action) {
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({'row': row, 'col': col, 'action': action})
    });
}

function showGreeting(message) {
    createTable(message)
}

function gameButtonClicked(){
    console.log("game button clicked");
}

function createTable(tableData) {
  var table = document.getElementById('game-table');
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData, rowIndex) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData, colIndex) {
      var cell = document.createElement('td');

      // create button
      let b1 = document.createElement('button')
      // set button text
      b1.innerHTML = cellData.content;
      // set id - it's what will be sent to backend
      b1.title = 'row: ' + rowIndex + ' col: ' + colIndex;
      b1.className = 'game-button';
      // ignore right-click on game button
      b1.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      });
      // when button is clicked - send data about row, col and action based on which mouse button was clicked
      b1.addEventListener("mouseup", function(event) {
                                var actionToSend;
                                if (event.button === 0) {
                                    actionToSend = 'CLICK';
                                } else if (event.button === 2) {
                                    actionToSend = 'FLAG';
                                }
                                 console.log(this.id, b1);
                                 sendAction(rowIndex, colIndex, actionToSend)
                             });

      cell.appendChild(b1);
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.replaceChildren();
  table.appendChild(tableBody);
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendAction());
});