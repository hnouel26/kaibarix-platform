'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold text-white">KAIBARIX</div>
        <div className="flex gap-6">
          <a href="#about" className="text-white/80 hover:text-white transition">About</a>
          <a href="#services" className="text-white/80 hover:text-white transition">Services</a>
          <a href="#contact" className="text-white/80 hover:text-white transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Enterprise Operating System
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              for the Future
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            KAIBARIX is a cloud-based SaaS platform that transforms how enterprises operate with intelligent automation, AI-driven workflows, and digital workspaces.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-white/90 transition">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="services" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Core Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Intelligence Engine</h3>
              <p className="text-white/70">Advanced AI-powered automation and decision making for enterprise operations.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Workflow Automation</h3>
              <p className="text-white/70">Intelligent orchestration of business processes with real-time monitoring.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-white mb-2">Digital Workspace</h3>
              <p className="text-white/70">Collaborative environment for teams to work together seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">About KAIBARIX</h2>
          <p className="text-lg text-white/80 mb-8">
            KAIBARIX is designed for enterprises seeking to transform their operations through intelligent automation and digital transformation. Our platform combines cutting-edge AI with proven enterprise methodologies to deliver measurable results.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-white/70">Core Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Enterprise</div>
              <div className="text-white/70">Grade Security</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Global</div>
              <div className="text-white/70">Scalability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-lg text-white/80 mb-8">
            Ready to transform your enterprise? Contact us to learn more about KAIBARIX.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitted ? (
              <div className="text-green-400 font-semibold">
                Thank you! We'll be in touch soon.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Contact Us'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-white/60">
          <p>&copy; 2026 KAIBARIX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
