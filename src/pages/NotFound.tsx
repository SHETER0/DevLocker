import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-medium mt-4 mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate("/")}>
        Go Back Home
      </Button>
    </div>
  );
}