export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div 
        className="min-h-screen overflow-x-hidden flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/auth-bg.png')"
        }}
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }