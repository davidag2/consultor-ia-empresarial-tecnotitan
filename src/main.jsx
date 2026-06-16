import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { hasSupabaseConfig, supabase } from "./supabaseClient";
import "./styles.css";

const content = {
  es: {
    nav: ["Diagnostico", "Modulos", "Reportes", "Pagos"],
    action: "Iniciar diagnostico",
    loginAction: "Acceder",
    authTitle: "Acceso seguro",
    authIntro:
      "Empresarios, administradores y consultores internos ingresan con Supabase Auth y permisos por rol.",
    signIn: "Iniciar sesion",
    signUp: "Crear cuenta",
    signOut: "Cerrar sesion",
    email: "Correo",
    password: "Contrasena",
    fullName: "Nombre completo",
    accountType: "Tipo de cuenta",
    entrepreneur: "Empresario",
    consultant: "Consultor interno",
    admin: "Administrador",
    roleNote:
      "Por seguridad, las nuevas cuentas se crean como empresario. Un administrador puede promover consultores o administradores desde la base.",
    signedInAs: "Sesion activa",
    noConfig:
      "Faltan variables de entorno de Supabase. Configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.",
    authReady: "Auth conectado a Supabase",
    flowTitle: "Flujo completo del cliente",
    flowIntro:
      "Desde la seleccion de idioma hasta la entrega del reporte, cada paso queda preparado para conectar autenticacion, pagos y voz IA.",
    saveDraft: "Guardar borrador",
    back: "Atras",
    continue: "Continuar",
    ready: "Listo para reporte",
    summary: "Resumen de compra",
    selectedLanguage: "Idioma",
    company: "Empresa",
    saveCompany: "Guardar empresa",
    companySaved: "Empresa vinculada a tu usuario",
    companyRequiresAuth: "Inicia sesion para guardar la empresa",
    selectedPlan: "Plan",
    country: "Pais",
    industry: "Industria",
    allModules: "5 modulos",
    paymentTitle: "Capa lista para FastSpring",
    paymentBody:
      "Hoy se puede registrar pago manual. Mas adelante, FastSpring podra reemplazar el proveedor sin cambiar el recorrido del cliente.",
    paymentStatus: "Pago",
    reportState: "Reporte",
    pending: "Pendiente",
    locked: "Bloqueado hasta completar entrevista",
    unlocked: "Disponible al terminar",
    fullPackage: "Paquete completo",
    singleModule: "Modulo individual",
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
    loginAction: "Log in",
    authTitle: "Secure access",
    authIntro:
      "Business owners, admins, and internal consultants sign in with Supabase Auth and role-based permissions.",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    accountType: "Account type",
    entrepreneur: "Business owner",
    consultant: "Internal consultant",
    admin: "Administrator",
    roleNote:
      "For security, new accounts are created as business owners. An admin can promote consultants or admins from the database.",
    signedInAs: "Active session",
    noConfig:
      "Supabase environment variables are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    authReady: "Auth connected to Supabase",
    flowTitle: "Complete customer flow",
    flowIntro:
      "From language selection to report delivery, every step is ready to connect authentication, payments, and AI voice.",
    saveDraft: "Save draft",
    back: "Back",
    continue: "Continue",
    ready: "Ready for report",
    summary: "Purchase summary",
    selectedLanguage: "Language",
    company: "Company",
    saveCompany: "Save company",
    companySaved: "Company linked to your user",
    companyRequiresAuth: "Sign in to save the company",
    selectedPlan: "Plan",
    country: "Country",
    industry: "Industry",
    allModules: "5 modules",
    paymentTitle: "FastSpring ready layer",
    paymentBody:
      "Manual payment can be tracked now. Later, FastSpring can replace the provider without changing the customer journey.",
    paymentStatus: "Payment",
    reportState: "Report",
    pending: "Pending",
    locked: "Locked until interview is complete",
    unlocked: "Available when finished",
    fullPackage: "Full package",
    singleModule: "Single module",
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
    loginAction: "Entrar",
    authTitle: "Acesso seguro",
    authIntro:
      "Empresarios, administradores e consultores internos entram com Supabase Auth e permissoes por funcao.",
    signIn: "Entrar",
    signUp: "Criar conta",
    signOut: "Sair",
    email: "Email",
    password: "Senha",
    fullName: "Nome completo",
    accountType: "Tipo de conta",
    entrepreneur: "Empresario",
    consultant: "Consultor interno",
    admin: "Administrador",
    roleNote:
      "Por seguranca, novas contas sao criadas como empresario. Um administrador pode promover consultores ou administradores na base.",
    signedInAs: "Sessao ativa",
    noConfig:
      "Faltam variaveis de ambiente do Supabase. Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.",
    authReady: "Auth conectado ao Supabase",
    flowTitle: "Fluxo completo do cliente",
    flowIntro:
      "Da selecao de idioma ate a entrega do relatorio, cada etapa fica pronta para conectar autenticacao, pagamentos e voz IA.",
    saveDraft: "Salvar rascunho",
    back: "Voltar",
    continue: "Continuar",
    ready: "Pronto para relatorio",
    summary: "Resumo da compra",
    selectedLanguage: "Idioma",
    company: "Empresa",
    saveCompany: "Salvar empresa",
    companySaved: "Empresa vinculada ao seu usuario",
    companyRequiresAuth: "Entre para salvar a empresa",
    selectedPlan: "Plano",
    country: "Pais",
    industry: "Industria",
    allModules: "5 modulos",
    paymentTitle: "Camada pronta para FastSpring",
    paymentBody:
      "Hoje e possivel registrar pagamento manual. Depois, FastSpring podera substituir o provedor sem mudar a jornada do cliente.",
    paymentStatus: "Pagamento",
    reportState: "Relatorio",
    pending: "Pendente",
    locked: "Bloqueado ate concluir entrevista",
    unlocked: "Disponivel ao finalizar",
    fullPackage: "Pacote completo",
    singleModule: "Modulo individual",
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

const flowSteps = [
  {
    id: "language",
    title: { es: "Seleccionar idioma", en: "Select language", pt: "Selecionar idioma" },
    body: {
      es: "Define el idioma del sitio, la entrevista de voz y el reporte ejecutivo.",
      en: "Set the language for the site, voice interview, and executive report.",
      pt: "Defina o idioma do site, da entrevista por voz e do relatorio executivo.",
    },
  },
  {
    id: "profile",
    title: { es: "Perfil de empresa", en: "Company profile", pt: "Perfil da empresa" },
    body: {
      es: "Registra datos minimos para personalizar preguntas, industria y recomendaciones.",
      en: "Capture minimum data to personalize questions, industry context, and recommendations.",
      pt: "Registre dados minimos para personalizar perguntas, industria e recomendacoes.",
    },
  },
  {
    id: "plan",
    title: { es: "Modulo o paquete", en: "Module or package", pt: "Modulo ou pacote" },
    body: {
      es: "El cliente compra un modulo individual o el diagnostico integral completo.",
      en: "The customer buys a single module or the full comprehensive diagnosis.",
      pt: "O cliente compra um modulo individual ou o diagnostico integral completo.",
    },
  },
  {
    id: "payment",
    title: { es: "Pago internacional", en: "International payment", pt: "Pagamento internacional" },
    body: {
      es: "La compra queda lista para pago manual hoy y futura integracion FastSpring.",
      en: "The purchase is ready for manual payment today and future FastSpring integration.",
      pt: "A compra fica pronta para pagamento manual hoje e futura integracao FastSpring.",
    },
  },
  {
    id: "interview",
    title: { es: "Entrevista por voz IA", en: "AI voice interview", pt: "Entrevista por voz IA" },
    body: {
      es: "La IA conversa con el empresario, adapta preguntas y guarda transcripciones.",
      en: "The AI speaks with the owner, adapts questions, and stores transcripts.",
      pt: "A IA conversa com o empresario, adapta perguntas e salva transcricoes.",
    },
  },
  {
    id: "report",
    title: { es: "Reporte ejecutivo", en: "Executive report", pt: "Relatorio executivo" },
    body: {
      es: "Se entrega puntuacion, riesgos, oportunidades y plan de accion 30/60/90.",
      en: "The customer receives scores, risks, opportunities, and a 30/60/90 action plan.",
      pt: "O cliente recebe pontuacao, riscos, oportunidades e plano de acao 30/60/90.",
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
  const [flowStep, setFlowStep] = useState(0);
  const [planType, setPlanType] = useState("single");
  const [authMode, setAuthMode] = useState("signin");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authStatus, setAuthStatus] = useState("");
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    password: "",
    requestedRole: "entrepreneur",
  });
  const [companyProfile, setCompanyProfile] = useState({
    name: "Empresa Demo SAS",
    country: "Colombia",
    industry: "Servicios B2B",
  });
  const [companyId, setCompanyId] = useState(null);
  const [companyStatus, setCompanyStatus] = useState("");
  const t = content[language];
  const activeModule = useMemo(
    () => modules.find((module) => module.id === selectedModule),
    [selectedModule],
  );
  const selectedPrice = planType === "full" ? "$500.000 COP" : "$100.000 COP";
  const selectedPlanLabel = planType === "full" ? t.fullPackage : t.singleModule;
  const reportState = flowStep >= 5 ? t.unlocked : t.locked;

  const fetchProfile = async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name, role, preferred_language")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setAuthStatus(error.message);
      return;
    }

    setProfile(data);
    if (data?.preferred_language) {
      setLanguage(data.preferred_language);
    }
  };

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      fetchProfile(data.session?.user?.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      fetchProfile(nextSession?.user?.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const updateAuthForm = (field, value) => {
    setAuthForm((current) => ({ ...current, [field]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthStatus("");

    if (!supabase) {
      setAuthStatus(t.noConfig);
      return;
    }

    if (authMode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      setAuthStatus(error ? error.message : t.signedInAs);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: {
        data: {
          full_name: authForm.fullName,
          preferred_language: language,
          requested_role: authForm.requestedRole,
        },
      },
    });

    setAuthStatus(error ? error.message : t.authReady);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setCompanyId(null);
    setCompanyStatus("");
  };

  const saveCompanyProfile = async () => {
    if (!supabase || !session?.user?.id) {
      setCompanyStatus(t.companyRequiresAuth);
      return false;
    }

    const companyPayload = {
      name: companyProfile.name,
      country: companyProfile.country,
      preferred_language: language,
      contact_name: profile?.full_name || authForm.fullName || "",
      contact_email: session.user.email,
      owner_user_id: session.user.id,
    };

    const request = companyId
      ? supabase.from("companies").update(companyPayload).eq("id", companyId).select("id").single()
      : supabase.from("companies").insert(companyPayload).select("id").single();

    const { data, error } = await request;

    if (error) {
      setCompanyStatus(error.message);
      return false;
    }

    setCompanyId(data.id);
    setCompanyStatus(t.companySaved);
    return true;
  };

  const advanceFlow = async () => {
    if (flowSteps[flowStep].id === "profile") {
      const saved = await saveCompanyProfile();
      if (!saved) return;
    }

    setFlowStep(Math.min(flowSteps.length - 1, flowStep + 1));
  };

  const goToFlow = () => {
    document.getElementById("flujo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToAuth = () => {
    document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          <button className="primary-action" onClick={goToFlow} type="button">
            {t.action}
          </button>
          <button className="secondary-action" onClick={goToAuth} type="button">
            {session ? profile?.role ?? t.loginAction : t.loginAction}
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

      <section className="customer-flow" id="flujo" aria-label={t.flowTitle}>
        <div className="flow-heading">
          <div>
            <h2>{t.flowTitle}</h2>
            <p>{t.flowIntro}</p>
          </div>
          <button className="secondary-action" type="button">
            {t.saveDraft}
          </button>
        </div>

        <div className="flow-layout">
          <nav className="flow-stepper" aria-label={t.flowTitle}>
            {flowSteps.map((step, index) => (
              <button
                className={index === flowStep ? "active" : index < flowStep ? "complete" : ""}
                key={step.id}
                onClick={() => setFlowStep(index)}
                type="button"
              >
                <span>{index + 1}</span>
                <strong>{step.title[language]}</strong>
              </button>
            ))}
          </nav>

          <article className="flow-panel">
            <span className="flow-count">
              {flowStep + 1} / {flowSteps.length}
            </span>
            <h3>{flowSteps[flowStep].title[language]}</h3>
            <p>{flowSteps[flowStep].body[language]}</p>

            {flowSteps[flowStep].id === "language" && (
              <div className="choice-grid three">
                {["es", "en", "pt"].map((option) => (
                  <button
                    className={option === language ? "choice active" : "choice"}
                    key={option}
                    onClick={() => setLanguage(option)}
                    type="button"
                  >
                    <strong>{option.toUpperCase()}</strong>
                    <span>
                      {option === "es"
                        ? "Espanol"
                        : option === "en"
                          ? "English"
                          : "Portugues"}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {flowSteps[flowStep].id === "profile" && (
              <div className="profile-step">
                <div className="form-grid">
                  {[
                    ["name", t.company],
                    ["country", t.country],
                    ["industry", t.industry],
                  ].map(([field, label]) => (
                    <label key={field}>
                      <span>{label}</span>
                      <input
                        onChange={(event) =>
                          setCompanyProfile({
                            ...companyProfile,
                            [field]: event.target.value,
                          })
                        }
                        value={companyProfile[field]}
                      />
                    </label>
                  ))}
                </div>
                <button className="secondary-action" onClick={saveCompanyProfile} type="button">
                  {t.saveCompany}
                </button>
                {companyStatus && <p className="flow-message">{companyStatus}</p>}
              </div>
            )}

            {flowSteps[flowStep].id === "plan" && (
              <div className="choice-grid two">
                <button
                  className={planType === "single" ? "choice active" : "choice"}
                  onClick={() => setPlanType("single")}
                  type="button"
                >
                  <strong>{t.singleModule}</strong>
                  <span>{activeModule[language]} - $100.000 COP</span>
                </button>
                <button
                  className={planType === "full" ? "choice active" : "choice"}
                  onClick={() => setPlanType("full")}
                  type="button"
                >
                  <strong>{t.fullPackage}</strong>
                  <span>{t.allModules} - $500.000 COP</span>
                </button>
              </div>
            )}

            {flowSteps[flowStep].id === "payment" && (
              <div className="payment-box">
                <strong>{t.paymentTitle}</strong>
                <p>{t.paymentBody}</p>
                <span>{t.pending}</span>
              </div>
            )}

            {flowSteps[flowStep].id === "interview" && (
              <div className="voice-box">
                <div className="voice-pulse" />
                <div>
                  <strong>{flowSteps[4].title[language]}</strong>
                  <p>{flowSteps[4].body[language]}</p>
                </div>
              </div>
            )}

            {flowSteps[flowStep].id === "report" && (
              <div className="report-preview-list">
                <span>{t.ready}</span>
                <strong>{t.report}</strong>
                <p>{t.reportBody}</p>
              </div>
            )}

            <div className="flow-actions">
              <button
                className="secondary-action"
                disabled={flowStep === 0}
                onClick={() => setFlowStep(Math.max(0, flowStep - 1))}
                type="button"
              >
                {t.back}
              </button>
              <button
                className="primary-action"
                onClick={advanceFlow}
                type="button"
              >
                {flowStep === flowSteps.length - 1 ? t.ready : t.continue}
              </button>
            </div>
          </article>

          <aside className="flow-summary">
            <h3>{t.summary}</h3>
            <dl>
              <div>
                <dt>{t.selectedLanguage}</dt>
                <dd>{language.toUpperCase()}</dd>
              </div>
              <div>
                <dt>{t.company}</dt>
                <dd>{companyProfile.name}</dd>
              </div>
              <div>
                <dt>{t.selectedPlan}</dt>
                <dd>{selectedPlanLabel}</dd>
              </div>
              <div>
                <dt>{t.moduleLabel}</dt>
                <dd>{activeModule[language]}</dd>
              </div>
              <div>
                <dt>{t.paymentStatus}</dt>
                <dd>{t.pending}</dd>
              </div>
              <div>
                <dt>{t.reportState}</dt>
                <dd>{reportState}</dd>
              </div>
            </dl>
            <div className="summary-total">
              <span>Total</span>
              <strong>{selectedPrice}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="auth-section" id="auth" aria-label={t.authTitle}>
        <div className="auth-copy">
          <h2>{t.authTitle}</h2>
          <p>{t.authIntro}</p>
          <div className="auth-status-line">
            <span className={hasSupabaseConfig ? "status-dot green" : "status-dot amber"} />
            <strong>{hasSupabaseConfig ? t.authReady : t.noConfig}</strong>
          </div>
        </div>

        <div className="auth-card">
          {session ? (
            <div className="session-panel">
              <span>{t.signedInAs}</span>
              <h3>{profile?.full_name || session.user.email}</h3>
              <dl>
                <div>
                  <dt>{t.email}</dt>
                  <dd>{session.user.email}</dd>
                </div>
                <div>
                  <dt>{t.accountType}</dt>
                  <dd>
                    {profile?.role === "admin"
                      ? t.admin
                      : profile?.role === "consultant"
                        ? t.consultant
                        : t.entrepreneur}
                  </dd>
                </div>
                <div>
                  <dt>{t.selectedLanguage}</dt>
                  <dd>{profile?.preferred_language?.toUpperCase() || language.toUpperCase()}</dd>
                </div>
              </dl>
              <button className="secondary-action" onClick={handleSignOut} type="button">
                {t.signOut}
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <div className="auth-tabs" role="tablist" aria-label={t.authTitle}>
                <button
                  className={authMode === "signin" ? "active" : ""}
                  onClick={() => setAuthMode("signin")}
                  type="button"
                >
                  {t.signIn}
                </button>
                <button
                  className={authMode === "signup" ? "active" : ""}
                  onClick={() => setAuthMode("signup")}
                  type="button"
                >
                  {t.signUp}
                </button>
              </div>

              {authMode === "signup" && (
                <label>
                  <span>{t.fullName}</span>
                  <input
                    autoComplete="name"
                    onChange={(event) => updateAuthForm("fullName", event.target.value)}
                    value={authForm.fullName}
                  />
                </label>
              )}

              <label>
                <span>{t.email}</span>
                <input
                  autoComplete="email"
                  onChange={(event) => updateAuthForm("email", event.target.value)}
                  type="email"
                  value={authForm.email}
                />
              </label>

              <label>
                <span>{t.password}</span>
                <input
                  autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                  minLength="6"
                  onChange={(event) => updateAuthForm("password", event.target.value)}
                  type="password"
                  value={authForm.password}
                />
              </label>

              {authMode === "signup" && (
                <label>
                  <span>{t.accountType}</span>
                  <select
                    onChange={(event) => updateAuthForm("requestedRole", event.target.value)}
                    value={authForm.requestedRole}
                  >
                    <option value="entrepreneur">{t.entrepreneur}</option>
                    <option value="consultant">{t.consultant}</option>
                  </select>
                </label>
              )}

              <p className="role-note">{t.roleNote}</p>

              {authStatus && <p className="auth-message">{authStatus}</p>}

              <button className="primary-action" type="submit">
                {authMode === "signin" ? t.signIn : t.signUp}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
