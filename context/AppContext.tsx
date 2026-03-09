import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export interface SavedPhoto {
  id: string;
  uri: string;
  filterId: string;
  timestamp: number;
}

interface AppContextValue {
  savedPhotos: SavedPhoto[];
  addPhoto: (photo: SavedPhoto) => void;
  deletePhoto: (id: string) => void;
  themeMode: 'system' | 'dark' | 'light';
  setThemeMode: (mode: 'system' | 'dark' | 'light') => void;
  isDark: boolean;
  isPremium: boolean;
  setIsPremium: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const PHOTOS_KEY = '@glowsnap_photos';
const THEME_KEY = '@glowsnap_theme';

export function AppProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);
  const [themeMode, setThemeModeState] = useState<'system' | 'dark' | 'light'>('system');
  const [isPremium, setIsPremiumState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const photosJson = await AsyncStorage.getItem(PHOTOS_KEY);
        if (photosJson) setSavedPhotos(JSON.parse(photosJson));
        const theme = await AsyncStorage.getItem(THEME_KEY);
        if (theme) setThemeModeState(theme as 'system' | 'dark' | 'light');
      } catch {}
    })();
  }, []);

  const addPhoto = async (photo: SavedPhoto) => {
    const updated = [photo, ...savedPhotos];
    setSavedPhotos(updated);
    try { await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updated)); } catch {}
  };

  const deletePhoto = async (id: string) => {
    const updated = savedPhotos.filter(p => p.id !== id);
    setSavedPhotos(updated);
    try { await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updated)); } catch {}
  };

  const setThemeMode = async (mode: 'system' | 'dark' | 'light') => {
    setThemeModeState(mode);
    try { await AsyncStorage.setItem(THEME_KEY, mode); } catch {}
  };

  const setIsPremium = (v: boolean) => setIsPremiumState(v);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const value = useMemo(() => ({
    savedPhotos, addPhoto, deletePhoto,
    themeMode, setThemeMode,
    isDark,
    isPremium, setIsPremium,
  }), [savedPhotos, themeMode, isDark, isPremium]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
