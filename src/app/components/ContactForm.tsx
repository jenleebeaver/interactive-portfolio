import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function scrollToPortfolioIndex() {
  const portfolioProgress = 0.56;
  const sceneSectionPx = (800 / 100) * window.innerHeight;
  const sceneScrollable = Math.max(sceneSectionPx - window.innerHeight, 1);
  window.scrollTo({ top: portfolioProgress * sceneScrollable, behavior: 'smooth' });
}

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          company, // honeypot field
        }),
      });

      if (!response.ok) {
        throw new Error(`Contact API submit failed with status ${response.status}`);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setCompany('');
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch {
      setIsSubmitting(false);
      setSubmitError('Message failed to send. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a0e27]/95 backdrop-blur-xl border-l border-blue-500/20 p-8 overflow-y-auto z-[60] font-sans"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-blue-200/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={() => {
              onClose();
              scrollToPortfolioIndex();
            }}
            className="absolute top-7 left-8 text-blue-200/65 hover:text-[#F9D976] transition-colors uppercase"
            style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.22em' }}
          >
            Back to Portfolio Index
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2
              className="text-2xl font-light text-white mb-2 tracking-[0.1em] uppercase"
            >
              Get In Touch
            </h2>
            <div className="h-px w-full bg-blue-500/30 mb-6"></div>
            <p className="text-blue-100/80 mb-8 leading-relaxed text-sm font-light">
              Interested in collaborating or have a question about my services? Send me a message and I'll get back to you soon.
            </p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-400/30 p-6 rounded-sm text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="text-green-300" size={20} />
                </div>
                <h3 className="text-green-100 font-medium mb-2 tracking-widest uppercase text-sm">Message Sent!</h3>
                <p className="text-green-200/80 text-xs font-light">Thanks for reaching out. I'll be in touch shortly.</p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-blue-200/60 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-blue-900/10 border border-blue-500/20 text-white px-4 py-3 focus:outline-none focus:border-blue-400/60 transition-colors focus:bg-blue-900/20 text-sm font-light"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-blue-200/60 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-blue-900/10 border border-blue-500/20 text-white px-4 py-3 focus:outline-none focus:border-blue-400/60 transition-colors focus:bg-blue-900/20 text-sm font-light"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] text-blue-200/60 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-blue-900/10 border border-blue-500/20 text-white px-4 py-3 focus:outline-none focus:border-blue-400/60 transition-colors focus:bg-blue-900/20 resize-none text-sm leading-relaxed font-light"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {submitError ? (
                  <p className="text-red-300 text-xs font-light">{submitError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-white px-6 py-4 uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-light"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
