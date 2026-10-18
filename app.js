// Instagram Clone - Full-Stack Client with Supabase Auth, Database & Storage

// 1. Supabase Initialization
const SUPABASE_URL = "https://skpnwtngipfdyubgdrsa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcG53dG5naXBmZHl1YmdkcnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzkzODUsImV4cCI6MjEwNzU1NTM4NX0.YUESPTS7c8Pjx1XKGyvi3EaSyZOb1fNXgHKxZdZTGVI";

let supabase = null;
if (window.supabase) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn("Supabase init error:", err);
  }
}

// Current Logged-In User State
let currentUser = null;
let currentProfile = null;
let authMode = "signup"; // "signup" or "login"

// Default Rich Mock Data (Used for instant high-quality display and fallback)
const defaultStories = [
  {
    id: "s1",
    username: "your_story",
    displayName: "Your story",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    time: "Just now",
    viewed: false
  },
  {
    id: "s2",
    username: "natgeo",
    displayName: "National Geographic",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    time: "2h",
    viewed: false
  },
  {
    id: "s3",
    username: "techinsider",
    displayName: "Tech Insider",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    time: "4h",
    viewed: false
  },
  {
    id: "s4",
    username: "designmilk",
    displayName: "Design Milk",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    time: "6h",
    viewed: false
  },
  {
    id: "s5",
    username: "archdigest",
    displayName: "Architectural Digest",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    time: "8h",
    viewed: false
  },
  {
    id: "s6",
    username: "nasa",
    displayName: "NASA",
    avatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
    storyImg: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    time: "15h",
    viewed: false
  }
];

let storiesData = [...defaultStories];

const defaultPosts = [
  {
    id: "p1",
    author: "natgeo",
    authorAvatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80",
    verified: true,
    location: "Swiss Alps, Switzerland",
    postImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    likes: 124580,
    isLiked: false,
    isSaved: false,
    time: "3 HOURS AGO",
    caption: "Sunlight pierces through the morning alpine mist over the peaks of the Matterhorn. In regions like these, weather shifts in minutes, creating cinematic moments of raw grandeur.\n\nCaptured with a 70-200mm f/2.8 on high-altitude expedition.",
    comments: [
      { author: "earthpix", text: "The scale here is absolutely breathtaking! 🏔️", liked: false },
      { author: "wanderlust_alex", text: "Adding this to my bucket list immediately.", liked: true }
    ]
  },
  {
    id: "p2",
    author: "cyber_aesthetic",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verified: false,
    location: "Tokyo, Japan",
    postImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    likes: 42390,
    isLiked: true,
    isSaved: true,
    time: "6 HOURS AGO",
    caption: "Neon reflections across the rainy Shibuya crossing. The intersection between future tech and urban culture never sleeps.\n\n#tokyo #cyberpunk #streetphotography #japan",
    comments: [
      { author: "neon_vibes", text: "Blade runner energy right here 🔥", liked: false }
    ]
  },
  {
    id: "p3",
    author: "architecture_hunter",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    verified: true,
    location: "Valencia, Spain",
    postImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    likes: 85210,
    isLiked: false,
    isSaved: false,
    time: "12 HOURS AGO",
    caption: "Geometric serenity. Designed with fluid organic curves that redefine modern public spaces.\n\nArchitect: Santiago Calatrava.",
    comments: [
      { author: "design_daily", text: "Masterpiece of structural engineering.", liked: false }
    ]
  }
];

let postsData = [...defaultPosts];

const suggestionsData = [
  {
    username: "nasa",
    displayName: "NASA",
    avatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
    context: "Followed by natgeo + 12 more",
    isFollowing: false
  },
  {
    username: "cristiano",
    displayName: "Cristiano Ronaldo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    context: "Suggested for you",
    isFollowing: false
  },
  {
    username: "openai",
    displayName: "OpenAI",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    context: "New to Instagram",
    isFollowing: false
  },
  {
    username: "apple",
    displayName: "Apple",
    avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80",
    context: "Popular",
    isFollowing: false
  }
];

