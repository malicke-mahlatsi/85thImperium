import React, { useState } from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from './ContactForm';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

Modal.setAppElement('#root');

const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const sections = {
    mission: {
      title: 'Our Mission',
      content: 'To pioneer transformative technological solutions that empower businesses and individuals to achieve unprecedented success in the digital age.'
    },
    values: {
      title: 'Our Values',
      content: 'Innovation, Excellence, Integrity, and Client Success drive everything we do. We believe in pushing boundaries while maintaining the highest standards of quality and ethical conduct.'
    },
    team: {
      title: 'Our Team',
      content: 'A diverse group of passionate innovators, creative problem-solvers, and technical experts committed to delivering exceptional results for our clients.'
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const sectionVariants = {
    collapsed: { height: 48 },
    expanded: { height: 'auto' }
  };

  const handleLearnMore = () => {
    onClose();
    setShowContactForm(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal-content"
        overlayClassName="modal-overlay"
        contentLabel="About Us Modal"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          className="bg-imperial-blue/95 dark:bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-auto relative border border-imperial-gold/20"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-imperial-gold hover:text-imperial-gold/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div variants={textVariants} className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="logo-container mx-auto mb-4"
            >
              <span className="logo-text animate-glow">85</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-cinzel font-bold text-imperial-gold dark:text-imperial-blue mb-4 animate-glow"
            >
              85th Imperium
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-imperial-ivory/80 dark:text-imperial-charcoal/80 font-montserrat"
            >
              Blending innovation with legacy to create cutting-edge tech solutions that lead the industry.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {Object.entries(sections).map(([key, section]) => (
              <motion.div
                key={key}
                initial="collapsed"
                animate={expandedSection === key ? "expanded" : "collapsed"}
                variants={sectionVariants}
                className="bg-imperial-gold/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full px-6 py-3 text-left flex justify-between items-center"
                >
                  <span className="text-imperial-gold dark:text-imperial-blue font-cinzel font-semibold">{section.title}</span>
                  <motion.span
                    animate={{ rotate: expandedSection === key ? 180 : 0 }}
                    className="text-imperial-gold dark:text-imperial-blue"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedSection === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-imperial-ivory/80 dark:text-imperial-charcoal/80 font-montserrat">{section.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <button
              onClick={handleLearnMore}
              className="elegant-button inline-block"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </Modal>
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </>
  );
};

export default AboutUsModal;