const board = document.getElementById("board");
const secretRoom = document.getElementById("secret-room");
const roleDisplay = document.getElementById("role-display");

let moveHistory = [];
let selectedPiece = null;
let moveCount = 0;
let pieceMoveMap = {};

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
            square.addEventListener("click", () => handleClick(square));
            board.appendChild(square);
        }
    }
}

function addPiece(square, color) {
    const piece = document.createElement("div");
    piece.classList.add("piece", color);
    square.appendChild(piece);
}

function handleClick(square) {
    const piece = square.querySelector(".piece");
    const pos = square.dataset.position;

    if (piece && piece.classList.contains("green")) {
        selectedPiece = square;
    } else if (selectedPiece && !piece) {
        const from = selectedPiece.dataset.position;
        const to = square.dataset.position;
        square.appendChild(selectedPiece.querySelector(".piece"));
        selectedPiece = null;

        moveHistory.push({ from, to });
        updateMoveTracking(from);
        moveCount++;

        checkPatterns();
    }
}

function updateMoveTracking(from) {
    if (!pieceMoveMap[from]) pieceMoveMap[from] = 0;
    pieceMoveMap[from]++;
}

function checkPatterns() {
    const pieceKeys = Object.keys(pieceMoveMap);
    const moves = Object.values(pieceMoveMap);

    // المشرف: قطعة واحدة تحركت للأمام ثلاث مرات
    if (pieceKeys.length === 1 && moves[0] === 3) {
        showSecretRoom("المنسق");
    }

    // المساعد: قطعتان متلاصقتان تتحركان كل دور
    if (
        pieceKeys.length === 2 &&
        Math.abs(getRow(pieceKeys[0]) - getRow(pieceKeys[1])) <= 1 &&
        Math.abs(getCol(pieceKeys[0]) - getCol(pieceKeys[1])) <= 1 &&
        moves[0] >= 2 &&
        moves[1] >= 2
    ) {
        showSecretRoom("المساعد");
    }

    // المتابع: تحريك حجرين مختلفين خلال 3 أدوار دون تحريك غيرهما
    if (
        moveCount === 3 &&
        pieceKeys.length === 2 &&
        moves[0] === 1 &&
        moves[1] === 1
    ) {
        showSecretRoom("المتابع");
    }
}

function getRow(pos) {
    return parseInt(pos.split("-")[0]);
}

function getCol(pos) {
    return parseInt(pos.split("-")[1]);
}

function showSecretRoom(role) {
    secretRoom.classList.remove("hidden");
    roleDisplay.textContent = `وصفك: ${role}`;
    setTimeout(() => {
        document.querySelector(".message").textContent = "🚫 تم حذف الرسالة!";
    }, 5000);

    // مربع إدخال للتدمير الذاتي
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "اكتب رسالة...";
    input.style.marginTop = "15px";
    secretRoom.appendChild(input);

    input.addEventListener("input", () => {
        if (input.value === "ككك") {
            board.innerHTML = "";
            secretRoom.innerHTML = "<h2>🔥 تم تدمير المحتوى!</h2>";
        }
    });
}

drawBoard();