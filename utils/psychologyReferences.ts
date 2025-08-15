// Psychology references database for smart recommendations
export interface Reference {
  id: string;
  title: string;
  type: 'book' | 'podcast' | 'article' | 'test' | 'therapist';
  url?: string;
  description: string;
  author?: string;
  keywords: string[];
}

export const psychologyReferences: Reference[] = [
  // Books
  {
    id: 'book_stress_1',
    title: 'The Upside of Stress',
    type: 'book',
    url: '/books',
    description: 'A comprehensive guide to understanding and managing stress',
    author: 'Kelly McGonigal',
    keywords: ['stress', 'anxiety', 'cortisol', 'stress management', 'health', 'chronic stress']
  },
  {
    id: 'book_anxiety_1',
    title: 'Emotional Agility',
    type: 'book',
    url: '/books',
    description: 'Practical techniques for overcoming anxiety and emotional challenges',
    author: 'Susan David',
    keywords: ['anxiety', 'phobia', 'panic', 'worry', 'fear', 'coping strategies', 'emotions']
  },
  {
    id: 'book_depression_1',
    title: 'Man\'s Search for Meaning',
    type: 'book',
    url: '/books',
    description: 'Finding purpose and meaning in difficult times',
    author: 'Viktor E. Frankl',
    keywords: ['depression', 'mood', 'meaning', 'purpose', 'resilience', 'hope']
  },
  {
    id: 'book_personality_1',
    title: 'Quiet: The Power of Introverts',
    type: 'book',
    url: '/books',
    description: 'Understanding personality types and individual differences',
    author: 'Susan Cain',
    keywords: ['personality', 'introversion', 'traits', 'individual differences', 'temperament']
  },
  {
    id: 'book_relationships_1',
    title: 'Social Intelligence',
    type: 'book',
    url: '/books',
    description: 'How relationships and social connections affect us',
    author: 'Daniel Goleman',
    keywords: ['relationships', 'social', 'emotional intelligence', 'communication', 'empathy']
  },

  // Podcasts
  {
    id: 'podcast_stress_1',
    title: 'Hidden Brain: The Science of Stress',
    type: 'podcast',
    url: '/podcasts',
    description: 'How stress affects our brain and behavior',
    author: 'NPR Hidden Brain',
    keywords: ['stress', 'brain', 'neuroscience', 'behavior', 'psychology']
  },
  {
    id: 'podcast_anxiety_1',
    title: 'The Anxiety Coaches Podcast',
    type: 'podcast',
    url: '/podcasts',
    description: 'Practical tools for managing anxiety',
    author: 'Gina Ryan',
    keywords: ['anxiety', 'coaching', 'management', 'tools', 'techniques']
  },
  {
    id: 'podcast_therapy_1',
    title: 'Psychology in Seattle',
    type: 'podcast',
    url: '/podcasts',
    description: 'Clinical psychology insights and therapy discussions',
    author: 'Dr. Kirk Honda',
    keywords: ['therapy', 'clinical psychology', 'mental health', 'counseling']
  },

  // Articles
  {
    id: 'article_stress_1',
    title: 'Understanding Chronic Stress and Its Effects',
    type: 'article',
    url: '/psy-articles',
    description: 'Research-based insights into chronic stress management',
    keywords: ['stress', 'chronic', 'health', 'management', 'research']
  },
  {
    id: 'article_personality_1',
    title: 'The Psychology of Personality Development',
    type: 'article',
    url: '/psy-articles',
    description: 'How personality forms and changes over time',
    keywords: ['personality', 'development', 'psychology', 'traits', 'growth']
  },

  // Tests
  {
    id: 'test_stress_1',
    title: 'Stress Assessment Test',
    type: 'test',
    url: '/tests',
    description: 'Evaluate your stress levels and coping mechanisms',
    keywords: ['stress', 'assessment', 'evaluation', 'coping', 'test']
  },
  {
    id: 'test_anxiety_1',
    title: 'Anxiety Level Assessment',
    type: 'test',
    url: '/tests',
    description: 'Measure your anxiety levels and triggers',
    keywords: ['anxiety', 'assessment', 'level', 'triggers', 'test']
  },
  {
    id: 'test_personality_1',
    title: 'Big Five Personality Test',
    type: 'test',
    url: '/tests/general-personality-test',
    description: 'Comprehensive personality assessment based on the Big Five model',
    keywords: ['personality', 'big five', 'test', 'assessment', 'traits']
  },
  {
    id: 'test_depression_1',
    title: 'Depression Screening Test',
    type: 'test',
    url: '/tests',
    description: 'Screen for depression symptoms and severity',
    keywords: ['depression', 'screening', 'symptoms', 'test', 'mood']
  },

  // Therapist Resources
  {
    id: 'therapist_1',
    title: 'Connect with Licensed Therapists',
    type: 'therapist',
    url: '/therapists',
    description: 'Find qualified therapists and mental health professionals',
    keywords: ['therapist', 'therapy', 'counselor', 'psychologist', 'mental health', 'professional help']
  }
];

