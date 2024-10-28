function toggleDescription() {
    var shortDesc = document.getElementById('description-short');
    var fullDesc = document.getElementById('description-full');
    var readMoreLink = document.getElementById('read-more-link');

    if (fullDesc.style.display === 'none') {
        shortDesc.style.display = 'none';
        fullDesc.style.display = 'block';
        readMoreLink.innerHTML = 'Ler menos';
    } else {
        shortDesc.style.display = 'block';
        fullDesc.style.display = 'none';
        readMoreLink.innerHTML = 'Ler mais';
    }
}


    