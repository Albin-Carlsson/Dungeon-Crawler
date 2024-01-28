"use strict";

// spawns a set amount of skeletons
let enemyAmount = 0;
function spawnSkeleton(amount) {

    // possible spawnpoints are found by making sure there are no
    // objects on that coordinate, this temporarily adds a safearea
    // around the player that counts as collision, meaning
    // no possible spawnpoints can be found within safeArea
    const safeArea = {
        x: player.x - 200,
        y: player.y - 200,
        width: 400,
        height: 400,
    };
    allObjects.unshift(safeArea);

    for (let i = 0; i < amount; i++) {
        const [x, y] = enemySpawnPoint(safeArea);

        allObjects.push(
            new Skeleton(
                x,
                y,
                player.width,
                player.height,
                player.v * 0.5,
                100,
                1,
                ctx,
                "skeleton"
            )
        );
        enemyAmount++;
    }

    // removes safeArea when enemies have been spawned
    allObjects.shift();
}

// same function as above but spawns brain instead of skeleton
function spawnBrain(amount) {
    const safeArea = {
        x: player.x - 200,
        y: player.y - 200,
        width: 400,
        height: 400,
    };
    allObjects.unshift(safeArea);

    for (let i = 0; i < amount; i++) {
        const [x, y] = enemySpawnPoint(safeArea);

        allObjects.push(
            new Brain(
                x,
                y,
                player.width,
                player.height,
                player.v * 0.7,
                50,
                1,
                ctx,
                "brain",
                false
            )
        );
        enemyAmount++;
    }
    allObjects.shift();
}

// provides coordinates for a possible spawnpoint
function enemySpawnPoint(safeArea) {
    let spawnX;
    let spawnY;

    let possibleSpawn = false;
    while (possibleSpawn == false) {
        spawnX =
            wall.sideWidth +
            Math.random() * (canvas.width - wall.sideWidth * 3);
        spawnY =
            wall.topBottomHeight +
            Math.random() * (canvas.height - wall.topBottomHeight * 3);
        if (
            !checkForCollision(spawnX, spawnY, {
                width: player.width,
                height: player.height,
            })[0]
        ) {
            possibleSpawn = true;
        }
    }
    return [spawnX, spawnY];
}

// Moves object towards another object if possible.
function tracker(e, eTowards) {
    // avoids collision with player
    if (
        Math.abs(e.x + e.width / 2 - player.x - player.width / 2) >
            player.width / 2 + e.width / 2 ||
        Math.abs(e.y + e.height / 2 - player.y - player.height / 2) >
            player.height / 2 + e.height / 2
    ) {
        // tracks player
        let distX = eTowards.x - e.x;
        let distY = eTowards.y - e.y;
        let dist = Math.sqrt(distX ** 2 + distY ** 2);
        let newPosX = e.x + (distX / dist) * e.v;
        let newPosY = e.y + (distY / dist) * e.v;

        // checks for collision after movement in both directions or one direction.
        // giving an entity the alternative of moving in only one direction
        // prevents it from getting stuck
        let tempArr = checkForCollision(newPosX, newPosY, e);
        if (!tempArr[0]) {
            e.x = newPosX;
            e.y = newPosY;
        } else {
            if (e.type == "brain" && tempArr[1].type == undefined) {
                // pointMovement(e);
            }
            if (!checkForCollision(newPosX, e.y, e)[0]) {
                // Move only in X direction if diagonal does not work
                e.x = newPosX;
            } else if (!checkForCollision(e.x, newPosY, e)[0]) {
                // Move only in Y direction if diagonal does not work
                e.y = newPosY;
            }
        }
    } else {

        // damages player on collision with an enemy
        if (e.type == "skeleton" || e.type == "brain") {
            damagePlayer(e);
        }
    }

}

// makes sure the player can only take damage once per second
let damageInterval;
let invulnerable = false;
function damagePlayer(e) {
    if (invulnerable == false) {
        invulnerable = true;
        damageInterval = setInterval(invulnerability, 1000);
        // setInterval(damagePlayer, 1000);
        player.health = player.health - e.damage;
    }
}

