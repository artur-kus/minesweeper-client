import {sendAction} from './app.js';

let container = new PIXI.Container();

export function initializeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const app = new PIXI.Application({width,
    height,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x202421,
    antialias: true});

    //CENTER GAME POSITION
    app.view.style.position = 'absolute';
    app.view.style.bottom = '5%';
    app.view.style.left = '50%';
    app.view.style.transform = 'translateX(-50%)';

    app.view.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    // window.addEventListener('resize', () => {
    //     app.renderer.resize(window.innerWidth, window.innerHeight);
    // });

    document.body.appendChild(app.view);
    return app;
}

// Render Game Table
export function renderGameTable(app, tableData) {
    while (container.children.length) {
        const child = container.children[0]; // Get the first child
        container.removeChild(child);
        child.destroy();
    }
    container.destroy();
    container = new PIXI.Container();
    const cellWidth = (window.innerWidth * 0.8) / tableData[0].length;
    const cellHeight = (window.innerHeight * 0.8) / tableData.length;

    tableData.forEach(function (rowData, rowIndex) {
        rowData.forEach(function (cellData, colIndex) {
            let padding = 10;
            let cellX = 20 + colIndex * cellWidth + padding * colIndex;
            let cellY = 20 + rowIndex * cellHeight + padding * rowIndex;
            let cell = createCellGraphic(cellX, cellY, cellWidth, cellHeight, cellData);
            cell.interactive = true;

            cell.on('rightdown', (event) => {
                sendAction(rowIndex, colIndex, 'FLAG');
            });

            cell.on('mousedown', (event) => {
                sendAction(rowIndex, colIndex, 'CLICK');
            });

            container.addChild(cell);
            
            let textX = cellX + cellWidth/2;
            let textY = cellY + cellHeight/2;
            let text = generateText(textX,textY, cellWidth, cellHeight, cellData);


            container.addChild(text);
        });
    });
    app.stage.addChild(container)
}

export function updateMineCounter(remainingMines) {
    let mineCounter = document.getElementById('mine-counter');
    mineCounter.innerHTML = 'mines left: ' + remainingMines;
}

function createCellGraphic(x,y,cellWidth, cellHeight, cellData) {
    let cellGraphics = new PIXI.Graphics();
    
    if(cellData === ''){
        cellGraphics.beginFill(0x11677B, 1);
    } else {
        cellGraphics.beginFill(0x61677A, 1);
    }

    cellGraphics.drawRoundedRect(x, y, cellWidth, cellHeight, 10);
    return cellGraphics;
}

function generateText(x,y,cellWidth, cellHeight, text) {
    const cellText = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 40 * 0.8,
        fill: 0xFFFFFF, // Zielony tekst (0x00FF00)
    });
    cellText.position.set(x,y);
    cellText.anchor.set(0.5);
    return cellText;
}