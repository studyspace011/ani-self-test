class MCQTestApp {
    constructor() {
        this.storagePrefix = 'ug-3rd_mcq_app_';
        this.questions = [];
        this.currentTest = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.endTime = null;
        this.totalTimeLimit = 0;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.subjectName = '';
        this.chapterName = '';
        this.userName = '';
        this.subjectsData = [];
        this.deferredInstallPrompt = null;
        // Add inside constructor in script.js0----------------theme toggle button functionality
        this.initTheme();

        this.isAnalyticsPage = document.getElementById('analytics-screen-body') !== null;

        if (this.isAnalyticsPage) {
            this.initializeAnalytics();
        } else {
            this.initializeElements();
            this.bindEvents();
            this.loadInitialData();
            this.registerServiceWorker();
            this.setupInstallPrompt();
        }
    }

    initTheme() {
    const savedTheme = this.getStorageItem('app_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
        this.updateThemeIcon(savedTheme);
        toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
    }

    toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const newTheme = isLight ? 'light' : 'dark';
        this.setStorageItem('app_theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === 'light' 
                ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
                : '<i class="fa-solid fa-moon" style="color: #38bdf8;"></i>';
        }
    }
    getStorageItem(key) { return localStorage.getItem(this.storagePrefix + key); }
    setStorageItem(key, value) { localStorage.setItem(this.storagePrefix + key, value); }
    removeStorageItem(key) { localStorage.removeItem(this.storagePrefix + key); }

    initializeElements() {
        this.screens = {
            home: document.getElementById('home-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen'),
            history: document.getElementById('history-screen')
        };
        this.welcomeMessage = document.getElementById('welcome-message');
        this.nameInputSection = document.getElementById('name-input-section');
        this.userNameInput = document.getElementById('user-name-input');
        this.setNameBtn = document.getElementById('set-name-btn');
        this.testMainSection = document.getElementById('test-main-section');
        this.subjectSelect = document.getElementById('subject-select');
        this.chapterSelect = document.getElementById('chapter-select');
        this.questionCount = document.getElementById('question-count');
        this.testSetup = document.getElementById('test-setup');
        this.numQuestions = document.getElementById('num-questions');
        this.totalTimeLimitInput = document.getElementById('total-time-limit');
        this.shuffleQuestions = document.getElementById('shuffle-questions');
        this.shuffleOptions = document.getElementById('shuffle-options');
        this.startTestBtn = document.getElementById('start-test');
        this.viewHistoryBtn = document.getElementById('view-history');
        this.viewAnalyticsBtn = document.getElementById('view-analytics');
        this.installAppBtn = document.getElementById('install-app-btn');
        this.timeLeftElement = document.getElementById('time-left');
        this.currentQuestion = document.getElementById('current-question');
        this.totalQuestions = document.getElementById('total-questions');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.submitTestBtn = document.getElementById('submit-test');
        this.scoreElement = document.getElementById('score');
        this.totalScoreElement = document.getElementById('total-score');
        this.percentageElement = document.getElementById('percentage');
        this.percentageContainer = document.querySelector('.percentage');
        this.timeTakenElement = document.getElementById('time-taken');
        this.resultSubject = document.getElementById('result-subject');
        this.resultChapter = document.getElementById('result-chapter');
        this.questionsReview = document.getElementById('questions-review');
        this.newTestBtn = document.getElementById('new-test');
        this.exportResultsBtn = document.getElementById('export-results');
        this.historyList = document.getElementById('history-list');
        this.backToHomeBtn = document.getElementById('back-to-home');
        this.clearHistoryBtn = document.getElementById('clear-history');
    }

    bindEvents() {
        this.setNameBtn.addEventListener('click', () => this.setUserName());
        this.userNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.setUserName(); });
        this.subjectSelect.addEventListener('change', () => this.handleSubjectChange());
        this.chapterSelect.addEventListener('change', () => this.handleChapterChange());
        this.startTestBtn.addEventListener('click', () => this.startTest());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitTestBtn.addEventListener('click', () => this.submitTest());
        this.newTestBtn.addEventListener('click', () => this.resetApp());
        this.viewHistoryBtn.addEventListener('click', () => this.showHistoryScreen());
        this.viewAnalyticsBtn.addEventListener('click', () => this.navigateToAnalytics());
        this.backToHomeBtn.addEventListener('click', () => this.showHomeScreen());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.exportResultsBtn.addEventListener('click', () => this.exportResults());
        this.installAppBtn.addEventListener('click', () => this.promptInstall());
    }

    setupInstallPrompt() {
        const installBtn = document.getElementById('install-app-btn');
        if (!installBtn) return;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredInstallPrompt = e;
            installBtn.classList.remove('hidden');
        });
        window.addEventListener('appinstalled', () => {
            installBtn.classList.add('hidden');
        });
    }

    promptInstall() {
        if (this.deferredInstallPrompt) {
            this.deferredInstallPrompt.prompt();
            this.deferredInstallPrompt.userChoice.then(() => {
                this.deferredInstallPrompt = null;
                document.getElementById('install-app-btn').classList.add('hidden');
            });
        }
    }

    setUserName() {
        const name = this.userNameInput.value.trim();
        if (name) {
            this.userName = name;
            this.setStorageItem('user_name', name);
            this.updateWelcomeMessage();
            this.nameInputSection.classList.add('hidden');
            this.testMainSection.classList.remove('hidden');
        } else {
            alert('Please enter your name.');
        }
    }

    updateWelcomeMessage() {
        if (this.userName) {
            this.welcomeMessage.innerHTML = `<i class="fa-solid fa-hand-wave" style="color: #f59e0b;"></i> Hlw, <span style="color: #671010d1;">${this.userName}</span>`;
        } else {
            this.welcomeMessage.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: #38bdf8;"></i> Ani.. Self MCQ Test`;
        }
    }

    async loadInitialData() {
        this.userName = this.getStorageItem('user_name') || '';
        this.updateWelcomeMessage();

        if (this.userName) {
            this.nameInputSection.classList.add('hidden');
            this.testMainSection.classList.remove('hidden');
        }

        try {
            const response = await fetch('subjects.json');
            if (!response.ok) throw new Error('subjects.json not found.');
            const data = await response.json();
            this.subjectsData = data.विषय || [];
            this.populateSubjects();
        } catch (error) {
            console.error(error);
        }
    }

    populateSubjects() {
        this.subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
        this.subjectsData.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.नाम;
            option.textContent = subject.नाम;
            this.subjectSelect.appendChild(option);
        });
    }

    handleSubjectChange() {
    const selectedSubjectName = this.subjectSelect.value;
    
    // Check if subject is Urdu (lowercase check for safety)
    const isUrdu = selectedSubjectName.toLowerCase().includes('urdu') || selectedSubjectName === 'Urdu';
    
    if (isUrdu) {
        document.body.classList.add('urdu-mode');
    } else {
        document.body.classList.remove('urdu-mode');
    }

    this.populateChapters();
    }

    populateChapters() {
        const selectedSubjectName = this.subjectSelect.value;
        this.chapterSelect.innerHTML = '<option value="">-- Select Chapter --</option>';
        this.chapterSelect.disabled = true;
        this.testSetup.classList.add('hidden');
        this.questionCount.textContent = '0';
        this.questions = [];

        if (selectedSubjectName) {
            const subject = this.subjectsData.find(s => s.नाम === selectedSubjectName);
            if (subject) {
                subject.अध्याय.forEach(chapter => {
                    const option = document.createElement('option');
                    option.value = chapter.csv_path;
                    option.textContent = chapter.नाम;
                    this.chapterSelect.appendChild(option);
                });
                this.chapterSelect.disabled = false;
            }
        }
    }

    resolveCsvPath(csvPath) {
        if (!csvPath) return [];

        const candidates = new Set([csvPath]);
        if (csvPath.includes('AEC-4')) {
            candidates.add(csvPath.replace(/AEC-4/gi, 'AEC-04'));
        }
        if (csvPath.includes('AEC-04')) {
            candidates.add(csvPath.replace(/AEC-04/gi, 'AEC-4'));
        }

        return [...candidates];
    }

    async handleChapterChange() {
        const csvPath = this.chapterSelect.value;
        if (!csvPath) return;

        const candidatePaths = this.resolveCsvPath(csvPath);
        let lastError = null;

        for (const path of candidatePaths) {
            try {
                const response = await fetch(`${path}?v=${new Date().getTime()}`);
                if (!response.ok) throw new Error('CSV file not found.');
                const csvText = await response.text();
                this.parseCSV(csvText);

                this.subjectName = this.subjectSelect.value;
                this.chapterName = this.chapterSelect.options[this.chapterSelect.selectedIndex].text;

                this.updateQuestionCount();
                this.testSetup.classList.remove('hidden');
                return;
            } catch (error) {
                lastError = error;
            }
        }

        alert('Error loading questions: ' + (lastError ? lastError.message : 'Unknown error'));
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split(/\r?\n/);
        this.questions = lines.map((line, index) => {
            if (line.trim() === '') return null;
            const values = line.split('|').map(v => v.trim());
            if (values.length < 7) return null;

            return {
                id: values[0] || index + 1,
                question: values[1],
                options: [values[2], values[3], values[4], values[5]].filter(Boolean),
                answer: values[6]
            };
        }).filter(q => q && q.question && q.options.length >= 2 && q.answer);
    }

    updateQuestionCount() {
        const count = this.questions.length;
        this.questionCount.textContent = count;
        this.numQuestions.max = count;
        this.numQuestions.value = Math.min(count, 10);
    }

    startTest() {
        if (this.questions.length === 0) return;
        const numQs = parseInt(this.numQuestions.value);

        this.totalTimeLimit = parseInt(this.totalTimeLimitInput.value) * 60;
        this.timeLeft = this.totalTimeLimit;

        let selectedQuestions = [...this.questions];
        if (this.shuffleQuestions.checked) this.shuffleArray(selectedQuestions);
        selectedQuestions = selectedQuestions.slice(0, numQs);

        if (this.shuffleOptions.checked) {
            selectedQuestions.forEach(q => this.shuffleArray(q.options));
        }

        this.currentTest = selectedQuestions;
        this.userAnswers = new Array(numQs).fill(null);
        this.currentQuestionIndex = 0;
        this.startTime = new Date();

        this.showScreen('test');
        this.displayQuestion();
        this.updateProgress();
        this.startTimer();
    }

    displayQuestion() {
        const question = this.currentTest[this.currentQuestionIndex];
        this.questionText.innerHTML = question.question;
        this.optionsContainer.innerHTML = '';
        
        question.options.forEach((option) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = option;
            if (this.userAnswers[this.currentQuestionIndex] === option) {
                optionElement.classList.add('selected');
            }
            optionElement.addEventListener('click', () => this.selectOption(option));
            this.optionsContainer.appendChild(optionElement);
        });

        if (typeof window.renderMath === 'function') window.renderMath();
        this.updateNavigationButtons();
    }

    selectOption(optionText) {
        this.userAnswers[this.currentQuestionIndex] = optionText;
        this.displayQuestion();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateProgress();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentTest.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateProgress();
        }
    }

    submitTest() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.endTime = new Date();
        this.calculateResults();
        this.saveTestResult();
        this.showResultsScreen();
    }

    calculateResults() {
        let correct = 0;
        this.currentTest.forEach((q, index) => {
            if (this.userAnswers[index] === q.answer) correct++;
        });
        const total = this.currentTest.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        const timeTaken = Math.floor((this.endTime - this.startTime) / 1000);

        this.currentResult = {
            score: correct,
            total: total,
            percentage: percentage,
            timeTaken: timeTaken,
            questions: this.currentTest,
            answers: this.userAnswers,
            date: new Date().toISOString(),
            subject: this.subjectName,
            chapter: this.chapterName
        };
    }

    showResultsScreen() {
        this.showScreen('results');
        const result = this.currentResult;

        this.scoreElement.textContent = result.score;
        this.totalScoreElement.textContent = result.total;
        this.percentageElement.textContent = result.percentage;
        this.timeTakenElement.textContent = this.formatTime(result.timeTaken);
        this.resultSubject.textContent = result.subject;
        this.resultChapter.textContent = result.chapter;

        this.percentageContainer.className = 'percentage';
        if (result.percentage >= 80) {
            this.percentageContainer.classList.add('excellent');
            if (window.confetti) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else if (result.percentage >= 50) {
            this.percentageContainer.classList.add('good');
        } else {
            this.percentageContainer.classList.add('poor');
        }

        this.displayQuestionsReview();
        if (typeof window.renderMath === 'function') window.renderMath();
    }

    displayQuestionsReview() {
        this.questionsReview.innerHTML = '';
        this.currentResult.questions.forEach((question, index) => {
            const userAnswer = this.currentResult.answers[index] || 'Not Answered';
            const isCorrect = userAnswer === question.answer;

            const reviewElement = document.createElement('div');
            reviewElement.className = `question-review ${isCorrect ? 'correct' : 'incorrect'}`;
            reviewElement.innerHTML = `
                <h4>Q ${index + 1}: ${question.question}</h4>
                <div class="user-answer"><i class="fa-solid fa-user"></i> Your Answer: ${userAnswer}</div>
                ${!isCorrect ? `<div class="correct-answer"><i class="fa-solid fa-check"></i> Correct Answer: ${question.answer}</div>` : ''}
            `;
            this.questionsReview.appendChild(reviewElement);
        });
    }

    saveTestResult() {
        let history = JSON.parse(this.getStorageItem('test_history') || '[]');
        history.unshift(this.currentResult);
        if (history.length > 50) history = history.slice(0, 50);
        this.setStorageItem('test_history', JSON.stringify(history));
    }

    showHistoryScreen() {
        this.showScreen('history');
        this.displayHistory();
    }

    displayHistory() {
        const history = JSON.parse(this.getStorageItem('test_history') || '[]');
        this.historyList.innerHTML = '';
        if (history.length === 0) {
            this.historyList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;"><i class="fa-solid fa-folder-open"></i> No attempts recorded yet.</p>';
            return;
        }

        history.forEach((result, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <h4>${result.subject} - ${result.chapter}</h4>
                <div class="history-stats">
                    <span>Score: <strong>${result.score}/${result.total}</strong></span>
                    <span style="color: ${result.percentage >= 80 ? '#4ade80' : (result.percentage >= 50 ? '#38bdf8' : '#f43f5e')};">
                        <strong>${result.percentage}%</strong>
                    </span>
                </div>
                <div class="history-date">${new Date(result.date).toLocaleString()}</div>
                <div class="history-item-actions">
                    <button class="secondary-btn view-details-btn" data-index="${index}"><i class="fa-solid fa-eye"></i> Review</button>
                    <button class="danger-btn delete-test-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            this.historyList.appendChild(historyItem);
        });

        this.historyList.querySelectorAll('.view-details-btn').forEach(btn =>
            btn.addEventListener('click', (e) => this.viewTestDetails(e.currentTarget.dataset.index))
        );
        this.historyList.querySelectorAll('.delete-test-btn').forEach(btn =>
            btn.addEventListener('click', (e) => this.deleteTest(e.currentTarget.dataset.index))
        );
    }

    viewTestDetails(index) {
        const history = JSON.parse(this.getStorageItem('test_history') || '[]');
        if (history[index]) {
            this.currentResult = history[index];
            this.showResultsScreen();
        }
    }

    deleteTest(index) {
        if (confirm('Delete this record?')) {
            let history = JSON.parse(this.getStorageItem('test_history') || '[]');
            history.splice(index, 1);
            this.setStorageItem('test_history', JSON.stringify(history));
            this.displayHistory();
        }
    }

    clearHistory() {
        if (confirm('Clear all test history?')) {
            this.removeStorageItem('test_history');
            this.displayHistory();
        }
    }

    initializeAnalytics() {
        document.getElementById('back-from-analytics').addEventListener('click', () => window.location.href = 'index.html');
        const history = JSON.parse(this.getStorageItem('test_history') || '[]');
        
        if (history.length === 0) {
            document.getElementById('analytics-data-content').classList.add('hidden');
            document.getElementById('no-history-message').classList.remove('hidden');
            return;
        }

        const totalTests = history.length;
        const avgScore = Math.round(history.reduce((sum, r) => sum + r.percentage, 0) / totalTests);
        const bestScore = Math.max(...history.map(r => r.percentage));

        document.getElementById('total-tests').textContent = totalTests;
        document.getElementById('average-score').textContent = `${avgScore}%`;
        document.getElementById('best-score').textContent = `${bestScore}%`;

        const subjectStats = history.reduce((acc, { subject, percentage }) => {
            acc[subject] = acc[subject] || { total: 0, count: 0 };
            acc[subject].total += percentage;
            acc[subject].count++;
            return acc;
        }, {});

        new Chart(document.getElementById('subjectPerformanceChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(subjectStats),
                datasets: [{
                    label: 'Avg Score %',
                    data: Object.values(subjectStats).map(s => Math.round(s.total / s.count)),
                    backgroundColor: '#38bdf8',
                    borderRadius: 8
                }]
            },
            options: { scales: { y: { beginAtZero: true, max: 100 } } }
        });

        const recentHistory = history.slice(0, 10).reverse();
        new Chart(document.getElementById('scoreDistributionChart'), {
            type: 'line',
            data: {
                labels: recentHistory.map((_, i) => `Test ${totalTests - i}`),
                datasets: [{
                    label: 'Score %',
                    data: recentHistory.map(r => r.percentage),
                    borderColor: '#4ade80',
                    backgroundColor: 'rgba(74, 222, 128, 0.15)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { scales: { y: { beginAtZero: true, max: 100 } } }
        });

        const list = document.getElementById('recent-tests-list');
        list.innerHTML = '';
        history.slice(0, 5).forEach(result => {
             list.innerHTML += `<div class="history-item"><h4>${result.subject} - ${result.chapter}</h4><div class="history-stats"><span>Score: <strong>${result.score}/${result.total}</strong></span><span><strong>${result.percentage}%</strong></span></div><div class="history-date">${new Date(result.date).toLocaleDateString()}</div></div>`;
        });
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    showHomeScreen() { this.showScreen('home'); }
    resetApp() { window.location.reload(); }
    navigateToAnalytics() { window.location.href = 'analytics.html'; }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updateTimerDisplay() { this.timeLeftElement.textContent = this.formatTime(this.timeLeft); }
    updateProgress() { this.currentQuestion.textContent = this.currentQuestionIndex + 1; }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.totalQuestions.textContent = this.currentTest.length;
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) this.submitTest();
        }, 1000);
    }

    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        this.nextBtn.classList.toggle('hidden', this.currentQuestionIndex === this.currentTest.length - 1);
        this.submitTestBtn.classList.toggle('hidden', this.currentQuestionIndex !== this.currentTest.length - 1);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
    }
}

document.addEventListener('DOMContentLoaded', () => new MCQTestApp());