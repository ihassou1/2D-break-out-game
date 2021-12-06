//images
const LEVEL_IMG=new Image();
LEVEL_IMG.src="img/level.png";
const LIFE_IMG=new Image();
LIFE_IMG.src="img/life.png";
const SCORE_IMG=new Image();
SCORE_IMG.src="img/score.png";
//select canvas
const cvs=document.getElementById("breakout");
const ctx=cvs.getContext("2d");
//image
const BG_IMG=new Image();
BG_IMG.src="img/bg.jpg";
//border
cvs.style.border ="1px solid #0ff";
//variables
const PADDLE_WIDTH =100;
const PADDLE_MARGIN_BOTTOM=50;
const PADDLE_HEIGHT =20;
let LIFE=3;
let SCORE=0;
let LEVEL=1;
let GAME_OVER=false;
const BALL_RADIUS=8;
let leftArrow=false;
let rightArrow=false;


//create the paddle
const paddle ={
    x:cvs.width/2 -PADDLE_WIDTH/2 ,
    y: cvs.height - PADDLE_MARGIN_BOTTOM-PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx:5
}
// create ball
const ball ={
    x: cvs.width/2,
    y:paddle.y -BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random()*2 -1),
    dy: -3

}
//create bricks
let bricks=[];
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 30,
    marginTop: 20,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}
function createBricks(){
    for (let r=0;r<brick.row;r++){
        bricks[r]=[];
        for (let c=0;c<brick.column;c++){
            bricks[r][c]={
                x: c * (brick.offSetLeft +brick.width) +brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop +brick.marginTop,
                status: true
            }
        }
    }
}
createBricks();
function drawBricks(){
    for (let r=0;r<brick.row;r++){
        for (let c=0;c<brick.column;c++){
            let b=bricks[r][c];
            if (b.status){
                ctx.fillStyle=brick.fillColor;
                ctx.fillRect(b.x,b.y,brick.width,brick.height);
                ctx.strokeStyle=brick.strokeColor;
                ctx.strokeRect(b.x,b.y,brick.width,brick.height);
            }
        }
    }
}
//show ststus
function showGameStatus(text,textX,textY,img,imgX,imgY){
    ctx.fillStyle="#FFF";
    ctx.font="25px Germania One";
    ctx.fillText(text,textX,textY);
    ctx.drawImage(img,imgX,imgY,width=25,height=25);  

}
//event listeners{
document.addEventListener("keydown",(e)=>{
     if (e.keyCode==37){
         leftArrow=true;
     }
     else if (e.keyCode==39){
         rightArrow=true;
     }
});
document.addEventListener("keyup",(e)=>{
    if (e.keyCode==37){
        leftArrow=false;
    }
    else if (e.keyCode==39){
        rightArrow=false;
    }
});
//move paddle
function movePaddle(){
    if (leftArrow && paddle.x >0){
        paddle.x-=10;
    }
    else if (rightArrow && paddle.x +paddle.width<cvs.width){
        paddle.x+=10;
    }
}
//collsions
function ballWallCollision(){
    if (ball.x + ball.radius>cvs.width || ball.x -ball.radius <0 ){
        ball.dx= - ball.dx;
    }
    if (ball.y - ball.radius < 0){
        ball.dy= -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height){
        LIFE--;
        resetBall();
    }
}
function ballPaddleCollision(){
    if (ball.x<paddle.x+paddle.width && ball.x>paddle.x && ball.y>paddle.y && paddle.y<paddle.y+paddle.height){
        let collidePoint=ball.x - (paddle.x+ paddle.width/2);
        collidePoint=collidePoint/ (paddle.width/2);
        let angle=collidePoint* Math.PI/3;
        ball.dx=ball.speed * Math.sin(angle);
        ball.dy=- ball.speed * Math.cos(angle);
    }
}
function ballBrickCollision(){
    for (let r=0;r<brick.row;r++){
        for (let c=0;c<brick.column;c++){
            let b=bricks[r][c];
            if (b.status){
                if (ball.x+ball.radius>b.x && ball.x-ball.radius< b.x+brick.width
                     &&ball.y+ball.radius >b.y && ball.y-ball.radius< b.y+brick.height){
                         ball.dy=-ball.dy;
                         b.status=false;
                         SCORE+=10;
                     }
            }
        }
    }
}
//game over
function gameOver(){
    if (LIFE<=0){
       showYouLose();
       GAME_OVER=true;
    }
}
// LEVEL UP
function levelUp(){
    let isLevelDone=true;
    for (let r=0;r<brick.row;r++){
        for (let c=0;c<brick.column;c++){
            isLevelDone=isLevelDone && (!bricks[r][c].status)
        }
    }    
    if (isLevelDone){
        if (LEVEL>=3) {
            showYouWin();
            GAME_OVER=true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed+=0.5;
        resetBall();
        LEVEL++;
    }
}
//reset ball
function resetBall(){
    ball.x= cvs.width/2,
    ball.y=paddle.y -BALL_RADIUS,
    ball.dx= 3 * (Math.random()*2 -1),
    ball.dy= -3;
}
//move ball
function moveBall(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;
}
//draw
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    showGameStatus(SCORE,35,25,SCORE_IMG,5,5);
    showGameStatus(LIFE,cvs.width-25,25,LIFE_IMG,cvs.width-55,5);
    showGameStatus(LEVEL,cvs.width/2,25,LEVEL_IMG,cvs.width/2-33,5);


}
//update function
function update(){
     movePaddle();
     moveBall();
     ballWallCollision();
     ballPaddleCollision();
     ballBrickCollision();
     gameOver();
     levelUp();
}
//DRAW BALL
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
    ctx.fillStyle="#ffcd05";
    ctx.fill();
    ctx.strokeStyle="#2e3548";
    ctx.stroke();
    ctx.closePath();
}
//draw paddle
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);

}
function loop(){
    ctx.drawImage(BG_IMG,0,0);
    draw();
    update();
    if (! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
