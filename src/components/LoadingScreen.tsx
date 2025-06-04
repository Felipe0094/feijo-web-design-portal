import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center fade-in">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-[#FA0108] border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-[#FA0108] text-xl font-semibold animate-pulse">Carregando...</h2>
            </div>
        </div>
    );
};

export default LoadingScreen; 