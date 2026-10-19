// Firebase Configuration & Service Layer for EB Wealth Web App
// Project: com-aistudio-ebwealth-kq-f6b41
// Named Firestore Database: ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3

const defaultFirebaseConfig = {
  apiKey: "AIzaSyChpopTlX_GpukhBua2DdAQOHul1UFrSiM",
  authDomain: "com-aistudio-ebwealth-kq-f6b41.firebaseapp.com",
  projectId: "com-aistudio-ebwealth-kq-f6b41",
  storageBucket: "com-aistudio-ebwealth-kq-f6b41.firebasestorage.app",
  messagingSenderId: "187328042972",
  appId: "1:187328042972:web:ebwealthwebapp",
  databaseId: "ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3"
};

let storedCustom = null;
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('eb_custom_firebase_config') : null;
  if (raw) storedCustom = JSON.parse(raw);
} catch (e) {}

export const firebaseConfig = storedCustom || defaultFirebaseConfig;

export const REST_CONFIG = {
  authBase: "https://identitytoolkit.googleapis.com/v1/accounts",
  firestoreBase: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.databaseId || '(default)'}/documents`
};

export function saveCustomDatabaseConfig(config) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('eb_custom_firebase_config', JSON.stringify(config));
  }
}

export function resetToDefaultDatabase() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('eb_custom_firebase_config');
  }
}

export class WebFirebaseService {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("eb_user_session") || "null");
    this.isConnected = false;
    this.lastSync = localStorage.getItem("eb_last_sync") || "Not synced";
  }

  async signUp(email, password, firstName) {
    try {
      const url = `${REST_CONFIG.authBase}:signUp?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await res.json();
      if (data.error) throw new Error(this.friendlyError(data.error.message));
      
      const user = {
        id: data.localId,
        idToken: data.idToken,
        email: email,
        firstName: firstName || email.split("@")[0] || "Investor",
        experienceLevel: "Beginner",
        primaryGoal: "Build long-term wealth",
        xp: 150,
        streakDays: 1,
        isPro: true,
        isOnboarded: true
      };
      this.currentUser = user;
      localStorage.setItem("eb_user_session", JSON.stringify(user));
      await this.syncProfile(user);
      return { success: true, user };
    } catch (e) {
      // Local fallback for offline/preview
      const user = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        idToken: "offline_mock_token",
        email: email,
        firstName: firstName || email.split("@")[0] || "Investor",
        experienceLevel: "Beginner",
        primaryGoal: "Build long-term wealth",
        xp: 150,
        streakDays: 1,
        isPro: true,
        isOnboarded: true,
        isOfflineMode: true
      };
      this.currentUser = user;
      localStorage.setItem("eb_user_session", JSON.stringify(user));
      return { success: true, user, warning: e.message };
    }
  }

  async signIn(email, password) {
    try {
      const url = `${REST_CONFIG.authBase}:signInWithPassword?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await res.json();
      if (data.error) throw new Error(this.friendlyError(data.error.message));

      const existingProfile = await this.fetchProfile(data.localId, data.idToken);
      const user = existingProfile || {
        id: data.localId,
        idToken: data.idToken,
        email: email,
        firstName: data.displayName || email.split("@")[0] || "Investor",
        experienceLevel: "Intermediate",
        primaryGoal: "Maximize ISA tax-free growth",
        xp: 320,
        streakDays: 4,
        isPro: true,
        isOnboarded: true
      };
      user.idToken = data.idToken;
      this.currentUser = user;
      localStorage.setItem("eb_user_session", JSON.stringify(user));
      return { success: true, user };
    } catch (e) {
      // Local session check
      const local = JSON.parse(localStorage.getItem("eb_user_session") || "null");
      if (local && local.email.toLowerCase() === email.toLowerCase()) {
        this.currentUser = local;
        return { success: true, user: local };
      }
      throw e;
    }
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem("eb_user_session");
  }

  async syncProfile(profile) {
    if (!profile || !profile.id) return false;
    const now = new Date();
    const timeStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    this.lastSync = timeStr;
    localStorage.setItem("eb_last_sync", timeStr);

    if (profile.idToken && profile.idToken !== "offline_mock_token") {
      try {
        const url = `${REST_CONFIG.firestoreBase}/users/${profile.id}?updateMask.fieldPaths=id&updateMask.fieldPaths=firstName&updateMask.fieldPaths=email&updateMask.fieldPaths=experienceLevel&updateMask.fieldPaths=primaryGoal&updateMask.fieldPaths=xp&updateMask.fieldPaths=isPro&updateMask.fieldPaths=streakDays&updateMask.fieldPaths=isOnboarded`;
        await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${profile.idToken}`
          },
          body: JSON.stringify({
            fields: {
              id: { stringValue: profile.id },
              firstName: { stringValue: profile.firstName || "" },
              email: { stringValue: profile.email || "" },
              experienceLevel: { stringValue: profile.experienceLevel || "Beginner" },
              primaryGoal: { stringValue: profile.primaryGoal || "" },
              xp: { integerValue: String(profile.xp || 0) },
              streakDays: { integerValue: String(profile.streakDays || 1) },
              isPro: { booleanValue: !!profile.isPro },
              isOnboarded: { booleanValue: !!profile.isOnboarded }
            }
          })
        });
      } catch (err) {
        console.warn("Firestore profile sync fallback:", err);
      }
    }
    localStorage.setItem("eb_user_session", JSON.stringify(profile));
    return true;
  }

  async fetchProfile(uid, idToken) {
    try {
      const url = `${REST_CONFIG.firestoreBase}/users/${uid}`;
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${idToken}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.fields) return null;
      const f = data.fields;
      return {
        id: uid,
        firstName: f.firstName?.stringValue || "Investor",
        email: f.email?.stringValue || "",
        experienceLevel: f.experienceLevel?.stringValue || "Beginner",
        primaryGoal: f.primaryGoal?.stringValue || "Long-term wealth",
        xp: parseInt(f.xp?.integerValue || "100"),
        streakDays: parseInt(f.streakDays?.integerValue || "1"),
        isPro: !!f.isPro?.booleanValue,
        isOnboarded: !!f.isOnboarded?.booleanValue
      };
    } catch {
      return null;
    }
  }

  async syncHoldings(holdings) {
    const user = this.currentUser;
    localStorage.setItem("eb_holdings", JSON.stringify(holdings));
    if (!user || !user.idToken || user.idToken === "offline_mock_token") return true;

    try {
      for (const h of holdings) {
        const url = `${REST_CONFIG.firestoreBase}/users/${user.id}/holdings/${h.ticker}`;
        await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.idToken}`
          },
          body: JSON.stringify({
            fields: {
              userId: { stringValue: user.id },
              ticker: { stringValue: h.ticker },
              name: { stringValue: h.name },
              assetType: { stringValue: h.assetType || "ETF" },
              allocationCategory: { stringValue: h.allocationCategory || "Global" },
              currency: { stringValue: h.currency || "GBP" },
              shares: { doubleValue: Number(h.shares) },
              avgBuyPrice: { doubleValue: Number(h.avgBuyPrice) },
              currentPrice: { doubleValue: Number(h.currentPrice) }
            }
          })
        });
      }
      return true;
    } catch (err) {
      console.warn("Firestore holdings sync warning:", err);
      return false;
    }
  }

  async fetchHoldings(userId, idToken) {
    const uid = userId || this.currentUser?.id;
    const token = idToken || this.currentUser?.idToken;
    if (!uid) return [];
    try {
      const headers = {};
      if (token && token !== "offline_mock_token") {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const url = `${REST_CONFIG.firestoreBase}/users/${uid}/holdings`;
      const res = await fetch(url, { headers });
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents) return [];
      return data.documents.map(doc => {
        const f = doc.fields || {};
        return {
          ticker: f.ticker?.stringValue || doc.name.split("/").pop(),
          name: f.name?.stringValue || "",
          assetType: f.assetType?.stringValue || "ETF",
          allocationCategory: f.allocationCategory?.stringValue || "Global Equities",
          accountType: f.accountType?.stringValue || "Stocks & Shares ISA",
          currency: f.currency?.stringValue || "GBP",
          shares: parseFloat(f.shares?.doubleValue || f.shares?.integerValue || 0),
          avgBuyPrice: parseFloat(f.avgBuyPrice?.doubleValue || f.avgBuyPrice?.integerValue || 0),
          currentPrice: parseFloat(f.currentPrice?.doubleValue || f.currentPrice?.integerValue || 0)
        };
      });
    } catch (err) {
      console.warn("Fetch holdings error:", err);
      return [];
    }
  }

  async deleteHolding(ticker) {
    const user = this.currentUser;
    if (!user || !user.id) return false;
    try {
      const headers = {};
      if (user.idToken && user.idToken !== "offline_mock_token") {
        headers["Authorization"] = `Bearer ${user.idToken}`;
      }
      const url = `${REST_CONFIG.firestoreBase}/users/${user.id}/holdings/${ticker}`;
      await fetch(url, { method: "DELETE", headers });
      return true;
    } catch (err) {
      console.warn("Delete holding error:", err);
      return false;
    }
  }

  async fetchAllOrganicUsers() {
    try {
      const url = `${REST_CONFIG.firestoreBase}/users?pageSize=100`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents) return [];
      return data.documents.map(doc => {
        const f = doc.fields || {};
        const uid = doc.name.split("/").pop();
        return {
          id: uid,
          firstName: f.firstName?.stringValue || "Investor",
          email: f.email?.stringValue || "",
          experienceLevel: f.experienceLevel?.stringValue || "Beginner",
          primaryGoal: f.primaryGoal?.stringValue || "Build long-term wealth",
          xp: parseInt(f.xp?.integerValue || "0"),
          streakDays: parseInt(f.streakDays?.integerValue || "0"),
          isPro: !!f.isPro?.booleanValue,
          isOnboarded: !!f.isOnboarded?.booleanValue,
          createdAtFormatted: doc.createTime ? new Date(doc.createTime).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent"
        };
      });
    } catch (err) {
      console.warn("fetchAllOrganicUsers error:", err);
      return [];
    }
  }

  async fetchCommunityPosts() {
    try {
      const url = `${REST_CONFIG.firestoreBase}/community_posts?pageSize=30`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch remote posts");
      const data = await res.json();
      if (!data.documents) return null;
      return data.documents.map(doc => {
        const f = doc.fields || {};
        return {
          id: doc.name.split("/").pop(),
          authorName: f.authorName?.stringValue || "Investor",
          category: f.category?.stringValue || "UK Investing",
          title: f.title?.stringValue || "",
          content: f.content?.stringValue || "",
          likesCount: parseInt(f.likesCount?.integerValue || "0"),
          commentsCount: parseInt(f.commentsCount?.integerValue || "0"),
          createdAtFormatted: f.createdAtFormatted?.stringValue || "Today"
        };
      });
    } catch {
      return null;
    }
  }

  async createCommunityPost(post) {
    const user = this.currentUser;
    const postId = "post_" + Date.now();
    const token = user?.idToken && user.idToken !== "offline_mock_token" ? user.idToken : null;
    
    if (token) {
      try {
        const url = `${REST_CONFIG.firestoreBase}/community_posts?documentId=${postId}`;
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            fields: {
              userId: { stringValue: user.id },
              authorName: { stringValue: user.firstName },
              category: { stringValue: post.category },
              title: { stringValue: post.title },
              content: { stringValue: post.content },
              likesCount: { integerValue: "1" },
              commentsCount: { integerValue: "0" },
              createdAtFormatted: { stringValue: "Just now" }
            }
          })
        });
      } catch (e) {
        console.warn("Post sync error:", e);
      }
    }
    return postId;
  }

  friendlyError(msg) {
    if (msg.includes("EMAIL_EXISTS")) return "An account with this email address already exists. Please sign in.";
    if (msg.includes("INVALID_LOGIN_CREDENTIALS") || msg.includes("INVALID_PASSWORD")) return "Invalid email or password. Please verify credentials.";
    if (msg.includes("USER_NOT_FOUND")) return "No user account found with this email. Please create an account.";
    if (msg.includes("WEAK_PASSWORD")) return "Password must be at least 6 characters long.";
    return msg;
  }
}
