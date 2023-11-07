let qrcode = document.querySelector("img");
let text = document.querySelector("input");
let generateBtn = document.querySelector(".generate");
let downloadBtn = document.querySelector(".download");

const scannerSection = document.getElementById("scanner");
const scanBtn = document.querySelector(".scan");
const closeBtn = document.getElementById("close-btn");
const qrVideo = document.getElementById("qr-video");
const qrCanvas = document.getElementById("qr-canvas");
const qrCanvasContext = qrCanvas.getContext("2d");

scanBtn.addEventListener("click", startScanner);
closeBtn.addEventListener("click", closeScanner);

// SCAN
function startScanner() {
  scannerSection.style.display = "block";
  scanBtn.style.display = "none";
  closeBtn.style.display = "block";
  qrVideo.style.display = "block";
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      qrVideo.srcObject = stream;
      qrVideo.play();
      requestAnimationFrame(scan);
    })
    .catch(function (error) {
      console.error("Error accessing camera:", error);
    });
}

function closeScanner() {
  scannerSection.style.display = "none";
  scanBtn.style.display = "block"; // Show the "Scan QR Code" button
  closeBtn.style.display = "none"; // Hide the "Close" button
  qrVideo.srcObject.getTracks().forEach((track) => track.stop());
  qrVideo.style.display = "none";
}

function scan() {
  if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
    qrCanvas.width = qrVideo.videoWidth;
    qrCanvas.height = qrVideo.videoHeight;
    qrCanvasContext.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);

    const imageData = qrCanvasContext.getImageData(
      0,
      0,
      qrCanvas.width,
      qrCanvas.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      alert("QR Code Scanned: " + code.data);
    }

    requestAnimationFrame(scan);
  } else {
    requestAnimationFrame(scan);
  }
}

// GENERATE
generateBtn.addEventListener("click", () => {
  let data = text.value;
  if (data.trim() != "") {
    let baseURL = "https://api.qrserver.com/v1/create-qr-code/";
    let url = `${baseURL}?data=${encodeURI(data)}&margin=10`;
    qrcode.src = url;
  }
});

// DOWNLOAD
downloadBtn.addEventListener("click", () => {
  generateBtn.click();
  let data = text.value;
  if (data.trim() != "") {
    let baseURL = "https://api.qrserver.com/v1/create-qr-code/";
    let url = `${baseURL}?data=${encodeURI(data)}&margin=10`;
    fetch(url)
      .then((resp) => resp.blob())
      .then((blobobject) => {
        let anchor = document.createElement("a");
        anchor.style.display = "none";
        const blob = window.URL.createObjectURL(blobobject);
        anchor.href = blob;
        anchor.download = "qrcode.png";
        anchor.click();
      })
      .catch(() => (text.value = ""));
  }
});
