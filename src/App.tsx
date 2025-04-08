import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Showcase from './components/Showcase';
import ProjectDetail from './components/ProjectDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-beige text-black dark:bg-black dark:text-white transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto p-6">
                <section className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-6 text-center">Welcome to 85th Imperium</h2>
                  <p className="text-lg text-center mb-4">
                    Where innovation meets imagination. We're crafting the future, one project at a time.
                  </p>
                  <div className="mt-8 text-center">
                    <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg transition-colors hover:opacity-90">
                      Explore Our Work
                    </button>
                  </div>
                </section>
                <Showcase />
              </div>
            } />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;