document.addEventListener("DOMContentLoaded", function () {
  let board = null;
  let game = new Chess();
  let moveHistory = [];

  function onDragStart(source, piece, position, orientation) {
    if (game.game_over() || piece.startsWith("b")) return false;
  }

  function onDrop(source, target) {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (move === null) return "snapback";

    moveHistory.push(move.san);
    checkSecretPatterns();

    setTimeout(makeAIMove, 300);
  }

  function makeAIMove() {
    if (game.game_over() || game.in_draw()) return;

    const moves = game.moves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    board.position(game.fen());
  }

  function checkSecretPatterns() {
    const last3 = moveHistory.slice(-3).join(" ");

    // نمط المنسق
    if (last3 === "Kd2 Kd3 Bc4") {
      openSecretRoom("المنسق");
    }
    // نمط المساعد
    else if (last3.includes("g3") && last3.includes("Nf3")) {
      openSecretRoom("المساعد");
    }
    // نمط المتابع: تحريك 3 قطع مختلفة
    else if (
      moveHistory.length >= 3 &&
      new Set(moveHistory.slice(-3).map((m) => m[0])).size === 3
    ) {
      openSecretRoom("المتابع");
    }
  }

  function openSecretRoom(role) {
    const room = document.getElementById("secret-room");
    room.style.display = "block";
    document.getElementById("role-display").textContent = `وصفك: ${role}`;

    setTimeout(() => {
      document.querySelector(".message").textContent = "🚫 تم حذف الرسالة!";
    }, 5000);

    const input = document.getElementById("secret-input");
    input.addEventListener("input", () => {
      if (input.value === "ككك") {
        document.getElementById("board").innerHTML = "";
        room.innerHTML = "<h2>🔥 تم تدمير المحتوى!</h2>";
      }
    });
  }

  const config = {
    draggable: true,
    position: "start",
    onDragStart,
    onDrop,
  };

  board = Chessboard("board", config);
  document.getElementById("board").style.height = "320px";
  document.getElementById("board").style.width = "320px";
  board.resize();
});