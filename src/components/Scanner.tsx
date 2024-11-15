import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Camera, Barcode, Scan } from "lucide-react";
import { useScannerLogic } from "@/hooks/useScannerLogic";
import { WebcamScanner } from "./scanner/WebcamScanner";
import { PhysicalScanner } from "./scanner/PhysicalScanner";
import { ManualScanner } from "./scanner/ManualScanner";
import ScanHistory from "./scanner/ScanHistory";
import { supabase } from "@/integrations/supabase/client";

interface ScannerProps {
  scannerId: number;
}

const Scanner = ({ scannerId }: ScannerProps) => {
  const [useWebcam, setUseWebcam] = useState(false);
  const [usePhysicalScanner, setUsePhysicalScanner] = useState(false);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  
  const { handleScan } = useScannerLogic();

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasWebcamPermission(true);
      toast({
        title: "Webcam activée",
        description: `L'accès à la caméra a été autorisé pour le scanner ${scannerId}`,
      });
    } catch (error) {
      setHasWebcamPermission(false);
      toast({
        title: "Erreur d'accès à la webcam",
        description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur",
        variant: "destructive",
      });
      setUseWebcam(false);
    }
  };

  const switchMode = (mode: 'webcam' | 'physical' | 'manual') => {
    if (mode === 'webcam') {
      if (hasWebcamPermission === false) {
        toast({
          title: "Accès refusé",
          description: "L'accès à la caméra a été refusé. Veuillez vérifier les paramètres de votre navigateur.",
          variant: "destructive",
        });
        return;
      }
      if (hasWebcamPermission === null) {
        requestWebcamPermission();
      }
    }
    
    setUseWebcam(mode === 'webcam');
    setUsePhysicalScanner(mode === 'physical');
  };

  const onScan = async (code: string) => {
    try {
      const result = await handleScan(code);
      if (result) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id, 
            first_name, 
            last_name,
            synodes (
              name,
              color
            )
          `)
          .eq('id', code)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          const { error: attendanceError } = await supabase
            .from('attendances')
            .insert([{
              user_id: profile.id,
              type: result.type,
              duration: result.duration,
              timestamp: new Date().toISOString()
            }]);

          if (attendanceError) throw attendanceError;

          const event = new CustomEvent('scan', {
            detail: {
              scannerId,
              code,
              type: result.type,
              userName: `${profile.first_name} ${profile.last_name}`,
              synodeName: profile.synodes?.name
            }
          });
          window.dispatchEvent(event);

          toast({
            title: "Scan réussi",
            description: `${profile.first_name} ${profile.last_name} - ${result.type === 'entry' ? 'Entrée' : 'Sortie'}`,
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du scan:', error);
      toast({
        title: "Erreur de scan",
        description: "Une erreur est survenue lors de l'enregistrement du scan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {useWebcam && hasWebcamPermission ? (
          <WebcamScanner scannerId={scannerId} onScan={onScan} />
        ) : usePhysicalScanner ? (
          <PhysicalScanner scannerId={scannerId} onScan={onScan} />
        ) : (
          <ManualScanner onScan={onScan} />
        )}

        <div className="flex justify-center gap-4">
          <Button
            variant={useWebcam ? "default" : "outline"}
            onClick={() => switchMode('webcam')}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Webcam
          </Button>
          <Button
            variant={usePhysicalScanner ? "default" : "outline"}
            onClick={() => switchMode('physical')}
            className="flex-1"
          >
            <Barcode className="mr-2 h-4 w-4" />
            Scanner Physique
          </Button>
          <Button
            variant={(!useWebcam && !usePhysicalScanner) ? "default" : "outline"}
            onClick={() => switchMode('manual')}
            className="flex-1"
          >
            <Scan className="mr-2 h-4 w-4" />
            Manuel
          </Button>
        </div>

        <ScanHistory scannerId={scannerId} />
      </div>
    </div>
  );
};

export default Scanner;