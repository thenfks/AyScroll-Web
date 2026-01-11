import React from 'react';
import Lottie from 'lottie-react';
import supportAnimation from '@/components/assets/support.json';

export const SupportIllustration: React.FC = () => {
    return (
        <div className="w-full aspect-square max-w-[280px]">
            <Lottie
                animationData={supportAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};
