import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Award, Download, Printer, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CertificateData {
  id: string;
  internName: string;
  domain: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  certificateId: string;
  description: string;
}

const CertificateGenerator = () => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    internName: '',
    domain: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const generateCertificateId = () => {
    const prefix = 'OJAS';
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${random}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const saveCertificate = () => {
    if (!formData.internName || !formData.domain || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const certificateData: CertificateData = {
      id: Date.now().toString(),
      ...formData,
      issueDate: new Date().toISOString(),
      certificateId: generateCertificateId(),
    };

    const existing = JSON.parse(localStorage.getItem('ojas_certificates') || '[]');
    localStorage.setItem('ojas_certificates', JSON.stringify([...existing, certificateData]));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ojas-Certificate-${formData.internName || 'Intern'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    setIsGenerating(false);
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-offwhite mb-2">
            Certificate Generator
          </h1>
          <p className="text-offwhite/60">Generate certificates for your interns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-offwhite mb-4">
            Intern Details
          </h2>

          <div>
            <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
              Intern Name *
            </label>
            <Input
              value={formData.internName}
              onChange={(e) => handleInputChange('internName', e.target.value)}
              placeholder="e.g., John Doe"
              className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
              Domain/Department *
            </label>
            <Input
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              placeholder="e.g., Web Development, Digital Marketing"
              className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                Start Date *
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                End Date *
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="bg-charcoal/50 border-white/10 text-offwhite focus:border-saffron focus:ring-saffron/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
              Description (Optional)
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional details about the internship..."
              rows={3}
              className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={saveCertificate}
              className="btn-primary flex items-center gap-2"
            >
              {isSaved ? <Check size={16} /> : <Save size={16} />}
              {isSaved ? 'Saved!' : 'Save Certificate'}
            </Button>
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              variant="outline"
              className="border-white/20 text-offwhite hover:bg-white/10 flex items-center gap-2"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-offwhite/30 border-t-offwhite rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download PDF
            </Button>
            <Button
              onClick={printCertificate}
              variant="outline"
              className="border-white/20 text-offwhite hover:bg-white/10 flex items-center gap-2"
            >
              <Printer size={16} />
              Print
            </Button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-lg text-offwhite">
            Preview
          </h2>
          
          <div className="overflow-auto">
            <div
              ref={certificateRef}
              className="certificate-preview bg-white w-[800px] h-[566px] relative mx-auto"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 0 40px rgba(0,0,0,0.1)',
              }}
            >
              {/* Certificate Border */}
              <div className="absolute inset-4 border-4 border-double border-saffron/30" />
              <div className="absolute inset-6 border border-saffron/20" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center px-16 py-12 text-center">
                {/* Header */}
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-saffron to-orange-400 flex items-center justify-center">
                    <Award size={40} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-display font-bold text-charcoal tracking-wide">
                    OJAS
                  </h1>
                  <p className="text-sm text-gray-500 uppercase tracking-[0.3em] mt-1">
                    Advertisement & Software Studio
                  </p>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-display font-bold text-saffron mb-2">
                  CERTIFICATE OF INTERNSHIP
                </h2>
                <div className="w-24 h-1 bg-saffron mx-auto mb-6" />

                {/* Body */}
                <p className="text-gray-600 text-lg mb-4">
                  This is to certify that
                </p>
                <h3 className="text-3xl font-display font-bold text-charcoal mb-4">
                  {formData.internName || 'Intern Name'}
                </h3>
                <p className="text-gray-600 text-base max-w-lg mb-4">
                  has successfully completed the internship program in{' '}
                  <span className="font-semibold text-charcoal">
                    {formData.domain || 'Domain'}
                  </span>{' '}
                  from{' '}
                  <span className="font-semibold text-charcoal">
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Start Date'}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-charcoal">
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'End Date'}
                  </span>
                  .
                </p>

                {formData.description && (
                  <p className="text-gray-500 text-sm max-w-md mb-6 italic">
                    "{formData.description}"
                  </p>
                )}

                {/* Footer */}
                <div className="mt-auto w-full flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Certificate ID</p>
                    <p className="text-sm font-mono text-charcoal">
                      {generateCertificateId()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-px bg-gray-300 mb-2" />
                    <p className="text-sm text-charcoal font-semibold">Authorized Signature</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Date of Issue</p>
                    <p className="text-sm text-charcoal">
                      {new Date().toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
                style={{ transform: 'rotate(-30deg)' }}
              >
                <span className="text-8xl font-display font-bold text-charcoal">OJAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-preview,
          .certificate-preview * {
            visibility: visible;
          }
          .certificate-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificateGenerator;
