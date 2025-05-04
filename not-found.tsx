import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <Card className="w-full max-w-md mx-4 border-red-500">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">404 - Página No Encontrada</h1>
          </div>

          <p className="mt-4 text-sm text-gray-500 mb-6">
            La página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="flex justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
