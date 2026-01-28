
async function fetchAndDisplayBlogPosts() {
    const response = await fetch('/entries');
    const data = await response.json();
    data.reverse()

    const rootElement = document.getElementById('root');
    rootElement.innerHTML = '';

    data.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-entry')
        postElement.innerHTML = `
                <h2>${new Date(post.date).toLocaleString()}</h2>
                <p>${post.text}</p>
            `;
        rootElement.appendChild(postElement);
    });
}


async function fetchAndDisplayMessages() {
  const response = await fetch('/messages');
  const data = await response.json();

  const boxElement = document.getElementById('message');
  boxElement.innerHTML = '';

  data.forEach(mess => {
    const currDate = mess.date
    let message_content = mess.message;
    let user = mess.name;

    if (user == undefined || user == '') {
        user = 'guest';
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message')
    messageElement.innerHTML = `
              <span class='chat-name'>[root@${user} ~]$ </span>
              <div class='chat-msg'>${message_content}</div>
              <span class='chat-date'>${currDate}</span>
          `;
    document.getElementById('messages').appendChild(messageElement);
  });
}


async function fetchAndDisplayDevlogs() {
    const response = await fetch('/devlogs');
    //console.log(response)
    const data = await response.json();
    //console.log(data)
    let counter = 0;

    data.forEach(entry => {
        counter += 1;
        let logElem = document.createElement('div');
        logElem.classList.add('exterBtn')
        logElem.innerHTML = `
            <button class='fNavElem fLogElem fLE${counter}'></button>
            <p>log ${counter}</p>
        `;
        document.querySelector('.layer2').querySelector('.buttons').appendChild(logElem);

        let layerElem = document.createElement('div');
        layerElem.classList.add('layer')
        layerElem.classList.add(`layer10${counter}`)
        layerElem.innerHTML = `
            <h3>&gt <a class='fNavCookie projects'>Projects</a> &gt <a class='fNavCookie producerRacing'>producer_racing</a> &gt log ${counter}</h3>
        `
        document.getElementById('fNavRoot').appendChild(layerElem);

        let logTitle = entry.title
        let currDate = entry.date
        let logContent = entry.message;
        let logGif = entry.loggif;

        let devlogElement = document.createElement('div');
        devlogElement.classList.add('devlog_instance')
        devlogElement.innerHTML = `
            <div id='devlogs'>
                <span class='devlog-name'>${logTitle}</span>
                <span class='devlog-date'>${currDate}</span>
                <div class='sub-log'>
                <span class='devlog-msg'>${logContent}</span>
                <div><img class='chat-gif' src="./images/devl/${logGif}" width="300px" alt=''></div>
                </div>
            </div>
            `;
        document.querySelector(`.layer10${counter}`).appendChild(devlogElement);
    });

    document.querySelectorAll('.fLogElem').forEach(logElem => {
        let currVal = logElem.getAttribute('class');
        let lastChar = currVal.slice(-1);
        //console.log(lastChar)
        logElem.addEventListener('click', () => {
            document.getElementById('fNavRoot').querySelectorAll('.layer').forEach((layer) => {
                layer.style.display = 'none';
            })
            document.querySelector(`.layer10${lastChar}`).style.display = 'block';
        })
    })
}


async function fetchAndDisplayNewestVid() {
    /*
    const response = await fetch('/youtube');
    const data = await response.json();

     */
    const response = await fetch('/vids');
    /*console.log(response)*/
    const dataPrePre = await response.json()
    const dataPre = dataPrePre.vid_list
    /*console.log(dataPre)*/
    if (dataPre.length != 0) {
        const data = dataPre[0];
        /*console.log(data)*/
        const musicElement = document.getElementById('newvid');
        musicElement.innerHTML = `<h3>Newest release:</h3>`;
        const fullBlock = document.createElement('DIV');
        const block2 = document.createElement('DIV')

        let viewCount = data.views
        let title = data.title;
        let thumbnail = data.thumbnailUrl
        let vidUrl = data.videoUrl

        block2.innerHTML = `
              <p class='vid-title'>Title:</p>
              <div><strong>${title}</strong></div>
              <div class='vid-views' style='margin-top: 16px'>Current viewcount: <mark>${viewCount}</mark></div>
          `;

        fullBlock.innerHTML = `
              <a href='${vidUrl}' target='_blank'><img class='vid-thumb' src='${thumbnail}' alt=''></a>
          `;
        fullBlock.appendChild(block2)
        /*console.log('latest video loaded')*/

        musicElement.appendChild(fullBlock)

        fullBlock.classList.add('fullBlock')
    }
}

async function fetchAndDisplayBestVid() {
    /*
    const response = await fetch('/youtube/best');
    const data = await response.json();
     */
    const response = await fetch('/vids');
    /*console.log(response)*/
    const dataPrePre = await response.json()
    const dataPre = dataPrePre.vid_list
    /*console.log(dataPre)*/
    if (dataPre.length != 0) {
        const data = dataPre[1];
        /*console.log(data)*/
        const musicElement = document.getElementById('bestvid');
        musicElement.innerHTML = `<h3>Most viewed release:</h3>`;
        const fullBlock = document.createElement('DIV');
        const block2 = document.createElement('DIV')

        let viewCount = data.views
        let title = data.title;
        let thumbnail = data.thumbnailUrl
        let vidUrl = data.videoUrl

        block2.innerHTML = `
                  <p class='vid-title'>Title:</p>
                  <div><strong>${title}</strong></div>
                  <div class='vid-views' style='margin-top: 16px'>Current viewcount: <mark>${viewCount}</mark></div>
              `;

        fullBlock.innerHTML = `
                  <a href='${vidUrl}' target='_blank'><img class='vid-thumb' src='${thumbnail}' alt=''></a>
              `;
        fullBlock.appendChild(block2)
        /*console.log('best video loaded')*/

        musicElement.appendChild(fullBlock)

        fullBlock.classList.add('fullBlock')
    }
}


const moodList = [{"moodcl":"status-low","moodte":" poor"},{"moodcl":"status-misc","moodte":" could be better"},{"moodcl":"status-gr","moodte":" great"},{"moodcl":"status-ok","moodte":" peak"}]
const sumList = [{"moodcl":"status-garb","moodte":" Doing like garbage..."},{"moodcl":"status-okay","moodte":" Doing okay."},{"moodcl":"status-great","moodte":" Doing great!"},{"moodcl":"status-fan","moodte":" Doing FANTASTIC!!!"}]


async function displayMood() {
    const moodres = await fetch('/mood');
    const data = await moodres.json();
    data.reverse()
    const finFormData = data[0]

    const energElement = document.querySelector('.energ');
    const motivElement = document.querySelector('.motiv');
    const summaElement = document.querySelector('.summa');
    energElement.innerHTML = '';
    motivElement.innerHTML = '';

    const energy = finFormData.energy;
    const motivation = finFormData.motivation;
    const pre = (energy + motivation) / 2
    const summary = Math.floor(pre)

    if (energy <= 3) {
        let energdef = moodList[0];
        assignEnergy(energdef);
    } else if (energy <= 5) {
        let energdef = moodList[1];
        assignEnergy(energdef);
    } else if (energy <= 7) {
        let energdef = moodList[2];
        assignEnergy(energdef);
    } else if (energy <= 10) {
        let energdef = moodList[3];
        assignEnergy(energdef);
    }

    if (motivation <= 3) {
        let motivdef = moodList[0];
        assignMotivation(motivdef);
    } else if (motivation <= 5) {
        let motivdef = moodList[1];
        assignMotivation(motivdef);
    } else if (motivation <= 7) {
        let motivdef = moodList[2];
        assignMotivation(motivdef);
    } else if (motivation <= 10) {
        let motivdef = moodList[3];
        assignMotivation(motivdef);
    }

    if (summary <= 3) {
        let sumdef = sumList[0];
        assignSum(sumdef);
    } else if (summary <= 5) {
        let sumdef = sumList[1];
        assignSum(sumdef);
    } else if (summary <= 7) {
        let sumdef = sumList[2];
        assignSum(sumdef);
    } else if (summary <= 10) {
        let sumdef = sumList[3];
        assignSum(sumdef);
    }



    function assignEnergy(chosen) {
        const energStatusElement = document.createElement('span');
        energStatusElement.classList.add(chosen.moodcl);
        energStatusElement.innerHTML = chosen.moodte;
        energElement.appendChild(energStatusElement);
    }
    function assignMotivation(chosen) {
        const motivStatusElement = document.createElement('span');
        motivStatusElement.classList.add(chosen.moodcl);
        motivStatusElement.innerHTML = chosen.moodte;
        motivElement.appendChild(motivStatusElement);
    }
    function assignSum(chosen) {
        const sumStatusElement = document.createElement('span');
        sumStatusElement.classList.add(chosen.moodcl);
        sumStatusElement.innerHTML = chosen.moodte;
        summaElement.appendChild(sumStatusElement);
    }


}

async function loadContent() {
    await Promise.all([
        fetchAndDisplayBlogPosts(),
        /*fetchAndDisplayMessages(),*/
        /*fetchAndDisplayDevlogs(),*/
        displayMood(),
        fetchAndDisplayNewestVid(),
        fetchAndDisplayBestVid(),
        streamstat(),
        getDrinks()
    ]);
}

window.onload = function() {
    loadContent();
    chatscroll();
    sinceVidFetch();
    let isMouseOver = false;

    if (localStorage.getItem("alreadyClickedBruh") === "true") {
        let cover = document.querySelector('.main-cover');
        let box = document.querySelector('.user-warn-notif-parent')
        let gramps = document.querySelector('.user-warn-notif-grandparent')
        cover.style.opacity = '0';
        cover.style.pointerEvents = 'none';
        box.style.opacity = '0';
        box.style.pointerEvents = 'none';
        gramps.style.pointerEvents = 'none';
    }

    document.querySelector('.main-cover').addEventListener('click', () => {
        let cover = document.querySelector('.main-cover');
        let box = document.querySelector('.user-warn-notif-parent')
        let gramps = document.querySelector('.user-warn-notif-grandparent')
        cover.style.opacity = '0';
        cover.style.pointerEvents = 'none';
        box.style.opacity = '0';
        box.style.pointerEvents = 'none';
        gramps.style.pointerEvents = 'none';
        localStorage.setItem("alreadyClickedBruh", "true")
    }, true);
    document.querySelectorAll('.widg-elem').forEach((elem) => {
        elem.addEventListener('mousedown', () => {
            elem.style.scale = '0.9'
        })
        elem.addEventListener('mouseup', () => {
            if (isMouseOver) {
                elem.style.scale = '1.1'
            } else {
                elem.style.scale = '1'
            }
        })
        elem.addEventListener('mouseover', () => {
            isMouseOver = true;
            elem.style.scale = '1.1'
        })
        elem.addEventListener('mouseout', () => {
            isMouseOver = false;
            elem.style.scale = '1'
        })
    })
    document.getElementById('whoami').addEventListener('click', () => {
        window.location.href = 'whoami.html'
    })
    const bro = document.getElementById('lefter')
    let broCounter = 0
    bro.addEventListener('click', () => {
        broCounter += 1;
        if (broCounter == 1) {
            bro.textContent = 'stop'
        }
        if (broCounter == 2) {
            bro.textContent = 'I said stop'
        }
        if (broCounter == 3) {
            bro.textContent = 'STAAHHHPPPPP'
        }
        if (broCounter == 4) {
            bro.textContent = 'WHAT PART OF STOP DO YOU NOT UNDERSTAND?!'
        }
        if (broCounter == 5) {
            bro.textContent = 'JHJHSUHUHASDZGZASTZGZSUCUSKAAFLALDFJHUVU'
        }
        if (broCounter == 6) {
            location.href = 'https://youtu.be/xvFZjo5PgG0?si=SyFERjlkMao1Zfgu'
        }
    })
    setInterval(function(){
        const now = new Date();
        const hours = now.getHours(); /*now.getHours()*/
        const minutes = now.getMinutes();

        if (hours.toString().length == 2) {
            document.getElementById('hours').innerHTML = hours.toString();
        } else {
            document.getElementById('hours').innerHTML = '0' + hours.toString();
        }
        if (minutes.toString().length == 2) {
            document.getElementById('minutes').innerHTML = minutes.toString();
        } else {
            document.getElementById('minutes').innerHTML = '0' + minutes.toString();
        }

        /* // COLORS N SHIT turned this off along with the color setting just below cuz I like dark nyeheh

        function getBackgroundColor(hour) {
            let color;
            if (hour >= 5 && hour < 8) {
                const progress = (hour - 5) / 3;
                color = interpolateColor([204, 178, 149], [204, 133, 56], progress);
            } else if (hour >= 8 && hour < 17) {
                const progress = (hour - 8) / 9;
                color = interpolateColor([108, 164, 200], [56, 104, 144], progress);
            } else if (hour >= 17 && hour < 20) {
                const progress = (hour - 17) / 3;
                color = interpolateColor([204, 112, 0], [112, 0, 0], progress);
            } else {
                const progress = (hour >= 20 ? (hour - 20) / 9 : (hour + 4) / 9);
                color = interpolateColor([20, 20, 89], [0, 0, 0], progress);
            }
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }

        function interpolateColor(color1, color2, factor) {
            if (factor === undefined) factor = 0.5;
            const result = color1.slice();
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
            }
            return result;
        }



        function getOpacity(hour) {
            let opacity;
            if (hour >= 5 && hour < 8) {
                const progress = -1 * (5 - hour) / 3;
                opacity = progress;
            } else if (hour >= 8 && hour < 17) {
                opacity = 0;
            } else if (hour >= 17 && hour < 20) {
                const progress = (17 - hour) / 3;
                opacity = 1 + progress;
            } else {
                opacity = 1;
            }
            return opacity;
        }

        document.querySelector('body').style.backgroundColor = getBackgroundColor(hours);
        document.getElementById('road_shadow').style.opacity = getOpacity(hours);
        document.querySelector('.main-content').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${getOpacity(hours) * 0.8}), rgba(0, 0, 0, ${getOpacity(hours) * 0.8})), url('./images/va11halla_1.jpg')`;/*url('./images/houseline 1 2.png')*/
    }, 1000);

    async function sinceVidFetch() {
        const response = await fetch('/vids');
        const dataPrePre = await response.json()
        const dataPre = dataPrePre.received_time
        let music_box = document.getElementById('sinceFetchedOuter')
        music_box.innerHTML = `
            <p>Last sync:</p>
            <span id='siViFe'></span>
            `
        setInterval(function () {
            /*console.log(`Time now: ${new Date()}, Time then: ${dataPre}`)*/
            let time_since = new Date() - new Date(dataPre)
            const totalSeconds = Math.floor(time_since / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            document.getElementById('siViFe').innerHTML = `
            ${hours}:${minutes}:${seconds}
            `
        }, 1000)
    }

    async function chatscroll() {
        const mcnj = await fetch('/messcount');
        const mcn = await mcnj.json()
        const mc = mcn.length;
        if (mc > 0) {
            let chat = document.getElementById('messages')
            let bottomElem = chat.querySelector('p');
            bottomElem.scrollIntoView({ block: 'end' })
        }
    }

    document.querySelector('.youtube_link').addEventListener('click', function () {
        window.open('https://www.youtube.com/@Isigia_Official')
    });

    document.querySelector('.twitch_link').addEventListener('click', function () {
        window.open('https://twitch.tv/isigia')
    })



};

async function getDrinks() {
    const response = await fetch('/drink')
    const data = await response.json()
    let drink_box = document.getElementById('drink_box')
    drink_box.innerHTML = `
            <div style='width: 500px;'>
                <div class='motivation ' style='display: flex; justify-content: flex-start; padding: 0 10px;'>
                    <p style='padding: 16px 10px 0 0; margin: 0'>Name:</p>
                    <p style='color: #36fda0; padding: 16px 10px 0 0; margin: 0'>${data.name}</p>
                </div>
                <div class='motivation ' style='display: flex; flex-direction: column; align-items: flex-start; padding: 0 10px'>
                    <p style='padding: 16px 10px 16px 0; margin: 0'>Desc:</p>
                    <p style='color: #ffffff; margin-top: 0; text-align: justify'>${data.desc}</p>
                </div>
            </div>
            
            <div style='display: flex; align-items: center; align-content: center; justify-content: center; border: 1px solid white; margin-top: 16px; width: 207px; background-color: black'>
                <img height='105px' src='./images/drinks_imgs/${data.pic}'>
            </div>
            `
}

async function streamstat() {
    const response = await fetch('/stream');
    const data = await response.json();

    const { youtubeLive: yt, twitchLive: tw } = data;

    const yt_elem = document.querySelector('.st_yt')
    const tw_elem = document.querySelector('.st_tw')

    if (yt === true) {
        yt_elem.innerHTML = `
        <span>
            [
            <span class='status-yuhUh'> STREAMING</span>
            ]
        </span>
        `
    } else {
        yt_elem.innerHTML = `
        <span>
            [
            <span class='status-nuhUh'> OFFLINE</span>
            ]
        </span>
        `
    }

    if (tw === true) {
        tw_elem.innerHTML = `
        <span>
            [
            <span class='status-ok'> STREAMING</span>
            ]
        </span>
        `
    } else {
        tw_elem.innerHTML = `
        <span>
            [
            <span class='status-nuhUh'> OFFLINE</span>
            ]
        </span>
        `
    }
}