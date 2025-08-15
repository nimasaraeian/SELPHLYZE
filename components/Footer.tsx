"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  Heart, 
  Shield, 
  Mail, 
  Twitter, 
  Instagram, 
  Linkedin,
  Globe,
  Sparkles
} from "lucide-react";

const footerLinks = {
  product: [
    { name: "Psychology Tests", href: "/tests" },
    { name: "AI Modules", href: "/modules" },
    { name: "Expert Therapists", href: "/therapists" },
    { name: "Psychology Articles", href: "/psy-articles" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/mission" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR Compliance", href: "/gdpr" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
  { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-400" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-500" },
  { name: "Email", icon: Mail, href: "mailto:contact@selphlyze.ai", color: "hover:text-teal-400" }
];

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/95 to-transparent" />
      
      {/* Main Footer Content */}
      <div className="relative glass-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          
          {/* Top Section */}
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gradient-psyche">
                    AI Platform
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  Transforming mental health through AI-powered insights and expert guidance. 
                  Your journey to self-discovery starts here.
                </p>

                {/* Features Icons */}
                <div className="flex items-center gap-4 mb-8">
                  {[
                    { icon: Shield, label: "Secure" },
                    { icon: Heart, label: "Compassionate" },
                    { icon: Globe, label: "Global" },
                    { icon: Sparkles, label: "AI-Powered" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-teal-400/30 transition-all duration-300">
                        <feature.icon className="w-5 h-5 text-gray-400 group-hover:text-teal-400 transition-colors duration-300" />
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                        {feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`
                        p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 
                        transition-all duration-300 group
                        ${social.color}
                      `}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-white font-semibold text-lg mb-6 capitalize">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + categoryIndex * 0.1 + index * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-teal-300 transition-all duration-300 text-sm block py-1 hover:translate-x-1"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                © 2024 AI Platform. All rights reserved. 
                <span className="mx-2">•</span>
                Built with ❤️ for mental health
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-gray-400">AI Systems Online</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-400">15+ Languages</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-400">GDPR Compliant</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-gray-500 text-xs leading-relaxed text-center">
                <strong className="text-gray-400">Medical Disclaimer:</strong> This platform provides psychological insights and tools for educational purposes. 
                Our AI-powered assessments are not substitutes for professional medical or psychological diagnosis. 
                If you are experiencing severe mental health issues, please consult with a licensed healthcare provider.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute -top-10 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
    </footer>
  );
}
