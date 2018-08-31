'use strict';

const socket = io();

const lang = 'hi-IN';

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
const chatContainer = document.querySelector('.chat-container');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = lang;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
    
  console.log('Confidence: ' + e.results[0][0].confidence);

  // Structure of html is this -
  // <div class="chat-block first">
  //   <div class="chat-block-item large">
  //       <div class="user-heading">
  //           डॉ ई-मेडिक्स
  //       </div>
  //       <div class="chat-message">
  //         <div class="icon-container">
  //           <img class="icon" src="../images/heart.svg">
  //         </div>
  //         <div class="message-block doc">
  //           {{text}}
  //         </div>
  //       </div>
  //   </div>
  //   <div class="chat-block-item small"></div>
  // </div>

  var fragment = create('<div class="chat-block first"><div class="chat-block-item large"><div class="user-heading">डॉ ई-मेडिक्स</div><div class="chat-message"><div class="icon-container"><img class="icon" src="../images/heart.svg"></div><div class="message-block doc">' + text + '</div></div></div><div class="chat-block-item small"></div></div>');
  chatContainer.appendChild(fragment);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  const voices = synth.getVoices();
  utterance.text = text;
  utterance.lang = lang;
  utterance.localService = true;
  utterance.voice = voices[10];
  //utterance.volume = 1; // 0 to 1
  //utterance.rate = 1;   // 0.1 to 10
    utterance.rate = 0.9;
  //utterance.pitch = 2;  //0 to 2
  synth.speak(utterance);
}

socket.on('bot reply', function (replyText) {
  synthVoice(replyText);

  if (replyText == '') replyText = '(No answer...)';

  // Structure of html is this -
  // <div class="chat-block">
  //   <div class="chat-block-item large"></div> 
  //   <div class="chat-block-item small">
  //       <div class="user-heading">
  //         उपयोगकर्ता
  //       </div>
  //       <div class="chat-message user">
  //         <div class="icon-container">
  //           <img class="icon" src="../images/user.svg">
  //         </div>
  //         <div class="message-block user">
  //           सिर
  //         </div>
  //       </div>
  //   </div>
  // </div>

  var fragment = create('<div class="chat-block"><div class="chat-block-item large"></div><div class="chat-block-item small"><div class="user-heading">उपयोगकर्ता</div><div class="chat-message user"><div class="icon-container"><img class="icon" src="../images/user.svg"></div><div class="message-block user">' + replyText + '</div></div></div></div>')
  chatContainer.appendChild(fragment);
});