import React from 'react';

interface EmailTemplateProps {
  subject: string;
  body: string;
  selectedTopic: string;
}

export const Web3FarmyardEmail: React.FC<EmailTemplateProps> = ({
  subject,
  body,
  selectedTopic,
}) => {
  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', fontFamily: 'Georgia, serif', margin: 0, padding: 0, minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Header/Domain */}
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#c8ff00', letterSpacing: '0.2em', marginBottom: '8px' }}>
          WEB3FARMYARD.COM
        </div>
        
        {/* Subject Heading */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.02em', margin: '0 0 24px', lineHeight: 1.2 }}>
          {subject}
        </h1>
        
        {/* Body Content */}
        <div style={{ fontSize: '15px', color: '#888', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
          {body}
        </div>
        
        {/* Read More Link */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #1a1a1a' }}>
          <a href="https://www.web3farmyard.com" style={{ fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#c8ff00', textDecoration: 'none', letterSpacing: '0.12em' }}>
            &nearr; READ MORE ON WEB3FARMYARD.COM
          </a>
        </div>
        
        {/* Footer / Subscription Info */}
        <div style={{ marginTop: '16px', fontFamily: "'Courier New', monospace", fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.1em' }}>
          You subscribed to {selectedTopic === "all" ? "all topics" : selectedTopic} updates.{' '}
          <a href="https://www.web3farmyard.com" style={{ color: '#2a2a2a' }}>
            Unsubscribe
          </a>
        </div>

      </div>
    </div>
  );
};

export default Web3FarmyardEmail;