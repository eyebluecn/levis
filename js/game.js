/***************************Utils**********************************/

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/***************************Defect**********************************/
function Defect(context, loader, x, y) {
	this.context = context;
	this.x = x;
	this.y = y;
	this.width = 128;
	this.height = 128;
	this.degree = 60;
	this.image = null;
	this.loader = loader;
	this.type = -1;
	this.opacity = 0;
	this.opacityStep = 0.02;
}

Defect.prototype.update = function (type) {
	this.type = type;
	this.opacity = 0;
};

Defect.prototype.hit = function (callback) {


	this.type = -1;


	createjs.Sound.play("soundDie");

	if (callback && typeof callback == "function") {
		callback();
	}

};

Defect.prototype.isEmpty = function () {
	return this.type == -1;
};

Defect.prototype.draw = function () {

	if (this.type == -1) {
		return;
	}

	if (this.opacity < 1) {
		this.opacity += this.opacityStep;
	}


	this.image = this.loader.getResult("ninjaDefect" + this.type);

	this.context.save();
	this.context.globalAlpha = this.opacity;

	// this.context.fillStyle = "#FFFF00";
	// this.context.fillRect(this.x, this.y, this.width, this.height);

	this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	this.context.restore();
};

/***************************Brush*********************************/
function Brush(context, loader) {
	this.context = context;
	this.loader = loader;
	this.x = 0;
	this.xOffset = 20;
	this.y = 0;
	this.preX = 0;
	this.preY = 0;
	this.width = 137;
	this.height = 137;
	this.theta = 0;
	this.judgeLength = 3;
	this.image = this.loader.getResult("ninjaBrush");

}

Brush.prototype.init = function () {

};

Brush.prototype.start = function (x, y) {

	this.x = x;
	this.y = y;
	this.preX = this.x;
	this.preY = this.y;

};

Brush.prototype.move = function (x, y) {
	this.preX = this.x;
	this.preY = this.y;
	this.x = x;
	this.y = y;
};


Brush.prototype.stop = function () {
	this.preX = -1;
	this.preY = -1;
	this.x = -1;
	this.y = -1;
};

Brush.prototype.draw = function () {

	if (this.x > 0 && this.y > 0) {
		this.context.save();

		var x2 = this.x;
		var y2 = this.y;
		var x1 = this.preX;
		var y1 = this.preY;

		var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

		if (length > this.judgeLength) {

			this.theta = Math.acos((x1 - x2) / length);

			if (y2 > y1) {
				this.theta = 2 * Math.PI - this.theta;
			}
		}


		var x = this.x - this.height / 2;
		var y = this.y - this.height / 2;

		this.context.translate(this.x, this.y);
		this.context.rotate(this.theta);
		this.context.translate(-this.x, -this.y);

		this.context.drawImage(this.image, x, y, this.width, this.height);

		this.context.restore();
	}

};


function Game(canvas, windowHeight, loader) {
	this.canvas = canvas;
	this.context = null;
	this.loader = loader;

	this.width = 640;
	this.height = windowHeight;


	this.standard = 100;
	this.totalSecond = 20;


	this.startTime = null;
	this.isStop = false;

	this.brush = null;

	this.gridColumn = 5;
	this.gridRow = 6;
	this.gridWidth = 128;
	this.grid = [];

	this.step = 0;
	this.maxStep = 15;

	this.maxDefects = 8;

	this.judgeInnerRadius = 60;

	this.successCallback = null;

	this.ground = {
		x: 0,
		y: this.height - 100,
		width: this.width,
		height: 100,
		color: '#C2AB8F'
	};

	this.record = {
		score: 0,
		x: 300,
		y: this.height - 220,
		width: 300,
		height: 80,
		font: "45px txm",
		color: "#FFFFFF",
		textX: 450,
		textY: this.height - 165,
		image: loader.getResult("ninjaRecord")
	};
	this.timer = {
		time: 20,
		x: this.record.x,
		y: this.record.y + 100,
		width: this.record.width,
		height: this.record.height,
		font: "45px txm",
		color: "#FFFFFF",
		textX: this.record.x + 130,
		textY: this.record.y + 100 + 55,
		image: loader.getResult("ninjaTimer")
	};

}


Game.prototype.start = function () {

	this.startTime = new Date();

	this.isStop = false;

	this.update();

};

Game.prototype.stop = function () {

	this.isStop = true;

	createjs.Sound.play("soundSuccess");


	if (this.successCallback && typeof this.successCallback == "function") {
		this.successCallback(this.record.score);
	}
};


Game.prototype.init = function (successCallback) {
	this.successCallback = successCallback;


	this.canvas.width = this.width;
	this.canvas.height = this.height;


	this.context = this.canvas.getContext('2d');

	this.brush = new Brush(this.context, this.loader);

	this.grid = [];
	for (var m = 0; m < this.gridRow; m++) {
		var row = [];
		for (var n = 0; n < this.gridColumn; n++) {
			row.push(new Defect(this.context, this.loader, n * this.gridWidth, m * this.gridWidth));
		}
		this.grid.push(row);
	}

	this.bindTouchEvents();

	this.reset();
};


