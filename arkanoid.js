;(function() {

    function Game(boardId) {
        this.board = document.getElementById(boardId);
        this.scene = this.board.getContext("2d");
        this.gameSize = {
            width: this.scene.canvas.width,
            height: this.scene.canvas.height
        };
        this.bodies = [new Player(this.gameSize, this.board.getBoundingClientRect()), new Ball(this.gameSize), new Targets()];
        var game = this;
        function tick() {
            game.update(game.bodies[0], game.bodies[1], game.bodies[2]);
            game.draw(game.bodies[0], game.bodies[1], game.bodies[2]);
            requestAnimationFrame(tick);
        }
        tick();
    }

    Game.prototype.update = function(player, ball, targets) {
        player.move(this.gameSize);
        ball.move(player, targets, this.gameSize);
    };

    Game.prototype.draw = function(player, ball, targets) {
        this.scene.clearRect(0, 0, this.gameSize.width, this.gameSize.height);
        this.scene.fillRect(player.position.x, player.position.y, player.size.width, player.size.height);
        this.scene.fillRect(ball.position.x, ball.position.y, ball.size.width, ball.size.height);
        for (var target = 0; target < targets.position.length; target++) {
            this.scene.strokeStyle = "#8e9eab";
            this.scene.fillRect(targets.position[target].x, targets.position[target].y, targets.size.width, targets.size.height);
            this.scene.strokeRect(targets.position[target].x, targets.position[target].y, targets.size.width, targets.size.height);
        }
    };

    function Player(gameSize, relativePosition) {
        this.size = {
            width: 90,
            height: 10
        };
        this.position = {
            x: gameSize.width / 2 - this.size.width / 2,
            y: gameSize.height - this.size.height
        };
        this.relativePosition = relativePosition;
    }

    Player.prototype.move = function(gameSize) {
        var self = this;
        window.onmousemove = function(e) {
            console.log(e.clientX);
            self.position.x = e.clientX - self.relativePosition.left - self.size.width / 2 < 0 ? 0 :
                              e.clientX - self.relativePosition.left - self.size.width / 2 > gameSize.width - self.size.width ? gameSize.width - self.size.width :
                              e.clientX - self.relativePosition.left - self.size.width / 2;
        };
    };

    function Ball(gameSize) {
        this.size = {
            width: 7,
            height: 7
        };
        this.position = {
            x: gameSize.width / 2 - this.size.width / 2,
            y: gameSize.height - 3 * this.size.height
        };
        this.velocity = {
            dx: 0,
            dy: -2
        };
    }

    Ball.prototype.move = function(player, targets, gameSize) {
        this.velocity.dx *= (this.position.x < 0 || this.position.x > gameSize.width - this.size.width) ? -1 : 1;
        this.velocity.dy *= (this.position.y < 0) ? -1 : 1;
        if (this.position.y + this.size.height > gameSize.height - player.size.height && this.position.x > player.position.x && this.position.x + this.size.width < player.position.x + player.size.width) {
            this.velocity.dx = ((this.position.x + this.size.width / 2) - (player.position.x + player.size.width / 2)) / 10;
            this.velocity.dy *= -1;
        } else if (this.position.y > gameSize.height - this.size.height) {
            document.location.reload(true);
        }
        for (var target = 0; target < targets.position.length; target++) {
            var dx = (this.position.x + this.size.width / 2) - (targets.position[target].x + targets.size.width / 2),
                dy = (this.position.y + this.size.height / 2) - (targets.position[target].y + targets.size.height / 2),
                width = (this.size.width + targets.size.width) / 2,
                height = (this.size.height + targets.size.height) / 2,
                crossWidth = width * dy,
                crossHeight = height * dx;
            if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                if (crossWidth > crossHeight) {
                    if (crossWidth > -crossHeight) {
                        this.velocity.dy *= -1;
                    } else {
                        this.velocity.dx *= -1;
                    }
                } else {
                    if (crossWidth > -crossHeight) {
                        this.velocity.dx *= -1;
                    } else {
                        this.velocity.dy *= -1;
                    }
                }
                targets.position.splice(target, 1);
                break;
            }
        }
        this.position.x += this.velocity.dx;
        this.position.y += this.velocity.dy;
    };

    function Targets() {
        this.size = {
            width: 60,
            height: 20
        };
        this.position = [];
        this.setPosition();
    }

    Targets.prototype.setPosition = function () {
        for (var rows = 1; rows <= 4; rows++) {
            for (var columns = 0; columns < 8; columns++) {
                this.position.push({x: columns * this.size.width + this.size.width, y: rows * this.size.height + this.size.height});
            }
        }
    };

    window.onload = function() {
        new Game("canvas");
    };

})();
