//Holding methods for updating UI
const UIController = (() => {
  const setStyleAttributeOfAnElement = (element, attribute, desiredValue) => {
    element.style[attribute] = desiredValue;
  };

  const setClassNameOfAnElementTo = (element, desiredClassName) => {
    element.className = desiredClassName;
  };

  const scrollToMainContent = () => {
    const mainContentYCoordinate = document
      .getElementById("main-content")
      .getClientRects()[0].y;

    window.scroll({
      top: mainContentYCoordinate,
      left: 0,
      behavior: "smooth"
    });
  };

  const turnOffThisAnswer = answer => {
    UIController.setClassNameOfAnElementTo(answer, "individual-answer__wraper");
    UIController.setClassNameOfAnElementTo(
      answer.childNodes[1],
      "individual-answer__checkbox"
    );
  };

  const turnOnThisAnswer = answer => {
    UIController.setClassNameOfAnElementTo(
      answer,
      "individual-answer__wraper--chosen"
    );
    UIController.setClassNameOfAnElementTo(
      answer.childNodes[1],
      "individual-answer__checkbox--checked"
    );
  };

  const renderQuestion = ({ question, codeImage = null, answerContents }) => {
    const questionPlaceHolder = document.getElementsByClassName(
      "quiz__question"
    )[0];
    const answerPlaceHolders = [
      ...document.getElementsByClassName("individual-answer__answer-content")
    ];
    const codePlaceHolder = document.getElementById("code-sample");

    questionPlaceHolder.innerHTML = question;
    if (codeImage) {
      codePlaceHolder.src = codeImage;
      setStyleAttributeOfAnElement(codePlaceHolder, "display", "flex");
    } else {
      setStyleAttributeOfAnElement(codePlaceHolder, "display", "none");
    }

    answerPlaceHolders.forEach(
      (answerPlaceHolder, index) =>
        (answerPlaceHolder.innerHTML = answerContents[index])
    );
  };

  const increaseScore = () => {
    const scoreCard = document.getElementsByClassName("quiz__score")[0];
    let newScore = +scoreCard.innerHTML.slice(-1) + 1;
    scoreCard.innerHTML = `Your score: ${newScore}`;
  };

  const toggleBetweenSubmitAndNextOne = () => {
    document.getElementsByClassName("quiz__submit-button")[0].innerHTML =
      document.getElementsByClassName("quiz__submit-button")[0].innerHTML ===
      "Submit"
        ? `Next one <i class="fas fa-arrow-alt-circle-right"></i>`
        : "Submit";
  };

  const revealCorrectAnswer = correctAnswer => {
    const correctAnswerWraper = document
      .getElementsByClassName("quiz__answers-box")[0]
      .getElementsByTagName("a")[correctAnswer];
    setClassNameOfAnElementTo(
      correctAnswerWraper,
      "individual-answer__wraper--correct"
    );
  };

  const resetAllAnswers = () => {
    const allAnswers = [
      ...document
        .getElementsByClassName("quiz__answers-box")[0]
        .getElementsByTagName("a")
    ];
    const checkedBox = document.getElementsByClassName(
      "individual-answer__checkbox--checked"
    )[0];
    const wrongCheckedBox = document.getElementsByClassName(
      "individual-answer__checkbox--red"
    )[0];
    allAnswers.forEach(element =>
      setClassNameOfAnElementTo(element, "individual-answer__wraper")
    );
    if (checkedBox) {
      setClassNameOfAnElementTo(checkedBox, "individual-answer__checkbox");
    } else {
      setClassNameOfAnElementTo(wrongCheckedBox, "individual-answer__checkbox");
    }
  };

  return {
    scrollToMainContent,
    setStyleAttributeOfAnElement,
    setClassNameOfAnElementTo,
    turnOffThisAnswer,
    turnOnThisAnswer,
    renderQuestion,
    increaseScore,
    toggleBetweenSubmitAndNextOne,
    revealCorrectAnswer,
    resetAllAnswers
  };
})();