Game.prototype.reset = function () {


	this.startTime = new Date();
	this.record.score = 0;
	this.isStop = true;


	var m, n, defect;
	for (m = 0; m < this.gridRow; m++) {
		for (n = 0; n < this.gridColumn; n++) {
			defect = this.grid[m][n];
			defect.update(-1);
		}
	}


	// for (var i = 0; i < this.maxDefects; i++) {
	// 	this.updateGrid();
	// }


	this.update();

};


Game.prototype.bindTouchEvents = function () {

	var that = this;

	this.canvas.addEventListener("touchstart", function (e) {

		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;

		console.log("touchstart x:" + x + " y:" + y);

		that.brush.start(x, y);

	}, false);

	this.canvas.addEventListener("touchmove", function (e) {
		e.preventDefault();

		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;
		that.brush.move(x, y);

	}, false);
	this.canvas.addEventListener("touchend", function (e) {

		that.brush.stop();
	}, false);

};


Game.prototype.drawGround = function () {
	this.context.save();
	this.context.fillStyle = this.ground.color;
	this.context.fillRect(this.ground.x, this.ground.y, this.ground.width, this.ground.height);
	this.context.restore();
};

Game.prototype.drawRecord = function () {
	this.context.save();
	this.context.drawImage(this.record.image, this.record.x, this.record.y, this.record.width, this.record.height);
	this.context.fillStyle = this.record.color;
	this.context.font = this.record.font;
	this.context.fillText(this.record.score + "", this.record.textX, this.record.textY);

	this.context.restore();
};

Game.prototype.drawTimer = function () {

	this.timer.time = this.totalSecond - Math.floor(((new Date()).getTime() - this.startTime.getTime()) / 1000);

	if (this.timer.time <= 0) {
		this.timer.time = 0;
		this.stop();
	}

	this.context.save();
	this.context.drawImage(this.timer.image, this.timer.x, this.timer.y, this.timer.width, this.timer.height);
	this.context.fillStyle = this.timer.color;
	this.context.font = this.timer.font;
	this.context.fillText(this.timer.time + "s", this.timer.textX, this.timer.textY);

	this.context.restore();
};


Game.prototype.updateGrid = function () {
	var m, n, defect, num;
	num = 0;
	for (m = 0; m < this.gridRow; m++) {
		for (n = 0; n < this.gridColumn; n++) {
			defect = this.grid[m][n];
			if (!defect.isEmpty()) {
				num++;
			}
		}
	}

	if (num >= this.maxDefects) {
		return;
	}


	var randomIndex = getRandomInt(0, this.gridRow * this.gridColumn - num - 1);
	var randomType = getRandomInt(0, 8);


	num = 0;
	var hasSet = false;
	for (m = 0; m < this.gridRow; m++) {
		for (n = 0; n < this.gridColumn; n++) {
			defect = this.grid[m][n];
			if (defect.isEmpty()) {

				if (randomIndex == num) {
					defect.update(randomType);
					hasSet = true;
					break;
				}

				num++;
			}
		}

		if (hasSet) {
			break;
		}
	}
};

Game.prototype.drawDefects = function () {

	var m, n, defect;
	for (m = 0; m < this.gridRow; m++) {
		for (n = 0; n < this.gridColumn; n++) {
			defect = this.grid[m][n];
			defect.draw();
		}
	}


};

Game.prototype.checkHit = function () {

	var that = this;


	//touch point.
	var x2 = this.brush.x;
	var y2 = this.brush.y;


	var m, n, defect;
	m = Math.floor(y2 / this.gridWidth);
	if (m < 0) {
		return;
	} else if (m > this.gridRow - 1) {
		return;
	}
	n = Math.floor(x2 / this.gridWidth);
	if (n < 0) {
		return;
	} else if (n > this.gridColumn - 1) {
		return;
	}

	defect = this.grid[m][n];

	if (!defect) {
		console.log("m:" + m + " n:" + n);
	}

	if (!defect.isEmpty()) {
		var x1 = defect.x + defect.width / 2;
		var y1 = defect.y + defect.height / 2;


		if ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) < this.judgeInnerRadius * this.judgeInnerRadius) {

			defect.hit(function () {
				that.record.score += 1;
			});

		}
	}

};

Game.prototype.update = function () {

	var that = this;


	if (++this.step > this.maxStep) {

		this.updateGrid();

		this.step = 0;
	}

	this.context.clearRect(0, 0, this.width, this.height);

	this.checkHit();

	this.drawGround();
	this.drawRecord();
	this.drawTimer();


	this.drawDefects();

	this.brush.draw();

	if (!this.isStop) {
		requestAnimationFrame(function () {
			that.update();
		});
	}


};
