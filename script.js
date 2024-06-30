console.log("lets start javascript");
let currentsong=new Audio();
let songs;
let currfolder;
async function getsongs(folder){
    currfolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)

    let response= await a.text();
    console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")

    songs=[]
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]) 
        }
       
    }
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML +`<li> 
        <img class="invert" src="music.svg" alt="none">
        <div class="info">
            <div>${song.replaceAll("%20"," ") }</div>
            <div>song artist
            </div>
        </div>
        <div class="playnow">
            <span>play now</span>
        <img class="invert" src="play.svg" alt="">
        </div>
                            
        
        
        
        
        </li>`;
        
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })
    
    
}
getsongs()
function convertSecondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    // Add leading zero if seconds is less than 10
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    return minutes + ":" + remainingSeconds;
}


const playMusic = (track,pause=false) =>{
    
    currentsong.src=`/${currfolder}/` + track
    if(!pause){
        currentsong.play()
        play.src="pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
    previous.addEventListener("click",e=>{
        currentsong.pause()
        console.log("previous clicked")
        
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",e=>{
        currentsong.pause()
        console.log("next clicked")
    
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
}

async function main(){
    //get the list of all songs
    
    await getsongs("songs/haryanvi")
    
    playMusic(songs[0],true)

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesSeconds(currentsong.currentTime)}/${convertSecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent +"%";
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0"
    })
    // previous.addEventListener("click",e=>{
    //     currentsong.pause()
    //     console.log("previous clicked")
        
    //     let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    //     if((index-1)>=0){
    //         playMusic(songs[index-1])
    //     }
    // })
    // next.addEventListener("click",e=>{
    //     currentsong.pause()
    //     console.log("next clicked")
    
    //     let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    //     if((index+1)<songs.length){
    //         playMusic(songs[index+1])
    //     }
    // })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        console.log("setting volume to",e.target,e.target.value)
        currentsong.volume=parseInt(e.target.value)/100
    })
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
main()