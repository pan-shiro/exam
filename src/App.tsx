import { useEffect, useRef, useState } from "react";
import { quizStatus } from "./interfaces/quizStatus";
import { Category } from "./interfaces/category";
import { getCategories, getQuestions } from "./util/api";
import { Question } from "./interfaces/question";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizStatus, setQuizStatus] = useState<quizStatus>('idle');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const scoreRef = useRef(0);
  const percentageRef = useRef(0);
  const resultRef = useRef(false)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { answers: currentOptions, correct_answer } = questions[currentIndex];
    scoreRef.current = selectedOption === correct_answer ? scoreRef.current + 1 : scoreRef.current;
    console.log("score is " + scoreRef.current)
    

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(ci => ci + 1);
    } else {
      percentageRef.current = Math.round((scoreRef.current / questions.length) * 100);
      resultRef.current = percentageRef.current >= 50 ? true : false;
      setQuizStatus("finished");
    }
  }


  return (
    <>
      <header>
        <h1>Computer Science Quiz</h1>
      </header>
      <main>
        {quizStatus === 'idle' && <section>
          <header>
            <h3>Welcome to a quiz that's going to test your computer knowledge!</h3>
          </header>
          <div>
            <label htmlFor="categorySelect">Plese choose a category</label>
            <select name="categorySelect" id="categorySelect" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">----------</option>
              {categories && categories.map(cat => (
                <option value={cat.name} key={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button onClick={() => setQuizStatus("begun")} disabled={selectedCategory === ''}>Start Quiz</button>
          </div>
        </section>}
        {quizStatus === 'begun' && questions.length && <section>
          <form onSubmit={handleSubmit}>
            <p>{questions && questions[currentIndex]?.question}</p>
            <ul>
              {Object.values(questions[currentIndex].answers).filter((ans) => ans !== null).map((ans,i) => (
                <li key={ans}>
                  <label>
                    <input type="radio" name={currentIndex.toString()} value={Object.keys(questions[currentIndex].answers)[i]} onChange={(e) => setSelectedOption(e.target.value) } />
                    {ans}
                  </label>
                </li>
              ))}
            </ul>
            <button type="submit" disabled={!selectedOption}>{currentIndex < questions.length - 1 ? "Next" : "Finish"} </button>
          </form>
          </section>
          }
          {quizStatus === 'finished' && <section>
              <ul>
                <li>Score: {percentageRef.current} %</li>
                <li>Total questions: {questions.length}</li>
                <li>Correct answers: {scoreRef.current}</li>
              </ul>
            </section>}
      </main>
    </>
  );
}

export default App;
