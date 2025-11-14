#!/usr/bin/env node

/**
 * Health Check Script for DQA Platform
 * Checks the health of all services and reports their status
 */

const http = require('http');
const https = require('https');

const services = [
  {
    name: 'Main API',
    url: 'http://localhost:8000/health',
    critical: true
  },
  {
    name: 'User Service',
    url: 'http://localhost:8001/health',
    critical: true
  },
  {
    name: 'Auth Service',
    url: 'http://localhost:8002/health',
    critical: true
  },
  {
    name: 'Data Service',
    url: 'http://localhost:8003/health',
    critical: true
  },
  {
    name: 'Frontend',
    url: 'http://localhost:5173',
    critical: true
  }
];

function checkService(service) {
  return new Promise((resolve) => {
    const url = new URL(service.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const startTime = Date.now();
    
    const request = client.get(service.url, (response) => {
      const responseTime = Date.now() - startTime;
      const isHealthy = response.statusCode >= 200 && response.statusCode < 300;
      
      resolve({
        name: service.name,
        url: service.url,
        status: isHealthy ? 'healthy' : 'unhealthy',
        statusCode: response.statusCode,
        responseTime,
        critical: service.critical
      });
    });
    
    request.on('error', (error) => {
      resolve({
        name: service.name,
        url: service.url,
        status: 'error',
        error: error.message,
        responseTime: Date.now() - startTime,
        critical: service.critical
      });
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        name: service.name,
        url: service.url,
        status: 'timeout',
        responseTime: Date.now() - startTime,
        critical: service.critical
      });
    });
  });
}

async function runHealthCheck() {
  console.log('🏥 DQA Platform Health Check\n');
  console.log('Checking services...\n');
  
  const results = await Promise.all(services.map(checkService));
  
  let allHealthy = true;
  let criticalDown = false;
  
  results.forEach(result => {
    const icon = result.status === 'healthy' ? '✅' : '❌';
    const critical = result.critical ? ' (Critical)' : '';
    
    console.log(`${icon} ${result.name}${critical}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Status: ${result.status}`);
    
    if (result.statusCode) {
      console.log(`   HTTP Status: ${result.statusCode}`);
    }
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    console.log(`   Response Time: ${result.responseTime}ms`);
    console.log('');
    
    if (result.status !== 'healthy') {
      allHealthy = false;
      if (result.critical) {
        criticalDown = true;
      }
    }
  });
  
  console.log('📊 Summary:');
  console.log(`   Total Services: ${services.length}`);
  console.log(`   Healthy: ${results.filter(r => r.status === 'healthy').length}`);
  console.log(`   Unhealthy: ${results.filter(r => r.status !== 'healthy').length}`);
  
  if (allHealthy) {
    console.log('\n🎉 All services are healthy!');
    process.exit(0);
  } else if (criticalDown) {
    console.log('\n🚨 Critical services are down!');
    process.exit(1);
  } else {
    console.log('\n⚠️  Some non-critical services are down.');
    process.exit(0);
  }
}

if (require.main === module) {
  runHealthCheck().catch(error => {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runHealthCheck, checkService };