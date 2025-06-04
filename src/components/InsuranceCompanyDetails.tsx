
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsuranceCompanyDetailsProps {
  name: string;
  logo: string;
  whatsapp?: string;
  phone: string[];
  phoneLabels?: string[];
  isOpen: boolean;
  onClose: () => void;
}

const InsuranceCompanyDetails: React.FC<InsuranceCompanyDetailsProps> = ({
  name,
  logo,
  whatsapp,
  phone,
  phoneLabels,
  isOpen,
  onClose,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    // Reset image load state when dialog opens
    if (isOpen) {
      setImageLoaded(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-center h-12 relative">
          {!imageLoaded && <Skeleton className="h-12 w-32 absolute" />}
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className={`h-12 object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              setImageLoaded(true);
            }}
          />
        </DialogHeader>
        <div className="py-4 space-y-4">
          {whatsapp && (
            <div className="flex items-center space-x-3">
              <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5" />
              <a 
                href={whatsapp.startsWith("wa.me") ? `https://${whatsapp}` : whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                {whatsapp}
              </a>
            </div>
          )}
          
          <div className="space-y-2">
            {phone.map((phoneNumber, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#D72009]" />
                <div>
                  <span className="text-gray-700">{phoneNumber}</span>
                  {phoneLabels && phoneLabels[index] && (
                    <span className="text-sm text-gray-500 ml-2">({phoneLabels[index]})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsuranceCompanyDetails;
