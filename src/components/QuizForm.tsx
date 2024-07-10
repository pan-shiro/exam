import { Question } from "../interfaces/question";

interface QuizFormProps {
    onSubmitClick: React.FormEventHandler<HTMLFormElement>;
    questions: Question[];
    index:  number;
    multOptions: string[];
    selectedOpt: string;
    onInputChange: React.FormEventHandler<HTMLInputElement>
    checkboxCheck: boolean;
    isCheckboxType: boolean;
}

export default function QuizForm({onSubmitClick, questions, index, multOptions, selectedOpt, onInputChange, checkboxCheck, isCheckboxType}: QuizFormProps) {
    return (
        <form className="px-3" onSubmit={onSubmitClick}>
            <p className="text-lg font-semibold mb-4">{questions && questions[index]?.question}</p>
            <ul className="px-4">
              {Object.values(questions[index].answers).filter((ans) => ans !== null).map((ans, i) => (
                <li className="my-2 hover:bg-indigo-100 rounded-lg" key={ans}>
                  {questions[index].multiple_correct_answers !== "true" ?
                    <label className="align-middle font-mono w-full block">
                      <input key={i} className="mx-4 align-middle" type="radio" name={index.toString()} value={Object.keys(questions[index].answers)[i]} onChange={onInputChange} />
                      {ans}
                    </label>
                    :
                    <label className="align-middle font-mono w-full block">

                      <input key={i} className="mx-4 align-middle" type="checkbox" name={index.toString()} value={Object.keys(questions[index].answers)[i]} onChange={onInputChange} />
                      {ans}
                    </label>
                  }
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button className="rounded-lg bg-indigo-500 px-4 py-2 min-w-24 text-indigo-100 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed" type="submit" onClick={() => console.log(multOptions.length)} disabled={isCheckboxType ? !checkboxCheck : !selectedOpt}>{index < questions.length - 1 ? "Next" : "Submit answers"} </button>
            </div>
          </form>
    )
}