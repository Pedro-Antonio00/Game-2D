const sprites = new Image();
sprites.src = './stile.png';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let frames = 0;

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
        dX: 10,
        dY: 254,
        gravity: 0.16,
        fast: 0,
        jumping: 0,
        points: 0,
        jump(){
            if(dog.jumping<=5.0){
                dog.jumping = dog.jumping + 2.5;
            }
            dog.atualframe = 3;
            dog.dY = dog.dY - dog.jumping;
            if(dog.dY < 254){
                return false
            }
        },//animação de pulo
        att(){
            dog.points++
            if(collapse(dog, globais.floor) == false && globais.dog.jump() == false){
                dog.fast = dog.fast + dog.gravity//aumenta a velocidade de queda com o peso da gravidade
                dog.dY = dog.dY + dog.fast;// faz com que o personagem tenha gravidade e caia cada vez mais rapido
            }
            else{
                dog.fast = 0;
            }
            if(dog.dY > 254){
                dog.dY = 254
            }
        },
        movimentos: [
            {sX:2, sY:0,},
            {sX:46, sY:0},
            {sX:86, sY:0,},
            {sX:134, sY:0,},
            
        ],// cada movimento do personagem
        atualframe: 0,
        FrameAtt(){
            const IntervaloDeFrames = 10;
            const PassouDoIntervalo = frames % IntervaloDeFrames === 0;

            if(PassouDoIntervalo && dog.dY == 254){
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
        Width: 375,
        Height: 97,
        dX: 0,
        dY: canvas.height - 96,
        att(){
            const framefloor = 1;
            const repeat = floor.Width/3;
            const move = floor.dX - framefloor;
            floor.dX = move % repeat;
        },        
        draw(){
            ctx.drawImage(
                sprites,
                floor.sX, floor.sY,
                floor.Width, floor.Height,
                floor.dX, floor.dY,
                floor.Width, floor.Height,
                
            );
            ctx.drawImage(
                sprites,
                floor.sX, floor.sY,
                floor.Width, floor.Height,
                (floor.dX + floor.Width), floor.dY,
                floor.Width, floor.Height,
                
            );
        },
    }
    return floor;
}
const background ={
    draw(){
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0,0, canvas.width, canvas.height);
    },
}
const GetReady ={
    sX: 0,
    sY: 147,
    Width: 219,
    Height: 70,
    dX: (canvas.width / 2) - 220/2,
    dY: 50,
    draw(){
        ctx.drawImage(
            sprites,
            GetReady.sX, GetReady.sY,
            GetReady.Width, GetReady.Height,
            GetReady.dX, GetReady.dY,
            GetReady.Width, GetReady.Height,
        );
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
                    obs.espaco = obs.espaco + 0.05;
                }
                let g = 300 / (Math.random()+1);
                if(g<223 && g>150){
                    obs.pares.push({
                        x: canvas.width,
                        y: g,
                    })
                }
                
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
        },
        draw(){
            background.draw();
            globais.floor.draw();
            globais.dog.draw();
            GetReady.draw();
            
        },
        keypress(){
            SwitchScreen(screen.game);
        },
        att(){
            globais.floor.att();
        },
    }
}// define quais as telas que aparecerão em determinado momento
screen.game ={
    draw(){
        background.draw();
        globais.obs.draw();
        globais.floor.draw();
        globais.dog.draw();   
        // a ordem em que é desenhada importa para aparição dos elementos
    },
    keypress(){
        globais.dog.jump();
    },
    att(){
        globais.dog.att();
        globais.floor.att();
        globais.obs.att();
    },
}
function loop(){
    active.draw();
    active.att();
    frames = frames + 1;
    requestAnimationFrame(loop);//ajuda desenhar os quadros
}
window.addEventListener("keypress", function(){
    if(active.keypress){
        active.keypress();
    }
})
SwitchScreen(screen.start);//começa com a primeira tela
loop();