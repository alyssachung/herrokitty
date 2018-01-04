produceAIArticle = function(msg){
  var AImsgRegExp = /(what|how|tell me).* AI/ig;
  if(msg.match(AImsgRegExp)!== null)
  {
    return generateRandomAIArticle();
  }
  else
  {
    return "";
  }
};

var generateRandomAIArticle = function(){
  var randomAIArticle = "", nGramNum= 300;
  var allInitialTrigrams = nGramDB.find({trigram1:"#"}).fetch();
  var initialTrigram= randomNGramSelection(allInitialTrigrams);
  console.log(initialTrigram);
randomAIArticle= initialTrigram.trigram1+" "+initialTrigram.trigram2+" "+initialTrigram.trigram3+" ";

var newNGram1= initialTrigram.trigram2;
var newNGram2= initialTrigram.trigram3;
var selectedNewNGram;

for(wd= 1; wd<=nGramNum; wd++)
    {
      var trigramMatches= nGramDB.find({trigram1:newNGram1,trigram2:newNGram2}).fetch();
      if(trigramMatches.length>0)
      {
        selectedNewNGram= randomNGramSelection(trigramMatches);
        randomAIArticle = randomAIArticle+selectedNewNGram.trigram3+" ";
        newNGram1= newNGram2;
        newNGram2= selectedNewNGram.trigram3;
      }
      else
      {
        var bigramMatches = nGramDB.find({bigram1: newNGram2}).fetch();
        if(bigramMatches.length>0)
        {
          selectedNewNGram= randomNGramSelection(bigramMatches);
          randomAIArticle= randomAIArticle + selectedNewNGram.bigram2 + " ";
          newNGram1= newNGram2;
          newNGram2= selectedNewNGram.bigram2;
        }
        else
        {
          var monogramMatches = nGramDB.find({type:"monogram"}).fetch();
          selectedNewNGram= randomNGramSelection(monogramMatches);
          randomAIArticle = randomAIArticle+selectedNewNGram.monogram+" ";
          newNGram1= newNGram2;
          newNGram2 = selectedNewNGram.monogram;
        }
      }
    }
    var trigramMatches= nGramDB.find({trigram1:newNGram2, trigram3:"#"});
    if(trigramMatches.legnth>0)
    {
      selectedNewNGram= randomNGramSelection(trigramMatches);
      randomAIArticle= randomAIArticle+selectedNewNGram.trigram2+"#";
    }
    else
    {
      randomAIArticle= randomAIArticle+"#";
    }

  return randomAIArticle;
};

var randomNGramSelection= function(NGrams){
  var totalRawFreq= 0;
  for(NGram= 0; NGram<NGrams.length; NGram++)
  {
    totalRawFreq= totalRawFreq+NGrams[NGram].rawFreq;
  }
  var randomNum = Math.random()*totalRawFreq;
  totalRawFreq = 0;
  for(newNGram= 0; newNGram<NGrams.length; newNGram++)
  {
    totalRawFreq= totalRawFreq+NGrams[newNGram].rawFreq;
    if(totalRawFreq>randomNum)
    {
      return NGrams[newNGram];
    }
  }
};


loadTrainingData = function(){
  nGramDB.remove({});
  nGramDB.insert({type:"monogramFreq", totalFreq:0});
  nGramDB.insert({type:"bigramFreq", totalFreq:0});
  nGramDB.insert({type:"trigramFreq", totalFreq:0});
  var filename = "", articleString = "";
  for(fileNum=1; fileNum<=10; fileNum++)
  {
    console.log("Loading File " + fileNum);
   filename= fileNum+".txt";
   articleString= Assets.getText("article/"+filename);
   //console.log(articleString);
   articleString = articleString.replace(/\r\n/g, " ");
   articleString = articleString.replace(/\n+/g, " ");
   articleString = articleString.replace(/\s+/g, " ");

   articleString = "# "+articleString+" #";
   articleString = articleString.split(" ");
   //console.log(articleString);
   processNGram(articleString);
  }
  //calculateNGramFreq();
};

var processNGram= function(str){
  for(wdNum= 0; wdNum<str.length; wdNum++)
  {
    var searchResult;
    //trigram
    if(wdNum<str.length-2)
    {
      var trigram1 = str[wdNum];
      var trigram2 = str[wdNum+1];
      var trigram3 = str[wdNum+2];
      searchResult = nGramDB.findOne({trigram1:trigram1, trigram2: trigram2, trigram3: trigram3});
      if(searchResult === undefined)
      {
        nGramDB.insert({
          type: "trigram",
          trigram1: trigram1,
          trigram2: trigram2,
          trigram3: trigram3,
          rawFreq:1
        });
      }
      else
      {
        nGramDB.update({
          trigram1: trigram1,
          trigram2: trigram2,
          trigram3: trigram3,
        },{
          $inc: {rawFreq:1}
        });
      }
    }
    nGramDB.update({type:"trigramFreq"}, {$inc: {totalFreq: 1}});
    //bigram
    if(wdNum<str.length-1)
    {
      var bigram1= str[wdNum];
      var bigram2= str[wdNum+1];


      searchResult = nGramDB.findOne({bigram1:bigram1, bigram2: bigram2});
      if(searchResult ===undefined)
      {
        nGramDB.insert({
          type: "bigram",
          bigram1: bigram1,
          bigram2: bigram2,
          rawFreq:1});
      }
      else
      {
        nGramDB.update({
          bigram1: bigram1,
          bigram2: bigram2,
        },{
          $inc: {rawFreq:1}
        });
      }
      nGramDB.update({type:"bigramFreq"}, {$inc:{totalFreq:1}});

    }

    var monogram = str[wdNum];
    searchResult =
    nGramDB.findOne({monogram: monogram});
    if(searchResult ===undefined)
    {
      nGramDB.insert({
        type: "monogram",
        monogram: monogram,
        rawFreq:1});
    }
    else
    {
      nGramDB.update({
        monogram: monogram,
      },{
        $inc: {rawFreq:1}
      });
    }
    nGramDB.update({type:"monogramFreq"}, {$inc:{totalFreq:1}});

  }
  //console.log(nGramDB.find({type:"monogram", rawFreq:{$gte:50}}).fetch());
  //console.log(nGramDB.find({rawFreq:{$gte:5}}).fetch());
};
