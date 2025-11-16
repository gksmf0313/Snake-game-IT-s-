/**
 * 🐍 뱀 게임 프로젝트 (소프트웨어융합과 1학년)
 *
 * 📆 2주차 개발 (2025.11.XX)
 * 🧑‍💻 A (장지원): 뱀 조작 및 생존 (키보드 입력, 자기 몸 충돌)
 * 🧑‍💻 B (전하늘): 게임 환경 및 규칙 (게임 루프, 먹이/벽 충돌, 점수)
 *
// ==================================================
// 📜 1. 전역 변수 및 상수 (Global Variables & Constants)
// ==================================================

// 1.1 공통 설정(DOM 요소) (A, B 모두 사용)
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas'); // 캔버스 요소
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d'); // 캔버스 2D 컨텍스트 (펜)
/** @type {number} */
const gridSize = 50; // 게임 보드 한 칸(셀)의 크기 (px) => figma 크기에 맞춰서 50px로 조절

const foodImg = new Image();
foodImg.src = "apple.png";

// 화면
const startScreenEl = document.getElementById('startScreen'); // 시작 화면 요소
const gameScreenEl = document.getElementById('gameScreen'); // 게임 화면 요소
const gameOverScreenEl = document.getElementById('gameOverScreen'); // 게임 오버 화면 요소

// 버튼
const startButtonEl = document.getElementById('startButton'); // 게임 시작 버튼 요소
const restartButtonEl = document.getElementById('restartButton'); // 게임 재시작 버튼 요소
const exitButtonEl = document.getElementById('exitButton'); // 게임 종료 버튼 요소

// 점수
const playScoreEl = document.getElementById('playScore'); // 게임 중 점수 
const gameOverScoreEl = document.getElementById('gameOverScore'); // 게임 오버 점수

const helpButtonEl = document.getElementById('helpButton'); // 설명 버튼
const helpScreenEl = document.getElementById('helpScreen'); // 설명 화면 창창
const closeScreenButtonEl = document.getElementById('closeScreenButton'); // 설명 닫기 버튼
const backgroundScreenEl = document.querySelector('.backgroundScreen'); // 설명 화면 뒷 배경

// --- 1.2 게임 상태 (B: Environment 담당) ---
/** @type {object} - 예: {x: 10 * gridSize, y: 10 * gridSize} */
let food = {}; // 먹이 객체 (x, y 좌표)
/** @type {number} */
let score = 0; // 현재 점수
/** @type {number} */
const gameSpeed = 150; // 게임 속도 (ms)
/** @type {number} */
let gameInterval; // setInterval ID (게임 루프 제어용)

// --- 1.3 플레이어 상태 (A: Player 담당) ---
/** @type {array} - 예: [{x: 10*gridSize, y: 10*gridSize}] */
let snake = [
    {x : 12 * gridSize, y: 12 * gridSize}
]; // 뱀 몸통 좌표 배열 (0번 인덱스가 머리)
/** @type {number} */
let dx = gridSize; // 뱀의 수평(x) 이동 방향 (20, -20, 0)
/** @type {number} */
let dy = 0; // 뱀의 수직(y) 이동 방향 (20, -20, 0)

// --- 1.4 공통 상태 (A, B 모두 사용) ---
/** @type {boolean} */
let isGameOver = false; // 게임 오버 여부

// ==================================================
// 🕹️ 2. 핵심 함수 (Core Functions)
// ==================================================

// --- 2.1 (B) 환경/규칙 함수 (Environment Functions) ---
/**
 * 게임을 초기화하고 시작합니다. (B 담당)
 * (게임 루프 시작, 뱀/먹이/점수 초기화)
 */
function initGame() {
    // ... B가 구현 ...
    // 게임 초기화
    snake = [{x: 12 * gridSize, y: 12 * gridSize}] //뱀 위치 초기화
    dx = gridSize; //뱀 방향 초기화
    dy = 0;
    score = 0; //점수 초기화
    isGameOver = false; // 게임 결과 초기화

    playScoreEl.textContent = score; // 점수판 UI 업데이트

    // 화면 전환
    startScreenEl.classList.add('hidden');
    gameOverScreenEl.classList.add('hidden'); // 재시작
    gameScreenEl.classList.remove('hidden');

    // 실행 중인 게임 루프가 있다면 정지
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // 첫 먹이 생성
    generateFood(); 
    
    // 게임 루프를 gameSpeed마다 반복 실행
    gameInterval = setInterval(gameLoop, gameSpeed);
}

//게임 오버 처리
function handleGameOver(){
    //게임 루프 정지
    clearInterval(gameInterval);

    //게임 오버하면 점수판 업데이트
    gameOverScoreEl.textContent = score;
    
    //화면 전환
    gameScreenEl.classList.add('hidden');
    gameOverScreenEl.classList.remove('hidden');
}

/**
 * 게임의 메인 루프입니다. (B 담당)
 * (게임 상태 업데이트 및 그리기 반복)
 */
function gameLoop() {
    // ... B가 구현 ...
    //게임 오버 상태 확인
    if(isGameOver){
        handleGameOver();
        return;
    }

    //먹이 그리기
    drawFood();

    //뱀 그리기
    drawSnake();
    
    //뱀 이동
    moveSnake();

    //충돌 확인
    if(checkWallCollision() || checkSelfCollision()){
        isGameOver = true; //충돌하면 게임 오버
    }

    //점수 추가
    if(checkFoodCollision()){
        score += 10;
        playScoreEl.textContent = score; //점수 UI
        generateFood(); //새 먹이 생성
    }
    else{
        snake.pop(); //먹이 안 먹으면 마지막 꼬리 칸 제거
    }
    
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

/**
 * 먹이를 캔버스에 그립니다. (B 담당)
 */
function drawFood() {
    // ... B가 구현 ...
    ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);
}

