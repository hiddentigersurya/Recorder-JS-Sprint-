let video=document.querySelector('video');
let recordBtnCont=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn=document.querySelector(".capture-btn");
let transparentColor="transparent";
let recordFlag=false;

let recorder;//store undefined 
let chunks=[];//media data is stored in chunks
let constraints={
    audio:true,
    video:true,
}
//navigator is a global obj where this gives info about browser
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;
    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //convert the media chunks to video
        let blob=new Blob(chunks, {type:"video/mp4"});
        let videoURL=URL.createObjectURL(blob);
        let a=document.createElement('a');
        a.href=videoURL;
        a.download="stream.mp4";
        a.click();
    })
    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;
        recordFlag=!recordFlag;
        if(recordFlag){ //start
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })
});

//video is actually captures as chunks, but what these chunks will have?
//chunks will have the media data in binary format/ a frame of video

captureBtnCont.addEventListener("click",(e)=>{
    captureBtnCont.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let imageURL=canvas.toDataURL("image/jpeg",1.0) ;//converts the canvas to image
    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filtering part
    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);
    
    let a=document.createElement('a');
        a.href=imageURL;
        a.download="Image.jpeg";
        a.click();
    //remove animations
    setTimeout(()=>{
        captureBtnCont.classList.remove("scale-capture");
        //captureBtn.classList.remove("scale-capture");
    },500);

})

//filtering logic
let filter=document.querySelector(".filter-layer");
let allFilter=document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor=transparentColor;
    })
})
































/* how to calculate the thime is that 
1-Initialize a variable that actually stores no.of seconds
2-When ever this function is called, increment the counter by 1
3-Convert this counter to minutes and seconds
1hr=60min=3600sec
3725%3600=min count || 3765/3600=1hr
*/
let timerID;
let counter=0;
let timer=document.querySelector(".timer");
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        let totalSeconds=counter;
        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;
        let minutes=Number.parseInt(totalSeconds/60);
         totalSeconds=totalSeconds%60;
         let seconds=totalSeconds;
         hours=(hours<10) ? `0${hours}`:hours;
         minutes=(minutes<10) ? `0${minutes}`:minutes;
         seconds=(seconds<10) ? `0${seconds}`:seconds;
         timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID=setInterval(displayTimer,1000);//we are caling the function every 1 sec

}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    timer.style.display="none";
}