function Levis() {

	this.swiper = null;
	this.loader = null;
	this.$loading = null;
	this.$welcome = null;
	this.$ninja = null;
	this.$ninjaToast = null;

	this.game = null;
	this.score = 0;
	this.top = 80;
	this.$verify = null;
	this.$product = null;
	this.$productToast = null;

	this.$share = null;
	this.snowNum = 40;


	this.standardDeltaY = 50;
}
Levis.prototype.template = function () {

};

Levis.prototype.start = function () {
	var that = this;

	this.initDom();

	this.pageLoading(function () {


		that.pageWelcome();

		that.swiper.slideNext();

	});
};

Levis.prototype.initDom = function () {

	var that = this;
	var index = 0;
	this.swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		loop: false,
		noSwiping: true,

		onSlidePrevEnd: function (swiper) {
			index = swiper.activeIndex;
			if (index == 2) {
				swiper.slidePrev();
			}
		},
		onSlideNextEnd: function (swiper) {
			index = swiper.activeIndex;

			//verify
			if (index == 1) {

			}
			//ninja
			if (index == 2) {
				that.$success.hide();

				that.$rule1.hide();
				that.$rule2.hide();
				that.$ninjaToast.hide();

				that.$ninja.parent(".swiper-slide").addClass("swiper-no-swiping");


				setTimeout(function () {
					that.pageToast("rule1", function () {
						that.pageToast("rule2", function () {
							that.pageToast("countdown", function () {
								that.game.start();
							});
						});
					});
				}, 100);


			}
			//verify
			if (index == 3) {
				that.$success.hide();
				that.$ninjaToast.hide();
			}
			//product
			if (index == 4) {
				var $btnBoxes = that.$product.find(".btn-box");
				$btnBoxes.click(function () {
					createjs.Sound.play("soundTap");
					var $this = $(this);
					that.pageToast($this.data("toast"), function () {
					});
				});

			}
			//introduction.
			if (index == 5) {

			}
			//share
			if (index == 6) {

				var $rank = that.$share.find(".rank");

				var percent = 99;
				if (that.score < that.top) {
					percent = Math.floor(that.score * 100 / that.top)
				}

				//$rank.text(percent);
				$rank.text("87");


			}

		}
	});


	this.$loading = $(".page.loading");
	this.$welcome = $(".page.welcome");
	this.$ninja = $(".page.ninja");
	this.$product = $(".page.product");
	this.$ninjaToast = $(".toast.ninja");
	this.$productToast = $(".toast.product");


	this.$rule1 = this.$ninjaToast.find(".rule1");
	this.$rule2 = this.$ninjaToast.find(".rule2");
	this.$countdown = this.$ninjaToast.find(".countdown");
	this.$success = this.$ninjaToast.find(".success");

	this.$verify = $(".page.verify");
	this.$share = $(".page.share");

	var $effect = this.$share.find(".effect");
	$effect.empty();

	for (var i = 0; i < this.snowNum; i++) {
		var num = getRandomInt(0, 9);

		var $img = $("<img src='img/share/rainbow" + num + ".png'/>");
		var left = getRandomInt(0, 640);
		var duration = getRandomInt(1000, 3000);

		$img.css({
			top: "-20px",
			left: left + "px",
			"-webkit-animation": "share-snow " + duration + "ms infinite cubic-bezier(.56,0,1,1) normal"
		});

		$effect.append($img);

	}


};


