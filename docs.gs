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


function onOpen() {
  DocumentApp.getUi()
    .createMenu('Custom Menu')
    .addItem('Summarize', 'showSummary')
    .addItem('Generate', 'generateText')
    .addToUi();
}


function showSummary() {
  if(DocumentApp.getActiveDocument()){
    var selection = DocumentApp.getActiveDocument().getSelection();
  }
  if( !selection )
    return DocumentApp.getUi().alert("Please select some text before summarizing.");;
  var selectedElements = selection.getRangeElements();
  var theText = "";

  for( var i=0; i < selectedElements.length; i++ )
  {
    var thisText = selectedElements[i].getElement().asText().getText();
    if( selectedElements[i].isPartial() )
      var thisText = thisText.substring( selectedElements[i].getStartOffset(), selectedElements[i].getEndOffsetInclusive() + 1)
    theText += thisText;
    //I'm assuming each element is separated by one carriage return.
    if( i+1 < selectedElements.length )
      theText += '\r';
  }
  data = JSON.parse(generateSummary(theText,false));
  
  return data
}


function generateText() {
  if(DocumentApp.getActiveDocument()){
    var selection = DocumentApp.getActiveDocument().getSelection();
  }
  if( !selection )
    return DocumentApp.getUi().alert("Please select some text for prompt.");;
  var selectedElements = selection.getRangeElements();
  var theText = "";

  for( var i=0; i < selectedElements.length; i++ )
  {
    var thisText = selectedElements[i].getElement().asText().getText();
    if( selectedElements[i].isPartial() )
      var thisText = thisText.substring( selectedElements[i].getStartOffset(), selectedElements[i].getEndOffsetInclusive() + 1)
    theText += thisText;
    //I'm assuming each element is separated by one carriage return.
    if( i+1 < selectedElements.length )
      theText += '\r';
  }
  data = generateSummary(theText,true);
  
  return data
}



function generateSummary(text,gen) {
  data = JSON.parse(makeHttpRequest(text,gen));

  if(gen){
    console.log(data);
    newData = data.generations[0].text;
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    body.appendParagraph("AI generated text:");
    var summaryParagraph = body.appendParagraph(newData);
  } else{
    var newData = data.summary;
    console.log(newData);
    // summary = summary.replace(/\n-/g, "");
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    body.appendParagraph("Summary");
    var summaryParagraph = body.appendParagraph(newData);
  }
  return
}