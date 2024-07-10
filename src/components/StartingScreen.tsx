import { Category } from "../interfaces/category";
import Instructions from "./Instructions";
import IntroHeader from "./IntroHeader";
import SelectCategories from "./SelectCategories";

interface StartingScreenProps {
    selectedCategory: string;
    categories: Category[];
    onSelectOptionChange: React.ChangeEventHandler<HTMLSelectElement>
    onStartQuizBtnClick: React.MouseEventHandler<HTMLButtonElement> 
}

export default function StartingScreen({selectedCategory, categories, onSelectOptionChange, onStartQuizBtnClick} : StartingScreenProps) {
    return (
        <section className="w-1/2 p-2 mx-auto bg-slate-100 rounded-lg shadow-xl">
            <IntroHeader />
            <div className="py-2 px-4">
                <Instructions />
                <div className="mt-10 flex gap-8 items-center">
                    <SelectCategories selectedCat={selectedCategory} categories={categories} onSelectOptionChange={onSelectOptionChange} />
                    <button className="rounded-lg bg-indigo-500 px-4 py-2 text-indigo-100 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed" onClick={onStartQuizBtnClick} disabled={selectedCategory === ''}>Start Quiz</button>

                </div>
                </div>
        </section>
    )
}