const exploreImages = [
  { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", likes: "52.3k", comments: "412" },
  { img: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=600&q=80", likes: "19.1k", comments: "98" },
  { img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80", likes: "89.4k", comments: "1.2k" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", likes: "34.5k", comments: "280" },
  { img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80", likes: "67.8k", comments: "840" },
  { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", likes: "45.2k", comments: "310" },
  { img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80", likes: "98.1k", comments: "1.5k" },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", likes: "112k", comments: "2.3k" },
  { img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80", likes: "73.9k", comments: "620" }
];

const dmThreads = [
  { name: "alex_coder", msg: "Hey, did you check the new REA update?", time: "1h", unread: true },
  { name: "sarah_designer", msg: "Sent you the Figma prototype link!", time: "3h", unread: false },
  { name: "hamza_dev", msg: "Can we hop on a call regarding the API?", time: "1d", unread: false },
  { name: "tech_insider", msg: "Loved your latest article!", time: "2d", unread: false }
];

// 2. Authentication Controller
async function checkAuthSession() {
  if (!supabase) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      await fetchUserProfile(session.user.id);
    } else {
      currentUser = null;
      currentProfile = null;
    }
  } catch (err) {
    console.warn("Session check error:", err);
  }
  updateAuthUI();
  fetchLivePosts();
}

async function fetchUserProfile(userId) {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      currentProfile = data;
    } else {
      // Default fallback profile from metadata
      currentProfile = {
        id: userId,
        username: currentUser?.user_metadata?.username || currentUser?.email?.split("@")[0] || "instagrammer",
        full_name: currentUser?.user_metadata?.full_name || "Instagram User",
        avatar_url: currentUser?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        bio: "Just joined Instagram ✨"
      };
    }
  } catch (err) {
    console.error("Profile fetch error:", err);
  }
}

function updateAuthUI() {
  const userAvatar = currentProfile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  const username = currentProfile?.username || "Guest";
  const fullName = currentProfile?.full_name || (currentUser ? "Instagram User" : "Sign in to post & like");

  // Update Nav Avatar
  document.querySelectorAll(".user-nav-avatar").forEach(img => img.src = userAvatar);
  
  // Update Right Sidebar Profile
  const curNameEl = document.querySelector(".current-user-name");
  const curHandleEl = document.querySelector(".current-user-handle");
  const curAvatarEl = document.querySelector(".current-user-avatar");
  const switchBtn = document.querySelector(".switch-account-btn");

  if (curNameEl) curNameEl.innerText = username;
  if (curHandleEl) curHandleEl.innerText = fullName;
  if (curAvatarEl) curAvatarEl.src = userAvatar;

  if (switchBtn) {
    if (currentUser) {
      switchBtn.innerText = "Log out";
      switchBtn.onclick = handleSignOut;
    } else {
      switchBtn.innerText = "Log in";
      switchBtn.onclick = () => openAuthModal("login");
    }
  }

  // Update Profile View Header
  const profileUsernameEl = document.querySelector(".profile-username");
  const profileBioNameEl = document.querySelector(".profile-bio-name");
  const profileAvatarLarge = document.querySelector(".profile-avatar-large");
  if (profileUsernameEl) profileUsernameEl.innerText = username;
  if (profileBioNameEl) profileBioNameEl.innerText = fullName;
  if (profileAvatarLarge) profileAvatarLarge.src = userAvatar;
}

function openAuthModal(mode = "signup") {
  authMode = mode;
  const modal = document.getElementById("auth-modal");
  const subMsg = document.getElementById("auth-sub-msg");
  const extraFields = document.getElementById("signup-extra-fields");
  const submitBtn = document.getElementById("auth-submit-btn");
  const switchPrompt = document.getElementById("auth-switch-prompt");
  const switchBtn = document.getElementById("auth-switch-btn");
  const errEl = document.getElementById("auth-error");

  if (errEl) errEl.style.display = "none";

  if (mode === "signup") {
    subMsg.innerText = "Sign up to see photos and videos from your friends.";
    extraFields.style.display = "block";
    submitBtn.innerText = "Sign up";
    switchPrompt.innerText = "Have an account?";
    switchBtn.innerText = "Log in";
  } else {
    subMsg.innerText = "Log in with your email and password.";
    extraFields.style.display = "none";
    submitBtn.innerText = "Log in";
    switchPrompt.innerText = "Don't have an account?";
    switchBtn.innerText = "Sign up";
  }

  modal.classList.add("active");
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.remove("active");
}

function toggleAuthMode() {
  openAuthModal(authMode === "signup" ? "login" : "signup");
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  if (!supabase) {
    showNotificationToast("Cloud backend connecting...");
    return;
  }

  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const fullname = document.getElementById("auth-fullname")?.value.trim() || "";
  const username = document.getElementById("auth-username")?.value.trim().toLowerCase() || email.split("@")[0];
  const errEl = document.getElementById("auth-error");
  const submitBtn = document.getElementById("auth-submit-btn");

  submitBtn.innerText = "Processing...";
  submitBtn.disabled = true;

  try {
    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullname
          }
        }
      });
      if (error) throw error;
      
      showNotificationToast("Account created successfully! Welcome to Instagram ✨");
      currentUser = data.user;
      await fetchUserProfile(data.user.id);
      updateAuthUI();
      closeAuthModal();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      showNotificationToast("Logged in successfully! Welcome back 👋");
      currentUser = data.user;
      await fetchUserProfile(data.user.id);
      updateAuthUI();
      closeAuthModal();
    }
  } catch (err) {
    if (errEl) {
      errEl.innerText = err.message || "Authentication error";
      errEl.style.display = "block";
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = authMode === "signup" ? "Sign up" : "Log in";
  }
}

