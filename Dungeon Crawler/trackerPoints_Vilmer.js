"use strict";

const room1Points = [
    {x: canvas.width * 0.1, y: canvas.height * 0.13, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.1, y: canvas.height * 0.80, status: 10, height: 5, width: 5},
    
    {x: canvas.width * 0.5, y: canvas.height * 0.13, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.5, y: canvas.height * 0.80, status: 10, height: 5, width: 5},

    {x: canvas.width * 0.9, y: canvas.height * 0.13, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.9, y: canvas.height * 0.80, status: 10, height: 5, width: 5}
];

const room2Points = [
    {x: canvas.width * 0.1, y: canvas.height * 0.12, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.1, y: canvas.height * 0.83, status: 10, height: 5, width: 5},
    
    {x: canvas.width * 0.5, y: canvas.height * 0.12, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.5, y: canvas.height * 0.83, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.5, y: canvas.height * 0.5, status: 10, height: 5, width: 5},

    {x: canvas.width * 0.9, y: canvas.height * 0.12, status: 10, height: 5, width: 5},
    {x: canvas.width * 0.9, y: canvas.height * 0.83, status: 10, height: 5, width: 5}
]

rooms.room1.unshift(room1Points);
rooms.room2.unshift(room2Points);
rooms.room3.unshift(room2Points);

