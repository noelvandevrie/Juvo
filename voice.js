var langs = [['English',['en-US', 'United States']],['Nederlands',['nl-NL']]];
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function() {
    recognizing = true;
    start_img.src = 'mic-animate.gif';
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = final_transcript;
    final_span.innerHTML = final_transcript;
    final_span.innerHTML = interim_transcript;

    if(final_transcript === 'winkelwagen') {
      goToCart()
    } else if(final_transcript === 'zoeken') {
      goToSearch()
    } else if(final_transcript === 'bestellen') {
      goToOrder()
    } else if(final_transcript === 'leeg winkelwagen') {
      clearCart()
    } else if(final_transcript === 'log uit') {
      logout()
    } else {
      searchProduct(final_transcript)
    }
  };
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'nl-NL';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  start_timestamp = event.timeStamp;
}