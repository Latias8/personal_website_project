// Function to fetch and display blog posts
async function fetchAndDisplayBlogPosts() {
    const response = await fetch('/entries');
    const data = await response.json();
    data.reverse()

    // Clear existing blog posts
    const rootElement = document.getElementById('root');
    rootElement.innerHTML = '';

    // Display each blog post
    data.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-entry')
        postElement.innerHTML = `
                <h2>${new Date(post.date).toLocaleString()}</h2>
                <p>${post.text}</p>
            `;
        rootElement.appendChild(postElement);
        console.log('post loaded')
    });
}

/*
async function fetchAndDisplayMessages() {
  const response = await fetch('/messages');
  const data = await response.json();

  // Clear existing blog posts
  const boxElement = document.getElementById('message');
  boxElement.innerHTML = '';

  // Display each blog post
  data.forEach(mess => {
    const currDate = mess.date
    let message_content = mess.message;

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message')
    messageElement.innerHTML = `
              <span class='chat-name'>anon>> </span>
              <span class='chat-msg'>${message_content}</span>
              <span class='chat-date'>${currDate}</span>
          `;
    document.getElementById('messages').appendChild(messageElement);
    console.log('message loaded')
  });
}
*/

async function fetchAndDisplayDevlogs() {
    const response = await fetch('/devlogs');
    const data = await response.json();

    // Display each devlog
    data.forEach(entry => {
        const logTitle = entry.title
        const currDate = entry.date
        let logContent = entry.message;
        let logGif = entry.loggif;

        const devlogElement = document.createElement('div');
        devlogElement.classList.add('chat-message')
        devlogElement.innerHTML = `
                <span class='chat-name'>${logTitle}</span>
                <span class='chat-date'>${currDate}</span>
                <div class='sub-log'>
                <span class='chat-msg'>${logContent}</span>
                <div><img class='chat-gif' src="./images/devl/${logGif}" width="300px" alt=''></div>
                </div>

            `;
        document.getElementById('messages').appendChild(devlogElement);
        console.log('message loaded')
    });
}

async function fetchAndDisplayNewestVid() {
    const response = await fetch('/youtube');
    const data = await response.json();

    // Clear existing video
    const musicElement = document.getElementById('music_element');
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
              <a href='${vidUrl}'><img class='vid-thumb' src='${thumbnail}' alt=''></a>
          `;
    fullBlock.appendChild(block2)
    console.log('latest video loaded')

    musicElement.appendChild(fullBlock)

    fullBlock.id = 'fullBlock'
}

const moodList = [{"moodcl":"status-low","moodte":" poor"},{"moodcl":"status-misc","moodte":" could be better"},{"moodcl":"status-ok","moodte":" peak"}]
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
    } else if (energy <= 7) {
        let energdef = moodList[1];
        assignEnergy(energdef);
    } else if (energy <= 10) {
        let energdef = moodList[2];
        assignEnergy(energdef);
    }

    if (motivation <= 3) {
        let motivdef = moodList[0];
        assignMotivation(motivdef);
    } else if (motivation <= 7) {
        let motivdef = moodList[1];
        assignMotivation(motivdef);
    } else if (motivation <= 10) {
        let motivdef = moodList[2];
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

// Call the function to fetch and display blog posts when the page loads
async function loadContent() {
    await Promise.all([
        fetchAndDisplayBlogPosts(),
        /*fetchAndDisplayMessages(),*/
        fetchAndDisplayDevlogs(),
        displayMood(),
        fetchAndDisplayNewestVid()
    ]);
}

// Call the function to load content when the page loads
window.onload = function() {
    loadContent();
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
        const hours = now.getHours();
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

        function getBackgroundColor(hour) {
            let color;
            if (hour >= 5 && hour < 8) {
                // Dawn (5 AM - 8 AM): Darker yellow to darker orange
                const progress = (hour - 5) / 3;
                color = interpolateColor([204, 178, 149], [204, 133, 56], progress);
            } else if (hour >= 8 && hour < 17) {
                // Day (8 AM - 5 PM): Darker light blue to darker deeper blue
                const progress = (hour - 8) / 9;
                color = interpolateColor([108, 164, 200], [56, 104, 144], progress);
            } else if (hour >= 17 && hour < 20) {
                // Dusk (5 PM - 8 PM): Darker orange to darker red
                const progress = (hour - 17) / 3;
                color = interpolateColor([204, 112, 0], [112, 0, 0], progress);
            } else {
                // Night (8 PM - 5 AM): Darker dark blue to black
                const progress = (hour >= 20 ? (hour - 20) / 9 : (hour + 4) / 9);
                color = interpolateColor([20, 20, 89], [0, 0, 0], progress);
            }
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }

        // Helper function to interpolate between two colors
        function interpolateColor(color1, color2, factor) {
            if (factor === undefined) factor = 0.5;
            const result = color1.slice();
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
            }
            return result;
        }

        // Function to get the opacity for the road_shadow element
        function getOpacity(hour) {
            let opacity;
            if (hour >= 5 && hour < 8) {
                // Dawn (5 AM - 8 AM): Opacity increases from 0 to 1
                const progress = (hour - 5) / 3;
                opacity = progress;
            } else if (hour >= 8 && hour < 17) {
                // Day (8 AM - 5 PM): Opacity is 0
                opacity = 0;
            } else if (hour >= 17 && hour < 20) {
                // Dusk (5 PM - 8 PM): Opacity decreases from 1 to 0
                const progress = (hour - 17) / 3;
                opacity = 1 - progress;
            } else {
                // Night (8 PM - 5 AM): Opacity is 1
                opacity = 1;
            }
            return opacity;
        }

        document.querySelector('body').style.backgroundColor = getBackgroundColor(hours);
        document.getElementById('road_shadow').style.opacity = getOpacity(hours);
        document.querySelector('.main-content').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${getOpacity(hours) * 0.8}), rgba(0, 0, 0, ${getOpacity(hours) * 0.8})), url('./images/houseline 1 2.png')`;
    }, 1000);

};