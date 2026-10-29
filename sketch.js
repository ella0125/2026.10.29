const BACKGROUND_COLOR = "#3e5c76";

const IDLE_FRAME_COUNT = 17;
const WALK_FRAME_COUNT = 7;

const IDLE_FRAME_RATE = 8;
const WALK_FRAME_RATE = 10;

const CHARACTER_MAX_HEIGHT = 220;
const CHARACTER_MAX_WIDTH = 260;

let idleFrames = [];
let walkFrames = [];

let character;

let currentAnimation = "idle";
let currentFrame = 0;

let isMovingLeft = false;
let isMovingRight = false;

let facingDirection = 1;
let characterSpeed = 5;

function preload() {
  for (let i = 0; i < IDLE_FRAME_COUNT; i++) {
    idleFrames[i] = loadImage(
      `角色一/停/${i}.png`,
      () => {},
      () => console.warn(`無法載入圖片：角色一/停/${i}.png`)
    );
  }

  for (let i = 0; i < WALK_FRAME_COUNT; i++) {
    walkFrames[i] = loadImage(
      `角色一/走/${i}.png`,
      () => {},
      () => console.warn(`無法載入圖片：角色一/走/${i}.png`)
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(60);

  character = {
    x: width / 2,
    y: height / 2,
    width: 1,
    height: 1
  };

  updateCharacterSize();
}

function draw() {
  background(BACKGROUND_COLOR);

  updateMovement();
  updateAnimation();
  drawCharacter();
}

function updateMovement() {
  let isMoving = false;

  if (isMovingRight) {
    character.x += characterSpeed;
    facingDirection = 1;
    isMoving = true;
  }

  if (isMovingLeft) {
    character.x -= characterSpeed;
    facingDirection = -1;
    isMoving = true;
  }

  if (isMoving) {
    if (currentAnimation !== "walk") {
      currentAnimation = "walk";
      currentFrame = 0;
      updateCharacterSize();
    }
  } else {
    if (currentAnimation !== "idle") {
      currentAnimation = "idle";
      currentFrame = 0;
      updateCharacterSize();
    }
  }

  const halfWidth = character.width / 2;

  character.x = constrain(
    character.x,
    halfWidth,
    width - halfWidth
  );
}

function updateAnimation() {
  const frames =
    currentAnimation === "walk" ? walkFrames : idleFrames;

  const animationFrameRate =
    currentAnimation === "walk"
      ? WALK_FRAME_RATE
      : IDLE_FRAME_RATE;

  if (!frames || frames.length === 0) {
    return;
  }

  const frameInterval = Math.max(
    1,
    Math.round(60 / animationFrameRate)
  );

  if (frameCount % frameInterval === 0) {
    currentFrame++;

    if (currentFrame >= frames.length) {
      currentFrame = 0;
    }

    updateCharacterSize();
  }
}

function updateCharacterSize() {
  const frames =
    currentAnimation === "walk" ? walkFrames : idleFrames;

  const frame = frames[currentFrame];

  if (!frame || !frame.width || !frame.height) {
    return;
  }

  const imageRatio = frame.width / frame.height;

  let newHeight = CHARACTER_MAX_HEIGHT;
  let newWidth = newHeight * imageRatio;

  if (newWidth > CHARACTER_MAX_WIDTH) {
    newWidth = CHARACTER_MAX_WIDTH;
    newHeight = newWidth / imageRatio;
  }

  character.width = newWidth;
  character.height = newHeight;

  const halfWidth = character.width / 2;

  character.x = constrain(
    character.x,
    halfWidth,
    width - halfWidth
  );
}

function drawCharacter() {
  const frames =
    currentAnimation === "walk" ? walkFrames : idleFrames;

  const frame = frames[currentFrame];

  if (!frame) {
    drawLoadingPlaceholder();
    return;
  }

  push();

  translate(character.x, character.y);

  // 面向左方時水平翻轉圖片
  scale(facingDirection, 1);

  image(
    frame,
    0,
    0,
    character.width,
    character.height
  );

  pop();
}

function drawLoadingPlaceholder() {
  push();

  noStroke();
  fill(255, 255, 255, 80);
  ellipse(
    character.x,
    character.y,
    100,
    100
  );

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("載入中", character.x, character.y);

  pop();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    isMovingRight = true;
    currentAnimation = "walk";
    currentFrame = 0;
    facingDirection = 1;
    updateCharacterSize();
    return false;
  }

  if (keyCode === LEFT_ARROW) {
    isMovingLeft = true;
    currentAnimation = "walk";
    currentFrame = 0;
    facingDirection = -1;
    updateCharacterSize();
    return false;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    isMovingRight = false;
    return false;
  }

  if (keyCode === LEFT_ARROW) {
    isMovingLeft = false;
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (character) {
    character.y = height / 2;
    updateCharacterSize();
  }
}