-- Add wireframe columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS wireframe_data JSONB,
ADD COLUMN IF NOT EXISTS wireframe_generated_at TIMESTAMPTZ;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_wireframe_generated 
ON projects(wireframe_generated_at) 
WHERE wireframe_generated_at IS NOT NULL;

-- Add comment
COMMENT ON COLUMN projects.wireframe_data IS 'AI-generated wireframe structure in JSON format';
COMMENT ON COLUMN projects.wireframe_generated_at IS 'Timestamp when wireframe was generated';
