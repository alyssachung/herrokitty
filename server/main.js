
/*
    ELIZA Meteor Template Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 1, 2017
*/

//把msgRecords的mongoDB資料庫連結到msgRecords這個伺服器端的Global Variable
msgRecords = new Mongo.Collection("msgRecords"); //請勿變更此行
var engLexicon = new Mongo.Collection("engLexicon");
nGramDB = new Mongo.Collection("nGramDB");


Meteor.startup(function(){
  //loadTrainingData();
    //var strKeyword = "abcdeFGHIJK1234567 *?!";
  //  var regexpKeyword = /(temperature|weather).*in (\w+)/i; //ans will be K1
    //\w\W ans will be "7 "
    //\d+ 出現一次以上的數字的字串 包含一個數字以上的部分
    //Dd num and non-num combination
    //W is any characters not include symbols including nums
    //  /\w+\W+\w+/g 會印出abc123!def456, GHI789?JKL012
    // D is letters
    //console.log("String:"+str.replace(strKeyword, "hohoho"));
    //console.log("Regexp:"+str.replace(regexpKeyword, "hohoho"));
      //console.log("Regexp:"+str.replace(regexpKeyword, "K1"));
  //  console.log("Str1:"+str1.match(regexpKeyword));
  //  console.log("Str2:"+str2.match(regexpKeyword));
  //  console.log("Str3:"+str2.match(regexpKeyword));
  //所有在程式啟動時會在伺服器執行的程式碼都會放在這裡
    /*engLexicon.remove({});
    var lexiconList = Assets.getText("engLexicon_1000.csv");
    //lexiconList = lexiconList.split("\r\n");

    if(lexiconList.indexOf("\r\n")>-1)
    {
      lexiconList.replace(/\r\n/g, "\n");
    }
    lexiconList = lexiconList.split("\n");

    console.log(lexiconList[0]);
    for(index=0 ; index<lexiconList.length; index++)
    {
      lexiconList[index] = lexiconList[index].split(",");
    }
    var colNames = lexiconList[0];
     for(row=1 ; row<lexiconList.length; row++)//bc the first line is row name
    //for(row=1 ; row<2; row++)
    {
      var word = {};
      for (col=0 ; col<lexiconList[row].length ; col++)
      {
        var colName = colNames[col];
        word[colName] = lexiconList[row][col];
      }
      engLexicon.insert(word);
    }*/
    //console.log(engLexicon.findOne({}));
    //console.log(engLexicon.find({}).fetch().length);
});

//所有大腦(伺服器)的功能都會在這裡定義
Meteor.methods({
  //接收訊息的大腦功能msgReceiver，會接收到一個訊息msg。
  /***請勿變更此功能內容***/
  msgReceiver: function(msg) {

    //每一個訊息都會被放進msgRecords資料庫，而每一筆資料都會包含三種資訊：
    //time代表訊息被存入資料庫的時間(new Date()會得到當下的系統時間)、speaker
    //代表說話者(接收到的訊息的說話者是You)、msg則是訊息本身(接收到的msg變數)
    msgRecords.insert({time: new Date(), speaker: "You", msg: msg});

    //呼叫運算接收到的訊息的內部功能processMsg，並傳送msg訊息
    processMsg(msg);
    //回傳一個執行完畢的訊號
    return;
  },
  //重設訊息資料庫的大腦功能resetELIZA。
  /***除預設訊息的內容之外，請勿變更此功能***/
  resetELIZA: function() {
    //移除所有msgRecords資料庫的記憶
    msgRecords.remove({});
    //移除所有資料後放入一筆預設的訊息資料
    msgRecords.insert({time: new Date(), speaker: "ELIZA", msg: "This is ELIZA. How are you doing today?"});
    //回傳一個執行完畢的訊號
    return;
  }
});

//自訂的大腦功能函數，只能在伺服器內部呼叫。在這邊是由msgReceiver這個大腦功能呼叫
//會接收到一個msg訊息並進行訊息運算與處理
var processMsg = function(msg) {  //請勿變更此行
  //建立一個processResults變數儲存訊息運算處理的結果
  var processResults = "";  //請勿變更此行
  var emotion = "", msgWordsPOS= [];
  //「以下」是你可以編輯的部份，請將你的ELIZA處理訊息的核心程式碼放在以下的段落內
  emotion= emotionChecker(msg);

  processResults = socialResponse(msg);

  msgWordsPOS= posIdentifier(msg, engLexicon);

  if(processResults === "")
  {
    processResults = wordSearch(msg, engLexicon);
  }

  if(processResults === "")
  {
    processResults = weatherInfo(msg);
  }

  //console.log(msg);

  if(processResults === "")
  {
    processResults = produceAIArticle(msg);
  }

  //目前完全沒有訊息處理。所以processResults一定是空字串
  //這邊在判斷processResults是空字串的時候會放進一個預設的訊息
  if(processResults === "")
  {
    processResults = chooseRandomResponse(msg, msgWordsPOS, emotion, engLexicon);
  }

  //「以上」是你可以編輯的部份，請將你的ELIZA處理訊息的核心程式碼放在以上的段落內

  //在msgRecords資料庫放入運算訊息之後的結果，做為ELIZA的回應，請勿變更此行
  msgRecords.insert({time: new Date(), speaker: 'ELIZA', msg: processResults});
};//請勿變更此行
