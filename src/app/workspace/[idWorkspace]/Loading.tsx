const Loading: React.FC = () => {
  return (
    <main className="relative  h-screen w-full inset-0 flex flex-col gap-3 items-center justify-center bg-black">
        <div className=" animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
        <span>Carregando</span>
    </main>
  );
};

export default Loading;
