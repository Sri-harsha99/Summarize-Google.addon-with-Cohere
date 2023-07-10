function makeHttpRequest(data,gen) {
  var url = '';
  var payload;
  if(!gen){
    url = "https://api.cohere.ai/v1/summarize";
    payload = {
      text: data
    };
  } else{
    url = "https://api.cohere.ai/v1/generate";
    payload = {
     prompt: data
    };
  }
  
  var options = {
    method: "POST",  // Replace with the appropriate HTTP method (GET, POST, etc.)
    headers: {
      "Authorization": "Bearer 8FvFO3RxnSyE9282oQtSXPuz8wIueWk0CLm60xif",
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload)
    // Add any additional request parameters or payload
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseData = response.getContentText();
  return responseData
}

function getEmailContent(e) {
  var accessToken = ScriptApp.getOAuthToken();
  console.log(e);
  var messageId =  e.messageMetadata.messageId;
  console.log(messageId);
  var messageById = GmailApp.getMessageById(messageId);

  // var url = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageId;
  // var options = {
  //   method: "GET",
  //   headers: {
  //     Authorization: "Bearer " + accessToken
  //   },
  //   muteHttpExceptions: true
  // };
  
  var body = messageById.getPlainBody();
  console.log(body);
  body = 'Reply to the below mail: \n'+body;
  data = JSON.parse(makeHttpRequest(body,true));
  newData = data.generations[0].text
  console.log(newData);
  // Create a new draft email with the copied content
  var subject = messageById.getSubject();
  var body = newData;

  // Create a new draft reply within the same thread
  messageById.createDraftReplyAll(body, {
    subject: subject,
  });

  // var draftEmail = GmailApp.createDraft(recipient, 'Temp', body);
  //draftEmail.send();
}


function createGmailAddon() {
   
    var draftComposeAction = CardService.newAction()
    .setFunctionName("getEmailContent");

    // let cardSection1DecoratedText1Icon1 = CardService.newIconImage()
    //     .setIconUrl(
    //         'https://fonts.gstatic.com/s/i/googlematerialicons/email/v6/grey600-24dp/1x/gm_email_grey600_24dp.png'
    //     );

    // let cardSection1DecoratedText1 = CardService.newDecoratedText()
    //     .setText(email)
    //     .setBottomLabel('Vice president')
    //     .setStartIcon(cardSection1DecoratedText1Icon1);

    // let cardSection1DecoratedText3Icon1 = CardService.newIconImage()
    //     .setIconUrl(
    //         'https://fonts.gstatic.com/s/i/googlematerialicons/call/v6/grey600-24dp/1x/gm_call_grey600_24dp.png'
    //     );

    // let cardSection1DecoratedText3 = CardService.newDecoratedText()
    //     .setText(phone)
    //     .setBottomLabel('Vice president')
    //     .setStartIcon(cardSection1DecoratedText3Icon1);

    let cardSection1ButtonList1Button1 = CardService.newTextButton()
        .setText('Get a draft reply')
        .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
        .setOnClickAction(draftComposeAction);

    
    let cardSection1ButtonList1 = CardService.newButtonSet()
        .addButton(cardSection1ButtonList1Button1);

    let cardSection1 = CardService.newCardSection()
        .setHeader('Send an AI generated reply to the current mail')
        // .addWidget(cardSection1DecoratedText1)
        // .addWidget(cardSection1DecoratedText2)
        // .addWidget(cardSection1DecoratedText3)
        .addWidget(cardSection1ButtonList1);

    let card = CardService.newCardBuilder()
        .addSection(cardSection1)
        .build();
    return card;
}


function loadAddOn(event) {
  var card = createGmailAddon();
  return [card];
}
