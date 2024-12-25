class TestManager {
  constructor(tasksUrl, containerId, resultId, maxQuestions = 10) {
    this.tasksUrl = tasksUrl;
    this.container = document.getElementById(containerId);
    this.resultContainer = document.getElementById(resultId);
    this.tasks = [];
    this.queue = [];
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.maxQuestions = maxQuestions;
    this.currentQuestionIndex = 0;
  }

  // Метод загрузки задач из файла
  async loadTasks() {
    try {
      const response = await fetch(this.tasksUrl);
      this.tasks = await response.json();
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    }
  }

  // Перемешивание массива
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Создание случайной очереди задач
  createRandomQueue() {
    this.shuffleArray(this.tasks);
    this.queue = this.tasks.slice(0, this.maxQuestions);
  }

  // Отображение текущей задачи
  displayCurrentTask() {
    if (this.currentQuestionIndex >= this.queue.length) {
      this.displayResults();
      return;
    }

    const task = this.queue[this.currentQuestionIndex];
    this.container.innerHTML = `
            <div class="task">
                <p><strong>Задача ${this.currentQuestionIndex + 1}/${
      this.maxQuestions
    }:</strong> ${task.description}</p>
                <label>Введите ответ:</label>
                <input type="text" id="user-answer">
                <button id="submit-answer">Ответить</button>
            </div>
        `;

    const submitButton = document.getElementById("submit-answer");
    const inputAnsver = document.getElementById("user-answer");

    submitButton.onclick = () => {
      if (inputAnsver.value) {
        return this.submitAnswer();
      } else {
        inputAnsver.style.border = "2px solid red";
      }
    };
  }

  // Проверка ответа
  submitAnswer() {
    const task = this.queue[this.currentQuestionIndex];
    const userAnswer = document.getElementById("user-answer").value.trim();

    if (userAnswer === task.answer) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    this.currentQuestionIndex++;
    this.displayCurrentTask();
  }

  // Отображение результатов
  displayResults() {
    this.container.innerHTML = "";
    this.resultContainer.innerHTML = `
            Вы завершили тестирование!<br>
            Правильных ответов: ${this.correctAnswers}<br>
            Неправильных ответов: ${this.incorrectAnswers}
        `;
    this.resultContainer.classList.remove("hidden");
  }

  // Запуск тестирования
  async startTest() {
    await this.loadTasks();
    this.createRandomQueue();
    this.displayCurrentTask();
  }
}

// Инициализация и запуск
const testManager = new TestManager(
  "tasks.json",
  "task-container",
  "result",
  10
);
testManager.startTest();

