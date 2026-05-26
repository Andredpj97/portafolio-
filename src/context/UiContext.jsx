import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const UiContext = createContext(null)

export const useUi = () => useContext(UiContext)

export const UiProvider = ({ children }) => {
  const [toast, setToast] = useState({
    id: 0,
    message: '',
    variant: 'success',
    duration: 3000,
    isVisible: false,
  })
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    productName: '',
    onConfirm: null,
  })

  const showToast = useCallback(({ message, variant = 'success', duration = 3000 }) => {
    setToast({
      id: Date.now(),
      message,
      variant,
      duration,
      isVisible: true,
    })
  }, [])

  const showConfirm = useCallback(({ title, message, productName = '', onConfirm }) => {
    setConfirm({
      isOpen: true,
      title,
      message,
      productName,
      onConfirm,
    })
  }, [])

  const handleConfirm = () => {
    const action = confirm.onConfirm
    setConfirm((prev) => ({ ...prev, isOpen: false }))
    if (action) {
      action()
    }
  }

  const handleCancel = () => {
    setConfirm((prev) => ({ ...prev, isOpen: false }))
  }

  const value = useMemo(() => ({ showToast, showConfirm }), [showToast, showConfirm])

  return (
    <UiContext.Provider value={value}>
      {children}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        title={confirm.title}
        message={confirm.message}
        productName={confirm.productName}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Toast
        key={toast.id}
        isVisible={toast.isVisible}
        message={toast.message}
        variant={toast.variant}
        duration={toast.duration}
      />
    </UiContext.Provider>
  )
}

UiProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
