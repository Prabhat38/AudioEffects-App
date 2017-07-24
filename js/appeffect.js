var audioCtx,audioSrc,audioElement,analyser;
var chorus,delay,phaser,overdrive,compressor,convolver,filter,cabinet,tremolo,wahwah,bitcrusher,moog,pingPongDelay;

$(document).ready(function () {

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  tunaDemo();//function containing different effects of audio

  audioElement = document.querySelector('audio');
  audioSrc = audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(wahwah.input);
  audioSrc.connect(delay.input);// first audio effect //connect the source to the input property of the Tuna delay
  audioSrc.connect(tremolo.input);
  audioSrc.connect(filter.input);
  audioSrc.connect(chorus.input);
  audioSrc.connect(phaser.input);
  audioSrc.connect(compressor.input);
  audioSrc.connect(overdrive.input);
  audioSrc.connect(cabinet.input);
  audioSrc.connect(convolver.input);// last audio effect

  audioSrc.connect(audioCtx.destination);//connect audio source to output
  delay.connect(audioCtx.destination);//connect delay as a standard web audio node to the audio context destination
  wahwah.connect(audioCtx.destination);
  tremolo.connect(audioCtx.destination);
  filter.connect(audioCtx.destination);
  chorus.connect(audioCtx.destination);
  phaser.connect(audioCtx.destination);
  compressor.connect(audioCtx.destination);
  overdrive.connect(audioCtx.destination);
  cabinet.connect(audioCtx.destination);
  convolver.connect(audioCtx.destination);

  audioSrc.crossOrigin = "anonymous";

  //var frequen

  var svgHeight = '300';
  var svgWidth = '1300'.crossOrigin = "anonymous";

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(200);

  var svgHeight = '300';
  var svgWidth = '1200';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d) {
           return 'rgb(0, 0, ' + d + ')';
        });
  }

  // Run the loop
  renderChart();

});


// var chorus,delay,phaser,overdrive,compressor,convolver,filter,cabinet,tremolo,wahwah,bitcrusher,moog,pingPongDelay;

function tunaDemo() {
  //create an instance of Tuna by passing the AudioContext we use
  var tuna = new Tuna(audioCtx);

  //create a new Tuna  instance

  // A basic chorus effect.
  chorus = new tuna.Chorus({
    rate: 1.5,         //0.01 to 8+
    feedback: 0.2,     //0 to 1+
    delay: 0.0045,     //0 to 1
    bypass: true          //the value 1 starts the effect as bypassed, 0 or 1
  });

  // A delay effect with feedback and a lowpass filter applied to the delayed signal.
  delay = new tuna.Delay({
    feedback: 0.45,    //0 to 1+
    delayTime: 150,    //1 to 10000 milliseconds
    wetLevel: 0.25,    //0 to 1+
    dryLevel: 1,       //0 to 1+
    cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: true
  });

  // A basic phaser effect.
  phaser = new tuna.Phaser({
    rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
    depth: 0.3,                    //0 to 1
    feedback: 0.2,                 //0 to 1+
    stereoPhase: 30,               //0 to 180
    baseModulationFrequency: 700,  //500 to 1500
    bypass: true
  });

  // A basic overdrive effect.
  overdrive = new tuna.Overdrive({
    outputGain: 0.5,         //0 to 1+
    drive: 0.7,              //0 to 1
    curveAmount: 1,          //0 to 1
    algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
    bypass: true
  });

  // A compressor with the option to use automatic makeup gain.

  compressor = new tuna.Compressor({
    threshold: -1,    //-100 to 0
    makeupGain: 1,     //0 and up (in decibels)
    attack: 1,         //0 to 1000
    release: 0,        //0 to 3000
    ratio: 4,          //1 to 20
    knee: 5,           //0 to 40
    automakeup: true,  //true/false
    bypass: true
  });

  // A convolver with high- and lowcut. You can find a lot of impulse resonses here, or by searching for "free impulse response files".
  convolver = new tuna.Convolver({
    highCut: 22050,                         //20 to 22050
    lowCut: 20,                             //20 to 22050
    dryLevel: 1,                            //0 to 1+
    wetLevel: 1,                            //0 to 1+
    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
    bypass: true
  });

  // A basic filter.
  filter = new tuna.Filter({
    frequency: 440, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 0, //-40 to 40 (in decibels)
    filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    bypass: true
  });

  // A cabinet/speaker emulator.
  cabinet = new tuna.Cabinet({
    makeupGain: 1,                                 //0 to 20
    impulsePath: "impulses/impulse_guitar.wav",    //path to your speaker impulse
    bypass: true
  });

  // A basic tremolo.
  tremolo = new tuna.Tremolo({
    intensity: 0.3,    //0 to 1
    rate: 4,         //0.001 to 8
    stereoPhase: 0,    //0 to 180
    bypass: true
  });

  // A wahwah with an auto wah option.
  wahwah = new tuna.WahWah({
    automode: true,                //true/false
    baseFrequency: 0.5,            //0 to 1
    excursionOctaves: 2,           //1 to 6
    sweep: 0.2,                    //0 to 1
    resonance: 10,                 //1 to 100
    sensitivity: 0.5,              //-1 to 1
    bypass: true
  });

  // A lo-fi bitcrusher effect.
  bitcrusher = new tuna.Bitcrusher({
    bits: 4,          //1 to 16
    normfreq: 0.1,    //0 to 1
    bufferSize: 4096  //256 to 16384
  });

  // A resonant, analog-sounding filter.
  moog = new tuna.MoogFilter({
    cutoff: 0.065,    //0 to 1
    resonance: 3.5,   //0 to 4
    bufferSize: 4096  //256 to 16384
  });

  // A delay that bounces between the left and right channel.
  pingPongDelay = new tuna.PingPongDelay({
    wetLevel: 0.5, //0 to 1
    feedback: 0.3, //0 to 1
    delayTimeLeft: 150, //1 to 10000 (milliseconds)
    delayTimeRight: 200 //1 to 10000 (milliseconds)
  });
}

