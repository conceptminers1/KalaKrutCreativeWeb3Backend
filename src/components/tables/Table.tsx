
import React from 'react';

const Table = ({ children, className }) => <table className={`min-w-full divide-y divide-kala-700 ${className || ''}`}>{children}</table>;
const TableHeader = ({ children, className }) => <thead className={`bg-kala-900/50 ${className || ''}`}>{children}</thead>;
const TableBody = ({ children, className }) => <tbody className={`bg-kala-800 divide-y divide-kala-700 ${className || ''}`}>{children}</tbody>;
const TableRow = ({ children, className }) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className }) => <th className={`px-6 py-3 text-left text-xs font-medium text-kala-300 uppercase tracking-wider ${className || ''}`}>{children}</th>;
const TableCell = ({ children, className }) => <td className={`px-6 py-4 whitespace-nowrap text-sm text-kala-300 ${className || ''}`}>{children}</td>;
const TableCaption = ({ children, className }) => <caption className={`px-6 py-4 whitespace-nowrap text-sm text-kala-500 ${className || ''}`}>{children}</caption>;

export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption
}
