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
        "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/4.0.30/Dropbox-sdk.min.js",
        "https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js",
        jslib_url + "scripts/jquery-1.11.1.js",
        jslib_url + "scripts/jquery-ui.min.js",
        jslib_url + "jspsych-6.1.0/jspsych.js",
        jslib_url + "jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js",
        jslib_url + "jspsych-6.1.0/plugins/jspsych-html-button-response.js",
        jslib_url + "experiment.js"
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

    var dropbox_access_token = "";
    var task_name = "tiedecaycoop"
    var save_filename = "/" + task_name + '_' + sbj_id;

    /* Change 5: Define save functions using Dropbox API */

    function save_data_csv() {
        try {
            var dbx = new Dropbox.Dropbox({
                fetch: fetch,
                accessToken: dropbox_access_token
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
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 4: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    //jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    //jQuery("<div id = 'display_stage'></div>").appendTo('body');

    jQuery("<div id = 'jspsych-target'></div>").appendTo('body');

    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {
        console.log("init")
        jsPsych.init({
          timeline: [
            instruction_im_block,
            trials_with_variables,
            group_assignment,
            group_reinforcement_block,
            pd_with_variables,
            coop_comparison_block
          ],
          display_element: "jspsych-target",
          // add the desired on_finish to save data to qualtrics
          on_finish: function (data) {
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
            save_data_csv();
            jQuery('#jspsych-target').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
          },
          preload_images: all_images,
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});



/*
// put this in the qualtrics question html

<link href="https://tholdaway.github.io/homophily-coop/css/jspsych.css" rel="stylesheet" type="text/css"></link>

<div>
<span style="font-size: 24px;">
    <br><br>
    If you are seeing this message for <span style="color: rgb(255, 0, 0);"><b>more than 5
        minutes</b></span>,<br>
    please screen-capture this screen and send the image to us.
    <br><br>
    <span style="font-size: 28px;">We are very sorry for the inconvenience.</span>
</span>
</div>

<!-- Change 2: Adding `display_stage` CSS and Div -->
<style>
  html {
    margin: 0;
    height: 100%;
  }
  body {
    display: flex;
    justify-content: safe center;
    align-items: safe center;
    background-image: linear-gradient(rgba(45, 70, 120, 0.31), rgba(45, 70, 120, 1));
    background-attachment: fixed;
  }
  #jspsych-target {
    position: fixed;
    justify-content: safe center;
    align-items: safe center;
    left: 1vw;
    top: 1vh;
    height: 98vh;
    width: 98vw;
    background-color: white;
    box-shadow: 1px 1px 1px #999;
    border-radius: 15px;
    z-index: 0;
    overflow-y: auto;
    overflow-x: auto;
    max-width:90%;
    min-height: 75%;
    max-height:80%;
    padding: 50px;

  }
  #instructions {
    top: 0;
    bottom: 0;
    overflow: auto;
  }
  h1 {
    text-align: center;
    line-height: 1em;
  }
  img {
    object-fit: contain !important;
    width: 400px !important;
    height: 300px !important;
    padding: 25px !important;
  }
  div.imgContainer{
    float:left;
  }
  div.imgContainer2{
    display: flex;
  }
  table.center {
    margin-left: auto;
    margin-right: auto;
  }
  .tg  {border:none;border-collapse:collapse;border-spacing:0;margin-left: auto;margin-right: auto}
  .tg td{border-style:solid;border-width:0px;overflow:hidden;
    padding:10px 5px;word-break:normal;}
  .tg th{border-style:solid;border-width:0px;font-weight:normal;
    overflow:hidden;padding:10px 5px;word-break:normal;}
  .tg .tg-0lax{text-align:left;vertical-align:top}
  .tg .tg-tf2e{text-align:left;vertical-align:top}

  .tg .tg-baqh{text-align:center;vertical-align:bottom}
  .tg .tg-pcvp{border-color:inherit;text-align:center;vertical-align:top}


</style>
*/

/*
<link href="https://kywch.github.io/jsPsych/css/jspsych.css" rel="stylesheet" type="text/css"></link>

<div>
<span style="font-size: 24px;">
    <br><br>
    If you are seeing this message for <span style="color: rgb(255, 0, 0);"><b>more than 5
        minutes</b></span>,<br>
    please screen-capture this screen and send the image to us.
    <br><br>
    <span style="font-size: 28px;">We are very sorry for the inconvenience.</span>
</span>
</div>

<!-- Change 2: Adding `display_stage` CSS and Div -->
<style>
#display_stage_background {
    width: 100vw;
    background-color: white;
    z-index: -1;
}

#display_stage {
    position: fixed;
    left: 1vw;
    top: 1vh;
    height: 98vh;
    width: 98vw;
    background-color: white;
    box-shadow: 1px 1px 1px #999;
    border-radius: 15px;
    z-index: 0;
    overflow-y: hidden;
    overflow-x: hidden;
}
</style>
*/


/*

Informed Consent

You are invited to participate in a research study about collaboration/teamwork/trade/game theory (?).

If you agree to be part of the research study, you will be asked to fill in a survey, play a game, and answer a few questions about your experience playing. Participating in the research would not inflict any discomforts or put you at risk. At the completion of your participation you will receive $X.

Participating in this study is completely voluntary.  Even if you decide to participate now, you may change your mind and stop at any time. You may choose not to answer survey question, continue with the game, or the follow-up questions for any reason. As part of the research, we may mislead you or we may not tell you everything about the purpose of the research or research procedures.  At the conclusion of the study, we will provide you with that information.

All information is deidentified, the researchers will not gain access to your identity or information that would enable them to identify you. Information collected in this project may be shared with other researchers, but we will not share any information that could identify you.

Please indicate below if you agree.
*/
