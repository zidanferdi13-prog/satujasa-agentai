'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6161ff',
      light: '#8181ff',
      dark: '#4a4ae6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#535768',
      light: '#808080',
      dark: '#333333',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#2563eb',
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#059669',
    },
    background: {
      default: '#f5f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#535768',
      disabled: '#808080',
    },
    divider: '#d0d4e4',
  },
  typography: {
    fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    h4: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, color: '#333333' },
    h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4, color: '#333333' },
    h6: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4, color: '#333333' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6, color: '#535768' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#535768' },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, color: '#808080' },
  },
  shape: {
    borderRadius: 24,
  },
  shadows: [
    'none',
    'rgba(50, 50, 93, 0.08) 0px 2px 8px -2px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px',
    'rgba(50, 50, 93, 0.08) 0px 2px 8px -2px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px',
    'rgba(50, 50, 93, 0.08) 0px 2px 8px -2px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px',
    'rgba(50, 50, 93, 0.15) 0px 6px 18px -6px, rgba(0, 0, 0, 0.08) 0px 3px 8px -4px',
    'rgba(50, 50, 93, 0.15) 0px 6px 18px -6px, rgba(0, 0, 0, 0.08) 0px 3px 8px -4px',
    'rgba(50, 50, 93, 0.15) 0px 6px 18px -6px, rgba(0, 0, 0, 0.08) 0px 3px 8px -4px',
    'rgba(0, 0, 0, 0.08) 0px 8px 28px -6px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px',
    'rgba(0, 0, 0, 0.08) 0px 8px 28px -6px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
    'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
  ],
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            boxShadow: 'rgba(97,97,255,0.25) 0px 4px 12px -4px',
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            border: '1px solid #dddfeb',
            color: '#535768',
            '&:hover': {
              borderColor: '#6161ff',
              color: '#6161ff',
              backgroundColor: 'transparent',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            borderRadius: '6px',
            color: '#535768',
            '&:hover': {
              backgroundColor: '#f5f6f8',
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          padding: '8px 20px',
          textTransform: 'none' as const,
          fontWeight: 500,
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'rgba(97,97,255,0.35) 0px 6px 20px -6px',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem' },
        sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: 'rgba(50, 50, 93, 0.08) 0px 2px 8px -2px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px',
          border: '1px solid #d0d4e4',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': { paddingBottom: 20 },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e0e2e6',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#d0d4e4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6161ff',
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
            '&.Mui-disabled': {
              backgroundColor: '#f5f6f8',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#333333',
            fontWeight: 500,
            fontSize: '0.875rem',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.75rem',
            color: '#808080',
            marginLeft: 0,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
          '& fieldset': { borderColor: '#e0e2e6', borderWidth: 1 },
          '&:hover fieldset': { borderColor: '#d0d4e4' },
          '&.Mui-focused fieldset': { borderColor: '#6161ff', borderWidth: 2 },
          '&.Mui-error fieldset': { borderColor: '#ef4444' },
        },
        input: {
          padding: '10px 12px',
          fontSize: '0.875rem',
          '&::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#ffffff',
          '& fieldset': { borderColor: '#e0e2e6' },
          '&:hover fieldset': { borderColor: '#d0d4e4' },
          '&.Mui-focused fieldset': { borderColor: '#6161ff', borderWidth: 2 },
        },
        select: {
          padding: '10px 12px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            color: '#535768',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.03em',
            padding: '12px 16px',
            borderBottom: '1px solid #edf2f7',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#fafbfc',
          },
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
          '& .MuiTableCell-body': {
            padding: '12px 16px',
            fontSize: '0.875rem',
            color: '#333333',
            borderBottom: '1px solid #edf2f7',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 12px 48px -8px, rgba(0, 0, 0, 0.06) 0px 6px 18px -6px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 28px -6px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
