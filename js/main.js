var currentSongNumber = 1;
var willLoop = 0;
var willShuffle = 0;
var equal=0;
var toggle=0;
var targett=1;// spacebar should not work on 1st screen

// event on repeat-icon
$('.fa-repeat').on('click',function() {
  if(willShuffle!=1){
    $('.fa-repeat').toggleClass('repeat-icon')
    willLoop = 1 - willLoop;
  }
});

// event on shuffle-icon
$('.fa-random').on('click',function() {
  if(willLoop!=1){
    $('.fa-random').toggleClass('shuffle-icon')
    willShuffle = 1 - willShuffle;
  }
});

// event on bar-chart icon for visualizer screen
$(".fa-bar-chart").click(function(){
  $(this).toggleClass("bar-icon");
  visualChart();
});

// function for showing whether the bar-icon is on or off. If on display this division else remove this division.
function visualChart() {
  if(equal==0)
  {
    equal=1;
    $("svg").css("display","inline-block");
    $(".content").css("display","none");
    $(".contain").css("display","inline-block");
    $(".contain").css("background","black");
    if(toggle==1){
      $(".containeffect").css("display","none");
      $(".fa-toggle-on").toggleClass('toggle-icon')
      toggle=0;
    }
  }
  else{
    equal=0;
    $("svg").css("display","none");
    $(".content").css("display","inline-block");
    $(".contain").css("display","none");
  }
}

//event on toggle-icon for audio effect screen
$(".fa-toggle-on").click(function(){
  $(this).toggleClass('toggle-icon')
  toggleOn();
});

// function for showing whether the toggle-icon is on or off. If on display this division else remove this division.
function toggleOn() {
  if(toggle==0)
  {
    toggle=1;
    $(".content").css("display","none");
    $(".containeffect").css("display","inline-block");
    if(equal==1)
    {
      $(".contain").css("display","none");
      $(".fa-bar-chart").toggleClass('bar-icon')
      $("svg").css("display","none");
      equal=0;
    }
  }
  else {
    toggle=0;
    $(".containeffect").css("display","none");
    $(".content").css("display","inline-block");
  }
}


// event on microphone-icon for voice recognition
$(".fa-microphone").hover(function(){
  $("ol").css("display","inline-block")
  $("ol").css("z-index","1")
});

$(".fa-microphone").mouseout(function(){
  $("ol").css("display","none")
});

// function for selecting random song for shuffling
function randomExcluded(min, max, excluded) {
  var n = Math.floor(Math.random() * (max-min) + min);
  if (n >= excluded) n++;
  return n;
}


function lastSongClick(audio) {
  $('.play-icon').removeClass('fa-pause').addClass('fa-play');
  audio.currentTime = 0;
  currentSongNumber=1;
  audio.pause();
}

function songIndex(nextSongObj,audio) {
  audio.src = "songs/"+nextSongObj.fileName;
  toggleSong();
  changeCurrentSongDetails(nextSongObj);
}

// event for generating next song
$('.next-icon').click(function(){
  nextSong();
});

// function generating next song along with shuffle and repeat
function nextSong(){
  var audio=document.querySelector('audio');
  // console.log(audio.duration);
  var len=songs.length;

  if (willShuffle == 1) {
    var nextSongNumber = randomExcluded(1,len,currentSongNumber); // Calling our function for random selection
    var nextSongObj = songs[nextSongNumber-1];
    songIndex(nextSongObj,audio);
    currentSongNumber = nextSongNumber;
  }

  else if(currentSongNumber < len) {
    for(var i=0;i<len;i++){
      if(audio.src.search(songs[i].fileName)!=-1)
      break;
    }
    currentSongNumber=i+1;
    if(currentSongNumber < len){
      var nextSongObj = songs[currentSongNumber];
      songIndex(nextSongObj,audio);
    }

    else if(willLoop == 1) {
      var nextSongObj = songs[0];
      songIndex(nextSongObj,audio);
      currentSongNumber =  1;
    }

    else {
      currentSongNumber=len-1;
      lastSongClick(audio);
    }
  }

  else {
    lastSongClick(audio);
  }
}

// event for generating previous song
$('.previous-icon').click(function(){
  previousSong();
});

