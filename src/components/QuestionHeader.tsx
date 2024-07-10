import { Question } from "../interfaces/question";

interface QuestionHeaderProps {
    index: number;
    q: Question[];
    timer: number;
}

export default function QuestionHeader({index, q, timer}: QuestionHeaderProps) {
    return (
        <header className="flex justify-between items-center py-2 px-3">
        <h5 className="text-sm">
          Question <span className="font-semibold italic">{index + 1}</span> of <span className="font-semibold italic">{q.length}</span>
        </h5>
        <div className="px-2 py-1 border border-dashed border-indigo-300 rounded-full w-7 h-7 flex justify-center items-center"><h5 className="text-sm font-semibold text-indigo-800">{timer}</h5></div>
      </header>
    )
}