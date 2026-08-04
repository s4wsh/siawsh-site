import React, { useState } from 'react';
import { useStudioTheme } from '../context/ThemeContext';

export default function ContactForm() {
  const { mode, t } = useStudioTheme();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('Architecture');

  const disciplines = [
    { id: 'arch', label: t.contact?.disciplines?.arch || 'Architecture' },
    { id: 'interior', label: t.contact?.disciplines?.interior || 'Interior' },
    { id: 'furniture', label: t.contact?.disciplines?.furniture || 'Furniture' },
    { id: 'motion', label: t.contact?.disciplines?.motion || 'Motion Design' },
    { id: 'branding', label: t.contact?.disciplines?.branding || 'Branding' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.append("access_key", "f5778241-8463-452c-8e63-489e789530b3");
    formData.append("selected_discipline", selectedDiscipline);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        e.target.reset();
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2>{t.contact?.title}</h2>
        <p className="contact-subtitle">
          {mode === 'spatial'
            ? t.contact?.descSpatial
            : t.contact?.descCinematic}
        </p>

        {submitted ? (
          <div className="success-message">
            <h3>{t.contact?.successTitle}</h3>
            <p>{t.contact?.successDesc}</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Discipline Selection Buttons */}
            <div className="discipline-selector">
              <label className="field-label">{t.contact?.disciplineLabel || "Select Service"}</label>
              <div className="discipline-grid">
                {disciplines.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`discipline-pill ${selectedDiscipline === item.label ? 'active' : ''}`}
                    onClick={() => setSelectedDiscipline(item.label)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                placeholder={t.contact?.namePlaceholder} 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email" 
                placeholder={t.contact?.emailPlaceholder} 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder={t.contact?.msgPlaceholder} 
                rows="5" 
                required 
                className="form-input"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? t.contact?.btnSending : t.contact?.btnSend}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}