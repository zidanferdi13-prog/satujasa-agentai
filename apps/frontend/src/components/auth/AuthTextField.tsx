import TextField, { type TextFieldProps } from '@mui/material/TextField';

export default function AuthTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      variant="filled"
      slotProps={{
        input: {
          disableUnderline: true,
        },
      }}
      sx={{
        '& .MuiFilledInput-root': {
          borderRadius: '18px',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-outline-variant)',
          color: 'var(--color-on-surface)',
          overflow: 'hidden',
          transition: 'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
          '&:hover': {
            backgroundColor: 'var(--color-surface-container-low)',
            borderColor: 'var(--color-primary)',
          },
          '&.Mui-focused': {
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderColor: 'var(--color-primary)',
            boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-primary) 14%, transparent)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--color-on-surface-variant)',
          fontWeight: 700,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--color-primary)',
        },
        '& .MuiFilledInput-input': {
          paddingTop: '24px',
          paddingBottom: '10px',
        },
        mb: 2,
      }}
    />
  );
}
