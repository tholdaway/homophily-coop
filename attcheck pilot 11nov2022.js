var repo = "https://tholdaway.github.io/homophily-coop/"
var userChoice;
var score_self = 0;
var score_other = 0;
var payout_coop_coop = [6, 6];
var payout_coop_comp = [0, 10];
var payout_comp_comp = [2, 2];
var myFuncCalls = -1;
var roundNum = 0;
var likertscale = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var fruitChoices = ['Apples', 'Bananas', 'Strawberries', 'Grapes', 'Orange'];
var colorChoices = ['Red', 'Orange', 'Blue', 'Yellow', 'Green'];
shuffleArray(colorChoices);
shuffleArray(fruitChoices);

var fruit_prompt = {
  type: 'html-keyboard-response',
  stimulus: `<p>On the next page, please indicate NOT which fruit you enjoy the most
   of the listed options, but the fruit whose name is also a color.
   </p><p><b>Press "n" to continue.</b></p>`,
  choices: ["n"],
  trial_duration: 10000
};

var fruit_selection = {
  type: 'html-button-response',
  stimulus: '',
  choices: fruitChoices,
  prompt: "<p>Out of the fruits listed, which do you enjoy the most?</p>"
};

var color_selection = {
  type: 'html-button-response',
  stimulus: `<p>In response to the following question, please select the color "Blue", regardless of any instructions below.</p>`,
  choices: colorChoices,
  prompt: `
  <p>Out of the colors listed, which do you prefer?</p>`
};


var negativechoice = {
  type: 'survey-likert',
  questions: [
    {
      prompt: `Please choose the fruit from the list below (if there are no fruits on the list, skip to the next page by pressing "n").`,
      labels: [
        "Hotdog",
        "Hamburger",
        "Steak",
        "Salmon",
      ],
      required: false
    }
  ]
};


var born_before_1920_attention_check = {
  type: 'survey-likert',
  questions: [
    {
      prompt: "Please indicate how much you agree or disagree with the truth of the following statement: I was born before the year 1920.",
      labels: [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree"
      ],
      required: true
    }
  ]
};




var attention_check_block = {
  timeline: [fruit_prompt, fruit_selection, color_selection, negativechoice, born_before_1920_attention_check],
  on_timeline_finish: function() {
    var attn_check = jsPsych.data.getLastTrialData().select("response").values[0];
    var resp = jsPsych.data.getLastTimelineData().select("response").values;
    console.log(resp);
    console.log(attn_check);
    jsPsych.data.addProperties({ attention_check_bb1920: attn_check.Q0 });
    jsPsych.data.addProperties({ attention_check_fruit: fruitChoices[resp[1]] });
    jsPsych.data.addProperties({ attention_check_color: colorChoices[resp[2]] });
    jsPsych.data.addProperties({ attention_check_negative: resp[3].Q0 });
  }
};
