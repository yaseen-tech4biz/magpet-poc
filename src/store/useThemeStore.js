import { create } from 'zustand';

const THEME_STORAGE_KEY = 'magpet_theme';

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
        return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
    }
};

export const useThemeStore = create((set, get) => {
    const initialTheme = getInitialTheme();
    applyThemeToDOM(initialTheme);

    return {
        theme: initialTheme,
        isDark: initialTheme === 'dark',
        toggleTheme: () => {
            const next = get().theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_STORAGE_KEY, next);
            applyThemeToDOM(next);
            set({ theme: next, isDark: next === 'dark' });
        },
        setTheme: (newTheme) => {
            if (newTheme !== 'light' && newTheme !== 'dark') return;
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            applyThemeToDOM(newTheme);
            set({ theme: newTheme, isDark: newTheme === 'dark' });
        }
    };
});
