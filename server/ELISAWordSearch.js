wordSearch = function(msg, engLexicon) {
  var wordSearchResult = "";
  if(msg.indexOf("Which 10") > -1)
  {
    var allMatches;
    if(msg.indexOf("verb")>-1)
    {
      allMatches = engLexicon.find({POS:"verb"});
    }
    else if(msgt.indexOf("noun")>-1)
    {
      allMatches = engLexicon.find({POS:"noun"});
    }
    else if(msgt.indexOf("adjective")>-1)
    {
      allMatches = engLexicon.find({POS:"adjective"});
    }
    if (allMatches !== undefined)
    {
      allMatches = allMatches.fetch();
      for(index=0; index<10 ; index++)
      {
        var randomNum = Math.random()
        randomNum = randomNum*allMatches.length;
        randomNum = Math.floor(randomNum);

        wordSearchResult = wordSearchResult+allMatches[randomNum].Word+",";
      }
      wordSearchResult = "There you go honey: "+wordSearchResult;
    }
    else
    {
      wordSearchResult = "Sorry. Not sorry.";
    }
  }
  return wordSearchResult;
};
