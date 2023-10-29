const shutdownButton = document.getElementById('shutdown-button');
shutdownButton.addEventListener('click', () => {
    fetch('/shutdown', { method: 'POST' })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
});
