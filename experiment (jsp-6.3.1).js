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
                        <td>(<span style="color:LightSeaGreen;">you</span>, counterpart)</td>
                        <td>Cooperate</td>
                        <td>Not cooperate</td>
                      </tr>
                      <tr>
                        <td><span style="color:LightSeaGreen;">Cooperate</span><br></td>
                        <td><span style="color:LightSeaGreen;">6</span>,6</td>
                        <td><span style="color:LightSeaGreen;">0</span>,10</td>
                      </tr>
                      <tr>
                        <td><span style="color:LightSeaGreen;">Not cooperate</span></td>
                        <td><span style="color:LightSeaGreen;">10</span>,0</td>
                        <td><span style="color:LightSeaGreen;">2</span>,2</td>
                      </tr>
                    </tbody>
                    </table>
                    </div>`;

function emph_cell_payout_table(i,j) {
    var t = `<br><br>
      <div>
      <table class="tg">
      <tbody>
        <tr>
          <td>(<span style="color:LightSeaGreen;">you</span>, counterpart)</td>
          <td>Cooperate</td>
          <td>Not cooperate</td>
        </tr>
        <tr>
          <td><span style="color:LightSeaGreen;">Cooperate</span><br></td>
          <td ${i === "c" & j === "c" ? 'style="background-color:yellow"' : ''}><span style="color:LightSeaGreen;">6</span>,6</td>
          <td ${i === "c" & j === "nc" ? 'style="background-color:yellow"' : ''}><span style="color:LightSeaGreen;">0</span>,10</td>
        </tr>
        <tr>
          <td><span style="color:LightSeaGreen;">Not cooperate</span></td>
          <td ${i === "nc" & j === "c" ? 'style="background-color:yellow"' : ''}><span style="color:LightSeaGreen;">10</span>,0</td>
          <td ${i === "nc" & j === "nc" ? 'style="background-color:yellow"' : ''}><span style="color:LightSeaGreen;">2</span>,2</td>
        </tr>
      </tbody>
      </table>
      </div>`;
    return t;
};

//var computerOptions = ["x", "x", "y", "x", "x", "x", "x", "y", "x", "x", "x", "y", "x", "x", "x"];

/*
var time1 = Math.floor((Math.random() * 10000) + 3000);
var time2 = Math.floor((Math.random() * 10000) + 3000);
var time3 = Math.floor((Math.random() * 10000) + 3000);
*/

var user_choice = {
  type: "html-keyboard-response",
  on_load: function(data) {
    function replaceContentsOfElement(){
      document.getElementById("counterpart_prompt").innerHTML = "Your counterpart has made a choice."
    };
    var counterpart_time = Math.max(0.5*1000, (randomIntFromIntervalExponentialish(1,10, 0.3)*1000));
    jsPsych.data.addProperties({counterpart_time_temp: counterpart_time})
    setTimeout(replaceContentsOfElement, counterpart_time);
    return;
  },
  on_finish: function(data) {
    data.counterpart_time = jsPsych.data.get().select("counterpart_time_temp").values[0];
  },
  stimulus: function () {
    var stim;
    var head = `<header></header>`;
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other = jsPsych.data.get().select("group_other").values[0];
    if (jsPsych.timelineVariable("other_group", true) === "c") {
      stim =
        '<div id="instructions">Choose whether to cooperate (press "x") or not cooperate (press "y") with your counterpart.</div>';
    } else {
      var color =
        jsPsych.timelineVariable("other_group", true) === "ig" ? "blue" : "red";
      stim =
        '<div id="instructions">Choose whether to cooperate (press "x") or not cooperate (press "y") with your counterpart in the <span style="color:' +
        color +
        ';">' +
        group_other +
        "</span> group.</div>";
        head =
          `<header>
          <h1>Your team: <span style="color:blue;">${team}</span></h1>
          <h1>Your counterpart's team: <span style=\"color:${color};">${group_other}</span>
          </h1></header>`
    }
    stim =
      head +
      stim +
      payout_table +
      '<p id="counterpart_prompt"></p>';

      stim = stim + `<div><center>Round ${roundNum + 1}</center></div>`
    return stim;
  },
  choices: ["x", "y"],
};

var computer_choice = {
  type: "html-keyboard-response",
  trial_duration: 20000,
  choices: ["c"],
  stimulus: function () {
    // game logic implemented here
    roundNum++;
    myFuncCalls++;
    var computerChoice;
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other = jsPsych.data.get().select("group_other").values[0];
    //var computerChoice = computerOptions[myFuncCalls]; // want to change this logic to be related to an array of roundnums to betray on
    if (jsPsych.timelineVariable("betray", true) === "t") {
      //computerChoice = [0,2,3,4,6,8,9].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
      computerChoice = [1,3,4,5,7,9,10].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
    } else {
      //computerChoice = [2,6,8,9].includes(roundNum) ? "y" : "x"; // in the no betray condition, we betray on the 7th round? on wednesday we wear pink.
      computerChoice = [3,7,9,10].includes(roundNum) ? "y" : "x"; // in the no betray condition, we betray on the 7th round? on wednesday we wear pink.
    }
    //var userChoice = jsPsych.data.getLastTrialData().select("key_press")
    //  .values[0];
    var userChoice = jsPsych.data.getLastTimelineData().select("response").values[0];
    var stim;
    if (computerChoice === "x") {
      // cooperate
      if (userChoice === "x") {
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
      } else if (userChoice === "y") {
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
      } else {
        stim = `<div> ERROR </div>`
      }
    } else {
      // non-cooperate
      if (userChoice === "x") {
        // comp-coop
        stim =
          '<div id="instructions">The other player chose to not cooperate. You chose to cooperate. You received ' +
          payout_coop_comp[0] +
          " points. They received " +
          payout_coop_comp[1] +
          " points.</div>";
        score_self += payout_coop_comp[0];
        score_other += payout_coop_comp[1];
      } else if (userChoice === "y") {
        //comp-comp
        stim =
          '<div id="instructions">The other player chose to not cooperate. You chose to not cooperate. You received ' +
          payout_comp_comp[0] +
          " points. They received " +
          payout_comp_comp[1] +
          " points.</div>";
        score_self += payout_comp_comp[0];
        score_other += payout_comp_comp[1];
      } else {
        stim = `<div> ERROR </div>`
      }
    }
    var color =
      jsPsych.timelineVariable("other_group", true) === "ig" ? "blue" : "red";

    /*var head =
      jsPsych.timelineVariable("other_group", true) === "c"
        ? ""
        : " Your counterpart's team: <span style=\"color:" +
          color +
          ';">' +
          group_other +
          "</span>";*/
    var head =
      jsPsych.timelineVariable("other_group", true) === "c" ? `<header></header>` :
      `<header>
      <h1>Your team: <span style="color:blue;">${team}</span></h1>
      <h1>Your counterpart's team: <span style=\"color:${color};">${group_other}</span>
      </h1></header>`
    stim =
      head +
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
          <td class="tg-pcvp"><span style="color:LightSeaGreen;">You</span></td>
          <td class="tg-pcvp">Counterpart</td>
        </tr>
        <tr>
          <td class="tg-pcvp"><span style="color:LightSeaGreen;">` + score_self + `</span><br></td>
          <td class="tg-pcvp">` + score_other + `</td>
        </tr>
      </tbody>
      </table>
      ` + `<p>Press "c" to continue.</p>` +
      `<div><center>Round ${roundNum}</center></div>`;

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
  prompt: `<p>Choose which painting (A or B) you prefer the most using the "a" and "b" keys on your keyboard.</p>`,
  choices: ["a", "b"],
  minimum_valid_rt: 1000000,
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
    var kps = jsPsych.data.getLastTimelineData().select("response").values;
    //var count_of_a = jsPsych.data.getLastTimelineData().filter({key_press: 65}).count()
    // this logic needs to be more complicated if want to use randomized image order
    var klee_vote = stims.map(function (x, i) {
      var klee_first = x.indexOf("klee") < x.indexOf("kandinsky");
      var press_a = kps[i] === 'a';
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
      Please be respectful and answer in a timely fashion. If you are idle for more than 1 minute you may be removed from the experiment without full compensation.
      <br><br>Press "c" to continue.</div>`
    );
  },
  choices: ['c']
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
  Press "c" to continue.
  </div>`,
];

var instructions_pd = [
  `<div class = "heading">Instructions</div>
  <div id="instructions">You will be playing with another participant who is connected to the game in another location.
  <br>
  The amount of points you earn will be determined by the decision that you make in combination with the decisions of the other participant.
  <br>
  You will be playing a series of rounds against the same counterpart.</div>` +
  payout_table,
];

var connecting = [
  '<div class="heading">Please wait while we connect you to another player...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];

var waiting = [
  '<div class="heading">Please wait while the other player makes a decision...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];

var waiting2 = [
  '<div class="heading">Please wait while the other players make their decisions...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
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

var instructions_all_block = {
  type: "html-keyboard-response",
  choices: ['c'],
  stimulus: `<div id="instructions">
  In this portion of the experiment, you will be shown several images while interacting with other participants over the Internet, in real time.
  If you have trouble viewing an image, please zoom in or out using your browser (by pressing control/command plus or minus on your keyboard).
  You will <b>NOT</b> be able to return to instructions after continuing. Please read all instructions carefully.
  At any point, you may press "c" to continue, unless another action is required.
  If you are idle for more than 1 minute you may be removed from the experiment without full compensation.
  We trust that you will read questions and respond thoughtfully.
  You may be asked questions during the study to make sure that other participants are reading questions carefully.
  <br>
  Press "c" to continue.
  </div>`,
};

var instructions_all_block1 = {
  type: "html-keyboard-response",
  choices: ['c'],
  stimulus: `<div id="instructions">
  In this portion of the experiment, you will be shown several images while interacting with other participants over the Internet, in real time.
  If you have trouble viewing an image, please zoom in or out using your browser (by pressing control/command plus or minus on your keyboard).
  You will NOT be able to return to previous instructions after continuing. Please read all instructions carefully.
  At any point, you may press "c" to continue, unless another action is required.   <br>
  Press "c" to continue.
  </div>`,
};

var instructions_all_block2 = {
  type: "html-keyboard-response",
  choices: ['c'],
  stimulus: `<div id="instructions">
  During this study you will play games with other individuals located across the US.
  If you are inactive for more than 1 minute you may be removed from the experiment without full compensation.
  We trust that you will read questions and respond thoughtfully.
  Some questions check that participants have read the prompts carefully. They are easy and straightforward.
  While we are confident that you will pay close attention, others may not.
  Participants that fail to answer these questions correctly will not receive full compensation. <br>
  Press "c" to continue.
  </div>`,
};

var instruction_im_block = {
  type: "html-keyboard-response",
  stimulus: instructions_im,
  choices: ['c']
};

var waiting_to_be_paired = {
  type: "html-keyboard-response",
  choices: jsPsych.NO_KEYS,
  stimulus: `Please wait while you are paired with another participant.`,
  trial_duration: 17000
};

var instruction_pd_block = {
  type: "html-keyboard-response",
  choices: ["c"],
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
      '<div id="instructions">You will be playing a game with another participant ' +
      team_statement +
      `who is connected to the game in another location. Please be mindful and respectful of their time.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decisions of the other participant. At the end of the game, each point will be worth $x that you will receive after the experiment.<br>
      You will be playing a series of rounds against the same counterpart.
      <br>
      Press "c" to continue.` +
      "</div>"
    );
  },
};

var instruction_pd_block_intro = {
  type: "html-keyboard-response",
  choices: ["c"],
  stimulus: function () {
    return (
      `<h1>Instructions</h1>
      <div id="instructions">You will shortly be asked to play a game with another participant from your team or the other team
      who is connected to the game in another location. Please be mindful and respectful of their time.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decisions of the other participant.
      After the game, you will be awarded additional compensation according to your performance.<br>
      You will be playing a series of rounds against the same counterpart.
      <br>
      Press "c" to continue.` +
      "</div>"
    );
  },
};

var instruction_pd_block_payout = {
  type: "html-keyboard-response",
  choices: ["c"],
  stimulus: function() {
    stim =
    `<div id="instructions">
    The number of points you and your counterpart will receive for different actions can be read from this table
    (which will be available while playing):</div>` +
    payout_table +
    `<div id="instructions"><br>
    Your actions and earnings are indicated in <span style="color:LightSeaGreen;">green</span> text.
    For example, if you choose to cooperate and your counterpart chooses to cooperate, you both will be awarded 6 points.
    If you choose to cooperate and your counterpart chooses to not cooperate, you will be awarded 0 points and your counterpart will be awarded 10 points.
    <br>
    Neither you, nor your counterpart will be able to see the other's decision until both players have made a choice.
    <br>
    Press "c" to continue.</div>
    `
    return stim
  }
};

var instructions_after_practice = {
  type: "html-keyboard-response",
  choices: ["c"],
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
      '<div id="instructions">Now that you understand the game, you will play with another participant ' +
      team_statement +
      `who is connected to the game in another location. Please be mindful and respectful of their time.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decisions of the other participant.
      After the game, <b>you will be awarded additional compensation according to your performance.</b><br>
      You will be playing a series of rounds against the same counterpart.
      <br>
      Press "c" to begin playing.` +
      "</div>"
    );
  },
  trial_duration: 30000,
};


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};


