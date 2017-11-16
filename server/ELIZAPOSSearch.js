posSearch = function(msg, engLexicon){
  var posQ = "What is the position of the word ";
  //建立搜尋結果變數
  var posSearchResults = "";
  if (msg.indexOf(posQ)>-1)
  {
    var targetWord = "";
    var startPos = posQ.length;
    var endPos;
    if(msg.indexOf("?")>-1)
    {
      endPos = msg.indexOf("?");
    }
    else
    {
      endPos = msg.length;
    }
    targetWord = msg.substring(startPos, endPos);
    console.log(targetWord);
    var wordInfo = engLexicon.findOne({Word: targetWord});
    //那個word是說那個欄位
    if(wordInfo !== undefined)
    {
      if(wordInfo.POS.indexOf("ad")=== 0)
      {
        posSearchResults = "It's an "+wordInfo.POS+".";
      }
      else
      {
        posSearchResults = "It's a "+wordInfo.POS+".";
      }
    }
    else
    {
      posSearchResults = "Sorry, I cant find this word.";
    }
  }
  return posSearchResults;

};
