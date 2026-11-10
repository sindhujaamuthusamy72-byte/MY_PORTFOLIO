import './SectionHeader.css';

export default function SectionHeader({ number, label, title, subtitle }) {
  return (
    <div className="scarlet-section-header">
      <div className="section-rubric-row">
        <span className="section-rubric-num">{number}</span>
        <span className="section-rubric-divider">—</span>
        <span className="section-rubric-label">{label}</span>
      </div>
      {title && <h2 className="section-rubric-title">{title}</h2>}
      {subtitle && <p className="section-rubric-subtitle">{subtitle}</p>}
    </div>
  );
}
