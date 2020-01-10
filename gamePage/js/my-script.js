document.documentElement.style.cursor = 'url(../images/cursor.cur), auto';// это курсор в виде прицела
let block = document.querySelector(".gameTime"); // это див в который положим таймер и счетчик очков
let s = 60; // секунды для таймера
let newParag = document.createElement("h1"); // создал h1 для таймера
newParag.style.textAlign = "center";
newParag.innerHTML = "Game Time 01 : 00";
block.appendChild(newParag);
let totalPoint = 0; // тут будет считать очки за попадания
let p = document.createElement('p'); // а здесь очки будут выводится на экран
p.setAttribute('id', 'pointView');
p.classList.add('pointView');
p.innerHTML = 'Your point: ' + totalPoint;
block.appendChild(p);
let pointView = document.getElementById('pointView');

let gameOverBlock = document.querySelector('.gameOverBlock');// всплывает если время закончилось
gameOverBlock.style.opacity = 0;
let score = document.querySelector('.score'); // для вывода набранных очков игры (выводится в gameOverBlock)
let restart = document.getElementById('restart');// кнопка перезапуска игры
let gameOver = document.getElementById('gameOver');// нажмите если игра надоела

class CreateImg { // создаем наши птички
	constructor(background, name, point, speed, tick){
		this.background = background; // адресс для картинок
		this.name = name; // id птичек и свинтуса
		this.point = point; // очки за попадание в цель
		this.speed = speed; // время для transition
		this.intervalID = false; // intervalID и isMoving нужны для остановки обьектов в конце игры
		this.isMoving = false;
		this.tick = tick; // время задержки выбора новых координат для движения
	}

	displayInfo(){ // все что нужно для визуализации обьектов (см. строку 84)
		this.newImg = document.createElement('img');
		this.newImg.setAttribute("id", this.name);
		this.newImg.setAttribute("class", 'game-img');	
		this.newImg.setAttribute('src', this.background);
		this.newImg.setAttribute('data-point', this.point);
		this.newImg.style.transition = 'all ' + this.speed + 'ms';
		this.newImg.style.position = "absolute";
		this.newImg.style.cursor = 'url(../images/cursor.cur), auto';
		this.newImg.style.top = (Math.random() * document.body.clientHeight * 0.7 + document.body.clientHeight * 0.15) + "px";
		this.newImg.style.left = (Math.random() * document.body.clientWidth * 0.7 + document.body.clientHeight * 0.15) + "px";
		document.body.appendChild(this.newImg);
		document.getElementById(this.name).addEventListener('click', this.setBangImg.bind(this)); // вызываем метод setBangImg (см. строку 56)
	}

	move(){ // говорим обьектам как двигаться
		this.isMoving = true;
		this.intervalID = setInterval(()=>{
			this.newImg.style.top = (Math.random() * document.body.clientHeight*0.7+document.body.clientHeight*0.15) + "px";
			this.newImg.style.left = (Math.random() * document.body.clientWidth*0.7+document.body.clientHeight*0.15) + "px";
		}, this.tick);   
	}

	setBangImg(){ // когда попадаем по обьекту
		this.newImg.setAttribute('src', '../images/bang.png'); // взрываем 
		setTimeout(this.setOriginalImg.bind(this), 1000); // см. строку 65
		totalPoint += this.point; // считает очки за попадание
		pointView.innerHTML = 'Your point: ' + totalPoint; // выводит набранные очки на экран
		if (totalPoint <= 0) pointView.style.color = 'red';
		else if (totalPoint > 0) pointView.style.color = 'green';

	}

	setOriginalImg(){ // после попадания возрбновляем движение (см. строку 58)
		this.newImg.setAttribute('src', this.background);
		this.newImg.style.top = (Math.random() * document.body.clientHeight*0.7+document.body.clientHeight*0.15) + "px";
		this.newImg.style.left = (Math.random() * document.body.clientWidth*0.7+document.body.clientHeight*0.15) + "px";
	}

	stop(){ // вызовем метод для остановки обьектов (см. строку 105)
		if(this.intervalID){
			this.isMoving = false;
			clearInterval(this.intervalID);	
		}
	}
}



let bird1 = new CreateImg('../images/bird_10_points.png', 'bird1', 10, 3000, 650); // создаем наши птички
let bird2 = new CreateImg('../images/bird_20_points.png', 'bird2', 20, 2000, 550);
let bird3 = new CreateImg('../images/bird_50_points.png', 'bird3', 50, 1000, 530);
let pig = new CreateImg('../images/pig_minus_100_points.png', 'pig', -100, 1500, 750); // и свинью
bird1.displayInfo();
bird2.displayInfo(); // выводим все обьекты на экран и говорим им двигаться
bird3.displayInfo();
pig.displayInfo();
bird1.move();
bird2.move();
bird3.move();
pig.move();

function timer(){ // ф-ция для таймера
	s--; // уменьшаем секунды
	newParag.innerHTML = "Game Time 00 : " + s ; 
	if (s == 0){
		clearInterval(t); // останавливаем таймер и обьекты
		bird1.stop();
		bird2.stop();
		bird3.stop();
		pig.stop();

		newParag.innerHTML = "Game Time 00 : 00";
		gameOverBlock.style.opacity = 1; // когда время заканчиваеться выплывает окошко
		score.innerHTML = 'Вы набрали: ' + totalPoint + ' очков';
		if (totalPoint >= 500) {
			gameOverBlock.firstElementChild.innerHTML = 'You Win)))';
			gameOverBlock.firstElementChild.style.color = 'green';
			score.style.color = 'green';
		} else if (totalPoint < 500){
			gameOverBlock.firstElementChild.innerHTML = 'You Lose(((';
			gameOverBlock.firstElementChild.style.color = 'red';
			score.style.color = 'red';
		}
		
	} else if (s < 10){newParag.innerHTML = "Game Time 00 : 0" + s ;}
}
let t = setInterval(timer, 1000); // вызываем таймер на экран

function restartGame(){ // вызовем ее при клике см. строку 133
	// обнуляем очки и запускаем таймер заново
	gameOverBlock.style.opacity = 0; // скрываем окно до окончания времени
	totalPoint = 0;
	pointView.innerHTML = 'Your point: ' + totalPoint;
	s = 60;
	bird1.move();
	bird2.move();
	bird3.move();
	pig.move();
	t = setInterval(timer, 1000); 
}

restart.addEventListener('click', restartGame);
gameOver.addEventListener('click', function(){ // кнопка в gameOverBlock
	if (totalPoint >= 500) {
		window.location.href = "winPage.html";
	} else if (totalPoint < 500){
		window.location.href = "losePage.html";
	}
})

			