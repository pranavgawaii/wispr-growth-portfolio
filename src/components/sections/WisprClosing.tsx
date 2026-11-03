import { useState } from 'react';

export function WisprClosing() {
  const [contactCopied, setContactCopied] = useState(false);
  const [contactError, setContactError] = useState(false);
  async function copyContact() {
    try {
      await navigator.clipboard.writeText('pranavgawai1518@gmail.com');
      setContactCopied(true);
      setContactError(false);
    } catch {
      setContactError(true);
    }
  }
  return (
    <section id="wispr-contact" className="wispr-closing" aria-labelledby="wispr-closing-title">
      <span className="wispr-closing-label">BUILT WITH WISPR IN MIND</span>
      <h2 id="wispr-closing-title">Let’s make voice an everyday habit.</h2>
      <p>I’d love to bring my building instinct to Wispr’s growth team.</p>
      <div className="wispr-closing-actions">
        <a
          href="https://x.com/messages/compose?recipient_id=1839921486536097793"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Start a conversation with Pranav on X"
        >
          Start a conversation
        </a>
        <button onClick={copyContact}>{contactCopied ? 'Email copied' : 'Copy my email'}</button>
      </div>
      <div className="wispr-closing-status" role="status">
        {contactError
          ? 'You can email me at pranavgawai1518@gmail.com.'
          : contactCopied
            ? 'pranavgawai1518@gmail.com. ready to paste.'
            : 'An independent portfolio for a growth opportunity at Wispr.'}
      </div>
    </section>
  );
}
