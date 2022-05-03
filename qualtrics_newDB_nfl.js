// INCOMPLETE
Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 2: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 3: Defining and load required resources */
    // var jslib_url = "https://kywch.github.io/jsPsych/";
    var jslib_url = "https://tholdaway.github.io/homophily-coop/";

    // the below urls must be accessible with your browser
    // for example, https://kywch.github.io/jsPsych/jspsych.js
    var requiredResources = [
        // jslib_url + "jspsych.js",
        // jslib_url + "plugins/jspsych-html-keyboard-response.js",
        //"http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/10.26.1/Dropbox-sdk.min.js",
        //"https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js",
        jslib_url + "scripts/jquery-1.11.1.js",
        jslib_url + "scripts/jquery-ui.min.js",
        jslib_url + "jspsych-6.3.1/jspsych.js",
        jslib_url + "jspsych-6.3.1/plugins/jspsych-html-keyboard-response.js",
        jslib_url + "jspsych-6.3.1/plugins/jspsych-html-button-response.js",
        jslib_url + "jspsych-6.3.1/plugins/jspsych-survey-multi-choice.js",
		jslib_url + "jspsych-6.3.1/plugins/jspsych-survey-likert.js",
        jslib_url + "experiment_nfl.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    var sbj_id = "${e://Field/ResponseID}";
    console.log(sbj_id)

	  var task_name = "tiedecaycoop2";
    var save_filename = "/25apr2022/" + task_name + '_' + sbj_id;

    /* Change 5: Define save functions using Dropbox API */

    function getAccessToken(callback) {
      var url = "https://api.dropbox.com/oauth2/token";

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Authorization", "Basic NXZmNGRuNjhwYWtwdHBjOmp3cWN5MzI5MTIwdjF0NA==");

      xhr.onreadystatechange = function () {
         if (xhr.readyState === 4) {
            console.log(xhr.status);
            var jsonResponse = JSON.parse(xhr.responseText);
            var aT = jsonResponse.access_token;
            callback(aT);
         }};

      var data = "";

      xhr.send(data);
    };

    function save_data_csv(access_token) {
        try {
            var dbx = new Dropbox.Dropbox({
                accessToken: access_token,
            });
            dbx.filesUpload({
                    path: save_filename + '.csv',
                    mode: 'overwrite',
                    mute: true,
                    contents: jsPsych.data.get().csv()
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                });
        } catch (err) {
            console.log("Save data function failed.", err);
        }
    };

    function nfl_team_info(fav_team) {
      // condition is either "high" or "low"
      var dict = {'Arizona Cardinals' : { colors : ['#97233F', '#000000'],
                                          low    : { counterp : 'Washington Commanders', counterp_colors : ['#5A1414', '#FFB612'] },
                                          high   : { counterp : 'Seattle Seahawks', counterp_colors : ['#002244', '#69BE28'] } },
                                          'Atlanta Falcons' : { colors : ['#000000', '#A71930'],
                                          low    : { counterp : 'Minnesota Vikings', counterp_colors : ['#4F2683', '#FFC62F'] },
                                          high   : { counterp : 'New Orleans Saints', counterp_colors : ['#000000', '#D3BC8D'] } },
                                          'Baltimore Ravens' : { colors : ['#24135F', '#9A7611'],
                                          low    : { counterp : 'Buffalo Bills', counterp_colors : ['#00338D', '#C60C30'] },
                                          high   : { counterp : 'Pittsburgh Steelers', counterp_colors : ['#000000', '#FFB612'] } },
                                          'Buffalo Bills' : { colors : ['#00338D', '#C60C30'],
                                          low    : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] },
                                          high   : { counterp : 'New England Patriots', counterp_colors : ['#002244', '#C60C30'] } },
                                          'Carolina Panthers' : { colors : ['#000000', '#0085CA'],
                                          low    : { counterp : 'Cincinnati Bengals', counterp_colors : ['#000000', '#FB4F14'] },
                                          high   : { counterp : 'New Orleans Saints', counterp_colors : ['#000000', '#D3BC8D'] } },
                                          'Chicago Bears' : { colors : ['#0B162A', '#E64100'],
                                          low    : { counterp : 'Kansas City Chiefs', counterp_colors : ['#E31837', '#FFB612'] },
                                          high   : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] } },
                                          'Cincinnati Bengals' : { colors : ['#000000', '#FB4F14'],
                                          low    : { counterp : 'Detroit Lions', counterp_colors : ['#0076B6', '#B0B7BC'] },
                                          high   : { counterp : 'Pittsburgh Steelers', counterp_colors : ['#000000', '#FFB612'] } },
                                          'Cleveland Browns' : { colors : ['#311D00', '#FF3300'],
                                          low    : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] },
                                          high   : { counterp : 'Pittsburgh Steelers', counterp_colors : ['#000000', '#FFB612'] } },
                                          'Dallas Cowboys' : { colors : ['#002244', '#B0B7BC'],
                                          low    : { counterp : 'Buffalo Bills', counterp_colors : ['#00338D', '#C60C30'] },
                                          high   : { counterp : 'Philadelphia Eagles', counterp_colors : ['#004851', '#A2AAAD'] } },
                                          'Denver Broncos' : { colors : ['#0A2343', '#FC4C02'],
                                          low    : { counterp : 'Houston Texans', counterp_colors : ['#03202F', '#A71930'] },
                                          high   : { counterp : 'Las Vegas Raiders', counterp_colors : ['#000000', '#A5ACAF'] } },
                                          'Detroit Lions' : { colors : ['#0076B6', '#B0B7BC'],
                                          low    : { counterp : 'Pittsburgh Steelers', counterp_colors : ['#000000', '#FFB612'] },
                                          high   : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] } },
                                          'Green Bay Packers' : { colors : ['#203731', '#FFB612'],
                                          low    : { counterp : 'Pittsburgh Steelers', counterp_colors : ['#000000', '#FFB612'] },
                                          high   : { counterp : 'Chicago Bears', counterp_colors : ['#0B162A', '#E64100'] } },
                                          'Houston Texans' : { colors : ['#03202F', '#A71930'],
                                          low    : { counterp : 'Kansas City Chiefs', counterp_colors : ['#E31837', '#FFB612'] },
                                          high   : { counterp : 'Indianapolis Colts', counterp_colors : ['#013369', '#1D252C'] } },
                                          'Indianapolis Colts' : { colors : ['#013369', '#1D252C'],
                                          low    : { counterp : 'Chicago Bears', counterp_colors : ['#0B162A', '#E64100'] },
                                          high   : { counterp : 'New England Patriots', counterp_colors : ['#002244', '#C60C30'] } },
                                          'Jacksonville Jaguars' : { colors : ['#006778', '#000000'],
                                          low    : { counterp : 'Kansas City Chiefs', counterp_colors : ['#E31837', '#FFB612'] },
                                          high   : { counterp : 'Tennessee Titans', counterp_colors : ['#002244', '#4B92DB'] } },
                                          'Kansas City Chiefs' : { colors : ['#E31837', '#FFB612'],
                                          low    : { counterp : 'Houston Texans', counterp_colors : ['#03202F', '#A71930'] },
                                          high   : { counterp : 'Las Vegas Raiders', counterp_colors : ['#000000', '#A5ACAF'] } },
                                          'LA Chargers' : { colors : ['#0080C6', '#FFC20E'],
                                          low    : { counterp : 'Seattle Seahawks', counterp_colors : ['#002244', '#69BE28'] },
                                          high   : { counterp : 'Las Vegas Raiders', counterp_colors : ['#000000', '#A5ACAF'] } },
                                          'LA Rams' : { colors : ['#003594', '#FFD100'],
                                          low    : { counterp : 'Dallas Cowboys', counterp_colors : ['#002244', '#B0B7BC'] },
                                          high   : { counterp : 'San Francisco 49ers', counterp_colors : ['#AA0000', '#B3995D'] } },
                                          'Las Vegas Raiders' : { colors : ['#000000', '#A5ACAF'],
                                          low    : { counterp : 'Houston Texans', counterp_colors : ['#03202F', '#A71930'] },
                                          high   : { counterp : 'Denver Broncos', counterp_colors : ['#0A2343', '#FC4C02'] } },
                                          'Miami Dolphins' : { colors : ['#008E97', '#FC4C02'],
                                          low    : { counterp : 'Cincinnati Bengals', counterp_colors : ['#000000', '#FB4F14'] },
                                          high   : { counterp : 'New York Jets', counterp_colors : ['#115740', '#000000'] } },
                                          'Minnesota Vikings' : { colors : ['#4F2683', '#FFC62F'],
                                          low    : { counterp : 'New York Giants', counterp_colors : ['#0B2265', '#A71930'] },
                                          high   : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] } },
                                          'New England Patriots' : { colors : ['#002244', '#C60C30'],
                                          low    : { counterp : 'LA Rams', counterp_colors : ['#003594', '#FFD100'] },
                                          high   : { counterp : 'New York Jets', counterp_colors : ['#115740', '#000000'] } },
                                          'New Orleans Saints' : { colors : ['#000000', '#D3BC8D'],
                                          low    : { counterp : 'Philadelphia Eagles', counterp_colors : ['#004851', '#A2AAAD'] },
                                          high   : { counterp : 'Atlanta Falcons', counterp_colors : ['#000000', '#A71930'] } },
                                          'New York Giants' : { colors : ['#0B2265', '#A71930'],
                                          low    : { counterp : 'Seattle Seahawks', counterp_colors : ['#002244', '#69BE28'] },
                                          high   : { counterp : 'Dallas Cowboys', counterp_colors : ['#002244', '#B0B7BC'] } },
                                          'New York Jets' : { colors : ['#115740', '#000000'],
                                          low    : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] },
                                          high   : { counterp : 'New England Patriots', counterp_colors : ['#002244', '#C60C30'] } },
                                          'Philadelphia Eagles' : { colors : ['#004851', '#A2AAAD'],
                                          low    : { counterp : 'Chicago Bears', counterp_colors : ['#0B162A', '#E64100'] },
                                          high   : { counterp : 'Dallas Cowboys', counterp_colors : ['#002244', '#B0B7BC'] } },
                                          'Pittsburgh Steelers' : { colors : ['#000000', '#FFB612'],
                                          low    : { counterp : 'Kansas City Chiefs', counterp_colors : ['#E31837', '#FFB612'] },
                                          high   : { counterp : 'Baltimore Ravens', counterp_colors : ['#24135F', '#9A7611'] } },
                                          'San Francisco 49ers' : { colors : ['#AA0000', '#B3995D'],
                                          low    : { counterp : 'Detroit Lions', counterp_colors : ['#0076B6', '#B0B7BC'] },
                                          high   : { counterp : 'Seattle Seahawks', counterp_colors : ['#002244', '#69BE28'] } },
                                          'Seattle Seahawks' : { colors : ['#002244', '#69BE28'],
                                          low    : { counterp : 'Philadelphia Eagles', counterp_colors : ['#004851', '#A2AAAD'] },
                                          high   : { counterp : 'San Francisco 49ers', counterp_colors : ['#AA0000', '#B3995D'] } },
                                          'Tampa Bay Buccaneers' : { colors : ['#A71930', '#322F2B'],
                                          low    : { counterp : 'Baltimore Ravens', counterp_colors : ['#24135F', '#9A7611'] },
                                          high   : { counterp : 'Carolina Panthers', counterp_colors : ['#000000', '#0085CA'] } },
                                          'Tennessee Titans' : { colors : ['#002244', '#4B92DB'],
                                          low    : { counterp : 'Green Bay Packers', counterp_colors : ['#203731', '#FFB612'] },
                                          high   : { counterp : 'Indianapolis Colts', counterp_colors : ['#013369', '#1D252C'] } },
                                          'Washington Commanders' : { colors : ['#5A1414', '#FFB612'],
                                          low    : { counterp : 'Las Vegas Raiders', counterp_colors : ['#000000', '#A5ACAF'] },
                                          high   : { counterp : 'Dallas Cowboys', counterp_colors : ['#002244', '#B0B7BC'] } }}
      return dict[fav_team]
    };

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    };

    /* Change 4: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    //jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    //jQuery("<div id = 'display_stage'></div>").appendTo('body');

    jQuery("<div id = 'jspsych-target'></div>").appendTo('body');

    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {
        var own_team = "${e://Field/fav_team}";
        var exp_cond = "${e://Field/other_group}";
        var own_team_info = nfl_team_info(own_team);
        var own_colors = own_team_info.colors;
        var counterp_colors = exp_cond === "sg" ? own_colors : own_team_info[exp_cond].counterp_colors;
        var counterp_team = exp_cond === "sg" ? own_team : own_team_info[exp_cond].counterp;

        var design_factors = [{other_group:"${e://Field/other_group}", betray:"${e://Field/betray}",
                                own_team:own_team, own_colors:own_colors,
                                counterp_team:counterp_team, counterp_colors:counterp_colors}];
        var pd_with_variables_qt = {
          timeline: [instruction_pd_block_intro, instruction_pd_block_payout, practice_round_chunk, connecting_block, instructions_after_practice, run_chunk],
		  //timeline: [connecting_block, instruction_pd_block, instruction_pd_block_payout, run_chunk],
          //timeline: [trial],
          timeline_variables: design_factors,
          sample: {
            type: "with-replacement",
            size: 1
          },
        };
		/*console.log("${e://Field/other_group}");
        console.log("${e://Field/betray}");
		console.log(full_design);
		console.log(design_factors);
        console.log("init")*/
        jsPsych.init({
          timeline: [
			      instructions_all_block1,
            instructions_all_block2,
            attention_check_block,
            pd_with_variables_qt,
            coop_comparison_block
          ],
          display_element: "jspsych-target",
          // add the desired on_finish to save data to qualtrics
          on_finish: function (data) {
			      var painter_pref = jsPsych.data.get().first(1).values()[0].group_assignment;
            Qualtrics.SurveyEngine.setEmbeddedData( 'painter_pref', painter_pref );

            var coop_hist = jsPsych.data.get().filter({phase: 'user_choice'}).select('response').values.toString();
            console.log(coop_hist);
            Qualtrics.SurveyEngine.setEmbeddedData('cooperation_history', coop_hist);

            var attention_check_bb1920 = jsPsych.data.get().first(1).values()[0].attention_check_bb1920;
            Qualtrics.SurveyEngine.setEmbeddedData( 'attention_check_bb1920', attention_check_bb1920 );


            var own_team_info = nfl_team_info(own_team);
            var own_colors = own_team_info.colors;
            var counterp_colors = exp_cond === "sg" ? own_colors : own_team_info[exp_cond].counterp_colors;
            var counterp_team = exp_cond === "sg" ? own_team : own_team_info[exp_cond].counterp;
            Qualtrics.SurveyEngine.setEmbeddedData( 'other_team_low', own_team_info['low'].counterp );
            Qualtrics.SurveyEngine.setEmbeddedData( 'other_team_high', own_team_info['high'].counterp );
            Qualtrics.SurveyEngine.setEmbeddedData( 'other_team_actual', counterp_team );
            Qualtrics.SurveyEngine.setEmbeddedData( 'other_colors_actual0', counterp_colors[0] );
            Qualtrics.SurveyEngine.setEmbeddedData( 'other_colors_actual1', counterp_colors[1] );
            /* Change 5: Summarizing and save the results to Qualtrics */
            // summarize the results
            /*
            var trials = jsPsych.data.get().filter({
                test_part: 'test'
            });
            var correct_trials = trials.filter({
                correct: true
            });
            var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
            var rt = Math.round(correct_trials.select('rt').mean());

            // save to qualtrics embedded data
            Qualtrics.SurveyEngine.setEmbeddedData("accuracy", accuracy);
            Qualtrics.SurveyEngine.setEmbeddedData("rt", rt);
            */
            /* Change 6: Adding the clean up and continue functions.*/
            // clear the stage
            //jQuery('#display_stage').remove();
            //jQuery('#display_stage_background').remove();
            getAccessToken(save_data_csv);
            jQuery('#jspsych-target').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
          },
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
