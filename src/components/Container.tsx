"use client"

import React, { useEffect, useState } from 'react'
import Question from './Question';
import AnswersTable from './AnswerTable';

type Props = {
    questions: ApiResponse;
}

const ANSWER_TIME_MS = 30_000;
const BLOCK_TIME_MS = 10_000;
const ALLOW_TIME_MS = ANSWER_TIME_MS - BLOCK_TIME_MS;
const LS_INDEX_KEY = 'quizapp-index';
const LS_ANSWERS_KEY = 'quizapp-answers';
const LS_REMAINING_TIME_KEY = 'quizapp-remaining-time';


function Container({ questions }: Props) {
    const limitedQuestions = questions.slice(0, 10);

    const [currentIndex, setCurrentIndex] = useState(() => {
        const value = localStorage.getItem(LS_INDEX_KEY);

        if (value === null) {
            localStorage.setItem(LS_INDEX_KEY, '0');
            return 0;
        }

        const asNumber = parseInt(value);

        if (isNaN(asNumber)) {
            localStorage.setItem(LS_INDEX_KEY, '0');
            return 0;
        }

        if (asNumber < 0 || asNumber > 9) {
            localStorage.setItem(LS_INDEX_KEY, '0');
            return 0;
        }

        return asNumber;
    });
    const [remainingTime, setRemainingTime] = useState(() => {
        const value = localStorage.getItem(LS_REMAINING_TIME_KEY);

        if (value === null) {
            localStorage.setItem(LS_REMAINING_TIME_KEY, `${ANSWER_TIME_MS}`);
            return ANSWER_TIME_MS;
        }

        const asNumber = parseInt(value);

        if (isNaN(asNumber)) {
            localStorage.setItem(LS_REMAINING_TIME_KEY, `${ANSWER_TIME_MS}`);
            return ANSWER_TIME_MS;
        }

        if (asNumber <= 0 || asNumber > ANSWER_TIME_MS) {
            localStorage.setItem(LS_REMAINING_TIME_KEY, `${ANSWER_TIME_MS}`);
            return ANSWER_TIME_MS;
        }

        return asNumber;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                const newRemainingTime = prev - 1000;
                localStorage.setItem(LS_REMAINING_TIME_KEY, `${newRemainingTime}`);
                return newRemainingTime;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (remainingTime <= 0) {
            const lsValue = localStorage.getItem(LS_ANSWERS_KEY);
            let answers: Record<number, string> = {};
            if (lsValue !== null) {
                try {
                    answers = JSON.parse(lsValue);
                } catch (e) { }
            }

            if (!answers[currentIndex]) {
                answers[currentIndex] = "No Answer";
                localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(answers));
            }

            setCurrentIndex((prev) => prev + 1);
            setRemainingTime(ANSWER_TIME_MS);
            localStorage.setItem(LS_INDEX_KEY, `${currentIndex + 1}`);
            localStorage.setItem(LS_REMAINING_TIME_KEY, `${ANSWER_TIME_MS}`);
        }
    }, [remainingTime, currentIndex]);

    return (
        <div className="w-full h-screen mx-auto p-4 sm:p-8 rounded-md shadow-md bg-slate-300">
            {currentIndex >= limitedQuestions.length ? (
                <AnswersTable />
            ) : (
                <>
                    <div className='text-black text-center text-lg font-semibold py-2 rounded-md mb-4'>Time: {remainingTime / 1000}</div>
                    <Question
                        questionNumber={currentIndex + 1}
                        question={limitedQuestions[currentIndex].title}
                        options={limitedQuestions[currentIndex].body.split("\n")}
                        disabled={remainingTime > ALLOW_TIME_MS}
                        onSelect={(option) => {
                            const lsValue = localStorage.getItem(LS_ANSWERS_KEY);
                            let answers: Record<number, string> = {};

                            if (lsValue !== null) {
                                try {
                                    const parsed = JSON.parse(lsValue);
                                    answers = parsed;
                                } catch (e) { }
                            }

                            answers[currentIndex] = option;

                            localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify(answers));
                            setCurrentIndex((prev) => prev + 1);
                            setRemainingTime(ANSWER_TIME_MS);
                            localStorage.setItem(LS_INDEX_KEY, `${currentIndex + 1}`);
                            localStorage.setItem(LS_REMAINING_TIME_KEY, `${ANSWER_TIME_MS}`);
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default Container