"use client"

import type React from "react"

import { useState } from "react"

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })

    // Clear error when field is edited
    if (errors[name as keyof T]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleSelectChange = (name: keyof T, value: string) => {
    setValues({ ...values, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleCheckboxChange = (name: keyof T, checked: boolean) => {
    setValues({ ...values, [name]: checked })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleNestedChange = (parent: keyof T, key: string, value: unknown) => {
    setValues({
      ...values,
      [parent]: {
        ...(values[parent] as Record<string, unknown>),
        [key]: value,
      },
    })
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return {
    values,
    errors,
    setValues,
    setErrors,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleNestedChange,
    reset,
  }
}