function random_exponential(rate) {
        var u = Math.random();
        return -Math.log(1.0 - u) / rate;
};

function randomIntFromIntervalExponentialish(min, max, rate) {
  return Math.min(min + random_exponential(rate), max)
};

var waiting_for_other_choice_ = {
  type: "html-keyboard-response",
  stimulus: waiting,
  choices: jsPsych.NO_KEYS,
  trial_duration: function() {
    // difference between response time of the previous frame and a random length of time between 20 and 35 seconds
    var rt = jsPsych.data.getLastTrialData().select("rt").values[0];
    return Math.max(0.5*1000, (randomIntFromIntervalExponentialish(1,10, 0.3)*1000 - rt))
    //return Math.max(0.5*1000, (randomIntFromInterval(1*1000,10*1000) - rt))
  },
};

var waiting_for_other_choice = {
  type: "html-keyboard-response",
  stimulus: waiting,
  choices: jsPsych.NO_KEYS,
  trial_duration: function() {
    // difference between response time of the previous frame and a random length of time between 20 and 35 seconds
    var rt = jsPsych.data.getLastTrialData().select("rt").values[0];
    var counterpart_time = jsPsych.data.getLastTrialData().select("counterpart_time").values[0];
    return Math.max(0,counterpart_time - rt)
    //return Math.max(0.5*1000, (randomIntFromInterval(1*1000,10*1000) - rt))
  },
};

