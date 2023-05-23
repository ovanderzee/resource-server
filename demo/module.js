fetch('./logo.svg')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching; Status: ${response.status}`);
        }
        return response.text()
    })
    .then(svg => {
        document.querySelector('div.show-svg').innerHTML = svg
    })
