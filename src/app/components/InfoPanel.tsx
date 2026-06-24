import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { track } from '@vercel/analytics';

interface InfoPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

function scrollToPortfolioIndex() {
  const portfolioProgress = 0.56;
  const sceneSectionPx = (800 / 100) * window.innerHeight;
  const sceneScrollable = Math.max(sceneSectionPx - window.innerHeight, 1);
  window.scrollTo({ top: portfolioProgress * sceneScrollable, behavior: 'smooth' });
}

interface NodeDetail {
  title: string;
  description: string;
  skills: string[];
  caseStudyLinks?: Array<{ label: string; href: string }>;
}

const nodeDetails: Record<string, NodeDetail> = {
  'react-stack': {
    title: 'React · Next.js · TypeScript',
    description: 'Core frontend stack across client and product work. Built scalable React/Next.js applications from prototype to production, including ExpediaParts. Also delivered private enterprise tooling for Apple TV+ using React to connect Airtable databases with Retool CMS for internal information workflows. Expanded framework coverage includes Angular.js implementations at First Republic Bank, Vue.js product-marketing builds for AntaresTech, and PHP/jQuery JavaScript development for Drum Channel platform work.',
    skills: ['React', 'Next.js', 'TypeScript', 'Angular.js', 'Vue.js', 'PHP', 'jQuery', 'JavaScript (ES6+)', 'Tailwind CSS', 'Responsive Design'],
    caseStudyLinks: [
      { label: 'ExpediaParts — React product and marketing interfaces', href: '#case-study-expediaparts' },
      { label: 'Drum Channel — PHP, JavaScript, and jQuery platform architecture', href: '#case-study-drumchannel' },
      { label: 'First Republic Bank — Angular.js internal tooling', href: '#case-study-first-republic-bank' },
      { label: 'Apple TV+ — Private React + Airtable + Retool CMS work (no public case study)', href: '#case-studies' },
      { label: 'AntaresTech — Vue.js product and launch interfaces', href: '#case-study-antarestech' },
    ],
  },
  'design-systems': {
    title: 'Design Systems',
    description: 'Built and maintained reusable component libraries that align engineering and design. Across client and product work, translated design requirements into scalable frontend systems, interaction patterns, and reusable UI foundations.',
    skills: ['Component Libraries', 'Figma', 'Design Tokens', 'Storybook Patterns', 'Frontend Architecture', 'Micro-Frontend Concepts', 'State Management', 'Accessibility (WCAG)'],
    caseStudyLinks: [
      { label: 'Upcraft — Multi-brand UI systems', href: '#case-study-upcraft' },
      { label: 'ExpediaParts — Product UX and componentized interfaces', href: '#case-study-expediaparts' },
      { label: 'SchooLink — Referral workflow UX and wireframe systems', href: '#case-study-schoolink' },
      { label: 'Drum Channel — Design system, dashboard redesign, IA', href: '#case-study-drumchannel' },
      { label: 'Visual Sound Engineer — Full design system and library', href: '#case-study-visual-studio-engineer' },
      { label: 'Agavos Group — Website redesign and design assets', href: '#case-study-agavos-group' },
      { label: 'First Republic Bank — TMTS flows and prototyping', href: '#case-study-first-republic-bank' },
      { label: 'imFORZA / Nipit — Brand site and responsive design', href: '#case-study-imforza' },
    ],
  },
  learning: {
    title: 'Digital Learning Platforms',
    description: 'As Front-End / Design Technologist at Drum Channel, built and maintained a WordPress-based learning platform using PHP, JavaScript, and jQuery for 130K+ users. Improved engagement metrics 2x through performance optimization, UX enhancements, and accessibility improvements.',
    skills: ['WordPress Platform Development', 'PHP', 'JavaScript', 'jQuery', 'LearnDash LMS', 'GravityForms Integration', 'Dashboard & Course UI', 'Membership Experiences', 'GA4 Reporting', 'Looker Studio'],
    caseStudyLinks: [
      { label: 'Drum Channel — Digital learning platform case study', href: '#case-study-drumchannel' },
    ],
  },
  ecommerce: {
    title: 'E-Commerce & Marketing',
    description: 'Built e-commerce and marketing experiences across product, growth, and campaign initiatives. Delivered Vue.js launch interfaces at Antares Audio Technologies, scalable marketing and product surfaces for ExpediaParts and Upcraft, conversion-focused campaign systems at Drum Channel, and full brand/commerce website design-development work for imFORZA and Agavos Group.',
    skills: ['Vue.js', 'E-Commerce Interfaces', 'Marketing Campaigns', 'Performance Optimization', 'Product Launch UX', 'WordPress / Marketo', 'Salesforce Integration', 'Cross-Browser Testing'],
    caseStudyLinks: [
      { label: 'Upcraft — Multi-brand marketing and web strategy execution', href: '#case-study-upcraft' },
      { label: 'ExpediaParts — E-commerce UX, careers, and conversion flows', href: '#case-study-expediaparts' },
      { label: 'Drum Channel — Campaign dashboards, drip campaigns, and growth UX', href: '#case-study-drumchannel' },
      { label: 'Visual Sound Engineer — Marketing landing pages and design systems', href: '#case-study-visual-studio-engineer' },
      { label: 'imFORZA / Nipit — Brand and commerce website design + development', href: '#case-study-imforza' },
      { label: 'Agavos Group — Marketing-focused website redesign', href: '#case-study-agavos-group' },
      { label: 'Antares Audio Technologies — Vue.js launch interfaces', href: '#case-study-antarestech' },
    ],
  },
  enterprise: {
    title: 'Enterprise & Internal Tools',
    description: 'Built React, Next.js, and Angular interfaces for enterprise and internal workflows. Delivered accessible applications supporting financial operations, reporting, and internal tooling across client organizations.',
    skills: ['React / Next.js', 'Angular', 'Retool', 'Airtable', 'Enterprise Design Systems', 'CI/CD Pipelines', 'API Integration', 'Accessible Interfaces'],
    caseStudyLinks: [
      { label: 'First Republic Bank — Enterprise internal tools case study', href: '#case-study-first-republic-bank' },
    ],
  },
  analytics: {
    title: 'Machine Learning Data Analysis',
    description: 'Completed client-facing machine learning and analytics work through UC San Diego focused on transmission demand segmentation, regional pattern detection, and data-informed inventory planning. Built workflows from raw order data through clustering analysis and dashboard interpretation for practical business decision-making.',
    skills: ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'K-Means Clustering', 'Jupyter Notebook', 'CRISP-DM', 'Demand Segmentation'],
    caseStudyLinks: [
      { label: 'UCSD ML / ExpediaParts — Parts Demand Inventory Analysis', href: '#case-study-ucsd-ml-analytics' },
      { label: 'UCSD ML / ExpediaParts — Sales Forecasting and Resource Optimization', href: '#case-study-ucsd-ml-analytics' },
    ],
  },
  'cms-platforms': {
    title: 'CMS & Platforms',
    description: 'Extensive experience integrating and customizing enterprise CMS and marketing platforms. Currently building reusable component frameworks across WordPress, Marketo, and Salesforce deployments for multiple clients.',
    skills: ['WordPress / Gutenberg', 'Sanity CMS', 'HubSpot', 'Marketo', 'Salesforce', 'GA4', 'Looker Studio', 'Headless CMS Patterns'],
    caseStudyLinks: [
      { label: 'Upcraft — WordPress, Marketo, and Salesforce component frameworks', href: '#case-study-upcraft' },
      { label: 'ExpediaParts — CMS-integrated marketing and product surfaces', href: '#case-study-expediaparts' },
      { label: 'Drum Channel — WordPress platform architecture and custom components', href: '#case-study-drumchannel' },
      { label: 'imFORZA / Nipit — WordPress implementation and CMS page systems', href: '#case-study-imforza' },
      { label: 'AntaresTech — CMS and launch-platform integrations', href: '#case-study-antarestech' },
    ],
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

          <button
            onClick={() => {
              onClose();
              scrollToPortfolioIndex();
            }}
            className="absolute top-8 left-10 text-[#FEF5EC]/45 hover:text-[#F9D976] transition-colors uppercase"
            style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', letterSpacing: '0.25em', cursor: 'none' }}
          >
            Back to Portfolio Index
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

            {/* Case study links */}
            {details.caseStudyLinks?.length ? (
              <div className="mt-8">
                <div className="flex items-center gap-4 mb-5">
                  <span
                    className="text-[#FEF5EC]/25 text-[10px] tracking-[0.4em] uppercase"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    Design Case Studies
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="flex flex-col gap-0">
                  {details.caseStudyLinks.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        track('sidebar_case_study_click', {
                          nodeId,
                          label: item.label,
                          href: item.href,
                        });
                      }}
                      className="flex items-center gap-4 py-2.5 border-b border-white/8 last:border-b-0 text-[#FEF5EC]/65 hover:text-[#F9D976] transition-colors duration-200"
                      style={{ cursor: 'none' }}
                    >
                      <span
                        className="text-[#FEF5EC]/50 text-[9px] tracking-widest"
                        style={{ fontFamily: '"Inter", sans-serif', minWidth: '1.4rem' }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-xs tracking-wide"
                        style={{ fontFamily: '"Inter", sans-serif' }}
                      >
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Bottom spacer */}
            <div className="mt-auto pt-8" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
