import { create } from 'zustand'

interface UiState {
  isPurchaseModalOpen: boolean
  openPurchaseModal: () => void
  closePurchaseModal: () => void
  isSupportModalOpen: boolean
  openSupportModal: () => void
  closeSupportModal: () => void
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  isLangModalOpen: boolean
  openLangModal: () => void
  closeLangModal: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isPurchaseModalOpen: false,
  openPurchaseModal: () => set({ isPurchaseModalOpen: true }),
  closePurchaseModal: () => set({ isPurchaseModalOpen: false }),
  isSupportModalOpen: false,
  openSupportModal: () => set({ isSupportModalOpen: true }),
  closeSupportModal: () => set({ isSupportModalOpen: false }),
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  isLangModalOpen: false,
  openLangModal: () => set({ isLangModalOpen: true }),
  closeLangModal: () => set({ isLangModalOpen: false }),
}))
