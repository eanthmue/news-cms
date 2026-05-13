'use client';

import React from 'react';

/**
 * A sample component to demonstrate the Vertical Slice Architecture.
 * This component belongs to the 'sample' feature slice.
 */
export function SampleFeatureComponent() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      <h3 className="font-bold text-blue-800 dark:text-blue-200">Sample Feature</h3>
      <p className="text-sm text-blue-600 dark:text-blue-400">
        This component is located in /features/sample/components.
      </p>
    </div>
  );
}
