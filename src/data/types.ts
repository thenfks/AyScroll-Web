export interface Resource {
  type: 'pdf' | 'link' | 'citation';
  title: string;
  url: string;
  description?: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface Reel {
  id: string;
  title: string;
  creator: string;
  creator_handle: string;
  creator_avatar?: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  likes: string;
  description: string;
  insights?: string[];
  flashcards?: Flashcard[];
  full_chapter_summary?: string;
  resources?: Resource[];
}
