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
// payout of focal actor, action of focal actor is first index, other action is second index
var payout_dict = {c : {c : 6, nc : 0}, nc : {c : 10, nc : 2}};

function color_triangle(a,b,size,float) {
  t =
    `<div style="float:${float};
    width:0;
    height:0;
    border-left:${size}px solid ${a};
    border-bottom:${size}px solid ${b};
    clear:both"></div>`;
  return t;
}

function color_triangle_nofloat(a,b,size) {
  t =
    `<span style="width:0;
    display: inline-block;
    height:0;
    border-left:${size}px solid ${a};
    border-bottom:${size}px solid ${b};"></span>`;
  return t;
}

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


function user_choice_fun(within = false) {
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
      stim =
        `<div id="instructions">Choose whether to cooperate (press "x")
        or not cooperate (press "y") with your counterpart.</div>`;

      head =
        `<header>
        <table width="100%">
          <tr>
            <td align="center">Your favorite team:<br><span>
            ${color_triangle(jsPsych.timelineVariable("own_colors", true)[0], jsPsych.timelineVariable("own_colors", true)[1], 20, "left")}
            ${jsPsych.timelineVariable("own_team", true)}</span></td>
            <td align="center">Counterpart's favorite team:<br><span>
                ${color_triangle(jsPsych.timelineVariable("counterp_colors", true)[0], jsPsych.timelineVariable("counterp_colors", true)[1], 20, "right")}
                ${jsPsych.timelineVariable("counterp_team", true)}</td>
        </table>
        </header>`;
      /*
      head =
        `<header>
        <table width="100%">
          <tr>
            <td align="center">Your favorite team:<br><span style="color:${jsPsych.timelineVariable("own_colors", true)[0]};
                border-radius:20px; background-color:${jsPsych.timelineVariable("own_colors", true)[1]};">${jsPsych.timelineVariable("own_team", true)}</span></td>
            <td align="center">Counterpart's favorite team:<br><span style=\"color:${jsPsych.timelineVariable("counterp_colors", true)[0]};
                border-radius:20px; background-color:${jsPsych.timelineVariable("counterp_colors", true)[1]};">${jsPsych.timelineVariable("counterp_team", true)}</td>
        </table>
        </header>`;*/
      stim =
        head +
        stim +
        payout_table +
        '<p id="counterpart_prompt"></p>';

      if (!within) {
        stim = stim + `<div><center>Round ${roundNum + 1}</center></div>`
      }
      return stim;
    },
    choices: ["x", "y"],
  };
  return user_choice
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
    stim =
      `<div id="instructions">Choose whether to cooperate (press "x")
      or not cooperate (press "y") with your counterpart.</div>`;

    var self_image = `https://tholdaway.github.io/homophily-coop/img/NFL_TEAMS/${jsPsych.timelineVariable("own_team", true)}.png`;
    var other_image = `https://tholdaway.github.io/homophily-coop/img/NFL_TEAMS/${jsPsych.timelineVariable("counterp_team", true)}.png`;
    head =
      `<header>
      <table width="100%">
        <tr>
          <td align="center">Your favorite team:<br><span>
            ${jsPsych.timelineVariable("own_team", true)}
            <img src="
            ${self_image}"
            style="width:50px !important;height:50px !important;padding: 5px !important;" class="center">
          </span></td>
          <td align="center">Counterpart's favorite team:<br><span>
            ${jsPsych.timelineVariable("counterp_team", true)}
            <img src="
            ${other_image}"
            style="width:50px !important;height:50px !important;padding: 5px !important;" class="center">
          </td>
      </table>
      </header>`;
      /*
      head =
        `<header>
        <table width="100%">
          <tr>
            <td align="center">Your favorite team:<br><span style="color:${jsPsych.timelineVariable("own_colors", true)[0]};
                border-radius:20px; background-color:${jsPsych.timelineVariable("own_colors", true)[1]};">${jsPsych.timelineVariable("own_team", true)}</span></td>
            <td align="center">Counterpart's favorite team:<br><span style=\"color:${jsPsych.timelineVariable("counterp_colors", true)[0]};
                border-radius:20px; background-color:${jsPsych.timelineVariable("counterp_colors", true)[1]};">${jsPsych.timelineVariable("counterp_team", true)}</td>
        </table>
        </header>`;*/
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


