const board = document.getElementById("board");
const secretRoom = document.getElementById("secret-room");
const roleDisplay = document.getElementById("role-display");

const secretPattern = ["1-2", "2-3", "3-4"];
let clickedPattern = [];

const roles = ["المنسق", "المساعد", "المتابع"];

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            square.classList.add("square");
            const isDark = (row + col) % 2 !== 0;
            square.classList.add(isDark ? "dark" : "light");
            square.dataset.position = `${row}-${col}`;
            if (isDark && row < 3) addPiece(square, "white");
            if (isDark && row > 4) addPiece(square, "green");
            square.addEventListener("click", handleClick);
            board.appendChild(square);
        }
    }
}

function addPiece(square, color) {
    const piece = document.createElement("div");
    piece.classList.add("piece", color);
    square.appendChild(piece);
}

function handleClick(e) {
    const pos = e.currentTarget.dataset.position;
    clickedPattern.push(pos);
    if (clickedPattern.join(",").includes(secretPattern.join(","))) {
        showSecretRoom();
        clickedPattern = [];
    }
}

function showSecretRoom() {
    secretRoom.classList.remove("hidden");
    roleDisplay.textContent = `وصفك: ${roles[Math.floor(Math.random() * roles.length)]}`;
    setTimeout(() => {
        document.querySelector(".message").textContent = "🚫 تم حذف الرسالة!";
    }, 5000);
}

// Self-destruct if power button (double screen tap) is triggered
let tapCount = 0;
document.body.addEventListener("click", () => {
    tapCount++;
    setTimeout(() => tapCount = 0, 1000);
    if (tapCount === 2) {
        board.innerHTML = "";
        secretRoom.innerHTML = "<h2>🔥 تم تدمير المحتوى!</h2>";
    }
});

drawBoard();