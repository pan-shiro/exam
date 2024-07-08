import { useEffect, useState } from "react";
import { quizStatus } from "./interfaces/quizStatus";
import { Category } from "./interfaces/category";
import { getCategories } from "./util/api";

function App() {
  const [ quizStatus, setQuizStatus] = useState<quizStatus>('idle');
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const startFetching = async () => {
      const res = await getCategories();
      console.log(res);
      setCategories(res);
    }

    startFetching();
  },[]);


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
        </main>
    </>
);}

export default App;