var waiting_for_other_choice_2 = {
  type: "html-keyboard-response",
  stimulus: waiting2,
  choices: jsPsych.NO_KEYS,
  trial_duration: function() {
    // difference between response time of the previous frame and a random length of time between 20 and 35 seconds
    var rt = jsPsych.data.getLastTrialData().select("rt").values[0];
    return Math.max(0.5*1000, (randomIntFromIntervalExponentialish(1,10, 0.3)*1000 - rt))
    //return Math.max(0.5*1000, (randomIntFromInterval(1*1000,10*1000) - rt))
  },
};


var coop_comparison_block = {
  type: "html-keyboard-response",
  stimulus: function() {
    var stim;
    // characterize cooperativeness of counterpart based on experimental condition
    if (jsPsych.data.get().select("betray").values[0] === "t") {
      //stim = "Your counterpart chose to not cooperate more than 75% of all players."
      stim = `The red line shows how often your counterpart cooperated, relative to all other players. Your counterpart was less cooperative than the average player.<br><div class="imgContainer"><img src="` +
      plot_images[0] +
      //`" style="width:1600px !important;height:800px !important;"></div>`
      `" style="width:8in !important;height:4in !important;padding: 5px !important;"></div>`
    } else {
      //stim = "Your counterpart chose to cooperate more than 75% of all players."
      stim = `The red line shows how often your counterpart cooperated, relative to all other players. Your counterpart was more cooperative than the average player.<br><div class="imgContainer"><img src="` +
      plot_images[1] +
      `" style="width:8in !important;height:4in !important;padding: 5px !important;"></div>`
    }
    stim = "<div id='instructions'>In total your score was " +
      score_self +
      ".<br>Your counterpart's score was " +
      score_other +
      ".<br>" + stim +
      '<p>Press "c" to continue.</p>' + "</div>";
      jsPsych.data.addProperties({ score_self: score_self, score_other: score_other});
    return stim
  },
  choices: ['c'],
};