Levis.prototype.pageLoading = function (callback) {

	var that = this;

	var $one = this.$loading.find(".one");
	var $two = this.$loading.find(".two");
	var $three = this.$loading.find(".three");

	$three.show();

	var remain = 1;
	var defectInterval = setInterval(function () {

		if (remain == 1) {
			$one.show();
			$two.hide();
			$three.hide();
			remain = 2;
		} else if (remain == 2) {
			$one.hide();
			$two.show();
			$three.hide();
			remain = 3;
		} else if (remain == 3) {
			$one.hide();
			$two.hide();
			$three.show();
			remain = 1;
		}

	}, 3000);


	this.$loading.ready(function () {

		//random image.
		var manifest = [

			{id: "loadingBrush", src: "img/loading/brush.png"},
			{id: "loadingDefect1", src: "img/loading/defect1.png"},
			{id: "loadingDefect2", src: "img/loading/defect2.png"},
			{id: "loadingDefect3", src: "img/loading/defect3.png"},

			{id: "introductionBg", src: "img/introduction/bg.png"},

			{id: "ninjaBrush", src: "img/ninja/brush.png"},
			{id: "ninjaDefect0", src: "img/ninja/defect0.png"},
			{id: "ninjaDefect1", src: "img/ninja/defect1.png"},
			{id: "ninjaDefect2", src: "img/ninja/defect2.png"},
			{id: "ninjaDefect3", src: "img/ninja/defect3.png"},
			{id: "ninjaDefect4", src: "img/ninja/defect4.png"},
			{id: "ninjaDefect5", src: "img/ninja/defect5.png"},
			{id: "ninjaDefect6", src: "img/ninja/defect6.png"},
			{id: "ninjaDefect7", src: "img/ninja/defect7.png"},
			{id: "ninjaDefect8", src: "img/ninja/defect8.png"},
			{id: "ninjaRecord", src: "img/ninja/record.png"},
			{id: "ninjaTimer", src: "img/ninja/timer.png"},

			{id: "productContent", src: "img/product/content.png"},

			{id: "shareBg", src: "img/share/bg.png"},
			{id: "shareBoard", src: "img/share/board.png"},
			{id: "shareRainbow0", src: "img/share/rainbow0.png"},
			{id: "shareRainbow1", src: "img/share/rainbow1.png"},
			{id: "shareRainbow2", src: "img/share/rainbow2.png"},
			{id: "shareRainbow3", src: "img/share/rainbow3.png"},
			{id: "shareRainbow4", src: "img/share/rainbow4.png"},
			{id: "shareRainbow5", src: "img/share/rainbow5.png"},
			{id: "shareRainbow6", src: "img/share/rainbow6.png"},
			{id: "shareRainbow7", src: "img/share/rainbow7.png"},
			{id: "shareRainbow8", src: "img/share/rainbow8.png"},
			{id: "shareRainbow9", src: "img/share/rainbow9.png"},

			{id: "toastArrowDown", src: "img/toast/arrow-down.png"},
			{id: "toastArrowUp", src: "img/toast/arrow-up.png"},
			{id: "toastClose", src: "img/toast/close.png"},
			{id: "toastCountdown1", src: "img/toast/countdown1.png"},
			{id: "toastCountdown2", src: "img/toast/countdown2.png"},
			{id: "toastCountdown3", src: "img/toast/countdown3.png"},
			{id: "toastProductBg", src: "img/toast/product-bg.png"},
			{id: "toastProductFirst", src: "img/toast/product-first.png"},
			{id: "toastProductSecond", src: "img/toast/product-second.png"},
			{id: "toastProductThird", src: "img/toast/product-third.png"},
			{id: "toastRule1", src: "img/toast/rule1.png"},
			{id: "toastRule2", src: "img/toast/rule2.png"},
			{id: "toastShine", src: "img/toast/shine.png"},
			{id: "toastSuccess", src: "img/toast/success.png"},


			{id: "verifyBoard", src: "img/verify/board.png"},
			{id: "verifyVerify", src: "img/verify/verify.png"},

			{id: "welcomeBg", src: "img/welcome/bg.png"},
			{id: "welcomeBody", src: "img/welcome/body.png"},
			{id: "welcomeDrop1", src: "img/welcome/drop1.png"},
			{id: "welcomeDrop2", src: "img/welcome/drop2.png"},
			{id: "welcomeEyeClose", src: "img/welcome/eye-close.png"},
			{id: "welcomeEyeOpen", src: "img/welcome/eye-open.png"},
			{id: "welcomeStart", src: "img/welcome/start.png"},

			{id: "soundCard", src: "sound/card.mp3"},
			{id: "soundDie", src: "sound/die.mp3"},
			{id: "soundLost", src: "sound/lost.mp3"},
			{id: "soundSuccess", src: "sound/success.mp3"},
			{id: "soundTap", src: "sound/tap.mp3"}
		];

		var $hint = that.$loading.find(".hint");

		that.loader = new createjs.LoadQueue();
		createjs.Sound.alternateExtensions = ["mp3"];
		that.loader.installPlugin(createjs.Sound);

		that.loader.on("progress", function (p) {
			var percent = parseInt(p.progress * 100);
			$hint.html(percent + '%');
		});

		that.loader.on("fileload", function (event) {


			if (event.item.id == "loadingDefect3") {
				that.$loading.find("img").each(function () {
					if ($(this).data("src")) {
						$(this).attr("src", $(this).data("src"));
					}
				});

			}


		});

		that.loader.on("complete", function () {


			$("img").each(function () {
				if ($(this).data("src")) {
					$(this).attr("src", $(this).data("src"));
				}
			});

			clearInterval(defectInterval);


			setTimeout(function () {
				if (callback && typeof callback == "function") {
					callback();
				}
			}, 200);


		});

		that.loader.loadManifest(manifest);

	});

};


