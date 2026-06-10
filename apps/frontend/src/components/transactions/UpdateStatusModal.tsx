'use client';

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import type { TransactionStatus, UpdateStatusPayload } from '@/types/transaction';
import { getNextStatuses, STATUS_LABELS } from '@/lib/stateMachine';

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateStatusPayload) => void;
  currentStatus: TransactionStatus;
  isPending?: boolean;
}

export default function UpdateStatusModal({
  open,
  onClose,
  onSubmit,
  currentStatus,
  isPending = false,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | ''>('');
  const [notes, setNotes] = useState('');

  const nextStatuses = getNextStatuses(currentStatus);

  function handleSubmit() {
    if (!selectedStatus) return;
    onSubmit({ status: selectedStatus, notes: notes.trim() || undefined });
  }

  function handleClose() {
    setSelectedStatus('');
    setNotes('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Status Transaksi</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Status saat ini: <strong>{STATUS_LABELS[currentStatus]}</strong>
        </Typography>

        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
          <InputLabel>Status Baru</InputLabel>
          <Select
            value={selectedStatus}
            label="Status Baru"
            onChange={(e) => setSelectedStatus(e.target.value as TransactionStatus)}
          >
            {nextStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Catatan (opsional)"
          multiline
          rows={3}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Batal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedStatus || isPending}
        >
          {isPending ? 'Menyimpan...' : 'Konfirmasi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
