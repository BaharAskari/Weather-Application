

const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoText = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = wrapper.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");


let api;

inputField.addEventListener("keyup" , e =>{
  // if user pressed enter btn and input value is not empty
  if(e.key == "Enter" && inputField.value != ""){
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click" , ()=>{
  if(navigator.geolocation){ //if browser support geolocation api
      navigator.geolocation.getCurrentPosition(onSuccess , onError);
  }else{
    alert("your browser does not support geolocation api!");
  }
});

function onSuccess(position){
  const {latitude, longitude} = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=babec0ae060296098be54c501c5305d5`;
  fetchData();
}


function onError(error){
  infoText.innerText = error.message;
  infoText.classList.add("error");
}


function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=babec0ae060296098be54c501c5305d5`;

  fetchData();
}

function fetchData(){
  infoText.innerText = "Getting weather details...";
  infoText.classList.add("pendding");

  //getting api response and returning it with parsing into js obj and in another
  //then function calling weatherDetails function with passing api result as an argument

  fetch(api).then( response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
  if(info.cod == "404"){
     infoText.innerText = `${inputField.value} isn't a valid city name!`;
      infoText.classList.replace("pendding", "error");
  }else{

     // getting required properties value from the info object
     const city = info.name;
     const country = info.sys.country;
     const {description, id} = info.weather[0];
     const {feels_like, humidity, temp} = info.main;

     //using custom icon according to the id which api return us

     if(id == 800){
       wIcon.src = "Icons/clear.svg";
     }
      else if(id >= 200 && id <= 232){
       wIcon.src = "Icons/storm.svg";
     }
        else if(id >= 600 && id <= 622){
       wIcon.src = "Icons/snow.svg";
     }
        else if(id >= 701 && id <= 781){
       wIcon.src = "Icons/haze.svg";
     }
        else if(id >= 801 && id <= 804){
       wIcon.src = "Icons/cloud.svg";
     }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
       wIcon.src = "Icons/rain.svg";
     }
     
     // passing these values to a particular html element
     wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
      wrapper.querySelector(".weather").innerText = description ;
     wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
     wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
      wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
     
     infoText.classList.remove("pendding", "error");
     wrapper.classList.add("active");
     console.log(info);
  }
}

//weather app and arrow icon

arrowBack.addEventListener("click" , ()=>{
  wrapper.classList.remove("active");
})