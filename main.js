const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const mainColor = "#0095DD";
const mainFont = "16px Arial";
// 공의 위치
let x = canvas.width / 2;
let y = canvas.height - 30;
// 공의 움직임
let dx = 2;
let dy = -2;

const ballRadius = 10;

// paddle의 높이와 너비, x축 위에 시작 지점 정의
const paddleHeight = 10;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let lives = 3;

function keyDownHandler(e) {
  // 키보드 방향키 클릭 시 true 반환
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  // 키보드 방향키에서 손을 뗄 시 false 반환
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function drawPaddle() {
  // paddle 생성
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  // 공 생성
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.closePath();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// 벽돌에 대한 변수 설정
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
// 벽돌 사이의 간격
const brickPadding = 10;
// 캔버스 모서리와의 거리
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];

// 2차원 배열에 벽돌은 추가
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// 배열안의 모든 벽돌은 반복해서 화면에 출력
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = mainColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 벽돌 충돌 감지
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      // 벽돌 객체를 저장
      const b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            // 승리 메시지 표시
          }
        }
      }
    }
  }
}

let score = 0;

// 점수 화면
function drawScore() {
  ctx.font = mainFont;
  ctx.fillStyle = mainColor;
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = mainFont;
  ctx.fillStyle = mainColor;
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // 공이 벽에 닿으면 튕겨냄
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // 공이 paddle에 닿으면 튕겨냄
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      //공이 바닥에 닿으면 게임 오버
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // 키보드를 눌러서 paddle 조작
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 8;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 8;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
