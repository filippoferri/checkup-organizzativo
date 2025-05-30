import Login from "@/components/login";

export default function App() {
  // Usa uno stato/contesto/router per gestire il flusso tra step
  // Qui solo Login di esempio
  return (
    <main className="min-h-screen bg-[#EDE7E3] flex flex-col items-center justify-center">
      <Login />
      {/* <Preliminari /> */}
      {/* <Quiz /> */}
      {/* <Results /> */}
      {/* <AdminPanel /> */}
    </main>
  );
}
