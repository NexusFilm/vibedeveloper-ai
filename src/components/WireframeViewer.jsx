import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

export default function WireframeViewer({ wireframeData }) {
  const [viewMode, setViewMode] = React.useState('desktop'); // desktop, tablet, mobile

  if (!wireframeData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No wireframe data available
      </div>
    );
  }

  const colorScheme = wireframeData.colorScheme || {
    primary: '#13b6ec',
    secondary: '#4c869a',
    accent: '#0d181b'
  };

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('desktop')}
          className={`p-2 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-accent/10'}`}
        >
          <Monitor className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('tablet')}
          className={`p-2 rounded-xl transition-all ${viewMode === 'tablet' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-accent/10'}`}
        >
          <Tablet className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`p-2 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-accent/10'}`}
        >
          <Smartphone className="h-5 w-5" />
        </button>
      </div>

      {/* Wireframe Preview */}
      <div className={`mx-auto bg-card rounded-2xl shadow-2xl border-4 border-border overflow-hidden transition-all ${
        viewMode === 'desktop' ? 'max-w-6xl' : viewMode === 'tablet' ? 'max-w-3xl' : 'max-w-sm'
      }`}>
        {/* Header */}
        <div className="bg-card border-b-2 border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: colorScheme.primary }}
              >
                {wireframeData.appName?.charAt(0) || 'A'}
              </div>
              <span className="font-semibold text-foreground">{wireframeData.appName}</span>
            </div>
            <div className="flex gap-4">
              {wireframeData.layout?.header?.navigation?.map((item, idx) => (
                <div key={idx} className="px-3 py-1 bg-accent/10 rounded-lg text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {wireframeData.layout?.hero && (
          <div 
            className="p-12 text-center border-b-2 border-border"
            style={{ 
              background: `linear-gradient(135deg, ${colorScheme.primary}15, ${colorScheme.secondary}15)` 
            }}
          >
            <h1 className="text-3xl font-semibold text-foreground mb-3">
              {wireframeData.layout.hero.headline}
            </h1>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {wireframeData.layout.hero.subheadline}
            </p>
            <div 
              className="inline-block px-6 py-3 text-white rounded-xl font-medium shadow-sm"
              style={{ backgroundColor: colorScheme.primary }}
            >
              {wireframeData.layout.hero.cta}
            </div>
          </div>
        )}

        {/* Main Content Sections */}
        <div className="p-6 space-y-6">
          {wireframeData.layout?.sections?.map((section, idx) => (
            <Card key={idx} className="border-2 border-border">
              <CardHeader className="bg-accent/5">
                <CardTitle className="text-lg flex items-center justify-between">
                  {section.title}
                  <Badge variant="outline">{section.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {section.components?.map((component, cIdx) => (
                    <div key={cIdx} className="p-3 bg-accent/5 rounded-xl border border-border text-sm text-foreground">
                      {component}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar (if exists) */}
        {wireframeData.layout?.sidebar && (
          <div className="border-t-2 border-border bg-accent/5 p-4">
            <div className="font-semibold text-foreground mb-3">Quick Access</div>
            <div className="space-y-2">
              {wireframeData.layout.sidebar.items?.map((item, idx) => (
                <div key={idx} className="p-2 bg-card rounded-lg border border-border text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Features */}
      {wireframeData.keyFeatures && wireframeData.keyFeatures.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {wireframeData.keyFeatures.map((feature, idx) => (
              <Card key={idx} className="border border-border">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{feature.icon || '⭐'}</div>
                  <h4 className="font-semibold text-foreground mb-2">{feature.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Data Models */}
      {wireframeData.dataModels && wireframeData.dataModels.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Data Structure</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {wireframeData.dataModels.map((model, idx) => (
              <Card key={idx} className="border border-border">
                <CardHeader>
                  <CardTitle className="text-base">{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {model.fields?.map((field, fIdx) => (
                      <div key={fIdx} className="text-sm text-muted-foreground font-mono">
                        • {field}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
