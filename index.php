<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Home | Forms Game</title>
    <meta name="author" content="" />
    <meta name="description" content="Website of old products">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/style.css" />
    <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon" />
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <!-- Font Awesome CDN link for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">

    <!-- Google Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>

<body>
    <!-- Page-level header -->
    <header>
        <?php
        include("includes/navbar.php");
        ?>
    </header>
    <main>
        <!-- svg used for the diagonal lines -->
        <svg width="0" height="0">
            <defs>
                <pattern id="pattern-diagonal-hatch-color-red" patternUnits="userSpaceOnUse" width="5" height="5">
                    <path id="path-diagonal-hatch-color-red" d="M0,5 l5,-5 M-2.5,2.5 l5,-5 M2.5,7.5 l5,-5" stroke="red" stroke-width="1" />
                </pattern>
                <pattern id="pattern-diagonal-hatch-color-green" patternUnits="userSpaceOnUse" width="5" height="5">
                    <path id="path-diagonal-hatch-color-green" d="M0,5 l5,-5 M-2.5,2.5 l5,-5 M2.5,7.5 l5,-5" stroke="green" stroke-width="1" />
                </pattern>
                <pattern id="pattern-diagonal-hatch-color-blue" patternUnits="userSpaceOnUse" width="5" height="5">
                    <path id="path-diagonal-hatch-color-blue" d="M0,5 l5,-5 M-2.5,2.5 l5,-5 M2.5,7.5 l5,-5" stroke="blue" stroke-width="1" />
                </pattern>
            </defs>
        </svg>
        <h1 class="welcome">Welcome to the Forms Game!</h1>
        <h2 class="please-read-instructions">Please read the instructions below.</h2>
        <div class="instructions">
            <span class="instructions-detail">To get a correct answer you need to select 3 cards that have their form amount, type, color and fill equal or different.</span>
            <span class="instructions-detail">E.g:</span>
            <ul>
                <li>First card: 1 square, blue, no fill</li>
                <li>Second card: 2 triangles, green, full filled</li>
                <li>Third card: 3 circles, red, filled with diagonal lines</li>
            </ul>
        </div>
        <div class="game">
            <ul class="notifications"></ul>
            <div id="get-answer" title="Click here to get an answer if you have any available" onclick="getAnswer()">
                <div id="get-answer-elements">
                    <span id="answer-icon" class="material-symbols-outlined">
                        lightbulb
                    </span><span id="available-answers-count">0</span>
                </div>
            </div>

            <div id="toggle-sound" title="Click here to turn the sound on/off" onclick="toggleSound()"><span id="sound-icon" class="material-symbols-outlined">
                    volume_up
                </span></div>

            <div class="game-details">
                <div class="level">
                    <span id="correct-answers">Correct answers: 0</span>
                    <span id="max-correct-answers">Max correct answers: 0</span>
                </div>
            </div>

            <!-- Container that holds the frames and forms of the game -->
            <div id="frame-container" class="frame-container">
                <div class="frame" id="frame-1" onclick="selectFrame(1)"></div>
                <div class="frame" id="frame-2" onclick="selectFrame(2)"></div>
                <div class="frame" id="frame-3" onclick="selectFrame(3)"></div>
                <div class="frame" id="frame-4" onclick="selectFrame(4)"></div>
                <div class="frame" id="frame-5" onclick="selectFrame(5)"></div>
                <div class="frame" id="frame-6" onclick="selectFrame(6)"></div>
                <div class="frame" id="frame-7" onclick="selectFrame(7)"></div>
                <div class="frame" id="frame-8" onclick="selectFrame(8)"></div>
                <div class="frame" id="frame-9" onclick="selectFrame(9)"></div>
            </div>

        </div>
    </main>
    <!-- Page-level footer -->
    <footer>
        <?php
        include("includes/footer.php");
        ?>
    </footer>
    <!-- Add the javascript file that has some scripts -->
    <script src="scripts/scripts.js"></script>
</body>

</html>