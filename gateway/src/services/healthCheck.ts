import axios from 'axios';

interface ServiceHealth {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime?: number;
  error?: string;
  timestamp: string;
}

const SERVICES = [
  { name: 'auth-service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001' },
  { name: 'dealer-service', url: process.env.DEALER_SERVICE_URL || 'http://localhost:3002' },
  { name: 'customer-service', url: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3003' },
  { name: 'manufacturer-service', url: process.env.MANUFACTURER_SERVICE_URL || 'http://localhost:3004' },
  { name: 'report-service', url: process.env.REPORT_SERVICE_URL || 'http://localhost:3005' },
  { name: 'notification-service', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006' },
];

export async function checkServiceHealth(serviceUrl: string): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    const healthEndpoint = `${serviceUrl}/health`;
    const response = await axios.get(healthEndpoint, {
      timeout: 5000, // 5 second timeout
    });
    
    const responseTime = Date.now() - start;
    
    return {
      name: '',
      url: serviceUrl,
      status: response.status === 200 ? 'healthy' : 'unhealthy',
      responseTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      name: '',
      url: serviceUrl,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function checkAllServices(): Promise<ServiceHealth[]> {
  const healthChecks = SERVICES.map(async (service) => {
    const health = await checkServiceHealth(service.url);
    return {
      ...health,
      name: service.name,
    };
  });

  return Promise.all(healthChecks);
}

export function getOverallHealth(services: ServiceHealth[]): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  healthyCount: number;
  totalCount: number;
} {
  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const totalCount = services.length;
  
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (healthyCount === totalCount) {
    status = 'healthy';
  } else if (healthyCount > 0) {
    status = 'degraded';
  } else {
    status = 'unhealthy';
  }

  return {
    status,
    healthyCount,
    totalCount,
  };
}
