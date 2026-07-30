// Static content (categories, testimonials, process). Products come from backend API.

export const LOGO_URL = "https://customer-assets-m6fa6gv7.emergentagent.net/job_venus-v2/artifacts/urm3257g_Logo.webp";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const p = (path) => `${BACKEND}${path}`;

export const categories = [
  {
    id: "lamps",
    name: "Sculptural Lamps",
    tagline: "Illuminate with art",
    image: p("/api/static/products/nova-01.jpg"),
  },
  {
    id: "handbags",
    name: "Statement Handbags",
    tagline: "Wearable geometry — coming soon",
    image: "https://images.unsplash.com/photo-1589363358751-ab05797e5629?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDB8fHx8MTc4NTE1NzU5OHww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "sculptures",
    name: "Sculptures",
    tagline: "Form meets emotion — coming soon",
    image: p("/api/static/products/wavy-01.jpg"),
  },
  {
    id: "decor",
    name: "Home Decor",
    tagline: "Curate your space — coming soon",
    image: p("/api/static/products/shade-01.jpg"),
  },
  {
    id: "custom",
    name: "Custom Models",
    tagline: "Your vision, printed",
    image: p("/api/static/products/cargo-01.jpg"),
  },
];

export const testimonials = [
  { id: 1, name: "Ananya R.", role: "Interior Designer, Bengaluru", text: "Venus pieces have become the signature detail in every project I finish. They read as sculpture first, functional object second." },
  { id: 2, name: "Marcus L.", role: "Collector, London", text: "The craftsmanship is remarkable. My lamp arrived flawlessly finished — you can tell every piece is treated as art." },
  { id: 3, name: "Priya S.", role: "Homeowner, Dubai", text: "Ordered a custom bust of my late grandfather. The team was patient, thoughtful, and the result moved my entire family." },
];

export const processSteps = [
  { n: "01", title: "Design", copy: "Every form begins as a sketch, then a parametric 3D model refined over weeks." },
  { n: "02", title: "Print", copy: "Printed layer by layer in premium sustainable materials on industrial machines." },
  { n: "03", title: "Finish", copy: "Hand-sanded, sealed and polished in our studio. No two pieces are identical." },
  { n: "04", title: "Deliver", copy: "Packaged with care and shipped across India from our workshop." },
];
