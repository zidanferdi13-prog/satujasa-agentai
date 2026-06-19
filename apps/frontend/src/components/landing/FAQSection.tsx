'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const faqs = [
  {
    question: 'Apakah pelanggan perlu login untuk melihat status?',
    answer:
      'Tidak. Pelanggan cukup membuka link tracking publik untuk melihat progres berkas berdasarkan data transaksi yang sudah dibuat admin.',
  },
  {
    question: 'Apakah bisa dipakai untuk beberapa cabang?',
    answer:
      'Bisa. Paket multi-cabang membantu owner melihat tenant, admin, transaksi, dan laporan per lokasi dari satu dashboard.',
  },
  {
    question: 'Apakah cocok untuk biro jasa kecil?',
    answer:
      'Cocok. Anda bisa mulai dari paket kecil untuk merapikan input transaksi dan tracking pelanggan, lalu naik paket saat cabang bertambah.',
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box component="section" sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }} id="faq">
      <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6161ff', mb: 1.5 }}>
            FAQ
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 2, color: '#1d2433' }}>
            Pertanyaan umum
          </Typography>
          <Typography sx={{ color: '#535768', fontSize: 16, lineHeight: 1.7, maxWidth: 600, mx: 'auto' }}>
            Jawaban singkat untuk hal yang biasanya ditanyakan owner sebelum mulai merapikan operasional.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {faqs.map((faq, i) => (
            <Accordion
              key={faq.question}
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
              sx={{
                borderRadius: '1.5rem !important',
                border: '1px solid rgba(208, 212, 228, 0.72)',
                boxShadow: '0 12px 34px rgba(43, 50, 91, 0.05)',
                bgcolor: '#ffffff',
                overflow: 'hidden',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0, borderColor: 'rgba(97, 97, 255, 0.32)' },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20, color: '#6161ff' }}>
                    expand_more
                  </Box>
                }
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: '#1d2433',
                  py: 1.7,
                  '&.Mui-expanded': { color: '#6161ff' },
                }}
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails sx={{ color: '#535768', fontSize: 14, lineHeight: 1.8, pt: 0, pb: 2.5 }}>
                {faq.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
