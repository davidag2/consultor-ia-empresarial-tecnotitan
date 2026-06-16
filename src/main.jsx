import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const content = {
  es: {
    nav: ["Diagnostico", "Modulos", "Reportes", "Pagos"],
    action: "Iniciar diagnostico",
    title: "Diagnostico empresarial por IA",
    intro:
      "Conversa por voz natural con un consultor virtual especializado y recibe un reporte ejecutivo con puntajes, riesgos, oportunidades y acciones concretas.",
    moduleLabel: "Modulo seleccionado",
    individual: "Modulo individual",
    package: "Paquete completo",
    report: "Reporte ejecutivo",
    reportBody:
      "Puntaje general, analisis ejecutivo, oportunidades, riesgos y acciones listas para implementar.",
    progress: "Progreso de entrevista",
    risk: "Riesgo critico",
    opportunity: "Oportunidad prioritaria",
    plan: "Plan 30/60/90",
    planBody: "Prioridades, responsables, tiempos y metricas de avance.",
  },
  en: {
    nav: ["Diagnosis", "Modules", "Reports", "Payments"],
    action: "Start diagnosis",
    title: "AI business diagnosis",
    intro:
      "Speak naturally with a specialized virtual consultant and receive an executive report with scores, risks, opportunities, and concrete actions.",
    moduleLabel: "Selected module",
    individual: "Single module",
    package: "Full package",
    report: "Executive report",
    reportBody:
      "Overall score, executive analysis, opportunities, risks, and actions ready to implement.",
    progress: "Interview progress",
    risk: "Critical risk",
    opportunity: "Priority opportunity",
    plan: "30/60/90 plan",
    planBody: "Priorities, owners, timing, and progress metrics.",
  },
  pt: {
    nav: ["Diagnostico", "Modulos", "Relatorios", "Pagamentos"],
    action: "Iniciar diagnostico",
    title: "Diagnostico empresarial com IA",
    intro:
      "Converse por voz natural com um consultor virtual especializado e receba um relatorio executivo com pontuacoes, riscos, oportunidades e acoes concretas.",
    moduleLabel: "Modulo selecionado",
    individual: "Modulo individual",
    package: "Pacote completo",
    report: "Relatorio executivo",
    reportBody:
      "Pontuacao geral, analise executiva, oportunidades, riscos e acoes prontas para implementar.",
    progress: "Progresso da entrevista",
    risk: "Risco critico",
    opportunity: "Oportunidade prioritaria",
    plan: "Plano 30/60/90",
    planBody: "Prioridades, responsaveis, prazos e metricas de avancos.",
  },
};

