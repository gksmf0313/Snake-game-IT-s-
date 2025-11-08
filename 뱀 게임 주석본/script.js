// 캔버스 요소를 가져옵니다. 게임이 그려질 공간입니다.
const canvas = document.getElementById('gameCanvas');
// 2D 렌더링 컨텍스트를 가져옵니다. 캔버스에 그림을 그리는 데 사용됩니다.
const ctx = canvas.getContext('2d');
// 점수를 표시할 요소를 가져옵니다.
const scoreDisplay = document.getElementById('score');
// 게임 재시작 버튼 요소를 가져옵니다.
const restartButton = document.getElementById('restartButton');

// 게임 보드의 한 칸(그리드)의 크기를 정의합니다. (픽셀 단위)
const gridSize = 20;
// 캔버스의 가로/세로 칸 수를 계산합니다. (캔버스 크기 / 그리드 크기)
const tileCount = canvas.width / gridSize;

// 뱀의 몸통을 나타내는 배열입니다. 각 요소는 {x, y} 좌표를 가집니다.
let snake = [
    {x: 10 * gridSize, y: 10 * gridSize} // 뱀의 시작 위치 (중앙 근처)
];
// 먹이의 위치를 나타내는 객체입니다.
let food = {};
// 뱀의 현재 이동 방향입니다. (x, y) 변화량으로 표현됩니다.
// 오른쪽: {x: gridSize, y: 0}, 왼쪽: {x: -gridSize, y: 0}
// 아래: {x: 0, y: gridSize}, 위: {x: 0, y: -gridSize}
let dx = gridSize; // 초기 방향은 오른쪽
let dy = 0;

// 현재 점수입니다.
let score = 0;
// 게임이 끝났는지 여부를 나타냅니다.
let gameOver = false;
// 게임 루프를 제어하는 변수입니다. (setInterval ID)
let gameInterval;
// 뱀의 속도(밀리초)입니다. 이 값이 작을수록 뱀이 빠르게 움직입니다.
let gameSpeed = 150;

