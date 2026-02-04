import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, setTenantContext, getTenantByDomain, supabaseHelpers } from '../api/supabaseClient';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeTenant = async () => {
      try {
        // Get tenant from domain/subdomain
        const hostname = window.location.hostname;
        let tenantSlug = 'vibedeveloper'; // default
        
        // Check if it's a subdomain
        if (hostname.includes('.')) {
          const parts = hostname.split('.');
          if (parts.length > 2) {
            tenantSlug = parts[0]; // subdomain
          }
        }
        
        // For development, check for specific domains
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          // Check URL path or query params for tenant
          const urlParams = new URLSearchParams(window.location.search);
          tenantSlug = urlParams.get('tenant') || 'vibedeveloper';
        }

        // Get tenant data from API with error handling
        try {
          const response = await fetch(`/api/tenant-info?slug=${tenantSlug}`);
          
          if (response.ok) {
            const { tenant: tenantData } = await response.json();
            
            // Set tenant context
            setTenantContext(tenantData.id);
            setTenant(tenantData);
          } else {
            throw new Error(`Tenant API error: ${response.status}`);
          }
        } catch (apiError) {
          console.warn('Tenant API failed, falling back to default:', apiError);
          
          // Fallback to default tenant data
          const fallbackTenant = {
            id: 'eabc44ea-c919-40b2-9d1f-e0923d7d1db7', // VibeDeveloper tenant ID
            name: 'VibeDeveloper AI',
            slug: 'vibedeveloper',
            settings: { theme: 'developer' }
          };
          
          setTenantContext(fallbackTenant.id);
          setTenant(fallbackTenant);
        }
      } catch (err) {
        console.error('Failed to initialize tenant:', err);
        setError(err.message);
        
        // Final fallback
        const fallbackTenant = {
          id: 'eabc44ea-c919-40b2-9d1f-e0923d7d1db7',
          name: 'VibeDeveloper AI',
          slug: 'vibedeveloper',
          settings: { theme: 'developer' }
        };
        
        setTenantContext(fallbackTenant.id);
        setTenant(fallbackTenant);
      } finally {
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeTenant();
    } else {
      // Server-side fallback
      const fallbackTenant = {
        id: 'eabc44ea-c919-40b2-9d1f-e0923d7d1db7',
        name: 'VibeDeveloper AI',
        slug: 'vibedeveloper',
        settings: { theme: 'developer' }
      };
      
      setTenant(fallbackTenant);
      setLoading(false);
    }
  }, []);

  const switchTenant = async (tenantId) => {
    try {
      setLoading(true);
      setTenantContext(tenantId);
      
      // Get tenant data by ID
      const response = await fetch(`/api/tenant-info?id=${tenantId}`);
      if (response.ok) {
        const { tenant: tenantData } = await response.json();
        setTenant(tenantData);
      } else {
        throw new Error('Failed to fetch tenant data');
      }
    } catch (err) {
      console.error('Failed to switch tenant:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tenant,
    loading,
    error,
    switchTenant,
    isVibeDeveloper: tenant?.slug === 'vibedeveloper',
    isAiEdu: tenant?.slug === 'aiedu'
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};