const modules = [
  {
    id: "sales",
    icon: "M4 15h16M7 11l3-3 3 2 4-5",
    es: "Ventas",
    en: "Sales",
    pt: "Vendas",
    score: 72,
    risk: {
      es: "Pipeline poco predecible",
      en: "Low predictability in the sales pipeline",
      pt: "Pipeline pouco previsivel",
    },
    opportunity: {
      es: "Estandarizar seguimiento comercial",
      en: "Standardize commercial follow-up",
      pt: "Padronizar o acompanhamento comercial",
    },
  },
  {
    id: "operations",
    icon: "M6 7h12M6 12h12M6 17h8",
    es: "Operaciones",
    en: "Operations",
    pt: "Operacoes",
    score: 64,
    risk: {
      es: "Procesos dependientes de personas clave",
      en: "Processes depend on key people",
      pt: "Processos dependem de pessoas chave",
    },
    opportunity: {
      es: "Documentar flujos repetitivos",
      en: "Document repeatable workflows",
      pt: "Documentar fluxos repetitivos",
    },
  },
  {
    id: "finance",
    icon: "M5 17h14M8 17V9m4 8V5m4 12v-6",
    es: "Finanzas",
    en: "Finance",
    pt: "Financas",
    score: 69,
    risk: {
      es: "Visibilidad limitada de caja",
      en: "Limited cash flow visibility",
      pt: "Visibilidade limitada do caixa",
    },
    opportunity: {
      es: "Tablero semanal de liquidez",
      en: "Weekly liquidity dashboard",
      pt: "Painel semanal de liquidez",
    },
  },
  {
    id: "marketing",
    icon: "M5 15l4-8 4 8 2-4 4 4",
    es: "Marketing",
    en: "Marketing",
    pt: "Marketing",
    score: 78,
    risk: {
      es: "Canales sin medicion uniforme",
      en: "Channels lack consistent measurement",
      pt: "Canais sem medicao uniforme",
    },
    opportunity: {
      es: "Atribucion basica por campana",
      en: "Basic attribution by campaign",
      pt: "Atribuicao basica por campanha",
    },
  },
  {
    id: "technology_ai",
    icon: "M12 4v16M4 12h16M7 7l10 10M17 7L7 17",
    es: "Tecnologia e IA",
    en: "Technology and AI",
    pt: "Tecnologia e IA",
    score: 58,
    risk: {
      es: "Baja automatizacion de tareas",
      en: "Low task automation",
      pt: "Baixa automatizacao de tarefas",
    },
    opportunity: {
      es: "Priorizar casos de IA de alto impacto",
      en: "Prioritize high-impact AI use cases",
      pt: "Priorizar casos de IA de alto impacto",
    },
  },
];

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function App() {
  const [language, setLanguage] = useState("es");
  const [selectedModule, setSelectedModule] = useState("sales");
  const t = content[language];
  const activeModule = useMemo(
    () => modules.find((module) => module.id === selectedModule),
    [selectedModule],
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#diagnostico" aria-label="Tecnotitan IA">
          <span className="brand-mark">T</span>
          <span>Tecnotitan IA</span>
        </a>

        <nav className="nav-links" aria-label="Principal">
          {t.nav.map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <div className="language-switcher" aria-label="Seleccionar idioma">
            {["es", "en", "pt"].map((option) => (
              <button
                className={option === language ? "active" : ""}
                key={option}
                onClick={() => setLanguage(option)}
                type="button"
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="primary-action" type="button">
            {t.action}
          </button>
        </div>
      </header>

      <section className="workspace" id="diagnostico">
        <div className="intro-panel">
          <h1>{t.title}</h1>
          <p>{t.intro}</p>

          <div className="pricing-strip" aria-label="Precios">
            <article>
              <span>{t.individual}</span>
              <strong>$100.000 COP</strong>
            </article>
            <article>
              <span>{t.package}</span>
              <strong>$500.000 COP</strong>
            </article>
          </div>

          <section className="module-grid" id="modulos" aria-label="Modulos">
            {modules.map((module) => (
              <button
                className={module.id === selectedModule ? "module active" : "module"}
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                type="button"
              >
                <span className="module-icon">
                  <Icon path={module.icon} />
                </span>
                <span>{module[language]}</span>
                <small>{module.score}/100</small>
              </button>
            ))}
          </section>
        </div>

        <aside className="diagnostic-preview" aria-label="Vista previa del diagnostico">
          <div className="preview-header">
            <div>
              <span>{t.moduleLabel}</span>
              <h2>{activeModule[language]}</h2>
            </div>
            <strong>{activeModule.score}</strong>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              <span>{t.progress}</span>
              <strong>68%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: "68%" }} />
            </div>
          </div>

          <div className="insight-list" id="reportes">
            <article>
              <span className="status amber" />
              <div>
                <strong>{t.risk}</strong>
                <p>{activeModule.risk[language]}</p>
              </div>
            </article>
            <article>
              <span className="status green" />
              <div>
                <strong>{t.opportunity}</strong>
                <p>{activeModule.opportunity[language]}</p>
              </div>
            </article>
            <article>
              <span className="status blue" />
              <div>
                <strong>{t.plan}</strong>
                <p>{t.planBody}</p>
              </div>
            </article>
          </div>

          <div className="report-card">
            <span>{t.report}</span>
            <p>{t.reportBody}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
