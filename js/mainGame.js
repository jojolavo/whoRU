const gameData = {
    "1": {
        "text": "On a scale of 1 to 5, how much do you identify with being mysterious and elusive?",
        "choices": {
            "1": [2, ["Vampire"]],
            "2": [2, ["Vampire", "Werewolf"]],
            "3": [2, []],
            "4": [2, ["Cowboy", "Werewolf"]],
            "5": [2, ["Vampire"]]
        }
    },
    "2": {
        "text": "On a scale of 1 to 5, how much do you value freedom and adventure?",
        "choices": {
            "1": [3, ["Cowboy"]],
            "2": [3, ["Cowboy", "Werewolf"]],
            "3": [3, []],
            "4": [3, ["Vampire", "Werewolf"]],
            "5": [3, ["Cowboy"]]
        }
    },
    "3": {
        "text": "On a scale of 1 to 5, how much do you identify with the night and its mysteries?",
        "choices": {
            "1": [4, ["Vampire"]],
            "2": [4, ["Vampire", "Werewolf"]],
            "3": [4, []],
            "4": [4, ["Cowboy", "Werewolf"]],
            "5": [4, ["Vampire"]]
        }
    },
    // Add more questions as needed...
    "4": {
        "text": "Let's find out your true personality!",
        "choices": {
            "Reveal my personality": [0, []] // Final state, show results
        }
    }
};

const personalities = {
    "Vampire": 0,
    "Cowboy": 0,
    "Werewolf": 0
};

let totalAnswers = 0; // Track the total number of answers

function renderState(state) {
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices');

    storyText.textContent = gameData[state].text;
    choicesContainer.innerHTML = '';

    for (const [choice, info] of Object.entries(gameData[state].choices)) {
        const button = document.createElement('button');
        button.textContent = `Rate: ${choice}`;
        button.className = 'choice-button';
        let nextState = info[0];
        button.onclick = () => changeState(nextState, info[1], choice);
        choicesContainer.appendChild(button);
    }
}

function changeState(newState, selectedPersonalities, rating) {
    let weight = 0;

    // Determine the weight based on the user's rating
    if (rating == "1" || rating == "5") {
        weight = 3; // 3 times stronger for 1 or 5
    } else if (rating == "2" || rating == "4") {
        weight = 1; // Normal weight for 2 or 4
    }

    // Adjust the personality scores based on the weighted rating
    selectedPersonalities.forEach(personality => {
        personalities[personality] += weight;
    });

    totalAnswers++; // Increment the total answers
    currentState = newState;

    if (currentState === 0) {
        revealPersonality();
    } else {
        renderState(currentState);
    }
}

function revealPersonality() {
    let maxCount = 0;
    let personality = '';
    const percentages = {}; // To store the percentage for each personality

    // Calculate percentages for each personality
    for (const [name, count] of Object.entries(personalities)) {
        percentages[name] = ((count / totalAnswers) * 100).toFixed(2); // Round to two decimal places
        if (count > maxCount) {
            maxCount = count;
            personality = name;
        }
    }

    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices');
    storyText.textContent = `You are a ${personality}!\n\n` +
                            `Vampire: ${percentages["Vampire"]}%\n` +
                            `Cowboy: ${percentages["Cowboy"]}%\n` +
                            `Werewolf: ${percentages["Werewolf"]}%`;

    choicesContainer.innerHTML = ''; // No more choices

    // Optionally, add a personality-related image
    const img = new Image();
    img.src = `images/${personality.toLowerCase()}.png`; // e.g., vampire.png
    img.className = 'responsive-image';
    storyText.appendChild(img);

    // Restart button
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Try again!';
    restartButton.className = 'choice-button';
    restartButton.onclick = () => location.reload();
    choicesContainer.appendChild(restartButton);
}

function startGame() {
    document.querySelector('.title').style.display = 'none';
    document.getElementById('homescreen').style.display = 'none';
    document.querySelector('.start-button').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    renderState(1); // Start quiz at state 1
}

window.onload = () => {
    renderState(1); // Start the quiz when the page loads
}
