document.addEventListener('DOMContentLoaded', function() {
    const audioFiles = ['audio1.mp3', 'audio2.mp3']; // Replace with actual audio file paths
    const audioList = document.getElementById('audioList');

    audioFiles.forEach(function(audioFile) {
        const listItem = document.createElement('div');
        const audioElement = document.createElement('audio');
        audioElement.setAttribute('controls', 'controls');
        audioElement.src = audioFile;
        listItem.appendChild(audioElement);
        audioList.appendChild(listItem);
    });
});
