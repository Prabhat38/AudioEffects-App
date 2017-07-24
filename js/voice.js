var result
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var options = ['play the song', 'pause the song', 'repeat', 'Shuffle', 'next song', 'previous song', 'visualizer'];
var grammar = '#JSGF V1.0; grammar options; public <option> = ' + options.join(' | ') + ' ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// adding event on voiuce-icon
$('.fa-microphone').click(function() {
  $('.fa-microphone').removeClass("voice-icon");

// starting the voice recognition
  recognition.start()
})


recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var last = event.results.length - 1;
  result = event.results[last][0].transcript;
  console.log(result);

// now it matches the voice input with the result
  if (result == "play the song") {
    $('.fa-microphone').addClass("voice-icon");
    var song = document.querySelector('audio');
    $('.play-icon').removeClass('fa-play').addClass('fa-pause');
    song.play();
  }

  if (result == "pause the song") {
    $('.fa-microphone').addClass("voice-icon");
    var song = document.querySelector('audio');
    $('.play-icon').removeClass('fa-pause').addClass('fa-play');
    song.pause();
  }

  if(result=="previous song"){
    $('.fa-microphone').addClass("voice-icon");
    previousSong();
  }

  if (result == "next song") {
    $('.fa-microphone').addClass("voice-icon");
    nextSong();
  }

  if (result == "visualizer") {
    $('.fa-microphone').addClass("voice-icon");
    $('fa-bar-chart').toggleClass("bar-icon");
    if (equal == 0) {
      equal = 1;
      $("svg").css("display", "inline-block");
      $(".content").css("display", "none");
      $(".contain").css("display", "inline-block");
      $(".contain").css("background", "black");
    }
    else {
      equal = 0;
      $("svg").css("display", "none");
      $(".content").css("display", "inline-block");
      $(".contain").css("display", "none");
    }
  }

  if (result == "Shuffle" || result=="shuffle")
  {
    $('.fa-microphone').addClass("voice-icon");
    $(".fa-random").toggleClass("shuffle-icon");
    if (willShuffle == 0)
    {
      willShuffle = 1;
      if(willLoop==1)
      {
        willLoop=0;
        $(".fa-repeat").toggleClass("repeat-icon");
      }
    }
    else
    {
      willShuffle = 0;
    }
  }

  if (result == "repeat")
  {
    $('.fa-microphone').addClass("voice-icon");
    $(".fa-repeat").toggleClass("repeat-icon");
    if (willLoop == 0) {
      willLoop = 1;
      if(willShuffle==1)
      {
        willShuffle=0;
        $(".fa-random").toggleClass("shuffle-icon");
      }
    }
    else {
      willLoop = 0;
    }
  }

}