Levis.prototype.pageWelcome = function () {

	var that = this;
	var $startBtn = this.$welcome.find(".btn-start");

	$startBtn.click(function () {

		createjs.Sound.play("soundTap");

		that.pageNinja();
		that.swiper.slideNext();

	});


};


Levis.prototype.pageNinja = function (position) {
	window.requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;

	var that = this;

	var $stage = this.$ninja.find(".stage");
	$stage.empty();
	$stage.append("<canvas id='stageCanvas'></canvas>");

	var canvas = document.getElementById('stageCanvas');

	var windowHeight = $(window).height();
	this.game = new Game(canvas, windowHeight, this.loader);

	this.game.init(function (score) {

		that.score = score;

		that.pageToast("success", null, function () {
			that.swiper.slideNext();

		});
	});

};


Levis.prototype.smoothScroll = function ($page, nextPageCallback, prePageCallback) {

	var that = this;

	var successStartY = 0;
	var successEndY = 0;
	$page.unbind("touchstart").bind("touchstart", function (e) {
		successStartY = e.touches[0].pageY;
	});
	$page.unbind("touchmove").bind("touchmove", function (e) {

	});

	$page.unbind("touchend").bind("touchend", function (e) {
		successEndY = e.changedTouches[0].pageY;
		var deltaY = successStartY - successEndY;


		if (deltaY > that.standardDeltaY) {
			if (nextPageCallback && typeof nextPageCallback == "function") {

				nextPageCallback();
			}
		}

		if (deltaY < -that.standardDeltaY) {
			if (prePageCallback && typeof prePageCallback == "function") {

				prePageCallback();
			}
		}
	});


};

Levis.prototype.pageToast = function (type, callback, scrollCallback) {

	var that = this;


	if (type == "rule1") {

		this.$ninjaToast.show();

		this.$rule1.show();

		this.$rule1.find(".close").one("click", function () {

			createjs.Sound.play("soundTap");

			that.$rule1.hide();

			if (callback && typeof callback == "function") {
				callback();
			}
		});

	} else if (type == "rule2") {
		this.$rule2.show();

		this.$rule2.find(".close").one("click", function () {

			createjs.Sound.play("soundTap");

			that.$rule2.hide();

			if (callback && typeof callback == "function") {
				callback();
			}
		});

	} else if (type == "countdown") {

		var $three = that.$countdown.find(".three");
		var $two = that.$countdown.find(".two");
		var $one = that.$countdown.find(".one");

		that.$countdown.show();

		setTimeout(function () {

			$three.addClass("cur");

			setTimeout(function () {
				$three.removeClass("cur");
				$two.addClass("cur");

				setTimeout(function () {
					$two.removeClass("cur");
					$one.addClass("cur");
					setTimeout(function () {



						$one.removeClass("cur");

						that.$countdown.hide();
						that.$ninjaToast.hide();

						if (callback && typeof callback == "function") {
							callback();
						}

					}, 1000);
				}, 1000);
			}, 1000);

		}, 200);


	} else if (type == "success") {

		this.$ninjaToast.show();

		that.$success.show();

		that.$success.find(".result").text(this.score);


		that.$ninja.parent(".swiper-slide").removeClass("swiper-no-swiping");

		// this.smoothScroll(that.$success, function () {
		//
		//
		// 	if (scrollCallback && typeof scrollCallback == "function") {
		// 		scrollCallback();
		// 	}
		//
		// });

	} else if (type == "product-first" || type == "product-second" || type == "product-third") {
		that.$productToast.show();
		var $productDetail = this.$productToast.find("." + type);
		$productDetail.show();
		$productDetail.find(".close").one("click", function () {
			createjs.Sound.play("soundTap");
			$productDetail.hide();
			that.$productToast.hide();
			if (callback && typeof callback == "function") {
				callback();
			}
		});

	}
};


$(function () {
	var levis = new Levis();
	levis.start();

	console.log("欢迎来到‘来威爵士无添加之旅’");
	console.log("Created by lishuang");
	console.log("http://liyarou.com");

});

