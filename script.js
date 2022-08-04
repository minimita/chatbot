// поиск необходимых эл-тов в HTML-коде
const inputField = document.getElementById("input");
const buttonSend = document.getElementById("button");

const foxTimeAnswers = [
   "Ок! Для подтверждения намерений введи номер телефона. Мой менеджер свяжется с тобой",
   "Здорово! Теперь для подтверждения записи введи номер телефона",
   "Теперь для подтверждения записи введите номер телефона"
];

const FoxBookAnswersYes = [
   "Рада слышать) какой день недели интересует?",
   "Ура! На какой день запишемся?",
   "Отлично! В какой день недели ждать в гости?"];

const FoxBookAnswersNo = [
   "Ну хорошо, тогда пиши, как захочешь прийти в гости",
   "А жаль, у нас самые вкусные блюда в городе",
   "Ну хорошо, тогда до скорого"];

const dontUnderstand = [
   "извини, я тебя не понимаю",
   "не могу распознать, переформулируй ответ еще раз",
   "я не могу понять, что ты имеешь в виду"
];

const foxImage = document.getElementById("img");

let foxImages = [];

fetch("https://lessons.programiss.ru/hometasks/16/foxImages.json")
.then(foxImagesBackend => foxImagesBackend.json())
.then(foxImagesBackend2 => foxImages = foxImagesBackend2)

const foxImageChanging = setInterval(function(){
   foxImage.src = foxImages[Math.floor(Math.random() * foxImages.length)];
}, 3000);


const selectedFoxAnswer = (userTexts, foxTexts, text) => {
      let item;
      for (x = 0; x < userTexts.length; x++) {
         for (y = 0; y < foxTexts.length; y++) {
            if (userTexts[x][y] === text){
               items = foxTexts [x];
               item = items[Math.floor(Math.random() * items.length)];
            }
         }
      }
      return item;
   };

const chatDiv = document.getElementById("dialog");

const showFoxAnswer = (text) => {  //ф-ция показа ответа лисы в чате
   //const chatFoxDiv = document.getElementById("dialog");
   const foxDiv = document.createElement("div");
   foxDiv.className = "foxAnswer";
   foxDiv.innerHTML = `Печатает...`;
   chatDiv.appendChild(foxDiv);

   setTimeout(function(){
      foxDiv.innerHTML = `Лиса: ${text}`;
      //speak(text);  озвучка
   }, 1000)
}

const validatePhone = (phone) => { //валидация номера
   const phoneValidator = /^((8|\+7)[\-]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
   return phoneValidator.test(phone);
}

const speak = (text) => { //ф-ция озвучки лисы
   const speaker = new SpeechSynthesisUtterance();
   const allVoices = speechSynthesis.getVoices();
   speaker.voice = allVoices[0];
   speaker.text = string;
   speaker.lang = "ru-RU";
   speaker.volume = 1; //0-1 диапазон
   speaker.rate = 1;
   speaker.pitch = 1; //0-2 диапазон

   speechSynthesis.speak(speaker);
}

showFoxAnswer("Привет! Забронировать столик в ресторане?");

buttonSend.addEventListener('click', function output(){
   const input = inputField.value;
   inputField.value = '';

   const text = input.toLowerCase()
   .replace(/[^\[а-яё\s\d\:\.\,]/g, "")
   .replace("." , ":")
   .replace("," , ":")

   let answerFox = "";
   let foxAnswers = [];
   let userAnswers = [];

   fetch("https://lessons.programiss.ru/user_answers.json")
   .then(userAnswersBackend => userAnswersBackend.json())
   .then(userAnswersBackend2 => userAnswers = userAnswersBackend2)
   .then(
      fetch("https://lessons.programiss.ru/fox_answers.json")
      .then(foxAnswersBackend => foxAnswersBackend.json())
      .then(foxAnswersBackend2 => foxAnswers = foxAnswersBackend2)
      .then(() => {
            if (selectedFoxAnswer(userAnswers, foxAnswers, text)) {
               answerFox = selectedFoxAnswer(userAnswers, foxAnswers, text);
            } else if (/:/.test(text)) {
               answerFox = foxTimeAnswers[Math.floor(Math.random() * foxTimeAnswers.length)];
            } else if (text === 'нет') {
               answerFox = FoxBookAnswersNo[Math.floor(Math.random() * FoxBookAnswersNo.length)];
            } else if (/^\d+$/.test(text)) {
               if (validatePhone(text)){
                  answerFox = `«Итак, твой номер - ${text} Напиши «подтверждаю», если все верно.`;
                  clearInterval(foxImageChanging);
               } else answerFox = "Сорри, но введенный номер - некорректный";
            }  else {
               answerFox = dontUnderstand[Math.floor(Math.random() * dontUnderstand.length)];
            }

            let userDiv = document.createElement("div");  //отображение сообщения пользователя
            userDiv.className = "userAnswer";
            userDiv.innerHTML = `Пользователь: ${input}`;
            chatDiv.appendChild(userDiv);

            showFoxAnswer(answerFox);  //ф-ция показа ответа лисы в чате

            chatDiv.scrollTop = chatDiv.scrollHeight - chatDiv.clientHeight; //скролл чата автопрокрутка
      })
   )
});
