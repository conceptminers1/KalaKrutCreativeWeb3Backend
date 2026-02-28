import React from 'react';

const SupportRequestsExamplesTable: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Support Requests Examples</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Example 1</td>
            <td className="px-6 py-4 whitespace-nowrap">This is an example of a support request.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SupportRequestsExamplesTable;