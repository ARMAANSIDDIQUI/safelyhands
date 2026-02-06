import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold font-display text-white">Safely Hands</span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
              We are a technology-enabled platform simplifying the process of hiring domestic help in Moradabad. Verified, trained, and reliable.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Services</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/services/babysitter" className="hover:text-primary transition-colors">Babysitters</Link></li>
              <li><Link href="/services/cook" className="hover:text-primary transition-colors">Cooks & Chefs</Link></li>
              <li><Link href="/services/domestic-help" className="hover:text-primary transition-colors">Domestic Help</Link></li>
              <li><Link href="/services/elderly-care" className="hover:text-primary transition-colors">Elderly Care</Link></li>
              <li><Link href="/services/24-hour" className="hover:text-primary transition-colors">24 Hour Live-in</Link></li>
              <li><Link href="/quick-book" className="hover:text-primary transition-colors">On-Demand Help</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>Moradabad, Uttar Pradesh,<br />India</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-primary shrink-0" />
                <a href="mailto:armaansiddiqui.mbd@gmail.com" className="hover:text-white transition-colors">armaansiddiqui.mbd@gmail.com</a>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-primary shrink-0" />
                <a href="tel:+918888888888" className="hover:text-white transition-colors">+91 888 888 8888</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Safely Hands. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/sitemap" className="hover:text-slate-300">Sitemap</Link>
            <Link href="/disclaimer" className="hover:text-slate-300">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;