//Holding method for handling logic and store data
const DataController = (() => {
  const questions = [
    {
      question: "What is the keyword you use to declare a constant in ES6 ?",
      answerContents: ["var", "let", "const", "None of these above"],
      correctAnswer: "const",
      correctAnswerIndex: 2
    },
    {
      question: "What is the result of the below <em>console.log</em>",
      codeImage: "./img/code-question-1.png",
      answerContents: ["2", "1", "3", "Result in an error"],
      correctAnswer: "Result in an error",
      correctAnswerIndex: 3
    },
    {
      question:
        "What are the new features with Enhanced Object Literal in initiating new object?",
      answerContents: [
        `Computed property's name`,
        "Shorthand syntax for properties",
        "Shorthand syntax for methods",
        "All of these above"
      ],
      correctAnswer: "All of these above",
      correctAnswerIndex: 3
    },
    {
      question: "What is the result of the below <em>console.log</em> ?",
      codeImage: "./img/code-question-3.png",
      answerContents: ["Masters", "undefined", `{degree: 'Master'}`, "null"],
      correctAnswer: "Masters",
      correctAnswerIndex: 0
    },
    {
      question: "What is the result of the below <em>console.log</em> ?",
      codeImage: "./img/code-question-4.png",
      answerContents: [
        "[1, 2, 3]",
        "[3, 4, 5]",
        "[1, 2, 3, 4, 5]",
        "Result in an error"
      ],
      correctAnswer: "Result in an error",
      correctAnswerIndex: 3
    }
  ];
  let score = 0;
  let questionsArrangement = [0, 1, 2, 3, 4].sort(
    (a, b) => Math.random() - 0.5
  );
  const getQuestionInformation = () => questions[questionsArrangement[0]];
  const removeAskedQuestion = () => questionsArrangement.shift();
  const getCorrectAnswer = () =>
    questions[questionsArrangement[0]].correctAnswerIndex;
  const getScore = () => score;
  const increaseScore = () => score++;

  return {
    questions,
    questionsArrangement,
    getQuestionInformation,
    getCorrectAnswer,
    removeAskedQuestion,
    getScore,
    increaseScore
  };
})();

