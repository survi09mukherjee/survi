import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface DoraTourState {
  isVisible: boolean;
  isMinimized: boolean;
  activeSectionId: string | null;
  isTutorOpen: boolean;
  hasDismissedTutor: boolean;
}

export interface DoraTourActions {
  show: () => void;
  hide: () => void;
  minimize: () => void;
  restore: () => void;
  setActiveSection: (id: string | null) => void;
  openTutor: () => void;
  closeTutor: () => void;
  markTutorDismissed: () => void;
}

export const useDoraTour = (): [DoraTourState, DoraTourActions] => {
  const location = useLocation();
  const [state, setState] = useState<DoraTourState>({
    isVisible: true,
    isMinimized: false,
    activeSectionId: null,
    isTutorOpen: false,
    hasDismissedTutor: false,
  });

  // Effect to update active section based on route
  useEffect(() => {
    const path = location.pathname;
    let sectionId = 'hero'; // Default to hero/welcome

    if (path === '/multiplication') {
      sectionId = 'multiplication';
    } else if (path === '/about') {
      sectionId = 'about';
    } else if (path === '/dashboard') {
      sectionId = 'dashboard';
    } else if (path === '/lesson') {
        sectionId = 'lesson';
    } else if (path === '/chat') {
        sectionId = 'chat';
    }
    // Add more mappings as needed

    setState(prev => ({ ...prev, activeSectionId: sectionId }));
  }, [location]);

  const actions: DoraTourActions = {
    show: useCallback(() => setState(prev => ({ ...prev, isVisible: true })), []),
    hide: useCallback(() => setState(prev => ({ ...prev, isVisible: false })), []),
    minimize: useCallback(() => setState(prev => ({ ...prev, isMinimized: true })), []),
    restore: useCallback(() => setState(prev => ({ ...prev, isMinimized: false })), []),
    setActiveSection: useCallback((id: string | null) => setState(prev => ({ ...prev, activeSectionId: id })), []),
    openTutor: useCallback(() => setState(prev => ({ ...prev, isTutorOpen: true })), []),
    closeTutor: useCallback(() => setState(prev => ({ ...prev, isTutorOpen: false })), []),
    markTutorDismissed: useCallback(() => setState(prev => ({ ...prev, hasDismissedTutor: true })), []),
  };

  return [state, actions];
};
