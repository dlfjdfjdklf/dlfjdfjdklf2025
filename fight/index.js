const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 578; 

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor( { position, velocity } ) {
        this.position = position;

        this.velocity = velocity;

        this.width = 50;
        this.height = 150;
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;
    }
}

// 플레이어(1P) 선
const player = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    velocity : {
        x: 0,
        y: 10,
    }
})

// 적(2P) 선언
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100,
    },
    velocity : {
        x: 0,
        y: 10,
    }
})

// console.log(player);

// 재귀함수로 애니메이션 계속 그려주기
function animatie() {
    window.requestAnimationFrame(animate);

    // 캔버스 새로 그리기
    c.fillStyle = "black";
    c.fillRect(0,0, canvas.width, canvas.height);

    // 플레이어 그려주기
    player.update();
    enemy.update();
}

animate();