function computer_choice_fun(within = false, betray_seq) {
  if ( !within ) {
    if (jsPsych.timelineVariable("betray", true) === "t") {
      var betray_seq = [2,3,5,6,7,9,10]
    } else {
      var betray_seq = [3,7,9,10]
    }
  };
  var computer_choice = {
    // logic and display for counterpart choice slide, based on experimental
    // condition and use choice
    type: "html-keyboard-response",
    trial_duration: 20000,
    choices: ["n"],
    stimulus: function () {
      // game logic implemented here
      roundNum++;
      var computerChoice;
      computerChoice = betray_seq.includes(roundNum) ? "nc" : "c"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.

      var computerChoiceWord = computerChoice === "nc" ? "not cooperate" : "cooperate";
      var userChoice = jsPsych.data.getLastTimelineData().select("response").values[0] === "x" ? "c" : "nc";
      var userChoiceWord = userChoice === "nc" ? "not cooperate" : "cooperate";
      var stim =
                `<div id="instructions">The other player chose to ${computerChoiceWord}.
                You chose to ${userChoiceWord}. You received
                ${payout_dict[userChoice][computerChoice]} points. They received
                ${payout_dict[computerChoice][userChoice]} points.</div>`;
              score_self += payout_dict[userChoice][computerChoice];
              score_other += payout_dict[computerChoice][userChoice];

        var head =
          `<header>
          <table width="100%">
            <tr>
              <td align="center">Your favorite team:<br><span>
              ${color_triangle(jsPsych.timelineVariable("own_colors", true)[0], jsPsych.timelineVariable("own_colors", true)[1], 20, "left")}
              ${jsPsych.timelineVariable("own_team", true)}</span></td>
              <td align="center">Counterpart's favorite team:<br><span>
                  ${color_triangle(jsPsych.timelineVariable("counterp_colors", true)[0], jsPsych.timelineVariable("counterp_colors", true)[1], 20, "right")}
                  ${jsPsych.timelineVariable("counterp_team", true)}</td>
          </table>
          </header>`;
      /*var head =
          `<header>
          <table width="100%">
            <tr>
              <td align="center">Your favorite team:<br><span style="color:${jsPsych.timelineVariable("own_colors", true)[0]};
                  border-radius:20px; background-color:${jsPsych.timelineVariable("own_colors", true)[1]};">${jsPsych.timelineVariable("own_team", true)}</span></td>
              <td align="center">Counterpart's favorite team:<br><span style=\"color:${jsPsych.timelineVariable("counterp_colors", true)[0]};
                  border-radius:20px; background-color:${jsPsych.timelineVariable("counterp_colors", true)[1]};">${jsPsych.timelineVariable("counterp_team", true)}</td>
          </table>
          </header>`;*/
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
        ` + `<p><b>Press "n" to continue.</b></p>` +
        `<div><center>Round ${roundNum}</center></div>`;

      return stim;
    },
  };
  return computer_choice
};

var computer_choice = {
  // logic and display for counterpart choice slide, based on experimental
  // condition and use choice
  type: "html-keyboard-response",
  trial_duration: 20000,
  choices: ["n"],
  stimulus: function () {
    // game logic implemented here
    roundNum++;
    var computerChoice;
    if (jsPsych.timelineVariable("betray", true) === "t") {
      //computerChoice = [0,2,3,4,6,8,9].includes(roundNum) ? "y" : "x"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
      computerChoice = [2,3,5,6,7,9,10].includes(roundNum) ? "nc" : "c"; // in the betray condition, we betray on the 4th,7th,9th rounds? on wednesday we wear pink.
    } else {
      //computerChoice = [2,6,8,9].includes(roundNum) ? "y" : "x"; // in the no betray condition, we betray on the 7th round? on wednesday we wear pink.
      computerChoice = [3,7,9,10].includes(roundNum) ? "nc" : "c"; // in the no betray condition, we betray on the 7th round? on wednesday we wear pink.
    };
    var computerChoiceWord = computerChoice === "nc" ? "not cooperate" : "cooperate";
    var userChoice = jsPsych.data.getLastTimelineData().select("response").values[0] === "x" ? "c" : "nc";
    var userChoiceWord = userChoice === "nc" ? "not cooperate" : "cooperate";
    var stim =
              `<div id="instructions">The other player chose to ${computerChoiceWord}.
              You chose to ${userChoiceWord}. You received
              ${payout_dict[userChoice][computerChoice]} points. They received
              ${payout_dict[computerChoice][userChoice]} points.</div>`;
            score_self += payout_dict[userChoice][computerChoice];
            score_other += payout_dict[computerChoice][userChoice];
    var self_image = `https://tholdaway.github.io/homophily-coop/img/NFL_TEAMS/${jsPsych.timelineVariable("own_team", true)}.png`;
    var other_image = `https://tholdaway.github.io/homophily-coop/img/NFL_TEAMS/${jsPsych.timelineVariable("counterp_team", true)}.png`;
    head =
      `<header>
      <table width="100%">
        <tr>
          <td align="center">Your favorite team:<br><span>
            ${jsPsych.timelineVariable("own_team", true)}
            <img src="
            ${self_image}"
            style="width:50px !important;height:50px !important;padding: 5px !important;" class="center">
          </span></td>
          <td align="center">Counterpart's favorite team:<br><span>
            ${jsPsych.timelineVariable("counterp_team", true)}
            <img src="
            ${other_image}"
            style="width:50px !important;height:50px !important;padding: 5px !important;" class="center">
          </td>
      </table>
      </header>`;
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
      ` + `<p><b>Press "n" to continue.</b></p>` +
      `<div><center>Round ${roundNum}</center></div>`;

    return stim;
  },
};

var plot_images = [
  "img/participation_plot_low.png",
  "img/participation_plot_high.png"
].map(x => "https://tholdaway.github.io/homophily-coop/" + x);





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
  choices: ["n"],
  stimulus: `<div id="instructions">
  If you have trouble viewing an image, please zoom in or out using your browser (by pressing control/command plus or minus on your keyboard).
  You will NOT be able to return to previous instructions after continuing. Please read all instructions carefully.
  At any point, you may press "n" to continue, unless another action is required.<br>
  <b>Press "n" to continue.</b>
  </div>`,
};

var instructions_all_block2 = {
  type: "html-keyboard-response",
  choices: ["n"],
  stimulus: `<div id="instructions">
  During this study you will play games with other individuals located across the US.
  We trust that you will read questions and respond thoughtfully.
  Some questions check that participants have read the prompts carefully. They are easy and straightforward.
  While we are confident that you will pay close attention, others may not.
  Participants that fail to answer these questions correctly may not receive full compensation. <br>
  <b>Press "n" to continue.</b>
  </div>`,
};


var instruction_pd_block_intro = {
  // introduces PD game
  type: "html-keyboard-response",
  choices: ["n"],
  stimulus: function () {
    return (
      //`<h1>Instructions</h1>
      `<div id="instructions">You will shortly be asked to play a game
      with another participant who also likes watching football
      and is connected to the game in another location. Please be mindful and respectful of their time.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decisions of the other participant.
      After the game, you will be awarded additional compensation according to your performance.<br>
      You will be playing a series of rounds against the same counterpart.
      <br>
      <b>Press "n" to continue.</b>` +
      "</div>"
    );
  },
};

