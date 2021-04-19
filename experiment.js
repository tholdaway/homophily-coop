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

var payout_table = `<br><br>
                    <div>
                    <table class="tg">
                    <tbody>
                      <tr>
                        <td>(<span style="color:green;">you</span>, counterpart)</td>
                        <td>Cooperate</td>
                        <td>Not cooperate</td>
                      </tr>
                      <tr>
                        <td><span style="color:green;">Cooperate</span><br></td>
                        <td><span style="color:green;">6</span>,6</td>
                        <td><span style="color:green;">0</span>,10</td>
                      </tr>
                      <tr>
                        <td><span style="color:green;">Not cooperate</span></td>
                        <td><span style="color:green;">10</span>,0</td>
                        <td><span style="color:green;">2</span>,2</td>
                      </tr>
                    </tbody>
                    </table>
                    </div>`;
//var computerOptions = ["x", "x", "y", "x", "x", "x", "x", "y", "x", "x", "x", "y", "x", "x", "x"];

/*
var time1 = Math.floor((Math.random() * 10000) + 3000);
var time2 = Math.floor((Math.random() * 10000) + 3000);
var time3 = Math.floor((Math.random() * 10000) + 3000);
*/

var user_choice = {
  type: "html-keyboard-response",
  stimulus: function () {
    var stim;
    var head = "";
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other = jsPsych.data.get().select("group_other").values[0];
    if (jsPsych.timelineVariable("other_group", true) === "c") {
      stim =
        '<div id="instructions">Choose whether to cooperate (press x) or not cooperate (press y) with your counterpart.</div>';
    } else {
      var color =
        jsPsych.timelineVariable("other_group", true) === "ig" ? "blue" : "red";
      stim =
        '<div id="instructions">Choose whether to cooperate (press x) or not cooperate (press y) with your counterpart in the <span style="color:' +
        color +
        ';">' +
        group_other +
        "</span> group.</div>";
      head =
        " Your counterpart's team: <span style=\"color:" +
        color +
        ';">' +
        group_other +
        "</span>";
    }
    stim =
      '<header><h1>Your team: <span style="color:blue;">' +
      team +
      "</span></h1><h1>" +
      head +
      "</h1></header>" +
      stim +
      payout_table;
    return stim;
  },
  choices: ["x", "y"],
};

