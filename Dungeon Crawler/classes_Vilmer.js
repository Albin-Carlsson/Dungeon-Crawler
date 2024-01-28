"use strict";


let spriteSheet = document.getElementById("spriteSheet");
let brainImage = document.getElementById("brainImage")

// basic blueprint for an enemy
class Enemy {
    constructor(x, y, width, height, v, health, damage, ctx, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.v = v;
        this.health = health;
        this.damage = damage;
        this.ctx = ctx;
        this.type = type;

    }
    draw() {
        this.ctx.drawImage(spriteSheet, 0, 0, 30, 30, this.x, this.y, player.width * 2, player.height * 2);
    }
}

// This is declared early for convenience
let allObjects = [];

// the only type of enemy at the moment, more may be added later
class Skeleton extends Enemy {
    drawSkeleton() {
        this.ctx.drawImage(spriteSheet, 0, 0, 30, 30, this.x, this.y, player.width, player.height);
    }
}

class Brain extends Enemy {

    drawBrain() {
        this.ctx.drawImage(brainImage, 0, 0, 30, 30, this.x, this.y, player.width, player.height);
    }
}