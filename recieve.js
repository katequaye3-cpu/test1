const maintext = document.querySelector('h1')
const sectext = document.querySelector('p')
const download = document.getElementById('download')
const camera = document.getElementById('camera')
let usedcodes = JSON.parse(localStorage.getItem('usedCodes')) || [];


function checkAndAdd(uniqueCode){
    if(usedcodes.includes(uniqueCode)){
        return false;
    }else{
        usedcodes.push(uniqueCode);
        localStorage.setItem('usedCodes', JSON.stringify(usedcodes));
        return true;
    }
}

download.addEventListener('click', () => {
   const data = localStorage.getItem('usedCodes');
  const a = document.createElement('a');
  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
  a.download = 'used_codes.json';
  a.click();
})

// Add event listener to the button
camera.addEventListener('click', () => {
  // Request camera access
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' } // Use back camera
  })
  .then(stream => {
    // Create a video element to display the camera feed
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = stream;
    video.play();

    // Use jsQR to detect and read QR codes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          // Decrypt the QR code data
          const encryptedData = code.data;
          const secretKey = "Made_By_BM";
          const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
          sectext.textContent = encryptedData;
          maintext.textContent = decryptedData;
          if(checkAndAdd(decryptedData)){
            document.body.style.color = 'green'
          }else if(checkAndAdd(decryptedData) = false){
            document.body.style.color = 'red'
          }
          // Process the decrypted data
          console.log(decryptedData);
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  })
  .catch(error => maintext.textContent = error);
});

