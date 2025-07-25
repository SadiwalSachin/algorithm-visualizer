export default function VerifyPendingPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">📧 Verify Your Email</h2>
          <p className="text-gray-700">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            After verification, you can log in.
          </p>
        </div>
      </div>
    );
  }
  