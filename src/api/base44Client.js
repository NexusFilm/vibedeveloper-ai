import { supabaseHelpers } from './supabaseClient';

// Mock base44 client that uses Supabase instead
export const base44 = {
  auth: {
    me: async () => {
      return await supabaseHelpers.getCurrentUser();
    },
    logout: (redirectUrl) => {
      supabaseHelpers.signOut();
      if (redirectUrl) {
        window.location.href = '/';
      }
    },
    redirectToLogin: (returnUrl) => {
      window.location.href = '/';
    }
  },
  
  // Mock functions for compatibility
  functions: {
    invoke: async (functionName, payload) => {
      // Map function calls to Vercel API endpoints
      switch (functionName) {
        case 'createCheckout':
          const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          return { data };
        case 'generate-project':
          return await supabaseHelpers.generateProject(payload.prompt, payload);
        case 'invoke-llm':
          return await supabaseHelpers.invokeLLM(payload);
        default:
          console.warn(`Function ${functionName} not implemented`);
          return { success: false, error: 'Function not implemented' };
      }
    }
  },
  
  // Mock entities for database operations
  entities: {
    Project: {
      create: async (data) => {
        return await supabaseHelpers.createProject(data);
      },
      update: async (id, data) => {
        return await supabaseHelpers.updateProject(id, data);
      },
      list: async () => {
        const user = await supabaseHelpers.getCurrentUser();
        return await supabaseHelpers.getProjects({ user_id: user.id });
      },
      filter: async (filters) => {
        return await supabaseHelpers.getProjects(filters);
      }
    },
    ExampleProject: {
      list: async () => {
        try {
          return await supabaseHelpers.getExampleProjects();
        } catch (error) {
          // Return mock data if database doesn't have examples yet
          return [
            {
              id: 1,
              title: "E-commerce Store",
              description: "A modern online store with cart and checkout",
              category: "E-commerce",
              generated_prompt: "Build a modern e-commerce store with React and Stripe integration. Include product catalog, shopping cart, user authentication, and payment processing."
            },
            {
              id: 2,
              title: "Task Management App",
              description: "A productivity app for managing tasks and projects",
              category: "Productivity",
              generated_prompt: "Create a task management application with drag-and-drop functionality, team collaboration, due dates, and progress tracking."
            },
            {
              id: 3,
              title: "Blog Platform",
              description: "A content management system for bloggers",
              category: "Content",
              generated_prompt: "Build a blog platform with rich text editor, comment system, user profiles, and SEO optimization."
            }
          ];
        }
      }
    },
    Template: {
      list: async () => {
        try {
          return await supabaseHelpers.getTemplates();
        } catch (error) {
          // Return mock data if database doesn't have templates yet
          return [
            {
              id: 1,
              name: "SaaS Dashboard",
              description: "Complete SaaS application template with authentication, billing, and admin panel",
              category: "Business",
              preview_url: null,
              template_data: {}
            },
            {
              id: 2,
              name: "E-commerce Store",
              description: "Full-featured online store with product management and payment processing",
              category: "E-commerce",
              preview_url: null,
              template_data: {}
            },
            {
              id: 3,
              name: "Portfolio Website",
              description: "Professional portfolio template for designers and developers",
              category: "Portfolio",
              preview_url: null,
              template_data: {}
            }
          ];
        }
      }
    }
  },
  
  // Mock integrations
  integrations: {
    Core: {
      InvokeLLM: async (payload) => {
        return await supabaseHelpers.invokeLLM(payload);
      }
    }
  },
  
  // Mock app logs
  appLogs: {
    logUserInApp: async (pageName) => {
      console.log(`User visited page: ${pageName}`);
      // Could implement actual logging here if needed
      return true;
    }
  },
  
  // Mock data operations
  data: {
    get: async (table, filters = {}) => {
      console.warn(`Data.get for ${table} not fully implemented`);
      return [];
    },
    
    create: async (table, data) => {
      console.warn(`Data.create for ${table} not fully implemented`);
      return data;
    }
  }
};
