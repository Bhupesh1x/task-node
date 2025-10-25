interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
