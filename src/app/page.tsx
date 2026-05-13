export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Navigator Widget
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Embeddable widget for AF beverage brands to showcase their Navigator listings
        </p>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Integration Instructions</h2>
          <div className="text-left">
            <p className="mb-4 text-gray-700">
              To embed this widget on your website, add the following code where you want the widget to appear:
            </p>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
              <code>
                {`<div id="navigator-widget"></div>
<script src="https://widget.afnavigator.com/embed.js?k=YOUR_API_KEY"></script>`}
              </code>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Replace <code className="bg-gray-100 px-1 rounded">YOUR_API_KEY</code> with the API key provided by Navigator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}