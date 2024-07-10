import { Question } from "../interfaces/question";

interface ScorePageProps {
    onResetBtnClick: React.MouseEventHandler<HTMLButtonElement>;
    percentageRef: React.MutableRefObject<number>;
    questions: Question[];
    resultRef: React.MutableRefObject<boolean>;
    scoreRef: React.MutableRefObject<number>;
}

export default function ScorePage({ onResetBtnClick, percentageRef, questions, resultRef, scoreRef }: ScorePageProps) {
    return (
        <section className="w-1/2 min-h-72 p-2 flex flex-col justify-center items-center gap-6 bg-slate-100 rounded-lg shadow-xl">
            <ul className="text-xl space-y-3 w-3/4">
                <li className="flex gap-2"><span className="font-semibold flex-1">Score: </span> <span className="font-mono text-2xl" style={{ color: resultRef.current ? 'green' : 'crimson' }}>{percentageRef.current}%</span></li>
                <li className="flex gap-2"><span className="font-semibold flex-1">Total questions: </span><span className="font-mono text-2xl">{questions.length}</span></li>
                <li className="flex gap-2"><span className="font-semibold flex-1">Correct answers: </span> <span className="font-mono text-2xl">{scoreRef.current}</span></li>
            </ul>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-indigo-100 hover:bg-indigo-600" onClick={onResetBtnClick}>Try again</button>
        </section>
    )
}