// selecting the classes on which we have to place the effect when clicked
var del=document.querySelector('.delay');
var wah=document.querySelector('.wahwah');
var trem=document.querySelector('.tremolo');
var filt=document.querySelector('.filter');
var chors=document.querySelector('.chorus');
var phase=document.querySelector('.phaser');
var compress=document.querySelector('.compressor');
var over=document.querySelector('.overdrive');
var cab=document.querySelector('.cabinet');
var convol=document.querySelector('.convolver');

//adding events on  the classes selected by variables
$(del).click(function(e){
  $(this).toggleClass("border");
  if(delay.bypass){
    delay.bypass=false;
    console.log("false");
  }
  else {
    delay.bypass=true;
    console.log("true");
  }
});

$(wah).click(function(e){
  $(this).toggleClass("border");
  if(wahwah.bypass){
    wahwah.bypass=false;
    console.log("false");
  }
  else {
    wahwah.bypass=true;
    console.log("true");
  }
});

$(trem).click(function(e){
  $(this).toggleClass("border");
  if(tremolo.bypass){
    tremolo.bypass=false;
    console.log("false");
  }
  else {
    tremolo.bypass=true;
    console.log("true");
  }
});

$(filt).click(function(e){
  $(this).toggleClass("border");
  if(filter.bypass){
    filter.bypass=false;
    console.log("false");
  }
  else {
    filter.bypass=true;
    console.log("true");
  }
});

$(chors).click(function(e){
  $(this).toggleClass("border");
  if(chorus.bypass){
    chorus.bypass=false;
    console.log("false");
  }
  else {
    chorus.bypass=true;
    console.log("true");
  }
});

$(phase).click(function(e){
  $(this).toggleClass("border");
  if(phaser.bypass){
    phaser.bypass=false;
    console.log("false");
  }
  else {
    phaser.bypass=true;
    console.log("true");
  }
});

$(compress).click(function(e){
  $(this).toggleClass("border");
  if(compressor.bypass){
    compressor.bypass=false;
    console.log("false");
  }
  else {
    compressor.bypass=true;
    console.log("true");
  }
});

$(convol).click(function(e){
  $(this).toggleClass("border");
  if(convolver.bypass){
    convolver.bypass=false;
    console.log("false");
  }
  else {
    convolver.bypass=true;
    console.log("true");
  }
});

$(over).click(function(e){
  $(this).toggleClass("border");
  if(overdrive.bypass){
    overdrive.bypass=false;
    console.log("false");
  }
  else {
    overdrive.bypass=true;
    console.log("true");
  }
});

$(cab).click(function(e){
  $(this).toggleClass("border");
  if(cabinet.bypass){
    cabinet.bypass=false;
    console.log("false");
  }
  else {
    cabinet.bypass=true;
    console.log("true");
  }
});
