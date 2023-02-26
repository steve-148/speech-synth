// define the spelling words
const spellings = {
  Autumn1: {
    Week1: {
      1: "equipment",
      2: "nuisance",
      3: "privilege",
      4: "embarrass",
      5: "environment",
      6: "temperature",
      7: "variety",
      8: "forty",
      9: "leisure",
      10: "definitely",
    },
    Week2: {
      1: "restaurant",
      2: "thorough",
      3: "soldier",
      4: "stomach",
      5: "vegetable",
      6: "vehicle",
      7: "yacht",
      8: "bruise",
      9: "dictionary",
      10: "government",
    },
    Week3: {
      1: "Wednesday",
      2: "February",
      3: "interest",
      4: "different",
      5: "parliament",
      6: "secretary",
      7: "sufficient",
      8: "immediate",
      9: "appreciate",
      10: "amateur",
    },
    Week5: {
      1: "sufficient",
      2: "opportunity",
      3: "attached",
      4: "accommodate",
      5: "aggressive",
      6: "appreciate",
      7: "committee",
      8: "embarrass",
      9: "harass",
      10: "accompany",
    },
    Week6: {
      1: "column",
      2: "solemn",
      3: "autumn",
      4: "foreign",
      5: "crescent",
      6: "spaghetti",
      7: "reign",
      8: "fascinating",
      9: "whistle",
      10: "thistle",
    },
  },
  Autumn2: {
    Week1: {
      1: "refer",
      2: "referring",
      3: "referral",
      4: "referee",
      5: "offering",
      6: "preference",
      7: "difference",
      8: "transferring",
      9: "inference",
      10: "inferred",
    },
    Week2: {
      1: "cashier",
      2: "relieved",
      3: "achieve",
      4: "deceit",
      5: "receipt",
      6: "receive",
      7: "conceit",
      8: "believe",
      9: "shriek",
      10: "ceiling",
    },
    Week3: {
      1: "policies",
      2: "perceive",
      3: "inconceivable",
      4: "efficient",
      5: "conscience",
      6: "chief",
      7: "ancient",
      8: "glacier",
      9: "concierge",
      10: "yield",
    },
    Week4: {
      1: "definite",
      2: "neighbour",
      3: "muscle",
      4: "relevant",
      5: "stomach",
      6: "awkward",
      7: "correspond",
      8: "pronunciation",
      9: "protein",
      10: "caffeine",
    },
    Week5: {
      1: "friendliest",
      2: "prettiest",
      3: "sincerest",
      4: "naughtiest",
      5: "strangest",
      6: "earliest",
      7: "lonelier",
      8: "greatest",
      9: "driest",
      10: "nastier",
    },
    Week6: {
      1: "wearily",
      2: "eventually",
      3: "gradually",
      4: "accidentally",
      5: "automatically",
      6: "frantically",
      7: "usually",
      8: "energetically",
      9: "dramatically",
      10: "occasionally",
    },
    Week7: {
      1: "lightning",
      2: "equip",
      3: "equipped",
      4: "equipment",
      5: "mischievous",
      6: "immediate",
      7: "immediately",
      8: "disastrous",
      9: "prejudice",
      10: "physical",
    },
  },
};

// initiate the synth
const synth = window.speechSynthesis;

// grab the UI elements
const termSelect = document.querySelector("#term");
const weekSelect = document.querySelector("#week");
const startButton = document.querySelector("#start");
startButton.disabled = false;
let started = false;
const stopButton = document.querySelector("#stop");
stopButton.disabled = true;
let stopped = false;
const pauseButton = document.querySelector("#pause");
pauseButton.disabled = true;
let paused = false;
const resumeButton = document.querySelector("#resume");
resumeButton.disabled = true;
let resumed = false;

// get the delay and display value
const delay = document.querySelector("#delay");
const delayValue = document.querySelector(".delay-value");
delayValue.textContent = delay.value === "1" ? `${delay.value} second` : `${delay.value} seconds`;
// display the changed value
delay.onchange = function () {
  delayValue.textContent = delay.value === "1" ? `${delay.value} second` : `${delay.value} seconds`;
};

