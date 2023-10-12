import * as Phaser from "phaser";

import "./style.css";
import { Vector } from "matter";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    isDestroyed: Boolean = false
    private scenePlayer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    constructor(
        scene: Phaser.Scene,
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    ) {
        const rMin = 120;
        const rMax = 1000;
        const phi = rMin + ((rMax - rMin)* Math.random());
        const tetta = Math.random() * Math.PI * 2;
        const xPos = (phi * Math.cos(tetta));
        const yPos = (phi * Math.sin(tetta));
        console.log(player.x + xPos, player.y + yPos);

        super(
            scene,
            player.x + xPos,
            player.y + yPos,
            "enemy"
        );

        this.scenePlayer = player;

        console.log("enemy created");

        scene.physics.add.existing(this);
        scene.add.existing(this);

        scene.physics.add.collider(player, this, (player, self) => {
            self.destroy();
            this.isDestroyed = true;
        });
    }

    update() {
        // I don't know how to write it in pretty way
        let vectorToPlayer = new Phaser.Math.Vector2(this.scenePlayer.x - this.x, this.scenePlayer.y - this.y);
        vectorToPlayer = vectorToPlayer.normalize();
        vectorToPlayer = vectorToPlayer.scale(50);
        this.setVelocity(vectorToPlayer.x, vectorToPlayer.y);
    }
}

export default class Demo extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private enemies: Enemy[] = [];
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("demo");
    }

    preload() {
        this.load.image("character", "assets/character.png");
        this.load.image("floor", "assets/floor.png");
        this.load.image("enemy", "assets/enemy.png");
    }

    create() {
        const floor = this.add.image(0, 0, "floor");

        setInterval(() => this.enemies.push(new Enemy(this, this.player)), 500);

        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.player = this.physics.add.sprite(0, 0, "character");

        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);
    }

    update(time: number, delta: number): void {
        this.enemies.forEach((enemy) => {
            if(!enemy.isDestroyed) {
                enemy.update()
            }
            if(enemy.isDestroyed) {
                const indexToDelete = this.enemies.indexOf(enemy);
                this.enemies.slice(indexToDelete, 1);
            }
        });

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: "#6db11f",
    width: window.innerWidth,
    height: window.innerHeight,
    scene: Demo,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
} satisfies Phaser.Types.Core.GameConfig;

const game = new Phaser.Game(config);
