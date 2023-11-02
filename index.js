const sprites = new Image();
sprites.src = './assets/stile.png';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var frames = 0;
var globalW = canvas.width;
var globalH = canvas.height;
var floorHT = (globalH - 97)
var dogHT = ((globalH - 97) - 52);

// Array para armazenar as nuvens
var nuvens = [];

function collapse(dog, floor){
    const dogY = dog.dY + dog.Height;
    const floorY = floor.dY
    if(dogY >= floorY){
        return true
    }
    else{
        return false
    }
}

function CreateDog(){
    const dog ={
        sX: 2,
        sY: 0,
        Width: 40,
        Height: 52,
        dX: globalW - globalW + 10,
        dY: (globalH - 97) - 52,
        gravity: 0.30,
        fast: 0,
        jumping: 0,
        points: 0,
        movimentos: [
            {sX:2, sY:0,},
            {sX:46, sY:0},
            {sX:86, sY:0,},
            {sX:134, sY:0,},
            
        ],// cada movimento do personagem
        atualframe: 0,
        jump(){
            if(dog.jumping<=5.0){
                dog.jumping = dog.jumping + 2.5;
            }
            dog.atualframe = 3;
            dog.dY = dog.dY - dog.jumping;
            if(dog.dY < dogHT){
                return false
            }
        },//animação de pulo
        att(){
            dog.points++
            if(collapse(dog, globais.floor) == false && globais.dog.jump() == false){
                dog.fast += dog.gravity//aumenta a velocidade de queda com o peso da gravidade
                dog.dY += dog.fast;// faz com que o personagem tenha gravidade e caia cada vez mais rapido
            }
            else{
                dog.fast = 0;
            }
            if(dog.dY > dogHT){
                dog.dY = dogHT
            }
        },
        FrameAtt(){
            const IntervaloDeFrames = dog.points < 3000 ? 7 : 5;
            const PassouDoIntervalo = frames % IntervaloDeFrames === 0;

            if(PassouDoIntervalo && dog.dY == dogHT){
                const BaseDoIncremento = 1;
                const Incremento = BaseDoIncremento + dog.atualframe;
                const BaseRepeticao = dog.movimentos.length;
                dog.atualframe = Incremento % BaseRepeticao;
            }
        },//mantem o frame atualziado
        draw(){
            dog.FrameAtt();
            const {sX, sY} = dog.movimentos[dog.atualframe];
            ctx.drawImage(
                sprites,
                sX, sY,
                dog.Width, dog.Height,
                dog.dX, dog.dY,
                dog.Width, dog.Height,
                
            );
        },
    }
    return dog;
}
function CreateFloor(){
    const floor = {
        sX: 0,
        sY: 303,
        Width: 370,
        Height: 97,
        dX: globalW - globalW,
        dY: floorHT,
        att(){
            const framefloor = 1;
            const repeat = floor.Width/3;
            const move = floor.dX - framefloor;
            floor.dX = move % repeat;
        },        
        draw(){
            let tamTotal = globalW/floor.Width;
            if(!Number.isInteger(tamTotal)) {
                tamTotal = (tamTotal + 1).toFixed(0);
            }
            for(let i = 0; i < tamTotal; i++) {
                ctx.drawImage(
                    sprites,
                    floor.sX, floor.sY,
                    floor.Width, floor.Height,
                    (floor.dX + i*floor.Width), floor.dY,
                    floor.Width, floor.Height,
                );
            }
        },
    }
    return floor;
}
const background ={
    draw(){
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px serif'
        ctx.fillText(`Pontos: ${globais.dog.points}`, 10, 30);
    },
}

