import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  margin: '50px auto',
  padding: '20px',
  maxWidth: '800px',
  backgroundColor: '$gray900',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',

  '@media (max-width: 820px)': {
    margin: '30px auto',
    padding: '15px',
    maxWidth: '90%',
  },
})

export const Title = styled('h1', {
  fontSize: '24px',
  color: '$gray100',
  marginBottom: '20px',

  '@media (max-width: 600px)': {
    fontSize: '20px',
  },
})

export const Grid = styled('div', {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '20px',

  '@media (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export const InfoCard = styled('div', {
  backgroundColor: '$gray800',
  padding: '20px',
  borderRadius: '8px',
  width: '40%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',

  h3: {
    marginBottom: '10px',
    color: '$gray300',
  },

  p: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '$ignite500',
  },

  '@media (max-width: 600px)': {
    width: '80%',
    marginBottom: '15px',
  },

  '@media (max-width: 400px)': {
    width: '100%',
    padding: '15px',
  },
})

export const RefreshButton = styled('button', {
  marginTop: '20px',
  padding: '$2 $4',
  fontSize: '$md',
  borderRadius: '$sm',
  border: 'none',
  backgroundColor: '$ignite500',
  color: '$gray100',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },

  '@media (max-width: 400px)': {
    width: '100%',
    padding: '10px',
  },
})

export const Button = styled('button', {
  backgroundColor: '$ignite500',
  color: '$gray100',
  padding: '15px 30px',
  fontSize: '$md',
  borderRadius: '$sm',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  margin: '50px 5px 0px',

  '&:hover': {
    backgroundColor: '$ignite300',
  },

  '@media (max-width: 600px)': {
    padding: '12px 20px',
    fontSize: '14px',
  },

  '@media (max-width: 400px)': {
    width: '100%',
    marginTop: '20px',
  },
})
