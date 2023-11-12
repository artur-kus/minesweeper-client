import {sendAction} from './app.js';

export function initializeGame() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const app = new PIXI.Application({width, height, resolution: window.devicePixelRatio});

    //CENTER GAME POSITION
    app.view.style.position = 'absolute';
    app.view.style.bottom = '5%';
    app.view.style.left = '50%';
    app.view.style.transform = 'translateX(-50%)';

    // window.addEventListener('resize', () => {
    //     app.renderer.resize(window.innerWidth, window.innerHeight);
    // });

    document.body.appendChild(app.view);
    return app;
}

// Render Game Table
export function renderGameTable(app, tableData) {
    const cellWidth = (window.innerWidth * 0.8) / tableData[0].length;
    const cellHeight = (window.innerHeight * 0.8) / tableData.length;

    tableData.forEach(function (rowData, rowIndex) {
        rowData.forEach(function (cellData, colIndex) {
            const cell = new PIXI.Container();
            cell.addChild(createCellGraphic(cellWidth, cellHeight));
            cell.addChild(generateText(cellWidth, cellHeight, cellData));

            cell.interactive = true;
            cell.x = colIndex * cellWidth;
            cell.y = rowIndex * cellHeight;

            cell.on('rightdown', (event) => {
                sendAction(rowIndex, colIndex, 'FLAG');
            });

            cell.on('mousedown', (event) => {
                sendAction(rowIndex, colIndex, 'CLICK');
            });

            app.view.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });

            app.stage.addChild(cell);
        });
    });
}

export function updateMineCounter(remainingMines) {
    let mineCounter = document.getElementById('mine-counter');
    mineCounter.innerHTML = 'mines left: ' + remainingMines;
}

function createCellGraphic(cellWidth, cellHeight) {
    const cellGraphics = new PIXI.Graphics();
    cellGraphics.lineStyle(2, 0x00FF00, 1); // Zielona obwódka (0x00FF00)
    cellGraphics.beginFill(0x000000, 1); // Czarny kwadrat (0x000000)
    cellGraphics.drawRect(0, 0, cellWidth, cellHeight);
    return cellGraphics;
}

function generateText(cellWidth, cellHeight, text) {
    const cellText = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xFFFFFF, // Zielony tekst (0x00FF00)
    });
    cellText.position.set(cellWidth / 2, cellHeight / 2);
    cellText.anchor.set(0.5);
    return cellText;
}