async function handleSignOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  currentUser = null;
  currentProfile = null;
  updateAuthUI();
  showNotificationToast("You have been logged out.");
}

// 3. Live Database Queries (Fetch Posts & Comments)
async function fetchLivePosts() {
  if (!supabase) {
    renderPosts();
    return;
  }

  try {
    const { data: dbPosts, error } = await supabase
      .from("posts")
      .select("*, profiles(*), likes(*), comments(*, profiles(*))")
      .order("created_at", { ascending: false });

    if (!error && dbPosts && dbPosts.length > 0) {
      // Map Supabase rows to post structure
      const mapped = dbPosts.map(p => {
        const isLiked = currentUser ? p.likes.some(l => l.user_id === currentUser.id) : false;
        return {
          id: p.id,
          author: p.profiles?.username || "instagrammer",
          authorAvatar: p.profiles?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          verified: false,
          location: p.location || "",
          postImage: p.image_url,
          likes: p.likes ? p.likes.length : 0,
          isLiked: isLiked,
          isSaved: false,
          time: timeAgo(p.created_at),
          caption: p.caption || "",
          comments: (p.comments || []).map(c => ({
            author: c.profiles?.username || "user",
            text: c.text,
            liked: false
          }))
        };
      });

      postsData = [...mapped, ...defaultPosts];
    } else {
      postsData = [...defaultPosts];
    }
  } catch (err) {
    console.warn("Using offline demo data:", err);
    postsData = [...defaultPosts];
  }

  renderPosts();
  renderProfileGrid();
}

function timeAgo(dateString) {
  if (!dateString) return "JUST NOW";
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
}

// 4. DOM Rendering
function renderStories() {
  const container = document.getElementById("stories-tray");
  if (!container) return;
  container.innerHTML = "";

  storiesData.forEach((story, idx) => {
    const item = document.createElement("div");
    item.className = `story-item ${story.viewed ? "viewed" : ""}`;
    item.onclick = () => openStoryViewer(idx);

    item.innerHTML = `
      <div class="story-ring">
        <div class="story-avatar-wrapper">
          <img class="story-avatar" src="${story.avatar}" alt="${story.username}">
        </div>
      </div>
      <div class="story-username">${story.username}</div>
    `;
    container.appendChild(item);
  });
}