// not sure what this is for
const spellingsModal = new bootstrap.Modal(document.querySelector("#spellings-modal"));

// school terms
const terms = Object.keys(spellings);

// create the select term options
terms.forEach((term) => {
  const option = document.createElement("option");
  option.textContent = `${term}`;
  termSelect.appendChild(option);
});

// school weeks
const weeks = Object.keys(spellings[termSelect.value]);

// create the select week options
const option = document.createElement("option");
option.textContent = "All";
weekSelect.appendChild(option);
weeks.forEach((week) => {
  const option = document.createElement("option");
  option.textContent = `${week}`;
  weekSelect.appendChild(option);
});

// repopulate the select week options when term changed
termSelect.addEventListener("change", () => {
  while (weekSelect.firstChild) {
    weekSelect.removeChild(weekSelect.firstChild);
  }
  const option = document.createElement("option");
  option.textContent = "All";
  weekSelect.appendChild(option);
  const weeks = Object.keys(spellings[termSelect.value]);
  weeks.forEach((week) => {
    const option = document.createElement("option");
    option.textContent = `${week}`;
    weekSelect.appendChild(option);
  });
});

// get the voices and select one
const voices = synth.getVoices();
const GBvoice = voices.filter((voice) => {
  return voice.lang == "en-GB";
});

// listen to the stop button
stopButton.addEventListener("click", () => {
  startButton.disabled = false;
  stopButton.disabled = true;
  pauseButton.disabled = true;
  resumeButton.disabled = true;

  stopped = true;
  started = false;
  paused = false;
  resumed = false;

  remainingWords = [];

  console.log(`Stopped: ${stopped}`);
});

// listen to the pause button
pauseButton.addEventListener("click", () => {
  startButton.disabled = false;
  stopButton.disabled = false;
  pauseButton.disabled = true;
  resumeButton.disabled = false;

  paused = true;
  resumed = false;
  started = false;
  stopped = false;

  console.log(`Paused: ${paused}`);
});

// speak a single word
async function speakWord(word) {
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.voice = GBvoice[1];
  utterThis.pitch = 1;
  utterThis.rate = 1;
  synth.speak(utterThis);
}

// define delay function
const addDelay = (t, data) => {
  return new Promise((resolve) => {
    setTimeout(resolve.bind(null, data), t);
  });
};

// define slice function
async function sliceWords(wordArray) {
  return wordArray.slice(1);
}

var remainingWords = [];

// problem - when start button is pressed during timeout, get two instances of synth
startButton.onclick = async function () {
  if (started || resumed) {
    return;
  }

  console.log("start clicked");

  startButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;
  resumeButton.disabled = true;

  started = true;
  stopped = false;
  paused = false;
  resumed = false;

  let words = [];
  if (weekSelect.value == "All") {
    for (const week in spellings[termSelect.value]) {
      for (const key in spellings[termSelect.value][week]) {
        words.push(spellings[termSelect.value][week][key]);
      }
    }
  } else {
    for (const key in spellings[termSelect.value][weekSelect.value]) {
      words.push(spellings[termSelect.value][weekSelect.value][key]);
    }
  }

  remainingWords = words;

  for (let word of words) {
    console.log(remainingWords);

    await speakWord(word)
      .then(await addDelay.bind(null, 1000 * delay.value))
      .then((remainingWords = await sliceWords(remainingWords)));

    if (stopped || paused) {
      break;
    }
  }
};

// problem - when resume button is pressed during timeout, get two instances of synth
resumeButton.onclick = async function () {
  if (stopped || started || resumed || remainingWords.length === 0) {
    console.log("resume returned", stopped, started, !paused, resumed, remainingWords.length);
    return;
  }
  console.log("resume clicked");

  startButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;
  resumeButton.disabled = true;

  started = false;
  stopped = false;
  paused = false;
  resumed = true;

  for (let word of remainingWords) {
    console.log(remainingWords);

    await speakWord(word)
      .then(await addDelay.bind(null, 1000 * delay.value))
      .then((remainingWords = await sliceWords(remainingWords)));

    if (stopped || paused) {
      break;
    }
  }
};
