'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    // Explicitly type `results` as `any` so that we can dynamically assign
    // arbitrary properties on the `tests` object without TypeScript errors.
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Portfolio API
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          results.tests.portfolioApi = {
            status: 'PASS',
            dataKeys: Object.keys(data),
            hasSkills: !!data.skills,
            skillsStructure: data.skills ? Object.keys(data.skills) : null
          };
        } else {
          results.tests.portfolioApi = {
            status: 'FAIL',
            error: response.statusText
          };
        }
      } catch (error) {
        results.tests.portfolioApi = {
          status: 'FAIL',
          error: error instanceof Error ? error.message : String(error)
        };
      }

      // Test 2: Test Environment API
      try {
        const response = await fetch('/api/test-env');
        if (response.ok) {
          const data = await response.json();
          results.tests.testEnvApi = {
            status: 'PASS',
            environment: data.environment,
            tests: data.tests
          };
        } else {
          results.tests.testEnvApi = {
            status: 'FAIL',
            error: response.statusText
          };
        }
      } catch (error) {
        results.tests.testEnvApi = {
          status: 'FAIL',
          error: error instanceof Error ? error.message : String(error)
        };
      }

      // Test 3: Profile Picture Upload API (just check if endpoint exists)
      try {
        const response = await fetch('/api/profile-picture-upload', { method: 'OPTIONS' });
        results.tests.profilePictureApi = {
          status: response.ok ? 'PASS' : 'FAIL',
          statusCode: response.status
        };
      } catch (error) {
        results.tests.profilePictureApi = {
          status: 'FAIL',
          error: error instanceof Error ? error.message : String(error)
        };
      }

      // Test 4: Project Image Upload API (just check if endpoint exists)
      try {
        const response = await fetch('/api/project-image-upload', { method: 'OPTIONS' });
        results.tests.projectImageApi = {
          status: response.ok ? 'PASS' : 'FAIL',
          statusCode: response.status
        };
      } catch (error) {
        results.tests.projectImageApi = {
          status: 'FAIL',
          error: error instanceof Error ? error.message : String(error)
        };
      }

    } catch (error) {
      results.error = error instanceof Error ? error.message : String(error);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Portfolio System Test Page
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {loading ? 'Running Tests...' : 'Run System Tests'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Test Results
              </h2>
              
              <div className="grid gap-4">
                {Object.entries(testResults.tests).map(([testName, result]: [string, any]) => (
                  <div key={testName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.status === 'PASS' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {result.status}
                    </div>
                    
                    {result.error && (
                      <p className="text-red-600 dark:text-red-400 mt-2">
                        Error: {result.error}
                      </p>
                    )}
                    
                    {result.dataKeys && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Data Keys: {result.dataKeys.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {result.skillsStructure && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Skills Structure: {result.skillsStructure.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Test Summary
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Timestamp: {testResults.timestamp}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tests: {Object.keys(testResults.tests).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Passed: {Object.values(testResults.tests).filter((r: any) => r.status === 'PASS').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Failed: {Object.values(testResults.tests).filter((r: any) => r.status === 'FAIL').length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 