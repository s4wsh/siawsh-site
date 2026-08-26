import React, { useState } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import TunnelGrid from '../components/TunnelGrid.jsx';
import ProjectModal from '../components/ProjectModal.jsx';

export default function SelectedPractices() {
  const { mode, isLight, lang, t } = useStudioTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects by current practice (spatial or cinematic)
  const filteredProjects = projectsData.filter(project =>
    project.categoryType?.includes(mode)
  );

  return (
    <section className={`pt-12 pb-6 md:pt-16 md:pb-8 transition-colors duration-500 ${
      isLight ? 'bg-white text-black' : 'bg-black text-white'
    }`}>
      {/* Standardized max-width container wrapper */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
        {/* Section Header */}
        <div className={`flex items-center justify-between border-b pb-6 ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          <h2 className="text-3xl font-light tracking-tight">{t.works.selectedPractices}</h2>
          <span className={`text-xs tracking-widest uppercase ${
            isLight ? 'text-black/50' : 'text-white/50'
          }`}>
            {new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(filteredProjects.length)} {filteredProjects.length === 1 ? t.works.project : t.works.projects}
          </span>
        </div>

        {/* Dynamic Cards Grid */}
        <TunnelGrid projects={filteredProjects} onSelectProject={setSelectedProject} />

        {/* Detail Modal */}
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          allProjects={projectsData}
          onSelectProject={setSelectedProject}
        />
      </div>
    </section>
  );
}