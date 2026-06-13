'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 6,
          px: 4,
        }}
      >
        {icon && (
          <Box
            component="span"
            className="material-symbols-outlined"
            sx={{
              fontSize: 48,
              color: '#535768',
              opacity: 0.4,
              mb: 2,
              lineHeight: 1,
            }}
          >
            {icon}
          </Box>
        )}

        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: '#333333',
            mb: description ? 1 : 0,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              fontSize: 14,
              color: '#535768',
              maxWidth: 360,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            sx={{ mt: 3 }}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
