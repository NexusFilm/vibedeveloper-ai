# Wireframe Generation Feature

## Overview
Users can now generate AI-powered wireframe previews of their app after completing the 5P framework. This gives them a visual representation of what their app will look like before they start building.

## How It Works

### 1. User Journey
1. User completes the 5P wizard (Person, Problem, Plan, Pivot, Payoff)
2. System generates the build prompt
3. User lands on ProjectResult page
4. User clicks "Generate Wireframe" button
5. AI analyzes the project data and creates a structured wireframe
6. Wireframe displays with responsive preview (desktop/tablet/mobile)

### 2. Technical Implementation

#### API Endpoint: `/api/generate-wireframe.js`
- **Method**: POST
- **Authentication**: Required (Supabase auth token)
- **Input**: 
  ```json
  {
    "projectId": "string",
    "authToken": "string"
  }
  ```
- **Output**:
  ```json
  {
    "success": true,
    "wireframe": {
      "appName": "string",
      "tagline": "string",
      "colorScheme": {
        "primary": "#13b6ec",
        "secondary": "#4c869a",
        "accent": "#0d181b"
      },
      "layout": {
        "header": {
          "logo": "string",
          "navigation": ["item1", "item2"]
        },
        "hero": {
          "headline": "string",
          "subheadline": "string",
          "cta": "string"
        },
        "sections": [
          {
            "title": "string",
            "type": "dashboard|form|list|grid|detail",
            "description": "string",
            "components": ["component1", "component2"]
          }
        ],
        "sidebar": {
          "items": ["item1", "item2"]
        }
      },
      "keyFeatures": [
        {
          "name": "string",
          "description": "string",
          "icon": "string"
        }
      ],
      "dataModels": [
        {
          "name": "string",
          "fields": ["field1", "field2"]
        }
      ]
    }
  }
  ```

#### AI Prompt Strategy
The system uses GPT-4o to generate wireframes based on:
- Industry context
- User role
- Problem description
- Solution approach
- Visual style preferences
- Tone preferences

The AI creates:
- App name and tagline
- Color scheme matching the brand
- Header/navigation structure
- Hero section with CTA
- 3-5 main content sections
- Key features list
- Data model structure

#### Database Schema
```sql
ALTER TABLE projects 
ADD COLUMN wireframe_data JSONB,
ADD COLUMN wireframe_generated_at TIMESTAMPTZ;
```

### 3. Components

#### WireframeViewer Component
**Location**: `src/components/WireframeViewer.jsx`

**Features**:
- Responsive preview modes (desktop, tablet, mobile)
- Dynamic color scheme from AI
- Structured layout display
- Key features showcase
- Data model visualization
- Matches PromptPath UI design system

**Props**:
```javascript
{
  wireframeData: {
    appName: string,
    tagline: string,
    colorScheme: object,
    layout: object,
    keyFeatures: array,
    dataModels: array
  }
}
```

#### ProjectResult Page Updates
**Location**: `src/pages/ProjectResult.jsx`

**New Features**:
- "Generate Wireframe" button
- Loading state during generation
- Toggle to show/hide wireframe
- Wireframe persists after generation
- Updated design system styling

## User Benefits

### 1. Visual Validation
- See what their app will look like before building
- Validate the concept with stakeholders
- Identify missing features early

### 2. Better Planning
- Understand data structure needs
- See feature organization
- Plan development phases

### 3. Confidence Building
- Tangible preview reduces uncertainty
- Professional wireframe for presentations
- Clear path from idea to implementation

### 4. Time Saving
- No need to sketch wireframes manually
- AI suggests optimal layouts
- Industry-specific recommendations

## Design System Integration

The wireframe viewer uses the PromptPath UI design system:
- Primary color: `#13b6ec`
- Lexend font family
- Soft rounded corners (12px)
- Consistent spacing and shadows
- Dark mode support
- Responsive breakpoints

## Future Enhancements

### Phase 2 (Potential)
- [ ] Export wireframe as PNG/PDF
- [ ] Edit wireframe sections
- [ ] Multiple wireframe variations
- [ ] Interactive prototype mode
- [ ] Share wireframe link
- [ ] Collaborate with team members

### Phase 3 (Potential)
- [ ] Generate actual HTML/CSS code
- [ ] Export to Figma
- [ ] Component library integration
- [ ] A/B test different layouts
- [ ] User flow diagrams

## Technical Notes

### Performance
- Wireframe generation takes 5-10 seconds
- Uses GPT-4o for high-quality output
- Cached in database (no regeneration needed)
- Lazy loading for large wireframes

### Error Handling
- Authentication validation
- Project ownership verification
- Graceful fallback if AI fails
- User-friendly error messages

### Security
- Requires valid auth token
- Project ownership check
- Service role key for Supabase
- CORS properly configured

## Testing Checklist

- [ ] Generate wireframe for new project
- [ ] View wireframe in all device modes
- [ ] Toggle show/hide wireframe
- [ ] Verify wireframe persists on page reload
- [ ] Test with different industries
- [ ] Test with different visual styles
- [ ] Verify color scheme generation
- [ ] Check responsive layout
- [ ] Test error handling
- [ ] Verify database storage

## Environment Variables Required

```env
OPENAI_API_KEY=sk-proj-...
VITE_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## API Usage

### Cost Estimation
- GPT-4o: ~$0.01-0.02 per wireframe
- Average tokens: 1000-1500 per generation
- Cached after first generation

### Rate Limiting
- No specific limits currently
- Consider adding per-user limits in production
- Monitor OpenAI usage dashboard

---

**Status**: ✅ Complete - Deployed to Production  
**Version**: 1.0  
**Date**: February 4, 2026
