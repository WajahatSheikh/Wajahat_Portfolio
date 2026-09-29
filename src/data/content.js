// All site copy lives here. Components import from this file rather than
// hardcoding text, so changing wording never means touching JSX.

// Order matches the order the sections appear in App.jsx. Anchor links that
// run backwards against the page order feel broken, so keep the two in sync.
export const nav = [
  { label: "Selected Work", href: "#work" },
  { label: "What I Do", href: "#capabilities" },
  { label: "Experience", href: "#experience" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "About Me", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
];

// The Drive *view* URL (…/file/d/<id>/view) serves an HTML preview page, not
// the file — this is Drive's direct-download form, which returns the PDF
// itself. Verified: 200, application/octet-stream, ~129 KB, no sign-in needed.
// If the file is ever re-uploaded, only the id below changes.
export const resumeLink =
  "https://drive.google.com/uc?export=download&id=1OsUCe6jQ3pU9tASMLeFacvWLUyQL9B9J";

export const hero = {
  meta: ["Sr. Product Designer", "+ 08 Years Experience", "Based in Karachi, PK"],
  headline: [
    { text: "I'm Wajahat Sheikh, a " },
    { text: "Sr. Product Designer", accent: true },
    { text: " who turns complex problems into products people love, from zero to launch." },
  ],
};

export const sectionCopy = {
  work: {
    eyebrow: "Selected Work",
    // `{count}` is filled from projects.length so the number can never drift
    // out of sync with the grid below it.
    title: "{count} Case Studies.",
    intro:
      "Each one shipped. The case studies are available on request — or ask me to walk you through the messy middle, which is where the real decisions live.",
  },
  capabilities: {
    eyebrow: "What I Do",
    title: "Expertise that ships.",
    intro:
      "Every skill here has been pressure-tested across real products, real users and real deadlines. Not theory, output.",
  },
  experience: {
    eyebrow: "Experience",
    title: "Where I've done it.",
    intro: "+8 years, four roles, two countries. Reverse chronological — most recent first.",
  },
  techStack: {
    eyebrow: "Tech Stack",
    title: "What I work in.",
    intro:
      "The kit behind the work — what each tool actually earns its place doing, not just a logo wall.",
  },
  about: {
    eyebrow: "About",
    title: "\u{1F44B} Hello",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Clients, colleagues & founders.",
    intro:
      "Collaboration doesn't stop once the project ships. Here are some of the people I've built with — and would gladly team up with again.",
  },
};

// Thumbnails that trail the cursor across the hero. Kept to eight of the
// twenty-eight available in /public/Header Fluid — they are 200-700 KB each,
// and past about eight the effect reads as noise rather than a portfolio.
// Paths are pre-encoded because the filenames contain spaces.
export const heroTrail = [
  "/Header%20Fluid/1%201.png",
  "/Header%20Fluid/Rectangle%202.png",
  "/Header%20Fluid/image%2037.png",
  "/Header%20Fluid/image-2.png",
  "/Header%20Fluid/5%201.png",
  "/Header%20Fluid/Rectangle%203.png",
  "/Header%20Fluid/image-1.png",
  "/Header%20Fluid/imgi_7_nbucnyvpl2dkpiqqdv52%201.png",
];

export const showreel = {
  // The looping preview is a 1920x1080 GIF and the full reel an MP4. Both are
  // large (43 MB / 34 MB) — see the note in CLAUDE.md before shipping.
  poster: "/videos/yms.gif",
  video: "/videos/yms%20video%20v2.mp4",
  playLabel: "Play showreel",
  closeLabel: "Close showreel",
};

// Shown on the hover overlay of any card that does not set its own
// `hoverLabel`. One default rather than the same string repeated ten times.
export const projectHoverLabel = "Upload Coming Soon";

// Order is the order they appear in the grid. Subtitles are stored in normal
// case and uppercased in CSS — the data stays readable and the styling stays
// one change away.
export const projects = [
  {
    title: "Goalytics: The AI Engine Behind Every Goal",
    subtitle: "SaaS Product Design · Web App · Goalytics",
    image: null,
    featuredBg: true,
    hoverLabel: "In Progress",
  },
  {
    title: "Management System for the Biggest Logistics Firm in UAE",
    subtitle: "Management System · Web App · Digital Gravity",
    image: null,
  },
  {
    title: "Quiz to Customized Health Pack in Minutes",
    subtitle: "Web Design · Website · Digital Gravity",
    image: null,
  },
  {
    title: "University of Sharjah",
    subtitle: "Web Design · Website · Digital Gravity",
    image: "university-of-sharjah",
  },
  {
    title: "High School to University — in Just 03 Clicks!",
    subtitle: "Product Design · Mobile App · Paramount Students",
    image: null,
    // Cards with a slug open /projects/<slug>; the rest stay non-clickable
    // until their case study is written.
    slug: "high-school-to-university",
  },
  {
    title: "A Space for Students to Belong, Create, and Connect",
    subtitle: "Product Design · Mobile App · Paramount Students",
    image: null,
  },
  {
    title: "Centralized Admission Dashboard for Universities",
    subtitle: "Management System · Web App · Paramount Students",
    image: "centralized-admission-dashboard",
  },
  {
    title: "Where Kids Learn by Playing | 20+ Games",
    subtitle: "Game Design · Mobile App · SABAQ",
    image: "where-kids-learn-by-playing",
  },
  {
    title: "Flutter Word",
    subtitle: "Game Design · Mobile App · SABAQ",
    image: "flutter-word",
  },
  {
    title: "Strike A Balance",
    subtitle: "Game Design · Mobile App · SABAQ",
    image: "strike-a-balance",
  },
];

// Numbers are rendered from the index, not stored — an earlier revision of this
// list skipped 11 and shipped a stray 12, which is the drift storing them invites.
//
// `preview` is the artwork that follows the cursor on hover. Null falls back to
// a plain black card; drop a GIF/image path in to replace it per row.
export const capabilities = [
  {
    title: "AI-Powered Product Design",
    description:
      "Design intelligent interfaces where AI feels intuitive, not overwhelming. Prompt UX, contextual recommendations, confidence scoring, and human-in-the-loop patterns that build user trust.",
    preview: null,
  },
  {
    title: "Design Systems",
    description:
      "Build and govern token architectures, multi-variant component APIs, and contribution models that keep design and engineering shipping in sync — from startup speed to enterprise governance.",
    preview: null,
  },
  {
    title: "Mobile App",
    description:
      "iOS and Android experiences rooted in platform conventions. Gesture-driven navigation, adaptive layouts, offline-ready architecture, and WCAG-compliant accessibility baked in from day one.",
    preview: null,
  },
  {
    title: "End-to-End SaaS Design",
    description:
      "From onboarding funnels to data-heavy dashboards — I turn complex B2B workflows into interfaces teams actually adopt. Role-based views, dense data patterns, and self-serve experiences that reduce support load.",
    preview: null,
  },
  {
    title: "Web Design",
    description:
      "High-performing marketing sites and landing pages engineered for conversion. Information hierarchy, responsive systems, performance-first layouts, and copy-design alignment that drives real business results.",
    preview: null,
  },
  {
    title: "Management System",
    description:
      "Complex workflows made simple. CRMs, admin consoles, and back-office platforms built for power users — table-dense layouts, bulk actions, keyboard-first navigation, and role-based access patterns.",
    preview: null,
  },
  {
    title: "Game UI/UX Design",
    description:
      "Award-winning game and learning interfaces. Engagement loops, achievement systems, age-appropriate interactions, and structured playtesting that validate designs with real users before launch.",
    preview: null,
  },
  {
    title: "Brand & Visual Identity",
    description:
      "Strategic brand systems — logo architecture, type hierarchies, color frameworks, and comprehensive guidelines that stay consistent from pitch deck to production, across every touchpoint.",
    preview: null,
  },
];

export const experience = [
  {
    range: "Aug 2024 — Present",
    company: "Digital Gravity",
    role: "Sr. Product Designer",
    location: "Karachi, PK",
    description:
      "Architected an AI-powered OKR SaaS platform from ideation to production-ready delivery — UX architecture, a scalable UI system, and the responsive framework underneath it.",
  },
  {
    range: "Jan 2022 — Aug 2024",
    company: "Paramount Students",
    role: "Head of Product Design",
    location: "Istanbul, TR",
    description:
      "Led three integrated platforms and a team of 10+ designers across multiple nationalities, shipping every product on time inside agile MVP cycles.",
  },
  {
    range: "Apr 2020 — Oct 2020",
    company: "Digital Gravity",
    role: "UI/UX Designer",
    location: "Karachi, PK",
    description:
      "Delivered 6+ products across health, real estate, petroleum, logistics, and retail — discovery and visual design through to developer handoff.",
  },
  {
    range: "Dec 2017 — Apr 2020",
    company: "SABAQ · Multinet Pakistan",
    role: "Game UI/UX Designer",
    location: "Karachi, PK",
    description:
      "Designed 25+ award-winning EdTech games for the MUSE Learning App, with gameplay mechanics mapped directly to school curricula.",
  },
];

export const aboutParagraphs = [
  [
    {
      text: "I'm a Senior Product Designer with 8+ years turning early-stage ideas into products people actually use — from a first sketch through to a ",
    },
    { text: "shipped MVP", bold: true },
    { text: "." },
  ],
  [
    { text: "Right now I'm building Goalytics, an " },
    { text: "AI-powered OKR platform", bold: true },
    {
      text: ", from a blank canvas: information architecture, design system, and interface, all within one design lifecycle. Before that, I led design at Paramount Students, where investor-ready prototypes helped the team ",
    },
    { text: "secure $200K in seed funding", bold: true },
    { text: ", and designed " },
    { text: "25+ award-winning EdTech games", bold: true },
    { text: " that shipped inside the MUSE Learning App." },
  ],
  [
    {
      text: "I think in systems, not screens. The work I enjoy most is sitting with a Product Owner to turn a messy business problem into a clear user flow — then building the components so the rest of the team can move fast without reinventing the wheel.",
    },
  ],
  [
    {
      text: "I've led design across teams in Pakistan and Türkiye, with collaborators from 10+ nationalities, and I still start every project the same way: understand how people actually work, then design around that.",
    },
  ],
];

export const quickFacts = [
  { label: "Based in", value: "Karachi, PK" },
  { label: "Experience", value: "8+ years" },
  { label: "Worked across", value: "Pakistan & Türkiye" },
  { label: "Teams led", value: "10+ designers" },
  { label: "Products shipped", value: "30+" },
];

export const badges = [
  { name: "GESS Education Awards", file: "gess-award" },
  { name: "PDA Best Digital Innovation", file: "pda" },
  { name: "National Innovation Awards", file: "national-innovation" },
  { name: "Next Billion EdTech Prize", file: "next-billion" },
  { name: "P@SHA ICT Awards", file: "pasha" },
];

export const techStack = [
  {
    name: "Figma",
    description:
      "Where every design lives — from lo-fi wireframes to the design system components engineering pulls straight into production.",
    icon: "Figma",
  },
  {
    name: "Adobe Illustrator",
    description:
      "For icon sets, brand marks, and vector illustration work that needs to stay crisp at any size.",
    icon: "Illustrator",
  },
  {
    name: "Adobe Photoshop",
    description:
      "Photo composites and mockup polish for case studies and pitch-ready presentation visuals.",
    icon: "PS",
  },
  {
    name: "Notion",
    description:
      "My single source of truth — research notes, sprint docs, and design specs the whole team can search.",
    icon: "Notion",
  },
  {
    name: "Claude Code",
    description:
      "AI-assisted design workflows: turning rough flows into working prototypes and Figma files faster.",
    icon: "Claudecode",
  },
  {
    name: "Mobbin",
    description:
      "A daily reference library — real shipped patterns that keep my flows grounded in what already works.",
    icon: "Mobbin",
  },
  {
    name: "Slack",
    description:
      "Async-first collaboration with distributed teams across Pakistan, Türkiye, and beyond.",
    icon: "Slack",
  },
  {
    name: "Trello",
    description:
      "Lightweight task tracking for design sprints, when a full ticketing system would just slow things down.",
    icon: "Trello",
  },
  {
    name: "Jira",
    description:
      "Where OKR-driven design work gets scoped, estimated, and handed off without losing context.",
    icon: "Jira",
  },
  {
    name: "Fathom",
    description:
      "Auto-transcribes stakeholder calls so I can stay in the conversation instead of taking notes.",
    icon: "Fathom",
  },
  {
    name: "Framer",
    description:
      "For high-fidelity, interactive prototypes that test like the real product before a line of code ships.",
    icon: "Framer",
  },
  {
    name: "ChatGPT",
    description:
      "A thinking partner for first drafts — UX copy, edge cases, and stress-testing a flow before I commit to it.",
    icon: "ChatGpt",
  },
];

export const testimonials = [
  {
    name: "Hassan Bin Rizwan",
    title: "P@SHA, SABAQ (Director)",
    quote:
      "Wajahat played a key role in our Co-Pilot project, seamlessly integrating it into game design. His innovative approach to educational technology has transformed the MUSE app, creating engaging learning experiences for children. We appreciate his dedication and the positive impact he has made.",
    avatar: "Frame 57",
  },
  {
    name: "Muhammad Umair",
    title: "Service Delivery Manager (SDM)",
    quote:
      "I highly recommend him as a best product designer. His exceptional design skills and attention to detail were evident throughout his time working under me. Wajahat consistently delivered visually appealing and user-centric designs, collaborating effectively with cross-functional teams.",
    avatar: "Frame 58",
  },
  {
    name: "Nida Mehtab Gillio",
    title: "Goalytics & Caryatid (Founder & CEO)",
    quote:
      "Wajahat is our founding designer. I have always maintained direct communication with him to brainstorm ideas. He is professional and composed, always asking what problems we are addressing. He translates our concepts into functional features from 0→1, guiding us in building a fully operational MVP.",
    avatar: "Frame 57-1",
  },
  {
    name: "Azeem Ilyas",
    title: "AA Animation Studio (Founder)",
    quote:
      "Wajahat is one of the best designers I know in my network. We have worked together in the same organization. He is a very dedicated and hardworking individual. I love his game designs, and we have completed many projects together.",
    avatar: "Frame 57-2",
  },
  {
    name: "Suhail Sajid Panjwani",
    title: "Paramount Students (CMO)",
    quote:
      "It has been such an honor to work side by side with him to build something extraordinary. We didn't just solve a problem; we saved the educational futures of many students. He is a true leader and a great mentor on our team.",
    avatar: "Frame 57-3",
  },
  {
    name: "Agha Zeeshan",
    title: "Goalytics (Product Owner)",
    quote:
      "My experience with Wajahat has been refreshingly different. He consistently demonstrates humility and professionalism. Wajahat approaches design with a logical mindset, always considering the development costs while ensuring the best outcomes.",
    avatar: "image 6",
  },
  {
    name: "Abdul Basit",
    title: "Goalytics (AI/Python Engineer)",
    quote:
      "Wajahat is a great designer and truly great to work with. He is a super fast worker, communicates well and is true talent in the history. If you have a chance to work with him, take it!",
    avatar: "Frame 57-4",
  },
  {
    name: "Aysha Abdul Rab",
    title: "Founder of Global Minds Education",
    quote:
      "We hired him as a freelance website designer and branding expert to elevate our small startup to the next level. I truly admire his commitment and attention to communication. He advised us not only on design but also on some technical business go-to-market strategies.",
    avatar: "image 4",
  },
  {
    name: "Khalid Boulhala",
    title: "Founder & CEO @ Plentora",
    quote:
      "I don't want to make a traditional statement about him. He played a crucial role in helping us secure $200K in funding through their design flow prototypes, which accelerated our operations.",
    avatar: "image 5",
  },
];

export const contactCta = {
  eyebrow: "Let's talk",
  title: "Hiring for a senior or lead product design role?",
  cta: "Contact Me",
};

export const contact = {
  email: "wajahat.sheikh@outlook.com",
  whatsapp: "+92-322-2600-937",
  location: "Karachi, PK",
};

// wa.me wants digits only — no +, spaces or dashes. Derived from the number
// above so the display format and the link can never drift apart.
export const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

export const footer = {
  name: "Wajahat Sheikh",
  tagline: "Sr. Product Designer · AI SaaS, EdTech & platform products",
  availability: "Open to senior & lead roles",
  // The large closing line. The tagline is metadata and reads badly at display
  // size — set big, it wrapped onto a line starting with its own separator.
  statement: "Let's build something worth shipping.",
  // Set oversized across the base of the footer and clipped by it.
  wordmark: "Wajahat Sheikh",
  // Grouped rather than one flat row: a footer link list reads as navigation,
  // and five undifferentiated links give the eye nowhere to start.
  columns: [
    {
      title: "Say hello",
      // The address and number are the labels — under a "Say hello" heading
      // they are more useful visible than hidden behind the word "Email".
      // Tapping the number opens WhatsApp straight onto this contact.
      wide: true,
      links: [
        { label: contact.email, href: `mailto:${contact.email}` },
        { label: contact.whatsapp, href: whatsappLink },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/wajahat-sheikh-%C2%A9-539542184/",
        },
        { label: "Behance", href: "https://www.behance.net/wajahatshykh" },
        { label: "Dribbble", href: "https://dribbble.com/WajahatShykh" },
        { label: "Instagram", href: "https://www.instagram.com/wajahat_designs/" },
        { label: "Medium", href: "https://medium.com/@vajatshaykh" },
      ],
    },
  ],
  // Drives the live clock — a designer's footer that knows what time it is
  // where they are reads as a person rather than a template.
  timeZone: "Asia/Karachi",
  locationLabel: "Karachi, PK",
  backToTop: "Back to top",
  copyright: "© 2026 Wajahat Sheikh",
};