var instruction_pd_block_payout = {
  // describes payout of PD game
  type: "html-keyboard-response",
  choices: ["n"],
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
    <b>Press "n" to continue.</b></div>
    `
    return stim
  }
};

var instructions_after_practice = {
  // final instructions for PD game prior to actually playing. happens after the practice rounds
  type: "html-keyboard-response",
  choices: ["n"],
  stimulus: function () {
    /*var team_statement =
        `in the <span style="color:${jsPsych.timelineVariable("counterp_colors", true)[0]};
        border-radius:20px; background-color:${jsPsych.timelineVariable("counterp_colors", true)[1]};">
        ${jsPsych.timelineVariable("counterp_team", true)}
        </span> group (you are in the <span style="color:${jsPsych.timelineVariable("own_colors", true)[0]};
        border-radius:20px; background-color:${jsPsych.timelineVariable("own_colors", true)[1]};">
        ${jsPsych.timelineVariable("own_team", true)}</span> group)`;*/
    var team_statement =
        `<span>
        ${color_triangle_nofloat(jsPsych.timelineVariable("counterp_colors", true)[0], jsPsych.timelineVariable("counterp_colors", true)[1], 20, "right")}
        ${jsPsych.timelineVariable("counterp_team", true)}
        </span>`;
    jsPsych.data.addProperties({
      betray: jsPsych.timelineVariable("betray", true),
    });
    return (
      //`<h1>Instructions</h1>
      `<div id="instructions">
      Now that you understand the game, you will play with another participant.<br>
      You have been paired with a
      ${team_statement} fan who is connected to the game in another location.
      Please be mindful and respectful of their time.<br>
      The amount of points you earn will be determined by the decisions
      that you make in combination with the decisions of the other participant.
      After the game, <b>you will be awarded additional compensation according to your performance.</b><br>
      You will be playing a series of rounds against the same counterpart.
      <br>
      Press "n" to begin playing.
      </div>`
    );
  }
};


