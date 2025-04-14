// 이미지 및 반지름  추가
import { FRUITS } from "./fruits.js";

// 모듈 불러오기

var Engine = Matter.Engine,
    Render = Matter. Render,
    Runner = Matter.Runner, 
    Bodies = Matter.Bodies,
    World = Matter.World,
    // body 추가
    Body = Matter.Body,

    // Events 추가
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
        engine,
        //어디에 그릴 것인지
        element: document.body,
        options: {
        wireframes: false,
        background: '#F7F4C8',
        widht: 620,
        height: 850,
        }
});

//벽 배치를 위한 world 선언
const world = engine.world;

//벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790,{
                                    // x좌표, y좌표, width, heigh
        isStatic: true,
        render: {fillStyle: '#E6B143'} 
})

const rightWall = Bodies.rectangle(605, 395, 30, 790,{
    // x좌표, y좌표, width, heigh
isStatic: true,
render: {fillStyle: '#E6B143'} 
})

const ground = Bodies.rectangle(310, 820, 620, 60,{
    // x좌표, y좌표, width, heigh
isStatic: true,
render: {fillStyle: '#E6B143'} 
})

const topLine = Bodies.rectangle(310, 150, 620, 2,{
                                // x좌표, y좌표, width, heigh
    // 이벤트 처리를 위해 이름 지정
    name : "topLine",
    isStatic: true,
    // 센서 감지 기능(충돌은 안함)
    isSensor: true,
    render: {fillStyle: '#E6B143'} 
    })
                    
// 생성한 벽을 월드에 배치
World.add(world, [leftWall, rightWall, ground, topLine]);

//실행
Render.run(render);
Runner.run(engine);

// 현재 과일 값을 저장하는 변수
let currentBody = null;
let currentFruit = null;

// 키 조작을 제어하는 변수
let disableAction = false;

//키 제어 변수 생성
let interval = null;


// 과일을 추가하는 함수
function addFruit() {

    // 난수 생성
    const index = Math.floor(Math.random() * 5);

    const fruit = FRUITS[index];

    // 원 모양으로 과일 생성
    const body = Bodies.circle(300, 50, fruit.radius,
        {
            // 해당 과일의 번호값을 저장
            index : index,
            // 처음 시작할때 멈춰있음
            isSleeping : true,
            render: {
                sprite: {texture: `${fruit.name}.png` }
            },
            restitution : 0.4,
        } );

        // 현재 과일값 저장
        currentBody = body;
        currentFruit = fruit;

        //월드에 배치
        World.add(world, body);
}

// 키보드 입력 받기
window.onkeydown = (event)  => {

    console.log(event.code);
    if(disableAction)
            return;

    switch(event.code) {
        case "KeyA":
             
        // 한번 누르면 계속 작동하는걸 제어하기 위한 if문
             if(interval)
                 return;
              // 인터벌 변수 사용, 밀리초 단위로 함수를 반복
              interval = setInterval(() => {
                if(currentBody.position.x - currentFruit.radius > 30) {
                    Body.setPosition(currentBody, {
                        x: currentBody.position.x - 1,
                        y: currentBody.position.y
              })
            }
           }, 5);
            break;
        case "KeyD":
            if (interval)
                return;

                interval = setInterval(() => {
                    if(currentBody.position.x - currentFruit.radius < 590) {
                        Body.setPosition(currentBody, {
                            x: currentBody.position.x + 1,
                            y: currentBody.position.y
                  })
                }
               }, 5);
            break;

        case "KeyS":
            currentBody.isSleeping = false;
            //addFruit();
            disableAction = true;
            // 지연시키는 함수
            setTimeout(() => {
                addFruit();
                disableAction = false;
            }, 1000);
            break;
    }
    
}

//인터벌 제어\
window.onkeyup = (event) => {
    switch(event.code) {
        case "KeyA":
        case "KeyD":
        clearInterval(interval);
        interval = null;
    }
}

Events.on(engine, "collisionStart", (event) => {

    event.pairs.forEach((collision) => {
        // 같은 과일일 경우
        if(collision.bodyA.index == collision.bodyB.index)
        {
           // 지우기 전에 해당 과일 값을 저장
           const index = collision.bodyA.index;

           // 수박일 경우에 처리하지 않음
           if (index == FRUITS.length - 1)
               return;

           // 과일 지우기
            World.remove(world, [collision.bodyA, collision.bodyB]);

            // 다음 단계 과일 생성
            const newFruit = FRUITS[index +1];
            const newBody = Bodies.circle(
                // 충돌한 지점의 x,y
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // 과일값 1 증가
                    index : index + 1,
                    // 새로운 과일 렌더
                    render : { sprite: {texture: `${newFruit.name}.png` } },
                }
            );

            // 새로 만든 과일 추가
            World.add(world, newBody);

            // 게임 승리 조건
            if(newBody.index === 9) {
                setTimeout(() => {
                    alert("You made Whatermelon!\nCongratulation")
                    disableAction = true;
                }, 1000)
            }
        }

        // 게임 종료 조건 이벤트 생성
        if( !disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine" ) ) {
            alert("Game Over");
            disableAction == true;
        }
    })
})

// 함수 호출
addFruit();