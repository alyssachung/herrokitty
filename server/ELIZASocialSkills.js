var commonGreetings = [
   "hello", "herro", "wats up", "hey", "SUP", "YO"
];
//定義兩個字串的陣列
var commonFarewells= [
  "bye", "c u", "DIE", "see you",
];

socialResponse = function(msg){
  var responseType = "";
  var upperCaseMsg = msg.toUpperCase();
  //建立功能 移除大小寫之間的差異
  for(index=0 ; index<commonGreetings.length ; index++)
  {
    var greeting = commonGreetings[index].toUpperCase();
    if(upperCaseMsg.indexOf(greeting)>-1)
    {
      responseType = "greetings";
      break;//中斷迴圈執行
    }//比對看訊息裡面有沒有greeting的內容

  }
  for(index=0 ; index<commonFarewells.length ; index++)
  {
    var farewell = commonFarewells[index].toUpperCase();
    if(upperCaseMsg.indexOf(farewell)>-1)
    {
      responseType = "farewells";
      break;//中斷迴圈執行
    }
  }
  if(responseType === "greetings")
  {
    return "Hi"
  }
  else if(responseType ==="farewells")
  {
    return "k bye!"
  }
  else
  {
    return ""
  }
};