var paired_with = {  // "paired with" message with counterpart team information
  type: "html-keyboard-response",
  choices: ["n"],
  stimulus: function () {
    /*var team_statement =
        `in the <span style="color:${jsPsych.timelineVariable("counterp_colors", true)[0]};
        border-radius:20px; background-color:${jsPsych.timelineVariable("counterp_colors", true)[1]};">
        ${jsPsych.timelineVariable("counterp_team", true)}
        </span> group (you are in the <span style="color:${jsPsych.timelineVariable("own_colors", true)[0]};
        border-radius:20px; background-color:${jsPsych.timelineVariable("own_colors", true)[1]};">
        ${jsPsych.timelineVariable("own_team", true)}</span> group)`;*/
    var other_image = `https://tholdaway.github.io/homophily-coop/img/NFL_TEAMS/${jsPsych.timelineVariable("counterp_team", true)}.png`;
    return (
      //`<h1>Instructions</h1>
      `<div id="instructions">
      You have been randomly paired with a ${jsPsych.timelineVariable("counterp_team", true)} fan!
      <br>
      <img src="
      ${other_image}"
      style="width:1in !important;height:1in !important;padding: 5px !important;" class="center">
      <br>
      Press "n" to begin playing.
      </div>`
    );
  }
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
      stim = `The red line shows how often your counterpart cooperated, relative to all other players. Your counterpart was <b>less cooperative</b> than the average player.<br><div class="imgContainer"><img src="` +
      plot_images[0] +
      //`" style="width:1600px !important;height:800px !important;"></div>`
      `" style="width:8in !important;height:4in !important;padding: 5px !important;"></div>`
    } else {
      //stim = "Your counterpart chose to cooperate more than 75% of all players."
      stim = `The red line shows how often your counterpart cooperated, relative to all other players.
      Your counterpart was <b>more cooperative</b> than the average player.<br><div class="imgContainer"><img src="
      ${plot_images[1]}"
      style="width:8in !important;height:4in !important;padding: 5px !important;"></div>`
    }
    stim = `<div id='instructions'>In total your score was
      ${score_self}.<br>Your counterpart's score was
      ${score_other}.<br> ${stim}
      <p><b>Press "n" to continue.</b></p></div>`;
      jsPsych.data.addProperties({ score_self: score_self, score_other: score_other});
    return stim
  },
  choices: ["n"],
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
    `<p><b>Press "n" to continue.</b></p>`;
    return stim;
  },
  choices: ["n"],
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
    `<p><b>Press "n" to continue.</b></p>`;
    return stim;
  },
  choices: ["n"],
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
  // other_group: ["c", "c"],
  betray: ["f", "t"],
};

// randomize
var full_design = jsPsych.randomization.factorial(design_factors, 1);

var pd_with_variables = {
  // run PD game and instructions/practice (not used in Qualtrics)
  timeline: [instruction_pd_block_intro, instruction_pd_block_payout, practice_round_chunk, connecting_block, paired_with, instructions_after_practice, run_chunk],
  //timeline: [trial],
  timeline_variables: full_design,
  sample: {
    type: "with-replacement",
    size: 1,
  },
};
