import { Template, Category } from '@/types/types';

const NEWS_FEED_SYSTEM_DESIGN_MD = `
# Design a News Feed System

Designing a news feed (like Facebook News Feed, Instagram Feed, or Twitter Timeline) is a classic system design challenge. It tests your ability to handle scale, data modeling, and latency.

## 1. Requirements

### Functional Requirements
*   **Post Creation**: Users can create posts (text, images, video).
*   **Feed Generation**: Users can view a feed of posts from friends/pages they follow.
*   **Interaction**: Users can like and comment on posts.
*   **Ordering**: The feed can be chronological or ranked by relevance.

### Non-Functional Requirements
*   **Latency**: Generating a feed must be fast (under 200ms).
*   **Availability**: The system needs high availability; users should always see *some* feed, even if slightly stale.
*   **Consistency**: Eventual consistency is acceptable. A post doesn't need to appear in every follower's feed instantly.

## 2. Capacity Estimation (Back-of-the-envelope)

Assume:
*   **DAU**: 300 Million
*   **Read/Write Ratio**: 100:1 (Heavy read system)
*   **Avg Post Size**: 1KB (metadata) + media storage separately.

**Traffic:**
*   Writes: 300M * 5 posts/day = 1.5 Billion posts/day. ~17k QPS.
*   Reads: 300M * 10 views/day = 3 Billion views/day. ~35k QPS.

**Storage:**
*   1.5B posts * 1KB = 1.5 TB/day.
*   5 Years = ~2.7 PB.

## 3. High Level API Design

We need two main endpoints:

\`\`\`http
POST /v1/posts
Authorization: Bearer <token>
Body: { content: "Hello World", media_ids: [...] }
\`\`\`

\`\`\`http
GET /v1/feed
Authorization: Bearer <token>
Query: { cursor: "next_page_token", limit: 20 }
\`\`\`

## 4. Database Schema

We need a relational database for metadata (MySQL/PostgreSQL) and a NoSQL store (Cassandra/DynamoDB) for the feed or activity items if scaling is extreme.

**Users Table**:
*   \`user_id\` (PK)
*   \`username\`
*   \`avatar_url\`

**Posts Table**:
*   \`post_id\` (PK)
*   \`user_id\` (FK)
*   \`content\`
*   \`created_at\`
*   \`media_urls\`

**Follows Table**:
*   \`follower_id\` (FK)
*   \`followee_id\` (FK)
*   (Composite PK on both)

## 5. System Architecture

### Feed Generation Strategies

There are two main approaches to generating the feed:

#### A. Pull Model (Fan-out on Load)
When a user loads their homepage, the system:
1.  Fetches IDs of all users they follow.
2.  Fetches the latest posts for each of those users.
3.  Merges and sorts them in memory.

*   **Pros**: Simple storage. Real-time updates.
*   **Cons**: Very slow for users following thousands of people. High compute load during reads.

#### B. Push Model (Fan-out on Write)
When a user creates a post:
1.  The system finds all their followers.
2.  It inserts the post ID into a pre-computed "Feed Cache" for each follower.
3.  When a follower reads their feed, we simply read from their cache.

*   **Pros**: extremely fast reads (O(1)).
*   **Cons**: "Justin Bieber" problem. If a celebrity has 100M followers, writing one post triggers 100M updates.

#### C. Hybrid Approach (Recommended)
*   **Normal Users**: Use Push model. Pre-compute feeds.
*   **Celebrities**: Use Pull model. Do not push their posts to all 100M queues. Instead, fetch their posts at read-time and merge them.

## 6. Detailed Design Components

### Feed Service
This service handles the \`GET /feed\` request.
1.  Check Redis Cache for the pre-computed feed.
2.  If empty, fallback to DB and rebuild cache.
3.  Hydrate post IDs with content (user info, images) concurrently.

### Fan-out Service
An async worker queue (Kafka/RabbitMQ) that processes new posts.
1.  User A posts.
2.  Service gets followers of A.
3.  Service appends \`post_id\` to the Redis list of each follower.

## 7. Scalability Improvements

*   **Sharding**: Shard the Feed Cache (Redis) by \`user_id\`.
*   **CDN**: Serve all static media (images/videos) from CDN.
*   **Caching**: Cache popular posts and user profiles in Memcached/Redis to reduce DB hits.

## 8. Summary
The Hybrid approach balances read latency and write amplification. By using a pre-computed feed for most users and merging celebrity content at read time, we ensure the system is responsive and scalable.
`;

