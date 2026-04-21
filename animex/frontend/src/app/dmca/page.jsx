export const metadata = { title: 'DMCA' };

export default function DmcaPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-display tracking-wide text-text-primary mb-2">DMCA Notice</h1>
      <p className="text-text-muted text-sm mb-10">Digital Millennium Copyright Act Policy</p>
      <div className="space-y-6 text-text-secondary text-sm leading-relaxed">
        <p>AnimeX respects the intellectual property rights of others. We do not host any video content on our servers. All video streams are sourced from third-party providers via API.</p>
        <p>If you believe that content accessible through our service infringes your copyright, please send a DMCA notice to our designated agent including:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>A description of the copyrighted work you believe has been infringed.</li>
          <li>The URL or location of the allegedly infringing material.</li>
          <li>Your contact information (name, address, phone, email).</li>
          <li>A statement that you have a good faith belief the use is not authorized.</li>
          <li>A statement that the information is accurate and you are the copyright owner or authorized to act on their behalf.</li>
          <li>Your physical or electronic signature.</li>
        </ul>
        <p>Please note that since we do not host video content, the appropriate party to contact is the actual hosting provider. We will cooperate with rights holders and remove links upon verified request.</p>
      </div>
    </div>
  );
}