// function generating previous song along with shuffle and repeat
function previousSong(){
  var audio=document.querySelector('audio');
  // console.log(audio.duration);
  var len=songs.length;

  if (willShuffle == 1) {
    var nextSongNumber = randomExcluded(1,len,currentSongNumber); // Calling our function for random selection
    var nextSongObj = songs[nextSongNumber-1];
    songIndex(nextSongObj,audio);
    currentSongNumber = nextSongNumber;
  }

  else if(currentSongNumber > -1) {
    for(var i=0;i<len;i++){
      if(audio.src.search(songs[i].fileName)!=-1)
      break;
    }
    currentSongNumber=i-1;
    if(currentSongNumber > -1){
      var nextSongObj = songs[currentSongNumber];
      songIndex(nextSongObj,audio);
    }
    else if(willLoop == 1) {
      var nextSongObj = songs[len-1];
      songIndex(nextSongObj,audio);
      currentSongNumber =  1;
    }
    else {
      lastSongClick(audio);
    }
  }
  else {
    lastSongClick(audio);
  }
}


// event to hide first screen and display second screen
$('.welcome-screen button').on('click', function() {
  var name = $('#name-input').val();
  if (name.length > 3) {
    var message = "Welcome, " + name;
    $('.main .user-name').text(message);
    $('.welcome-screen').addClass('hidden');
    $('.main').removeClass('hidden');
    $(".content").css("display","inline-block");
    $(".contain").css("display","none");
    $(".containeffect").css("display","none");
    targett=0;
  }
  else {
    $('#name-input').addClass('error');
  }
});


//Logging out to first screen
$('.button').on('click', function() {
  $('.welcome-screen').removeClass('hidden');
  $('.main').addClass('hidden');
  $("svg").css("display","none");
  targett=1;

  // removing the visualizer icon if it is on  when logging out
  if(equal==1)
  {
    $(".fa-bar-chart").toggleClass("bar-icon");
    visualChart();
  }

  // removing the toggle icon if it is on when logging out
  if(toggle==1)
  {
    $(".fa-toggle-on").toggleClass("toggle-icon");
    toggleOn();
  }
  // removing the repeat icon if it is on when logging out
  if(willLoop==1)
  {
    $(".fa-repeat").toggleClass("repeat-icon");
    willLoop=0;
  }
  // removing the shuffle icon if it is on when logging out
  if(willShuffle==1)
  {
    $(".fa-random").toggleClass("shuffle-icon");
    willShuffle=0;
  }

  var song=document.querySelector('audio');
  if(song.paused!=true){
    song.pause();
    $('.play-icon').removeClass('fa-pause').addClass('fa-play');
    song.currentTime=0;
    song.src="songs/"+songs[0].fileName;
    changeCurrentSongDetails(songs[0]);
  }

  document.getElementById("name-input").value = "";
  $('#name-input').attr('placeholder','Name');
  $('#name-input').removeClass('error');

  // disabling the audio effects as soon as the user logs out.
  var adeffect=[chorus,delay,phaser,overdrive,compressor,convolver,filter,cabinet,tremolo,wahwah];
  var adClass=['chorus','delay','phaser','overdrive','compressor','convolver','filter','cabinet','tremolo','wahwah'];
  for(var i=0;i<adeffect.length;i++)
  {
    // console.log(adeffect[i]);
    if(adeffect[i].bypass==false){
      adeffect[i].bypass=true;
      // console.log("correct");
      $("."+adClass[i]).toggleClass("border");
    }
  }
});


// function for playing the song if paused and vice-versa.
function toggleSong() {
  var song = document.querySelector('audio');
  if (song.paused == true) {
    $('.play-icon').removeClass('fa-play').addClass('fa-pause');
    song.play();
  }
  else {
    // console.log('Pausing');
    $('.play-icon').removeClass('fa-pause').addClass('fa-play');
    song.pause();
  }
}

//event on play-icon for playing the song and Pausing the song
$('.play-icon').on('click', function() {
  toggleSong();
});

// event occured on pressing spacebar for playing and pausing the song
$('body').on('keypress', function(event) {
  // console.log(event);
  var target=event.target;
  if (event.keyCode == 32 && target.tagName!='INPUT' && targett!=1) {
    toggleSong();
  }
});

// function for displaying the time format in hrs:mm:ss
function fancyTimeFormat(time) {
  var hrs= ~~(time/3600);
  var min= ~~((time%3600)/60);
  var sec= time%60;
  var ret="";
  if(hrs>0)
  {
    ret+=""+hrs+":"+(min<10?":":"");
  }
  ret+=""+min+":"+(sec<10?"0":"");
  ret+=""+sec;
  return ret;
}

