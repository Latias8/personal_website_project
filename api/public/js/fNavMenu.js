document.addEventListener("DOMContentLoaded", async (event) => {
    await fetchAndDisplayDevlogs();
    const fNaPa = document.getElementById('fNavRoot');
    let currentLevel = 0;
    document.querySelectorAll('.fMoveElemDown').forEach((downElem) => {
        downElem.addEventListener('click', () => {
            currentLevel += 1;
            bigHandler(currentLevel)
        })
    })
    document.querySelectorAll('.fMoveElemUp').forEach((downElem) => {
        downElem.addEventListener('click', () => {
            currentLevel -= 1;
            bigHandler(currentLevel)
        })
    })
    document.querySelectorAll('.projects').forEach((projects) => {
        projects.addEventListener('click', () => {
            currentLevel = 1;
            bigHandler(currentLevel)
        })
    })
    document.querySelectorAll('.producerRacing').forEach((projects) => {
        projects.addEventListener('click', () => {
            currentLevel = 2;
            bigHandler(currentLevel)
        })
    })

    function bigHandler(value) {
        fNaPa.querySelectorAll('.layer').forEach((layer) => {
            layer.style.display = 'none';
        })
        document.querySelector(`.layer${value}`).style.display = 'block';
    }

});