// ===========================================
// 초기화 함수: 게임을 처음 시작하거나 재시작할 때 호출됩니다.
// ===========================================
function initGame() {
    // 이전 게임 루프가 있다면 정지시킵니다.
    clearInterval(gameInterval);

    // 뱀의 초기 상태를 설정합니다.
    snake = [
        {x: 10 * gridSize, y: 10 * gridSize}
    ];
    // 뱀의 초기 방향을 오른쪽으로 설정합니다.
    dx = gridSize;
    dy = 0;
    // 점수를 0으로 초기화합니다.
    score = 0;
    scoreDisplay.textContent = score; // 화면에 점수 업데이트
    // 게임 종료 상태를 false로 설정합니다.
    gameOver = false;
    // 재시작 버튼을 숨깁니다.
    restartButton.style.display = 'none';

    // 먹이를 새로 생성합니다.
    generateFood();
    // 게임 루프를 시작합니다. (gameSpeed 마다 update와 draw 함수를 반복 실행)
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// ===========================================
// 게임 루프 함수: 일정 시간마다 게임 상태를 업데이트하고 화면을 그립니다.
// ===========================================
function gameLoop() {
    if (gameOver) return; // 게임 오버 상태면 더 이상 진행하지 않습니다.

    update(); // 게임 상태 (뱀 위치, 충돌 등)를 업데이트합니다.
    draw();   // 업데이트된 게임 상태를 화면에 그립니다.
}

// ===========================================
// 그리기 함수: 캔버스에 모든 게임 요소를 그립니다.
// ===========================================
function draw() {
    // 캔버스를 깨끗하게 지웁니다. (이전 프레임 지우기)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 뱀을 그립니다.
    drawSnake();
    // 먹이를 그립니다.
    drawFood();
    // 점수를 그립니다. (이미 HTML 요소에 있으므로 여기서는 그리지 않고 업데이트만)
}

// ===========================================
// 뱀 그리기 함수: 뱀의 각 세그먼트를 캔버스에 그립니다.
// ===========================================
function drawSnake() {
    snake.forEach((segment, index) => {
        // 뱀 머리는 다른 색깔로 그립니다.
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60'; // 머리는 밝은 초록, 몸통은 진한 초록
        ctx.strokeStyle = '#2c3e50'; // 테두리 색깔

        // 사각형을 그립니다. (x, y, width, height)
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        // 사각형의 테두리를 그립니다.
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// ===========================================
// 먹이 그리기 함수: 먹이를 캔버스에 그립니다.
// ===========================================
function drawFood() {
    ctx.fillStyle = '#e74c3c'; // 먹이는 빨간색
    ctx.strokeStyle = '#c0392b'; // 테두리 색깔
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

// ===========================================
// 게임 상태 업데이트 함수: 뱀의 이동, 충돌 감지, 먹이 획득 등을 처리합니다.
// ===========================================
function update() {
    // 뱀의 새 머리 위치를 계산합니다.
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // 뱀 머리를 배열의 맨 앞에 추가합니다.
    snake.unshift(head);

    // 뱀이 먹이를 먹었는지 확인합니다.
    if (head.x === food.x && head.y === food.y) {
        score += 10; // 점수 증가
        scoreDisplay.textContent = score; // 화면 점수 업데이트
        generateFood(); // 새 먹이를 생성합니다.
        // 뱀이 길어졌으므로 꼬리를 자르지 않습니다.
    } else {
        // 먹이를 먹지 않았다면, 뱀이 이동했으므로 꼬리(마지막 세그먼트)를 제거합니다.
        snake.pop();
    }

    // 충돌 감지: 벽 또는 자기 몸통에 부딪혔는지 확인합니다.
    if (checkCollision(head)) {
        gameOver = true; // 게임 오버 상태로 전환합니다.
        clearInterval(gameInterval); // 게임 루프를 정지합니다.
        restartButton.style.display = 'block'; // 재시작 버튼을 보여줍니다.
        alert('게임 오버! 점수: ' + score); // 게임 오버 메시지 표시
    }
}

// ===========================================
// 충돌 감지 함수: 뱀의 머리가 벽이나 자기 몸통에 부딪혔는지 확인합니다.
// ===========================================
function checkCollision(head) {
    // 1. 벽 충돌 검사
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= canvas.width;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= canvas.height;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true; // 벽에 부딪혔습니다.
    }

    // 2. 자기 몸통 충돌 검사 (머리 제외)
    // 뱀의 몸통 부분을 순회하며 머리와 겹치는지 확인합니다.
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // 자기 몸통에 부딪혔습니다.
        }
    }

    return false; // 충돌이 없습니다.
}

// ===========================================
// 먹이 생성 함수: 캔버스 내에서 무작위 위치에 먹이를 생성합니다.
// 뱀의 몸통과 겹치지 않는 위치에 생성해야 합니다.
// ===========================================
function generateFood() {
    let newFoodX, newFoodY;
    let collisionWithSnake;

    do {
        // 캔버스 내의 무작위 그리드 좌표를 생성합니다.
        newFoodX = Math.floor(Math.random() * tileCount) * gridSize;
        newFoodY = Math.floor(Math.random() * tileCount) * gridSize;

        collisionWithSnake = false;
        // 생성된 먹이 위치가 뱀의 몸통과 겹치는지 확인합니다.
        for (let i = 0; i < snake.length; i++) {
            if (newFoodX === snake[i].x && newFoodY === snake[i].y) {
                collisionWithSnake = true; // 겹치면 다시 생성해야 합니다.
                break;
            }
        }
    } while (collisionWithSnake); // 뱀과 겹치지 않는 위치를 찾을 때까지 반복합니다.

    food = {x: newFoodX, y: newFoodY}; // 먹이 위치를 설정합니다.
}

// ===========================================
// 키보드 입력 핸들러: 방향키 입력을 받아 뱀의 방향을 변경합니다.
// =뱀이 즉시 반대 방향으로 회전하는 것을 방지합니다 (예: 오른쪽으로 가다가 바로 왼쪽으로 가는 경우)
// ===========================================
document.addEventListener('keydown', (event) => {
    // 현재 dx, dy 값과 새로운 방향을 비교하여 바로 역방향으로 전환하는 것을 막습니다.
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    // 눌린 키에 따라 방향을 설정합니다.
    if (event.key === 'ArrowUp' && !goingDown) {
        dx = 0;
        dy = -gridSize;
    } else if (event.key === 'ArrowDown' && !goingUp) {
        dx = 0;
        dy = gridSize;
    } else if (event.key === 'ArrowLeft' && !goingRight) {
        dx = -gridSize;
        dy = 0;
    } else if (event.key === 'ArrowRight' && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
});

// 재시작 버튼 클릭 이벤트 리스너
restartButton.addEventListener('click', initGame);

// 게임 시작!
initGame();