function renderPosts() {
  const container = document.getElementById("posts-container");
  if (!container) return;
  container.innerHTML = "";

  postsData.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.id = `post-${post.id}`;

    card.innerHTML = `
      <!-- Header -->
      <header class="post-header">
        <div class="post-user-info">
          <div class="post-avatar-ring">
            <img class="post-avatar" src="${post.authorAvatar}" alt="${post.author}">
          </div>
          <div class="post-author-details">
            <div class="post-author-name-row">
              <a class="post-author-name">${post.author}</a>
              ${post.verified ? `<svg class="verified-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` : ""}
              <span class="post-timestamp-dot">•</span>
              <span class="post-time">${post.time}</span>
            </div>
            ${post.location ? `<span class="post-location">${post.location}</span>` : ""}
          </div>
        </div>
        <button class="post-options-btn" onclick="showNotificationToast('Post Options')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
        </button>
      </header>

      <!-- Media -->
      <div class="post-media-container" ondblclick="handleDoubleTapHeart('${post.id}')">
        <img class="post-media-img" src="${post.postImage}" alt="post media" loading="lazy">
        <svg class="heart-pop" id="heart-pop-${post.id}" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>

      <!-- Action Buttons -->
      <div class="post-actions-bar">
        <div class="action-buttons-left">
          <button class="action-btn ${post.isLiked ? "liked" : ""}" id="like-btn-${post.id}" onclick="toggleLikePost('${post.id}')">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button class="action-btn" onclick="focusCommentInput('${post.id}')">
            <svg viewBox="0 0 24 24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
          <button class="action-btn" onclick="sharePost('${post.id}')">
            <svg viewBox="0 0 24 24"><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="2" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 2.001 2 3.01 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
          </button>
        </div>
        <button class="action-btn ${post.isSaved ? "saved" : ""}" id="save-btn-${post.id}" onclick="toggleSavePost('${post.id}')">
          <svg viewBox="0 0 24 24"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>
        </button>
      </div>

      <!-- Likes Count -->
      <div class="post-likes-count" id="likes-count-${post.id}">
        ${post.likes.toLocaleString()} likes
      </div>

      <!-- Caption -->
      <div class="post-caption-box">
        <span class="post-caption-author">${post.author}</span>
        <span class="post-caption-text">${formatCaption(post.caption)}</span>
      </div>

      <!-- Comments List -->
      <div class="post-comments-preview" id="comments-list-${post.id}">
        ${post.comments.map(c => `
          <div class="single-comment">
            <div class="comment-left">
              <span class="comment-author">${c.author}</span>
              <span>${c.text}</span>
            </div>
            <button class="comment-like-btn" onclick="this.classList.toggle('liked')">♥</button>
          </div>
        `).join("")}
      </div>

      <!-- Add Comment Row -->
      <div class="add-comment-row">
        <button class="emoji-btn" onclick="showNotificationToast('Emoji selector')">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-3-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3 7c2.607 0 4.795-1.745 5.5-4h-11c.705 2.255 2.893 4 5.5 4z"/></svg>
        </button>
        <input class="comment-input" id="comment-input-${post.id}" type="text" placeholder="Add a comment..." oninput="checkCommentInput('${post.id}')" onkeydown="handleCommentKey(event, '${post.id}')">
        <button class="post-comment-submit" id="comment-submit-${post.id}" onclick="submitComment('${post.id}')">Post</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function formatCaption(caption) {
  return caption.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
}

function renderSuggestions() {
  const container = document.getElementById("suggestions-list");
  if (!container) return;
  container.innerHTML = "";

  suggestionsData.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "suggestion-item";
    row.innerHTML = `
      <div class="suggestion-user-info">
        <img class="suggestion-avatar" src="${item.avatar}" alt="${item.username}">
        <div>
          <div class="suggestion-name">${item.username}</div>
          <div class="suggestion-sub">${item.context}</div>
        </div>
      </div>
      <button class="follow-btn ${item.isFollowing ? "following" : ""}" onclick="toggleFollow(${idx}, this)">
        ${item.isFollowing ? "Following" : "Follow"}
      </button>
    `;
    container.appendChild(row);
  });
}