var fruit_prompt = {
  type: 'html-keyboard-response',
  stimulus: `<p>On the next page, please indicate which fruit you enjoy the most of the listed options.</p><p>Press "c" to continue.</p>`,
  choices: ['c'],
  trial_duration: 10000
}

var color_prompt = {
  type: 'html-keyboard-response',
  stimulus: '<p>On the next page, please indicate which color you prefer of the listed options.</p><p>Press "c" to continue.</p>',
  choices: ['c'],
  trial_duration: 10000
}

var flavor_prompt = {
  type: 'html-keyboard-response',
  stimulus: '<p>On the next page, please indicate which flavor you prefer of the listed options.</p><p>Press "c" to continue.</p>',
  choices: ['c'],
  trial_duration: 10000
}

var fruit_selection = {
  type: 'html-button-response',
  stimulus: '',
  choices: ['Apples', 'Bananas', 'Strawberries', 'Grapes'],
  prompt: "<p>Out of the fruits listed, which do you enjoy the most?</p>"
};

var color_selection = {
  type: 'html-button-response',
  stimulus: '',
  choices: ['Blue', 'Green', 'Red', 'Yellow'],
  prompt: "<p>Out of the colors listed, which do you prefer?</p>"
};

var flavor_selection = {
  type: 'html-button-response',
  stimulus: '',
  choices: ['Sweet', 'Salty', 'Sour', 'Spicy', 'Umami'],
  prompt: "<p>Out of the flavors listed, which do you prefer?</p>"
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




var favorite_thing_prompt = {
  type: "html-keyboard-response",
  stimulus: function() {
    //var current_node_id = jsPsych.currentTimelineNodeID();
    //var data_from_current_node = jsPsych.data.getDataByTimelineNode(current_node_id);
    var responses = jsPsych.data.get().last(7).values() //[0].button_pressed;
    var fruit = ['Apples', 'Bananas', 'Strawberries', 'Grapes'][parseInt(responses[1].response)];
    var color = ['Blue', 'Green', 'Red', 'Yellow'][parseInt(responses[3].response)];
    var flavor = ['Sweet', 'Salty', 'Sour', 'Spicy', 'Umami'][parseInt(responses[5].response)];
    jsPsych.data.addProperties({ fruit: fruit, color: color, flavor: flavor });
    var x = `<p>You will be shown a series of bar plots of the things other participants in your group chose.
    Your choice is indicated by the green bar in the plot.</p>
    <p>Press "c" to continue.</p>
    `;
    return x;
  },
  choices: ['c'], //jsPsych.NO_KEYS,
};


var favorite_thing_prompt_fruit = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var x = jsPsych.data.get().first(1).values()[0].fruit;
    return `<img src="https://tholdaway.github.io/homophily-coop/img/${x}.png"
    style="width:4in !important; height:4in !important; padding:0px !important;">`
  },
  choices: ['c'],
  prompt: `<p>The bar plot shows what fruit others in your group chose.
  Your choice is indicated in green.</p>
  <p>Press "c" to continue.</p>`,
}