const INFINITE_SCROLL_MD = `
# Infinite Scroll Component

Implementing an infinite scroll component is a standard frontend task that tests your knowledge of the DOM, performance optimization, and asynchronous data fetching.

## Requirements
*   **Lazy Loading**: Fetch data only when the user nears the bottom of the list.
*   **Performance**: Do not attach scroll event listeners directly to the window without throttling. Ideally, use \`IntersectionObserver\`.
*   **UX**: Show a loading spinner while fetching. Handle "end of list" state.

## Implementation Strategy

### 1. The Intersection Observer API
Instead of listening to the \`scroll\` event (which fires continuously), use \`IntersectionObserver\`. This API asynchronously observes changes in the intersection of a target element with an ancestor element or the viewport.

### 2. Basic Structure
\`\`\`jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1);
      }
    });
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // ... fetching logic for 'page'
}
\`\`\`

## Edge Cases
*   **Race Conditions**: Ensure that if a request is already in flight, you don't trigger another one.
*   **Virtualization**: If the list gets very long (1000+ items), the DOM size will slow down the browser. You might need "Windowing" (rendering only visible items).
`;

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Infinite Scroll Component',
    slug: 'infinite-scroll-component',
    shortDescription: 'Build a performant list that loads data as the user scrolls down.',
    fullDescription: INFINITE_SCROLL_MD,
    imageUrl: 'https://picsum.photos/seed/infinite/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Medium', 'Performance', 'DOM'],
    category: Category.REACT,
    techStack: ['React', 'IntersectionObserver', 'Fetch API'],
    author: 'FrontendMasters',
    createdAt: '2023-10-15',
  },
  {
    id: '2',
    name: 'Debounce & Throttle',
    slug: 'debounce-throttle',
    shortDescription: 'Implement custom debounce and throttle utility functions from scratch.',
    fullDescription: 'A classic JavaScript challenge. Write your own implementation of debounce and throttle functions. \n\nDebounce: Ensures that a function is not called until a certain amount of time has passed since it was last called.\nThrottle: Ensures that a function is called at most once in a specified time period.',
    imageUrl: 'https://picsum.photos/seed/debounce/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Easy', 'Utilities', 'Logic'],
    category: Category.JAVASCRIPT,
    techStack: ['JavaScript', 'Closures', 'Async'],
    author: 'JSHero',
    createdAt: '2023-11-02',
    starterCode: `/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
function debounce(func, wait) {
  // Your code here
}

/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
function throttle(func, wait) {
  // Your code here
}

// Test your code here
const log = () => console.log('Fired!');
const debouncedLog = debounce(log, 1000);

debouncedLog();
debouncedLog();
debouncedLog(); // Should only fire once after 1s
`
  },
  {
    id: '3',
    name: 'E-commerce Product Page',
    slug: 'ecommerce-product-page',
    shortDescription: 'A complete product detail page with image gallery and cart logic.',
    fullDescription: 'This is a comprehensive project. Build a responsive product page that includes an image gallery with thumbnails, size selector, quantity adjustment, and an "Add to Cart" button that updates a global cart state.',
    imageUrl: 'https://picsum.photos/seed/shop/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Take-Home', 'State Management', 'Layout'],
    category: Category.TAKE_HOME,
    techStack: ['React', 'Redux/Context', 'CSS Modules'],
    author: 'InterviewReady',
    createdAt: '2023-09-20',
  },
  {
    id: '4',
    name: 'Nested Comments System',
    slug: 'nested-comments-system',
    shortDescription: 'Recursive component to display threaded comments like Reddit.',
    fullDescription: 'Design a component that renders a tree of comments. Each comment can have replies, and those replies can have replies (n-levels deep). You must handle the recursive rendering efficiently and provide a way to add new replies.',
    imageUrl: 'https://picsum.photos/seed/comments/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Medium', 'Recursion', 'Data Structures'],
    category: Category.REACT,
    techStack: ['React', 'Recursion', 'JSON'],
    author: 'TechLead',
    createdAt: '2023-12-05',
  },
  {
    id: '5',
    name: 'News Feed System Design',
    slug: 'news-feed-system-design',
    shortDescription: 'Design the frontend architecture for a social media feed like Facebook.',
    fullDescription: NEWS_FEED_SYSTEM_DESIGN_MD,
    imageUrl: 'https://picsum.photos/seed/feed/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Hard', 'Architecture', 'Scaling'],
    category: Category.SYSTEM_DESIGN,
    techStack: ['System Design', 'Caching', 'Network'],
    author: 'ArchMaster',
    createdAt: '2023-08-10',
  },
  {
    id: '6',
    name: 'Typeahead Autocomplete',
    slug: 'typeahead-autocomplete',
    shortDescription: 'Search input that suggests results while typing with keyboard navigation.',
    fullDescription: 'Build a reusable Autocomplete component. It should fetch results asynchronously, cache previous queries, bold the matching text in results, and support full keyboard navigation (ArrowUp, ArrowDown, Enter).',
    imageUrl: 'https://picsum.photos/seed/typeahead/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Medium', 'Accessibility', 'Async'],
    category: Category.REACT,
    techStack: ['React', 'Hooks', 'Accessibility'],
    author: 'ComponentLib',
    createdAt: '2023-10-28',
  },
  {
    id: '7',
    name: 'Holy Grail Layout',
    slug: 'holy-grail-layout',
    shortDescription: 'Implement the classic 3-column layout using modern CSS Grid.',
    fullDescription: 'Create the "Holy Grail" layout (Header, Footer, Left Sidebar, Right Sidebar, Center Content) using CSS Grid. Ensure it is fully responsive, collapsing into a single column on mobile devices.',
    imageUrl: 'https://picsum.photos/seed/grid/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Easy', 'CSS Grid', 'Flexbox'],
    category: Category.CSS,
    techStack: ['CSS3', 'Grid', 'Media Queries'],
    author: 'CSSNinja',
    createdAt: '2023-11-15',
  },
  {
    id: '8',
    name: 'Tree Traversal Visualizer',
    slug: 'tree-traversal-visualizer',
    shortDescription: 'Visualize DFS and BFS algorithms on a binary tree DOM structure.',
    fullDescription: 'An algorithmic challenge with a UI twist. Render a binary tree on the screen and create buttons to trigger "Depth First Search" and "Breadth First Search". Highlight the nodes one by one as they are visited.',
    imageUrl: 'https://picsum.photos/seed/tree/800/600',
    demoUrl: '#',
    githubUrl: '#',
    tags: ['Hard', 'Algorithms', 'Animation'],
    category: Category.ALGORITHMS,
    techStack: ['JavaScript', 'DOM Manipulation', 'Algorithms'],
    author: 'AlgoExpert',
    createdAt: '2023-09-01',
    starterCode: `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Initial Tree
const root = new Node(1);
root.left = new Node(2);
root.right = new Node(3);
root.left.left = new Node(4);
root.left.right = new Node(5);

/**
 * Perform Depth First Search (Pre-order)
 * @param {Node} node
 */
function dfs(node) {
  if (!node) return;
  
  console.log(node.value);
  
  dfs(node.left);
  dfs(node.right);
}

console.log("Starting DFS:");
dfs(root);`
  }
];