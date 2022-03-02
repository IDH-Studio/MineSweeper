function getElement(type, element, parent=document) {
    if (type === 'id')
        return parent.getElementById(element);
    else if (type === 'class')
        return parent.getElementsByClassName(element);
    else if (type === 'name')
        return parent.getElementsByName(element);
    else if (type === 'tag')
        return parent.getElementsByTagName(element);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MineSweeper = {
    'NONE': 0,
    'MINE': 1,
}

// elements
const e_canvas = getElement('id', 'canvas');
const e_setting = getElement('id', 'setting');
const e_inputs = getElement('tag', 'input', setting);
const e_size = e_inputs[0];
const e_mineCount = e_inputs[1];

const ctx = canvas.getContext('2d');

var mineSize = 100;
var arrMines = [];
var mine_pos = [];
var boardColor = '#A0A0A0';
var isGameOver = false;

class Mine {
    constructor(row, col, hasMine=MineSweeper.NONE) {
        this.size = mineSize;
        this.strokeSize = mineSize / 10;
        this.x = col * this.size;
        this.y = row * this.size;
        this.index = row + col;
        this.hasMine = hasMine;
    }

    render(fillStyle=boardColor) {
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.size - 1, this.size - 1);
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        // console.log('render');
    }

    getHasMine() {
        return this.hasMine;
    }

    setMine() {
        this.hasMine = MineSweeper.MINE;
    }

    isClicked(mousePos) {
        if ((this.x < mousePos.x && mousePos.x < this.x + this.size)
            && (this.y < mousePos.y && mousePos.y < this.y + this.size)) {
                // console.log(this.index +' isClicked');
                return true;
            }
        else {
            return false;
        }
    }
}

function init() {
    const size = parseInt(e_size.value);
    canvas.width = size * 100;
    canvas.height = size * 100;

    isGameOver = false;

    setField(size);
    createMines(size);
    
    e_canvas.onclick = e => {
        const mousePos =  {
            'x': e.offsetX,
            'y': e.offsetY,
        };
        clickCheck(mousePos);
        // console.log('asd');
    }
}

function setField(size) {
    arrMines = [];
    for (let row = 0; row < size; ++row) {
        arrMines.push([]);
        for (let col = 0; col < size; ++col) {
            arrMines[row].push(new Mine(row, col));
        }
    }
    // console.log(arrMines);
}

function createMines(size) {
    const mine_count = parseInt(e_mineCount.value);
    mine_pos = [];
    for (let i = 0; i < mine_count; ++i) {
        let r1 = random(0, size - 1); // 지뢰의 랜덤 위치 설정
        let r2 = random(0, size - 1); // 지뢰의 랜덤 위치 설정
        let rList = [r1, r2];

        const isFind = mine_pos.find(element => {
            if (element[0] === r1 && element[1] === r2) {
                return;
            }
        }) // 해당 위치에 지뢰가 있는지 확인
        // 있다면 해당 리스트가, 없다면 undefined 반환

        if (isFind === undefined) { // 만약 해당 위치에 지뢰가 없다면
            mine_pos.push(rList); // 지뢰 위치 기억
            arrMines[r1][r2].setMine(); // 지뢰 설치
        }
    }
    // console.log(arrMines);
}

function clickCheck(mousePos) {
    const size = parseInt(e_size.value);
    // console.log(mousePos);
    for (let row = 0; row < size; ++row) {
        for (let col = 0; col < size; ++col) {
            if(arrMines[row][col].isClicked(mousePos)) {
                mine_pos.find(minePos => {
                    if ((minePos[0] == row && minePos[1] == col)
                    || (minePos[0] == col && minePos[1] == row)) {
                        isGameOver = true;
                    }
                })
                return;
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrMines.forEach(mines => {
        mines.forEach(mine => {
            mine.render();
        })
    })
}

function showAllMine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const size = parseInt(e_size.value);

    for (let row = 0; row < size; ++row) {
        for (let col = 0; col < size; ++col) {
            const hasMine = arrMines[row][col].hasMine;

            if (hasMine === MineSweeper.NONE) {
                arrMines[row][col].render();
            } else if (hasMine === MineSweeper.MINE) {
                arrMines[row][col].render('#A0A0A0');
            }
        }
    }

    // for (let i = 0; i < mine_pos.length; ++i) {
    //     const row = mine_pos[i][0];
    //     const col = mine_pos[i][1];
    //     arrMines[row][col].render('#A0A0A0');
    // }
}

function loop() {
    if (isGameOver) {
        // console.log('Game Over!');
        showAllMine();
        isGameOver = false;
        return;
    } else {
        console.log('Not Game Over!');
    }

    render();
    requestAnimationFrame(loop);
}

function start() {
    // alert('game start');
    init();
    loop();
}






for (let i = 0; i < e_inputs.length; i++) {
    const input = e_inputs[i];
    input.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            start();
        }
    });
}

window.onload = () => {
    e_inputs[0].focus();
}