var favorite_thing_prompt_color = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var x = jsPsych.data.get().first(1).values()[0].color;
    return `<img src="https://tholdaway.github.io/homophily-coop/img/${x}.png"
    style="width:4in !important; height:4in !important; padding:0px !important;">`
  },
  choices: ['c'],
  prompt: `<p>The bar plot shows what color others in your group chose.
  Your choice is indicated in green.</p>
  <p>Press "c" to continue.</p>`,
}

var favorite_thing_prompt_flavor = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var x = jsPsych.data.get().first(1).values()[0].flavor;
    return `<img src="https://tholdaway.github.io/homophily-coop/img/${x}.png"
    style="width:4in !important; height:4in !important; padding:0px !important;">`
  },
  choices: ['c'],
  prompt: `<p>The bar plot shows what flavor others in your group chose.
  Your choice is indicated in green.</p>
  <p>Press "c" to continue.</p>`,
}


var favorite_thing_question = {
  type: 'survey-likert',
  preamble: '<p>Based on the responses of others in your group to the previous questions, would you agree that you are similar to others in your group?</p>',
  questions: [
    {prompt: "", labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"], required: true}
  ]
}


var group_reinforcement_block_ = {
  timeline: [fruit_prompt, fruit_selection, color_prompt, color_selection, flavor_prompt, flavor_selection, waiting_for_other_choice_2, favorite_thing_prompt, favorite_thing_question]
};

var attention_check_block = {
  timeline: [born_before_1920_attention_check],
  on_timeline_finish: function() {
    var attn_check = jsPsych.data.getLastTrialData().select("response").values[0];
    console.log(attn_check);
    jsPsych.data.addProperties({ attention_check_bb1920: attn_check.Q0 });
  }
};

var group_reinforcement_block = {
  timeline: [fruit_prompt, fruit_selection, color_prompt, color_selection,
    flavor_prompt, flavor_selection, waiting_for_other_choice_2,
    favorite_thing_prompt, favorite_thing_prompt_fruit, favorite_thing_prompt_color, favorite_thing_prompt_flavor,
    attention_check_block]
};

var connecting_block = {
  type: "html-keyboard-response",
  stimulus: connecting,
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
};


var practice_choice1 = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var stim = `<div id="instructions">
      Shortly, you will be paired randomly with another participant playing elsewhere.
      First, imagine you are playing the game previously described with another participant.
      <br>
      Please choose whether to cooperate (press "x") or not cooperate (press "y") with your imaginary counterpart.
      <br>
      The table describing the number of points is shown below, for your convenience.
      Please note that this imaginary round will not impact your score, and is just for you to familiarize yourself with the gameplay.
    </div>
    ` + payout_table;
    return stim;
  },
  choices: ["x","y"],
};

