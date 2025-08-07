import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const results: {
      timestamp: string;
      environment: string | undefined;
      platform: string;
      cwd: string;
      tests: Record<string, string>;
    } = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: process.platform,
      cwd: process.cwd(),
      tests: {}
    };

    // Test 1: Check if we can create directories
    try {
      const testDir = path.join(process.cwd(), 'public', 'test-uploads');
      await mkdir(testDir, { recursive: true });
      results.tests.directoryCreation = 'PASS';
    } catch (error) {
      results.tests.directoryCreation = `FAIL: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Test 2: Check if we can write files
    try {
      const testFile = path.join(process.cwd(), 'public', 'test-uploads', 'test.txt');
      await writeFile(testFile, 'Test file content');
      results.tests.fileWriting = 'PASS';
    } catch (error) {
      results.tests.fileWriting = `FAIL: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Test 3: Check uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profile');
      await mkdir(uploadsDir, { recursive: true });
      await access(uploadsDir, 2); // Check write permission
      results.tests.uploadsDirectory = 'PASS';
    } catch (error) {
      results.tests.uploadsDirectory = `FAIL: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Test 4: Check data directory
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await mkdir(dataDir, { recursive: true });
      await access(dataDir, 2); // Check write permission
      results.tests.dataDirectory = 'PASS';
    } catch (error) {
      results.tests.dataDirectory = `FAIL: ${error instanceof Error ? error.message : String(error)}`;
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 