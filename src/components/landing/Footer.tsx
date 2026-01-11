import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

const socialLinks = [
  { icon: Twitter, href: "https://x.com/ayscrl" },
  { icon: Instagram, href: "https://www.instagram.com/ayscroll_/" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/ayscroll/" },
  { icon: Github, href: "#" }
];

const footerLinks = {
  product: ["Features", "How It Works", "Pricing", "Download"],
  company: ["About", "Careers", "Blog", "Press"],
  resources: ["Help Center", "Community", "Creator Guide", "API"],
  support: ["Contact", "FAQ", "Status", "Feedback"]
};

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section - Centered on Mobile */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12 md:hidden">
          <Link to="/" className="flex items-center gap-2 group mb-4">
            <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">AyScroll</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-4">
            Learn by scrolling. Knowledge, one scroll at a time.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all hover:scale-110">
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid - 2 columns on mobile, 5 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 sm:mb-16">
          {/* Logo Section - Desktop Only */}
          <div className="hidden md:block space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/ayscroll-official-logo.png" alt="AyScroll Micro Learning Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-bold tracking-tight text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">AyScroll</span>
              </span>
            </Link>
            <p className="text-base text-zinc-400 leading-relaxed">
              Learn by scrolling. Knowledge, one scroll at a time. Join the future of micro-learning.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all hover:scale-110">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Product</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm text-zinc-400">
              {footerLinks.product.map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm text-zinc-400">
              {footerLinks.company.map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Resources</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm text-zinc-400">
              {footerLinks.resources.map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-3 sm:space-y-4 text-sm text-zinc-400">
              {footerLinks.support.map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
            © 2024 AyScroll. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex gap-6 sm:gap-8">
              <Link to="/" className="text-xs sm:text-sm text-zinc-400 hover:text-pink-500 transition-colors">Privacy</Link>
              <Link to="/" className="text-xs sm:text-sm text-zinc-400 hover:text-pink-500 transition-colors">Terms</Link>
              <Link to="/" className="text-xs sm:text-sm text-zinc-400 hover:text-pink-500 transition-colors">Cookies</Link>
            </div>
            <span className="text-xs sm:text-sm text-zinc-600">nFKs Affiliated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
