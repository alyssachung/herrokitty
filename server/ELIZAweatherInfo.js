weatherInfo= function(msg){
  var time = "present";
  var weatherRegex = /(temperature|weather).*in (\w+)/i;
  var timeRegex = /will|tomorrow|tmro/ig;
  var weatherRequest = msg.match(weatherRegex);
  if(weatherRequest ===null)
  {
    return "";

  }
  else
  {
    if(msg.match(timeRegex)!==null)
    {
      time= "future";
    }
    var lastArrayPos = weatherRequest.length-1;
    var targetCity = weatherRequest[lastArrayPos];
    console.log(targetCity);
    var APIkey = "0f9acd286be670dbec09507843f8f78b"
    var wtInfoURL;
    if(time ==="present")
    {
       wtInfoURL = "http://API.OPENWEATHERMAP.org/data/2.5/weather?APPID="+APIkey+"&q="+targetCity+"&units=metric";
    }
    else
    {
      wtInfoURL = "http://API.OPENWEATHERMAP.org/data/2.5/forecast?APPID="+APIkey+"&q="+targetCity+"&units=metric&cnt=24";
    }
    var wtData, wtDataMsg;
    try
    {
      wtData= HTTP.get(wtInfoURL);
      wtData= wtData.data;
      if(time==="present")
      {
          var wtDataMsg= "It is " +wtData.weather[0].description+", and the current temp is "+wtData.main.temp+"C.";
      }
      else
      {
      wtData= wtData.list[23];
      wtDataMsg= "It is " +wtData.weather[0].description+" tmro, and the current temp is "+wtData.main.temp+"C.";
      }

      return wtDataMsg;
    }
    catch(error)
    {
      if(error.response.data.cod ==="404")
      {
        return"sorry i dunno this city";
      }
      else
      {
       return"sorry internet no good";
      }
    }

  //   var wtData= HTTP.get(wtInfoURL);
  //   wtData= wtData.data;
  // var wtDataMsg= "It is " +wtData.weather[0].description+", and the current temp is "+wtData.main.temp+"C.";
  // return wtDataMsg;

    //console.log(wtData);
    //HTTP.get(wtInfoURL, processWtData);

  }
};

// var processWtData = function(error, result){
//   var wtData;
//   if (error !== null)
//   {
//
//     wtData = error.response.data;
//     if(wtData.cod==="404")
//     {
//       console.log("sry idk this city")
//       return"SORRY IDK THIS CITYYYY";
//
//     }
//     else
//     {
//         console.log("sry no internet connection")
//         return "SORRY BAD INTERNET CONNECTION!"
//     }
//   }
//   else
//   {
//     wtData = result.data;
//     console.log("It's "+wtData.weather[0].description+" and the current temp is "+wtData.main.temp+ "C." + " The estimated highest temp will be "+wtData.main.temp_max+"C, lowest temp will be " +wtData.main.temp_min+ "C. The wind speed is "+ wtData.wind.speed +" m/s.")
//   }
// };
