import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Users Database in LocalStorage
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem("launchpad_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Currently logged in user (just stores the username)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("launchpad_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Current session states
  const [savedOpportunities, setSavedOpportunities] = useState(() => {
    try {
      const current = JSON.parse(localStorage.getItem("launchpad_current_user"));
      const usersList = JSON.parse(localStorage.getItem("launchpad_users") || "[]");
      const u = usersList.find(x => x.email === current);
      return u ? (u.savedOpportunities || []) : [];
    } catch { return []; }
  });

  const [appliedOpportunities, setAppliedOpportunities] = useState(() => {
    try {
      const current = JSON.parse(localStorage.getItem("launchpad_current_user"));
      const usersList = JSON.parse(localStorage.getItem("launchpad_users") || "[]");
      const u = usersList.find(x => x.email === current);
      return u ? (u.appliedOpportunities || []) : [];
    } catch { return []; }
  });

  const [userPreferences, setUserPreferences] = useState({ interests: [], branch: "", year: "", skills: [] });
  
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    try {
      const current = JSON.parse(localStorage.getItem("launchpad_current_user"));
      const usersList = JSON.parse(localStorage.getItem("launchpad_users") || "[]");
      const u = usersList.find(x => x.email === current);
      return u ? (u.hasOnboarded || false) : false;
    } catch { return false; }
  });

  // Load user data into session when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const user = users.find(u => u.email === currentUser);
      if (user) {
        setSavedOpportunities(user.savedOpportunities || []);
        setAppliedOpportunities(user.appliedOpportunities || []);
        setUserPreferences(user.preferences || { interests: [], branch: "", year: "", skills: [] });
        setHasOnboarded(user.hasOnboarded || false);
      }
    } else {
      setSavedOpportunities([]);
      setAppliedOpportunities([]);
      setUserPreferences({ interests: [], branch: "", year: "", skills: [] });
      setHasOnboarded(false);
    }
  }, [currentUser]); // Note: intentional dependency array without `users` to prevent loop, but needs care.

  // Sync users database to localStorage
  useEffect(() => {
    localStorage.setItem("launchpad_users", JSON.stringify(users));
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("launchpad_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("launchpad_current_user");
    }
  }, [currentUser]);

  // Sync session state to users database
  const syncToDB = (updates) => {
    if (!currentUser) return;
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.email === currentUser) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  const saveOpportunity = (id) => {
    const newSaved = savedOpportunities.includes(id) ? savedOpportunities : [...savedOpportunities, id];
    setSavedOpportunities(newSaved);
    syncToDB({ savedOpportunities: newSaved });
  };

  const unsaveOpportunity = (id) => {
    const newSaved = savedOpportunities.filter((s) => s !== id);
    setSavedOpportunities(newSaved);
    syncToDB({ savedOpportunities: newSaved });
  };

  const toggleSave = (id) => {
    if (savedOpportunities.includes(id)) {
      unsaveOpportunity(id);
    } else {
      saveOpportunity(id);
    }
  };

  const applyOpportunity = (id) => {
    const newApplied = appliedOpportunities.includes(id) ? appliedOpportunities : [...appliedOpportunities, id];
    setAppliedOpportunities(newApplied);
    syncToDB({ appliedOpportunities: newApplied });
  };

  const updatePreferences = (prefs) => {
    const newPrefs = { ...userPreferences, ...prefs };
    setUserPreferences(newPrefs);
    syncToDB({ preferences: newPrefs });
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
    syncToDB({ hasOnboarded: true });
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(email);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const signup = (fullname, email, password) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: "Email already exists." };
    }
    const newUser = {
      fullname,
      email,
      password,
      hasOnboarded: false,
      preferences: { interests: [], branch: "", year: "", skills: [] },
      savedOpportunities: [],
      appliedOpportunities: []
    };
    setUsers([...users, newUser]);
    setCurrentUser(email);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        savedOpportunities,
        appliedOpportunities,
        userPreferences,
        hasOnboarded,
        currentUser: currentUser ? { name: users.find(u => u.email === currentUser)?.fullname || currentUser } : null,
        saveOpportunity,
        unsaveOpportunity,
        toggleSave,
        applyOpportunity,
        updatePreferences,
        completeOnboarding,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export default AppContext;
