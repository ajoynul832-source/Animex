export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
      <h1 className="text-4xl font-display tracking-wide text-text-primary mb-2">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-10">Last updated: 2024</p>
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary text-sm leading-relaxed">
        {[
          ['1. Acceptance', 'By using AnimeX you agree to these terms. If you disagree, please do not use the service.'],
          ['2. Content', 'AnimeX does not host any video files. All content is sourced through third-party APIs. We are not responsible for the content of third-party sites.'],
          ['3. User Accounts', 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use.'],
          ['4. Prohibited Use', 'You may not use the service for any unlawful purpose, to distribute malware, to attempt unauthorized access to any system, or to harass other users.'],
          ['5. Disclaimer', 'The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.'],
          ['6. Changes', 'We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.'],
        ].map(([title, body]) => (
          <div key={title}>
            <h2 className="text-lg font-semibold text-text-primary mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
