let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let participantName = '';

document.getElementById('start-button').onclick = () => {
    participantName = document.getElementById('participant-name').value;
    const numberOfQuestions = parseInt(document.getElementById('number-of-questions').value, 10);

    if (participantName.trim() === '') {
        alert('Veuillez entrer votre nom.');
        return;
    }
    
    if (numberOfQuestions < 1 || numberOfQuestions > 50) {
        alert('Veuillez choisir un nombre de questions entre 1 et 50.');
        return;
    }

    document.getElementById('participant-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    loadQuestions(numberOfQuestions);
};

function loadQuestions(numberOfQuestions) {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
            questions = getRandomQuestions(numberOfQuestions);
            currentQuestionIndex = 0; // Réinitialiser l'index des questions
            score = 0; // Réinitialiser le score
            loadQuestion();
        })
        .catch(error => console.error('Erreur de chargement des questions:', error));
}

function getRandomQuestions(numberOfQuestions) {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfQuestions);
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(button);
    });

    document.getElementById('next-button').style.display = 'none'; // Masquer le bouton "Suivant" au début
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correct;
    const feedbackElement = document.getElementById('feedback');

    if (selectedAnswer === correctAnswer) {
        feedbackElement.textContent = 'Bonne réponse !';
        feedbackElement.className = 'correct';
        score++;
    } else {
        feedbackElement.textContent = 'Mauvaise réponse ! La bonne réponse était: ' + correctAnswer;
        feedbackElement.className = '';
    }
    
    document.getElementById('next-button').style.display = 'block'; // Afficher le bouton "Suivant"
}

document.getElementById('next-button').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        document.getElementById('next-button').style.display = 'none';
        document.getElementById('feedback').textContent = '';
    } else {
        endQuiz();
    }
};

function endQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score').textContent = `Bravo ${participantName}! Vous avez obtenu ${score} sur ${questions.length} bonnes réponses.`;
}
