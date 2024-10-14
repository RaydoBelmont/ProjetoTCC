"use client";

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-start p-24  bg-opacity-50 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/GAES2.png')" }}
    >
      <div className="flex flex-col items-center justify-center relative w-full text-white text-center">
        <img src="/images/LOGO2.png" alt="Logo" className="object-contain" />
        <h1 className="text-4xl font-bold mt-8">
          GAES - Gerenciamento Avançado de Equipes de Suporte
        </h1>
        <p>Organiza, planeje, acompanhe e monitore suas tarefas.</p>
      </div>
      <div className="absolute inset-0 bg-cover bg-center opacity-50" />
    </main>
  );
}
