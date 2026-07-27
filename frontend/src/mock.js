// Static content (categories, testimonials, process). Products now come from backend API.

export const LOGO_URL = "https://customer-assets-m6fa6gv7.emergentagent.net/job_venus-v2/artifacts/urm3257g_Logo.webp";

export const categories = [
  {
    id: "lamps",
    name: "Sculptural Lamps",
    tagline: "Illuminate with art",
    image: "https://images.unsplash.com/photo-1732552599124-f3dd512c02ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwzfHwzRCUyMHByaW50ZWQlMjBsYW1wfGVufDB8fHx8MTc4NTE1NzU5OHww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "handbags",
    name: "Statement Handbags",
    tagline: "Wearable geometry",
    image: "https://images.unsplash.com/photo-1589363358751-ab05797e5629?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDB8fHx8MTc4NTE1NzU5OHww&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "sculptures",
    name: "Sculptures",
    tagline: "Form meets emotion",
    image: "https://images.unsplash.com/photo-1672343385650-8d5bb804580a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmV8ZW58MHx8fHwxNzg1MTU3NjA0fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "decor",
    name: "Home Decor",
    tagline: "Curate your space",
    image: "https://images.unsplash.com/photo-1667312939978-64cf31718a6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwZGVjb3J8ZW58MHx8fHwxNzg1MTU3NTk4fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "custom",
    name: "Custom Models",
    tagline: "Your vision, printed",
    image: "https://images.unsplash.com/photo-1691957713140-a9a042252202?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBzY3VscHR1cmV8ZW58MHx8fHwxNzg1MTU3NjA0fDA&ixlib=rb-4.1.0&q=85",
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
  { n: "04", title: "Deliver", copy: "Packaged with care and shipped worldwide from our workshop." },
];
