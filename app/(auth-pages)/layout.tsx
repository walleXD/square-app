export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='justify-center items-center flex flex-col flex-grow'>
      {children}
    </div>
  );
}