//Control which method get called
const CentralController = ((UIController, DataController) => {
  //Function to setup event listener for whole website
  const init = () => {
    //This function contains of several small functions which set up event listener for different parts of website
    const setUpScrollDownButton = () => {
      document
        .getElementsByClassName("banner__down-button")[0]
        .addEventListener("click", UIController.scrollToMainContent);
    };

    const setUpIndividualConcepts = () => {
      const individualConcepts = [
        ...document.getElementsByClassName("individual-concept__wraper")
      ];
      individualConcepts.forEach(element => {
        element.addEventListener("click", event => {
          const modalPopupAppearing = document.getElementsByClassName(
            "popup-modal__background"
          )[event.currentTarget.id];
          UIController.setStyleAttributeOfAnElement(
            modalPopupAppearing,
            "display",
            "flex"
          );
        });
      });
    };

    const setUpIndexForPopupModals = () => {
      const modalBackgrounds = [
        ...document.getElementsByClassName("popup-modal__background")
      ];
      modalBackgrounds.forEach((element, index) => (element.index = index));
    };

    const setUpNextButtons = () => {
      const allNextButtons = [
        ...document.getElementsByClassName("popup-modal__next-button")
      ];
      allNextButtons.forEach(element => {
        element.addEventListener("click", event => {
          const currentPopupModal = event.currentTarget.parentNode.parentNode;
          UIController.setStyleAttributeOfAnElement(
            currentPopupModal,
            "display",
            "none"
          );
          let index =
            currentPopupModal.index === 6 ? 0 : currentPopupModal.index + 1;
          const nextPopupModal = allNextButtons[index].parentNode.parentNode;
          UIController.setStyleAttributeOfAnElement(
            nextPopupModal,
            "display",
            "flex"
          );
        });
      });
    };

    const setUpPreviousButtons = () => {
      const allPreviousButtons = [
        ...document.getElementsByClassName("popup-modal__previous-button")
      ];
      allPreviousButtons.forEach(element => {
        element.addEventListener("click", event => {
          const currentPopupModal = event.currentTarget.parentNode.parentNode;
          currentPopupModal.style.display = "none";
          let index =
            currentPopupModal.index === 0 ? 6 : currentPopupModal.index - 1;
          const previousPopupModal =
            allPreviousButtons[index].parentNode.parentNode;
          UIController.setStyleAttributeOfAnElement(
            previousPopupModal,
            "display",
            "flex"
          );
        });
      });
    };

    const setUpClosingMechanic = () => {
      const closeButtons = [
        ...document.getElementsByClassName("popup-modal__close-button")
      ];
      const modalBackgrounds = [
        ...document.getElementsByClassName("popup-modal__background")
      ];

      closeButtons.forEach(element => {
        const handleClickOnCloseButton = () => {
          const modalNeedToClose = event.currentTarget.parentNode.parentNode;
          UIController.setStyleAttributeOfAnElement(
            modalNeedToClose,
            "display",
            "none"
          );
        };
        element.addEventListener("click", handleClickOnCloseButton);
      });

      modalBackgrounds.forEach(element => {
        const handleClickOutside = event => {
          if (event.target === element) {
            UIController.setStyleAttributeOfAnElement(
              element,
              "display",
              "none"
            );
          }
        };
        window.addEventListener("click", handleClickOutside);
      });
    };

    const setUpAnswers = () => {
      const allAnswers = [
        ...document.getElementsByClassName("individual-answer__wraper")
      ];
      const isCurrentAnswer = answer =>
        answer.className.slice(-8) === "--chosen";

      allAnswers.forEach((answer, index, answers) => {
        answer.index = index;
        answer.addEventListener("click", evt => {
          let answerClickedByUser = evt.currentTarget;
          if (!isCurrentAnswer(answerClickedByUser)) {
            let currentlyChosenAnswer = answers.find(answer =>
              isCurrentAnswer(answer)
            );
            if (currentlyChosenAnswer) {
              UIController.turnOffThisAnswer(currentlyChosenAnswer);
            }

            UIController.turnOnThisAnswer(answerClickedByUser);
          }
        });
      });
    };

    const setUpSubmitButton = () => {
      const handleSubmitButton = correctAnswer => {
        const currentAnswer = document.getElementsByClassName(
          "individual-answer__wraper--chosen"
        )[0];
        if (correctAnswer === currentAnswer.index) {
          UIController.increaseScore();
          DataController.increaseScore();
        } else {
          UIController.setClassNameOfAnElementTo(
            currentAnswer.children[0],
            "individual-answer__checkbox--red"
          );
        }

        UIController.toggleBetweenSubmitAndNextOne();
        UIController.revealCorrectAnswer(correctAnswer);
      };

      const handleNextOneButton = () => {
        UIController.resetAllAnswers();
        DataController.removeAskedQuestion();
        loadQuestion();
        UIController.toggleBetweenSubmitAndNextOne();
      };

      const submitButton = document.getElementsByClassName(
        "quiz__submit-button"
      )[0];
      submitButton.addEventListener("click", () => {
        if (event.currentTarget.innerHTML === "Submit") {
          handleSubmitButton(DataController.getCorrectAnswer());
        } else {
          handleNextOneButton();
        }
      });
    };

    const setUpStartButton = () => {
      const startButton = document.getElementsByClassName(
        "quiz__start-button"
      )[0];
      const handleStartButton = () => {
        UIController.setStyleAttributeOfAnElement(
          document.getElementsByClassName("quiz__intro")[0],
          "display",
          "none"
        );
        UIController.setStyleAttributeOfAnElement(
          document.getElementsByClassName("quiz__main-content")[0],
          "display",
          "flex"
        );
      };
      startButton.addEventListener("click", handleStartButton);
    };

    setUpScrollDownButton();
    setUpIndividualConcepts();
    setUpIndexForPopupModals();
    setUpNextButtons();
    setUpPreviousButtons();
    setUpClosingMechanic();
    setUpAnswers();
    setUpSubmitButton();
    setUpStartButton();
  };

  const loadQuestion = () => {
    const questionInformation = DataController.getQuestionInformation();
    if (questionInformation) {
      UIController.renderQuestion(questionInformation);
    } else {
      const score = DataController.getScore();
      const numberOfQuestions = DataController.questions.length;
      document.getElementsByClassName(
        "quiz__final-result"
      )[0].children[1].innerHTML = `You have answer correctly ${score}/${numberOfQuestions} questions`;
      UIController.setStyleAttributeOfAnElement(
        document.getElementsByClassName("quiz__main-content")[0],
        "display",
        "none"
      );
      UIController.setStyleAttributeOfAnElement(
        document.getElementsByClassName("quiz__final-result")[0],
        "display",
        "flex"
      );
    }
  };

  return {
    init,
    loadQuestion
  };
})(UIController, DataController);

CentralController.init();
CentralController.loadQuestion();
