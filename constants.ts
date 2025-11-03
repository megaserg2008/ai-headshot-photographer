
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey',
    prompt: 'A professional corporate headshot of a person against a solid, light grey backdrop. The lighting is bright and even, creating a clean and sharp look. The person looks confident and approachable.',
    thumbnailUrl: 'https://picsum.photos/seed/corporate/200/200',
  },
  {
    id: 'tech-office',
    name: 'Modern Tech Office',
    prompt: 'A professional headshot of a person in a modern tech office environment. The background is slightly blurred, showing glimpses of glass walls and minimalist furniture. The lighting is natural, as if from a large window.',
    thumbnailUrl: 'https://picsum.photos/seed/tech/200/200',
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural',
    prompt: 'A professional headshot taken outdoors with soft, natural light. The background is a pleasant, out-of-focus mix of green foliage, creating a warm and friendly feel.',
    thumbnailUrl: 'https://picsum.photos/seed/outdoor/200/200',
  },
  {
    id: 'black-white',
    name: 'Classic Black & White',
    prompt: 'A timeless, classic black and white professional headshot. The lighting is high-contrast and dramatic, emphasizing facial features against a plain dark background.',
    thumbnailUrl: 'https://picsum.photos/seed/bw/200/200',
  },
];