// function for updating the currentTime and duration of the song
function updateCurrentTime() {
  var song = document.querySelector('audio');
  // console.log("play 1");
  $('.time-elapsed').text(fancyTimeFormat(Math.floor(song.currentTime)));
  $('.song-duration').text(fancyTimeFormat(Math.floor(song.duration)));
  // console.log(song.currentTime);
  // console.log(song.duration);
  if(song.duration==song.currentTime)//play the next song if previous song is over
  nextSong();
}

// function for adding event on the songs using id.
function addClickEvent(songObj,position) {
  var songname= songObj.fileName;
  var id='#song'+position;
  // event on div of the songs using their ids.
  $(id).click(function(){
    var audio=document.querySelector('audio');
    if(audio.src.search(songname)!=-1){
      toggleSong();
    }
    else {
      audio.src="songs/"+songname;
      toggleSong();
      changeCurrentSongDetails(songObj);
    }
  });
}

// function for chaniging the details of the song which is playing or to be played
function changeCurrentSongDetails(songObj) {
  $('.current-song-image').attr('src','img/' + songObj.image)
  $('.current-song-name').text(songObj.name)
  $('.current-song-album').text(songObj.album)
}

// creating the "songs" object variable with the details of every song
var songs = [{
  'name': 'Badri ki Dulhania',
  'artist': 'Neha Kakkar, Monali Thakur, Ikka Singh, Dev Negi',
  'album': 'Badrinath ki Dulhania',
  'duration': '2:56',
  'fileName': 'song1.mp3',
  'image':'song1.jpg'
},
{
  'name': 'Humma Song',
  'artist': 'Badshah, Jubin Nautiyal, Shashaa Tirupati',
  'album': 'Ok Jaanu',
  'duration': '3:15',
  'fileName': 'song2.mp3',
  'image':'song2.jpg'
},
{
  'name': 'Kuch Toh Hain & Kaun Tujhe',
  'artist': 'Armaan Malik',
  'album': 'Love Mashup',
  'duration': '3:40',
  'fileName': 'song5.mp3',
  'image':'song5.jpg'
},
{
  'name': 'Nashe Si Chadh Gayi',
  'artist': 'Arijit Singh',
  'album': 'Befikre',
  'duration': '2:34',
  'fileName': 'song3.mp3',
  'image':'song3.jpg'
},
{
  'name': 'The Breakup Song',
  'artist': 'Nakash Aziz, Arijit Singh, Badshah, Jonita Gandhi',
  'album': 'Ae Dil Hai Mushkil',
  'duration': '2:29',
  'fileName': 'song4.mp3',
  'image':'song4.jpg'
}
];

// as soon as the window is loaded the below events starts working
window.onload=function(){

  // using loop for placing the song on the screen inside div tag and adding the function "addClickEvent"
  for(var i =0; i < songs.length;i++) {
    var obj=songs[i];
    var name = '#song' + (i+1);
    var song = $(name);
    song.find('.song-name').text(obj.name);
    song.find('.song-artist').text(obj.artist);
    song.find('.song-album').text(obj.album); // Added
    song.find('.song-length').text(obj.duration); // Added
    addClickEvent(obj,i+1);
  }

  // using DataTable plugin of jquery
  $('#songs').DataTable({
    paging: false // removing the pages showing the number of songs
  });

  changeCurrentSongDetails(songs[0]); //placing the details of first song as soon as the window is loaded
  updateCurrentTime(); //updating the first one second of the song

  setInterval(function(){
    // using the "setInterval" function for updating the currenttime of the song every second
    // console.log("play");
    updateCurrentTime();
  },1000);

  // using the "setInterval" function for updating the progress-bar according to the currentTime of the song every second
  setInterval(function() {
    updateTimer();
  }, 1000);
}


// function for updating the progress-bar of the song
function updateTimer(){
  var song = document.querySelector('audio');
  var ct =song.currentTime;
  var td =song.duration;
  var percentage = (ct/td)*100;
  $(".progress-filled").css('width',percentage+"%");
}

// event occuring when the progress-bar is clicked taking the song to that time time or width where its is been clicked
$(".player-progress").click(function(event) {
  var $this = $(this);

  // to get part of width of progress bar clicked
  var widthclicked = event.pageX - $this.offset().left;
  var totalWidth = $this.width(); // can also be cached somewhere in the app if it doesn't change

  // do calculation of the seconds clicked
  var calc = (widthclicked / totalWidth) * 100 ; // get the percent of bar clicked and multiply in by the duration


  var song = document.querySelector('audio');
  song.currentTime = (song.duration*calc)/100;

  updateTimer();
});
