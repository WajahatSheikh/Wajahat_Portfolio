/**
 * Long-form case studies, keyed by the `slug` on the matching entry in
 * projects (content.js). A project without a slug has no page yet and its
 * card stays non-clickable.
 *
 * Shape of a section:
 *   label     - small eyebrow, and the label used in the side nav
 *   statement - the one big line that carries the section
 *   body      - paragraphs
 *   points    - optional sub-points, each { title, body }
 *   media     - optional { src, alt, caption }; null renders a placeholder
 *
 * EVERYTHING BELOW IS PLACEHOLDER COPY. It is written to the real shape and
 * length so the layout is honest, but none of it is the actual case study —
 * replace the strings, not the structure.
 */
export const caseStudies = {
  "high-school-to-university": {
    eyebrow: "Paramount Students · Shipped 2023",
    title: "High School to University — in Just 03 Clicks!",
    summary:
      "A mobile application that collapses a months-long university application into three guided steps, built for students applying across borders for the first time.",
    hero: null,

    meta: [
      { label: "Role", value: "Head of Product Design" },
      { label: "Timeline", value: "Jan – Aug 2023" },
      { label: "Team", value: "1 PM · 4 Engineers · 2 Designers" },
      { label: "Skills", value: "Product Design · UX Research · Design System" },
    ],

    sections: [
      {
        id: "overview",
        label: "Overview",
        statement:
          "Applying abroad meant forty tabs, six portals, and no way to tell whether you had finished.",
        body: [
          "Placeholder. Paramount Students helps school leavers apply to universities across Türkiye, the UK and the Gulf. The old flow was a web form bolted onto a counsellor's spreadsheet — students started it on a laptop, abandoned it, and rang a human to finish.",
          "Placeholder. This case study covers the eight months we spent turning that into a mobile-first flow a student could complete on the bus.",
        ],
        media: null,
      },
      {
        id: "problem",
        label: "The Problem",
        statement: "Students were not confused about universities. They were confused about status.",
        body: [
          "Placeholder. Every research session surfaced the same sentence in a different accent: “I don't know if it went through.”",
        ],
        points: [
          {
            title: "1. No single source of truth",
            body: "Placeholder. Documents lived in WhatsApp, deadlines in email, and decisions in a portal nobody remembered the password to.",
          },
          {
            title: "2. The form punished mistakes",
            body: "Placeholder. One wrong field near the end meant restarting a section, so students stopped before finishing rather than risk the work.",
          },
          {
            title: "Key insight: the counsellor was the interface",
            body: "Placeholder. Students trusted a person, not a progress bar. Anything we designed had to earn that same confidence on its own.",
          },
        ],
        media: null,
      },
      {
        id: "research",
        label: "Research",
        statement: "18 student interviews, 4 counsellor shadowing sessions, 1 very long spreadsheet.",
        body: [
          "Placeholder. We shadowed counsellors through a full intake cycle and mapped every question they asked, then compared it against what the product actually collected.",
          "Placeholder. Roughly a third of the fields were never used in a decision. Cutting them was the single biggest win available before any pixels moved.",
        ],
        media: null,
      },
      {
        id: "design",
        label: "Design Process",
        statement: "Three clicks, three decisions: who you are, where you want to go, what you send.",
        body: [
          "Placeholder. We rebuilt the flow around three commitments rather than twelve form pages, and let the app fill in everything it could infer.",
        ],
        points: [
          {
            title: "Progressive disclosure over long forms",
            body: "Placeholder. Each step asks for the minimum needed to unlock the next, so an abandoned session still leaves a usable application.",
          },
          {
            title: "Status as a first-class screen",
            body: "Placeholder. The home screen answers “where am I?” before it offers anything else.",
          },
        ],
        media: null,
      },
      {
        id: "outcome",
        label: "Outcome",
        statement: "Completion rose, support tickets fell, and the counsellors got their evenings back.",
        body: [
          "Placeholder — replace with the real numbers once they are cleared for publication.",
        ],
        media: null,
      },
      {
        id: "reflection",
        label: "Reflection",
        statement: "What I would do differently.",
        points: [
          {
            title: "Test the empty states earlier",
            body: "Placeholder. We designed the happy path first and spent the last month retrofitting every state where a document was missing or a deadline had passed.",
          },
          {
            title: "Bring engineering into research",
            body: "Placeholder. The sessions two engineers sat in on produced better scoping conversations than any handoff document I wrote.",
          },
        ],
      },
    ],
  },
};

export function getCaseStudy(slug) {
  return caseStudies[slug] ?? null;
}
