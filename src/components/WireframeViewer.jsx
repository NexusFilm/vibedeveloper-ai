import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Monitor, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function WireframeViewer({ wireframes }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (pageName, index) => {
    setExporting(true);
    try {
      const element = document.getElementById(`wireframe-${index}`);
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `${pageName.replace(/\s+/g, '_')}_wireframe.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export wireframe. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (!wireframes || wireframes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400 text-sm">No wireframes generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${wireframes.length}, 1fr)` }}>
          {wireframes.map((wf, idx) => (
            <TabsTrigger key={idx} value={idx.toString()}>
              {wf.page_name}
            </TabsTrigger>
          ))}
        </TabsList>
        {wireframes.map((wf, idx) => (
          <TabsContent key={idx} value={idx.toString()}>
            <Card className="bg-white shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{wf.page_name}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExport(wf.page_name, idx)}
                  disabled={exporting}
                  className="h-7 text-xs"
                >
                  {exporting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </>
                  )}
                </Button>
              </div>
              <div className="p-6">
                <div 
                  id={`wireframe-${idx}`}
                  className="border-2 border-gray-300 rounded-lg bg-white shadow-inner"
                  dangerouslySetInnerHTML={{ __html: wf.html_code }}
                  style={{
                    minHeight: '600px',
                    transform: 'scale(0.85)',
                    transformOrigin: 'top left',
                    width: '118%'
                  }}
                />
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}