"use client"

import { useState, useCallback } from "react"

interface ModalState<T> {
  isAddModalOpen: boolean
  isEditModalOpen: boolean
  isViewModalOpen: boolean
  isDeleteDialogOpen: boolean
  currentItem: T | null
  openAddModal: () => void
  openEditModal: (item: T) => void
  openViewModal: (item: T) => void
  openDeleteDialog: (item: T) => void
  closeAddModal: () => void
  closeEditModal: () => void
  closeViewModal: () => void
  closeDeleteDialog: () => void
  closeAll: () => void
}

export function useModalState<T>(): ModalState<T> {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<T | null>(null)

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  const openEditModal = useCallback((item: T) => {
    setCurrentItem(item)
    setIsEditModalOpen(true)
  }, [])

  const openViewModal = useCallback((item: T) => {
    setCurrentItem(item)
    setIsViewModalOpen(true)
  }, [])

  const openDeleteDialog = useCallback((item: T) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }, [])

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false)
  }, [])

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setCurrentItem(null)
  }, [])

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false)
    setCurrentItem(null)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)
  }, [])

  const closeAll = useCallback(() => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setIsViewModalOpen(false)
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)
  }, [])

  return {
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    isDeleteDialogOpen,
    currentItem,
    openAddModal,
    openEditModal,
    openViewModal,
    openDeleteDialog,
    closeAddModal,
    closeEditModal,
    closeViewModal,
    closeDeleteDialog,
    closeAll,
  }
}
