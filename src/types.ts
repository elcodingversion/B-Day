/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChapterMemory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date?: string;
  image: string; // Base64 or elegant fallback SVG design/URL
  caption: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
    sweetComment: string;
  }[];
  correctAnswer: string; // Key of correct answer
  hint: string;
}

export interface BirthdayState {
  unlocked: boolean;
  activeTab: 'story' | 'quiz' | 'gift';
  themeColor: 'romantic-pink' | 'lavender-dream' | 'peach-blossom';
  musicPlaying: boolean;
}
