import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h5 className="text-2xl font-bold">404 - Page Not Found</h5>
      <p className="text-muted-foreground mb-8 text-center mt-3">
        But we found your semicolon. ;
      </p>
      <Button onClick={() => navigate("/")}>Go Back Home</Button>
    </div>
  );
}