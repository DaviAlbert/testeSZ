// style.ts
import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  padding: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '$gray800',
})

export const Title = styled('h1', {
  fontSize: '$2xl',
  color: '$gray100',
  textAlign: 'center',
  marginBottom: '$5',
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
})

export const Campo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const Label = styled('label', {
  fontWeight: 'bold',
  color: '$gray100',
  borderBottom: '2px solid $gray600',
  paddingBottom: '$1',
})

export const Input = styled('input', {
  padding: '$3',
  border: '1px solid $gray500',
  borderRadius: '$sm',
  backgroundColor: '$gray900',
  color: '$gray100',
  fontSize: '$md',
  textAlign: 'center',
  
  '&::placeholder': {
    color: '$gray400',
  },

  '&:focus': {
    outline: 'none',
    borderColor: '$ignite500',
    backgroundColor: '$gray800',
  },
})

export const Textarea = styled('textarea', {
  padding: '$3',
  border: '1px solid $gray500',
  borderRadius: '$sm',
  backgroundColor: '$gray900',
  color: '$gray100',
  fontSize: '$md',
  textAlign: 'center',
  resize: 'none',

  '&::placeholder': {
    color: '$gray400',
  },

  '&:focus': {
    outline: 'none',
    borderColor: '$ignite500',
    backgroundColor: '$gray800',
  },
})

export const Button = styled('button', {
  padding: '$3',
  width: '100%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$ignite500',
  color: '$white',
  marginTop: '$4',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },

  '&:active': {
    backgroundColor: '$ignite400',
  },
})

export const ButtonCancel = styled('button', {
  padding: '$3',
  width: '100%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: 'rgb(111, 25, 11)',
  color: '$white',
  marginTop: '$2',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$red300',
  },

  '&:active': {
    backgroundColor: '$red400',
  },
})

export const ErrorText = styled('p', {
  fontSize: '$sm',
  color: '$red500',
  textAlign: 'center',
  marginTop: '$2',
})

export const InfoText = styled('p', {
  fontSize: '$sm',
  color: '$gray300',
  textAlign: 'center',
  marginTop: '$4',
})

export const FileInputWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  position: 'relative',
  width: '100%',
})

export const FileInputLabel = styled('label', {
  fontWeight: 'bold',
  color: '$gray100',
  borderBottom: '2px solid $gray600',
  paddingBottom: '$1',
  cursor: 'pointer',
})

export const FileInput = styled('input', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
})

export const FilePreview = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  flexWrap: 'wrap',
})

export const FileImage = styled('img', {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
})

export const FileButton = styled('button', {
  padding: '$3',
  width: 'auto',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$ignite500',
  color: '$white',
  cursor: 'pointer',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },

  '&:active': {
    backgroundColor: '$ignite400',
  },
})
