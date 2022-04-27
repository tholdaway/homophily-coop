// INCOMPLETE
// needs jspsych 6.3.1
var repo = "https://tholdaway.github.io/homophily-coop/"
var userChoice;
var score_self = 0;
var score_other = 0;
// self and other payouts
var payout_coop_coop = [6, 6];
var payout_coop_comp = [0, 10];
var payout_comp_comp = [2, 2];
var roundNum = 0;


// payout table image
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
    // payout table with one cell emphasized (used in practice round)
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


var user_choice = {
  // logic and display for use choice slide, based on experimental condition
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
    data.phase = 'user_choice';
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
  // logic and display for counterpart choice slide, based on experimental
  // condition and use choice
  type: "html-keyboard-response",
  trial_duration: 20000,
  choices: ["c"],
  stimulus: function () {
    // game logic implemented here
    roundNum++;
    var computerChoice;
    var team = jsPsych.data.get().select("group_assignment").values[0];
    var group_other = jsPsych.data.get().select("group_other").values[0];
    if (jsPsych.timelineVariable("betray", true) === "t") {
      //computerChoice = [0,2,3,4,6,8,9].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
      computerChoice = [2,3,5,6,7,9,10].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
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


var plot_images = [
  "img/participation_plot_low.png",
  "img/participation_plot_high.png"
].map(x => "https://tholdaway.github.io/homophily-coop/" + x);


var group_assignment = {
  // group details
  // need to modify this for political affil/leaning
  type: "html-keyboard-response",
  stimulus: function () {
    // numeric key code for letter a: 65, b: 66
    var team = political_affiliation.toLowerCase();  // TO DO: global variable from qualtrics stuff that has the political affiliation value (or a recoding of it)
    var other_team = team === "left" ? "right" : "left";
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
      /*`
      <div id="instructions">
      You will now play a series of games with other participants in different locations.
      </div>
      `*/
    );
  },
  choices: ['c']
};



var connecting = [
  // connecting message prior to being "paired"
  '<div class="heading">Please wait while we connect you to another player...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];

var waiting = [
  // waiting message between PD rounds
  '<div class="heading">Please wait while the other player makes a decision...</div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
];



// Define experiment blocks




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


var instruction_pd_block_intro = {
  // introduces PD game
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
  // describes payout of PD game
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
  // final instructions for PD game prior to actually playing. happens after the practice rounds
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

function random_exponential(rate) {
  // used for setting the counterpart time in PD
  var u = Math.random();
  return -Math.log(1.0 - u) / rate;
};

function randomIntFromIntervalExponentialish(min, max, rate) {
  // used for setting the counterpart time in PD
  return Math.min(min + random_exponential(rate), max)
};


var waiting_for_other_choice = {
  // used in the playing of PD, waits a random amount of time (based on counterpart_time), simulating the other person's choice
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



var coop_comparison_block = {
  // how cooperative was your counterpart compared to everyone else
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




var born_before_1920_attention_check = {
  // likert attention check, born before 1920?
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
  // attention check block
  timeline: [born_before_1920_attention_check],
  on_timeline_finish: function() {
    var attn_check = jsPsych.data.getLastTrialData().select("response").values[0];
    console.log(attn_check);
    jsPsych.data.addProperties({ attention_check_bb1920: attn_check.Q0 });
  }
};


var connecting_block = {
  type: "html-keyboard-response",
  stimulus: connecting,
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
};


var practice_choice1 = {
  // first practice round of PD game
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
  // second practice round of PD game
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
  // first practice round of PD game (computer response slide)
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
  // second practice round of PD game (computer response slide)
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
  // two practice rounds of imaginary PD game, with instructions
  timeline: [practice_choice1, practice_response1, practice_choice2, practice_response2],
};


var run_chunk = {
  // repeated PD game chunk
  timeline: [user_choice, waiting_for_other_choice, computer_choice],
  loop_function: function () {
    if (roundNum >= 10) {
      return false;
    } else {
      return true;
    }
  },
};


var design_factors = {
  // to randomize over, not used in Qualtrics
  //other_group: ["c", "ig", "og"],
  other_group: ["c", "c"],
  betray: ["f", "t"],
};

// randomize
var full_design = jsPsych.randomization.factorial(design_factors, 1);

var pd_with_variables = {
  // run PD game and instructions/practice (not used in Qualtrics)
  timeline: [instruction_pd_block_intro, instruction_pd_block_payout, practice_round_chunk, connecting_block, instructions_after_practice, run_chunk],
  //timeline: [trial],
  timeline_variables: full_design,
  sample: {
    type: "with-replacement",
    size: 1,
  },
};