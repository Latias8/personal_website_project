const moodList = [{"moodcl":"status-nuhUh","moodte":" LOW"},{"moodcl":"status-misc","moodte":" MEDIUM"},{"moodcl":"status-ok","moodte":" HIGH"}]

async function displayMood() {
    const response = await fetch('/mood');
    const data = await response.json();
    data.reverse()

    const energElement = document.querySelector('.energ');
    const motivElement = document.querySelector('.motiv');
    const summaElement = document.querySelector('.summa');
    energElement.innerHTML = '';
    motivElement.innerHTML = '';

    const energy = data.energy;
    const motivation = data.motivation;

    if (energy <= 3) {
        const energdef = moodList[0]
        assignEnergy(energdef)
    } else if (energy <= 7) {
        let energdef = moodList[1]
        assignEnergy(energdef)
    } else {
        let energdef = moodList[2]
        assignEnergy(energdef)
    }

    if (motivation <= 3) {
        let motivdef = moodList[0]
        assignMotivation(motivdef)
    } else if (energy <= 7) {
        let motivdef = moodList[1]
        assignMotivation(motivdef)
    } else {
        let motivdef = moodList[2]
        assignMotivation(motivdef)
    }



    function assignEnergy(chosen) {
        const energStatusElement = document.createElement('span');

        energStatusElement.classList.add(chosen.moodcl);
        energStatusElement.innerHTML = chosen.moodte;
        /*
        energElement.innerHTML = `
        [
        ${energStatusElement}
        ]
        `
         */
        energElement.appendChild(energStatusElement);
    }
    function assignMotivation(chosen) {
        const motivStatusElement = document.createElement('span');

        motivStatusElement.classList.add(chosen.moodcl);
        motivStatusElement.innerHTML = chosen.moodte;
        /*
        motivElement.innerHTML = `
        [
        ${motivStatusElement}
        ]
        `
         */
        motivElement.appendChild(motivStatusElement);
    }


}

async function loadMood() {
    await Promise.all([
        displayMood()
    ]);
}

// Call the function to load content when the page loads
window.onload = function() {
    loadMood();
}