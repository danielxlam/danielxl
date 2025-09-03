
import React from 'react';

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" viewBox="0 0 64 64" fill="none">
        {/* Banana */}
        <path d="M38 12 C48 10, 58 22, 54 32 C50 42, 38 42, 28 44 C34 34, 32 18, 38 12 Z" fill="#facc15" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Monkey Head */}
        <path d="M32,24 C18,24 12,38 12,48 C12,58 42,58 42,48 C42,38 36,24 32,24 Z" fill="#A16207" />
        {/* Monkey Face */}
        <path d="M32,30 C22,30 18,39 18,47 C18,53 36,53 36,47 C36,39 32,30 32,30 Z" fill="#F7BE88" />
        {/* Eyes */}
        <circle cx="26" cy="42" r="2" fill="black" />
        <circle cx="38" cy="42" r="2" fill="black" />
        {/* Ears */}
        <circle cx="12" cy="38" r="6" fill="#A16207" />
        <circle cx="52" cy="38" r="6" fill="#A16207" />
        {/* Mouth */}
        <path d="M28,48 C30,50 34,50 36,48" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-base-200 border-b border-base-300 shadow-md">
            <div className="container mx-auto flex items-center justify-center p-4">
                <LogoIcon />
                <h1 className="ml-3 text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                    猴子香蕉
                </h1>
            </div>
        </header>
    );
};