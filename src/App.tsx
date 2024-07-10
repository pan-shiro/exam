import { useEffect, useRef, useState } from "react";
import { quizStatus } from "./interfaces/quizStatus";
import { Category } from "./interfaces/category";
import { getCategories, getQuestions } from "./util/api";
import { Question } from "./interfaces/question";
import GeneralHeader from "./components/GeneralHeader";
import StartingScreen from "./components/StartingScreen";
import QuizForm from "./components/QuizForm";
import ScorePage from "./components/ScorePage";
import QuestionHeader from "./components/QuestionHeader";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStatus, setQuizStatus] = useState<quizStatus>('idle');
  const [multipleOptions, setMultipleOptions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(0);
  const percentageRef = useRef(0);
  const resultRef = useRef(false)
  const scoreRef = useRef(0);


  //fetch and set categories
  useEffect(() => {
    const startFetching = async () => {
      const res = await getCategories();
      console.log(res);
      setCategories(res);
    }

    startFetching();
  }, []);

  //fetch and set category-specific questions
  useEffect(() => {
    const startFetching = async () => {
      const res = await getQuestions(selectedCategory);
      console.log(res);
      setQuestions(res);
    }

    if (selectedCategory === '') return;
    if (quizStatus === 'finished') return;
    startFetching();


  }, [quizStatus]);

  //create a timer
  useEffect(() => {
    if (quizStatus === 'begun') {

      intervalRef.current = setInterval(() => {
        setTimer(((t): number => {
          if (t > 0) {
            return t - 1;
          } else {
            handleOperations();
            return 30;
          }
        }));
        return () => clearInterval(intervalRef.current);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer, quizStatus]);

  //boolean checks used in Next button
  const isCheckboxType = questions[currentIndex]?.multiple_correct_answers === 'true';
  const checkboxCheck = multipleOptions.some(mo => mo);

  //form submit function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOperations();
  }
  //give a random answer
  const optionRandomizer = (currentOptions: string[]) => {
    const validKeys = Object.entries(currentOptions)
      .filter((ans) => !ans.includes(null))
      .map((entry) => entry[0]);
    // console.log(validKeys);
    //create a randomized index
    let randomIndex = Math.floor(Math.random() * validKeys.length);
    let randomAnswer = validKeys[randomIndex];
    console.log(`randomAnswer is ${randomAnswer}`);
    return randomAnswer;
  }

  //score operations based on input type, random answers 
  const handleOperations = () => {
    const { answers: currentOptions, correct_answer, } = questions[currentIndex];
    clearInterval(intervalRef.current);

    //if options are of radio type
    if (!isCheckboxType) {
      console.log(`correct answer is ${correct_answer}`)
      //if player hasn't selected anything, give a random answer
      const randomAnswer = optionRandomizer(currentOptions);
      setSelectedOption(selectedOption === '' ? randomAnswer : selectedOption);
      console.log(`selected answer is ${selectedOption}`);
      //adjust the score
      if (selectedOption === '') {
        scoreRef.current = randomAnswer === correct_answer ? scoreRef.current + 1 : scoreRef.current;
      } else {
        scoreRef.current = selectedOption === correct_answer ? scoreRef.current + 1 : scoreRef.current;
      }
      console.log("score is " + scoreRef.current)
    } else {
      //if options are of checkbox type
      //if player has selected something
      if (checkboxCheck) {
        const { correct_answers } = questions[currentIndex];
        //find correct entries
        const entries = Object.entries(correct_answers).filter((entry) =>
          entry.includes("true")
        );
        //get array of correct answers e.g. ['answer_a', 'answer_b']
        const answers = entries
          .map((entry) => entry[0])
          .map((ans) => ans.slice(0, 8));
        //check if answers given are equal to the correct answers
        const result = answers.every((ans) => multipleOptions.includes(ans));
        //adjust score accordingly
        scoreRef.current = result ? scoreRef.current + 1 : scoreRef.current;
      } else {
        //if player hasn't selected anything
        //question with multiple correct answers is never gonna be correct
        //create a single random answer
        //calculate score
        const randomAnswer = optionRandomizer(currentOptions);
        setSelectedOption(randomAnswer);
        scoreRef.current = randomAnswer === correct_answer ? scoreRef.current + 1 : scoreRef.current;
      }
    }

    //if currentIndex exists, reset timer, selectedOption and increase it
    if (currentIndex < questions.length - 1) {
      setTimer(30);
      setSelectedOption("");
      setCurrentIndex(ci => ci + 1);
    } else
    //quiz is over so estimate score values and cancel timer
    {
      percentageRef.current = Math.round((scoreRef.current / questions.length) * 100);
      resultRef.current = percentageRef.current >= 50 ? true : false;
      setQuizStatus('finished')
      setTimer(0);
    }
  }

  const handleOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    //checkbox question
    if (questions[currentIndex].multiple_correct_answers === "true") {
      //insert option to array
      if (checked) {
        setMultipleOptions((mo) => [...mo, value]);
      } else {
        //checked option was unchecked, so remove it from array
        setMultipleOptions((mo) => mo.filter((n) => n !== value));
      }
    } else {
      //radio question
      setSelectedOption(value);
    }

  };

  //reset variables
  const handleReset = () => {
    setQuizStatus('idle');
    setCurrentIndex(0);
    setSelectedCategory('');
    setSelectedOption('');
    setQuestions([]);
    setTimer(30);
    scoreRef.current = 0;
    percentageRef.current = 0;
    resultRef.current = false;
  }




  return (
    <div className="h-screen bg-slate-300">
      <GeneralHeader />
      <main className="px-4 py-2 mt-4 w-full h-1/2 flex justify-center items-center">
        {quizStatus === 'idle' &&
          <StartingScreen selectedCategory={selectedCategory} categories={categories} onSelectOptionChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)} onStartQuizBtnClick={() => setQuizStatus('begun')} />
        }
        {quizStatus === 'begun' && questions.length > 0 ? <section className="w-1/2 min-h-72 p-2 mx-auto bg-slate-100 rounded-lg shadow-xl box-border">

          <QuestionHeader index={currentIndex} q={questions} timer={timer} />
          <QuizForm checkboxCheck={checkboxCheck} index={currentIndex} isCheckboxType={isCheckboxType} multOptions={multipleOptions} onInputChange={handleOptions} onSubmitClick={handleSubmit} questions={questions} selectedOpt={selectedOption} />
        </section> : (quizStatus === 'begun' &&
          <div>
            <p className="italic text-2xl text-gray-500 text-center">Fetching questions...</p>
          </div>)
        }

        {quizStatus === 'finished' &&
        <ScorePage onResetBtnClick={handleReset} percentageRef={percentageRef} questions={questions} resultRef={resultRef} scoreRef={scoreRef} />
          // <ScorePage resultRef={resultRef} percentageRef={percentageRef} questions={questions} scoreRef={scoreRef} onResetBtnClick={handleReset} />
        }
      </main>
    </div>
  );
}

export default App;
