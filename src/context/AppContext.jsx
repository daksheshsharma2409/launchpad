import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [savedOpportunities, setSavedOpportunities] = useState(() => {
    try {
      const stored = localStorage.getItem("launchpad_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem("launchpad_prefs");
      return stored ? JSON.parse(stored) : { interests: [], branch: "", year: "", skills: [] };
    } catch {
      return { interests: [], branch: "", year: "", skills: [] };
    }
  });

  const [hasOnboarded, setHasOnboarded] = useState(() => {
    try {
      return localStorage.getItem("launchpad_onboarded") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("launchpad_saved", JSON.stringify(savedOpportunities));
  }, [savedOpportunities]);

  useEffect(() => {
    localStorage.setItem("launchpad_prefs", JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem("launchpad_onboarded", String(hasOnboarded));
  }, [hasOnboarded]);

  const saveOpportunity = (id) => {
    setSavedOpportunities((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const unsaveOpportunity = (id) => {
    setSavedOpportunities((prev) => prev.filter((s) => s !== id));
  };

  const toggleSave = (id) => {
    if (savedOpportunities.includes(id)) {
      unsaveOpportunity(id);
    } else {
      saveOpportunity(id);
    }
  };

  const updatePreferences = (prefs) => {
    setUserPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
  };

  return (
    <AppContext.Provider
      value={{
        savedOpportunities,
        userPreferences,
        hasOnboarded,
        saveOpportunity,
        unsaveOpportunity,
        toggleSave,
        updatePreferences,
        completeOnboarding,
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
