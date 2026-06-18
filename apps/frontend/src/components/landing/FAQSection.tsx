'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const faqs = [
  {
    question: 'Bagaimana sistem tracking bekerja?',
    answer:
      'Setiap transaksi akan mendapatkan QR Code unik. Pelanggan cukup scan atau masukkan nomor plat di halaman tracking publik untuk melihat status berkas mereka secara real-time.',
  },
  {
    question: 'Apakah data bisnis saya aman?',
    answer:
      'Kami menggunakan enkripsi tingkat perbankan dan backup rutin harian. Data Anda adalah milik Anda sepenuhnya dan tidak akan dibagikan ke pihak ketiga.',
  },
  {
    question: 'Bagaimana cara notifikasi WhatsApp terkirim?',
    answer:
      'SatuJasa terintegrasi dengan gateway WhatsApp resmi. Sistem akan mengirim pesan otomatis saat status berubah (misal: Selesai) atau saat ada tagihan baru.',
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box component="section" sx={{ bgcolor: '#f5f6f8', py: { xs: 8, md: 12 } }} id="faq">
      <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em', mb: 2 }}>
            Pertanyaan Umum
          </Typography>
          <Typography sx={{ color: '#535768', fontSize: 16, lineHeight: 1.7, maxWidth: 600, mx: 'auto' }}>
            Temukan jawaban untuk pertanyaan seputar SatuJasa, keamanan data, dan integrasi dengan sistem Anda.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {faqs.map((faq, i) => (
            <Accordion
              key={faq.question}
              expanded={expanded === `panel${i}`}
              onChange={handleChange(`panel${i}`)}
              sx={{
                borderRadius: '0.75rem !important',
                border: '1px solid',
                borderColor: '#d0d4e4',
                boxShadow: 'none',
                bgcolor: '#ffffff',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 },
                transition: 'all 0.2s ease',
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box component="span" className="material-symbols-outlined" sx={{ fontSize: 20 }}>
                    expand_more
                  </Box>
                }
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#333333',
                  py: 2,
                  '&.Mui-expanded': { borderBottom: '1px solid', borderColor: '#d0d4e4', color: '#6161ff' },
                }}
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails sx={{ color: '#535768', fontSize: 14, lineHeight: 1.8, py: 2 }}>
                {faq.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