var computer_choice = {
  type: "html-keyboard-response",
  trial_duration: 10000,
  stimulus: function () {
    // game logic implemented here
    roundNum++;
    myFuncCalls++;
    var computerChoice;
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other = jsPsych.data.get().select("group_other").values[0];
    //var computerChoice = computerOptions[myFuncCalls]; // want to change this logic to be related to an array of roundnums to betray on
    if (jsPsych.timelineVariable("betray", true) === "t") {
      computerChoice = [1,3,4,7,9,10].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
    } else {
      computerChoice = [3,7,9,10].includes(roundNum) ? "y" : "x"; // in the no betray condition, we betray on the 7th round? on wednesday we wear pink.
    }
    //var userChoice = jsPsych.data.getLastTrialData().select("key_press")
    //  .values[0];
    var userChoice = jsPsych.data.getLastTimelineData().select("key_press").values[0];
    var stim;
    if (computerChoice === "x") {
      // cooperate
      if (userChoice === 88) {
        // code for "x"
        // coop-coop
        stim =
          '<div id="instructions">The other player chose to cooperate. You chose to cooperate. You received ' +
          payout_coop_coop[0] +
          " points. They received " +
          payout_coop_coop[1] +
          " points.</div>";
        score_self += payout_coop_coop[0];
        score_other += payout_coop_coop[1];
      } else {
        // coop-comp

        stim =
          '<div id="instructions">The other player chose to cooperate. You chose to not cooperate. You received ' +
          payout_coop_comp[1] +
          " points. They received " +
          payout_coop_comp[0] +
          " points.</div>";
        //stim = 'kp'+userChoice.values[0]
        score_self += payout_coop_comp[1];
        score_other += payout_coop_comp[0];
      }
    } else {
      // non-cooperate
      if (userChoice === 88) {
        // comp-coop
        stim =
          '<div id="instructions">The other player chose to not cooperate. You chose to cooperate. You received ' +
          payout_coop_comp[0] +
          " points. They received " +
          payout_coop_comp[1] +
          " points.</div>";
        score_self += payout_coop_comp[0];
        score_other += payout_coop_comp[1];
      } else {
        //comp-comp
        stim =
          '<div id="instructions">The other player chose to not cooperate. You chose to not cooperate. You received ' +
          payout_comp_comp[0] +
          " points. They received " +
          payout_comp_comp[1] +
          " points.</div>";
        score_self += payout_comp_comp[0];
        score_other += payout_comp_comp[1];
      }
    }
    var color =
      jsPsych.timelineVariable("other_group", true) === "ig" ? "blue" : "red";

    var head =
      jsPsych.timelineVariable("other_group", true) === "c"
        ? ""
        : " Your counterpart's team: <span style=\"color:" +
          color +
          ';">' +
          group_other +
          "</span>";
    stim =
      '<header><h1>Your team: <span style="color:blue;">' +
      team +
      "</span></h1><h1>" +
      head +
      "</h1></header>" +
      stim;
    stim =
      stim +
      `
      <table class="tg">
      <thead>
        <tr>
          <th class="tg-baqh" colspan="2">Total Score<br></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tg-pcvp"><span style="color:green;">You</span></td>
          <td class="tg-pcvp">Counterpart</td>
        </tr>
        <tr>
          <td class="tg-pcvp"><span style="color:green;">` + score_self + `</span><br></td>
          <td class="tg-pcvp">` + score_other + `</td>
        </tr>
      </tbody>
      </table>
      `
    return stim;
  },
};

// create a list of all images so we can tell jsPsych to
// preload them for speed (see jsPsych.init below)
var klees = [
  "img/klee1.jpg",
  "img/klee2.jpg",
  "img/klee3.jpg",
  "img/klee4.jpg",
  "img/klee5.jpg",
].map(x => "https://tholdaway.github.io/homophily-coop/" + x);
var kandinskys = [
  "img/kandinsky1.jpg",
  "img/kandinsky2.jpg",
  "img/kandinsky3.jpg",
  "img/kandinsky4.jpg",
  "img/kandinsky5.jpg",
].map(x => "https://tholdaway.github.io/homophily-coop/" + x);
var all_images = klees.concat(kandinskys);

var plot_images = [
  "img/participation_plot_low.png",
  "img/participation_plot_high.png"
].map(x => "https://tholdaway.github.io/homophily-coop/" + x);

var images_zip = klees.map(function (k, i) {
  return {
    image1: k,
    image2: kandinskys[i],
  };
});

// add all of the relevant variables to the data field so they
// will appear in the results
var trial = {
  type: "html-keyboard-response",
  prompt: "<p>Choose image A or B using the keyboard.</p>",
  choices: ["a", "b"],
  stimulus: function () {
    // note: the outer parentheses are only here so we can break the line
    var ims = [
      jsPsych.timelineVariable("image1", true),
      jsPsych.timelineVariable("image2", true),
    ];
    ims = jsPsych.randomization.shuffle(ims);
    return '<div class="imgContainer"><img src="' + ims[0] + '"><p>A</p></div>' + '<div class="imgContainer"><img src="' + ims[1] + '"><p>B</p></div>';
  },
  data: {
    image1: jsPsych.timelineVariable("image1"),
    image2: jsPsych.timelineVariable("image2"),
  },
};

var trials_with_variables = {
  timeline: [trial],
  timeline_variables: images_zip,
};

