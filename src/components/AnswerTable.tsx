import React, { useEffect, useState } from 'react';

type Answer = {
    questionNumber: number;
    answer: string;
};

function AnswersTable() {
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const lsValue = localStorage.getItem('quizapp-answers');
        if (lsValue !== null) {
            try {
                const parsed = JSON.parse(lsValue);
                const answersArray = Object.keys(parsed).map((key) => ({
                    questionNumber: parseInt(key) + 1,
                    answer: parsed[key],
                }));
                setAnswers(answersArray);
            } catch (e) {
                console.error('Failed to parse answers from localStorage', e);
            }
        }
    }, []);

    const handleNewTest = () => {
        localStorage.clear()
    }

    return (
        <div className="w-full h-screen px-4 sm:px-8">
            <h1 className="text-black text-center text-lg font-semibold pb-3">Your Answers</h1>
            <table className="w-full sm:w-3/4 md:w-1/2 bg-white text-black mx-auto text-sm sm:text-base">
                <thead>
                    <tr>
                        <th className="py-2">Question Number</th>
                        <th className="py-2">Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map((answer) => (
                        <tr key={answer.questionNumber}>
                            <td className="border px-4 py-2">{answer.questionNumber}</td>
                            <td className="border px-4 py-2">{answer.answer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={handleNewTest}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Start New Test
            </button>
        </div>
    );
}

export default AnswersTable;