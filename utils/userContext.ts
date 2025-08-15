// User context and tracking utilities

export interface UserContext {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'individual' | 'student' | 'professional';
  isLoggedIn: boolean;
  sessionStart: string;
  lastActivity: string;
  currentPage: string;
  visitHistory: PageVisit[];
}

export interface PageVisit {
  page: string;
  timestamp: string;
  duration?: number;
  userAgent?: string;
}

export interface UserMemory {
  userId: string;
  conversations: Conversation[];
  searches: SearchHistory[];
  preferences: UserPreferences;
  lastUpdated: string;
}

export interface Conversation {
  id: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  context: string;
  sessionId: string;
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  results: any[];
  page: string;
}

export interface UserPreferences {
  preferredName?: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  aiPersonality: 'professional' | 'friendly' | 'casual';
}

export class UserTracker {
  private static instance: UserTracker;
  private currentUser: UserContext | null = null;
  private pageStartTime: number = Date.now();

  static getInstance(): UserTracker {
    if (!UserTracker.instance) {
      UserTracker.instance = new UserTracker();
    }
    return UserTracker.instance;
  }

  initializeUser(): UserContext | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;

      const user = JSON.parse(userData);
      this.currentUser = {
        id: user.id,
        userCode: user.userCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        isLoggedIn: true,
        sessionStart: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        currentPage: window.location.pathname,
        visitHistory: this.loadVisitHistory(user.userCode)
      };

      return this.currentUser;
    } catch (error) {
      console.error('Error initializing user:', error);
      return null;
    }
  }

  trackPageVisit(page: string): void {
    if (!this.currentUser) return;

    const now = Date.now();
    const duration = now - this.pageStartTime;

    // Save previous page duration
    if (this.currentUser.visitHistory.length > 0) {
      const lastVisit = this.currentUser.visitHistory[this.currentUser.visitHistory.length - 1];
      if (!lastVisit.duration) {
        lastVisit.duration = duration;
      }
    }

    // Add new page visit
    const visit: PageVisit = {
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    this.currentUser.visitHistory.push(visit);
    this.currentUser.currentPage = page;
    this.currentUser.lastActivity = new Date().toISOString();
    this.pageStartTime = now;

    // Save to localStorage
    this.saveUserContext();
  }

  updateActivity(): void {
    if (!this.currentUser) return;
    
    this.currentUser.lastActivity = new Date().toISOString();
    this.saveUserContext();
  }

  private loadVisitHistory(userCode: string): PageVisit[] {
    try {
      const history = localStorage.getItem(`visitHistory_${userCode}`);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  private saveUserContext(): void {
    if (!this.currentUser) return;

    try {
      // Save visit history separately
      localStorage.setItem(
        `visitHistory_${this.currentUser.userCode}`, 
        JSON.stringify(this.currentUser.visitHistory)
      );

      // Save current context
      localStorage.setItem('currentUserContext', JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Error saving user context:', error);
    }
  }

  getCurrentUser(): UserContext | null {
    return this.currentUser;
  }

  getUserName(): string {
    if (!this.currentUser) return 'User';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  getUserFirstName(): string {
    if (!this.currentUser) return 'User';
    return this.currentUser.firstName;
  }

  isUserLoggedIn(): boolean {
    return this.currentUser?.isLoggedIn || false;
  }
}

export class AIMemoryManager {
  private static instance: AIMemoryManager;

  static getInstance(): AIMemoryManager {
    if (!AIMemoryManager.instance) {
      AIMemoryManager.instance = new AIMemoryManager();
    }
    return AIMemoryManager.instance;
  }

  saveConversation(userCode: string, userMessage: string, aiResponse: string, context: string = ''): void {
    try {
      const memory = this.getUserMemory(userCode);
      const conversation: Conversation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userMessage,
        aiResponse,
        context,
        sessionId: this.getCurrentSessionId()
      };

      memory.conversations.push(conversation);
      memory.lastUpdated = new Date().toISOString();

      // Keep only last 100 conversations
      if (memory.conversations.length > 100) {
        memory.conversations = memory.conversations.slice(-100);
      }

      localStorage.setItem(`aiMemory_${userCode}`, JSON.stringify(memory));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  saveSearch(userCode: string, query: string, results: any[], page: string): void {
    try {
      const memory = this.getUserMemory(userCode);
      const search: SearchHistory = {
        query,
        timestamp: new Date().toISOString(),
        results: results.slice(0, 5), // Keep only top 5 results
        page
      };

      memory.searches.push(search);
      memory.lastUpdated = new Date().toISOString();

      // Keep only last 50 searches
      if (memory.searches.length > 50) {
        memory.searches = memory.searches.slice(-50);
      }

      localStorage.setItem(`aiMemory_${userCode}`, JSON.stringify(memory));
    } catch (error) {
      console.error('Error saving search:', error);
    }
  }

  getUserMemory(userCode: string): UserMemory {
    try {
      const memory = localStorage.getItem(`aiMemory_${userCode}`);
      if (memory) {
        return JSON.parse(memory);
      }
    } catch (error) {
      console.error('Error loading user memory:', error);
    }

    // Return default memory
    return {
      userId: userCode,
      conversations: [],
      searches: [],
      preferences: {
        language: 'en',
        theme: 'auto',
        aiPersonality: 'friendly'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  getRecentConversations(userCode: string, limit: number = 10): Conversation[] {
    const memory = this.getUserMemory(userCode);
    return memory.conversations.slice(-limit);
  }

  getRecentSearches(userCode: string, limit: number = 10): SearchHistory[] {
    const memory = this.getUserMemory(userCode);
    return memory.searches.slice(-limit);
  }

  updatePreferences(userCode: string, preferences: Partial<UserPreferences>): void {
    try {
      const memory = this.getUserMemory(userCode);
      memory.preferences = { ...memory.preferences, ...preferences };
      memory.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(`aiMemory_${userCode}`, JSON.stringify(memory));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  private getCurrentSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Date.now().toString();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  clearUserMemory(userCode: string): void {
    localStorage.removeItem(`aiMemory_${userCode}`);
  }
}

// Global instances
export const userTracker = UserTracker.getInstance();
export const aiMemory = AIMemoryManager.getInstance();
