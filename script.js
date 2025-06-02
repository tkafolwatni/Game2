document.addEventListener("DOMContentLoaded", function () {
    let board = null;
    let game = new Chess();
    let moveHistory = [];

    function onDragStart(source, piece, position, orientation) {
        if (game.game_over() || piece.search(/^b/) !== -1) {
            return false;
        }
    }

    function onDrop(source, target) {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        moveHistory.push(move.san);
        checkSecretPatterns();

        setTimeout(makeAIMove, 300);
    }

    function makeAIMove() {
        const possibleMoves = game.moves();
        if (game.game_over() || game.in_draw()) return;

        const randomIdx = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIdx]);
        board.position(game.fen());
    }

    function checkSecretPatterns() {
        const lastMoves = moveHistory.slice(-3).join(" ");

        if (lastMoves === "Kd2 Kd3 Bc4") {
            openSecretRoom("المنسق");
        } else if (lastMoves.includes("g3 Nf3")) {
            openSecretRoom("المساعد");
        } else if (
            moveHistory.length >= 3 &&
            new Set(moveHistory.slice(-3).map(m => m[0])).size === 3
        ) {
            openSecretRoom("المتابع");
        }
    }

    function openSecretRoom(role) {
        const secretRoom = document.getElementById("secret-room");
        secretRoom.style.display = "block";

        document.getElementById("role-display").innerText = `وصفك: ${role}`;

        setTimeout(() => {
            document.querySelector(".message").textContent = "🚫 تم حذف الرسالة!";
        }, 5000);

        const input = document.getElementById("secret-input");
        input.addEventListener("input", () => {
            if (input.value === "ككك") {
                document.getElementById("board").innerHTML = "";
                secretRoom.innerHTML = "<h2>🔥 تم تدمير المحتوى!</h2>";
            }
        });
    }

    const config = {
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop
    };

    board = Chessboard('board', config);
});