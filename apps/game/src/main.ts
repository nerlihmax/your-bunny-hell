import * as Phaser from "phaser";

import "./style.css";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        onDestroy: () => void
    ) {
        super(
            scene,
            player.x +
                (Math.random() - 0.5) *
                    2 *
                    Math.min((Math.random() * 500, 300)),
            player.y +
                (Math.random() - 0.5) *
                    2 *
                    Math.min((Math.random() * 500, 300)),
            "enemy"
        );

        console.log("enemy created");

        scene.physics.add.existing(this);
        scene.add.existing(this);

        scene.physics.add.collider(player, this, (player, self) => {
            self.destroy();
            onDestroy();
        });
    }

    update() {
        this.setVelocity(50, 50);
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
        this.enemies.forEach((enemy) => enemy.update());

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
