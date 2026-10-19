// DYNAMIC COMMUNITY FORUM & DISCUSSION SERVICE
// Fully interactive, persisted storage, zero hardcoded read-only mocks

const INITIAL_DISCUSSIONS = [
  {
    id: 101,
    title: 'How should I split £500/month between Global All-Cap (VWRP) and S&P 500 (VUAG)?',
    category: 'Portfolio Building',
    author: 'Callum Davies',
    authorRef: 'REF: EB-4192-GB',
    authorLevel: 'Portfolio Builder',
    createdAt: Date.now() - 3600000 * 4, // 4 hours ago
    content: 'I have just set up my 2024/25 Stocks & Shares ISA on Vanguard. My monthly investment capacity is £500. I am debating whether to put 100% into VWRP (FTSE All-World) or do an 80/20 split with VUAG (S&P 500). Does the extra US tech tilt make sense given that VWRP already holds ~60% US?',
    likes: 18,
    likedByMe: false,
    pinned: true,
    comments: [
      {
        id: 1,
        author: 'Eleanor Vance',
        authorLevel: 'Market Strategist',
        createdAt: Date.now() - 3600000 * 3,
        text: 'VWRP is already 60% US mega-cap! Adding VUAG on top increases your ETF overlap and doubles your concentration in Apple, Microsoft, and Nvidia. A 100% VWRP allocation keeps it simple and avoids uncompensated single-country risk.'
      },
      {
        id: 2,
        author: 'Marcus Wright',
        authorLevel: 'Capital Explorer',
        createdAt: Date.now() - 3600000 * 1,
        text: 'Agree with Eleanor. Level 4 Lesson 5 in the Academy explains the "ETF Overlap Trap" perfectly. Keep the core in All-World!'
      }
    ]
  },
  {
    id: 102,
    title: 'Executing a "Bed and ISA" before April 5th — Step by Step experience',
    category: 'UK Tax & ISA',
    author: 'Priya Sharma',
    authorRef: 'REF: EB-7832-GB',
    authorLevel: 'Market Strategist',
    createdAt: Date.now() - 3600000 * 14,
    content: 'Just successfully transferred £14,000 of shares from my taxable General Investment Account into my Stocks & Shares ISA using Bed and ISA. Kept my realized capital gains well below the £3,000 2024/25 CGT exemption threshold. Anyone with surplus taxable funds should make sure they utilize their £20,000 allowance before midnight on April 5th!',
    likes: 27,
    likedByMe: false,
    pinned: false,
    comments: [
      {
        id: 1,
        author: 'David Campbell',
        authorLevel: 'Investor Starter',
        createdAt: Date.now() - 3600000 * 8,
        text: 'Great reminder on the £3,000 CGT allowance drop from £6,000 last year. Moving gains into an ISA is vital.'
      }
    ]
  },
  {
    id: 103,
    title: 'Emergency Fund size debate: 3 months vs 6 months in 2024/25?',
    category: 'Beginner Help',
    author: 'Oliver Bennett',
    authorRef: 'REF: EB-9014-GB',
    authorLevel: 'Capital Explorer',
    createdAt: Date.now() - 3600000 * 26,
    content: 'I work as a self-employed contractor in London with essential monthly costs of £2,200. I currently have £7,000 in an instant access Cash ISA (just over 3 months). Should I hold off on equity investing until I hit 6 months (£13,200)? Curious how other UK investors balance cash drag vs psychological peace of mind.',
    likes: 12,
    likedByMe: false,
    pinned: false,
    comments: [
      {
        id: 1,
        author: 'Sarah Jenkins',
        authorLevel: 'Master Wealth Builder',
        createdAt: Date.now() - 3600000 * 20,
        text: 'Because your income is variable (contractor/self-employed), 6 months is strongly recommended. For secure salaried employees, 3 months is often sufficient. Never invest money that you might need to withdraw in a market pullback!'
      }
    ]
  }
];

export class CommunityService {
  static getDiscussions() {
    try {
      const stored = localStorage.getItem('eb_community_discussions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading community discussions:', e);
    }
    // Seed initial active discussions
    localStorage.setItem('eb_community_discussions', JSON.stringify(INITIAL_DISCUSSIONS));
    return INITIAL_DISCUSSIONS;
  }

  static saveDiscussions(discussions) {
    try {
      localStorage.setItem('eb_community_discussions', JSON.stringify(discussions));
    } catch (e) {
      console.error('Failed to save community discussions:', e);
    }
  }

  static createPost(title, category, content, authorName, authorLevel = 'Capital Explorer') {
    if (!title || !content) {
      throw new Error('Title and discussion content are required.');
    }
    const discussions = this.getDiscussions();
    const newPost = {
      id: Date.now(),
      title: title.trim(),
      category: category || 'General Discussion',
      author: authorName || 'Anonymous Investor',
      authorRef: 'REF: EB-' + Math.floor(1000 + Math.random() * 9000) + '-GB',
      authorLevel: authorLevel,
      createdAt: Date.now(),
      content: content.trim(),
      likes: 1,
      likedByMe: true,
      pinned: false,
      comments: []
    };
    discussions.unshift(newPost);
    this.saveDiscussions(discussions);
    return newPost;
  }

  static toggleLike(postId) {
    const discussions = this.getDiscussions();
    const post = discussions.find(p => p.id === postId);
    if (post) {
      if (post.likedByMe) {
        post.likes = Math.max(0, (post.likes || 1) - 1);
        post.likedByMe = false;
      } else {
        post.likes = (post.likes || 0) + 1;
        post.likedByMe = true;
      }
      this.saveDiscussions(discussions);
    }
    return post;
  }

  static addComment(postId, commentText, authorName, authorLevel = 'Capital Explorer') {
    if (!commentText || !commentText.trim()) {
      throw new Error('Comment text cannot be empty.');
    }
    const discussions = this.getDiscussions();
    const post = discussions.find(p => p.id === postId);
    if (!post) throw new Error('Post not found.');

    const newComment = {
      id: Date.now(),
      author: authorName || 'Investor',
      authorLevel: authorLevel,
      createdAt: Date.now(),
      text: commentText.trim()
    };
    post.comments = post.comments || [];
    post.comments.push(newComment);
    this.saveDiscussions(discussions);
    return newComment;
  }

  static deletePost(postId) {
    const discussions = this.getDiscussions();
    const filtered = discussions.filter(p => p.id !== postId);
    this.saveDiscussions(filtered);
    return filtered;
  }

  static togglePin(postId) {
    const discussions = this.getDiscussions();
    const post = discussions.find(p => p.id === postId);
    if (post) {
      post.pinned = !post.pinned;
      this.saveDiscussions(discussions);
    }
    return post;
  }
}
