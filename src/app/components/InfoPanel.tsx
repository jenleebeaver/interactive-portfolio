import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface InfoPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

const nodeDetails: Record<string, { title: string; description: string; skills: string[] }> = {
  'react-stack': {
    title: 'React · Next.js · TypeScript',
    description: 'Core frontend stack across every role. Built scalable, component-driven applications for learning platforms, enterprise clients, and e-commerce — from prototype to production with an emphasis on performance and clean architecture.',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'SASS', 'Tailwind CSS', 'Responsive Design'],
  },
  'design-systems': {
    title: 'Design Systems',
    description: 'Built and maintained reusable component libraries that align engineering and design. At Apple and Drum Channel, translated design requirements into scalable frontend systems used across multiple products and teams.',
    skills: ['Component Libraries', 'Figma', 'Design Tokens', 'Storybook Patterns', 'Frontend Architecture', 'Micro-Frontend Concepts', 'State Management', 'Accessibility (WCAG)'],
  },
  learning: {
    title: 'Digital Learning Platforms',
    description: 'As Front-End / Design Technologist at Drum Channel, built and maintained a React-based learning platform serving 130K+ users. Improved engagement metrics 2x through performance optimization, UX enhancements, and accessibility improvements.',
    skills: ['React UI Development', 'LearnDash LMS', 'GravityForms Integration', 'REST API Integration', 'Dashboard & Course UI', 'Membership Experiences', 'GA4 Reporting', 'Looker Studio'],
  },
  ecommerce: {
    title: 'E-Commerce & Marketing',
    description: 'At Antares Audio Technologies — makers of Auto-Tune — developed interactive Vue.js UI components supporting global product launches. Delivered high-performance front-end builds for marketing and e-commerce experiences.',
    skills: ['Vue.js', 'E-Commerce Interfaces', 'Marketing Campaigns', 'Performance Optimization', 'Product Launch UX', 'WordPress / Marketo', 'Salesforce Integration', 'Cross-Browser Testing'],
  },
  enterprise: {
    title: 'Enterprise & Internal Tools',
    description: 'At Apple (via Agavos Group) built React and Next.js components aligned with enterprise design systems. At First Republic Bank and ImForza, delivered accessible internal applications supporting financial operations and reporting workflows.',
    skills: ['React / Next.js', 'Angular', 'Retool', 'Airtable', 'Enterprise Design Systems', 'CI/CD Pipelines', 'API Integration', 'Accessible Interfaces'],
  },
  analytics: {
    title: 'Machine Learning Data Analysis',
    description: 'Completed client-facing machine learning and analytics work through UC San Diego focused on transmission demand segmentation, regional pattern detection, and data-informed inventory planning. Built workflows from raw order data through clustering analysis and dashboard interpretation for practical business decision-making.',
    skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'K-Means Clustering', 'Jupyter Notebook', 'CRISP-DM', 'Demand Segmentation'],
  },
  'cms-platforms': {
    title: 'CMS & Platforms',
    description: 'Extensive experience integrating and customizing enterprise CMS and marketing platforms. Currently building reusable component frameworks across WordPress, Marketo, and Salesforce deployments for multiple clients.',
    skills: ['WordPress / Gutenberg', 'Sanity CMS', 'HubSpot', 'Marketo', 'Salesforce', 'GA4', 'Looker Studio', 'Headless CMS Patterns'],
  },
  'ai-dev': {
    title: 'AI-Assisted Engineering',
    description: 'Actively uses Claude, Cursor, and ChatGPT to accelerate development, debugging, testing, documentation, and code review. Pursuing a Machine Learning Certification at UC San Diego (2025–2026) with hands-on Python and TensorFlow projects.',
    skills: ['Claude / Cursor / ChatGPT', 'AI-Powered Code Generation', 'Prompt Engineering', 'Python', 'TensorFlow (Intro)', 'ML Certification — UCSD', 'Automated Testing Workflows', 'Documentation Generation'],
  },
};

export function InfoPanel({ nodeId, onClose }: InfoPanelProps) {
  const details = nodeId ? nodeDetails[nodeId] : null;
  const entryNumber = nodeId
    ? String(Object.keys(nodeDetails).indexOf(nodeId) + 1).padStart(2, '0')
    : '—';

  return (
    <AnimatePresence>
      {details && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed right-0 top-0 h-full w-full md:w-[400px] z-50 overflow-y-auto"
          style={{ background: '#050e60', borderLeft: '1px solid rgba(254,245,236,0.1)' }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-[#FEF5EC]/30 hover:text-[#FEF5EC] transition-colors"
            style={{ cursor: 'none' }}
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="p-10 md:p-12 flex flex-col h-full"
          >
            {/* Entry number */}
            <span
              className="text-[#FEF5EC]/50 text-[10px] tracking-[0.45em] uppercase mb-8 block"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {entryNumber}
            </span>

            {/* Top rule */}
            <div className="h-px bg-white/15 mb-8" />

            {/* Title */}
            <h2
              className="text-[#FEF5EC] uppercase mb-6"
              style={{
                fontFamily: '"Poiret One", sans-serif',
                fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
                lineHeight: 1.1,
                letterSpacing: '0.08em',
              }}
            >
              {details.title}
            </h2>

            {/* Description */}
            <p
              className="text-[#FEF5EC]/50 leading-relaxed mb-10"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.02em',
              }}
            >
              {details.description}
            </p>

            {/* Skills section */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-[#FEF5EC]/25 text-[10px] tracking-[0.4em] uppercase"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Key Skills
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex flex-col gap-0">
                {details.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.04 }}
                    className="flex items-center gap-4 py-2.5 border-b border-white/8 last:border-b-0"
                  >
                    <span
                      className="text-[#FEF5EC]/50 text-[9px] tracking-widest"
                      style={{ fontFamily: '"Inter", sans-serif', minWidth: '1.4rem' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[#FEF5EC]/65 text-xs tracking-wide"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom rule */}
            <div className="h-px bg-white/15 mt-auto pt-8 border-t border-white/15" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
