var myWitToken = "";
var entityList = ["greetings", "bye", "thanks", "yesno_entity"];
var intentList = ["return_intent", "returnitem_intent", "returnproblem_intent"]
window.addEventListener('load', startChat)

function startChat() {
    var startChat = "<div class='bot'>Hi...Khols chat Bot here!...how i can help you today</div><div class='button-wrap'><button class='choice-button'>Return</button></div>"
    jQuery("section#chatbox").append(startChat);
    sendButtonCall();
    choiceButtonCall();
    jQuery("#send-button").prop("disabled", true);
    enableSendButton();
};

function witCall(inputText) {
    var _inputText = inputText;
    jQuery("#typing-loader").fadeIn();
    $.ajax({
        url: 'https://api.wit.ai/message',
        data: {
            'q': _inputText,
            'access_token': myWitToken
        },
        dataType: 'jsonp',
        async: 'false',
        method: 'GET',
        success: function (response) {
            jQuery("#typing-loader").hide();
            generateBotHTML(response);
        }
    })
}

function enableSendButton() {
    jQuery("#input-msg").on("keyup", function () {
        jQuery("#send-button").prop("disabled", false);
        if (jQuery("#input-msg").val() == '') {
            jQuery("#send-button").prop("disabled", true);
        }
    });
}

function sendButtonCall() {
    jQuery("#send-button").on("click", function (e) {
        e.stopPropagation();
        generateUserHTML(jQuery("#input-msg").val());
        witCall(jQuery("#input-msg").val());
        jQuery("#input-msg").val("");
        jQuery("#send-button").prop("disabled", true);
    });
}

function choiceButtonCall() {
    jQuery("body").on("click", ".choice-button", function (e) {
        e.stopPropagation();
        generateUserHTML(jQuery(this).text());
        witCall(jQuery(this).text().toLocaleLowerCase());
    });
}

function generateUserHTML(userInput) {
    var userHTML = "<div class='user'>" + userInput + "</div>";
    jQuery("section#chatbox").append(userHTML);
}

function generateBotHTML(botInput) {
    var botHTML = "";
    var switchKey = [];
    Object.keys(botInput.entities).forEach(function (key) {
        switchKey.push(key);
    });
    //console.log(botInput);
    Object.keys(botInput.entities).forEach(function (key) {
        //console.log(key, botInput.entities[key][0].confidence);
        switch (key) {
            case 'return_intent':
                if (botInput.entities[key][0].value == "returns") {
                    if (typeof (botInput.entities["returnitem_intent"]) != "undefined") {
                        if (typeof (botInput.entities["returnproblem_intent"]) != "undefined") {
                            if (botInput.entities["returnproblem_intent"][0].value == "notworking") {
                                botHTML = "<div class='bot'>Check if warenty is applicable. If so Eligible for returns, Else No</div>";
                                jQuery("#typing-loader").show();
                                setTimeout(function () {
                                    var _botHTML = "<div class='bot'>Whether this answer was helpful ?</div><div class='button-wrap'><button class='choice-button'>YES</button><button class='choice-button'>NO</button></div>";
                                    jQuery("#typing-loader").hide();
                                    jQuery("section#chatbox").append(_botHTML);
                                }, 2000);
                            }
                        } else if (botInput.entities["returnitem_intent"][0].value == "applewatch") {
                            botHTML = "<div class='bot'>Please selcet the problem area of your " + botInput.entities["returnitem_intent"][0].value + " </div><div class='button-wrap'><button class='choice-button'>Watch Not working</button>";
                        }
                    } else {
                        botHTML = "<div class='bot'>Can you select anyone of the " + botInput.entities[key][0].value + " category</div><div class='button-wrap'><button class='choice-button'>AppleWatch</button></div>";
                    }

                }
                break;
            case 'returnitem_intent':
                if (botInput.entities["returnitem_intent"][0].value == "applewatch") {
                    botHTML = "<div class='bot'>Please selcet the problem area of your " + botInput.entities["returnitem_intent"][0].value + " </div><div class='button-wrap'><button class='choice-button'>Watch Not working</button></div>";
                }
                break;
            case 'thanks':
                if (botInput.entities[key][0].confidence >= .9) {
                    botHTML = "<div class='bot'>Welcome! Have a nice day!</div>";
                }
                break;
            case 'bye':
                if (botInput.entities[key][0].confidence >= .9) {
                    botHTML = "<div class='bot'>Have a nice day...Bye!</div>";
                }
                break;
            case 'greetings':
                if (botInput.entities[key][0].confidence >= .9) {
                    botHTML = "<div class='bot'>Hey...Wass up...how i can help you today ?</div>";
                }
                break;
            case 'yesno_entity':
                if (botInput.entities[key][0].value == "yes") {
                    botHTML = "<div class='bot'>Happy to help...have a nice day!</div>";
                } else {
                    botHTML = "<div class='bot'>oops !...Please contact your store manager</div>";
                }
                break;
        }
    });
    if (botHTML.length == 0) {
        botHTML = "<div class='bot'>Sorry...I dont have a response to you know..hit me up with someother Q</div>";
    }
    jQuery("section#chatbox").append(botHTML);
}
