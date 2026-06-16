'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSection {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface ActiveChip {
  label: string;
  onRemove: () => void;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterSection[];
  activeChips: ActiveChip[];
  onClearAll: () => void;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters,
  activeChips,
  onClearAll,
}: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: { xs: 2, md: 2.5 },
      }}
    >
      {/* Top row: search + dropdown filters */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {/* Search input */}
        <TextField
          size="small"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{
                      fontSize: 20,
                      color: '#8a91a3',
                      lineHeight: 1,
                    }}
                  >
                    search
                  </Box>
                </InputAdornment>
              ),
              endAdornment: searchValue ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange('')}
                    edge="end"
                    sx={{
                      p: 0.25,
                      color: '#8a91a3',
                      '&:hover': { color: '#1d2433' },
                    }}
                  >
                    <Box
                      component="span"
                      className="material-symbols-outlined"
                      sx={{ fontSize: 18, lineHeight: 1 }}
                    >
                      close
                    </Box>
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            minWidth: 280,
            flex: { xs: '1 1 100%', sm: '0 1 auto' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fc',
              border: '1px solid #e5e9f3',
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: '#d0d4e4',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                borderColor: '#4f46e5',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
          }}
        />

        {/* Filter dropdowns */}
        {filters.map((filter) => (
          <Select
            key={filter.label}
            size="small"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography
                    component="span"
                    sx={{ color: '#8a91a3', fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    {filter.label}
                  </Typography>
                );
              }
              const option = filter.options.find((o) => o.value === selected);
              return option?.label ?? selected;
            }}
            sx={{
              minWidth: 140,
              flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
              borderRadius: '12px',
              backgroundColor: '#f8f9fc',
              border: '1px solid #e5e9f3',
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: '#d0d4e4',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                borderColor: '#4f46e5',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          >
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        ))}
      </Box>

      {/* Active chips + clear all */}
      {activeChips.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          {activeChips.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              onDelete={chip.onRemove}
              deleteIcon={
                <Box
                  component="span"
                  className="material-symbols-outlined"
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    color: 'inherit',
                  }}
                >
                  close
                </Box>
              }
              sx={{
                borderRadius: '10px',
                px: '8px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                height: 32,
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                color: '#4f46e5',
                border: '1px solid rgba(79, 70, 229, 0.15)',
                '& .MuiChip-deleteIcon': {
                  fontSize: 16,
                  mr: '2px',
                  color: '#4f46e5',
                  opacity: 0.6,
                  '&:hover': { opacity: 1 },
                },
              }}
            />
          ))}

          {/* Clear all */}
          <Typography
            component="button"
            onClick={onClearAll}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              textUnderlineOffset: 2,
              '&:hover': { color: '#ef4444', textDecoration: 'underline' },
              px: 0.5,
              lineHeight: 1,
            }}
          >
            Clear all
          </Typography>
        </Box>
      )}
    </Box>
  );
}
