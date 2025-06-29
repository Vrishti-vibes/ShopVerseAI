let recognition;
let isListening = false;

function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.onend = () => {
    if (typeof callback === 'function') callback();
  };
  window.speechSynthesis.speak(utterance);
}

function initRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const liveResponse = document.getElementById('live-response');

  recognition.onstart = () => {
    isListening = true;
    liveResponse.textContent = "🎤 Listening... Please speak now.";
  };

  recognition.onresult = (event) => {
    isListening = false;
    const userCommand = event.results[0][0].transcript;
    liveResponse.textContent = `🗣️ You said: "${userCommand}"`;
    speak(`You said: ${userCommand}`);
    handleCommand(userCommand.toLowerCase());
  };

  recognition.onerror = (event) => {
    isListening = false;
    console.error("Speech Recognition Error:", event.error);
    liveResponse.textContent = `⚠️ Error: ${event.error}`;

    if (event.error === "no-speech") {
      speak("I didn't hear anything. Please try again.");
    } else if (event.error === "audio-capture") {
      speak("I couldn't access your microphone.");
    } else {
      speak("Something went wrong. Please try again.");
    }
  };

  recognition.onend = () => {
    isListening = false;
  };
}

function startAssistant() {
  const liveResponse = document.getElementById('live-response');

  if (!('webkitSpeechRecognition' in window)) {
    liveResponse.textContent = "❌ Speech recognition not supported.";
    speak("Speech recognition is not supported in this browser.");
    return;
  }

  if (isListening) return; // Prevent double triggering
  if (!recognition) initRecognition();

  liveResponse.textContent = "🧠 Preparing to listen...";
  speak("I'm listening. Please say your command.", () => {
    recognition.start();
  });
}
window.startAssistant = startAssistant;

function handleCommand(command) {
  if (command.includes("cart")) {
    speak("Opening your shopping cart.", () => {
      window.location.href = "cart.html";
    });
  } else if (command.includes("order")) {
    speak("Tracking your order.", () => {
      window.location.href = "tracking.html";
    });
  } else if (command.includes("logout")) {
    speak("Logging you out.", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  } else {
    speak("Sorry, I didn't understand that. Try again.");
  }
}
