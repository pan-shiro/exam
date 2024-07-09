import { useEffect, useRef, useState } from "react";
import { quizStatus } from "./interfaces/quizStatus";
import { Category } from "./interfaces/category";
import { getCategories, getQuestions } from "./util/api";
import { Question } from "./interfaces/question";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStatus, setQuizStatus] = useState<quizStatus>('idle');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(0);
  const percentageRef = useRef(0);
  const resultRef = useRef(false)
  const scoreRef = useRef(0);
  // const { question: currentQuestion } = questions && questions[currentIndex];

  useEffect(() => {
    const startFetching = async () => {
      const res = await getCategories();
      console.log(res);
      setCategories(res);
    }

    startFetching();
  }, []);

  useEffect(() => {
    const startFetching = async () => {
      const res = await getQuestions(selectedCategory);
      console.log(res);
      setQuestions(res);
    }
    // if (quizStatus === 'begun') {
    //   startFetching();
    // }
    if (selectedCategory === '') return;
    startFetching();


  }, [quizStatus]);

  useEffect(() => {
    if (quizStatus === 'begun') {

      intervalRef.current = setInterval(() => {
        setTimer(((t): number => {
          if (t > 0) {
            return t - 1;
          } else {
            handleOperations();
            return 5;
          }
        }));
        return () => clearInterval(intervalRef.current);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer, quizStatus]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOperations();
  }

  const handleOperations = () => {
    const { answers: currentOptions, correct_answer } = questions[currentIndex];

    clearInterval(intervalRef.current);
    const validKeys = Object.entries(currentOptions)
      .filter((ans) => !ans.includes(null))
      .map((entry) => entry[0]);
    console.log(validKeys);
    let randomIndex = Math.floor(Math.random() * validKeys.length);
    let randomAnswer = validKeys[randomIndex];
    console.log(`randomAnswer is ${randomAnswer}`);

    setSelectedOption(selectedOption === "" ? randomAnswer : selectedOption);
    console.log(`correct_answer is ${correct_answer}`);
    console.log(`selectedOption is ${selectedOption}`);
    console.log(selectedOption === correct_answer);

    scoreRef.current = selectedOption === correct_answer ? scoreRef.current + 1 : scoreRef.current;
    console.log("score is " + scoreRef.current)


    if (currentIndex < questions.length - 1) {
      setTimer(30);
      setSelectedOption("");
      setCurrentIndex(ci => ci + 1);
    } else {
      percentageRef.current = Math.round((scoreRef.current / questions.length) * 100);
      resultRef.current = percentageRef.current >= 50 ? true : false;
      setQuizStatus('finished')
      setTimer(0);
    }
  }

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
      <header className="text-3xl font-bold py-6 text-center">
        <h1>Computer Science Quiz</h1>
      </header>
      <main className="px-4 py-2 mt-4 w-full h-1/2 flex justify-center items-center">
        {quizStatus === 'idle' && <section className="w-1/2 p-2 mx-auto bg-slate-100 rounded-lg shadow-xl">
          <header className="text-xl font-semibold text-black text-center mt-2">
            <h3>How good are your computer skills?</h3>
            <h5 className="text-base font-normal -mt-1">Test your computer knowledge by answering 10 questions</h5>
          </header>
          <div className="py-2 px-4">
            <ol className="list-decimal px-2 space-y-1">
              <li>Choose a category and click the button to begin</li>
              <li>This quiz is comprised of multiple choices. Choose the correct one and click <em>Next</em></li>
              <li>You have 30 seconds for each question. If you fail to choose an option before the timer ends, a random option will be chosen</li>
              <li>At the end, a score will be calculated and shown</li>
              <li>You may try as many times as you want.</li>
            </ol>
            {/* <label htmlFor="categorySelect">Please choose a category</label> */}
            <div className="mt-10 flex gap-8 items-center">

            <select className="flex-1 p-2 rounded-lg border border-slate-200" name="categorySelect" id="categorySelect" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Please choose a category</option>
              {categories && categories.map(cat => (
                <option value={cat.name} key={cat.id}>{cat.name[0].toUpperCase() + cat.name.slice(1)}</option>
              ))}
            </select>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-indigo-100 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed" onClick={() => setQuizStatus('begun')} disabled={selectedCategory === ''}>Start Quiz</button>
              </div>
          </div>
        </section>}
        {quizStatus === 'begun' && questions.length > 0 ? <section className="w-1/2 min-h-72 p-2 mx-auto bg-slate-100 rounded-lg shadow-xl box-border">
          <header className="flex justify-between items-center py-2 px-3">
            <h5 className="text-sm">
              Question <span className="font-semibold italic">{currentIndex + 1}</span> of <span className="font-semibold italic">{questions.length}</span>
            </h5>
            <div className="px-2 py-1 border border-dashed border-indigo-300 rounded-full w-7 h-7 flex justify-center items-center"><h5 className="text-sm font-semibold text-indigo-800">{timer}</h5></div>
          </header>
          <form className="px-3" onSubmit={handleSubmit}>
            <p className="text-lg font-semibold mb-4">{questions && questions[currentIndex]?.question}</p>
            <ul className="px-4">
              {Object.values(questions[currentIndex].answers).filter((ans) => ans !== null).map((ans, i) => (
                <li className="my-2 hover:bg-indigo-100 rounded-lg" key={ans}>
                  <label className="align-middle font-mono w-full block">
                    <input className="mx-4 align-middle" type="radio" name={currentIndex.toString()} value={Object.keys(questions[currentIndex].answers)[i]} onChange={(e) => setSelectedOption(e.target.value)} />
                    {ans}
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
            <button className="rounded-lg bg-indigo-500 px-4 py-2 min-w-24 text-indigo-100 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed" type="submit" disabled={!selectedOption}>{currentIndex < questions.length - 1 ? "Next" : "Submit answers"} </button>
            </div>
          </form>
        </section> : (quizStatus === 'begun' &&
        <div>
          <p className="italic text-2xl text-gray-500 text-center">Fetching questions...</p>
        </div>)
      }
        
        {quizStatus === 'finished' && <section className="w-1/2 min-h-72 p-2 flex flex-col justify-center items-center gap-6 bg-slate-100 rounded-lg shadow-xl">
          <ul className="text-xl space-y-3 w-3/4">
            <li className="flex gap-2"><span className="font-semibold flex-1">Score: </span> <span className="font-mono text-2xl" style={{color: resultRef.current ? 'green' : 'crimson'}}>{percentageRef.current}%</span></li>
            <li className="flex gap-2"><span className="font-semibold flex-1">Total questions: </span><span className="font-mono text-2xl">{questions.length}</span></li>
            <li className="flex gap-2"><span className="font-semibold flex-1">Correct answers: </span> <span className="font-mono text-2xl">{scoreRef.current}</span></li>
          </ul>
          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-indigo-100 hover:bg-indigo-600" onClick={handleReset}>Try again</button>
        </section>}
      </main>
    </div>
  );
}

export default App;