function invulnerability() {
    clearInterval(damageInterval);
    invulnerable = false;
}

// checks any object for collision, returns either true and what the
// object collided with or only false
function checkForCollision(newPosX, newPosY, e) {
    for (let i = 0; i < allObjects.length; i++) {
        let currentObject = allObjects[i];
        if (currentObject == e) {
            continue;
        }

        // In order to chech for collision between objects of different sizes
        // we have to compare the coordinates for the middle of the objects
        // instead of the coordinates for the top-left.
        // this is found by subtracting half of the objects width from
        // its x-coordinate and half of the objects height from its
        // y coordinate
        if (
            Math.abs(
                newPosX +
                    e.width / 2 -
                    currentObject.x -
                    currentObject.width / 2
            ) <
                e.width / 2 + currentObject.width / 2 &&
            Math.abs(
                newPosY +
                    e.height / 2 -
                    currentObject.y -
                    currentObject.height / 2
            ) <
                e.height / 2 + currentObject.height / 2
        ) {
            return [true, currentObject];
        }
    }
    return false;
}

function damageEnemy(e, bullet) {
    // removes health
    e.health -= 40;

    // removes enemy if health <= 0
    if (e.health <= 0) {
        for (let i = 0; i < allObjects.length; i++) {
            if (allObjects[i] == e) {
                // newAllObjects.push(allObjects[i])
                allObjects.splice(i, 1);
            }
        }

        enemyAmount--;

        // for Albins code
        enemiesKilled++;
        enemyKilledX = e.x;
        enemyKilledY = e.y;
        spawnEnemyLoot();
    }
}
let smallObject = {
    width: 5,
    height: 5,
};

// checks if there are any walls between two objects or not.
// returns true if there is line of sight (no walls) and false if not
function lineOfSight(e, eToward) {
    let DistX = eToward.x - e.x;
    let DistY = eToward.y - e.y;
    const lineA = Math.sqrt(DistX ** 2 + DistY ** 2);

    for (let i = 0; i < allObjects.length; i++) {
        let currentObject = allObjects[i];

        // skips enemies since they shouldnt block line of sight
        if (currentObject.type === undefined) {


            DistX = currentObject.x - e.x;
            DistY = currentObject.y - e.y;
            const lineB = Math.sqrt(DistX ** 2 + DistY ** 2);

            DistX = currentObject.x - eToward.x;
            DistY = currentObject.y - eToward.y;
            const lineC = Math.sqrt(DistX ** 2 + DistY ** 2);

            // The following Math is explained in Loggbok_Vilmer.docx  
            const angle = Math.acos(
                (lineB ** 2 + lineC ** 2 - lineA ** 2) / (lineB * lineC * 2)
            );
            const height = (lineB * lineC * Math.sin(angle)) / lineA;

            // checks angle to make sure heights without orthogonal lines to lineA dont count.
            // all angles for heights without orthogonal lines to lineA are <= 90 (pi/2).
            if (height < (player.height * 1.1) && angle >= Math.PI / 2) {
                return false;
            }
        }
    }
    return true;
}

// updates the status of every point
function updatePoints(room) {
    const pointsResolved = [];
    const pointsLeft = [];

    // find all points that should have status: 1
    for (let i = 0; i < room[0].length; i++) {
        let point = room[0][i];
        if (lineOfSight(point, player)) {
            point.status = 1;
            pointsResolved.push(point);
        } else {
            point.status = 10;
            pointsLeft.push(point);
        }
    }

    // loop through all points that have been updated (pointsResolved)
    for (let i = 0; i < pointsResolved.length; i++) {
        const pointResolved = pointsResolved[i];

        // checks if current resolved point has line of sight to any unresolved point
        for (let j = 0; j < pointsLeft.length; j++) {
            const pointLeft = pointsLeft[j];

            if (lineOfSight(pointLeft, pointResolved)) {

                // gives found point appropriate status
                pointLeft.status = pointResolved.status + 1;

                // adds the updated point to the list of updated points, 
                // this means that this point will be looped through as 
                // a resolved point later
                pointsResolved.push(pointLeft);

                // Remove found point from list of unresolved points
                pointsLeft.splice(j, 1);
                j--;
            }
        }
    }
}