const GetReady ={
    draw(){
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Pressione W ou Enter', (globalW*50)/100, 30)
    },
}
function CreateObs(){
    const obs ={
        sX: 325,
        sY: 16,
        Width: 59,
        Height: 160,
        espaco: 5,
        pares: [],
        draw(){
            obs.pares.forEach(function(par) {
                const floorY = par.y;
                const floorX = par.x;
                ctx.drawImage(
                    sprites,
                    obs.sX, obs.sY,
                    obs.Width, obs.Height,
                    floorX, floorY,
                    obs.Width, obs.Height,
                );
            });
        },
        Colide(par){
            const DownDog = globais.dog.dY + globais.dog.Height;
            if(globais.dog.dX >= par.x){
                if(DownDog >= par.y){
                    return true;
                }
            }
            return false;
        },
        att(){
            const Passou100Frames = frames % 100 === 0;
            if(Passou100Frames){
                if(obs.espaco<11){
                    obs.espaco = obs.espaco + 0.10;
                }
                let g = Math.floor(Math.random() * (((globalH - 100) - 80) - (globalH - 107) + 1)) + (globalH - 107);
                obs.pares.push({
                    x: canvas.width,
                    y: g,
                })
                console.log((globalH -97) - 100);
                
            }//cria randomicamente os obstaculos a cada 100 frames
            obs.pares.forEach(function(par) {
                par.x = par.x - obs.espaco;
                if(obs.Colide(par)){
                    SwitchScreen(screen.start)
                }
                if(par.x + obs.Width <= 0){
                    obs.pares.shift();
                }//exclui os obstaculos
            })//define um espaço entre os obstaculos
        },
    }
    return obs;
}
function CreateClouds() {
    const cloud = {
        draw(){
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        
            for (var i = 0; i < nuvens.length; i++) {
                var nuvem = nuvens[i];
                ctx.beginPath();
                ctx.arc(nuvem.x - 20, nuvem.y, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x + 20, nuvem.y, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x + 40, nuvem.y - 10, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x + 60, nuvem.y, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x + 40, nuvem.y + 10, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x + 20, nuvem.y + 10, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x, nuvem.y + 10, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x - 20, nuvem.y + 10, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x - 40, nuvem.y, 20, 0, Math.PI * 2);
                ctx.arc(nuvem.x - 20, nuvem.y - 10, 20, 0, Math.PI * 2);
                ctx.fill();
                nuvem.x -= nuvem.velocidade; // Movimenta a nuvem para a direita        
                // Verifica se a nuvem saiu do Canvas e remove-a do array
                if (nuvem.x + canvas.width <= 50) {
                    nuvens.shift();

                }
            }
        },
        att() {
            const Passou100Frames = frames % 100 === 0;
            if(Passou100Frames){
                nuvens.push({
                    x: globalW + 50, // Posição inicial da nuvem fora do Canvas
                    y: Math.floor(Math.random() * (((globalH - 100) - 220) - globalH + 1) + globalH), // Altura aleatória
                    velocidade: Math.random() + 0.5,
                });
            }//cria randomicamente os obstaculos a cada 100 frames
            console.log(nuvens.length)
        }
    }
    return cloud;
}

const globais ={};
let active ={};
function SwitchScreen(newscreen){
    active = newscreen
    if(active.initialize){
        active.initialize();
    }
}// faz saber qual a tela está ativa 
const screen ={
    start: {
        initialize (){
            globais.dog = CreateDog();
            globais.floor = CreateFloor();
            globais.obs = CreateObs();
            globais.sky = CreateClouds();
        },
        draw(){
            background.draw();
            globais.sky.draw();
            globais.floor.draw();
            globais.dog.draw();
            GetReady.draw();
            
        },
        keypress(){
            SwitchScreen(screen.game);
        },
        att(){
            globais.floor.att();
            globais.sky.att();
        },
    },
    // define quais as telas que aparecerão em determinado momento
    game: {
        draw(){
            background.draw();
            globais.sky.draw();
            globais.obs.draw();
            globais.floor.draw();
            globais.dog.draw();   
            // a ordem em que é desenhada importa para aparição dos elementos
        },
        keypress(){
            if(globais.dog.fast == 0){
                globais.dog.jump();
            }
        },
        att(){
            globais.dog.att();
            globais.sky.att();
            globais.floor.att();
            globais.obs.att();
        },
    }
}
function loop(){
    active.draw();
    active.att();
    frames += 1;
    requestAnimationFrame(loop);//ajuda desenhar os quadros
}
window.addEventListener("keypress", function(event){
    if(active.keypress && ((event.key === 'w' || event.key === 'W') || event.keyCode === 13)){
        active.keypress();
    }
})
SwitchScreen(screen.start);//começa com a primeira tela
loop();