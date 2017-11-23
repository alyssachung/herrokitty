var randomResponses = {
  neutural:[
    //"uh", "hmm", "yeah", "k", "good", "right"
  "Can you tell me more about %w%?"],

  emotional:["kill me, you seem upset about %w%."],

  suspicious:["oh well %w% is damn tricky."]

};




/*[
  "uh", "hmm", "yeah", "k", "good", "kill me", "right"
];*/

chooseRandomResponse = function(msg, msgWordsPOS,emotion,engLexicon) {

  var finalChoice = "", keyword = "", synonym = "";
  var emotionResponses = randomResponses[emotion];

  var msgWords= msg.split(" ");
  for (index=msgWordsPOS.length-1; index>-1; index--)
  {
    if(msgWordsPOS[index]==="noun")
    {
      keyword= msgWords[index];
      var searchResult = engLexicon.findOne({Word:keyword});
      if (searchResult !== undefined)
      {
        synonym = searchResult.Synonym;
        break;
      }
    }
  }



  var numOfChoices = emotionResponses.length;
  var randomNum = Math.random();
  randomNum = randomNum*numOfChoices;
  randomNum = Math.floor(randomNum);
  finalChoice = emotionResponses[randomNum];

 if (synonym !== "")
  {
   finalChoice= finalChoice.replace("%w%", synonym);
  }
  else
  {
    finalChoice=  finalChoice.replace("%w%", "this");
  }
  return finalChoice;
};