export function findRelevantReferences(userQuery: string, maxResults: number = 6): {
  books: Reference[];
  podcasts: Reference[];
  articles: Reference[];
  tests: Reference[];
  therapists: Reference[];
} {
  const query = userQuery.toLowerCase();
  const results = {
    books: [] as Reference[],
    podcasts: [] as Reference[],
    articles: [] as Reference[],
    tests: [] as Reference[],
    therapists: [] as Reference[]
  };

  // Score each reference based on keyword matches
  const scoredRefs = psychologyReferences.map(ref => {
    let score = 0;
    ref.keywords.forEach(keyword => {
      if (query.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    return { ...ref, score };
  });

  // Sort by score and filter by type
  const sortedRefs = scoredRefs.filter(ref => ref.score > 0).sort((a, b) => b.score - a.score);

  sortedRefs.forEach(ref => {
    const maxPerType = Math.ceil(maxResults / 5);
    if (ref.type === 'book' && results.books.length < maxPerType) {
      results.books.push(ref);
    } else if (ref.type === 'podcast' && results.podcasts.length < maxPerType) {
      results.podcasts.push(ref);
    } else if (ref.type === 'article' && results.articles.length < maxPerType) {
      results.articles.push(ref);
    } else if (ref.type === 'test' && results.tests.length < maxPerType) {
      results.tests.push(ref);
    } else if (ref.type === 'therapist' && results.therapists.length < maxPerType) {
      results.therapists.push(ref);
    }
  });

  return results;
}

export function generateRecommendationText(
  references: ReturnType<typeof findRelevantReferences>,
  language: string = 'en'
): string {
  const { books, podcasts, articles, tests, therapists } = references;
  
  if (books.length === 0 && podcasts.length === 0 && articles.length === 0 && tests.length === 0 && therapists.length === 0) {
    return '';
  }

  let text = '';
  
  if (language === 'fa') {
    text += '\n\n📚 **منابع پیشنهادی:**\n\n';
    
    if (books.length > 0) {
      text += '**کتاب‌ها:**\n';
      books.forEach(book => {
        text += `• [${book.title}](${book.url}) - ${book.description}\n`;
      });
      text += '\n';
    }
    
    if (podcasts.length > 0) {
      text += '**پادکست‌ها:**\n';
      podcasts.forEach(podcast => {
        text += `• [${podcast.title}](${podcast.url}) - ${podcast.description}\n`;
      });
      text += '\n';
    }
    
    if (articles.length > 0) {
      text += '**مقاله‌ها:**\n';
      articles.forEach(article => {
        text += `• [${article.title}](${article.url}) - ${article.description}\n`;
      });
      text += '\n';
    }
    
    if (tests.length > 0) {
      text += '**تست‌های مرتبط:**\n';
      tests.forEach(test => {
        text += `• [${test.title}](${test.url}) - ${test.description}\n`;
      });
      text += '\n';
    }

    if (therapists.length > 0) {
      text += '**تراپیست‌ها:**\n';
      therapists.forEach(therapist => {
        text += `• [${therapist.title}](${therapist.url}) - ${therapist.description}\n`;
      });
      text += '\n';
    }
    
    text += '🤔 **دوست داری این منابع را مطالعه کنی یا گوش بدهی؟**\n\n';
    text += '• اگر نه، می‌توانم [یک تراپیست معرفی کنم](/therapists)\n';
    text += '• یا [یک تست استاندارد در این زمینه بده](/tests) تا بهتر از خودت اطلاعات داشته باشی';
    
  } else {
    text += '\n\n📚 **Recommended Resources:**\n\n';
    
    if (books.length > 0) {
      text += '**Books:**\n';
      books.forEach(book => {
        text += `• [${book.title}](${book.url}) - ${book.description}\n`;
      });
      text += '\n';
    }
    
    if (podcasts.length > 0) {
      text += '**Podcasts:**\n';
      podcasts.forEach(podcast => {
        text += `• [${podcast.title}](${podcast.url}) - ${podcast.description}\n`;
      });
      text += '\n';
    }
    
    if (articles.length > 0) {
      text += '**Articles:**\n';
      articles.forEach(article => {
        text += `• [${article.title}](${article.url}) - ${article.description}\n`;
      });
      text += '\n';
    }
    
    if (tests.length > 0) {
      text += '**Related Tests:**\n';
      tests.forEach(test => {
        text += `• [${test.title}](${test.url}) - ${test.description}\n`;
      });
      text += '\n';
    }

    if (therapists.length > 0) {
      text += '**Therapists:**\n';
      therapists.forEach(therapist => {
        text += `• [${therapist.title}](${therapist.url}) - ${therapist.description}\n`;
      });
      text += '\n';
    }
    
    text += '🤔 **Would you like to explore these resources?**\n\n';
    text += '• If not, I can [recommend a therapist](/therapists)\n';
    text += '• Or [take a standardized test](/tests) to better understand yourself in this area';
  }
  
  return text;
}
