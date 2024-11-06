'use client';

import React from 'react'

type Props = {
    question: string;
    options: string[];
    questionNumber: number;
    disabled: boolean;
    onSelect: (option: string) => void;
}

function getOption(x: number): string {
    if (x === 0) {
        return 'A';
    } else if (x === 1) {
        return 'B';
    } else if (x === 2) {
        return 'C';
    } else if (x === 3) {
        return 'D';
    } else {
        return '';
    }
}

function Question({ question, options, questionNumber, disabled, onSelect }: Props) {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white p-4 sm:p-8 mx-auto rounded-md shadow-md">
            <div className="text-black font-semibold mb-6 text-base sm:text-lg">
                {questionNumber}) - {question}</div>
            <div className="flex flex-col gap-4">
                {options.map((item, index) => (
                    <button
                        key={item}
                        className="w-full text-left text-black hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:hover:no-underline disabled:text-red-500"
                        disabled={disabled}
                        onClick={() => onSelect(getOption(index))}
                    >
                        <span>{getOption(index)}) {item}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Question