var practice_choice2 = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var stim = `<div id="instructions">
      Please imagine once more that you are playing the same game.
      <br>
      Please choose whether to cooperate (press "x") or not cooperate (press "y") with your imaginary counterpart.
      <br>
      The table describing the number of points is shown below, for your convenience.
      Please note that this imaginary round will not impact your score, and is just for you to familiarize yourself with the gameplay.
    </div>
    ` + payout_table;
    return stim;
  },
  choices: ["x","y"],
};

var practice_response1 = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var userChoice = jsPsych.data.getLastTrialData().select("response").values[0] === "x" ? "c" : "nc";
    //console.log(jsPsych.data.getLastTrialData().select("key_press").values[0]);
    //console.log(userChoice);
    var stim = `<div id="instructions">
      You chose to ${userChoice === "c" ? "cooperate" : "not cooperate"} with your imaginary counterpart.
      Suppose that your counterpart chose to cooperate.
      You would receive ${userChoice === "c" ? payout_coop_coop[0] : payout_coop_comp[1]} points,
      and your counterpart would receive ${userChoice === "c" ? payout_coop_coop[1] : payout_coop_comp[0]} points,
      as shown in the table below in the highlighted cell.
    </div>
    ` + emph_cell_payout_table(userChoice, "c") +
    `<p>Press "c" to continue.</p>`;
    return stim;
  },
  choices: ["c"],
};


var practice_response2 = {
  type: 'html-keyboard-response',
  stimulus: function() {
    var userChoice = jsPsych.data.getLastTrialData().select("response").values[0] === "x" ? "c" : "nc";
    //console.log(jsPsych.data.getLastTrialData().select("key_press").values[0]);
    //console.log(userChoice);
    var stim = `<div id="instructions">
      You chose to ${userChoice === "c" ? "cooperate" : "not cooperate"} with your imaginary counterpart.
      Suppose that your counterpart chose to not cooperate.
      You would receive ${userChoice === "c" ? payout_coop_comp[0] : payout_comp_comp[0]} points,
      and your counterpart would receive ${userChoice === "c" ? payout_coop_comp[1] : payout_comp_comp[0]} points,
      as shown in the table below in the highlighted cell.
    </div>
    ` + emph_cell_payout_table(userChoice, "nc") +
    `<p>Press "c" to continue.</p>`;
    return stim;
  },
  choices: ["c"],
};

var practice_round_chunk = {
  timeline: [practice_choice1, practice_response1, practice_choice2, practice_response2],
};


/*
var practice_round_chunk = {
  timeline: [user_choice, waiting_for_other_choice, computer_choice],
  loop_function: function() {
    if (roundNum >= 1) {
      roundNum = 0;
      score_self = 0;
      score_other = 0;
      return false;
    } else {
      return true;
    }
  },
};
*/

var run_chunk = {
  timeline: [user_choice, waiting_for_other_choice, computer_choice],
  loop_function: function () {
    if (roundNum >= 10) {
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

/*
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
*/

var design_factors = {
  //other_group: ["c", "ig", "og"],
  other_group: ["c", "c"],
  betray: ["f", "t"],
};

var full_design = jsPsych.randomization.factorial(design_factors, 1);

var pd_with_variables = {
  timeline: [instruction_pd_block_intro, instruction_pd_block_payout, practice_round_chunk, connecting_block, instructions_after_practice, run_chunk],
  //timeline: [trial],
  timeline_variables: full_design,
  sample: {
    type: "with-replacement",
    size: 1,
  },
};
