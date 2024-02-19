/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the steps in the TODO 🚧
*/
const btn = document.querySelector("button"); // Get the button from the page
if (btn) { // Detect clicks on the button
  btn.onclick = function () {
    // The 'dipped' class in style.css changes the appearance on click
    btn.classList.toggle("dipped");
  };
}


// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});

function setup() {
  noCanvas(); // 不需要画布
  getLocation(); // 调用获取位置的函数
}

function getLocation() {
  if ('geolocation' in navigator) {
    // 浏览器支持地理位置
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      console.log(lat, lon);
      // 使用Google Maps Geocoding API转换经纬度
      let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=YOUR_API_KEY`;
      let response = await fetch(url);
      let data = await response.json();
      let postalCode = findPostalCode(data);
      console.log(postalCode); // 打印邮政编码
    }, showError);
  } else {
    // 浏览器不支持地理位置
    console.log("Geolocation is not supported by this browser.");
  }
}

function findPostalCode(data) {
  // 遍历返回的地址组件，寻找邮政编码
  for (let component of data.results[0].address_components) {
    if (component.types[0] == "postal_code") {
      return component.long_name; // 返回邮政编码
    }
  }
  return "Postal code not found";
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}
