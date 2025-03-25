import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram, Email, Phone, LocationOn } from '@mui/icons-material';

const ContactUs = () => {
  return (
    <Box>
      {/* Header Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '250px', sm: '350px', md: '400px' },
          backgroundImage: "url('/images/girl.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          flexDirection: 'column',
        }}
      >
        {/* Blended Contact Us Text */}
        <Typography
          variant="h3"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Contact Us
        </Typography>
        
        {/* Box inside header image */}
        <Box
          sx={{
            width: { xs: '90%', sm: '70%', md: '50%' },
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            position: 'absolute',
            bottom: '-50px',
          }}
        >
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Let’s talk about our website or course details. Send us a message and we will be in touch within one business day.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px 40px',
          backgroundColor: '#f5f5f5',
          gap: '40px',
        }}
      >
        {/* Left-Side: Fluencia Description Box */}
        <Box
          sx={{
            width: { xs: '90%', sm: '500px' },
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '25px',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            About Fluencia
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Fluencia is a leading language learning app that helps users master new languages with interactive lessons and AI-driven tools.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            <LocationOn sx={{ verticalAlign: 'middle', mr: 1, color: '#4c4c4c' }} />
            123 Language St, New York, NY 10001
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            <Phone sx={{ verticalAlign: 'middle', mr: 1, color: '#4c4c4c' }} />
            +1 (123) 456-7890
          </Typography>

          <Typography variant="body2">
            <Email sx={{ verticalAlign: 'middle', mr: 1, color: '#4c4c4c' }} />
            <Link href="mailto:support@fluencia.com" color="inherit" underline="none">
              support@fluencia.com
            </Link>
          </Typography>
        </Box>

        {/* Right-Side: Contact Info Box */}
        <Box
          sx={{
            width: { xs: '90%', sm: '500px' },
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '25px',
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            <Email sx={{ verticalAlign: 'middle', mr: 1, color: '#4c4c4c' }} />
            <Link href="mailto:contact@fluencia.com" color="inherit" underline="none">
              contact@fluencia.com
            </Link>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <Twitter sx={{ verticalAlign: 'middle', mr: 1, color: '#1DA1F2' }} />
            <Link href="#" color="inherit" underline="none">
              Twitter
            </Link>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <Facebook sx={{ verticalAlign: 'middle', mr: 1, color: '#1877F2' }} />
            <Link href="#" color="inherit" underline="none">
              Facebook
            </Link>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <LinkedIn sx={{ verticalAlign: 'middle', mr: 1, color: '#0077B5' }} />
            <Link href="#" color="inherit" underline="none">
              LinkedIn
            </Link>
          </Typography>

          <Typography variant="body1">
            <Instagram sx={{ verticalAlign: 'middle', mr: 1, color: '#E1306C' }} />
            <Link href="#" color="inherit" underline="none">
              Instagram
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