var group_assignment = {
  type: "html-keyboard-response",
  stimulus: function () {
    // numeric key code for letter a: 65, b: 66
    var stims = jsPsych.data.getLastTimelineData().select("stimulus").values;
    var kps = jsPsych.data.getLastTimelineData().select("key_press").values;
    //var count_of_a = jsPsych.data.getLastTimelineData().filter({key_press: 65}).count()
    // this logic needs to be more complicated if want to use randomized image order
    var klee_vote = stims.map(function (x, i) {
      var klee_first = x.indexOf("klee") < x.indexOf("kandinsky");
      var press_a = kps[i] === 65;
      return (klee_first && press_a) || (!klee_first && !press_a);
    });
    var count_of_klee_votes = klee_vote.reduce(function (a, b) {
      return a + b;
    });
    var team = count_of_klee_votes > 2 ? "Klee" : "Kandinsky";
    var other_team = team === "Klee" ? "Kandinsky" : "Klee";
    jsPsych.data.addProperties({ group_assignment: team });
    return (
      `<div id="instructions">Your group:
      <span style="color:blue;">${team}</span>
      <br><br>
      There are 42 people in the <span style="color:blue;">${team}</span> group,
      and 41 people in the <span style="color:red;">${other_team}</span> group.
      <br><br>From this point on, you will be interacting with other real people.
      Please be respectful and answer in a timely fashion.
      <br><br>Press any key to continue.</div>`
    );
  },
};

var real_player_prompt = [
  `<div id="instructions">From this point on, you will be interacting with other real people.
  Please </div>`
];

var consent = [
  '<div id="instructions">You are invited to participate in a research study about collaboration/teamwork/trade/game theory (?).<br><br>If you agree to be part of the research study, you will be asked to fill in a survey, play a game, and answer a few questions about your experience playing. Participating in the research would not inflict any discomforts or put you at risk. At the completion of your participation you will receive $X. Participating in this study is completely voluntary.  Even if you decide to participate now, you may change your mind and stop at any time. You may choose not to answer survey question, continue with the game, or the follow-up questions for any reason. As part of the research, we may mislead you or we may not tell you everything about the purpose of the research or research procedures.  At the conclusion of the study, we will provide you with that information.<br><br>All information is deidentified, the researchers will not gain access to your identity or information that would enable them to identify you. Information collected in this project may be shared with other researchers, but we will not share any information that could identify you.<br><br>Press any key to agree, or close the window to exit.</div>',
];

var instructions_im = [
  `<div id="instructions">
  You will be shown several pairs of paintings.
  Please select the painting of each pair that you like the most using the "a" and "b" keys.
  <br>
  Press any key to continue.
  </div>`,
];

var instructions_pd = [
  `<div class = "heading">Instructions</div>
  <div id="instructions">You will be playing with another participant who is connected to the game in another location.
  <br>
  The amount of points you earn will be determined by the decision that you make in combination with the decision of the other participant.
  <br>
  You will be playing a series of rounds.</div>` +
  payout_table,
];

