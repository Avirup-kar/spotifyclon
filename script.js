
let currentsong = new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =Math.floor(seconds % 60);

    const formattedminutes = String(minutes).padStart(2,'0');
    const formattedseconds = String(remainingSeconds).padStart(2,'0');
   

    return `${formattedminutes}:${formattedseconds}`;
}

async function getsongs(folder){  
    currfolder = folder;  
    let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`)
    let responce = await a.text();
   let div = document.createElement("div");
   div.innerHTML = responce;
   let as = div.getElementsByTagName("a");
   songs = [];
   for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
         songs.push(element.href.split(`/${folder}/`)[1])
    }
   }
   let songul =  document.querySelector(".songlist").getElementsByTagName("ul")[0];
   songul.innerHTML = ""
   for (const song of songs) {
       songul.innerHTML = songul.innerHTML + `
       <li>
              <img class="invert" width="34" src="icon/music.svg" alt="">
              <div class="info">
                  <div> ${song.replaceAll("%20", " ")}</div>
                  <div>avi</div>
              </div>
              <div class="playnow">
                  <span>Play Now</span>
                  <img id="play3" class="invert" src="icon/play.svg" alt="">
              </div>
             </li>
             `;
   }
   // play the song while click
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e => {
       e.addEventListener("click", element =>{
           // console.log(e.querySelector(".info").firstElementChild.innerHTML);
           playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

       })
   }) 
   return songs
}
const playMusic = (track, pause = false)=>{
//  let  audio = new Audio("/songs/" + track);
currentsong.src = `/${currfolder}/` + track;
if(pause == false){
    currentsong.play();
    play.src = "icon/pause.svg"
}
  document.querySelector(".song-info").innerHTML = decodeURI(track)
  document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){ 
    let a = await fetch(`/songs/`)
    let responce = await a.text();
   let div = document.createElement("div");
   div.innerHTML = responce;
   let anchor = div.getElementsByTagName("a");
   let cardcon = document.querySelector(".cardcon")
  let ar = Array.from(anchor);
   for (let index = 0; index < ar.length; index++) {
    const e = ar[index];
    if(e.href.includes("/songs")){
        let fold = e.href.split("/").slice(-2)[0]
        let a = await fetch(`/songs/${fold}/info.json`)
    let responce = await a.json();
    console.log(responce); 
    cardcon.innerHTML = cardcon.innerHTML + `<div data-folder="${fold}" class="card">
            <div class="play2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="black">
                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            </div>
           <img src="/songs/${fold}/cover.jpg"  alt="">
          <div class="happy">${responce.title}</div>
          <div class="hits">${responce.description}</div>
          </div> `
    }
}
 //load the playlist whenever the card is clicked
 Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
    })
})
}


// get the list of songs
async function main() {

  await getsongs("songs/ncs");
  
  playMusic(songs[0], true)
  // console.log(songs);
  displayAlbums();

    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "icon/pause.svg";
            play3.src =  "icon/pause.svg"
        }
        else{
            currentsong.pause();
            play.src = "icon/play.svg";
            play3.src ="icon/play.svg";
        }
        
    })
    console.log(play3.src);
    // listen for timeupdate event
 currentsong.addEventListener("timeupdate", ()=>{
    // console.log(currentsong.currentTime, currentsong.duration)
    document.querySelector(".song-time").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime( currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 +"%"
 })
 document.querySelector(".seekbar").addEventListener("click", (e)=>{
    let persent = (e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left = persent + "%";
    currentsong.currentTime = (currentsong.duration)*persent /100;

 })


 
//add a event to listen previous and next click button
previous.addEventListener("click", ()=>{
    console.log('click previous');
    currentsong.pause();
    let index =songs.indexOf(currentsong.src.split("/").slice(-1) [0]);
    if((index - 1) >= 0){
        playMusic(songs[index - 1])
    }
   
})
next.addEventListener("click", ()=>{
    console.log('click next');
    currentsong.pause();
    let index =songs.indexOf(currentsong.src.split("/").slice(-1) [0]);
    if((index + 1) < songs.length){
        playMusic(songs[index + 1])
    }
})

//add a event to listen volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log("setting volume to", e.target.value, "/100");
    currentsong.volume = parseInt(e.target.value)/100
  })

  
 


document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("icon/volume.svg", "icon/mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("icon/mute.svg", "icon/volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})
}
main();

hamburgar.addEventListener("click", () => {
    const leftElement = document.querySelector(".left");

    // Check the current left position using getComputedStyle
    const computedLeft = window.getComputedStyle(leftElement).left;

    // Toggle between showing and hiding the sidebar
    if (computedLeft === "-350px") { // Sidebar is hidden, show it
        leftElement.style.left = "10px"; // Move it into view
        hamburgar.src = "icon/cut.svg"; // Change icon to cut
    } else { // Sidebar is shown, hide it
        leftElement.style.left = "-350px"; // Move it out of view
        hamburgar.src = "icon/hamburgar.svg"; // Change icon back to hamburger
    }
});