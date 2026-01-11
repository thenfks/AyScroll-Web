import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';

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
    return (
        <section className="relative py-20 sm:py-24 md:py-32 bg-black px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                            Questions
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
                        Everything you need to know about AyScroll
                    </p>
                </motion.div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
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
                                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-white hover:text-pink-500 transition-colors py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm sm:text-base text-zinc-400 leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12 sm:mt-16"
                >
                    <p className="text-zinc-400 mb-4">Still have questions?</p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-semibold transition-colors"
                    >
                        Contact our support team →
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