var connecting = [
  '<div class="heading">Please wait while we connect you to another player...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];

var waiting = [
  '<div class="heading">Please wait while the other player makes a decision...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];

var debrief = [
  "<div class=questions><p>End of game<br><br>Please wait for further instructions from the experimenter</p></div>",
];

// Define experiment blocks

var consent = {
  type: "html-keyboard-response",
  stimulus: consent,
  //trial_duration: 8000
};

var instruction_im_block = {
  type: "html-keyboard-response",
  stimulus: instructions_im,
  trial_duration: 20000,
};

var instruction_pd_block = {
  type: "html-keyboard-response",
  choices: ["y"],
  stimulus: function () {
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other;
    var team_statement;
    if (jsPsych.timelineVariable("other_group", true) === "ig") {
      group_other = team;
      team_statement =
        'in the <span style="color:blue;">' +
        group_other +
        '</span> group (you are in the <span style="color:blue;">' +
        team +
        "</span> group) ";
    } else if (jsPsych.timelineVariable("other_group", true) === "og") {
      group_other = team === "Klee" ? "Kandinsky" : "Klee";
      team_statement =
        'in the <span style="color:red;">' +
        group_other +
        '</span> group (you are in the <span style="color:blue;">' +
        team +
        "</span> group) ";
    } else {
      // control group
      group_other = "";
      team_statement = "";
    }
    jsPsych.data.addProperties({
      betray: jsPsych.timelineVariable("betray", true),
    });
    jsPsych.data.addProperties({
      other_type: jsPsych.timelineVariable("other_group", true),
    });
    jsPsych.data.addProperties({ group_other: group_other });
    return (
      '<h1>Instructions</h1>' +
      '<div id="instructions">You will be playing with another participant ' +
      team_statement +
      `who is connected to the game in another location.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decision of the other participant.<br>
      You will be playing a series of rounds.
      <br>
      Press "y" to continue.` +
      "</div>"
    );
  },
};

var instruction_pd_block_payout = {
  type: "html-keyboard-response",
  choices: ["y"],
  stimulus: function() {
    stim =
    `<div id="instructions">
    The number of points you will receive for different actions can be read from this table
    (which will be available while playing):</div>` +
    payout_table +
    `<div id="instructions"><br>
    Your actions and earnings are indicated in <span style="color:green;">green</span> text.
    For example, if you choose to cooperate and your counterpart chooses to cooperate, you both will be awarded 6 points.
    If you choose to cooperate and your counterpart chooses to not cooperate, you will be awarded 0 points and your counterpart will be awarded 10 points.
    <br>
    Press "y" to begin playing.</div>
    `
    return stim
  }
}
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function random_exponential(rate) {
        var u = Math.random();
        return -Math.log(1.0 - u) / rate;
}

function randomIntFromIntervalExponentialish(min, max, rate) {
  return Math.min(min + random_exponential(rate), max)
}

var waiting_for_other_choice = {
  type: "html-keyboard-response",
  stimulus: waiting,
  choices: jsPsych.NO_KEYS,
  trial_duration: function() {
    // difference between response time of the previous frame and a random length of time between 20 and 35 seconds
    var rt = jsPsych.data.getLastTrialData().select("rt").values[0];
    return Math.max(0.5*1000, (randomIntFromIntervalExponentialish(1,10, 0.3)*1000 - rt))
    //return Math.max(0.5*1000, (randomIntFromInterval(1*1000,10*1000) - rt))
  },
}

var coop_comparison_block = {
  type: "html-keyboard-response",
  stimulus: function() {
    var stim;
    // characterize cooperativeness of counterpart based on experimental condition
    if (jsPsych.data.get().select("betray").values[0] === "t") {
      //stim = "Your counterpart chose to not cooperate more than 75% of all players."
      stim = `The red line shows how often your counterpart cooperated, relative to all other players.<br><div class="imgContainer"><img src="` + plot_images[0] + `"></div>`
    } else {
      //stim = "Your counterpart chose to cooperate more than 75% of all players."
      stim = `The red line shows how often your counterpart cooperated, relative to all other players.<br><div class="imgContainer"><img src="` + plot_images[1] + `"></div>`
    }
    stim = "<div id='instructions'>In total your score was " + score_self + ".<br>Your counterpart's score was " + score_other + ".<br>" + stim + "</div>";
    return stim
  },
  choices: jsPsych.NO_KEYS,
  trial_duration: 30000,
};

var fruit_selection = {
  type: 'html-button-response',
  stimulus: '',
  choices: ['Apples', 'Bananas', 'Strawberries', 'Grapes'],
  prompt: "<p>Out of the fruits listed, which do you enjoy the most?</p>"
};


var fruit_prompt = {
  type: "html-keyboard-response",
  stimulus: function() {
    //var current_node_id = jsPsych.currentTimelineNodeID();
    //var data_from_current_node = jsPsych.data.getDataByTimelineNode(current_node_id);
    var responses = jsPsych.data.get().last(2).values()[0].button_pressed;
    console.log(responses);
    var fruit = ['Apples', 'Bananas', 'Strawberries', 'Grapes'][parseInt(responses)].toLowerCase();
    return `<p>You said that you preferred ${fruit}.
    Several other people in your group also said they prefer ${fruit}.</p>
    <br>
    <p>Press "y" to continue.</p>`;
  },
  choices: ['y'], //jsPsych.NO_KEYS,
  trial_duration: 10000,
};

var favorite_thing_selection = {
  type: 'survey-multi-choice',
  questions: [
    {prompt: "Out of the fruits listed, which do you enjoy the most?",
      name: 'Fruits',
      options: ['Apples', 'Bananas', 'Strawberries', 'Grapes'],
      required:true},
    {prompt: "Out of the colors listed, which do you prefer?",
      name: 'Colors',
      options: ['Blue', 'Green', 'Red', 'Yellow'],
      required: true},
    {prompt: "Out of the flavors listed, which do you prefer?",
      name: 'Flavors',
      options: ['Sweet', 'Salty', 'Sour', 'Bitter', 'Umami'],
      required: true},
  ],
  button_label: 'Next',
};

var favorite_thing_prompt = {
  type: "html-keyboard-response",
  stimulus: function() {
    //var current_node_id = jsPsych.currentTimelineNodeID();
    //var data_from_current_node = jsPsych.data.getDataByTimelineNode(current_node_id);
    var responses = JSON.parse(jsPsych.data.get().last(2).values()[0]['responses']);
    console.log(responses);
    console.log(responses['Fruits']);
    `    <div class="row">
          <div class="column">
            <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Fruits']}.png" class="image_things">
          </div>
          <div class="column">
            <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Colors']}.png" class="image_things">
          </div>
          <div class="column">
            <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Flavors']}.png" class="image_things">
          </div>
        </div>`
    var x = `<p>Many other people in your group chose similar responses. The bar plots below show what others in your group chose.
    Your choice is indicated in green.</p>
    <br>
    <div>
      <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Fruits']}.png" class="image_things">
      <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Colors']}.png" class="image_things">
      <img src="https://tholdaway.github.io/homophily-coop/img/${responses['Flavors']}.png" class="image_things">
    </div>
    <p>Press "y" to continue.</p>`;
    return x;
  },
  choices: ['y'], //jsPsych.NO_KEYS,
  trial_duration: 30000,
};

var group_reinforcement_block_ = {
  timeline: [favorite_thing_selection, waiting_for_other_choice, favorite_thing_prompt]
};

var group_reinforcement_block = {
  timeline: [favorite_thing_selection, waiting_for_other_choice]
};

var connecting_block = {
  type: "html-keyboard-response",
  stimulus: connecting,
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
};


var run_chunk = {
  timeline: [user_choice, waiting_for_other_choice, computer_choice],
  loop_function: function () {
    if (roundNum > 10) {
      return false;
    } else {
      return true;
    }
  },
};


var debrief_block = {
  type: "html-keyboard-response",
  stimulus: [debrief],
};

var trial = {
  type: "html-keyboard-response",
  stimulus: function () {
    console.log(jsPsych.data.get().select("rt").count());
    console.log(jsPsych.data.get().select("group_assignment").values[0]);
    console.log(jsPsych.data.get().select("rt").values);
    console.log(jsPsych.timelineVariable("betray", true));
    return jsPsych.data.get().select("group_assignment").values[0];
  },
};

var design_factors = {
  other_group: ["c", "ig", "og"],
  betray: ["f", "t"],
};

var full_design = jsPsych.randomization.factorial(design_factors, 1);

var pd_with_variables = {
  timeline: [connecting_block, instruction_pd_block, instruction_pd_block_payout, run_chunk],
  //timeline: [trial],
  timeline_variables: full_design,
  sample: {
    type: "with-replacement",
    size: 1,
  },
};
