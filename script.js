const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const overlay = document.getElementById("winOverlay");
const winText = document.getElementById("winText");

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let running = true;
let particles = [];

const winPatterns = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

// CLICK
cells.forEach(cell=>{
cell.addEventListener("click",()=>{
const i = cell.dataset.index;

if(board[i] || !running) return;

board[i] = currentPlayer;
cell.textContent = currentPlayer;
cell.classList.add(currentPlayer==="X"?"x":"o");

checkWinner();
});
});

// WIN CHECK
function checkWinner(){

let won = false;

for(let p of winPatterns){
const [a,b,c] = p;

if(board[a] && board[a]===board[b] && board[a]===board[c]){
won = true;
break;
}
}

if(won){
running = false;
showWin(currentPlayer);
return;
}

if(!board.includes("")){
statusText.textContent = "🤝 Draw!";
running = false;
return;
}

currentPlayer = currentPlayer==="X"?"O":"X";
statusText.textContent = `Player ${currentPlayer} Turn`;
}

// RESTART
restartBtn.addEventListener("click",resetGame);

function resetGame(){
board = ["","","","","","","","",""];
running = true;
currentPlayer = "X";
statusText.textContent = "Player X Turn";

cells.forEach(c=>{
c.textContent="";
c.classList.remove("x","o");
});
}

// THEMES
function setTheme(theme){
document.body.classList.remove("ninja","warrior","cyber");
document.body.classList.add(theme);
}

// WIN SCREEN
function showWin(player){
winText.textContent = `🏆 Player ${player} Wins!`;
overlay.classList.remove("hidden");
startConfetti();
setTimeout(stopConfetti,3000);
}

function closeWin(){
overlay.classList.add("hidden");
resetGame();
}

// CONFETTI
function startConfetti(){
particles = [];

for(let i=0;i<150;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height - canvas.height,
r:Math.random()*6+4,
color:`hsl(${Math.random()*360},100%,50%)`,
speed:2+Math.random()*3
});
}

animate();
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
ctx.fillStyle = p.color;
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fill();

p.y += p.speed;

if(p.y > canvas.height){
p.y = -10;
p.x = Math.random()*canvas.width;
}
});

requestAnimationFrame(animate);
}

function stopConfetti(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles = [];
}