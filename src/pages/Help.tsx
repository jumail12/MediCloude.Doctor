import { 
    Box, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails,
    Button,
    Divider,
  } from "@mui/material";
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import EmailIcon from '@mui/icons-material/Email';
  import SupportAgentIcon from '@mui/icons-material/SupportAgent';

  
  const Help = () => {
    const faqs = [
      {
        question: "How do I manage my availability?",
        answer: "Navigate to 'My Schedule' to set your working hours and block unavailable dates."
      },
      {
        question: "How do I write prescriptions?",
        answer: "After completing a consultation, you'll find a 'Create Prescription' button in the appointment details."
      },
      {
        question: "Can I conduct video consultations?",
        answer: "Yes! Click the 'Start Video Call' button when an online appointment begins."
      },
      {
        question: "How do I view my earnings?",
        answer: "Your dashboard displays current earnings, and detailed reports are available under 'Financials'."
      },
      {
        question: "What if I need to cancel an appointment?",
        answer: "You can cancel appointments from your schedule, but please provide at least 24 hours notice when possible."
      }
    ];
  
    return (
      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 3,
        backgroundColor: '#f9f9f9',
        borderRadius: 2
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          mb: 3,
          color: '#3CBDED'
        }}>
          Doctor Help Center
        </Typography>
  

  
        {/* FAQ Section */}
        <Typography variant="h5" sx={{ 
          fontWeight: 600, 
          mb: 2,
          color: '#2D9596'
        }}>
          Frequently Asked Questions
        </Typography>
        
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
  
        <Divider sx={{ my: 4 }} />
  
        {/* Support Section */}
        <Box sx={{ textAlign: 'center' }}>
          <SupportAgentIcon sx={{ fontSize: 50, color: '#3CBDED', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Need more help?
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Our support team is available 24/7 to assist you
          </Typography>
          
          <Button 
            variant="contained" 
            startIcon={<EmailIcon />}
            sx={{
              backgroundColor: '#3CBDED',
              '&:hover': { backgroundColor: '#2CA8D8' }
            }}
            href="mailto:support@medicloude.com"
          >
            Contact Support
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default Help;