function renderExploreGrid() {
  const container = document.getElementById("explore-grid");
  if (!container) return;
  container.innerHTML = "";

  exploreImages.forEach(item => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.innerHTML = `
      <img src="${item.img}" alt="explore item" loading="lazy">
      <div class="grid-item-overlay">
        <div class="grid-stat">♥ ${item.likes}</div>
        <div class="grid-stat">💬 ${item.comments}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderProfileGrid() {
  const container = document.getElementById("profile-grid");
  if (!container) return;
  container.innerHTML = "";

  const profileItems = [
    ...postsData.map(p => ({ img: p.postImage, likes: p.likes.toLocaleString(), comments: p.comments.length })),
    ...exploreImages.slice(0, 3)
  ];

  const postCountEl = document.getElementById("profile-post-count");
  if (postCountEl) postCountEl.innerText = profileItems.length;

  profileItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.innerHTML = `
      <img src="${item.img}" alt="profile post" loading="lazy">
      <div class="grid-item-overlay">
        <div class="grid-stat">♥ ${item.likes}</div>
        <div class="grid-stat">💬 ${item.comments}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderDirectMessages() {
  const container = document.getElementById("dm-threads");
  if (!container) return;
  container.innerHTML = "";

  dmThreads.forEach(t => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "12px";
    item.style.padding = "12px 16px";
    item.style.cursor = "pointer";
    item.style.borderRadius = "8px";
    item.style.margin = "0 8px";
    item.onmouseenter = () => item.style.backgroundColor = "var(--bg-hover)";
    item.onmouseleave = () => item.style.backgroundColor = "transparent";
    item.onclick = () => openChatConversation(t.name);

    item.innerHTML = `
      <div style="width: 48px; height: 48px; border-radius: 50%; background: #444; overflow: hidden; flex-shrink: 0;">
        <img style="width: 100%; height: 100%; object-fit: cover;" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80">
      </div>
      <div style="flex: 1; overflow: hidden;">
        <div style="font-weight: 600; font-size: 14px;">${t.name}</div>
        <div style="font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.msg} • ${t.time}</div>
      </div>
      ${t.unread ? `<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-blue);"></div>` : ""}
    `;
    container.appendChild(item);
  });
}

function openChatConversation(username) {
  const chatArea = document.getElementById("chat-conversation-area");
  if (!chatArea) return;
  chatArea.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
      <div style="display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border-color);">
        <img style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80">
        <div>
          <div style="font-weight: 600;">${username}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Active now</div>
        </div>
      </div>
      <div style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
        <div style="align-self: flex-start; background: var(--bg-elevated); padding: 10px 14px; border-radius: 18px; max-width: 70%;">Hey! Check out this real Instagram clone! 🚀</div>
        <div style="align-self: flex-end; background: var(--accent-blue); color: #fff; padding: 10px 14px; border-radius: 18px; max-width: 70%;">Looks amazing and connects to live Supabase!</div>
      </div>
      <div style="padding: 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
        <input type="text" placeholder="Message..." style="flex: 1; border: 1px solid var(--border-light); background: none; border-radius: 20px; padding: 10px 16px; color: var(--text-primary); outline: none;">
        <button class="create-submit-btn" style="padding: 8px 16px;" onclick="showNotificationToast('Message sent!')">Send</button>
      </div>
    </div>
  `;
}

function renderReels() {
  const container = document.getElementById("reels-container");
  if (!container) return;
  container.innerHTML = "";

  const reelsData = [
    {
      author: "nature_lens",
      authorAvatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80",
      caption: "Northern lights in Lofoten, Norway 🌌 #aurora #travel",
      audio: "Original Audio • nature_lens",
      img: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80",
      likes: "248.5K",
      comments: "1.8K"
    },
    {
      author: "urban_drone",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      caption: "Sunset flight over Dubai Marina towers 🚁",
      audio: "Vibes • City Nights",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      likes: "189.2K",
      comments: "940"
    }
  ];

  reelsData.forEach(r => {
    const card = document.createElement("div");
    card.className = "reel-card";
    card.innerHTML = `
      <img class="reel-video" src="${r.img}" alt="reel">
      <div class="reel-overlay-content">
        <div class="reel-author-row">
          <img class="reel-avatar" src="${r.authorAvatar}">
          <span class="reel-author-name">${r.author}</span>
          <span class="reel-follow-pill" onclick="this.innerText = this.innerText === 'Follow' ? 'Following' : 'Follow'">Follow</span>
        </div>
        <div class="reel-caption">${r.caption}</div>
        <div class="reel-audio-tag">🎵 ${r.audio}</div>
      </div>
      <div class="reel-actions-column">
        <button class="reel-action-btn" onclick="this.querySelector('svg').style.fill = this.querySelector('svg').style.fill === 'red' ? '#fff' : 'red'">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>${r.likes}</span>
        </button>
        <button class="reel-action-btn" onclick="showNotificationToast('Comments modal opened')">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>
          <span>${r.comments}</span>
        </button>
        <button class="reel-action-btn" onclick="showNotificationToast('Link copied to clipboard')">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2"><line x1="22" x2="9.218" y1="2" y2="10.083"></line><polygon points="11.698 20.334 22 2.001 2 3.01 9.218 10.084 11.698 20.334"></polygon></svg>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 5. User Actions (Like, Comment, Save)
async function toggleLikePost(postId) {
  if (!currentUser) {
    openAuthModal("login");
    showNotificationToast("Please log in to like posts ❤️");
    return;
  }

  const post = postsData.find(p => String(p.id) === String(postId));
  if (!post) return;

  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;

  const likeBtn = document.getElementById(`like-btn-${postId}`);
  const likesCountEl = document.getElementById(`likes-count-${postId}`);

  if (likeBtn) likeBtn.classList.toggle("liked", post.isLiked);
  if (likesCountEl) likesCountEl.innerText = `${post.likes.toLocaleString()} likes`;

  // Sync with Supabase if UUID
  if (supabase && typeof postId === "string" && postId.length > 20) {
    try {
      if (post.isLiked) {
        await supabase.from("likes").insert({ post_id: postId, user_id: currentUser.id });
      } else {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", currentUser.id);
      }
    } catch (err) {
      console.warn("Like sync error:", err);
    }
  }
}

function handleDoubleTapHeart(postId) {
  const post = postsData.find(p => String(p.id) === String(postId));
  if (!post) return;

  if (!post.isLiked) {
    toggleLikePost(postId);
  }

  const heartPop = document.getElementById(`heart-pop-${postId}`);
  if (heartPop) {
    heartPop.classList.add("animate");
    setTimeout(() => {
      heartPop.classList.remove("animate");
    }, 800);
  }
}

function toggleSavePost(postId) {
  if (!currentUser) {
    openAuthModal("login");
    showNotificationToast("Please log in to save posts 🔖");
    return;
  }

  const post = postsData.find(p => String(p.id) === String(postId));
  if (!post) return;

  post.isSaved = !post.isSaved;
  const saveBtn = document.getElementById(`save-btn-${postId}`);
  if (saveBtn) saveBtn.classList.toggle("saved", post.isSaved);

  showNotificationToast(post.isSaved ? "Saved to your collection" : "Removed from saved");
}

function sharePost(postId) {
  navigator.clipboard?.writeText(window.location.href);
  showNotificationToast("Post link copied to clipboard!");
}

function checkCommentInput(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const submitBtn = document.getElementById(`comment-submit-${postId}`);
  if (!input || !submitBtn) return;

  if (input.value.trim().length > 0) {
    submitBtn.classList.add("active");
  } else {
    submitBtn.classList.remove("active");
  }
}

function handleCommentKey(e, postId) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitComment(postId);
  }
}

async function submitComment(postId) {
  if (!currentUser) {
    openAuthModal("login");
    showNotificationToast("Please log in to leave a comment 💬");
    return;
  }

  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const post = postsData.find(p => String(p.id) === String(postId));
  if (!post) return;

  const commentText = input.value.trim();
  const newComment = {
    author: currentProfile?.username || "you",
    text: commentText,
    liked: false
  };

  post.comments.push(newComment);

  const commentsList = document.getElementById(`comments-list-${postId}`);
  if (commentsList) {
    const el = document.createElement("div");
    el.className = "single-comment";
    el.innerHTML = `
      <div class="comment-left">
        <span class="comment-author">${newComment.author}</span>
        <span>${newComment.text}</span>
      </div>
      <button class="comment-like-btn" onclick="this.classList.toggle('liked')">♥</button>
    `;
    commentsList.appendChild(el);
  }

  input.value = "";
  checkCommentInput(postId);

  // Sync comment to Supabase
  if (supabase && typeof postId === "string" && postId.length > 20) {
    try {
      await supabase.from("comments").insert({
        post_id: postId,
        user_id: currentUser.id,
        text: commentText
      });
    } catch (err) {
      console.warn("Comment sync error:", err);
    }
  }
}

function focusCommentInput(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (input) input.focus();
}

function toggleFollow(idx, btn) {
  if (!currentUser) {
    openAuthModal("login");
    showNotificationToast("Please log in to follow creators");
    return;
  }

  const item = suggestionsData[idx];
  if (!item) return;
  item.isFollowing = !item.isFollowing;
  btn.innerText = item.isFollowing ? "Following" : "Follow";
  btn.classList.toggle("following", item.isFollowing);
}

// 6. Navigation
function switchNav(viewName) {
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) targetPanel.classList.add("active");

  const navItem = document.querySelector(`.nav-item[data-nav="${viewName}"]`);
  if (navItem) navItem.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewName === "explore") renderExploreGrid();
  if (viewName === "reels") renderReels();
  if (viewName === "messages") renderDirectMessages();
  if (viewName === "profile") renderProfileGrid();
}

function switchProfileTab(tabName) {
  document.querySelectorAll(".profile-tab-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");
  renderProfileGrid();
}

// 7. Fullscreen Story Viewer
let currentStoryIdx = 0;
let storyTimer = null;
let storyProgress = 0;

function openStoryViewer(idx) {
  currentStoryIdx = idx;
  const modal = document.getElementById("story-viewer-modal");
  if (!modal) return;

  modal.classList.add("active");
  loadStory(currentStoryIdx);
}

function loadStory(idx) {
  clearInterval(storyTimer);
  storyProgress = 0;

  const story = storiesData[idx];
  if (!story) {
    closeStoryViewer();
    return;
  }

  story.viewed = true;
  renderStories();

  document.getElementById("story-viewer-avatar").src = story.avatar;
  document.getElementById("story-viewer-name").innerText = story.username;
  document.getElementById("story-viewer-time").innerText = story.time;
  document.getElementById("story-viewer-img").src = story.storyImg;

  const fill = document.getElementById("story-progress-fill");
  fill.style.width = "0%";

  const duration = 5000;
  const interval = 50;
  const step = (interval / duration) * 100;

  storyTimer = setInterval(() => {
    storyProgress += step;
    fill.style.width = `${Math.min(storyProgress, 100)}%`;

    if (storyProgress >= 100) {
      clearInterval(storyTimer);
      navigateStory(1);
    }
  }, interval);
}

function navigateStory(direction) {
  const nextIdx = currentStoryIdx + direction;
  if (nextIdx >= 0 && nextIdx < storiesData.length) {
    currentStoryIdx = nextIdx;
    loadStory(currentStoryIdx);
  } else {
    closeStoryViewer();
  }
}

function closeStoryViewer() {
  clearInterval(storyTimer);
  const modal = document.getElementById("story-viewer-modal");
  if (modal) modal.classList.remove("active");
}

// 8. Create Post Workflow (Upload to Supabase Storage)
let stagedImage = null;
let stagedFile = null;

function openCreateModal() {
  if (!currentUser) {
    openAuthModal("login");
    showNotificationToast("Please log in to share photos 📸");
    return;
  }

  stagedImage = null;
  stagedFile = null;
  document.getElementById("create-dropzone").style.display = "flex";
  document.getElementById("create-preview-area").style.display = "none";
  document.getElementById("create-caption").value = "";
  document.getElementById("create-location").value = "";
  document.getElementById("create-modal").classList.add("active");
}

function closeCreateModal() {
  document.getElementById("create-modal").classList.remove("active");
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  stagedFile = file;
  const reader = new FileReader();
  reader.onload = function(evt) {
    stagedImage = evt.target.result;
    document.getElementById("create-preview-image").src = stagedImage;
    document.getElementById("create-dropzone").style.display = "none";
    document.getElementById("create-preview-area").style.display = "flex";
  };
  reader.readAsDataURL(file);
}

async function submitNewPost() {
  if (!stagedImage) {
    showNotificationToast("Please select an image first!");
    return;
  }

  const shareBtn = document.getElementById("create-share-btn");
  shareBtn.innerText = "Sharing...";
  shareBtn.style.opacity = "0.5";

  const captionText = document.getElementById("create-caption").value;
  const locationText = document.getElementById("create-location").value;

  let publicUrl = stagedImage;

  // Upload to Supabase Storage if available
  if (supabase && currentUser && stagedFile) {
    try {
      const fileExt = stagedFile.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("instagram-media")
        .upload(fileName, stagedFile, {
          cacheControl: "3600",
          upsert: true
        });

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from("instagram-media")
          .getPublicUrl(fileName);
        if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
      }

      // Insert record into Supabase posts table
      await supabase.from("posts").insert({
        user_id: currentUser.id,
        image_url: publicUrl,
        caption: captionText,
        location: locationText || ""
      });
    } catch (err) {
      console.warn("Storage upload error, using local data URL:", err);
    }
  }

  // Local optimistic update
  const newPost = {
    id: Date.now().toString(),
    author: currentProfile?.username || "huzaifa_official",
    authorAvatar: currentProfile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verified: true,
    location: locationText || "",
    postImage: publicUrl,
    likes: 1,
    isLiked: true,
    isSaved: false,
    time: "JUST NOW",
    caption: captionText || "New memory captured ✨",
    comments: []
  };

  postsData.unshift(newPost);
  renderPosts();
  renderProfileGrid();
  closeCreateModal();
  switchNav("home");
  showNotificationToast("Your post has been shared! 🎉");
  shareBtn.innerText = "Share";
  shareBtn.style.opacity = "1";
}

// 9. Theme Toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("ig_theme", next);

  const label = document.getElementById("theme-btn-label");
  if (label) label.innerText = next === "dark" ? "Switch appearance" : "Dark mode";
  showNotificationToast(`Theme changed to ${next} mode`);
}

function showNotificationToast(msg) {
  const toast = document.getElementById("notification-toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.style.opacity = "1";
  toast.style.pointerEvents = "auto";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
  }, 2200);
}

function openSearchModal() {
  showNotificationToast("Search: type to find accounts, tags, and places");
}

// Global Shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeStoryViewer();
    closeCreateModal();
    closeAuthModal();
  }
});

// App Entry Point
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("ig_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  renderStories();
  renderPosts();
  renderSuggestions();
  renderExploreGrid();
  renderProfileGrid();

  // Initialize Supabase Auth & Live Posts
  checkAuthSession();
});
