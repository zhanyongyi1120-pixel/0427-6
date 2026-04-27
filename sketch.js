let video;
let handPose;
let hands = [];

function preload() {
  // 初始化模型
  handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 建立攝影機
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480); // 給予明確的初始解析度
  video.hide();

  // 開始偵測
  handPose.detectStart(video, gotHands);
}

function draw() {
  background('#e7c6ff');

  // 計算 50% 畫面大小與置中位置
  let displayW = windowWidth * 0.5;
  let displayH = (displayW / video.width) * video.height; // 按比例計算高度，畫面才不會變形
  
  let xOffset = (windowWidth - displayW) / 2;
  let yOffset = (windowHeight - displayH) / 2;

  // 繪製影像
  image(video, xOffset, yOffset, displayW, displayH);

  // 檢查是否有手，且 video 已經準備好
  if (video.width > 0 && hands && hands.length > 0) {
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      
      // 遍歷關鍵點
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];

        // 判斷左右手顏色
        if (hand.handedness === "Left" || hand.label === "Left") {
          fill(255, 0, 255);
        } else {
          fill(255, 255, 0);
        }

        noStroke();
        
        // 精準映射座標
        let drawX = map(keypoint.x, 0, video.width, xOffset, xOffset + displayW);
        let drawY = map(keypoint.y, 0, video.height, yOffset, yOffset + displayH);
        
        circle(drawX, drawY, 12);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}