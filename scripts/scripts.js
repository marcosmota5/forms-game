// Global variables used by the game
var correctAnswersNumber = 0;
var maxCorrectAnswersNumber = 0;
var availableAnswers = 0;
var counterIncrementAvailableAnswer = 0;
var soundEnabled = true;
var isTipAnswer = false;
const correctSound = new Audio("./sounds/correct-answer.mp3");
const wrongSound = new Audio("./sounds/wrong-answer.mp3");
const tipSound = new Audio("./sounds/tip.mp3");

// ***************************************
// These codes for the toast notifications were gotten from the website: https://www.codingnepalweb.com/toast-notification-html-css-javascript/
// and adapted to my needs
// ***************************************
const notifications = document.querySelector(".notifications");

// Object containing details for different types of toasts
const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',

    },
    error: {
        icon: 'fa-circle-xmark',

    },
    warning: {
        icon: 'fa-triangle-exclamation',

    },
    info: {
        icon: 'fa-circle-info',

    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms

    const frameContainer = document.getElementById('frame-container');
    frameContainer.classList.remove('disabled-element');

}

const createToast = (id, text) => {
    const frameContainer = document.getElementById('frame-container');

    frameContainer.classList.toggle('disabled-element');


    // Getting the icon and text for the toast based on the id passed
    const { icon } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <div class="toast-texts">${text}</div>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// ***************************************
// ***************************************


// Adds an event listener to run the codes every time the site is open
document.addEventListener('DOMContentLoaded', function () {
    // Gets/generates the forms
    getForms();

    // Get the correct answers from the session
    var correctAnswersSaved = sessionStorage.getItem("correct-answers");

    // If the correct answers is greater than 0, set the span element to its number
    if (correctAnswersSaved > 0) {
        correctAnswersNumber = correctAnswersSaved;

        const correctAnswers = document.getElementById('correct-answers');

        correctAnswers.innerHTML = 'Correct answers: ' + correctAnswersNumber;
    }

    // Get the max correct answers from the session
    var maxCorrectAnswersSaved = sessionStorage.getItem("max-correct-answers");

    // If the max correct answers is greater than 0, set the span element to its number
    if (maxCorrectAnswersSaved > 0) {
        maxCorrectAnswersNumber = maxCorrectAnswersSaved;

        const maxCorrectAnswers = document.getElementById('max-correct-answers');

        maxCorrectAnswers.innerHTML = 'Max correct answers: ' + maxCorrectAnswersNumber;
    }

    // Get the amount of available answers from the session
    var availableAnswersSaved = sessionStorage.getItem("available-answers");

    // If the available answers on the session is null, set the value used to 3
    if (availableAnswersSaved == null) {
        availableAnswers = 3;
    } else {
        availableAnswers = availableAnswersSaved;
    }

    // Set the available answers count to the span element
    const availableAnswersCount = document.getElementById('available-answers-count');

    availableAnswersCount.innerHTML = availableAnswers;
});

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 * 
 * @param {number} min - The minimum value of the range (inclusive).
 * @param {number} max - The maximum value of the range (inclusive).
 * @returns {number} A random integer between the specified minimum and maximum values.
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generates the shapes and add them to the forms
 */
async function getForms() {
    // Tries to generate the forms
    try {
        // Gets a random id
        const id = getRndInteger(1, 2189);

        // Gets the data from the file. The getData is a asynchronous function (because the file read could take time), so call it with the await keyword in order to wait for the result
        const data = await getData(id);

        // Gets the array with the frame numbers in a random order
        const frameNumbers = getUniqueRandomArray();

        // Sets the frame counter starting at 1
        var frameCounter = 1;

        // Iterates through each frame number to generate the forms
        frameNumbers.forEach(frameNumber => {

            // Sets the properties for each shape
            var shapeAmount = data['shape_amount_' + frameCounter];
            var shapeType = data['shape_type_' + frameCounter];
            var color = data['color_' + frameCounter];
            var fillType = data['fill_type_' + frameCounter];

            // Sets the form html code that will be generated and inserted in the frame 
            var formHtml = '';

            // Iterates through each shape and adds it to the main form html
            for (let shape = 1; shape <= shapeAmount; shape++) {
                // Call the function that generates the form html by passing the shape parameters and adds it to the main form html variable
                formHtml += getFormHtml(shapeAmount, shape, shapeType, color, fillType);
            }

            // Gets the frame that wll have the forms inserted
            var frame = document.getElementById('frame-' + frameNumber);

            // Set the custom 'value' attribute on the frame to be the combination of the amount, typem, color and fill type. This will be used to check the answer
            frame.setAttribute('value', shapeAmount + ',' + shapeType + ',' + color + ',' + fillType)

            // Set the inner html of the frame as the generated form html
            frame.innerHTML = formHtml;

            // Increment the frame counter to set the values for the next frame
            frameCounter++;
        });
    } catch (error) {
        // If an error occurs, act accordingly
        console.log("An error has occurred.", error);
    }
}

/**
 * Gets the form html considering the parameters passed.
 * 
 * @param {number} shapeAmount - The amount of shapes that should be generated. Must be 1, 2 or 3.
 * @param {number} shapeNumber - The number of the shape that is being generated. Must be 1, 2 or 3.
 * @param {number} shapeType - The type of the shape (geometric form) that is being generated. Must be 1, 2 or 3. 1 = rectangle, 2 = triangle, 3 = circle.
 * @param {number} colorNumber - The number of the color that the shape will have. Must be 1, 2 or 3.
 * @param {number} fillType - The type of the fill that the shape will have. Must be 1, 2 or 3. 1 = totally filled, 2 = diagonal lines, 3 = no fill.
 * @returns {string} A string containing the html of the form generated.
 */
function getFormHtml(shapeAmount, shapeNumber, shapeType, colorNumber, fillType) {

    // Sets the shape class variable
    var shapeClass = '';

    // Checks the shape amount and sets the shape class type according to the number
    switch (shapeAmount) {
        case 1:
            shapeClass = 'one-shape';
            break;
        case 2:
            shapeClass = 'two-shapes';
            break;
        case 3:
            shapeClass = 'three-shapes';
            break;
        default:
            break;
    }

    // Sets the color variable
    var color = '';

    // Checks the color number and sets the correct color
    switch (colorNumber) {
        case 1:
            color = 'red';
            break;
        case 2:
            color = 'green';
            break;
        case 3:
            color = 'blue';
            break;
        default:
            break;
    }

    // Sets the fill variable
    var fill = '';

    // Checks the fill type and sets the variable according to the value
    switch (fillType) {
        case 1:
            fill = color;
            break;
        case 2:
            fill = `url(#pattern-diagonal-hatch-color-${color})`;
            break;
        case 3:
            fill = 'transparent';
            break;
        default:
            break;
    }

    // Sets the svg html variable (as the shapes are svg elements)
    var svgHTML = '';

    // Checks the shape type number and creates the svg by passing the other attributes (class, number, fill, color)
    switch (shapeType) {
        case 1: // rectangle
            svgHTML = `
                <svg class="${shapeClass}-${shapeNumber}" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="80" height="80" fill="${fill}" stroke="${color}" stroke-width="3" />
                </svg>
            `;
            break;
        case 2: // triangle
            svgHTML = `
                <svg class="${shapeClass}-${shapeNumber}" viewBox="0 0 100 100">
                    <polygon points="50,10 10,90 90,90" fill="${fill}" stroke="${color}" stroke-width="3" />
                </svg>
            `;
            break;
        case 3: // circle
            svgHTML = `
                <svg class="${shapeClass}-${shapeNumber}" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="${fill}" stroke="${color}" stroke-width="3" />
                </svg>
            `;
            break;
        default:
            break;
    }

    // Returns the svg html code
    return svgHTML;
}

/**
 * Selects the frame of the corresponding parameter id.
 * 
 * @param {number} frameId - The id of the frame that will be selected.
 */
function selectFrame(frameId) {

    // Gets the frame to be selected by its id
    const frame = document.getElementById('frame-' + frameId);

    // Toggles the class for the frame selected
    frame.classList.toggle('frame-selected');

    // Gets all frames that are currently selected by their frame-selected class
    const selectedFrames = document.querySelectorAll('.frame-selected');

    // If there are less than 3 frames selected, return as there's no need to check the answer yet
    if (selectedFrames.length != 3) {
        return false;
    }

    // Get the correct answers element
    const correctAnswers = document.getElementById('correct-answers');

    // Call the function that checks the answer by passing the selected frames
    if (checkAnswer(selectedFrames)) { // Correct answer

        // If the sound is enabled, play the correct sound
        if (soundEnabled) {
            correctSound.play();
        }

        // If the answer didn't come from a tip, increment the available answer count
        if (!isTipAnswer) {

            // Increment the available counter
            counterIncrementAvailableAnswer++;

            // If the available counter is equal to 3, increment the available answer and reset the counter
            if (counterIncrementAvailableAnswer == 3) {
                availableAnswers++;
                counterIncrementAvailableAnswer = 0;

                sessionStorage.setItem("available-answers", availableAnswers);

                // Set the element to the available answer value
                const availableAnswersCount = document.getElementById('available-answers-count');

                availableAnswersCount.innerHTML = availableAnswers;

            }

        }

        // Increment the correct answer number
        correctAnswersNumber++;

        // Set the correct answer value in the session so the user doesn't loose historic even if they refresh the page
        sessionStorage.setItem("correct-answers", correctAnswersNumber);

        // If the correct answers number is greater than the max answer number, 
        // set the max as equal to the correct number, save in the session and set the element
        if (correctAnswersNumber > maxCorrectAnswersNumber) {
            const maxCorrectAnswers = document.getElementById('max-correct-answers');
            maxCorrectAnswersNumber = correctAnswersNumber;
            maxCorrectAnswers.innerHTML = 'Max correct answers: ' + maxCorrectAnswersNumber;
            sessionStorage.setItem("max-correct-answers", maxCorrectAnswersNumber);
        }

    } else { // wrong answer

        // If the sound is enabled, play the wrong sound
        if (soundEnabled) {
            wrongSound.play();
        }

        // Reset the available answer counter
        counterIncrementAvailableAnswer = 0;

        // Reset the correct answers number
        correctAnswersNumber = 0;

        // Set the correct answer value in the session so the user doesn't loose historic even if they refresh the page
        sessionStorage.setItem("correct-answers", correctAnswersNumber);

        // Reset the available answers number
        availableAnswers = 3;

        // Save the available answers in the session
        sessionStorage.setItem("available-answers", availableAnswers);

        // Set the element to the available answers
        const availableAnswersCount = document.getElementById('available-answers-count');

        availableAnswersCount.innerHTML = availableAnswers;
    }

    // Set the correct answer element
    correctAnswers.innerHTML = 'Correct answers: ' + correctAnswersNumber;

    // Clear the selection
    clearSelection();

    // Generates the forms again
    getForms();

    // Set the variable that indicates that the answer came from a tip to false
    isTipAnswer = false;
}

/**
 * Clear the selection of all frames
 */
function clearSelection() {

    // Gets all frames by their class
    const allFrames = document.querySelectorAll('.frame');

    // Remove 'frame-selected' class from all frames
    allFrames.forEach(frame => {
        frame.classList.remove('frame-selected');
        frame.classList.remove('frame-correct');

    });
}

/**
 * Checks the answer of the selected frames
 * 
 * @param {array} selectedFrames - The selected frames that will be checked.
 * @returns {boolean} True if the answer is correct, otherwise false.
 */
function checkAnswer(selectedFrames) {

    // Sets the arrays to check the answer
    const shapeAmounts = [];
    const shapeTypes = [];
    const colors = [];
    const fillTypes = [];

    // Iterates through each frame to set the values in the arrays
    selectedFrames.forEach(frame => {

        // Gets the value attribute of the frame
        var values = frame.getAttribute('value');

        // Splits the value attribute using comma and set it to a array variable
        var value = values.split(',');

        // Adds the values of each property to its respective array
        shapeAmounts.push(value[0]);
        shapeTypes.push(value[1]);
        colors.push(value[2]);
        fillTypes.push(value[3]);
    });

    // Sets the variable to store the wrong value messages
    var wrongAnswerMessage = `<span class="toast-title">Wrong answer</span>
    <br>
    <span class="toast-subtitle">Details:</span>
    <br>
    `;

    // Sets the return value
    var returnValue = true;

    // Call the function that checks if all values in an array are equal or different by passing the array for the shape amounts, and return false if they aren't
    if (!checkIfAllEqualOrDifferent(shapeAmounts)) {
        wrongAnswerMessage += `
        <span class="toast-detail">The amount of forms of the selected cards are not equal or different.</span>
        `;
        returnValue = false;
    }

    // Call the function that checks if all values in an array are equal or different by passing the array for the shape types, and return false if they aren't
    if (!checkIfAllEqualOrDifferent(shapeTypes)) {
        wrongAnswerMessage += `
        <span class="toast-detail">The shape types of the selected cards are not equal or different.</span>
        `;
        returnValue = false;
    }

    // Call the function that checks if all values in an array are equal or different by passing the array for the colors, and return false if they aren't
    if (!checkIfAllEqualOrDifferent(colors)) {
        wrongAnswerMessage += `
        <span class="toast-detail">The colors of the selected cards are not equal or different.</span>
        `;
        returnValue = false;
    }

    // Call the function that checks if all values in an array are equal or different by passing the array for the fill types, and return false if they aren't
    if (!checkIfAllEqualOrDifferent(fillTypes)) {
        wrongAnswerMessage += `
        <span class="toast-detail">The fill of the forms of the selected cards are not equal or different.</span>
        `;
        returnValue = false;
    }

    // If the return value is false (wrong answer), create a toast
    if (!returnValue) {
        createToast('error', wrongAnswerMessage);
    }

    // Return the value
    return returnValue;
}

/**
 * Checks if all values in an array are equal or different
 * 
 * @param {array} array - Array that will be checked.
 * @returns {boolean} True if all values are equal or different, otherwise false.
 */
function checkIfAllEqualOrDifferent(array) {
    // If array has less than 2 elements, return true
    if (array.length < 2) {
        return true;
    }

    // Check if all elements are equal
    const allEqual = array.every((element, index, arr) => element === arr[0]);

    // Check if all elements are different
    const allDifferent = array.every((element, index, arr) => arr.indexOf(element) === index);

    // Return true if all elements are equal or all elements are different, otherwise return false
    return allEqual || allDifferent;
}

/**
 * Gets the data for the frame in the possibilities json file for the corresponding id.
 * 
 * @param {number} idToReturn - Id of the possibility inside the json file. Starting at 1, max id: 2188.
 * @returns {array} Array containing the structure of the frames and shapes.
 */
function getData(idToReturn) {
    return new Promise((resolve, reject) => {
        // Set the json file path
        const possibilitiesFilePath = './files/possibilities.json';

        // Get the json file
        $.getJSON(possibilitiesFilePath, function (data) {
            // Resolve the promise with the id (decrementing it by 1 to use the base 0 index)
            resolve(data[idToReturn - 1]);
        }).fail(function () {
            // Reject the promise if there's an error
            reject("An error has occurred.");
        });
    });
}

/**
 * Gets an array with unique values starting at 1 and ending with 9.
 * 
 * @returns {array} Array containing unique numbers starting at 1 and ending at 9.
 */
function getUniqueRandomArray() {

    // Sets the length to 9
    var length = 9;

    // Creates an array with numbers from 1 to 9
    let numbers = Array.from({ length: 9 }, (_, index) => index + 1);

    // Shuffles the array using Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Take the first 'length' elements from the shuffled array
    return numbers.slice(0, length);
}

/**
 * Toggle the sound on or off.
 */
function toggleSound() {

    // Get the sound icon
    const soundIcon = document.getElementById('sound-icon');

    // If the sound is enabled, set it to disabled, otherwise enable it
    if (soundEnabled) {
        soundIcon.innerHTML = 'volume_off';
        soundIcon.style.color = 'red';
    } else {
        soundIcon.innerHTML = 'volume_up';
        soundIcon.style.color = 'black';
    }

    // Invert the variable of the sound enabled
    soundEnabled = !soundEnabled;
}

/**
 * Gets a correct answer by checking all possibilities.
 */
function getAnswer() {

    // If the available answer is equal or less than 0, return
    if (availableAnswers <= 0) {
        return;
    }

    // If the sound is enabled, play the tip sound
    if (soundEnabled) {
        tipSound.play();
    }

    // Set the variable that indicates that the answer came from a tip to true
    isTipAnswer = true;

    // Array that  contains all possible combination of 3 elements from 1 to 9
    var possibleAnswers = ['1,2,3', '1,2,4', '1,2,5', '1,2,6', '1,2,7', '1,2,8',
        '1,2,9', '1,3,4', '1,3,5', '1,3,6', '1,3,7', '1,3,8', '1,3,9', '1,4,5',
        '1,4,6', '1,4,7', '1,4,8', '1,4,9', '1,5,6', '1,5,7', '1,5,8', '1,5,9',
        '1,6,7', '1,6,8', '1,6,9', '1,7,8', '1,7,9', '1,8,9', '2,3,4', '2,3,5',
        '2,3,6', '2,3,7', '2,3,8', '2,3,9', '2,4,5', '2,4,6', '2,4,7', '2,4,8',
        '2,4,9', '2,5,6', '2,5,7', '2,5,8', '2,5,9', '2,6,7', '2,6,8', '2,6,9',
        '2,7,8', '2,7,9', '2,8,9', '3,4,5', '3,4,6', '3,4,7', '3,4,8', '3,4,9',
        '3,5,6', '3,5,7', '3,5,8', '3,5,9', '3,6,7', '3,6,8', '3,6,9', '3,7,8',
        '3,7,9', '3,8,9', '4,5,6', '4,5,7', '4,5,8', '4,5,9', '4,6,7', '4,6,8',
        '4,6,9', '4,7,8', '4,7,9', '4,8,9', '5,6,7', '5,6,8', '5,6,9', '5,7,8',
        '5,7,9', '5,8,9', '6,7,8', '6,7,9', '6,8,9', '7,8,9'];

    // Set the variable to hold the numbers of the frame for the correct answer
    var correctAnswer = '';

    // Iterates through each possible answer
    possibleAnswers.forEach(answer => {

        // If the correct answer is an empty string, it indicates that the checked possibility is not the correct answer, 
        // so continue checking
        if (correctAnswer == '') {

            // Sets the frames array by splitting the answer
            var framesArray = answer.split(',');

            // Sets the arrays to check the answer
            const shapeAmounts = [];
            const shapeTypes = [];
            const colors = [];
            const fillTypes = [];

            // Iterates through the frames array to set the values of the frame
            for (let i = 0; i < framesArray.length; i++) {

                // Gets the frame by passing its id
                var frame = document.getElementById('frame-' + framesArray[i]);

                // Gets the value attribute of the frame
                var values = frame.getAttribute('value');

                // Splits the value attribute using comma and set it to a array variable
                var value = values.split(',');

                // Adds the values of each property to its respective array
                shapeAmounts.push(value[0]);
                shapeTypes.push(value[1]);
                colors.push(value[2]);
                fillTypes.push(value[3]);
            }

            // Check all properties and, if all of them are true, set the correct answer as this possibility
            if (checkIfAllEqualOrDifferent(shapeAmounts) && checkIfAllEqualOrDifferent(shapeTypes) &&
                checkIfAllEqualOrDifferent(colors) && checkIfAllEqualOrDifferent(fillTypes)) {
                correctAnswer = answer;
            }
        }

    });

    // Get the correct frame numbers by splitting the correct answer
    var correctFrameNumbers = correctAnswer.split(',');

    // Iterates through each frame number
    correctFrameNumbers.forEach(frameNumber => {

        // Gets the frame for the number
        var frame = document.getElementById('frame-' + frameNumber);

        // Add the class to indicate that the frame is correct
        frame.classList.add('frame-correct');
    });

    // Decrement the available answers by 1
    availableAnswers--;

    // Save the available answers in the session
    sessionStorage.setItem("available-answers", availableAnswers);

    // Sets the element to the available answers
    const availableAnswersCount = document.getElementById('available-answers-count');

    availableAnswersCount.innerHTML = availableAnswers;
}