let wallAmount = 0;
let roomsCleared = 0;

// moves enemy towards best point (closest and lowest status)
function pointMovement(e) {

    // finds all points with line of sight to e
    let points = roomOrder[roomInside][0];
    const pointsInLOS = [];
    for (let i = 0; i < points.length; i++) {
        let currentPoint = points[i];
        if (lineOfSight(currentPoint, e)) {
            pointsInLOS.push(currentPoint);
        }
    }

    // picks out points with lowest status
    let bestPoints = [];
    let lowestStatus = 10;
    for (let i = 0; i < pointsInLOS.length; i++) {
        let currentPoint = pointsInLOS[i];
        if (currentPoint.status < lowestStatus) {
            bestPoints = [currentPoint];
            lowestStatus = currentPoint.status;
        } else if (currentPoint.status == lowestStatus) {
            bestPoints.push(currentPoint);
        }
    }

    // finds closest point
    let closestPoint;
    let bestDist = canvas.height * 5; // random large distance
    for (let i = 0; i < bestPoints.length; i++) {
        let currentPoint = bestPoints[i];
        let distX = currentPoint.x - e.x;
        let distY = currentPoint.y - e.y;
        let dist = Math.sqrt(distX ** 2 + distY ** 2);

        if (dist < bestDist) {
            bestDist = dist;
            closestPoint = currentPoint;
        }
    }

    // move towards closest point
    tracker(e, closestPoint);
}

// called every frame
function enemyLoop() {
    if (player.health <= 0) {
        gameOver = true;
        allObjects = [];
    }

    // checks if level is cleared
    if (roomInside > roomsCleared) {
        wallAmount = 0;
        roomsCleared++;
        allObjects = [];

        // allWalls gives all objects with positions for all walls (from Albins code)
        // skips first element in array since i added the array of trackerPoints there.
        let allWalls = roomOrder[roomInside];
        for (let i = 1; i < allWalls.length; i++) {
            allObjects.push(allWalls[i]);
            wallAmount++;
        }
        spawnSkeleton(Math.floor(roomsCleared * 1.5));
        spawnBrain(Math.floor(roomsCleared * 0.5 + 1));
    }

    // opens doors when all enemies are dead
    if (enemyAmount == 0) {
        levelComplete = true;
    }

    // updates positions for all enemiees
    for (let i = wallAmount; i < allObjects.length; i++) {
        let currentObject = allObjects[i];

        if (currentObject.type == "brain") {
            if (!lineOfSight(currentObject, player)) {
                pointMovement(currentObject);
            } else {
                tracker(currentObject, player);
            }
        } else {
            tracker(currentObject, player);
        }

        if (currentObject.type == "skeleton") {
            currentObject.drawSkeleton();
        } else if (currentObject.type == "brain") {
            currentObject.drawBrain();
        }

        // moveEnemy(allObjects[i]);
    }

    // checks if any bullet has hit anything
    if (bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];

            // Albin stores bullet size using the radius of the bullet but
            // checkForCollision can only use width and height.
            bullet.width = player.width / 2;
            bullet.height = player.height / 2;

            let bulletArr = [];
            bulletArr = checkForCollision(bullet.x, bullet.y, bullet);

            // if bullet collides with something
            if (bulletArr.length > 1) {
                damageEnemy(bulletArr[1], bullet);
                bullets.splice(i, 1);
            }
        }
    }

    // there are no points in room 0
    if (roomInside != 0) {
        updatePoints(roomOrder[roomInside]);
    }

    requestAnimationFrame(enemyLoop);
}
