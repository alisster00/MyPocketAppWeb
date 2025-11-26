import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button.jsx"

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops… la página que buscas no existe.
      </p>

      <Button
        variant="primary"
        onClick={() => navigate(-1)}
        className="mt-6"
        >
        <ArrowLeft size={20} />
        Volver
      </Button>
    </div>
  );
}
