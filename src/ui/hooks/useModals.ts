import { useState } from 'react';

export function useModals(initialCharacterCreatorOpen: boolean) {
  const [isClassSelectorOpen, setIsClassSelectorOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState<boolean>(false);
  const [isCampfireOpen, setIsCampfireOpen] = useState<boolean>(false);
  const [isShrineOpen, setIsShrineOpen] = useState<boolean>(false);
  const [isTrainerOpen, setIsTrainerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isSanctumOpen, setIsSanctumOpen] = useState<boolean>(false);
  const [isDeckViewOpen, setIsDeckViewOpen] = useState<boolean>(false);
  const [isCombatLogOpen, setIsCombatLogOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState<boolean>(initialCharacterCreatorOpen);

  return {
    isClassSelectorOpen, setIsClassSelectorOpen,
    isShopOpen, setIsShopOpen,
    isLevelUpOpen, setIsLevelUpOpen,
    isSkillTreeOpen, setIsSkillTreeOpen,
    isCampfireOpen, setIsCampfireOpen,
    isShrineOpen, setIsShrineOpen,
    isTrainerOpen, setIsTrainerOpen,
    isSettingsOpen, setIsSettingsOpen,
    isCodexOpen, setIsCodexOpen,
    isSanctumOpen, setIsSanctumOpen,
    isDeckViewOpen, setIsDeckViewOpen,
    isCombatLogOpen, setIsCombatLogOpen,
    isTutorialOpen, setIsTutorialOpen,
    isCharacterCreatorOpen, setIsCharacterCreatorOpen
  };
}