/**
 * 뱀과 겹치지 않는 새 먹이를 생성합니다. (B 담당)
 */
function generateFood() {
    // ... B가 구현 ...
    //랜덤 위치에 먹이 생성(뱀이랑 겹치지 않게)
    let foodX, foodY, isFoodonSnake;

    //그리드 좌표 생성
    const maxX = canvas.width / gridSize;
    const maxY = canvas.height / gridSize;

    do {
        // 0 ~ (maxX-1) 사이의 정수 * 20 (gridSize)
        foodX = Math.floor(Math.random() * maxX) * gridSize;
        foodY = Math.floor(Math.random() * maxY) * gridSize;

        // 뱀의 좌표와 새 먹이 좌표가 겹치는지 확인
        isFoodOnSnake = snake.some(
            (segment) => segment.x === foodX && segment.y === foodY
        );
    } 
    while(isFoodOnSnake); // 겹쳤으면(true) 새 좌표 다시 뽑기
    food = { x: foodX, y: foodY };
}

/**
 * 뱀의 머리가 벽에 충돌했는지 확인합니다. (B 담당)
 * @returns {boolean} 충돌했다면 true
 */
function checkWallCollision() {
    // ... B가 구현 ...
    const head = snake[0]; //뱀 머리

    //뱀 머리가 벽에 충돌하는지 확인
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= canvas.width;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= canvas.height;
    
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/**
 * 뱀의 머리가 먹이에 충돌했는지 확인합니다. (B 담당)
 * @returns {boolean} 충돌했다면 true
 */
function checkFoodCollision() {
    // ... B가 구현 ...
    const head = snake[0]; //뱀 머리
    return head.x === food.x && head.y === food.y;
}

// --- 2.2 (A) 플레이어 함수 (Player Functions) ---

/**
 * 뱀(snake 배열)을 캔버스에 그립니다. (A 담당)
 */

// segment: 현재 순서의 "몸통 칸" 정보가 들어가는 변수
// index: 그 칸이 몇 번째 칸인지 알려주는 숫자(0부터 시작)
 

// 뱀 움직임 구현
function moveSnake(){
    const head = {
        // 새 머리의 좌표 계산
        x : snake[0].x + dx,
        y : snake[0].y + dy
    };

    // 뱀 몸통 배열의 앞에 새 머리 추가
    snake.unshift(head);

    //꼬리 제거 (원래 길이로 유지)
    // snake.pop();
}

function drawSnake() {
    snake.forEach((segment, index) => {
    if(index === 0) {
        ctx.fillStyle = '#5c4364ff'; // 뱀 머리 색상
    } else {
        ctx.fillStyle = '#a372b1ff'; // 뱀 몸통 색상
    }
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);

    ctx.strokeStyle = '#322637ff'; // 뱀 테두리 색상
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
});
}

/**
 * 뱀의 머리가 자기 몸통에 충돌했는지 확인합니다. (A 담당)
 * @returns {boolean} 충돌했다면 true
 */
function checkSelfCollision() {
   const head = snake[0]; // 뱀 머리 좌표

   // 뱀 몸통(머리 제외)과 머리 좌표 비교
   for (let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y){
            return true;
        }
   }

   // 충돌 없음
    return false;
}

/**
 * 키보드 입력('keydown')을 처리합니다. (A 담당)
 * (dx, dy 값만 변경)
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
    // 현재 이동 방향 확인
    const goingUP = (dy === -gridSize);  
    const goingDown = (dy === gridSize);
    const goingLeft = (dx === -gridSize);
    const goingRight = (dx === gridSize);

    // 방향키 또는 WASD 키 입력에 따라 방향 변경
    // (단, 반대 방향인 경우는 무시)

    if((event.key === 'ArrowUp' || event.key === 'w') && !goingDown){
        dx = 0;
        dy = -gridSize;
    }
    else if((event.key === 'ArrowDown' || event.key === 's') && !goingUP){
        dx = 0;
        dy = gridSize;
    }
    else if((event.key === 'ArrowLeft' || event.key === 'a') && !goingRight){
        dx = -gridSize;
        dy = 0;
    }
    else if((event.key === 'ArrowRight' || event.key === 'd') && !goingLeft){
        dx = gridSize;
        dy = 0;
    }
}

// ==================================================
// 🚀 3. 게임 실행 (Game Execution)
// ==================================================

// 키보드 이벤트 리스너 연결 (A 담당)
document.addEventListener('keydown', handleKeyDown);

// 게임 시작! (B 담당)
startButtonEl.addEventListener('click', initGame);

// 다시 시작
restartButtonEl.addEventListener('click', initGame);

// 나가기 누르면 시작화면으로 이동
exitButtonEl.addEventListener('click', () => {
    gameScreenEl.classList.add('hidden');
    gameOverScreenEl.classList.add('hidden');
    startScreenEl.classList.remove('hidden');
});

// 설명 화면 보기
helpButtonEl.addEventListener('click', () => {
    helpScreenEl.classList.remove('hidden'); 
});

// 설명 화면 닫기
closeScreenButtonEl.addEventListener('click', () => {
    helpScreenEl.classList.add('hidden'); 
});