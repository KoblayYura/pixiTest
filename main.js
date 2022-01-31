//В задании относительно позиции которая должна бить указана в  JSON
// не совсем понял задачу .... (если персонажей будет 100 - для каждого нужно установить координаты?)
// по тому позицию на холсте установил рандомно для каждого персонажа

let Application = PIXI.Application,
    Container   = PIXI.Container,
    Text        = PIXI.Text;

const app = new Application({
    width: 800,
    height: 768,
    backgroundColor: 0x000000
});
document.getElementById('game').appendChild( app.view)

const Graphics = PIXI.Graphics;
const loader = PIXI.Loader.shared;
let enemiesCount=0,
    enemiesQuantity = 0,
    gameScene,
    bg,
    enemiesBar,
    enemies,
    enemiesWrapper,
    state,
    enemiesSheet={};

loader.add('img/atlas.json').add('enemi','img/enemi.png').load((loader, resources) => {
    let textrures = resources['img/atlas.json'].textures;

    gameScene = new Container();
    app.stage.addChild(gameScene);

    bg = new PIXI.TilingSprite(
        textrures['bg.jpg'],
        app.screen.width,
        app.screen.height
    );
    gameScene.addChild(bg);


    enemiesBar = new Container();
    enemiesBar.position.set(app.screen.width/2 - enemiesBar.width/2, 20);
    gameScene.addChild(enemiesBar);

    enemiesWrapper = new Container();
    gameScene.addChild(enemiesWrapper)

    let ellips = new Graphics();
        ellips.lineStyle(3, 0x0b4c21);
        ellips.beginFill(0xffffff);
        ellips.drawEllipse(0, 0, 40,20)
        ellips.endFill();
    enemiesBar.addChild(ellips);

    let stylesText = {
        fontSize: 18,
        fontFamily: 'Arial',
        fill: 'green'
    };

    enemiesQuantity = resources['img/atlas.json'].data.frames['enemis'].count;

    enemiesCount = new Text(enemiesQuantity, stylesText);
    enemiesCount.x = -enemiesCount.width/2;
    enemiesCount.y = -enemiesCount.height/2;
    enemiesBar.addChild(enemiesCount);

    createEnemieSheet();
    for(let i=0; i<enemiesQuantity; i++){
        let x = (Math.random()*(app.screen.width-40))<40?40:Math.random()*(app.screen.width - 40);
        let y = (Math.random()*(app.screen.height-40))<40?40:Math.random()*(app.screen.height - 40);
        createEnemie(x, y);
    }



    app.ticker.add(gameLoop)

});

function gameLoop(delta) {}
function handleKill(){
    enemiesWrapper.removeChild(this);
    enemiesCount.text=enemiesWrapper.children.length
}

function createEnemieSheet(){
    let character = new PIXI.BaseTexture.from(loader.resources['enemi'].url);
    let w = 60;
    let h = 53;
    enemiesSheet['move'] = [
        new PIXI.Texture(character, new PIXI.Rectangle(0 * w, 0, w, h)),
        new PIXI.Texture(character, new PIXI.Rectangle(1 * w, 0, w, h)),
        new PIXI.Texture(character, new PIXI.Rectangle(2 * w, 0, w, h)),
        new PIXI.Texture(character, new PIXI.Rectangle(3 * w, 0, w, h))
    ]
}

function createEnemie(x,y){
    enemies = new PIXI.AnimatedSprite(enemiesSheet.move);
    enemies.interactive = true;
    enemies.buttonMode = true;
    enemies.on('pointerdown', handleKill)
    enemies.anchor.set(0.5);
    enemies.animationSpeed = 0.1
    enemies.loop = true;
    enemies.x = x;
    enemies.y = y;
    enemiesWrapper.addChild(enemies);
    enemies.play()
}