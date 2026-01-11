import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';
import { SupportIllustration } from '@/components/effects/SupportIllustration';
import { Mail } from 'lucide-react';
import { SupportSheet } from '@/components/ui/SupportSheet';
import { useState } from 'react';

const faqs = [
    {
        question: "What is AyScroll?",
        answer: "AyScroll is a revolutionary micro-learning platform that transforms how you consume knowledge. Learn by scrolling through bite-sized, engaging content tailored to your interests."
    },
    {
        question: "How does AyScroll work?",
        answer: "Simply scroll through your personalized feed of micro-lessons. Each scroll reveals a new piece of knowledge, making learning as natural and addictive as browsing social media."
    },
    {
        question: "Is AyScroll free?",
        answer: "AyScroll offers both free and premium plans. The free plan gives you access to thousands of micro-courses, while premium unlocks advanced features, offline access, and exclusive content."
    },
    {
        question: "What topics can I learn about?",
        answer: "From Quantum Physics to Renaissance Art, we cover thousands of topics across science, technology, arts, history, and more. Our AI curates content based on your interests and learning goals."
    },
    {
        question: "Can I use AyScroll offline?",
        answer: "Yes! Premium users can download content for offline access, perfect for learning on the go without internet connectivity."
    },
    {
        question: "How is my progress tracked?",
        answer: "AyScroll features smart analytics that visualize your learning journey, track retention rates, identify knowledge gaps, and provide personalized recommendations to optimize your learning."
    }
];

export const FAQSection: React.FC = () => {
    const [supportSheetOpen, setSupportSheetOpen] = useState(false);
    return (
        <section className="relative py-20 sm:py-24 md:py-32 bg-black px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[400px,1fr] gap-12 lg:gap-16">
                    {/* Left Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                Questions &{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                                    Answers
                                </span>
                            </h2>
                        </div>

                        {/* Animated Support Illustration */}
                        <SupportIllustration />

                        <div>
                            <p className="text-base text-zinc-400">
                                Have more questions? Don't hesitate to reach out:
                            </p>
                        </div>

                        <button
                            onClick={() => setSupportSheetOpen(true)}
                            className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/10 rounded-xl hover:bg-zinc-900 transition-all group w-full text-left"
                        >
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                <Mail className="w-5 h-5 text-zinc-400" />
                            </div>
                            <span className="text-sm text-zinc-300">support@ayscroll.com</span>
                        </button>

                        <SupportSheet open={supportSheetOpen} onOpenChange={setSupportSheetOpen} />
                    </motion.div>

                    {/* Right - Accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border border-white/10 rounded-2xl px-6 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/50 transition-all"
                                >
                                    <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-white hover:no-underline transition-colors py-6">
                                        <span className="text-white mr-3">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm sm:text-base text-zinc-400 leading-relaxed pb-6">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
