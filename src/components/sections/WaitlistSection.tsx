import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export const WaitlistSection: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add waitlist submission logic
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-black py-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white"
                >
                    Be first to experience the{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                        future
                    </span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
                >
                    Join the waitlist for early access. We're launching soon and you don't want to miss it.
                </motion.p>

                {/* Email Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 h-12 px-4 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                    />
                    <button
                        type="submit"
                        className="h-12 px-8 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30"
                    >
                        {isSubmitted ? '✓ Joined!' : 'Join Waitlist'}
                    </button>
                </motion.form>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="space-y-2"
                >
                    <div className="w-full max-w-md mx-auto h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '84.7%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
                        />
                    </div>
                    <p className="text-sm text-zinc-400">
                        <span className="font-bold text-white">847</span> of 1000 spots claimed
                    </p>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center justify-center gap-3 pt-4"
                >
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <img
                                key={i}
                                src={`https://i.pravatar.cc/150?img=${i}`}
                                alt={`User ${i}`}
                                className="w-10 h-10 rounded-full border-2 border-black object-cover"
                            />
                        ))}
                    </div>
                    <p className="text-sm text-zinc-400">
                        Join <span className="font-semibold text-white">847+</span> others waiting for launch
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
