/**
 * Section configuration for the scroll-driven video hero.
 * Each section defines its video pair (forward/reverse), annotation content,
 * and detail drawer content. Marker positions are in viewport percentages.
 */
const SECTIONS = [
  {
    id: 1,
    forwardVideo: '/videos/intro-01-d.webm',
    reverseVideo: '/videos/intro-01-d-reverse.webm',
    annotation: {
      subtitle: 'THE BEGINNING',
      title: 'NEW GENERATION',
      marker: { x: '55%', y: '42%' },
      detail: {
        heading: 'A VISION OF TOMORROW',
        description:
          'Where innovation meets the horizon. A new era of design emerges — one that redefines what is possible. Every line, every curve, every surface has been crafted with purpose and precision.',
      },
    },
  },
  {
    id: 2,
    forwardVideo: '/videos/intro-02-d.webm',
    reverseVideo: '/videos/intro-02-d-reverse.webm',
    annotation: {
      subtitle: 'THE DESIGN',
      title: 'PURE ELEGANCE',
      marker: { x: '40%', y: '48%' },
      detail: {
        heading: 'FORM FOLLOWS FUNCTION',
        description:
          'Every surface tells a story. The aerodynamic silhouette cuts through the air with effortless grace while maximizing interior volume. A masterclass in the balance between beauty and engineering.',
      },
    },
  },
  {
    id: 3,
    forwardVideo: '/videos/intro-03-d.webm',
    reverseVideo: '/videos/intro-03-d-reverse.webm',
    annotation: {
      subtitle: 'ENGINEERING',
      title: 'THE HEART OF CHANGE',
      marker: { x: '60%', y: '50%' },
      detail: {
        heading: 'POWER REIMAGINED',
        description:
          'Beneath the surface lies a revolutionary propulsion system. Hybrid-electric technology delivers unprecedented range and performance while maintaining our commitment to zero emissions at sea.',
      },
    },
  },
  {
    id: 4,
    forwardVideo: '/videos/intro-04-d.webm',
    reverseVideo: '/videos/intro-04-d-reverse.webm',
    annotation: {
      subtitle: 'PERFORMANCE',
      title: 'BEYOND LIMITS',
      marker: { x: '45%', y: '40%' },
      detail: {
        heading: 'ENGINEERED FOR EXCELLENCE',
        description:
          'Speed, stability, and silence converge. The catamaran hull design provides exceptional stability while the electric drive system delivers a whisper-quiet experience at cruising speed.',
      },
    },
  },
  {
    id: 5,
    forwardVideo: '/videos/intro-05-d.webm',
    reverseVideo: '/videos/intro-05-d-reverse.webm',
    annotation: {
      subtitle: 'THE FUTURE',
      title: 'INTO THE HORIZON',
      marker: { x: '50%', y: '45%' },
      detail: {
        heading: 'YOUR JOURNEY AWAITS',
        description:
          'This is not just a vessel — it is a statement. A commitment to the ocean, to innovation, and to the extraordinary experiences that lie ahead. The future of luxury seafaring starts here.',
      },
    },
  },
];

export default SECTIONS;
